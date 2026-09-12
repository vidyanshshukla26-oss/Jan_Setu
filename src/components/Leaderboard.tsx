import React from 'react';
import { Award, Flame, Lightbulb, MessageSquare, ThumbsUp, Users } from 'lucide-react';
import { Challenge } from '../types';

interface LeaderboardProps {
  challenges: Challenge[];
}

interface RankingRow {
  name: string;
  detail: string;
  score: number;
  icon: React.ReactNode;
}

export const Leaderboard: React.FC<LeaderboardProps> = ({ challenges }) => {
  const contributors = challenges.reduce<RankingRow[]>((rows, challenge) => {
    const name = challenge.reportedBy.name;
    const existing = rows.find((row) => row.name === name);
    const score = challenge.upvotes + challenge.comments.length * 2 + challenge.solutionsCount * 4;
    if (existing) {
      existing.score += score;
      existing.detail = `${challenge.reportedBy.role} • ${existing.score} impact points`;
    } else {
      rows.push({
        name,
        detail: `${challenge.reportedBy.role} • ${score} impact points`,
        score,
        icon: <Users className="w-4 h-4" />,
      });
    }
    return rows;
  }, []);

  const solutionTeams = challenges.flatMap((challenge) =>
    challenge.solutions.map((solution) => ({
      name: solution.teamName,
      detail: `${solution.title} • ${solution.endorsements} endorsements`,
      score: solution.upvotes + solution.endorsements * 3 + (solution.aiFeasibilityScore || 0),
      icon: <Lightbulb className="w-4 h-4" />,
    }))
  );

  const mostDiscussed = [...challenges]
    .sort((a, b) => b.comments.length - a.comments.length)
    .slice(0, 5)
    .map((challenge) => ({
      name: challenge.title,
      detail: `${challenge.location.city}, ${challenge.location.state}`,
      score: challenge.comments.length,
      icon: <MessageSquare className="w-4 h-4" />,
    }));

  const renderRows = (rows: RankingRow[], emptyText: string) => {
    const ranked = [...rows].sort((a, b) => b.score - a.score).slice(0, 5);
    if (ranked.length === 0) {
      return <p className="text-xs text-slate-500 py-5">{emptyText}</p>;
    }

    return ranked.map((row, index) => (
      <div key={`${row.name}-${index}`} className="flex items-center gap-3 py-3 border-b border-slate-100 last:border-0">
        <span className="w-6 text-center text-sm font-black text-slate-400">{index + 1}</span>
        <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
          {row.icon}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold text-slate-900 truncate">{row.name}</p>
          <p className="text-[11px] text-slate-500 truncate">{row.detail}</p>
        </div>
        <span className="text-sm font-black text-slate-900">{row.score}</span>
      </div>
    ));
  };

  return (
    <section className="space-y-5">
      <div className="flex items-end justify-between gap-3">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-widest text-orange-600">Community momentum</p>
          <h2 className="text-2xl font-black text-slate-900">Impact Rankings</h2>
          <p className="text-sm text-slate-500 mt-1">Recognizing the people and teams moving civic ideas forward.</p>
        </div>
        <Flame className="w-8 h-8 text-orange-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="flex items-center gap-2 mb-2"><Award className="w-4 h-4 text-amber-500" /><h3 className="font-bold text-sm">Civic contributors</h3></div>
          {renderRows(contributors, 'No contributor activity yet.')}
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="flex items-center gap-2 mb-2"><ThumbsUp className="w-4 h-4 text-blue-500" /><h3 className="font-bold text-sm">Solution teams</h3></div>
          {renderRows(solutionTeams, 'No solution teams have submitted yet.')}
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="flex items-center gap-2 mb-2"><MessageSquare className="w-4 h-4 text-emerald-600" /><h3 className="font-bold text-sm">Most discussed</h3></div>
          {renderRows(mostDiscussed, 'No discussions have started yet.')}
        </div>
      </div>
    </section>
  );
};