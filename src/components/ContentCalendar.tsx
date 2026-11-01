import React, { useState } from 'react';
import { PostItem, BrandKit, Platform } from '../types';
import { PlatformIcon } from './PlatformIcon';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  Eye,
  SlidersHorizontal,
  Plus,
  Layers,
} from 'lucide-react';
import { schedulePostToGoogleCalendar } from '../services/calendarService';

interface ContentCalendarProps {
  posts: PostItem[];
  brandKit: BrandKit;
  onSelectPost: (post: PostItem) => void;
  onNewPost: () => void;
  onPostUpdated: (updated: PostItem) => void;
}

export const ContentCalendar: React.FC<ContentCalendarProps> = ({
  posts,
  brandKit,
  onSelectPost,
  onNewPost,
  onPostUpdated,
}) => {
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'list'>('month');
  const [filterPlatform, setFilterPlatform] = useState<string>('all');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [syncStatus, setSyncStatus] = useState<string | null>(null);

  // Month navigation
  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };
  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayIndex = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

  const monthName = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });

  const filteredPosts = posts.filter((p) => {
    if (filterPlatform !== 'all' && p.platform !== filterPlatform) return false;
    return true;
  });

  const getPlatformIcon = (platform: Platform) => {
    return <PlatformIcon platform={platform} className="w-3 h-3" />;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'published':
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'scheduled':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'needs_review':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      default:
        return 'bg-slate-800 text-slate-400 border-slate-700';
    }
  };

  // Sync to Google Calendar
  const handleSyncToGoogleCalendar = async (post: PostItem) => {
    setSyncStatus(`Syncing "${post.title}" to Google Calendar...`);
    try {
      const scheduledTime = post.scheduledTime || new Date(Date.now() + 3600 * 1000).toISOString();
      const res = await schedulePostToGoogleCalendar(post, scheduledTime);
      if (res.success) {
        onPostUpdated({
          ...post,
          status: 'scheduled',
          scheduledTime,
          calendarEventId: res.eventId,
        });
        setSyncStatus(`Successfully synced to Google Calendar (Event ID: ${res.eventId.slice(0, 12)}...)`);
        setTimeout(() => setSyncStatus(null), 4000);
      }
    } catch (e: any) {
      setSyncStatus(`Sync failed: ${e.message}`);
    }
  };

  return (
    <div className="space-y-5">
      {/* Calendar Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              onClick={prevMonth}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs md:text-sm font-bold text-white px-3 font-mono">{monthName}</span>
            <button
              onClick={nextMonth}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Sync indicator */}
          {syncStatus && (
            <div className="text-[11px] font-mono px-3 py-1 rounded-lg bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 animate-fade-in flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{syncStatus}</span>
            </div>
          )}
        </div>

        {/* Platform Filter & View Modes */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Platform Filter */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
            {['all', 'facebook', 'instagram', 'linkedin', 'twitter', 'tiktok', 'whatsapp'].map((plat) => (
              <button
                key={plat}
                onClick={() => setFilterPlatform(plat)}
                className={`px-2.5 py-1 rounded-lg capitalize transition-colors ${
                  filterPlatform === plat
                    ? 'bg-emerald-500 text-slate-950 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {plat}
              </button>
            ))}
          </div>

          {/* View Mode */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
            {(['month', 'list'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`px-3 py-1 rounded-lg capitalize transition-colors ${
                  viewMode === mode
                    ? 'bg-slate-800 text-emerald-300 font-semibold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>

          <button
            onClick={onNewPost}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 text-xs font-bold shadow-md shadow-emerald-500/20 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Schedule Post</span>
          </button>
        </div>
      </div>

      {/* Month View Grid */}
      {viewMode === 'month' && (
        <div className="bg-slate-900/60 rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
          {/* Day of Week Headers */}
          <div className="grid grid-cols-7 border-b border-slate-800 bg-slate-950/80 text-center py-2.5 text-xs font-bold uppercase tracking-wider text-slate-400">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
              <div key={d}>{d}</div>
            ))}
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 auto-rows-fr divide-x divide-y divide-slate-800/60 bg-slate-900/30">
            {/* Empty slots for starting offset */}
            {Array.from({ length: firstDayIndex }).map((_, i) => (
              <div key={`empty-${i}`} className="min-h-[110px] p-2 bg-slate-950/30" />
            ))}

            {/* Days in Month */}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const dayNum = i + 1;
              const isToday =
                new Date().getDate() === dayNum &&
                new Date().getMonth() === currentDate.getMonth() &&
                new Date().getFullYear() === currentDate.getFullYear();

              // Match posts for this day
              const dayPosts = filteredPosts.filter((p) => {
                const dateToTest = p.scheduledTime || p.publishedAt || p.createdAt;
                if (!dateToTest) return false;
                const d = new Date(dateToTest);
                return (
                  d.getDate() === dayNum &&
                  d.getMonth() === currentDate.getMonth() &&
                  d.getFullYear() === currentDate.getFullYear()
                );
              });

              return (
                <div
                  key={`day-${dayNum}`}
                  className={`min-h-[110px] p-2 flex flex-col justify-between transition-colors ${
                    isToday ? 'bg-emerald-950/15' : 'hover:bg-slate-800/30'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span
                      className={`text-xs font-mono font-bold w-6 h-6 flex items-center justify-center rounded-full ${
                        isToday ? 'bg-emerald-400 text-slate-950' : 'text-slate-400'
                      }`}
                    >
                      {dayNum}
                    </span>
                    {dayPosts.length > 0 && (
                      <span className="text-[10px] font-mono text-emerald-400">
                        {dayPosts.length} post{dayPosts.length > 1 ? 's' : ''}
                      </span>
                    )}
                  </div>

                  {/* Day's Posts Pills */}
                  <div className="space-y-1.5 flex-1">
                    {dayPosts.map((p) => (
                      <div
                        key={p.id}
                        onClick={() => onSelectPost(p)}
                        className="group p-1.5 rounded-lg bg-slate-950/90 border border-slate-800 hover:border-emerald-500/50 cursor-pointer transition-all text-[11px]"
                      >
                        <div className="flex items-center justify-between gap-1 mb-0.5">
                          <span className="flex items-center gap-1 font-semibold text-slate-300 truncate">
                            {getPlatformIcon(p.platform)}
                            <span className="truncate">{p.headline || p.title}</span>
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-[9px] text-slate-500 font-mono">
                          <span className={`px-1 rounded border uppercase ${getStatusBadge(p.status)}`}>
                            {p.status.replace('_', ' ')}
                          </span>
                          {p.calendarEventId && <span className="text-emerald-400 font-bold">GCal &#10003;</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* List View */}
      {viewMode === 'list' && (
        <div className="bg-slate-900/60 rounded-2xl border border-slate-800 overflow-hidden divide-y divide-slate-800">
          {filteredPosts.length === 0 ? (
            <div className="p-8 text-center text-slate-500 text-xs">
              No content matches the selected filter.
            </div>
          ) : (
            filteredPosts.map((p) => (
              <div
                key={p.id}
                className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-800/30 transition-colors"
              >
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center shrink-0">
                    {getPlatformIcon(p.platform)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-white">{p.headline || p.title}</h4>
                      <span className={`text-[10px] px-2 py-0.5 rounded border uppercase font-mono ${getStatusBadge(p.status)}`}>
                        {p.status.replace('_', ' ')}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 line-clamp-1 mt-1 max-w-xl">
                      {p.hook || p.caption}
                    </p>
                    <div className="flex items-center gap-3 mt-1.5 text-[11px] text-slate-500 font-mono">
                      <span>Pillar: {p.pillar}</span>
                      <span>&bull;</span>
                      <span>Type: {p.contentType}</span>
                      {p.scheduledTime && (
                        <>
                          <span>&bull;</span>
                          <span className="text-emerald-400 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {new Date(p.scheduledTime).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end md:self-center">
                  <button
                    onClick={() => handleSyncToGoogleCalendar(p)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-300 bg-slate-950 hover:bg-slate-800 border border-slate-800"
                  >
                    <CalendarIcon className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Sync GCal</span>
                  </button>
                  <button
                    onClick={() => onSelectPost(p)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 shadow-sm"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Review & Edit</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};
