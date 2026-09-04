import React from 'react';
import { ArrowRight, Calendar, Clock } from 'lucide-react';
import { Blog } from '../types';

interface BlogSectionProps {
  blogs: Blog[];
  onSelectBlog: (blog: Blog) => void;
}

export const BlogSection: React.FC<BlogSectionProps> = ({ blogs, onSelectBlog }) => {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12" id="recent-news-section">
      <div className="text-center max-w-2xl mx-auto mb-10">
        <h2 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight uppercase">
          Recent News
        </h2>
        <p className="text-xs sm:text-sm text-gray-500 font-medium mt-1">
          Buying guides, product comparisons, and technology insights from Jyada Kharido
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
        {blogs.slice(0, 3).map((blog) => (
          <article
            key={blog.id}
            onClick={() => onSelectBlog(blog)}
            className="group bg-white rounded-3xl overflow-hidden border border-gray-100 jk-card-shadow jk-card-hover cursor-pointer flex flex-col justify-between"
          >
            <div>
              {/* Cover image */}
              <div className="aspect-[16/10] overflow-hidden bg-gray-100 relative">
                <img
                  src={blog.image}
                  alt={blog.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-sm text-[10px] font-bold text-gray-800 uppercase tracking-wider shadow-xs">
                  {blog.category}
                </span>
              </div>

              {/* Text content */}
              <div className="p-6 space-y-2.5">
                <div className="flex items-center gap-3 text-[11px] font-semibold text-gray-400">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {blog.date}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {blog.readTime}
                  </span>
                </div>

                <h3 className="text-base sm:text-lg font-bold text-gray-900 leading-snug group-hover:text-[#EB3B5A] transition-colors line-clamp-2">
                  {blog.title}
                </h3>

                <p className="text-xs text-gray-500 leading-relaxed line-clamp-3">
                  {blog.excerpt}
                </p>
              </div>
            </div>

            <div className="px-6 pb-6 pt-2">
              <span className="text-xs font-bold text-[#EB3B5A] inline-flex items-center gap-1 group-hover:underline">
                <span>Read More</span>
                <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
              </span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};
