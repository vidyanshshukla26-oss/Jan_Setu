import React from 'react';
import {
  MapPin,
  ThumbsUp,
  Award,
  Lightbulb,
  ShieldCheck,
  Flame,
  Users,
  Calendar,
  Sparkles,
  ArrowRight,
  TrendingUp,
  AlertTriangle
} from 'lucide-react';
import { Challenge } from '../types';

interface ChallengeCardProps {
  challenge: Challenge;
  onSelect: (challenge: Challenge) => void;
  onVote: (challengeId: string, e: React.MouseEvent) => void;
}

export const ChallengeCard: React.FC<ChallengeCardProps> = ({
  challenge,
  onSelect,
  onVote,
}) => {
  const getSeverityStyle = (severity: string) => {
    switch (severity) {
      case 'Critical':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'High':
        return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'Medium':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      default:
        return 'bg-emerald-100 text-emerald-700 border-emerald-200';
    }
  };

  const getProgressColor = (severity: string) => {
    switch (severity) {
      case 'Critical':
        return 'bg-red-500';
      case 'High':
        return 'bg-amber-500';
      case 'Medium':
        return 'bg-blue-600';
      default:
        return 'bg-emerald-500';
    }
  };

  const progressPercent = Math.min(
    95,
    Math.max(15, challenge.solutionsCount * 22 + (challenge.status === 'pilot_in_progress' ? 40 : 10))
  );

  const contributorsCount = challenge.solutionsCount * 8 + challenge.upvotes + 4;
  const shortId = challenge.id.replace(/[^a-zA-Z0-9]/g, '').slice(-3).toUpperCase() || '882';

  return (
    <div
      onClick={() => onSelect(challenge)}
      className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col justify-between shadow-xs hover:shadow-md hover:border-blue-400 transition-all duration-200 cursor-pointer group"
      id={`challenge-card-${challenge.id}`}
    >
      <div>
        {/* Top Header: Urgency Badge & ID */}
        <div className="flex justify-between items-start mb-2.5">
          <div className="flex items-center gap-1.5">
            <span
              className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded border ${getSeverityStyle(
                challenge.severity
              )}`}
            >
              {challenge.severity === 'Critical' ? 'Critical Urgency' : `${challenge.severity} Urgency`}
            </span>
            <span className="px-2 py-0.5 bg-gray-100 text-gray-700 text-[10px] font-semibold rounded">
              SDG {challenge.sdgNumber}
            </span>
          </div>
          <span className="text-[10px] font-mono text-gray-400 font-semibold">
            ID: #S-{shortId}
          </span>
        </div>

        {/* Title */}
        <h3 className="font-bold text-gray-900 text-base mb-1.5 leading-tight group-hover:text-blue-600 transition-colors line-clamp-2">
          {challenge.title}
        </h3>

        {/* Location & Population tag */}
        <div className="flex items-center gap-2 text-[11px] text-gray-500 mb-2">
          <span className="flex items-center gap-1">
            <MapPin className="w-3 h-3 text-gray-400" />
            <span>{challenge.location.city}, {challenge.location.state}</span>
          </span>
          <span>•</span>
          <span className="font-medium text-gray-700">
            {challenge.impactedPopulation.toLocaleString()} Impacted
          </span>
        </div>

        {/* Description snippet */}
        <p className="text-gray-500 text-xs leading-snug line-clamp-2 mb-3">
          {challenge.description}
        </p>

        {/* Primary tech tags */}
        <div className="flex flex-wrap gap-1 mb-3">
          {challenge.primaryTechDisciplines.slice(0, 3).map((discipline, idx) => (
            <span
              key={idx}
              className="text-[10px] font-medium text-gray-600 bg-gray-100 px-2 py-0.5 rounded"
            >
              {discipline}
            </span>
          ))}
          {challenge.bountyAmount > 0 && (
            <span className="text-[10px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
              ₹{(challenge.bountyAmount / 100000).toFixed(1)}L Grant
            </span>
          )}
        </div>
      </div>

      {/* High Density Metric & Progress Section */}
      <div className="mt-2 pt-2 border-t border-gray-100 space-y-2.5">
        <div className="space-y-1">
          <div className="flex justify-between text-[11px]">
            <span className="text-gray-400">Solution Maturity</span>
            <span className="font-bold text-gray-800">{progressPercent}%</span>
          </div>
          <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
            <div
              className={`h-1.5 rounded-full ${getProgressColor(challenge.severity)} transition-all duration-300`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Footer: Avatars + Contributor metric + Upvote Action */}
        <div className="flex justify-between items-center pt-1">
          <div className="flex items-center gap-2">
            <div className="flex -space-x-1.5">
              <div className="w-5 h-5 rounded-full border border-white bg-blue-200 flex items-center justify-center text-[8px] font-bold text-blue-800">
                A
              </div>
              <div className="w-5 h-5 rounded-full border border-white bg-emerald-200 flex items-center justify-center text-[8px] font-bold text-emerald-800">
                R
              </div>
              <div className="w-5 h-5 rounded-full border border-white bg-amber-200 flex items-center justify-center text-[8px] font-bold text-amber-800">
                K
              </div>
            </div>
            <span className="text-[10px] font-bold text-blue-600">
              {contributorsCount} Contributors
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={(e) => onVote(challenge.id, e)}
              className={`flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold transition-colors ${
                challenge.hasUpvoted
                  ? 'bg-blue-100 text-blue-800 border border-blue-300'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              id={`upvote-btn-${challenge.id}`}
            >
              <ThumbsUp className={`w-3 h-3 ${challenge.hasUpvoted ? 'fill-blue-700' : ''}`} />
              <span>{challenge.upvotes}</span>
            </button>

            <span className="text-gray-400 group-hover:text-blue-600 transition-colors">
              <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
