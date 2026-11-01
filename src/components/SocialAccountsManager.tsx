import React, { useState } from 'react';
import { SocialAccount, Platform } from '../types';
import { PlatformIcon } from './PlatformIcon';
import {
  Facebook,
  Linkedin,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  ExternalLink,
  Shield,
  Unlink,
  Key,
  Info,
  Calendar,
} from 'lucide-react';
import { isGoogleCalendarConnected, requestGoogleCalendarAccess } from '../services/calendarService';

interface SocialAccountsManagerProps {
  accounts: SocialAccount[];
  onToggleConnection: (id: string) => void;
}

export const SocialAccountsManager: React.FC<SocialAccountsManagerProps> = ({
  accounts,
  onToggleConnection,
}) => {
  const [activeTab, setActiveTab] = useState<'accounts' | 'api_setup'>('accounts');
  const [gcalConnected, setGcalConnected] = useState(isGoogleCalendarConnected());
  const [connectingGcal, setConnectingGcal] = useState(false);

  const getPlatformIcon = (platform: Platform) => {
    return <PlatformIcon platform={platform} className="w-5 h-5" />;
  };

  const handleConnectGoogleCalendar = async () => {
    setConnectingGcal(true);
    try {
      await requestGoogleCalendarAccess();
      setGcalConnected(true);
    } catch (e) {
      console.error(e);
    } finally {
      setConnectingGcal(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner: Real OAuth & API Guidelines */}
      <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white tracking-tight">
              Official API & OAuth Publishing Hub
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Secure OAuth 2.0 integration for Meta Graph API (v20+), LinkedIn v2 API, and Google Calendar. No passwords stored.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('accounts')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold border ${
              activeTab === 'accounts'
                ? 'bg-emerald-500 text-slate-950 border-emerald-400 font-bold'
                : 'bg-slate-950 text-slate-400 border-slate-800'
            }`}
          >
            Connected Channels
          </button>
          <button
            onClick={() => setActiveTab('api_setup')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold border ${
              activeTab === 'api_setup'
                ? 'bg-emerald-500 text-slate-950 border-emerald-400 font-bold'
                : 'bg-slate-950 text-slate-400 border-slate-800'
            }`}
          >
            API Credentials Guide
          </button>
        </div>
      </div>

      {activeTab === 'accounts' && (
        <div className="space-y-6">
          {/* Google Calendar Special Integration Card */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-blue-950/30 to-slate-900 border border-blue-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-blue-400 shrink-0">
                <Calendar className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-white">Google Calendar Workspace Sync</h4>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
                    ACTIVE OAUTH SCOPE
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Synchronize your scheduled posts and multi-day publishing cadences directly into your personal or team Google Calendar.
                </p>
              </div>
            </div>

            <button
              onClick={handleConnectGoogleCalendar}
              disabled={connectingGcal}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-md ${
                gcalConnected
                  ? 'bg-slate-800 text-emerald-400 border border-emerald-500/30'
                  : 'bg-blue-500 hover:bg-blue-400 text-white'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{gcalConnected ? 'Calendar Connected & Synced' : connectingGcal ? 'Authorizing...' : 'Authorize Calendar Sync'}</span>
            </button>
          </div>

          {/* Social Platform Accounts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {accounts.map((acc) => (
              <div
                key={acc.id}
                className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4 hover:border-slate-700 transition-all shadow-lg"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center">
                      {getPlatformIcon(acc.platform)}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">{acc.accountName}</h4>
                      <p className="text-xs text-slate-400 font-mono">{acc.handle}</p>
                    </div>
                  </div>

                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded-full uppercase border ${
                      acc.connected
                        ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                        : 'bg-slate-800 text-slate-400 border-slate-700'
                    }`}
                  >
                    {acc.connected ? 'Connected' : 'Disconnected'}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 text-[11px] space-y-1">
                  <div className="flex justify-between text-slate-400">
                    <span>Audience / Followers:</span>
                    <span className="text-white font-mono font-semibold">{acc.followersCount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Permissions:</span>
                    <span className="text-slate-300 font-mono">{acc.permissions.length} granted</span>
                  </div>
                  {acc.lastSync && (
                    <div className="flex justify-between text-slate-400">
                      <span>Last Synced:</span>
                      <span className="text-emerald-400 font-mono">{acc.lastSync}</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between pt-1">
                  <button
                    onClick={() => onToggleConnection(acc.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors border ${
                      acc.connected
                        ? 'bg-slate-950 text-rose-400 border-slate-800 hover:bg-rose-950/40'
                        : 'bg-emerald-500 text-slate-950 font-bold border-emerald-400 hover:bg-emerald-400'
                    }`}
                  >
                    <Unlink className="w-3.5 h-3.5" />
                    <span>{acc.connected ? 'Disconnect Channel' : 'Connect Channel'}</span>
                  </button>

                  <span className="text-[10px] text-slate-500 font-mono">OAuth 2.0 PKCE</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'api_setup' && (
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-6 text-slate-200">
          <div className="space-y-1">
            <h3 className="text-base font-bold text-white">How External Publishing Integrations Work</h3>
            <p className="text-xs text-slate-400">
              In accordance with Meta, LinkedIn, and X official developer policies, direct publishing requires verified app review credentials or client-side OAuth tokens.
            </p>
          </div>

          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
                <Facebook className="w-4 h-4" />
                <span>Meta Business & Graph API (Facebook Pages & Instagram)</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Posts are sent to <code className="text-emerald-300 font-mono">graph.facebook.com/v20.0/{'{page-id}'}/feed</code> with your Page Access Token. For Instagram, carousel containers are created via <code className="text-emerald-300 font-mono">/media</code> and finalized via <code className="text-emerald-300 font-mono">/media_publish</code>.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-sky-400">
                <Linkedin className="w-4 h-4" />
                <span>LinkedIn Community Management API</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Authorizes via Member OAuth 2.0 with the <code className="text-sky-300 font-mono">w_member_social</code> and <code className="text-sky-300 font-mono">r_organization_social</code> scopes.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-blue-400">
                <Calendar className="w-4 h-4" />
                <span>Google Calendar Scope Confirmation</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Scope: <code className="text-blue-300 font-mono">https://www.googleapis.com/auth/calendar.events</code>. Used exclusively to place reminder slots and content publish deadlines onto your timeline.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
