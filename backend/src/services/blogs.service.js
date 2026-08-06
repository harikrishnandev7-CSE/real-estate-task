import Blog from '../models/Blog.js';

export const getBlogs = async (query = {}) => {
  const { category, status = 'Published', featured } = query;
  const where = {};

  if (category) where.category = { $regex: new RegExp(`^${category}$`, 'i') };
  if (status && status !== 'all') where.status = { $regex: new RegExp(`^${status}$`, 'i') };
  if (featured !== undefined) where.featured = featured === 'true' || featured === true;

  const blogs = await Blog.find(where)
    .sort({ createdAt: -1 })
    .lean();

  return blogs.map(blog => ({
    ...blog,
    id: blog._id ? blog._id.toString() : blog.id,
    image: blog.imageUrl,
    summary: blog.excerpt,
    content: blog.body,
  }));
};

export const getBlogBySlug = async (slug) => {
  // Check by slug or id
  const isObjectId = slug.match(/^[0-9a-fA-F]{24}$/);
  const where = isObjectId ? { $or: [{ slug }, { _id: slug }] } : { slug };

  const blog = await Blog.findOne(where).lean();

  if (!blog) {
    const error = new Error(`Blog article with slug/id '${slug}' not found.`);
    error.statusCode = 404;
    error.code = 'BLOG_NOT_FOUND';
    throw error;
  }

  // Increment view count
  Blog.findByIdAndUpdate(blog._id, { $inc: { views: 1 } }).exec().catch(() => {});

  return {
    ...blog,
    id: blog._id ? blog._id.toString() : blog.id,
    image: blog.imageUrl,
    summary: blog.excerpt,
    content: blog.body,
  };
};

export const createBlog = async (data) => {
  const {
    title,
    slug,
    category,
    author,
    date,
    readTime,
    imageUrl,
    image,
    excerpt,
    summary,
    body,
    content,
    featured = false,
    status = 'Published',
    metaTitle,
    metaDesc,
  } = data;

  const generatedSlug = slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  const created = await Blog.create({
    title,
    slug: generatedSlug,
    category: category || 'General',
    author: author || 'Imperia Editorial',
    date: date || new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    readTime: readTime || '5 min read',
    imageUrl: imageUrl || image || null,
    excerpt: excerpt || summary || null,
    body: body || content || '',
    featured: Boolean(featured),
    status: status || 'Published',
    metaTitle: metaTitle || title,
    metaDesc: metaDesc || excerpt || summary || null,
  });

  return created.toObject();
};

export const updateBlog = async (id, data) => {
  const existing = await Blog.findById(id);
  if (!existing) {
    const error = new Error(`Blog article not found.`);
    error.statusCode = 404;
    error.code = 'BLOG_NOT_FOUND';
    throw error;
  }

  const updateData = {};
  if (data.title !== undefined) updateData.title = data.title;
  if (data.slug !== undefined) updateData.slug = data.slug;
  if (data.category !== undefined) updateData.category = data.category;
  if (data.author !== undefined) updateData.author = data.author;
  if (data.readTime !== undefined) updateData.readTime = data.readTime;
  if (data.imageUrl !== undefined || data.image !== undefined) updateData.imageUrl = data.imageUrl || data.image;
  if (data.excerpt !== undefined || data.summary !== undefined) updateData.excerpt = data.excerpt || data.summary;
  if (data.body !== undefined || data.content !== undefined) updateData.body = data.body || data.content;
  if (data.featured !== undefined) updateData.featured = Boolean(data.featured);
  if (data.status !== undefined) updateData.status = data.status;

  return Blog.findByIdAndUpdate(id, updateData, { new: true }).lean();
};

export const deleteBlog = async (id) => {
  const existing = await Blog.findById(id);
  if (!existing) {
    const error = new Error(`Blog article not found.`);
    error.statusCode = 404;
    error.code = 'BLOG_NOT_FOUND';
    throw error;
  }

  await Blog.findByIdAndDelete(id);
  return { id, message: 'Blog article deleted successfully.' };
};

const blogsService = {
  getBlogs,
  getBlogBySlug,
  createBlog,
  updateBlog,
  deleteBlog,
};

export default blogsService;
