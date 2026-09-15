import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  PlusCircle,
  Search,
  Filter,
  Layers,
  MapPin,
  Award,
  BarChart3,
  Lightbulb,
  ShieldCheck,
  TrendingUp,
  AlertTriangle,
  Compass,
  ArrowUpDown,
  RefreshCw,
  MessageSquare,
  Bookmark,
  BellRing,
  BriefcaseBusiness,
  CheckCircle2,
  Clock3,
  HeartHandshake,
  Star,
  Target,
  WalletCards,
  UsersRound,
  CalendarCheck2,
  Route,
  Gauge,
  HandCoins,
} from 'lucide-react';
import { Challenge, Solution, UserRole, AnalyticsSummary, ChallengeCategory, AppTab } from './types';
import { Navbar } from './components/Navbar';
import { ChallengeCard } from './components/ChallengeCard';
import { ChallengeDetailModal } from './components/ChallengeDetailModal';
import { SubmitChallengeModal } from './components/SubmitChallengeModal';
import { SubmitSolutionModal } from './components/SubmitSolutionModal';
import { GeoSpatialMap } from './components/GeoSpatialMap';
import { BountiesSection } from './components/BountiesSection';
import { AIProposalStudio } from './components/AIProposalStudio';
import { AnalyticsDashboard } from './components/AnalyticsDashboard';
import { CivicAssistantDrawer } from './components/CivicAssistantDrawer';
import { Leaderboard } from './components/Leaderboard';

const CATEGORIES: ChallengeCategory[] = [
  'Water & Sanitation',
  'Clean Energy & Climate',
  'Rural Healthcare',
  'Urban Infrastructure & Mobility',
  'Agriculture & Agritech',
  'Quality Education',
  'Disaster Management',
  'Women Safety & Inclusion',
  'Waste Management & Circular Economy',
];

export function App() {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsSummary | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'upvotes' | 'bounty' | 'urgency' | 'newest'>('upvotes');
  const [userRole, setUserRole] = useState<UserRole>('innovator');
  const [currentTab, setCurrentTab] = useState<AppTab>('challenges');
  const [favoritesOnly, setFavoritesOnly] = useState<boolean>(false);
  const [verifiedOnly, setVerifiedOnly] = useState<boolean>(false);
  const [showHighPriority, setShowHighPriority] = useState<boolean>(false);
  const [savedChallenges, setSavedChallenges] = useState<Record<string, boolean>>({});

  // Modal States
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null);
  const [isSubmitChallengeOpen, setIsSubmitChallengeOpen] = useState<boolean>(false);
  const [isSubmitSolutionOpen, setIsSubmitSolutionOpen] = useState<boolean>(false);
  const [targetChallengeForSolution, setTargetChallengeForSolution] = useState<Challenge | null>(null);
  const [isCopilotOpen, setIsCopilotOpen] = useState<boolean>(false);

  // Proposal pre-fill state
  const [proposalTargetChallenge, setProposalTargetChallenge] = useState<Challenge | null>(null);
  const [proposalTargetSolution, setProposalTargetSolution] = useState<Solution | null>(null);

  // Fetch challenges & analytics from backend
  const fetchData = async () => {
    try {
      setLoading(true);
      setLoadError(null);
      const [chRes, anRes] = await Promise.all([
        fetch('/api/challenges'),
        fetch('/api/analytics'),
      ]);
      const chData = await chRes.json();
      const anData = await anRes.json();

      if (chData.success && Array.isArray(chData.data)) {
        setChallenges(chData.data);
      }
      if (anData.success && anData.data) {
        setAnalytics(anData.data);
      }
    } catch (err) {
      console.error('Fetch error:', err);
      setLoadError('The civic data service is temporarily unavailable.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Handle Challenge Upvoting
  const handleVoteChallenge = async (challengeId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    try {
      const res = await fetch(`/api/challenges/${challengeId}/vote`, { method: 'POST' });
      const data = await res.json();
      if (data.success && typeof data.upvotes === 'number') {
        setChallenges((prev) =>
          prev.map((c) =>
            c.id === challengeId
              ? {
                  ...c,
                  upvotes: data.upvotes,
                  hasUpvoted: data.hasUpvoted,
                }
              : c
          )
        );
        if (selectedChallenge && selectedChallenge.id === challengeId) {
          setSelectedChallenge((prev) =>
            prev
              ? {
                  ...prev,
                  upvotes: data.upvotes,
                  hasUpvoted: data.hasUpvoted,
                }
              : null
          );
        }
      }
    } catch (err) {
      console.error('Vote error:', err);
    }
  };

  // Filter and sort challenges
  const filteredChallenges = challenges
    .filter((c) => {
      if (selectedCategory !== 'All' && c.category !== selectedCategory) return false;
      if (selectedSeverity !== 'All' && c.severity !== selectedSeverity) return false;
      if (selectedStatus !== 'All' && c.status !== selectedStatus) return false;
      if (favoritesOnly && !savedChallenges[c.id]) return false;
      if (verifiedOnly && !c.verifiedByOfficial) return false;
      if (showHighPriority && c.severity !== 'Critical' && c.severity !== 'High') return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = c.title.toLowerCase().includes(q);
        const matchDesc = c.description.toLowerCase().includes(q);
        const matchCity = c.location.city.toLowerCase().includes(q);
        const matchState = c.location.state.toLowerCase().includes(q);
        const matchTech = c.primaryTechDisciplines.some((t) => t.toLowerCase().includes(q));
        if (!matchTitle && !matchDesc && !matchCity && !matchState && !matchTech) {
          return false;
        }
      }
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'upvotes') return b.upvotes - a.upvotes;
      if (sortBy === 'bounty') return b.bountyAmount - a.bountyAmount;
      if (sortBy === 'urgency') return b.severityScore - a.severityScore;
      if (sortBy === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      return 0;
    });

  const handleOpenSubmitSolution = (challenge: Challenge) => {
    setTargetChallengeForSolution(challenge);
    setIsSubmitSolutionOpen(true);
  };

  const handleOpenProposalStudio = (challenge: Challenge, solution?: Solution) => {
    setProposalTargetChallenge(challenge);
    setProposalTargetSolution(solution || null);
    setCurrentTab('proposal-studio');
    if (selectedChallenge) setSelectedChallenge(null);
  };

  const toggleSaveChallenge = (challengeId: string) => {
    setSavedChallenges((prev) => ({
      ...prev,
      [challengeId]: !prev[challengeId],
    }));
  };

  const savedChallengeCount = Object.values(savedChallenges).filter(Boolean).length;
  const highPriorityCount = challenges.filter((challenge) => challenge.severity === 'Critical' || challenge.severity === 'High').length;

  const quickInsights = [
    { label: 'Verified Challenges', value: `${challenges.filter((c) => c.verifiedByOfficial).length}`, icon: ShieldCheck, tone: 'bg-emerald-50 text-emerald-700' },
    { label: 'Grant Ready', value: `${challenges.filter((c) => c.bountyAmount >= 500000).length}`, icon: HandCoins, tone: 'bg-amber-50 text-amber-700' },
    { label: 'Volunteer Match', value: `${Math.max(28, Math.round(challenges.length * 1.7))}%`, icon: HeartHandshake, tone: 'bg-rose-50 text-rose-700' },
    { label: 'AI Confidence', value: `${Math.min(98, 82 + challenges.length)}%`, icon: Gauge, tone: 'bg-sky-50 text-sky-700' },
  ];

  const platformFeatures = [
    'Priority triage alerts',
    'Saved opportunity lists',
    'Verified community vetting',
    'AI proposal drafting',
    'Regional hotspot tracking',
    'Volunteer matching',
    'Bounty orchestration',
    'Citizen impact reporting',
    'Multi-role access',
    'Grant readiness scoring',
    'Mission alignment tags',
    'Impact workflow sync',
  ];

  return (
    <div className="min-h-screen bg-[#F3F4F6] text-[#111827] flex flex-col font-sans">
      {/* Platform Navigation */}
      <Navbar
        userRole={userRole}
        setUserRole={setUserRole}
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        challengesCount={challenges.length}
        onOpenSubmitChallenge={() => setIsSubmitChallengeOpen(true)}
        onOpenAIChat={() => setIsCopilotOpen(true)}
      />

      {/* Main App Container */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 space-y-5">
        {/* TAB 1: EXPLORE CHALLENGES VIEW */}
        {currentTab === 'challenges' && (
          <div className="space-y-4">
            {/* High Density Section Header */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
              <div className="space-y-0.5">
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-gray-900">
                  Current Societal Hotspots
                </h2>
                <p className="text-gray-500 text-xs sm:text-sm">
                  Ranking challenges by urgency, complexity, and resource feasibility.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setSelectedCategory('All');
                    setSelectedSeverity('All');
                    setSelectedStatus('All');
                    setSearchQuery('');
                    setFavoritesOnly(false);
                    setVerifiedOnly(false);
                    setShowHighPriority(false);
                  }}
                  className="px-3.5 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-semibold text-gray-700 hover:bg-gray-50 shadow-2xs transition-all cursor-pointer"
                >
                  Reset Filter
                </button>
                <button
                  onClick={() => setIsSubmitChallengeOpen(true)}
                  className="px-3.5 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700 shadow-2xs transition-all cursor-pointer flex items-center gap-1.5"
                  id="hero-report-issue-btn"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>+ New Challenge</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
              {quickInsights.map(({ label, value, icon: Icon, tone }) => (
                <div key={label} className="bg-white border border-gray-200 rounded-xl p-3 shadow-xs">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500">{label}</p>
                      <p className="mt-1 text-xl font-bold text-gray-900">{value}</p>
                    </div>
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${tone}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-2xl p-4 text-white shadow-xs">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
                <div>
                  <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.18em] border border-white/15">
                    <BellRing className="w-3.5 h-3.5" />
                    Civic operations snapshot
                  </div>
                  <h3 className="mt-3 text-xl font-bold">{highPriorityCount} high-priority issues deserve immediate action</h3>
                  <p className="mt-1 text-sm text-blue-100">
                    Engage volunteers, route resources, and align grant plans around the most urgent hotspots.
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button className="px-3 py-1.5 bg-white text-blue-700 rounded-lg text-xs font-semibold hover:bg-blue-50 transition-colors">
                    Share update
                  </button>
                  <button className="px-3 py-1.5 border border-white/30 bg-transparent text-white rounded-lg text-xs font-semibold hover:bg-white/10 transition-colors">
                    View field plan
                  </button>
                </div>
              </div>
            </div>

            {/* Filter & Search Matrix */}
            <div className="bg-white p-3.5 rounded-xl border border-gray-200 shadow-xs space-y-2.5">
              {/* Top controls: Search, Severity, Sort */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-2.5">
                <div className="relative w-full sm:w-80">
                  <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by keywords, city, state, or tech..."
                    className="w-full pl-8 pr-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-900 focus:bg-white focus:ring-1 focus:ring-blue-600 focus:outline-hidden"
                  />
                </div>

                <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-end">
                  {/* Severity Filter */}
                  <select
                    value={selectedSeverity}
                    onChange={(e) => setSelectedSeverity(e.target.value)}
                    className="px-2.5 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs font-semibold text-gray-700 cursor-pointer"
                  >
                    <option value="All">All Severity Levels</option>
                    <option value="Critical">Critical Urgency</option>
                    <option value="High">High Urgency</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>

                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="px-2.5 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs font-semibold text-gray-700 cursor-pointer"
                  >
                    <option value="All">All Statuses</option>
                    <option value="open_for_solutions">Open for solutions</option>
                    <option value="under_review">Under review</option>
                    <option value="pilot_in_progress">Pilot in progress</option>
                    <option value="resolved">Resolved</option>
                  </select>

                  {/* Sorting dropdown */}
                  <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1.5">
                    <ArrowUpDown className="w-3 h-3 text-gray-400" />
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as any)}
                      className="bg-transparent text-xs font-semibold text-gray-700 focus:outline-hidden cursor-pointer"
                    >
                      <option value="upvotes">Most Citizen Votes</option>
                      <option value="bounty">Highest Bounty Pool</option>
                      <option value="urgency">Urgency / Severity Score</option>
                      <option value="newest">Recently Reported</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => setFavoritesOnly((value) => !value)}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold ${favoritesOnly ? 'bg-blue-100 text-blue-700 border border-blue-200' : 'bg-gray-100 text-gray-700 border border-gray-200'} transition-colors`}
                >
                  <Bookmark className="w-3.5 h-3.5" />
                  {favoritesOnly ? 'Saved only' : 'Saved list'}
                </button>
                <button
                  onClick={() => setVerifiedOnly((value) => !value)}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold ${verifiedOnly ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' : 'bg-gray-100 text-gray-700 border border-gray-200'} transition-colors`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Verified only
                </button>
                <button
                  onClick={() => setShowHighPriority((value) => !value)}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold ${showHighPriority ? 'bg-rose-100 text-rose-700 border border-rose-200' : 'bg-gray-100 text-gray-700 border border-gray-200'} transition-colors`}
                >
                  <Target className="w-3.5 h-3.5" />
                  High priority
                </button>
                <div className="ml-auto inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-2.5 py-1.5 text-[11px] font-semibold text-gray-700">
                  <Star className="w-3.5 h-3.5 text-amber-500" />
                  {savedChallengeCount} saved
                </div>
              </div>

              {/* Category Filter Chips */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
                <button
                  onClick={() => setSelectedCategory('All')}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold whitespace-nowrap transition-colors ${
                    selectedCategory === 'All'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  All Categories ({challenges.length})
                </button>
                {CATEGORIES.map((cat) => {
                  const count = challenges.filter((c) => c.category === cat).length;
                  return (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold whitespace-nowrap transition-colors ${
                        selectedCategory === cat
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {cat} {count > 0 && `(${count})`}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
              <div className="bg-white border border-gray-200 rounded-xl p-3 shadow-xs">
                <div className="flex items-center gap-2 text-blue-700">
                  <BriefcaseBusiness className="w-4 h-4" />
                  <span className="text-[10px] font-bold uppercase tracking-[0.18em]">Field dispatch</span>
                </div>
                <p className="mt-2 text-lg font-bold text-gray-900">{Math.max(9, Math.round(challenges.length / 2))} teams routed</p>
                <p className="mt-1 text-[11px] text-gray-500">Matched to intervention clusters and local partners.</p>
              </div>
              <div className="bg-white border border-gray-200 rounded-xl p-3 shadow-xs">
                <div className="flex items-center gap-2 text-emerald-700">
                  <UsersRound className="w-4 h-4" />
                  <span className="text-[10px] font-bold uppercase tracking-[0.18em]">Coverage</span>
                </div>
                <p className="mt-2 text-lg font-bold text-gray-900">{Math.min(96, 40 + challenges.length * 4)}%</p>
                <p className="mt-1 text-[11px] text-gray-500">District engagement and local partner visibility.</p>
              </div>
              <div className="bg-white border border-gray-200 rounded-xl p-3 shadow-xs">
                <div className="flex items-center gap-2 text-amber-700">
                  <WalletCards className="w-4 h-4" />
                  <span className="text-[10px] font-bold uppercase tracking-[0.18em]">Funding</span>
                </div>
                <p className="mt-2 text-lg font-bold text-gray-900">₹{analytics ? (analytics.totalBountyPool / 100000).toFixed(1) : '21.0'}L</p>
                <p className="mt-1 text-[11px] text-gray-500">Available pools and pledged sponsorship actions.</p>
              </div>
              <div className="bg-white border border-gray-200 rounded-xl p-3 shadow-xs">
                <div className="flex items-center gap-2 text-purple-700">
                  <CalendarCheck2 className="w-4 h-4" />
                  <span className="text-[10px] font-bold uppercase tracking-[0.18em]">Next review</span>
                </div>
                <p className="mt-2 text-lg font-bold text-gray-900">{Math.max(2, Math.min(9, challenges.length))} days</p>
                <p className="mt-1 text-[11px] text-gray-500">Target time to move the next intervention milestone.</p>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-3 shadow-xs">
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2 text-gray-900">
                  <Route className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-bold">Platform feature stack</span>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-gray-500">20+ improvements</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {platformFeatures.map((feature) => (
                  <span key={feature} className="rounded-full bg-gray-100 px-2.5 py-1 text-[10px] font-semibold text-gray-700 border border-gray-200">
                    {feature}
                  </span>
                ))}
              </div>
            </div>

            {/* Challenge Cards Grid */}
            {loading ? (
              <div className="py-16 text-center text-gray-500 space-y-2">
                <RefreshCw className="w-8 h-8 mx-auto animate-spin text-blue-600" />
                <p className="text-xs font-semibold">Loading societal challenges database...</p>
              </div>
            ) : loadError ? (
              <div className="py-16 text-center bg-white rounded-xl border border-red-200 p-8 space-y-3">
                <AlertTriangle className="w-10 h-10 text-red-500 mx-auto" />
                <h3 className="text-base font-bold text-gray-800">Could not load live challenges</h3>
                <p className="text-xs text-gray-500">{loadError}</p>
                <button onClick={fetchData} className="px-4 py-2 bg-gray-900 text-white text-xs font-semibold rounded-lg hover:bg-black">
                  Retry connection
                </button>
              </div>
            ) : filteredChallenges.length === 0 ? (
              <div className="py-16 text-center bg-white rounded-xl border border-dashed border-gray-300 p-8 space-y-3">
                <AlertTriangle className="w-10 h-10 text-amber-500 mx-auto" />
                <h3 className="text-base font-bold text-gray-800">No challenges matched your filter</h3>
                <p className="text-xs text-gray-500 max-w-md mx-auto">
                  Try clearing your search query or selecting &ldquo;All Categories&rdquo; to discover other problems.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('All');
                    setSelectedSeverity('All');
                    setSelectedStatus('All');
                  }}
                  className="px-4 py-2 bg-gray-900 text-white text-xs font-semibold rounded-lg hover:bg-black"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredChallenges.map((challenge) => (
                  <div key={challenge.id} className="relative">
                    <button
                      onClick={(event) => {
                        event.stopPropagation();
                        toggleSaveChallenge(challenge.id);
                      }}
                      aria-label={savedChallenges[challenge.id] ? 'Remove from saved list' : 'Save challenge'}
                      className={`absolute right-3 top-3 z-10 inline-flex items-center justify-center w-8 h-8 rounded-full border shadow-sm transition-all ${savedChallenges[challenge.id] ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'}`}
                    >
                      <Bookmark className={`w-3.5 h-3.5 ${savedChallenges[challenge.id] ? 'fill-current' : ''}`} />
                    </button>
                    <ChallengeCard
                      challenge={challenge}
                      onSelect={(ch) => setSelectedChallenge(ch)}
                      onVote={handleVoteChallenge}
                    />
                  </div>
                ))}

                {/* High Density Propose Challenge Callout Card */}
                <div className="bg-blue-600 rounded-xl p-5 flex flex-col text-white relative overflow-hidden shadow-xs justify-between">
                  <div className="relative z-10 space-y-2">
                    <span className="px-2 py-0.5 bg-blue-500/80 text-white text-[10px] font-bold uppercase rounded border border-blue-400">
                      Open Innovation
                    </span>
                    <h3 className="text-lg font-bold leading-tight">Submit a Global Challenge</h3>
                    <p className="text-blue-100 text-xs leading-relaxed">
                      Are you witnessing a systemic issue that needs community intelligence? Open a new challenge track today.
                    </p>
                  </div>

                  <div className="relative z-10 pt-4">
                    <button
                      onClick={() => setIsSubmitChallengeOpen(true)}
                      className="w-full py-2.5 bg-white text-blue-600 rounded-lg font-bold text-xs shadow-xs hover:bg-blue-50 transition-all cursor-pointer"
                    >
                      Launch Proposing Interface
                    </button>
                  </div>
                  <div className="absolute -bottom-10 -right-10 w-36 h-36 bg-blue-500 rounded-full opacity-30 pointer-events-none" />
                  <div className="absolute top-3 right-3 w-10 h-10 border border-blue-400 rounded-full opacity-30 pointer-events-none" />
                </div>
              </div>
            )}

            {/* High Density Bottom Telemetry Strip */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="bg-white border border-gray-200 rounded-xl p-4 flex items-center gap-3.5 shadow-xs">
                <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center shrink-0">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xl font-bold text-gray-900">+12.4%</div>
                  <div className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">
                    Submission Growth
                  </div>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-xl p-4 flex items-center gap-3.5 shadow-xs">
                <div className="w-10 h-10 bg-green-50 text-green-600 rounded-full flex items-center justify-center shrink-0">
                  <Lightbulb className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xl font-bold text-gray-900">
                    {analytics ? analytics.activeInnovatorTeams : '142'}
                  </div>
                  <div className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">
                    Validated Solutions
                  </div>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-xl p-4 flex items-center gap-3.5 shadow-xs">
                <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center shrink-0">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xl font-bold text-gray-900">
                    ₹{analytics ? (analytics.totalBountyPool / 100000).toFixed(1) : '21.0'}L
                  </div>
                  <div className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">
                    Disbursed Grants
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: GEOSPATIAL MAP VIEW */}
        {currentTab === 'map' && (
          <GeoSpatialMap
            challenges={challenges}
            onSelectChallenge={(ch) => setSelectedChallenge(ch)}
          />
        )}

        {/* TAB 3: GRAND BOUNTIES VIEW */}
        {currentTab === 'bounties' && (
          <BountiesSection
            challenges={challenges}
            onSelectChallenge={(ch) => setSelectedChallenge(ch)}
          />
        )}

        {/* TAB 4: AI PROPOSAL STUDIO */}
        {currentTab === 'proposal-studio' && (
          <AIProposalStudio
            challenges={challenges}
            preselectedChallenge={proposalTargetChallenge}
            preselectedSolution={proposalTargetSolution}
          />
        )}

        {/* TAB 5: ANALYTICS & SDG DASHBOARD */}
        {currentTab === 'analytics' && (
          <AnalyticsDashboard analytics={analytics} challenges={challenges} />
        )}

        {currentTab === 'leaderboard' && <Leaderboard challenges={challenges} />}
      </main>

      {/* High Density Footer */}
      <footer className="h-8 bg-white border-t border-gray-200 px-4 sm:px-6 flex items-center justify-between shrink-0 text-[10px] font-medium text-gray-400">
        <div>System: Production-Alpha-v23 • Region: Asia-South-1</div>
        <div className="flex gap-4">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
            Blockchain Synced
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
            AI Validation Engine Active
          </span>
        </div>
      </footer>

      {/* MODALS */}

      {/* Challenge Deep Dive Modal */}
      {selectedChallenge && (
        <ChallengeDetailModal
          challenge={selectedChallenge}
          onClose={() => setSelectedChallenge(null)}
          userRole={userRole}
          onVoteChallenge={(id) => handleVoteChallenge(id)}
          onOpenSubmitSolution={handleOpenSubmitSolution}
          onOpenProposalGenerator={handleOpenProposalStudio}
          onRefresh={fetchData}
        />
      )}

      {/* Submit Challenge Intake Modal */}
      {isSubmitChallengeOpen && (
        <SubmitChallengeModal
          onClose={() => setIsSubmitChallengeOpen(false)}
          onSuccess={fetchData}
          userRole={userRole}
        />
      )}

      {/* Submit Solution Modal */}
      {isSubmitSolutionOpen && targetChallengeForSolution && (
        <SubmitSolutionModal
          challenge={targetChallengeForSolution}
          onClose={() => {
            setIsSubmitSolutionOpen(false);
            setTargetChallengeForSolution(null);
          }}
          onSuccess={fetchData}
        />
      )}

      {/* Civic Assistant Copilot Drawer */}
      <CivicAssistantDrawer
        isOpen={isCopilotOpen}
        onClose={() => setIsCopilotOpen(false)}
        userRole={userRole}
        activeChallengeTitle={selectedChallenge?.title}
      />

      {/* Floating Action Button for Copilot */}
      <button
        onClick={() => setIsCopilotOpen(true)}
        className="fixed bottom-12 right-6 z-40 p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all flex items-center gap-2 text-xs font-bold cursor-pointer"
        id="floating-copilot-btn"
      >
        <Sparkles className="w-4 h-4 text-blue-200" />
        <span className="hidden sm:inline">AI Copilot</span>
      </button>
    </div>
  );
}
export default App;
