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
  MessageSquare
} from 'lucide-react';
import { Challenge, Solution, UserRole, AnalyticsSummary, ChallengeCategory } from './types';
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
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'upvotes' | 'bounty' | 'urgency' | 'newest'>('upvotes');
  const [userRole, setUserRole] = useState<UserRole>('innovator');
  const [currentTab, setCurrentTab] = useState<'challenges' | 'map' | 'bounties' | 'proposals' | 'analytics'>('challenges');

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
      if (data.success && data.data) {
        setChallenges((prev) =>
          prev.map((c) =>
            c.id === challengeId
              ? {
                  ...c,
                  upvotes: data.data.upvotes,
                  hasUpvoted: data.data.hasUpvoted,
                }
              : c
          )
        );
        if (selectedChallenge && selectedChallenge.id === challengeId) {
          setSelectedChallenge((prev) =>
            prev
              ? {
                  ...prev,
                  upvotes: data.data.upvotes,
                  hasUpvoted: data.data.hasUpvoted,
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
    setCurrentTab('proposals');
    if (selectedChallenge) setSelectedChallenge(null);
  };

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
                    setSearchQuery('');
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

            {/* Challenge Cards Grid */}
            {loading ? (
              <div className="py-16 text-center text-gray-500 space-y-2">
                <RefreshCw className="w-8 h-8 mx-auto animate-spin text-blue-600" />
                <p className="text-xs font-semibold">Loading societal challenges database...</p>
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
                  }}
                  className="px-4 py-2 bg-gray-900 text-white text-xs font-semibold rounded-lg hover:bg-black"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredChallenges.map((challenge) => (
                  <ChallengeCard
                    key={challenge.id}
                    challenge={challenge}
                    onSelect={(ch) => setSelectedChallenge(ch)}
                    onVote={handleVoteChallenge}
                  />
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
                    {analytics ? analytics.totalSolutions : '142'}
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
                    ₹{analytics ? (analytics.totalBountyAmountINR / 100000).toFixed(1) : '21.0'}L
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
        {currentTab === 'proposals' && (
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
