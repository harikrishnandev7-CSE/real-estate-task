import Project from '../models/Project.js';
import Property from '../models/Property.js';

/**
 * FEATURE 1: AUTO PROJECT CREATION SERVICE LOGIC
 * When admin adds/updates a property:
 * 1. Normalize developer name (trim & lowercase)
 * 2. Check in "projects" collection:
 *    - IF project with same normalized developer EXISTS:
 *         Push propertyId into "properties" array
 *         Increment totalProperties
 *    - ELSE:
 *         Create new project document
 * 3. Save projectId inside property document
 * 
 * @param {Object} property - Saved Property document instance or object
 * @returns {Promise<Object>} Updated property and associated project
 */
export async function handleProjectCreation(property) {
  const rawDeveloper = property.developer || property.builder || 'IMPERIA Developers';
  const developerNormalized = String(rawDeveloper).trim().toLowerCase();

  let project = await Project.findOne({ developer: developerNormalized });

  const propId = property._id || property.id;

  if (project) {
    // Prevent duplicate property IDs
    const propIdStr = String(propId);
    const isExistingProp = Array.isArray(project.properties) && project.properties.some(p => String(p) === propIdStr);
    
    if (!isExistingProp) {
      project.properties.push(propId);
      project.totalProperties = (project.totalProperties || project.properties.length - 1) + 1;
      await project.save();
    }
  } else {
    project = await Project.create({
      name: rawDeveloper,
      developer: developerNormalized,
      city: property.city || 'Chennai',
      properties: [propId],
      totalProperties: 1,
      createdAt: new Date()
    });
  }

  // Update property document with projectId and developer
  await Property.findByIdAndUpdate(propId, {
    projectId: project._id,
    developer: rawDeveloper
  });

  property.projectId = project._id;
  property.developer = rawDeveloper;

  return { property, project };
}

export const getProjects = async (query = {}) => {
  const rawProjects = await Project.find(query).sort({ createdAt: -1 }).lean();

  const projectsWithDetails = await Promise.all(rawProjects.map(async (proj) => {
    let propList = [];
    if (Array.isArray(proj.properties) && proj.properties.length > 0) {
      const dbProps = await Property.find({ _id: { $in: proj.properties } }).lean();
      propList = dbProps;
    }
    const mainProp = propList[0] || {};
    return {
      ...proj,
      id: proj._id ? proj._id.toString() : proj.id,
      name: proj.name || 'IMPERIA Signature Project',
      builder: proj.name || 'IMPERIA Developers',
      developer: proj.developer || 'imperia developers',
      location: proj.city ? `${proj.city}, India` : (mainProp.location || 'Chennai, India'),
      city: proj.city || mainProp.city || 'Chennai',
      image: mainProp.imageUrl || mainProp.image || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
      totalProperties: proj.totalProperties || proj.properties?.length || propList.length || 1,
      timeline: 'Active Development',
      progress: Math.min(100, Math.max(30, (proj.totalProperties || 1) * 25)),
      desc: mainProp.description || mainProp.desc || `Curated landmark development by ${proj.name || 'IMPERIA Developers'} featuring luxury residences and commercial assets.`,
      milestones: [
        { label: "Excavation & Foundations", status: "completed" },
        { label: "Superstructure Structure", status: "completed" },
        { label: "Exterior Masonry & Glassing", status: "in-progress" },
        { label: "Interior Fitouts & Commissioning", status: "in-progress" },
        { label: "Possession Handover", status: "pending" }
      ],
      propertyList: propList
    };
  }));

  return projectsWithDetails;
};

export const getProjectById = async (id) => {
  const proj = await Project.findById(id).lean();
  if (!proj) return null;
  const dbProps = await Property.find({ _id: { $in: proj.properties || [] } }).lean();
  return { ...proj, propertyList: dbProps };
};

export default {
  handleProjectCreation,
  getProjects,
  getProjectById
};
