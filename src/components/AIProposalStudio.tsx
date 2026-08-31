import React, { useState } from 'react';
import {
  Sparkles,
  FileText,
  Copy,
  Check,
  Download,
  Building,
  Target,
  DollarSign,
  Calendar,
  CheckCircle2,
  Share2,
  Printer
} from 'lucide-react';
import { Challenge, Solution } from '../types';

interface AIProposalStudioProps {
  challenges: Challenge[];
  preselectedChallenge?: Challenge | null;
  preselectedSolution?: Solution | null;
}

export const AIProposalStudio: React.FC<AIProposalStudioProps> = ({
  challenges,
  preselectedChallenge,
  preselectedSolution,
}) => {
  const [selectedChallengeId, setSelectedChallengeId] = useState<string>(
    preselectedChallenge?.id || challenges[0]?.id || ''
  );
  const [selectedSolutionId, setSelectedSolutionId] = useState<string>(
    preselectedSolution?.id || ''
  );
  const [sponsorFocus, setSponsorFocus] = useState<string>(
    'CSR Section 135 & Municipal Innovation Grant'
  );
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [proposalData, setProposalData] = useState<any>(null);
  const [copied, setCopied] = useState<boolean>(false);

  const selectedChallenge = challenges.find((c) => c.id === selectedChallengeId);
  const solutionsList = selectedChallenge?.solutions || [];

  const handleGenerate = async () => {
    if (!selectedChallengeId) return;
    setIsGenerating(true);
    try {
      const res = await fetch('/api/ai/generate-proposal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          challengeId: selectedChallengeId,
          selectedSolutionId: selectedSolutionId || undefined,
          sponsorFocus,
        }),
      });
      const result = await res.json();
      if (result.success && result.data) {
        setProposalData(result.data);
      }
    } catch (err) {
      console.error('Proposal generation error:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    if (!proposalData) return;
    const text = `# ${proposalData.projectTitle}
## Executive Summary
${proposalData.executiveSummary}

## Problem Urgency & Ground Context
${proposalData.problemStatementAndUrgency}

## Proposed Technical Intervention
${proposalData.proposedInterventionModel}

## Budget Breakdown (Total: ₹${proposalData.totalGrantRequestedINR?.toLocaleString()} INR)
${proposalData.budgetBreakdown?.map((b: any) => `- ${b.head}: ₹${b.amountINR?.toLocaleString()} (${b.rationale})`).join('\n')}

## Execution Milestones
${proposalData.executionMilestones?.map((m: any) => `- ${m.month}: ${m.deliverable} -> Target: ${m.targetOutput}`).join('\n')}

## Measurable Impact KPIs
${proposalData.measurableImpactKPIs?.map((k: string) => `- ${k}`).join('\n')}

## CSR & Government Policy Alignment
${proposalData.csrAndGovernmentAlignment}`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Studio Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold shadow-md shadow-indigo-600/20">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              AI Formal CSR & Municipal Grant Proposal Studio
            </h2>
            <p className="text-xs text-slate-500">
              Synthesize institutional project memos, budget justifications, and KPI deliverables in seconds.
            </p>
          </div>
        </div>

        {/* Action Buttons if generated */}
        {proposalData && (
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied Markdown' : 'Copy Proposal'}</span>
            </button>

            <button
              onClick={() => window.print()}
              className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / PDF</span>
            </button>
          </div>
        )}
      </div>

      {/* Control Configuration Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200">
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            1. Select Target Societal Challenge
          </label>
          <select
            value={selectedChallengeId}
            onChange={(e) => {
              setSelectedChallengeId(e.target.value);
              setSelectedSolutionId('');
            }}
            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-medium"
          >
            {challenges.map((c) => (
              <option key={c.id} value={c.id}>
                SDG {c.sdgNumber}: {c.title.slice(0, 50)}...
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            2. Match Submitted Innovation / Team (Optional)
          </label>
          <select
            value={selectedSolutionId}
            onChange={(e) => setSelectedSolutionId(e.target.value)}
            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-medium"
          >
            <option value="">General Pilot Proposal (No specific team)</option>
            {solutionsList.map((s) => (
              <option key={s.id} value={s.id}>
                {s.title.slice(0, 45)} (by {s.teamName})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            3. Grant Framework / Sponsor Focus
          </label>
          <select
            value={sponsorFocus}
            onChange={(e) => setSponsorFocus(e.target.value)}
            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-medium"
          >
            <option value="CSR Section 135 & Corporate Sustainability">
              Corporate CSR Fund (Section 135 Compliance)
            </option>
            <option value="Smart Cities & Municipal Innovation Grant">
              Smart Cities Mission & Urban Local Body Grant
            </option>
            <option value="Jal Jeevan Mission / Water Sanitation Fund">
              Jal Jeevan Technology Sub-Mission
            </option>
            <option value="NABARD & Rural Livelihoods Innovation">
              NABARD Rural Infrastructure Promotion Fund
            </option>
            <option value="MeitY / StartinUP Grand Challenge">
              MeitY / DST Open Innovation Grand Challenge
            </option>
          </select>
        </div>
      </div>

      <div className="flex justify-center">
        <button
          onClick={handleGenerate}
          disabled={isGenerating}
          className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-emerald-600 hover:from-indigo-700 hover:to-emerald-700 text-white rounded-xl text-sm font-bold shadow-lg hover:shadow-indigo-600/25 transition-all flex items-center gap-2 cursor-pointer"
          id="generate-ai-proposal-btn"
        >
          <Sparkles className="w-5 h-5" />
          <span>{isGenerating ? 'Synthesizing Formal Proposal (Gemini 3.7)...' : 'Generate Formal Proposal with AI'}</span>
        </button>
      </div>

      {/* Generated Proposal Document Preview */}
      {proposalData ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-10 shadow-md space-y-8 max-w-4xl mx-auto">
          {/* Doc Header */}
          <div className="border-b-2 border-slate-900 pb-6 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-widest">
              <span>Smart India Hackathon • SIH26043 Institutional Dossier</span>
              <span>Ref: PRJ-{Date.now().toString().slice(-6)}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight">
              {proposalData.projectTitle}
            </h1>
            <p className="text-xs font-semibold text-indigo-700 uppercase tracking-wide">
              Target Framework: {sponsorFocus}
            </p>
          </div>

          {/* Executive Pitch */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              1. Executive Summary
            </h3>
            <p className="text-sm text-slate-800 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-200">
              {proposalData.executiveSummary}
            </p>
          </div>

          {/* Problem & Urgency */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              2. Problem Statement & Ground Urgency
            </h3>
            <p className="text-xs text-slate-700 leading-relaxed">
              {proposalData.problemStatementAndUrgency}
            </p>
          </div>

          {/* Proposed Technical Intervention */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              3. Proposed Technical Intervention Model
            </h3>
            <p className="text-xs text-slate-700 leading-relaxed">
              {proposalData.proposedInterventionModel}
            </p>
          </div>

          {/* Line Item Budget Breakdown */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                4. Budget Allocation & Justification
              </h3>
              <span className="text-sm font-extrabold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-200">
                Total Grant: ₹{proposalData.totalGrantRequestedINR?.toLocaleString()} INR
              </span>
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-200">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 text-slate-700 uppercase font-bold">
                  <tr>
                    <th className="p-3">Budget Head</th>
                    <th className="p-3 text-right">Amount (INR)</th>
                    <th className="p-3">Rationale & Deliverable</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {proposalData.budgetBreakdown?.map((b: any, idx: number) => (
                    <tr key={idx} className="hover:bg-slate-50">
                      <td className="p-3 font-semibold text-slate-900">{b.head}</td>
                      <td className="p-3 text-right font-bold text-emerald-700">
                        ₹{b.amountINR?.toLocaleString()}
                      </td>
                      <td className="p-3 text-slate-600">{b.rationale}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Milestone Execution Roadmap */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              5. Execution Milestones & Target Deliverables
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {proposalData.executionMilestones?.map((m: any, idx: number) => (
                <div key={idx} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <span className="text-[10px] font-bold text-indigo-700 uppercase">{m.month}</span>
                  <p className="font-bold text-xs text-slate-900">{m.deliverable}</p>
                  <p className="text-[11px] text-slate-600">{m.targetOutput}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Measurable Impact KPIs */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              6. Measurable Social & Environmental KPIs
            </h3>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {proposalData.measurableImpactKPIs?.map((kpi: string, idx: number) => (
                <li key={idx} className="flex items-start gap-2 p-2.5 bg-emerald-50/60 rounded-lg border border-emerald-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span className="text-slate-800">{kpi}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* CSR / Policy Alignment */}
          <div className="p-4 bg-indigo-50/70 rounded-xl border border-indigo-200 space-y-1">
            <h4 className="text-xs font-bold text-indigo-950 uppercase">
              7. Institutional CSR & Policy Alignment Summary
            </h4>
            <p className="text-xs text-indigo-900 leading-relaxed">
              {proposalData.csrAndGovernmentAlignment}
            </p>
          </div>
        </div>
      ) : (
        <div className="p-12 text-center bg-white rounded-2xl border border-dashed border-slate-300 max-w-xl mx-auto space-y-3">
          <FileText className="w-12 h-12 text-slate-400 mx-auto" />
          <h3 className="font-bold text-slate-800 text-sm">Ready to Generate Grant Proposal</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Select a target challenge above and click the button. Gemini 3.7 Flash will formulate an
            audit-ready grant pitch complete with budget line-items and TRL milestones.
          </p>
        </div>
      )}
    </div>
  );
};
