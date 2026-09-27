import React, { useState } from 'react';
import { PostItem, BrandKit, SocialAccount } from './types';
import { DEFAULT_BRAND_KIT, INITIAL_POSTS, INITIAL_SOCIAL_ACCOUNTS } from './mockData';
import { AIAgentChat } from './components/AIAgentChat';
import { ContentCalendar } from './components/ContentCalendar';
import { CreatePostStudio } from './components/CreatePostStudio';
import { PostEditorModal } from './components/PostEditorModal';
import { AnalyticsDashboard } from './components/AnalyticsDashboard';
import { SocialAccountsManager } from './components/SocialAccountsManager';
import { BrandKitManager } from './components/BrandKitManager';
import { ContentLibrary } from './components/ContentLibrary';
import { OnboardingWizard } from './components/OnboardingWizard';
import { GraphicCanvas } from './components/GraphicCanvas';
import { LeadFormModal } from './components/LeadFormModal';
import {
  LayoutDashboard,
  Bot,
  Calendar,
  PenTool,
  FolderKanban,
  BarChart3,
  Share2,
  Sliders,
  Sparkles,
  Layers,
  CheckCircle2,
  Clock,
  Plus,
  Send,
  Eye,
  ShieldCheck,
  ChevronRight,
  TrendingUp,
  AlertCircle,
  Menu,
  X,
  LogOut,
} from 'lucide-react';
import { schedulePostToGoogleCalendar } from './services/calendarService';
import { useAuth } from './context/AuthContext';
import { AuthScreen } from './components/AuthScreen';

type NavigationTab =
  | 'dashboard'
  | 'agent'
  | 'create'
  | 'calendar'
  | 'library'
  | 'analytics'
  | 'social'
  | 'brand_kit';

export default function App() {
  const { currentUser, loading: authLoading, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<NavigationTab>('dashboard');
  const [brandKit, setBrandKit] = useState<BrandKit>(DEFAULT_BRAND_KIT);
  const [posts, setPosts] = useState<PostItem[]>(INITIAL_POSTS);
  const [socialAccounts, setSocialAccounts] = useState<SocialAccount[]>(INITIAL_SOCIAL_ACCOUNTS);
  const [selectedPost, setSelectedPost] = useState<PostItem | null>(null);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showLeadModal, setShowLeadModal] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleSignOut = async () => {
    try {
      await logout();
      showToast('Signed out successfully');
    } catch (err) {
      showToast('Failed to sign out');
    }
  };

  // Handlers for posts
  const handlePostCreated = (newPostOrPosts: PostItem | PostItem[]) => {
    if (Array.isArray(newPostOrPosts)) {
      setPosts((prev) => [...newPostOrPosts, ...prev]);
      showToast(`Added ${newPostOrPosts.length} posts to Review Queue`);
    } else {
      setPosts((prev) => [newPostOrPosts, ...prev]);
      showToast(`Created "${newPostOrPosts.title}"`);
    }
  };

  const handleUpdatePost = (updated: PostItem) => {
    setPosts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    if (selectedPost?.id === updated.id) {
      setSelectedPost(updated);
    }
    showToast(`Updated "${updated.title}"`);
  };

  const handleApprovePost = (post: PostItem) => {
    const updated = { ...post, status: 'approved' as const };
    handleUpdatePost(updated);
    setSelectedPost(null);
    showToast(`Approved "${post.title}"`);
  };

  const handlePublishPost = (post: PostItem) => {
    const updated = {
      ...post,
      status: 'published' as const,
      publishedAt: new Date().toISOString(),
    };
    handleUpdatePost(updated);
    setSelectedPost(null);
    showToast(`Published to ${post.platform.toUpperCase()} & Live!`);
  };

  const handleSchedulePost = async (post: PostItem, dateIso: string) => {
    const updated = {
      ...post,
      status: 'scheduled' as const,
      scheduledTime: dateIso,
    };
    handleUpdatePost(updated);
    setSelectedPost(null);

    // Call calendar sync
    showToast(`Scheduling to Google Calendar...`);
    try {
      const res = await schedulePostToGoogleCalendar(updated, dateIso);
      if (res.success) {
        showToast(`Scheduled & Synced with Google Calendar!`);
      }
    } catch (e) {
      showToast(`Scheduled locally (Calendar sync queued)`);
    }
  };

  const handleDeletePost = (id: string) => {
    setPosts((prev) => prev.filter((p) => p.id !== id));
    showToast('Post removed from library');
  };

  const handleDuplicatePost = (post: PostItem) => {
    const dupe: PostItem = {
      ...post,
      id: 'post-' + Date.now(),
      title: `${post.title} (Copy)`,
      status: 'draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setPosts((prev) => [dupe, ...prev]);
    showToast('Post duplicated');
  };

  const handleToggleConnection = (id: string) => {
    setSocialAccounts((prev) =>
      prev.map((acc) => (acc.id === id ? { ...acc, connected: !acc.connected } : acc))
    );
  };

  const scheduledCount = posts.filter((p) => p.status === 'scheduled').length;
  const needsReviewCount = posts.filter((p) => p.status === 'needs_review').length;
  const publishedCount = posts.filter((p) => p.status === 'published').length;

  if (authLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-950 text-slate-100">
        <div className="relative flex items-center justify-center mb-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-slate-950 shadow-2xl shadow-emerald-500/30 animate-pulse">
            <Sparkles className="w-8 h-8 text-slate-950" />
          </div>
        </div>
        <h2 className="text-lg font-bold text-white tracking-tight">Zulfiqar AI</h2>
        <p className="text-xs text-emerald-400 font-mono mt-1">Authenticating session...</p>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <>
        {toastMessage && (
          <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 border border-emerald-500/50 text-emerald-300 text-xs font-semibold shadow-2xl animate-bounce">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{toastMessage}</span>
          </div>
        )}
        <AuthScreen onSuccess={() => showToast('Signed in successfully!')} />
      </>
    );
  }

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 font-sans overflow-hidden">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 border border-emerald-500/50 text-emerald-300 text-xs font-semibold shadow-2xl animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Onboarding Wizard Modal */}
      {showOnboarding && (
        <OnboardingWizard
          initialBrandKit={brandKit}
          onComplete={(updated) => {
            setBrandKit(updated);
            setShowOnboarding(false);
            showToast('Brand Kit successfully updated & locked in!');
          }}
          onCancel={() => setShowOnboarding(false)}
        />
      )}

      {/* Post Editor Modal */}
      {selectedPost && (
        <PostEditorModal
          post={selectedPost}
          brandKit={brandKit}
          onSave={handleUpdatePost}
          onApprove={handleApprovePost}
          onPublish={handlePublishPost}
          onSchedule={handleSchedulePost}
          onClose={() => setSelectedPost(null)}
        />
      )}

      {/* Lead Generation Form Modal */}
      <LeadFormModal
        isOpen={showLeadModal}
        onClose={() => setShowLeadModal(false)}
        onSubmitSuccess={(lead) => {
          showToast(`Lead received for ${lead.name}! Our team will get in touch.`);
        }}
      />

      {/* Sidebar Navigation (Desktop) */}
      <aside className="hidden md:flex flex-col w-64 bg-slate-900/90 border-r border-slate-800/80 p-4 justify-between shrink-0">
        <div className="space-y-6">
          {/* Logo & Platform Name */}
          <div className="flex items-center gap-3 px-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-emerald-500/20">
              <Sparkles className="w-5 h-5 text-slate-950" />
            </div>
            <div>
              <h1 className="font-extrabold text-sm tracking-tight text-white leading-tight">
                Zulfiqar AI
              </h1>
              <span className="text-[10px] uppercase font-mono tracking-wider text-emerald-400 font-semibold">
                Social Media Manager
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
              { id: 'agent', label: 'AI Agent Command', icon: Bot, badge: 'Smart' },
              { id: 'create', label: 'Create & Design', icon: PenTool },
              { id: 'calendar', label: 'Content Calendar', icon: Calendar, count: scheduledCount },
              { id: 'library', label: 'Content Library', icon: FolderKanban, count: posts.length },
              { id: 'analytics', label: 'Analytics & Insights', icon: BarChart3 },
              { id: 'social', label: 'Social Accounts', icon: Share2 },
              { id: 'brand_kit', label: 'Brand Kit', icon: Sliders },
            ].map((item) => {
              const Icon = item.icon;
              const active = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as NavigationTab)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    active
                      ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  {item.count !== undefined && item.count > 0 && (
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                        active ? 'bg-slate-950 text-emerald-300' : 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      {item.count}
                    </span>
                  )}
                  {item.badge && (
                    <span className="text-[9px] font-mono uppercase bg-emerald-950 text-emerald-300 border border-emerald-500/40 px-1.5 py-0.5 rounded">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Workspace Badge & Lead Button */}
        <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-white truncate max-w-[140px]">
              {brandKit.businessName}
            </span>
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          </div>
          <p className="text-[10px] text-slate-400 truncate">{brandKit.niche}</p>
          
          <button
            onClick={() => setShowLeadModal(true)}
            className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-[11px] font-bold shadow-md shadow-emerald-500/20 transition-all cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Get a Quote / Hire Us</span>
          </button>

          <button
            onClick={() => setShowOnboarding(true)}
            className="w-full text-center text-[10px] text-emerald-400 hover:text-emerald-300 font-semibold pt-1 border-t border-slate-800/80"
          >
            Launch Setup Wizard &rarr;
          </button>

          {/* User Profile & Sign Out (Desktop) */}
          {currentUser && (
            <div className="pt-2.5 mt-1 border-t border-slate-800/80 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                {currentUser.photoURL ? (
                  <img
                    src={currentUser.photoURL}
                    alt={currentUser.displayName || 'User'}
                    className="w-7 h-7 rounded-full object-cover border border-emerald-500/50 shrink-0"
                  />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-emerald-400 font-bold text-xs shrink-0">
                    {(currentUser.displayName || currentUser.email || 'U').charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="min-w-0">
                  <p className="text-[11px] font-semibold text-slate-200 truncate">
                    {currentUser.displayName || currentUser.email?.split('@')[0] || 'User'}
                  </p>
                  <p className="text-[9px] text-slate-500 truncate font-mono">
                    {currentUser.email}
                  </p>
                </div>
              </div>
              <button
                onClick={handleSignOut}
                title="Sign Out"
                className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-950/30 transition-all shrink-0 cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile Header */}
        <header className="md:hidden flex items-center justify-between p-4 bg-slate-900 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-500 flex items-center justify-center text-slate-950 font-bold">
              <Sparkles className="w-4 h-4" />
            </div>
            <span className="font-bold text-sm text-white">Zulfiqar AI</span>
          </div>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </header>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden p-4 bg-slate-900 border-b border-slate-800 space-y-2 z-40">
            {[
              { id: 'dashboard', label: 'Dashboard' },
              { id: 'agent', label: 'AI Agent' },
              { id: 'create', label: 'Create Post' },
              { id: 'calendar', label: 'Calendar' },
              { id: 'library', label: 'Library' },
              { id: 'analytics', label: 'Analytics' },
              { id: 'social', label: 'Social Accounts' },
              { id: 'brand_kit', label: 'Brand Kit' },
            ].map((m) => (
              <button
                key={m.id}
                onClick={() => {
                  setActiveTab(m.id as NavigationTab);
                  setMobileMenuOpen(false);
                }}
                className={`w-full text-left p-2 rounded-lg text-xs font-semibold ${
                  activeTab === m.id ? 'bg-emerald-500 text-slate-950' : 'text-slate-300'
                }`}
              >
                {m.label}
              </button>
            ))}

            {/* Mobile User Profile & Logout */}
            {currentUser && (
              <div className="pt-3 mt-2 border-t border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-6 h-6 rounded-full bg-slate-800 text-emerald-400 flex items-center justify-center text-xs font-bold shrink-0">
                    {(currentUser.displayName || currentUser.email || 'U').charAt(0).toUpperCase()}
                  </div>
                  <span className="text-xs text-slate-300 truncate max-w-[150px]">
                    {currentUser.email}
                  </span>
                </div>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleSignOut();
                  }}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-red-950/40 text-red-300 border border-red-500/30 text-xs font-semibold hover:bg-red-900/50 cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* Main Body Router */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-slate-950 space-y-6">
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              {/* Welcome Card */}
              <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-r from-emerald-950/40 via-slate-900 to-slate-900 border border-emerald-500/30 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-2xl">
                <div className="space-y-2 max-w-xl">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>AI Social Media Manager Active</span>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
                    Good morning, {brandKit.businessName}!
                  </h2>
                  <p className="text-xs md:text-sm text-slate-300 leading-relaxed font-sans">
                    Zulfiqar AI is monitoring your content channels for Pakistani entrepreneurs. Your Google Calendar synchronization is active, and your brand guidelines are locked in.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <button
                    onClick={() => setActiveTab('agent')}
                    className="flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 text-xs font-bold shadow-lg shadow-emerald-500/20 transition-colors"
                  >
                    <Bot className="w-4 h-4" />
                    <span>Ask AI Manager</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('create')}
                    className="flex items-center gap-2 px-4 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs font-bold transition-colors"
                  >
                    <Plus className="w-4 h-4 text-emerald-400" />
                    <span>Create Creative</span>
                  </button>
                </div>
              </div>

              {/* Quick Actions Row */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                {[
                  { label: 'Create 30-Day Plan', action: () => setActiveTab('agent'), icon: Calendar },
                  { label: 'Create Meta Ad', action: () => setActiveTab('create'), icon: Sparkles },
                  { label: 'Business Quote', action: () => setActiveTab('create'), icon: PenTool },
                  { label: '7-Slide Carousel', action: () => setActiveTab('create'), icon: Layers },
                  { label: 'Repurpose Article', action: () => setActiveTab('create'), icon: FolderKanban },
                  { label: 'Analyze Data', action: () => setActiveTab('analytics'), icon: BarChart3 },
                ].map((act, i) => {
                  const Icon = act.icon;
                  return (
                    <button
                      key={i}
                      onClick={act.action}
                      className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-emerald-500/40 hover:bg-slate-800/40 transition-all text-left space-y-2 group shadow-md"
                    >
                      <Icon className="w-5 h-5 text-emerald-400 group-hover:scale-110 transition-transform" />
                      <div className="text-xs font-bold text-white leading-snug">{act.label}</div>
                    </button>
                  );
                })}
              </div>

              {/* Status Overview Metric Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1">
                  <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
                    <span>Scheduled for Publishing</span>
                    <Clock className="w-4 h-4 text-blue-400" />
                  </div>
                  <div className="text-2xl font-extrabold text-white font-mono">{scheduledCount}</div>
                  <p className="text-[11px] text-slate-500">Syncs to Google Calendar</p>
                </div>

                <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1">
                  <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
                    <span>Needs Human Review</span>
                    <AlertCircle className="w-4 h-4 text-amber-400" />
                  </div>
                  <div className="text-2xl font-extrabold text-white font-mono">{needsReviewCount}</div>
                  <p className="text-[11px] text-slate-500">Human-In-The-Loop approval pending</p>
                </div>

                <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1">
                  <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
                    <span>Published Assets</span>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="text-2xl font-extrabold text-white font-mono">{publishedCount}</div>
                  <p className="text-[11px] text-slate-500">Delivered to connected pages</p>
                </div>
              </div>

              {/* Today's Schedule & Review Queue */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Needs Review Queue (7 cols) */}
                <div className="lg:col-span-7 bg-slate-900/60 rounded-2xl border border-slate-800 p-6 space-y-4 shadow-xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-white tracking-tight">Pending Approval Queue</h3>
                      <p className="text-xs text-slate-400">Review AI-crafted hooks, copies & visuals before scheduling</p>
                    </div>
                    <button
                      onClick={() => setActiveTab('calendar')}
                      className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold"
                    >
                      View Calendar &rarr;
                    </button>
                  </div>

                  <div className="space-y-3">
                    {posts
                      .filter((p) => p.status === 'needs_review' || p.status === 'draft')
                      .slice(0, 3)
                      .map((p) => (
                        <div
                          key={p.id}
                          className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center justify-between gap-4 hover:border-slate-700 transition-colors"
                        >
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold">
                                {p.platform}
                              </span>
                              <h4 className="text-xs font-bold text-white truncate max-w-sm">
                                {p.headline || p.title}
                              </h4>
                            </div>
                            <p className="text-xs text-slate-400 line-clamp-1">{p.hook || p.caption}</p>
                          </div>

                          <button
                            onClick={() => setSelectedPost(p)}
                            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-400 hover:bg-emerald-300 text-slate-950 text-xs font-bold whitespace-nowrap shadow-sm"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Review</span>
                          </button>
                        </div>
                      ))}
                  </div>
                </div>

                {/* Live Brand Canvas Spotlight (5 cols) */}
                <div className="lg:col-span-5 bg-slate-900/60 rounded-2xl border border-slate-800 p-6 flex flex-col justify-between space-y-4 shadow-xl">
                  <div>
                    <h3 className="text-sm font-bold text-white tracking-tight">Active Visual Identity Preview</h3>
                    <p className="text-xs text-slate-400">Enforcing modesty rule & {brandKit.visualStyle.replace('_', ' ')} aesthetic</p>
                  </div>

                  <div className="max-w-xs mx-auto w-full">
                    <GraphicCanvas
                      post={posts[0] || { title: 'Zulfiqar AI Social Studio' }}
                      brandKit={brandKit}
                      aspectRatio="square"
                    />
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800">
                    <span>Modesty Rule: <strong className="text-emerald-400 font-semibold">{brandKit.modestImageryRule ? 'Enforced' : 'Off'}</strong></span>
                    <span>Palette: <strong className="text-white font-mono">{brandKit.primaryColor}</strong></span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'agent' && (
            <div className="h-[calc(100vh-6rem)]">
              <AIAgentChat
                brandKit={brandKit}
                onPostCreated={handlePostCreated}
                onOpenCalendar={() => setActiveTab('calendar')}
              />
            </div>
          )}

          {activeTab === 'create' && (
            <CreatePostStudio
              brandKit={brandKit}
              onPostCreated={handlePostCreated}
              onOpenCalendar={() => setActiveTab('calendar')}
            />
          )}

          {activeTab === 'calendar' && (
            <ContentCalendar
              posts={posts}
              brandKit={brandKit}
              onSelectPost={(post) => setSelectedPost(post)}
              onNewPost={() => setActiveTab('create')}
              onPostUpdated={handleUpdatePost}
            />
          )}

          {activeTab === 'library' && (
            <ContentLibrary
              posts={posts}
              onSelectPost={(post) => setSelectedPost(post)}
              onDeletePost={handleDeletePost}
              onDuplicatePost={handleDuplicatePost}
            />
          )}

          {activeTab === 'analytics' && (
            <AnalyticsDashboard
              posts={posts}
              brandKit={brandKit}
              socialAccounts={socialAccounts}
            />
          )}

          {activeTab === 'social' && (
            <SocialAccountsManager
              accounts={socialAccounts}
              onToggleConnection={handleToggleConnection}
            />
          )}

          {activeTab === 'brand_kit' && (
            <BrandKitManager
              brandKit={brandKit}
              onUpdate={setBrandKit}
              onOpenWizard={() => setShowOnboarding(true)}
            />
          )}
        </main>

        {/* Global Application Footer */}
        <footer className="border-t border-slate-800 bg-slate-950/80 px-4 py-3 shrink-0 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-slate-300 font-medium">Zulfiqar AI Social Media Manager &bull; v2.4</span>
            <span className="text-slate-600 hidden sm:inline">|</span>
            <span className="text-slate-500 hidden sm:inline">Meta Ads, Content Calendar & AI Creative Generation</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              id="footer-open-lead-form-btn"
              onClick={() => setShowLeadModal(true)}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md shadow-emerald-500/20 transition-all cursor-pointer hover:scale-105 active:scale-95"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Get a Quote / Contact Us</span>
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
}
