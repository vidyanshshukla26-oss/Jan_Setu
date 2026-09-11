import React, { useState } from 'react';
import {
  MapPin,
  Layers,
  Sparkles,
  Award,
  AlertTriangle,
  Users,
  ShieldCheck,
  Filter,
  Eye,
  Maximize2,
  Compass,
  ArrowRight
} from 'lucide-react';
import { Challenge } from '../types';

interface GeoSpatialMapProps {
  challenges: Challenge[];
  onSelectChallenge: (challenge: Challenge) => void;
}

export const GeoSpatialMap: React.FC<GeoSpatialMapProps> = ({
  challenges,
  onSelectChallenge,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('All');
  const [activePin, setActivePin] = useState<Challenge | null>(challenges[0] || null);
  const [mapTheme, setMapTheme] = useState<'blueprint' | 'terrain' | 'minimal'>('blueprint');

  const filtered = challenges.filter((c) => {
    if (selectedCategory !== 'All' && c.category !== selectedCategory) return false;
    if (selectedSeverity !== 'All' && c.severity !== selectedSeverity) return false;
    return true;
  });

  const countryCount = new Set(filtered.map((challenge) => challenge.location.country)).size;

  const getMapPosition = (lat: number, lng: number) => {
    const minLat = -60;
    const maxLat = 80;
    const minLng = -180;
    const maxLng = 180;

    const x = ((lng - minLng) / (maxLng - minLng)) * 100;
    const y = ((maxLat - lat) / (maxLat - minLat)) * 100;

    return {
      x: Math.max(5, Math.min(95, x)),
      y: Math.max(5, Math.min(95, y)),
    };
  };

  const getPinColor = (severity: string) => {
    switch (severity) {
      case 'Critical':
        return { bg: 'bg-rose-500', ring: 'ring-rose-400/50', border: 'border-rose-200' };
      case 'High':
        return { bg: 'bg-amber-500', ring: 'ring-amber-400/50', border: 'border-amber-200' };
      case 'Medium':
        return { bg: 'bg-blue-500', ring: 'ring-blue-400/50', border: 'border-blue-200' };
      default:
        return { bg: 'bg-emerald-500', ring: 'ring-emerald-400/50', border: 'border-emerald-200' };
    }
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      {/* Map Control Header */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
            <Compass className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900">
              GeoSpatial Societal Problem Radar & Hotspot Map
            </h2>
            <p className="text-xs text-slate-500">
              Global geocoded clusters, critical urgency zones, and regional deployment telemetry.
            </p>
          </div>
        </div>

        {/* Filter Badges */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-2.5 py-1 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium"
          >
            <option value="All">All Categories</option>
            <option value="Water & Sanitation">Water & Sanitation</option>
            <option value="Agriculture & Agritech">Agriculture & Agritech</option>
            <option value="Rural Healthcare">Rural Healthcare</option>
            <option value="Disaster Management">Disaster Management</option>
            <option value="Women Safety & Inclusion">Women Safety & Inclusion</option>
            <option value="Waste Management & Circular Economy">Waste & Circular Economy</option>
          </select>

          <select
            value={selectedSeverity}
            onChange={(e) => setSelectedSeverity(e.target.value)}
            className="px-2.5 py-1 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium"
          >
            <option value="All">All Severities</option>
            <option value="Critical">Critical (Threat to Life)</option>
            <option value="High">High Urgency</option>
            <option value="Medium">Medium</option>
          </select>

          <div className="flex items-center bg-slate-100 p-0.5 rounded-lg">
            <button
              onClick={() => setMapTheme('blueprint')}
              className={`px-2 py-0.5 text-[11px] font-semibold rounded ${
                mapTheme === 'blueprint' ? 'bg-slate-900 text-white' : 'text-slate-600'
              }`}
            >
              Blueprint
            </button>
            <button
              onClick={() => setMapTheme('terrain')}
              className={`px-2 py-0.5 text-[11px] font-semibold rounded ${
                mapTheme === 'terrain' ? 'bg-slate-900 text-white' : 'text-slate-600'
              }`}
            >
              Topographic
            </button>
            <button
              onClick={() => setMapTheme('minimal')}
              className={`px-2 py-0.5 text-[11px] font-semibold rounded ${
                mapTheme === 'minimal' ? 'bg-slate-900 text-white' : 'text-slate-600'
              }`}
            >
              Clean
            </button>
          </div>
        </div>
      </div>

      {/* Main Map Canvas and Sidebar Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Interactive Map Viewport (2 Cols) */}
        <div className="lg:col-span-2 relative min-h-[460px] sm:min-h-[520px] rounded-2xl overflow-hidden border border-slate-800 shadow-xl bg-slate-950 flex flex-col justify-between p-4">
          {/* Background Grid & SVG Geometry depending on theme */}
          <div className="absolute inset-0 opacity-40 pointer-events-none">
            {mapTheme === 'blueprint' && (
              <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="grid-pattern" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1e293b" strokeWidth="1" />
                    <circle cx="20" cy="20" r="0.8" fill="#38bdf8" opacity="0.4" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid-pattern)" />
                <g fill="#164e63" stroke="#22d3ee" strokeWidth="0.7" opacity="0.72">
                  <path d="M10 25 18 16 29 13 39 17 46 25 42 32 34 34 29 42 21 40 17 34 11 32Z" />
                  <path d="M31 47 38 51 42 62 39 76 34 88 29 79 30 68 26 58Z" />
                  <path d="M47 22 53 16 61 14 69 18 75 27 72 34 65 35 61 42 54 39 52 31 46 29Z" />
                  <path d="M73 21 82 17 91 20 95 27 91 33 85 32 82 39 76 36 78 29 72 27Z" />
                  <path d="M78 45 87 43 94 48 91 55 84 56 81 64 75 60 77 53 72 49Z" />
                  <path d="M50 45 55 48 57 54 53 57 49 53Z" />
                </g>
                <g fill="none" stroke="#38bdf8" strokeWidth="1" opacity="0.2">
                  <ellipse cx="50%" cy="50%" rx="42%" ry="44%" />
                  <ellipse cx="50%" cy="50%" rx="21%" ry="44%" />
                  <path d="M8 50h84M14 34h72M14 66h72" />
                </g>
              </svg>
            )}

            {mapTheme === 'terrain' && (
              <div className="w-full h-full bg-gradient-to-br from-emerald-950 via-slate-900 to-teal-950 opacity-80" />
            )}

            {mapTheme === 'minimal' && (
              <div className="w-full h-full bg-slate-900 opacity-90" />
            )}
          </div>

          {/* Map Status HUD */}
          <div className="relative z-10 flex items-center justify-between text-xs text-slate-300">
            <div className="flex items-center gap-2 bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-700">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="font-semibold text-slate-200">Active Sensors & Radar: {filtered.length} Hotspots</span>
            </div>

            <div className="hidden sm:block bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-700 text-[11px] text-cyan-200">
              {countryCount} {countryCount === 1 ? 'country' : 'countries'} covered
            </div>

            <div className="hidden sm:flex items-center gap-3 bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-700 text-[11px]">
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span> Critical
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> High
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span> Medium
              </span>
            </div>
          </div>

          {/* Interactive Challenge Pins Container */}
          <div className="absolute inset-0 z-20 m-6">
            {filtered.map((ch) => {
              const pos = getMapPosition(ch.location.latitude, ch.location.longitude);
              const color = getPinColor(ch.severity);
              const isSelected = activePin?.id === ch.id;

              return (
                <div
                  key={ch.id}
                  style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 group cursor-pointer"
                  onClick={() => setActivePin(ch)}
                >
                  {/* Pulsing beacon ring for Critical */}
                  {ch.severity === 'Critical' && (
                    <span className="absolute -inset-2.5 rounded-full bg-rose-500/40 animate-ping" />
                  )}

                  {/* Pin Dot */}
                  <div
                    className={`relative w-8 h-8 rounded-full ${color.bg} text-white flex items-center justify-center font-bold text-[11px] shadow-lg ring-4 ${
                      isSelected ? 'ring-white scale-125' : color.ring
                    } transition-all duration-200`}
                  >
                    <span>{ch.sdgNumber}</span>
                  </div>

                  {/* Mini Hover Tooltip */}
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block whitespace-nowrap z-30 pointer-events-none">
                    <div className="bg-slate-900/95 text-white text-xs px-2.5 py-1.5 rounded-lg border border-slate-700 shadow-xl space-y-0.5">
                      <p className="font-bold text-[11px] text-emerald-400">
                        {ch.location.city}, {ch.location.state}
                      </p>
                      <p className="text-[10px] text-slate-300 max-w-[200px] truncate">{ch.title}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom Coordinates & Live HUD */}
          <div className="relative z-10 flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800">
            <span>Projection: WGS84 Geographic • Global Mercator View</span>
            <span>Click any hotspot pin to inspect deep dive</span>
          </div>
        </div>

        {/* Selected Hotspot Preview Panel (1 Col) */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 flex flex-col justify-between shadow-xs">
          {activePin ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 font-bold text-xs rounded-md">
                  SDG {activePin.sdgNumber}: {activePin.sdgName}
                </span>
                <span className="px-2 py-0.5 bg-rose-100 text-rose-800 font-bold text-xs rounded-md">
                  {activePin.severity} ({activePin.severityScore}/100)
                </span>
              </div>

              {/* Media preview */}
              <div className="relative h-36 rounded-xl overflow-hidden border border-slate-200">
                <img
                  src={activePin.evidenceImages[0]}
                  alt={activePin.title}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute bottom-2 left-2 px-2 py-1 bg-slate-950/80 text-white text-[10px] rounded-md font-semibold flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-emerald-400" />
                  {activePin.location.city}, {activePin.location.state}
                </div>
              </div>

              <div>
                <h3 className="font-bold text-slate-900 text-sm leading-snug">
                  {activePin.title}
                </h3>
                <p className="text-xs text-slate-600 mt-1.5 line-clamp-3 leading-relaxed">
                  {activePin.description}
                </p>
              </div>

              {/* Impact stats */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                  <p className="text-[10px] text-slate-500 font-medium">Impacted Citizens</p>
                  <p className="font-bold text-slate-900 text-sm mt-0.5">
                    {activePin.impactedPopulation.toLocaleString()}
                  </p>
                </div>

                <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                  <p className="text-[10px] text-slate-500 font-medium">Committed Grant</p>
                  <p className="font-bold text-emerald-700 text-sm mt-0.5">
                    ₹{(activePin.bountyAmount / 100000).toFixed(1)} Lakh
                  </p>
                </div>
              </div>

              {/* Solutions count */}
              <div className="flex items-center justify-between text-xs text-slate-600 pt-2 border-t border-slate-100">
                <span>{activePin.solutionsCount} Solver Innovations Submitted</span>
                <span>{activePin.upvotes} Citizens Upvoted</span>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-slate-400">
              <MapPin className="w-8 h-8 mx-auto mb-2 text-slate-300" />
              <p className="text-xs">Click a map marker to view challenge briefing</p>
            </div>
          )}

          {activePin && (
            <button
              onClick={() => onSelectChallenge(activePin)}
              className="mt-4 w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all flex items-center justify-center gap-1.5"
              id="map-open-deep-dive-btn"
            >
              <span>Explore Full Challenge & Solutions</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
