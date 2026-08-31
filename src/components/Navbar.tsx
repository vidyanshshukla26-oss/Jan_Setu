import React from 'react';
import {
  Sparkles,
  MapPin,
  Award,
  BarChart3,
  FileText,
  PlusCircle,
  MessageSquareHeart,
  ShieldCheck,
  Flame,
  Search,
  Users,
  Compass,
  Building2,
  GraduationCap,
  HeartHandshake
} from 'lucide-react';
import { UserRole } from '../types';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  onOpenSubmitChallenge: () => void;
  onOpenAIChat: () => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  challengesCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  userRole,
  setUserRole,
  onOpenSubmitChallenge,
  onOpenAIChat,
  searchQuery,
  setSearchQuery,
  challengesCount,
}) => {
  const roleConfig = {
    citizen: {
      label: 'Citizen / Community',
      badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      icon: Users,
      desc: 'Report issues & upvote neighborhood priorities'
    },
    innovator: {
      label: 'Innovator / Researcher',
      badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
      icon: GraduationCap,
      desc: 'Submit solutions & win hackathon bounties'
    },
    government_csr: {
      label: 'Govt Official / CSR',
      badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
      icon: Building2,
      desc: 'Fund bounties & verify field pilots'
    },
    evaluator: {
      label: 'Jury / Domain Expert',
      badgeColor: 'bg-purple-50 text-purple-700 border-purple-200',
      icon: ShieldCheck,
      desc: 'Review TRL & score feasibility'
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-xs">
      {/* High Density Top Telemetry Bar */}
      <div className="bg-gray-900 text-gray-300 px-4 sm:px-6 py-1.5 text-[11px] font-medium flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-500 text-white uppercase tracking-wider">
            SIH26043
          </span>
          <span className="hidden sm:inline text-gray-300">
            CivicPulse • Crowdsourcing Societal Challenges & Decentralized Innovation
          </span>
        </div>
        <div className="flex items-center space-x-4">
          <span className="hidden md:inline-flex items-center gap-1.5 text-green-400 font-mono text-[10px]">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>
            CLUSTER STABLE • {challengesCount} LIVE PROBLEMS
          </span>
          <button
            onClick={onOpenAIChat}
            className="flex items-center gap-1.5 text-blue-300 hover:text-blue-200 transition-colors font-semibold"
            id="nav-jansetu-ai-btn"
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            <span>AI Civic Copilot</span>
          </button>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16 gap-4">
          {/* Logo & Platform Name */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setCurrentTab('challenges')}
              className="flex items-center gap-2.5 text-left group cursor-pointer"
              id="nav-logo-btn"
            >
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-sm group-hover:bg-blue-700 transition-colors">
                C
              </div>
              <div className="flex items-baseline gap-2">
                <h1 className="text-lg font-bold tracking-tight text-gray-900">
                  JanSetu <span className="text-gray-400 font-normal text-xs ml-1">v2.0.43</span>
                </h1>
              </div>
            </button>

            <div className="hidden xl:flex items-center gap-2 px-2.5 py-0.5 bg-green-50 text-green-700 rounded-full border border-green-100 text-[11px] font-semibold">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>142 Live Solutions</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            <button
              onClick={() => setCurrentTab('challenges')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                currentTab === 'challenges'
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
              id="nav-tab-challenges"
            >
              Dashboard
            </button>

            <button
              onClick={() => setCurrentTab('map')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                currentTab === 'map'
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
              id="nav-tab-map"
            >
              <MapPin className="w-3.5 h-3.5 text-blue-600" />
              Geo Radar
            </button>

            <button
              onClick={() => setCurrentTab('bounties')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                currentTab === 'bounties'
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
              id="nav-tab-bounties"
            >
              <Award className="w-3.5 h-3.5 text-amber-500" />
              Active Bounties
            </button>

            <button
              onClick={() => setCurrentTab('proposal-studio')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                currentTab === 'proposal-studio'
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
              id="nav-tab-proposal"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              Proposal Studio
            </button>

            <button
              onClick={() => setCurrentTab('analytics')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                currentTab === 'analytics'
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
              id="nav-tab-analytics"
            >
              <BarChart3 className="w-3.5 h-3.5 text-teal-600" />
              Impact Analytics
            </button>

            <button
              onClick={() => setCurrentTab('leaderboard')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                currentTab === 'leaderboard'
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
              id="nav-tab-leaderboard"
            >
              <Flame className="w-3.5 h-3.5 text-orange-500" />
              Rankings
            </button>
          </nav>

          {/* Search bar, Role Switcher & Action Button */}
          <div className="flex items-center gap-2">
            {/* Search Input */}
            <div className="relative hidden md:block w-40 xl:w-56">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search database..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-900 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-blue-600 focus:border-blue-600 transition-all"
                id="nav-search-input"
              />
            </div>

            {/* Role Switcher Dropdown */}
            <div className="relative">
              <select
                value={userRole}
                onChange={(e) => setUserRole(e.target.value as UserRole)}
                className="appearance-none pl-2.5 pr-7 py-1.5 text-xs font-semibold rounded-lg border border-gray-200 bg-white text-gray-800 cursor-pointer hover:border-gray-300 focus:outline-hidden focus:ring-1 focus:ring-blue-600"
                id="nav-role-select"
              >
                <option value="citizen">Citizen</option>
                <option value="innovator">Innovator</option>
                <option value="government_csr">Govt / CSR</option>
                <option value="evaluator">Jury / Expert</option>
              </select>
              <div className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 text-[9px]">
                ▼
              </div>
            </div>

            {/* Report Problem Button */}
            <button
              onClick={onOpenSubmitChallenge}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-lg text-xs font-semibold shadow-sm transition-all cursor-pointer"
              id="nav-report-problem-btn"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">+ New Challenge</span>
              <span className="sm:hidden">New</span>
            </button>

            {/* User Avatar */}
            <div className="w-8 h-8 bg-gray-100 rounded-full border border-gray-200 flex items-center justify-center overflow-hidden shrink-0">
              <img
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"
                alt="User Avatar"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Tab Bar */}
      <div className="lg:hidden flex items-center justify-around border-t border-gray-200 bg-white px-2 py-1.5 overflow-x-auto text-xs">
        <button
          onClick={() => setCurrentTab('challenges')}
          className={`px-2.5 py-1 rounded-md font-semibold whitespace-nowrap text-xs ${
            currentTab === 'challenges' ? 'bg-blue-50 text-blue-700' : 'text-gray-600'
          }`}
        >
          Challenges
        </button>
        <button
          onClick={() => setCurrentTab('map')}
          className={`px-2.5 py-1 rounded-md font-semibold whitespace-nowrap text-xs ${
            currentTab === 'map' ? 'bg-blue-50 text-blue-700' : 'text-gray-600'
          }`}
        >
          Geo Radar
        </button>
        <button
          onClick={() => setCurrentTab('bounties')}
          className={`px-2.5 py-1 rounded-md font-semibold whitespace-nowrap text-xs ${
            currentTab === 'bounties' ? 'bg-blue-50 text-blue-700' : 'text-gray-600'
          }`}
        >
          Bounties
        </button>
        <button
          onClick={() => setCurrentTab('proposal-studio')}
          className={`px-2.5 py-1 rounded-md font-semibold whitespace-nowrap text-xs ${
            currentTab === 'proposal-studio' ? 'bg-blue-50 text-blue-700' : 'text-gray-600'
          }`}
        >
          Proposals
        </button>
        <button
          onClick={() => setCurrentTab('analytics')}
          className={`px-2.5 py-1 rounded-md font-semibold whitespace-nowrap text-xs ${
            currentTab === 'analytics' ? 'bg-blue-50 text-blue-700' : 'text-gray-600'
          }`}
        >
          Impact
        </button>
      </div>
    </header>
  );
};

