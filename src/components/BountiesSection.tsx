import React, { useState } from 'react';
import {
  Award,
  Sparkles,
  Building,
  ShieldCheck,
  CheckCircle2,
  TrendingUp,
  HeartHandshake,
  DollarSign,
  ArrowRight,
  Target,
  Users,
  Compass
} from 'lucide-react';
import { Challenge } from '../types';

interface BountiesSectionProps {
  challenges: Challenge[];
  onSelectChallenge: (challenge: Challenge) => void;
}

export const BountiesSection: React.FC<BountiesSectionProps> = ({
  challenges,
  onSelectChallenge,
}) => {
  const [filterSponsor, setFilterSponsor] = useState<string>('All');

  const fundedChallenges = challenges.filter((c) => c.bountyAmount > 0);
  const totalGrantPool = challenges.reduce((acc, c) => acc + c.bountyAmount, 0);

  return (
    <div className="space-y-4">
      {/* High Density Grant Pool Summary Banner */}
      <div className="bg-gray-900 text-white rounded-xl p-5 border border-gray-800 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 bg-blue-600 text-white text-[10px] font-bold uppercase rounded">
                Escrow Verified
              </span>
              <span className="text-gray-400 text-xs font-semibold">
                SIH26043 Civic Innovation & CSR Grant Escrow
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              ₹{(totalGrantPool / 100000).toFixed(1)} Lakh Active Societal Bounty Pool
            </h2>
            <p className="text-xs text-gray-300 leading-relaxed">
              Co-funded by Government Missions and CSR Foundations. Grants are disbursed across verified milestones.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 shrink-0">
            <div className="p-2.5 bg-gray-800/80 rounded-lg border border-gray-700">
              <p className="text-[9px] uppercase font-bold text-gray-400">Tracks</p>
              <p className="text-sm font-bold text-white mt-0.5">{fundedChallenges.length} Active</p>
            </div>
            <div className="p-2.5 bg-gray-800/80 rounded-lg border border-gray-700">
              <p className="text-[9px] uppercase font-bold text-gray-400">Max Track</p>
              <p className="text-sm font-bold text-blue-400 mt-0.5">₹9.0L</p>
            </div>
            <div className="p-2.5 bg-gray-800/80 rounded-lg border border-gray-700">
              <p className="text-[9px] uppercase font-bold text-gray-400">Target TRL</p>
              <p className="text-sm font-bold text-emerald-400 mt-0.5">TRL 6 - 8</p>
            </div>
            <div className="p-2.5 bg-gray-800/80 rounded-lg border border-gray-700">
              <p className="text-[9px] uppercase font-bold text-gray-400">Payout Mode</p>
              <p className="text-sm font-bold text-amber-400 mt-0.5">Milestone</p>
            </div>
          </div>
        </div>
      </div>

      {/* Grand Bounty Challenge Cards */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-gray-900 text-base">
            Featured Grand Societal Challenges ({fundedChallenges.length})
          </h3>
          <span className="text-[11px] text-gray-500 font-medium">
            Ranked by bounty prize pool & field urgency
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {fundedChallenges.map((challenge) => (
            <div
              key={challenge.id}
              onClick={() => onSelectChallenge(challenge)}
              className="bg-white rounded-xl border border-gray-200 p-4 hover:border-blue-400 transition-all shadow-xs hover:shadow-md cursor-pointer flex flex-col justify-between group"
            >
              <div>
                {/* Header Badge */}
                <div className="flex items-center justify-between gap-2 mb-2.5">
                  <div className="flex items-center gap-1.5">
                    <span className="px-2 py-0.5 bg-amber-50 text-amber-900 font-bold text-xs rounded border border-amber-200 flex items-center gap-1">
                      <Award className="w-3.5 h-3.5 text-amber-700" />
                      ₹{(challenge.bountyAmount / 100000).toFixed(1)}L Grant Pool
                    </span>
                    <span className="px-2 py-0.5 bg-gray-100 text-gray-700 text-[10px] font-semibold rounded">
                      SDG {challenge.sdgNumber}
                    </span>
                  </div>

                  <span className="text-[11px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                    {challenge.solutionsCount} Solutions Submitted
                  </span>
                </div>

                {/* Title */}
                <h4 className="font-bold text-gray-900 text-base group-hover:text-blue-600 transition-colors leading-snug mb-1.5">
                  {challenge.title}
                </h4>

                <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed mb-3">
                  {challenge.description}
                </p>

                {/* Sponsors Pill List */}
                <div className="space-y-1 mb-3">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                    Funding Sponsors & CSR Partners:
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {challenge.sponsors.map((sp) => (
                      <span
                        key={sp.id}
                        className="px-2 py-0.5 bg-gray-50 border border-gray-200 text-gray-800 text-[11px] font-medium rounded flex items-center gap-1"
                      >
                        <Building className="w-3 h-3 text-gray-400" />
                        <span>{sp.name}</span>
                        <strong className="text-blue-700 font-bold ml-1">
                          (₹{(sp.amount / 100000).toFixed(1)}L)
                        </strong>
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Card Footer */}
              <div className="pt-2.5 border-t border-gray-100 flex items-center justify-between text-xs">
                <span className="text-gray-500 text-[11px] font-medium">
                  {challenge.location.city}, {challenge.location.state} •{' '}
                  <strong className="text-gray-800">
                    {challenge.impactedPopulation.toLocaleString()} citizens
                  </strong>
                </span>
                <span className="font-bold text-blue-600 group-hover:translate-x-1 transition-transform flex items-center gap-1 text-xs">
                  <span>View & Apply</span>
                  <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Milestone Escrow Architecture Explainer */}
      <div className="p-4 bg-white rounded-xl border border-gray-200 space-y-3 shadow-xs">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-blue-600" />
          <h3 className="font-bold text-gray-900 text-sm">
            How the SIH26043 Milestone-Based Grant Escrow Operates
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 space-y-1">
            <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-800 font-bold flex items-center justify-center text-[10px]">
              1
            </span>
            <h4 className="font-bold text-gray-900">Stage 1: Lab Proof & Simulation (30-40%)</h4>
            <p className="text-gray-600 leading-relaxed text-[11px]">
              Team achieves verified TRL 5 in simulation environment with test data. Initial prototype grant released.
            </p>
          </div>

          <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 space-y-1">
            <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-800 font-bold flex items-center justify-center text-[10px]">
              2
            </span>
            <h4 className="font-bold text-gray-900">Stage 2: Operational Field Pilot (40-50%)</h4>
            <p className="text-gray-600 leading-relaxed text-[11px]">
              Hardware/software deployed in the target village/city. Municipal taskforce certifies live performance metrics.
            </p>
          </div>

          <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 space-y-1">
            <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-[10px]">
              3
            </span>
            <h4 className="font-bold text-gray-900">Stage 3: Scaled Handover & SLA (20%)</h4>
            <p className="text-gray-600 leading-relaxed text-[11px]">
              Final handoff to local Panchayat/Municipal department with long-term maintenance training and compliance.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
