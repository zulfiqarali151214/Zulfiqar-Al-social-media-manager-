import React, { useState } from 'react';
import { PostItem, ContentType, Platform } from '../types';
import { PlatformIcon } from './PlatformIcon';
import {
  Search,
  Filter,
  Eye,
  Trash2,
  Copy,
  Calendar,
  Layers,
  Clock,
  CheckCircle2,
} from 'lucide-react';

interface ContentLibraryProps {
  posts: PostItem[];
  onSelectPost: (post: PostItem) => void;
  onDeletePost: (id: string) => void;
  onDuplicatePost: (post: PostItem) => void;
}

export const ContentLibrary: React.FC<ContentLibraryProps> = ({
  posts,
  onSelectPost,
  onDeletePost,
  onDuplicatePost,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const filtered = posts.filter((p) => {
    if (filterType !== 'all' && p.contentType !== filterType) return false;
    if (filterStatus !== 'all' && p.status !== filterStatus) return false;
    if (
      searchTerm &&
      !p.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !p.caption.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !p.hook.toLowerCase().includes(searchTerm.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  const getPlatformIcon = (platform: Platform) => {
    return <PlatformIcon platform={platform} className="w-3.5 h-3.5" />;
  };

  return (
    <div className="space-y-5">
      {/* Top Search & Filter Bar */}
      <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-2 bg-slate-950 px-3 py-2 rounded-xl border border-slate-800 flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-500" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search saved content, hooks, captions, or tags..."
            className="w-full bg-transparent text-xs text-white placeholder-slate-500 focus:outline-none"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Content Type Filter */}
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300"
          >
            <option value="all">All Content Types</option>
            <option value="carousel">Carousels</option>
            <option value="quote">Quotes</option>
            <option value="single_image">Single Image</option>
            <option value="tips">Tips & Checklists</option>
            <option value="case_study">Case Studies</option>
          </select>

          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300"
          >
            <option value="all">All Statuses</option>
            <option value="needs_review">Needs Review</option>
            <option value="scheduled">Scheduled</option>
            <option value="published">Published</option>
            <option value="draft">Drafts</option>
          </select>
        </div>
      </div>

      {/* Grid of Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((post) => (
          <div
            key={post.id}
            className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between hover:border-slate-700 transition-all shadow-lg space-y-4"
          >
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-300">
                  {getPlatformIcon(post.platform)}
                  <span className="capitalize">{post.platform}</span>
                </div>
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded border border-slate-800 bg-slate-950 text-slate-400">
                  {post.status.replace('_', ' ')}
                </span>
              </div>

              <h4 className="text-sm font-bold text-white line-clamp-1">{post.headline || post.title}</h4>
              <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed font-sans">{post.hook || post.caption}</p>
            </div>

            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
              <span className="text-[10px] font-mono text-emerald-400 uppercase">
                {post.contentType.replace('_', ' ')}
              </span>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => onDuplicatePost(post)}
                  title="Duplicate Post"
                  className="p-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => onDeletePost(post.id)}
                  title="Delete"
                  className="p-1.5 rounded-lg bg-slate-950 hover:bg-rose-950/40 text-slate-400 hover:text-rose-400 border border-slate-800"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => onSelectPost(post)}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-400 hover:bg-emerald-300 text-slate-950 text-xs font-bold shadow-sm"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Review</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
