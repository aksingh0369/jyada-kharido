import React, { useState } from 'react';
import { Calendar, Clock, ArrowLeft, Share2, Tag, ChevronRight } from 'lucide-react';
import { Blog } from '../types';

interface BlogViewProps {
  blogs: Blog[];
  initialBlog?: Blog | null;
  onBack: () => void;
}

export const BlogView: React.FC<BlogViewProps> = ({ blogs, initialBlog, onBack }) => {
  const [activeBlog, setActiveBlog] = useState<Blog | null>(initialBlog || null);
  const [copied, setCopied] = useState(false);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // If viewing a single blog article
  if (activeBlog) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        
        {/* Navigation */}
        <button
          onClick={() => setActiveBlog(null)}
          className="inline-flex items-center gap-2 text-xs font-bold text-gray-600 hover:text-gray-950 bg-white border border-gray-200 px-4 py-2 rounded-full mb-6 cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>All Articles</span>
        </button>

        <article className="bg-white rounded-3xl p-6 sm:p-10 border border-gray-100 jk-card-shadow space-y-6">
          
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-rose-50 text-[#F52D56] text-xs font-bold uppercase tracking-wider">
                {activeBlog.category}
              </span>
              <span className="text-xs text-gray-400 font-semibold">• {activeBlog.readTime}</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black text-gray-950 tracking-tight leading-tight">
              {activeBlog.title}
            </h1>

            <div className="flex items-center justify-between border-b border-gray-100 pb-4 pt-1">
              <div className="flex items-center gap-3 text-xs text-gray-500 font-medium">
                <span>By <strong>{activeBlog.author}</strong></span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {activeBlog.date}
                </span>
              </div>

              <button
                onClick={handleShare}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-600 hover:text-black border border-gray-200 rounded-full px-3 py-1 cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>{copied ? 'Copied' : 'Share'}</span>
              </button>
            </div>
          </div>

          {/* Hero Image */}
          <div className="aspect-[16/9] rounded-2xl overflow-hidden bg-gray-100">
            <img
              src={activeBlog.image}
              alt={activeBlog.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Body Content */}
          <div className="prose prose-sm sm:prose-base max-w-none text-gray-700 leading-relaxed space-y-4 pt-2">
            <p className="text-base sm:text-lg font-medium text-gray-800 leading-relaxed">
              {activeBlog.excerpt}
            </p>
            <div className="whitespace-pre-line text-sm sm:text-base text-gray-600 leading-relaxed">
              {activeBlog.content}
            </div>
          </div>

          {/* Disclaimer */}
          <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 text-[11px] text-gray-500">
            <strong>Editorial Transparency:</strong> Products reviewed or mentioned in this article contain Amazon affiliate links. If you make a purchase through them, we may receive a commission at no additional cost to you.
          </div>

        </article>
      </div>
    );
  }

  // Blog Directory
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
        <span className="text-xs font-extrabold uppercase tracking-widest text-[#F52D56] bg-rose-50 px-3 py-1 rounded-full">
          The Jyada Kharido Journal
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-gray-950 uppercase tracking-tight">
          Buying Guides & Tech Trends
        </h1>
        <p className="text-xs sm:text-sm text-gray-500">
          In-depth gadget advice, audio comparisons, and tips on securing the lowest prices on Amazon.
        </p>
      </div>

      {/* Grid of Articles */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {blogs.map((blog) => (
          <div
            key={blog.id}
            onClick={() => setActiveBlog(blog)}
            className="group bg-white rounded-3xl overflow-hidden border border-gray-100 jk-card-shadow jk-card-hover cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="aspect-[16/10] overflow-hidden bg-gray-100 relative">
                <img
                  src={blog.image}
                  alt={blog.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-white/95 backdrop-blur-sm text-[10px] font-bold text-gray-800 uppercase tracking-wider">
                  {blog.category}
                </span>
              </div>

              <div className="p-6 space-y-2.5">
                <div className="flex items-center gap-3 text-[11px] font-semibold text-gray-400">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {blog.date}
                  </span>
                  <span>•</span>
                  <span>{blog.readTime}</span>
                </div>

                <h3 className="text-lg font-bold text-gray-900 leading-snug group-hover:text-[#EB3B5A] transition-colors">
                  {blog.title}
                </h3>

                <p className="text-xs text-gray-500 leading-relaxed line-clamp-3">
                  {blog.excerpt}
                </p>
              </div>
            </div>

            <div className="px-6 pb-6 pt-2">
              <span className="text-xs font-bold text-[#EB3B5A] inline-flex items-center gap-1 group-hover:underline">
                <span>Read Full Article</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
