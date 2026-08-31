import React from 'react';
import {
  TrendingUp,
  Users,
  Award,
  Lightbulb,
  ShieldCheck,
  Building,
  Target,
  BarChart3,
  MapPin,
  CheckCircle2
} from 'lucide-react';
import { AnalyticsSummary, Challenge } from '../types';

interface AnalyticsDashboardProps {
  analytics: AnalyticsSummary | null;
  challenges: Challenge[];
}

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({
  analytics,
  challenges,
}) => {
  if (!analytics) {
    return (
      <div className="p-12 text-center text-slate-500">
        <BarChart3 className="w-8 h-8 mx-auto animate-pulse text-emerald-600 mb-2" />
        <p className="text-xs">Computing societal telemetry across Indian districts...</p>
      </div>
    );
  }

  // Calculate SDG distribution
  const sdgCounts: Record<number, { name: string; count: number }> = {};
  challenges.forEach((c) => {
    if (!sdgCounts[c.sdgNumber]) {
      sdgCounts[c.sdgNumber] = { name: c.sdgName, count: 0 };
    }
    sdgCounts[c.sdgNumber].count += 1;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* 4 Stat Hero Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Crowdsourced Issues</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
              <Target className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-['Space_Grotesk']">
            {analytics.totalChallenges}
          </h3>
          <p className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{analytics.verifiedChallengesCount} Verified by Authorities</span>
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Solver Solutions</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold">
              <Lightbulb className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-['Space_Grotesk']">
            {analytics.totalSolutions}
          </h3>
          <p className="text-[11px] text-indigo-700 font-semibold flex items-center gap-1">
            <span>{analytics.activePilotsCount} Active Field Pilots</span>
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Total Grant Escrow</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-['Space_Grotesk']">
            ₹{(analytics.totalBountyAmountINR / 100000).toFixed(1)}L
          </h3>
          <p className="text-[11px] text-amber-800 font-semibold">
            Across CSR & Mission Grants
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Citizens Impacted</span>
            <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center font-bold">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-['Space_Grotesk']">
            {analytics.totalImpactedPopulation.toLocaleString()}
          </h3>
          <p className="text-[11px] text-teal-700 font-semibold">
            In 18+ Targeted Districts
          </p>
        </div>
      </div>

      {/* Breakdown Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Category Breakdown */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-sm">
              Challenge Distribution by Societal Domain
            </h3>
            <span className="text-xs text-slate-400 font-medium">Domain Breakdown</span>
          </div>

          <div className="space-y-3">
            {analytics.challengesByCategory.map((item) => {
              const pct = Math.round((item.count / analytics.totalChallenges) * 100);
              return (
                <div key={item.category} className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-medium">
                    <span className="text-slate-800 font-semibold">{item.category}</span>
                    <span className="text-slate-500">{item.count} issues ({pct}%)</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-600 rounded-full transition-all duration-500"
                      style={{ width: `${Math.max(8, pct)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* State Geographic Density */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-sm">
              Geographic Concentration by State / Region
            </h3>
            <span className="text-xs text-slate-400 font-medium">Regional Density</span>
          </div>

          <div className="space-y-3">
            {analytics.challengesByState.map((st) => (
              <div
                key={st.state}
                className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="font-bold text-slate-900">{st.state}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-slate-600 font-medium">
                    {st.impacted.toLocaleString()} citizens
                  </span>
                  <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold rounded-md">
                    {st.count} Issues
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* UN Sustainable Development Goals Mapping */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <h3 className="font-bold text-slate-900 text-sm">
          UN Sustainable Development Goals (SDG) Alignment
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {Object.entries(sdgCounts).map(([sdgNum, val]) => (
            <div
              key={sdgNum}
              className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex items-start justify-between gap-2"
            >
              <div>
                <span className="px-2 py-0.5 bg-slate-900 text-white font-bold text-[10px] rounded-md">
                  SDG {sdgNum}
                </span>
                <p className="font-bold text-xs text-slate-900 mt-2">{val.name}</p>
              </div>
              <span className="text-xl font-extrabold text-emerald-700 font-['Space_Grotesk']">
                {val.count}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
