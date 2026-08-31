import React, { useState } from 'react';
import {
  X,
  Sparkles,
  Lightbulb,
  Cpu,
  GraduationCap,
  DollarSign,
  Calendar,
  Layers,
  Send,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';
import { Challenge, Solution } from '../types';

interface SubmitSolutionModalProps {
  challenge: Challenge;
  onClose: () => void;
  onSuccess: () => void;
}

export const SubmitSolutionModal: React.FC<SubmitSolutionModalProps> = ({
  challenge,
  onClose,
  onSuccess,
}) => {
  const [teamName, setTeamName] = useState('');
  const [leadName, setLeadName] = useState('');
  const [leadEmail, setLeadEmail] = useState('');
  const [collegeOrOrg, setCollegeOrOrg] = useState('');
  const [title, setTitle] = useState('');
  const [abstract, setAbstract] = useState('');
  const [methodology, setMethodology] = useState('');
  const [trlLevel, setTrlLevel] = useState<number>(6);
  const [budget, setBudget] = useState<number>(350000);
  const [durationWeeks, setDurationWeeks] = useState<number>(14);
  const [prototypeUrl, setPrototypeUrl] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [videoPitchUrl, setVideoPitchUrl] = useState('');

  // AI Pre-screen State
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [aiEvaluation, setAiEvaluation] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const trlDescriptions: Record<number, string> = {
    1: 'TRL 1 - Basic scientific principles observed',
    2: 'TRL 2 - Technology concept formulated',
    3: 'TRL 3 - Experimental proof of concept',
    4: 'TRL 4 - Technology validated in lab',
    5: 'TRL 5 - Technology validated in relevant environment',
    6: 'TRL 6 - Prototype demonstrated in relevant environment',
    7: 'TRL 7 - System prototype demonstration in operational field',
    8: 'TRL 8 - Actual system completed and qualified',
    9: 'TRL 9 - Actual system proven in operational field deployment',
  };

  const handleAIPreScreen = async () => {
    if (!title || !methodology) return;
    setIsEvaluating(true);
    try {
      const res = await fetch('/api/ai/evaluate-solution', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          challengeTitle: challenge.title,
          challengeDescription: challenge.description,
          solutionTitle: title,
          methodology: `${abstract}\n\nTechnical Architecture:\n${methodology}`,
          trlLevel,
          budgetINR: budget,
        }),
      });
      const data = await res.json();
      if (data.success && data.data) {
        setAiEvaluation(data.data);
      }
    } catch (err) {
      console.error('Evaluation error:', err);
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !abstract.trim() || !teamName.trim()) return;

    setIsSubmitting(true);
    try {
      const payload = {
        title,
        teamName,
        teamLead: {
          name: leadName || 'Team Innovator',
          email: leadEmail || 'innovator@team.org',
          organizationOrCollege: collegeOrOrg || 'Innovation Lab',
        },
        abstract,
        methodology,
        trlLevel: Number(trlLevel),
        estimatedBudget: Number(budget),
        durationWeeks: Number(durationWeeks),
        prototypeUrl,
        githubUrl,
        videoPitchUrl,
        aiFeasibilityScore: aiEvaluation?.overallFeasibilityScore || 88,
        aiReviewSummary:
          aiEvaluation?.executiveSummary || 'Technical submission evaluated for field feasibility.',
        milestones: [
          {
            id: 'm1',
            title: 'Lab bench-scale testing & component validation',
            targetDate: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
            fundsPercentage: 35,
            status: 'pending',
          },
          {
            id: 'm2',
            title: 'Field installation of community demo unit in district',
            targetDate: new Date(Date.now() + 75 * 86400000).toISOString().split('T')[0],
            fundsPercentage: 45,
            status: 'pending',
          },
          {
            id: 'm3',
            title: 'NABL certification and municipal maintenance transfer',
            targetDate: new Date(Date.now() + 120 * 86400000).toISOString().split('T')[0],
            fundsPercentage: 20,
            status: 'pending',
          },
        ],
      };

      const res = await fetch(`/api/challenges/${challenge.id}/solutions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        onSuccess();
        onClose();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div
        className="bg-white rounded-2xl border border-slate-200 w-full max-w-3xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        id="submit-solution-modal"
      >
        {/* Modal Header */}
        <div className="p-4 sm:p-6 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider">
              SIH26043 Solution Proposal
            </span>
            <h2 className="text-lg font-bold text-slate-900">
              Submit Innovation for: &ldquo;{challenge.title}&rdquo;
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-5">
          {/* AI Pre-screen Results Banner */}
          {aiEvaluation && (
            <div className="p-4 rounded-xl bg-gradient-to-br from-indigo-50 via-slate-50 to-emerald-50 border border-indigo-300 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-indigo-600" />
                  <h3 className="font-bold text-xs text-indigo-950">
                    JanSetu AI Feasibility Pre-Screen Result
                  </h3>
                </div>
                <span className="px-3 py-1 bg-indigo-600 text-white font-extrabold text-xs rounded-lg">
                  Score: {aiEvaluation.overallFeasibilityScore}/100 ({aiEvaluation.verdict})
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center text-xs">
                <div className="p-2 bg-white rounded-lg border border-indigo-100">
                  <p className="text-[10px] text-slate-500">Tech Feasibility</p>
                  <p className="font-bold text-indigo-700">{aiEvaluation.rubricBreakdown.technicalFeasibility}/20</p>
                </div>
                <div className="p-2 bg-white rounded-lg border border-indigo-100">
                  <p className="text-[10px] text-slate-500">Scalability</p>
                  <p className="font-bold text-indigo-700">{aiEvaluation.rubricBreakdown.scalability}/20</p>
                </div>
                <div className="p-2 bg-white rounded-lg border border-indigo-100">
                  <p className="text-[10px] text-slate-500">Cost Efficiency</p>
                  <p className="font-bold text-indigo-700">{aiEvaluation.rubricBreakdown.costEffectiveness}/20</p>
                </div>
                <div className="p-2 bg-white rounded-lg border border-indigo-100">
                  <p className="text-[10px] text-slate-500">Social Impact</p>
                  <p className="font-bold text-indigo-700">{aiEvaluation.rubricBreakdown.socialEnvironmentalImpact}/20</p>
                </div>
                <div className="p-2 bg-white rounded-lg border border-indigo-100">
                  <p className="text-[10px] text-slate-500">Risk Mitigation</p>
                  <p className="font-bold text-indigo-700">{aiEvaluation.rubricBreakdown.riskMitigation}/20</p>
                </div>
              </div>

              <p className="text-xs text-slate-700 leading-relaxed bg-white/70 p-2.5 rounded-lg border border-indigo-100">
                <strong>Jury Note:</strong> {aiEvaluation.executiveSummary}
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Team Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Team / Startup Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  placeholder="e.g. AquaShield Innovators"
                  required
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  College / Research Institution <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={collegeOrOrg}
                  onChange={(e) => setCollegeOrOrg(e.target.value)}
                  placeholder="e.g. IIT Kanpur / Startup Incubator"
                  required
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Team Lead Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={leadName}
                  onChange={(e) => setLeadName(e.target.value)}
                  placeholder="e.g. Ananya Deshmukh"
                  required
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Contact Email <span className="text-rose-500">*</span>
                </label>
                <input
                  type="email"
                  value={leadEmail}
                  onChange={(e) => setLeadEmail(e.target.value)}
                  placeholder="e.g. ananya@iitk.ac.in"
                  required
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs"
                />
              </div>
            </div>

            {/* Solution Title */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Solution Title <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Nano-Alumina Biochar Cartridge with Zero Wastewater Reject"
                required
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-semibold"
              />
            </div>

            {/* Abstract */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Executive Abstract & Value Proposition <span className="text-rose-500">*</span>
              </label>
              <textarea
                rows={2}
                value={abstract}
                onChange={(e) => setAbstract(e.target.value)}
                placeholder="Summarize the core innovation, how it solves the root cause, and the per-unit cost..."
                required
                className="w-full p-2.5 bg-white border border-slate-300 rounded-lg text-xs"
              />
            </div>

            {/* Technical Methodology */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-slate-700">
                  Technical Architecture & Methodology <span className="text-rose-500">*</span>
                </label>
                <button
                  type="button"
                  onClick={handleAIPreScreen}
                  disabled={isEvaluating || !title || !methodology}
                  className="text-[11px] text-indigo-700 hover:text-indigo-900 font-bold flex items-center gap-1"
                >
                  <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                  {isEvaluating ? 'Evaluating Rubric...' : 'AI Pre-Screen Feasibility'}
                </button>
              </div>
              <textarea
                rows={4}
                value={methodology}
                onChange={(e) => setMethodology(e.target.value)}
                placeholder="Detail technical components, engineering drawings, sensor telemetry, chemical reactions, power requirements..."
                required
                className="w-full p-3 bg-white border border-slate-300 rounded-lg text-xs leading-relaxed"
              />
            </div>

            {/* TRL Slider & Budget */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
              <div className="sm:col-span-1">
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-slate-700">TRL Level: {trlLevel}</label>
                </div>
                <input
                  type="range"
                  min="1"
                  max="9"
                  value={trlLevel}
                  onChange={(e) => setTrlLevel(Number(e.target.value))}
                  className="w-full accent-indigo-600 cursor-pointer"
                />
                <p className="text-[10px] text-slate-500 mt-1 truncate">{trlDescriptions[trlLevel]}</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Estimated Budget (INR)</label>
                <input
                  type="number"
                  value={budget}
                  onChange={(e) => setBudget(Number(e.target.value))}
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Timeline (Weeks)</label>
                <input
                  type="number"
                  value={durationWeeks}
                  onChange={(e) => setDurationWeeks(Number(e.target.value))}
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs"
                />
              </div>
            </div>

            {/* URLs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Demo / Prototype URL</label>
                <input
                  type="url"
                  value={prototypeUrl}
                  onChange={(e) => setPrototypeUrl(e.target.value)}
                  placeholder="https://myproto.io or Figma link"
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">GitHub / Open Hardware Repo</label>
                <input
                  type="url"
                  value={githubUrl}
                  onChange={(e) => setGithubUrl(e.target.value)}
                  placeholder="https://github.com/myteam/project"
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs"
                />
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center gap-1.5"
                id="submit-solution-final-btn"
              >
                <Send className="w-4 h-4" />
                {isSubmitting ? 'Submitting Proposal...' : 'Submit SIH Solution'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
