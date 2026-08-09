/**
 * Unit tests for assignment.service.js
 *
 * These are pure unit tests — they mock Consultant and VisitAssignment models
 * so NO database connection is required.
 *
 * Tests:
 * 1. getWeekdayFromDateString — parses YYYY-MM-DD and DD/MM/YYYY correctly
 * 2. normaliseDateString — normalises DD/MM/YYYY to YYYY-MM-DD
 * 3. findAvailableConsultant:
 *    a. Capacity filtering — consultant at cap is excluded
 *    b. Working-day filtering — consultant not working that day is excluded
 *    c. Random selection only from eligible set
 *    d. Empty-set fallback returns null
 * 4. assignVisit — calls findAvailableConsultant and creates VisitAssignment
 */

import { jest } from '@jest/globals';

// ─── Mock Mongoose models BEFORE importing the service ──────────────────────
// We must mock at module level because ES module mocks are hoisted.

const mockConsultantFind = jest.fn();
const mockVisitAssignmentAggregate = jest.fn();
const mockVisitAssignmentCreate = jest.fn();

jest.unstable_mockModule('../src/models/Consultant.js', () => ({
  default: {
    find: mockConsultantFind,
  },
}));

jest.unstable_mockModule('../src/models/VisitAssignment.js', () => ({
  default: {
    aggregate: mockVisitAssignmentAggregate,
    create: mockVisitAssignmentCreate,
  },
}));

// Import AFTER mocks are registered
const {
  getWeekdayFromDateString,
  normaliseDateString,
  findAvailableConsultant,
  assignVisit,
} = await import('../src/services/assignment.service.js');

// ─── Helpers ────────────────────────────────────────────────────────────────

const makeConsultant = (overrides = {}) => ({
  _id: { toString: () => overrides.id || 'cons-001' },
  name: overrides.name || 'Test Consultant',
  phone: '+91 99000 00000',
  email: overrides.email || 'cons@test.com',
  city: overrides.city || 'Chennai',
  maxDailyVisits: overrides.maxDailyVisits ?? 5,
  workingDays: overrides.workingDays ?? [0, 1, 2, 3, 4, 5, 6],
  isActive: overrides.isActive ?? true,
});

// ─── Tests ──────────────────────────────────────────────────────────────────

describe('assignment.service — helper functions', () => {
  describe('getWeekdayFromDateString', () => {
    it('returns correct weekday for YYYY-MM-DD format', () => {
      // 2026-08-07 is a Friday (weekday 5)
      expect(getWeekdayFromDateString('2026-08-07')).toBe(5);
    });

    it('returns correct weekday for DD/MM/YYYY format', () => {
      // 07/08/2026 = 2026-08-07 = Friday = 5
      expect(getWeekdayFromDateString('07/08/2026')).toBe(5);
    });

    it('returns -1 for invalid date string', () => {
      expect(getWeekdayFromDateString('not-a-date')).toBe(-1);
    });

    it('returns -1 for null/undefined', () => {
      expect(getWeekdayFromDateString(null)).toBe(-1);
      expect(getWeekdayFromDateString(undefined)).toBe(-1);
    });
  });

  describe('normaliseDateString', () => {
    it('converts DD/MM/YYYY to YYYY-MM-DD', () => {
      expect(normaliseDateString('07/08/2026')).toBe('2026-08-07');
    });

    it('passes YYYY-MM-DD through unchanged', () => {
      expect(normaliseDateString('2026-08-07')).toBe('2026-08-07');
    });

    it('returns undefined for undefined input', () => {
      expect(normaliseDateString(undefined)).toBeUndefined();
    });
  });
});

describe('assignment.service — findAvailableConsultant', () => {
  beforeEach(() => {
    mockConsultantFind.mockReset();
    mockVisitAssignmentAggregate.mockReset();
  });

  it('returns null when no consultants exist in the city', async () => {
    mockConsultantFind.mockReturnValue({ lean: () => Promise.resolve([]) });

    const result = await findAvailableConsultant('Chennai', '2026-08-07');
    expect(result).toBeNull();
  });

  it('returns null when city is not provided', async () => {
    const result = await findAvailableConsultant(null, '2026-08-07');
    expect(result).toBeNull();
  });

  it('returns null when date is invalid', async () => {
    const result = await findAvailableConsultant('Chennai', 'not-a-date');
    expect(result).toBeNull();
  });

  it('[CAPACITY] excludes consultant who has reached their daily cap', async () => {
    const cons = makeConsultant({ id: 'cons-001', maxDailyVisits: 5 });
    mockConsultantFind.mockReturnValue({ lean: () => Promise.resolve([cons]) });

    // Aggregate says this consultant already has 5 assignments = at cap
    mockVisitAssignmentAggregate.mockResolvedValue([
      { _id: cons._id, count: 5 },
    ]);

    const result = await findAvailableConsultant('Chennai', '2026-08-07');
    expect(result).toBeNull();
  });

  it('[CAPACITY] includes consultant who is below their daily cap', async () => {
    const cons = makeConsultant({ id: 'cons-001', maxDailyVisits: 5 });
    mockConsultantFind.mockReturnValue({ lean: () => Promise.resolve([cons]) });

    // Aggregate says only 3 assignments → eligible (3 < 5)
    mockVisitAssignmentAggregate.mockResolvedValue([
      { _id: cons._id, count: 3 },
    ]);

    const result = await findAvailableConsultant('Chennai', '2026-08-07');
    expect(result).not.toBeNull();
    expect(result._id.toString()).toBe('cons-001');
  });

  it('[CAPACITY] includes consultant with zero assignments (no row in aggregate)', async () => {
    const cons = makeConsultant({ id: 'cons-002', maxDailyVisits: 5 });
    mockConsultantFind.mockReturnValue({ lean: () => Promise.resolve([cons]) });

    // No aggregate row means 0 bookings for this consultant
    mockVisitAssignmentAggregate.mockResolvedValue([]);

    const result = await findAvailableConsultant('Chennai', '2026-08-07');
    expect(result).not.toBeNull();
    expect(result._id.toString()).toBe('cons-002');
  });

  it('[WORKING-DAY] Mongoose query already filters by workingDay — model correctly passes weekday', async () => {
    // 2026-08-07 is Friday = weekday 5.
    // The Consultant.find call should include workingDays: 5 in the query.
    // We verify the query parameters via the mock call argument.
    mockConsultantFind.mockReturnValue({ lean: () => Promise.resolve([]) });
    mockVisitAssignmentAggregate.mockResolvedValue([]);

    await findAvailableConsultant('Chennai', '2026-08-07');

    const findCallArg = mockConsultantFind.mock.calls[0][0];
    // Should query for weekday 5 (Friday)
    expect(findCallArg.workingDays).toBe(5);
    // Should query for the correct city using Mongoose $regex operator
    // Service produces: { city: { $regex: /^Chennai$/i } }
    expect(findCallArg.city).toHaveProperty('$regex');
    expect(findCallArg.city.$regex.test('Chennai')).toBe(true);
    expect(findCallArg.city.$regex.test('CHENNAI')).toBe(true);
    // Should only look at active consultants
    expect(findCallArg.isActive).toBe(true);
  });

  it('[LEAST-LOADED] selects consultant with the fewest bookings on that date', async () => {
    const consBusy = makeConsultant({ id: 'cons-busy', maxDailyVisits: 5 });
    const consFree = makeConsultant({ id: 'cons-free', maxDailyVisits: 5 });

    mockConsultantFind.mockReturnValue({
      lean: () => Promise.resolve([consBusy, consFree]),
    });

    // consBusy has 3 visits, consFree has 1 visit
    mockVisitAssignmentAggregate.mockResolvedValue([
      { _id: consBusy._id, count: 3 },
      { _id: consFree._id, count: 1 },
    ]);

    const result = await findAvailableConsultant('Chennai', '2026-08-07');
    expect(result).not.toBeNull();
    expect(result._id.toString()).toBe('cons-free');
  });

  it('[TIE-BREAKING] randomly selects among consultants tied for least load', async () => {
    const consA = makeConsultant({ id: 'cons-A', maxDailyVisits: 5 });
    const consB = makeConsultant({ id: 'cons-B', maxDailyVisits: 5 });
    const consC = makeConsultant({ id: 'cons-C', maxDailyVisits: 5 });

    mockConsultantFind.mockReturnValue({
      lean: () => Promise.resolve([consA, consB, consC]),
    });

    // consC has 4 assignments (heavy). consA and consB have 1 assignment each (tied for minimum count: 1).
    mockVisitAssignmentAggregate.mockResolvedValue([
      { _id: consA._id, count: 1 },
      { _id: consB._id, count: 1 },
      { _id: consC._id, count: 4 },
    ]);

    // Run many times to verify consC is never selected because consA and consB have lower load
    const selectedIds = new Set();
    for (let i = 0; i < 100; i++) {
      const result = await findAvailableConsultant('Chennai', '2026-08-07');
      if (result) selectedIds.add(result._id.toString());
    }

    expect(selectedIds.has('cons-C')).toBe(false);
    expect(selectedIds.has('cons-A')).toBe(true);
    expect(selectedIds.has('cons-B')).toBe(true);
  });

  it('[EMPTY-SET FALLBACK] returns null when all consultants are at cap', async () => {
    const consA = makeConsultant({ id: 'cons-A', maxDailyVisits: 3 });
    const consB = makeConsultant({ id: 'cons-B', maxDailyVisits: 3 });

    mockConsultantFind.mockReturnValue({
      lean: () => Promise.resolve([consA, consB]),
    });

    // Both at cap
    mockVisitAssignmentAggregate.mockResolvedValue([
      { _id: consA._id, count: 3 },
      { _id: consB._id, count: 3 },
    ]);

    const result = await findAvailableConsultant('Chennai', '2026-08-07');
    expect(result).toBeNull();
  });
});

describe('assignment.service — assignVisit', () => {
  beforeEach(() => {
    mockConsultantFind.mockReset();
    mockVisitAssignmentAggregate.mockReset();
    mockVisitAssignmentCreate.mockReset();
  });

  it('returns null assignment and null consultant when no one is available', async () => {
    mockConsultantFind.mockReturnValue({ lean: () => Promise.resolve([]) });
    mockVisitAssignmentAggregate.mockResolvedValue([]);

    const result = await assignVisit('booking-001', 'Chennai', '2026-08-07');

    expect(result.assignment).toBeNull();
    expect(result.consultant).toBeNull();
    expect(mockVisitAssignmentCreate).not.toHaveBeenCalled();
  });

  it('creates a VisitAssignment and returns assignment + consultant when one is available', async () => {
    const cons = makeConsultant({ id: 'cons-001' });
    mockConsultantFind.mockReturnValue({ lean: () => Promise.resolve([cons]) });
    mockVisitAssignmentAggregate.mockResolvedValue([]);

    const fakeAssignment = { _id: 'assign-001', visitRequest: 'booking-001', consultant: 'cons-001' };
    mockVisitAssignmentCreate.mockResolvedValue(fakeAssignment);

    const result = await assignVisit('booking-001', 'Chennai', '2026-08-07');

    expect(result.assignment).toEqual(fakeAssignment);
    expect(result.consultant).not.toBeNull();
    expect(result.consultant._id.toString()).toBe('cons-001');

    expect(mockVisitAssignmentCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        visitRequest: 'booking-001',
        date: '2026-08-07',
        status: 'Assigned',
        assignedBy: 'system',
      })
    );
  });

  it('normalises DD/MM/YYYY date before storing', async () => {
    const cons = makeConsultant({ id: 'cons-001' });
    mockConsultantFind.mockReturnValue({ lean: () => Promise.resolve([cons]) });
    mockVisitAssignmentAggregate.mockResolvedValue([]);
    mockVisitAssignmentCreate.mockResolvedValue({});

    await assignVisit('booking-001', 'Chennai', '07/08/2026');

    const createArg = mockVisitAssignmentCreate.mock.calls[0][0];
    expect(createArg.date).toBe('2026-08-07');
  });
});
