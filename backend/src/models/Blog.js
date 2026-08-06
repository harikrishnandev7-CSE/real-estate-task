import mongoose from 'mongoose';

const blogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true, trim: true },
    category: { type: String, default: 'General' },
    author: { type: String, default: 'Imperia Editorial' },
    date: { type: String, default: null },
    readTime: { type: String, default: '5 min read' },
    imageUrl: { type: String, default: null },
    excerpt: { type: String, default: null },
    body: { type: String, required: true },
    featured: { type: Boolean, default: false },
    status: { type: String, default: 'Published' }, // Published / Draft / Scheduled
    metaTitle: { type: String, default: null },
    metaDesc: { type: String, default: null },
    views: { type: Number, default: 0 },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

export const Blog = mongoose.models.Blog || mongoose.model('Blog', blogSchema);
export default Blog;
