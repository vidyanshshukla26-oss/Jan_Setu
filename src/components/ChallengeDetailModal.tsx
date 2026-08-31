import React, { useState } from 'react';
import {
  X,
  MapPin,
  ThumbsUp,
  Award,
  Lightbulb,
  ShieldCheck,
  Calendar,
  Sparkles,
  ExternalLink,
  PlusCircle,
  MessageSquare,
  CheckCircle2,
  AlertTriangle,
  Building,
  Target,
  FileCheck,
  TrendingUp,
  Cpu,
  HeartHandshake,
  DollarSign,
  Send,
  GitBranch,
  Layers,
  ChevronRight
} from 'lucide-react';
import { Challenge, Solution, UserRole } from '../types';

interface ChallengeDetailModalProps {
  challenge: Challenge;
  onClose: () => void;
  userRole: UserRole;
  onVoteChallenge: (id: string) => void;
  onOpenSubmitSolution: (challenge: Challenge) => void;
  onOpenProposalGenerator: (challenge: Challenge, solution?: Solution) => void;
  onRefresh: () => void;
}

export const ChallengeDetailModal: React.FC<ChallengeDetailModalProps> = ({
  challenge,
  onClose,
  userRole,
  onVoteChallenge,
  onOpenSubmitSolution,
  onOpenProposalGenerator,
  onRefresh,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'ai_triage' | 'solutions' | 'bounty' | 'discussion'>('overview');
  const [commentText, setCommentText] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [pledgeAmount, setPledgeAmount] = useState('100000');
  const [sponsorName, setSponsorName] = useState('');
  const [isSubmittingPledge, setIsSubmittingPledge] = useState(false);
  const [showPledgeForm, setShowPledgeForm] = useState(false);

  const handlePostComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    setIsSubmittingComment(true);
    try {
      const res = await fetch(`/api/challenges/${challenge.id}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          authorName: userRole === 'citizen' ? 'Citizen Contributor' : `${userRole.toUpperCase()} Contributor`,
          authorRole: userRole,
          text: commentText,
          isOfficialUpdate: userRole === 'government_csr' || userRole === 'evaluator',
        }),
      });
      if (res.ok) {
        setCommentText('');
        onRefresh();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const handlePledgeGrant = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingPledge(true);
    try {
      const res = await fetch(`/api/challenges/${challenge.id}/pledge`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sponsorName: sponsorName || 'Civic Benefactor / CSR',
          sponsorType: 'CSR Foundation',
          amount: Number(pledgeAmount) || 50000,
        }),
      });
      if (res.ok) {
        setShowPledgeForm(false);
        setSponsorName('');
        onRefresh();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmittingPledge(false);
    }
  };

  const handleVoteSolution = async (solutionId: string) => {
    try {
      const res = await fetch(`/api/solutions/${solutionId}/vote`, { method: 'POST' });
      if (res.ok) {
        onRefresh();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleEndorseSolution = async (solutionId: string) => {
    try {
      const res = await fetch(`/api/solutions/${solutionId}/endorse`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'pilot_approved',
          officialComment: 'Official Jury endorsement for milestone 1 field pilot allocation.',
        }),
      });
      if (res.ok) {
        onRefresh();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div
        className="bg-white rounded-2xl border border-slate-200 w-full max-w-5xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        id="challenge-detail-modal"
      >
        {/* Modal Top Header */}
        <div className="p-4 sm:p-6 border-b border-slate-200 bg-slate-50/80 flex items-start justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 bg-emerald-700 text-white text-xs font-bold rounded-md">
                SDG {challenge.sdgNumber}: {challenge.sdgName}
              </span>
              <span className="px-2.5 py-0.5 bg-slate-200 text-slate-800 text-xs font-semibold rounded-md">
                {challenge.category}
              </span>
              <span className="px-2.5 py-0.5 bg-rose-100 text-rose-800 text-xs font-bold rounded-md border border-rose-300">
                {challenge.severity} Urgency ({challenge.severityScore}/100)
              </span>
              {challenge.verifiedByOfficial && (
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md border border-emerald-300">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                  Verified by Authority
                </span>
              )}
            </div>

            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 leading-tight">
              {challenge.title}
            </h2>

            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600">
              <span className="flex items-center gap-1 font-medium">
                <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                {challenge.location.address || `${challenge.location.city}, ${challenge.location.state}`}
              </span>
              <span className="flex items-center gap-1 font-semibold text-emerald-700">
                <Target className="w-3.5 h-3.5" />
                {challenge.impactedPopulation.toLocaleString()} citizens directly impacted
              </span>
              <span className="flex items-center gap-1 text-slate-500">
                <Calendar className="w-3.5 h-3.5" />
                Reported {challenge.reportedDate} by {challenge.reportedBy.name}
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/70 transition-colors shrink-0"
            id="close-modal-btn"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 px-4 sm:px-6 border-b border-slate-200 bg-white overflow-x-auto text-xs font-semibold">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-3 px-3 border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'overview'
                ? 'border-emerald-600 text-emerald-800'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Overview & Ground Evidence
          </button>

          <button
            onClick={() => setActiveTab('ai_triage')}
            className={`py-3 px-3 border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'ai_triage'
                ? 'border-indigo-600 text-indigo-800'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            AI Engineering Triage
          </button>

          <button
            onClick={() => setActiveTab('solutions')}
            className={`py-3 px-3 border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'solutions'
                ? 'border-emerald-600 text-emerald-800'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
            Solutions ({challenge.solutionsCount})
          </button>

          <button
            onClick={() => setActiveTab('bounty')}
            className={`py-3 px-3 border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'bounty'
                ? 'border-amber-600 text-amber-800'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Award className="w-3.5 h-3.5 text-amber-600" />
            Grant Pool (₹{(challenge.bountyAmount / 100000).toFixed(1)}L)
          </button>

          <button
            onClick={() => setActiveTab('discussion')}
            className={`py-3 px-3 border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'discussion'
                ? 'border-emerald-600 text-emerald-800'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5 text-teal-600" />
            Discussions & Updates ({challenge.comments.length})
          </button>
        </div>

        {/* Modal Scrollable Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-6">
          {/* TAB 1: OVERVIEW & EVIDENCE */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Problem Description */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                  Problem Context & Field Summary
                </h4>
                <p className="text-slate-800 text-sm leading-relaxed whitespace-pre-line bg-slate-50 p-4 rounded-xl border border-slate-200">
                  {challenge.description}
                </p>
              </div>

              {/* Photo Evidence Gallery */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                  Photographic Evidence & Field Reports
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {challenge.evidenceImages.map((img, idx) => (
                    <div key={idx} className="relative rounded-xl overflow-hidden border border-slate-200 h-52 group">
                      <img
                        src={img}
                        alt={`Evidence ${idx + 1}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute bottom-2 left-2 px-2 py-1 bg-slate-900/80 text-white text-[10px] rounded-md font-semibold">
                        Field Evidence #{idx + 1}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Required Disciplines & Authority Verification */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border border-slate-200 bg-white">
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Cpu className="w-4 h-4 text-indigo-600" />
                    Required Technical Disciplines
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {challenge.primaryTechDisciplines.map((t, idx) => (
                      <span key={idx} className="px-2.5 py-1 bg-indigo-50 text-indigo-800 text-xs font-medium rounded-lg border border-indigo-200">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 bg-white">
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Building className="w-4 h-4 text-emerald-600" />
                    Municipal & Civic Authority
                  </h4>
                  <p className="text-xs text-slate-700">
                    <span className="font-semibold text-slate-900">Verification Authority:</span>{' '}
                    {challenge.officialVerifierName || 'District Administration Taskforce'}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    Geo-coordinates: {challenge.location.latitude}, {challenge.location.longitude} ({challenge.location.pincode})
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: AI ENGINEERING TRIAGE (GEMINI 3.7 FLASH) */}
          {activeTab === 'ai_triage' && (
            <div className="space-y-6">
              <div className="p-4 bg-gradient-to-br from-indigo-50 via-slate-50 to-emerald-50 rounded-xl border border-indigo-200">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-5 h-5 text-indigo-600" />
                  <h3 className="font-bold text-indigo-950 text-sm">
                    JanSetu AI Societal Intelligence Analysis (Gemini 3.7 Flash)
                  </h3>
                </div>
                <p className="text-xs text-indigo-900 leading-relaxed">
                  {challenge.aiAnalysis?.summary ||
                    'Automated multi-modal triage performed using Gemini 3.7 Flash, synthesizing geocoded severity, root causality, and target Technology Readiness Level.'}
                </p>
              </div>

              {/* Root causes & Suggested Approaches */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-2xs">
                  <h4 className="text-xs font-bold text-rose-800 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-rose-600" />
                    Systemic Root Causes
                  </h4>
                  <ul className="space-y-2 text-xs text-slate-700">
                    {challenge.aiAnalysis?.rootCauses?.map((cause, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0" />
                        <span>{cause}</span>
                      </li>
                    )) || (
                      <li className="text-slate-500 italic">No specific root causes identified.</li>
                    )}
                  </ul>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-2xs">
                  <h4 className="text-xs font-bold text-emerald-800 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                    <Lightbulb className="w-4 h-4 text-emerald-600" />
                    High-Potential Solution Directions
                  </h4>
                  <ul className="space-y-2 text-xs text-slate-700">
                    {challenge.aiAnalysis?.suggestedApproaches?.map((approach, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                        <span>{approach}</span>
                      </li>
                    )) || (
                      <li className="text-slate-500 italic">No suggested approaches available.</li>
                    )}
                  </ul>
                </div>
              </div>

              {/* TRL Target & Timeline Metrics */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 text-center">
                  <p className="text-[11px] font-medium text-slate-500 uppercase">Target Readiness Level</p>
                  <p className="text-xl font-bold text-indigo-700 mt-1">
                    TRL {challenge.aiAnalysis?.recommendedTRLTarget || 7}+
                  </p>
                  <p className="text-[10px] text-slate-500 mt-0.5">Field Prototype / Demonstration</p>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 text-center">
                  <p className="text-[11px] font-medium text-slate-500 uppercase">Pilot Rollout Window</p>
                  <p className="text-xl font-bold text-emerald-700 mt-1">
                    {challenge.aiAnalysis?.estimatedTimelineMonths || 6} Months
                  </p>
                  <p className="text-[10px] text-slate-500 mt-0.5">From grant release to pilot handoff</p>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 text-center">
                  <p className="text-[11px] font-medium text-slate-500 uppercase">Calculated Severity</p>
                  <p className="text-xl font-bold text-rose-700 mt-1">
                    {challenge.severityScore}/100
                  </p>
                  <p className="text-[10px] text-slate-500 mt-0.5">High public health & safety stake</p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: SOLUTIONS & LEADERBOARD */}
          {activeTab === 'solutions' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-slate-900 text-base">
                    Submitted Innovations & Prototypes ({challenge.solutions.length})
                  </h3>
                  <p className="text-xs text-slate-500">
                    Peer-reviewed engineering solutions with TRL ratings, budgets, and milestone roadmaps.
                  </p>
                </div>

                <button
                  onClick={() => onOpenSubmitSolution(challenge)}
                  className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs"
                  id="tab-submit-solution-btn"
                >
                  <PlusCircle className="w-4 h-4" />
                  Submit New Solution
                </button>
              </div>

              {challenge.solutions.length === 0 ? (
                <div className="p-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-300">
                  <Lightbulb className="w-10 h-10 text-slate-400 mx-auto mb-2" />
                  <p className="text-sm font-semibold text-slate-700">No solutions submitted yet.</p>
                  <p className="text-xs text-slate-500 mt-1">
                    Be the first SIH innovator team to submit a technical proposal and claim the grant!
                  </p>
                  <button
                    onClick={() => onOpenSubmitSolution(challenge)}
                    className="mt-4 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold inline-flex items-center gap-1.5"
                  >
                    <PlusCircle className="w-4 h-4" /> Submit Solution Now
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {challenge.solutions.map((sol) => (
                    <div
                      key={sol.id}
                      className="p-5 rounded-xl border border-slate-200 bg-white hover:border-indigo-300 transition-all shadow-xs"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 bg-indigo-100 text-indigo-800 text-[10px] font-bold rounded-md">
                              TRL Level {sol.trlLevel}
                            </span>
                            <span
                              className={`px-2 py-0.5 text-[10px] font-bold rounded-md ${
                                sol.status === 'pilot_approved'
                                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                  : 'bg-slate-100 text-slate-700'
                              }`}
                            >
                              {sol.status === 'pilot_approved' ? 'Pilot Grant Approved' : sol.status.toUpperCase()}
                            </span>
                            {sol.aiFeasibilityScore && (
                              <span className="px-2 py-0.5 bg-emerald-50 text-emerald-800 text-[10px] font-bold rounded-md border border-emerald-200 flex items-center gap-1">
                                <Sparkles className="w-3 h-3 text-emerald-600" />
                                AI Score: {sol.aiFeasibilityScore}/100
                              </span>
                            )}
                          </div>

                          <h4 className="text-base font-bold text-slate-900">{sol.title}</h4>
                          <p className="text-xs text-slate-600 font-medium">
                            By <span className="text-indigo-700 font-semibold">{sol.teamName}</span> (
                            {sol.teamLead.organizationOrCollege}) • Lead: {sol.teamLead.name}
                          </p>
                        </div>

                        {/* Actions for Solution */}
                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            onClick={() => handleVoteSolution(sol.id)}
                            className="flex items-center gap-1 px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors"
                          >
                            <ThumbsUp className="w-3.5 h-3.5 text-emerald-600" />
                            <span>{sol.upvotes}</span>
                          </button>

                          {(userRole === 'government_csr' || userRole === 'evaluator') && (
                            <button
                              onClick={() => handleEndorseSolution(sol.id)}
                              className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              Endorse Pilot
                            </button>
                          )}

                          <button
                            onClick={() => onOpenProposalGenerator(challenge, sol)}
                            className="px-3 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold rounded-lg border border-indigo-200 transition-colors flex items-center gap-1"
                            title="Generate Formal Grant Proposal"
                          >
                            <FileCheck className="w-3.5 h-3.5 text-indigo-600" />
                            Proposal
                          </button>
                        </div>
                      </div>

                      {/* Abstract & Tech Methodology */}
                      <p className="text-xs text-slate-700 mt-3 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100">
                        {sol.abstract}
                      </p>

                      {/* Milestones & Budget Overview */}
                      <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between text-xs text-slate-600 gap-2">
                        <div className="flex items-center gap-4">
                          <span className="font-semibold text-slate-900">
                            Budget Req: ₹{(sol.estimatedBudget / 100000).toFixed(2)} Lakh
                          </span>
                          <span>Timeline: {sol.durationWeeks} Weeks</span>
                          <span>Endorsements: {sol.endorsements} Jury Reviews</span>
                        </div>

                        {sol.prototypeUrl && (
                          <a
                            href={sol.prototypeUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                          >
                            <span>Live Prototype / Repo</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>

                      {/* Milestone Progress Bar */}
                      {sol.milestones && sol.milestones.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-slate-100">
                          <p className="text-[11px] font-bold text-slate-500 uppercase mb-2">Milestone Escrow Roadmap</p>
                          <div className="space-y-2">
                            {sol.milestones.map((m, mIdx) => (
                              <div key={m.id || mIdx} className="flex items-center justify-between text-xs bg-slate-50 p-2 rounded-md">
                                <div className="flex items-center gap-2">
                                  <span
                                    className={`w-2 h-2 rounded-full ${
                                      m.status === 'completed'
                                        ? 'bg-emerald-500'
                                        : m.status === 'in_review'
                                        ? 'bg-amber-500'
                                        : 'bg-slate-300'
                                    }`}
                                  />
                                  <span className="font-medium text-slate-800">{m.title}</span>
                                </div>
                                <div className="flex items-center gap-3 text-slate-500 text-[11px]">
                                  <span>{m.fundsPercentage}% Funds</span>
                                  <span className="capitalize font-semibold text-slate-700">({m.status.replace('_', ' ')})</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: GRANT POOL & CSR SPONSORS */}
          {activeTab === 'bounty' && (
            <div className="space-y-6">
              <div className="p-5 bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent rounded-2xl border border-amber-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800">
                    Total Committed Challenge Grant Pool
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-amber-950 font-['Space_Grotesk'] mt-0.5">
                    ₹{challenge.bountyAmount.toLocaleString()} INR
                  </h3>
                  <p className="text-xs text-amber-900 mt-1">
                    Disbursed directly across verified pilot demonstration milestones (TRL 5-8).
                  </p>
                </div>

                <button
                  onClick={() => setShowPledgeForm(!showPledgeForm)}
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all flex items-center gap-1.5 shrink-0"
                >
                  <HeartHandshake className="w-4 h-4" />
                  {showPledgeForm ? 'Hide Pledge Form' : 'Pledge Grant / CSR Fund'}
                </button>
              </div>

              {/* Pledge Form Modal/Dropdown */}
              {showPledgeForm && (
                <form onSubmit={handlePledgeGrant} className="p-4 bg-slate-50 rounded-xl border border-amber-300 space-y-3">
                  <h4 className="text-xs font-bold text-slate-800 uppercase">Sponsor Challenge Pilot</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-medium text-slate-700 mb-1">
                        Sponsor / Organization Name
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Tata Sustainability Trust / District Mission"
                        value={sponsorName}
                        onChange={(e) => setSponsorName(e.target.value)}
                        required
                        className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-slate-700 mb-1">
                        Grant Amount (INR)
                      </label>
                      <select
                        value={pledgeAmount}
                        onChange={(e) => setPledgeAmount(e.target.value)}
                        className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs"
                      >
                        <option value="50000">₹50,000 (Micro-Grant)</option>
                        <option value="100000">₹1,00,000 (Lab Proof Grant)</option>
                        <option value="250000">₹2,50,000 (Field Pilot Grant)</option>
                        <option value="500000">₹5,00,000 (Full Solution Bounty)</option>
                        <option value="1000000">₹10,00,000 (Grand Innovation Grant)</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setShowPledgeForm(false)}
                      className="px-3 py-1 text-xs text-slate-600 font-medium"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmittingPledge}
                      className="px-4 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold"
                    >
                      {isSubmittingPledge ? 'Confirming...' : 'Confirm CSR Pledge'}
                    </button>
                  </div>
                </form>
              )}

              {/* Active Sponsors List */}
              <div>
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
                  Sponsors & Funding Partners ({challenge.sponsors.length})
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {challenge.sponsors.map((sp) => (
                    <div
                      key={sp.id}
                      className="p-4 rounded-xl border border-slate-200 bg-white flex items-center justify-between shadow-2xs"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-sm">
                          <Building className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-bold text-xs text-slate-900">{sp.name}</p>
                          <p className="text-[10px] text-slate-500">{sp.type}</p>
                        </div>
                      </div>
                      <span className="font-extrabold text-xs text-emerald-800 bg-emerald-50 px-2 py-1 rounded-md border border-emerald-200">
                        ₹{(sp.amount / 100000).toFixed(2)}L
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: DISCUSSIONS & GROUND UPDATES */}
          {activeTab === 'discussion' && (
            <div className="space-y-6">
              {/* Comment Input */}
              <form onSubmit={handlePostComment} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                <label className="block text-xs font-bold text-slate-800">
                  Post Ground Reality Update or Technical Inquiry
                </label>
                <textarea
                  rows={3}
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Share verified ground metrics, water test reports, field hurdles, or mentor feedback..."
                  className="w-full p-3 bg-white border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  required
                />
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-slate-500">
                    Posting as: <strong className="text-slate-800">{userRole.toUpperCase()}</strong>
                  </span>
                  <button
                    type="submit"
                    disabled={isSubmittingComment}
                    className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-xs"
                  >
                    <Send className="w-3.5 h-3.5" />
                    {isSubmittingComment ? 'Posting...' : 'Post Update'}
                  </button>
                </div>
              </form>

              {/* Comment Feed */}
              <div className="space-y-3">
                {challenge.comments.length === 0 ? (
                  <p className="text-xs text-slate-500 italic text-center py-6">
                    No community discussions posted yet. Be the first to share an update!
                  </p>
                ) : (
                  challenge.comments.map((comment) => (
                    <div
                      key={comment.id}
                      className={`p-4 rounded-xl border ${
                        comment.isOfficialUpdate
                          ? 'bg-amber-50/70 border-amber-200'
                          : 'bg-white border-slate-200'
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs mb-1.5">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900">{comment.authorName}</span>
                          {comment.authorOrg && (
                            <span className="text-slate-500 text-[11px]">({comment.authorOrg})</span>
                          )}
                          <span className="px-1.5 py-0.5 bg-slate-100 text-slate-700 text-[10px] rounded font-semibold uppercase">
                            {comment.authorRole}
                          </span>
                          {comment.isOfficialUpdate && (
                            <span className="px-1.5 py-0.5 bg-amber-200 text-amber-900 text-[10px] rounded font-bold">
                              Official Update
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-slate-400">
                          {new Date(comment.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-xs text-slate-800 leading-relaxed">{comment.text}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Modal Bottom Footer Actions */}
        <div className="p-4 sm:p-5 border-t border-slate-200 bg-slate-50 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => onVoteChallenge(challenge.id)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-colors ${
                challenge.hasUpvoted
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                  : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-100'
              }`}
              id="modal-upvote-challenge-btn"
            >
              <ThumbsUp className={`w-4 h-4 ${challenge.hasUpvoted ? 'fill-emerald-700' : ''}`} />
              <span>{challenge.hasUpvoted ? 'Upvoted' : 'Upvote Priority'} ({challenge.upvotes})</span>
            </button>

            <button
              onClick={() => onOpenProposalGenerator(challenge)}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-800 border border-indigo-200 rounded-xl text-xs font-bold transition-colors"
              id="modal-generate-proposal-btn"
            >
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span>AI Proposal Memo</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onOpenSubmitSolution(challenge)}
              className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md transition-all hover:shadow-emerald-600/25"
              id="modal-submit-solution-btn"
            >
              <Lightbulb className="w-4 h-4" />
              <span>Submit Solution for this Challenge</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
