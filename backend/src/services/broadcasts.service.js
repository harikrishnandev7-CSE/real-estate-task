import Broadcast from '../models/Broadcast.js';

export const getBroadcastsAdmin = async () => {
  return Broadcast.find()
    .sort({ createdAt: -1 })
    .lean();
};

export const createBroadcastAdmin = async (data) => {
  const { title, message, content, audience = 'All Users', channels = ['email', 'whatsapp'] } = data;

  const created = await Broadcast.create({
    title,
    message: message || content || '',
    audience,
    channels: channels || ['email'],
    openRate: '0%',
    status: 'Sent',
  });

  return created.toObject();
};

const broadcastsService = {
  getBroadcastsAdmin,
  createBroadcastAdmin,
};

export default broadcastsService;
