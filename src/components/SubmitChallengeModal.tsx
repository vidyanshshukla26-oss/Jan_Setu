import React, { useState } from 'react';
import {
  X,
  Sparkles,
  MapPin,
  AlertTriangle,
  Upload,
  Layers,
  Send,
  Languages,
  CheckCircle2,
  Users,
  SearchCheck,
  ShieldAlert,
  HelpCircle
} from 'lucide-react';
import { ChallengeCategory, SeverityLevel, UserRole } from '../types';

interface SubmitChallengeModalProps {
  onClose: () => void;
  onSuccess: () => void;
  userRole: UserRole;
}

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

const PRESET_EVIDENCE_IMAGES = [
  'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=800&q=80',
];

export const SubmitChallengeModal: React.FC<SubmitChallengeModalProps> = ({
  onClose,
  onSuccess,
  userRole,
}) => {
  const [step, setStep] = useState<1 | 2>(1);
  const [rawCitizenNotes, setRawCitizenNotes] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('Hindi / Vernacular');
  const [isTranslating, setIsTranslating] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isCheckingDuplicate, setIsCheckingDuplicate] = useState(false);
  const [duplicateWarning, setDuplicateWarning] = useState<any>(null);

  // Form Fields
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<ChallengeCategory>('Water & Sanitation');
  const [sdgNumber, setSdgNumber] = useState<number>(6);
  const [sdgName, setSdgName] = useState('Clean Water and Sanitation');
  const [description, setDescription] = useState('');
  const [city, setCity] = useState('Varanasi');
  const [state, setState] = useState('Uttar Pradesh');
  const [latitude, setLatitude] = useState(25.3176);
  const [longitude, setLongitude] = useState(82.9739);
  const [address, setAddress] = useState('Ghat Catchment Basin');
  const [impactedPopulation, setImpactedPopulation] = useState(15000);
  const [severity, setSeverity] = useState<SeverityLevel>('High');
  const [severityScore, setSeverityScore] = useState(85);
  const [bountyAmount, setBountyAmount] = useState(300000);
  const [selectedImage, setSelectedImage] = useState(PRESET_EVIDENCE_IMAGES[0]);
  const [disciplinesInput, setDisciplinesInput] = useState('IoT Water Sensors, Bio-Remediation, Civil Hydraulics');
  const [aiAnalysisData, setAiAnalysisData] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Vernacular translation & synthesis
  const handleVernacularTranslate = async () => {
    if (!rawCitizenNotes.trim()) return;
    setIsTranslating(true);
    try {
      const res = await fetch('/api/ai/multilingual-assist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          inputQuery: rawCitizenNotes,
          sourceLanguage: selectedLanguage,
        }),
      });
      const result = await res.json();
      if (result.success && result.data) {
        setTitle(result.data.translatedTitle);
        setDescription(result.data.structuredDescription);
        if (result.data.suggestedCategory) {
          setCategory(result.data.suggestedCategory as ChallengeCategory);
        }
        if (result.data.sdgNumber) {
          setSdgNumber(result.data.sdgNumber);
        }
        setStep(2);
      }
    } catch (err) {
      console.error('Vernacular assist error:', err);
    } finally {
      setIsTranslating(false);
    }
  };

  // AI Auto-triage
  const handleAIAutoTriage = async () => {
    if (!description && !rawCitizenNotes) return;
    setIsAnalyzing(true);
    try {
      const res = await fetch('/api/ai/analyze-challenge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rawDescription: description || rawCitizenNotes,
          locationText: `${city}, ${state}`,
          reportedCategory: category,
        }),
      });
      const result = await res.json();
      if (result.success && result.data) {
        const d = result.data;
        setTitle(d.refinedTitle || title);
        setDescription(d.refinedDescription || description);
        if (d.recommendedCategory) setCategory(d.recommendedCategory as ChallengeCategory);
        if (d.sdgNumber) setSdgNumber(d.sdgNumber);
        if (d.sdgName) setSdgName(d.sdgName);
        if (d.severityScore) setSeverityScore(d.severityScore);
        if (d.severityLevel) setSeverity(d.severityLevel as SeverityLevel);
        if (d.estimatedImpactedPopulation) setImpactedPopulation(d.estimatedImpactedPopulation);
        if (d.primaryTechDisciplines) setDisciplinesInput(d.primaryTechDisciplines.join(', '));
        if (d.suggestedBountyINR) setBountyAmount(d.suggestedBountyINR);
        setAiAnalysisData({
          summary: d.refinedDescription,
          rootCauses: d.rootCauses || [],
          suggestedApproaches: d.suggestedApproaches || [],
          potentialRisks: d.potentialRisks || [],
          estimatedTimelineMonths: 6,
          recommendedTRLTarget: d.targetTRL || 7,
        });
      }
    } catch (err) {
      console.error('AI Triage error:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Duplicate check
  const handleCheckDuplicates = async () => {
    if (!title && !description) return;
    setIsCheckingDuplicate(true);
    try {
      const res = await fetch('/api/ai/duplicate-check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title || 'Local Issue',
          description: description || rawCitizenNotes,
          city,
          state,
        }),
      });
      const result = await res.json();
      if (result.success && result.data) {
        setDuplicateWarning(result.data);
      }
    } catch (err) {
      console.error('Duplicate check error:', err);
    } finally {
      setIsCheckingDuplicate(false);
    }
  };

  // Fetch device geolocation
  const handleDetectLocation = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLatitude(Number(pos.coords.latitude.toFixed(4)));
          setLongitude(Number(pos.coords.longitude.toFixed(4)));
          setCity('Detected District');
          setState('Local Region');
        },
        (err) => {
          console.warn('Geolocation error:', err);
        }
      );
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    setIsSubmitting(true);
    try {
      const primaryDisciplines = disciplinesInput
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

      const payload = {
        title,
        category,
        sdgNumber,
        sdgName,
        description,
        impactedPopulation: Number(impactedPopulation),
        location: {
          city,
          state,
          country: 'India',
          latitude: Number(latitude),
          longitude: Number(longitude),
          address,
        },
        severity,
        severityScore: Number(severityScore),
        bountyAmount: Number(bountyAmount),
        reportedBy: {
          name: userRole === 'citizen' ? 'Citizen Reporter' : 'Municipal / Community Representative',
          role: userRole,
          organization: userRole === 'government_csr' ? 'District Administration Taskforce' : 'Civic Action Group',
        },
        evidenceImages: [selectedImage],
        primaryTechDisciplines: primaryDisciplines.length > 0 ? primaryDisciplines : ['Civic Tech', 'Field Engineering'],
        aiAnalysis: aiAnalysisData,
        verifiedByOfficial: userRole === 'government_csr' || userRole === 'evaluator',
        officialVerifierName: userRole === 'government_csr' ? 'District Planning Commission' : undefined,
      };

      const res = await fetch('/api/challenges', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        onSuccess();
        onClose();
      }
    } catch (err) {
      console.error('Submit error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div
        className="bg-white rounded-2xl border border-slate-200 w-full max-w-3xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        id="submit-challenge-modal"
      >
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Report a Societal Challenge (SIH26043)
              </h2>
              <p className="text-xs text-slate-500">
                AI-assisted intake bridge connecting grassroots problems to innovators & grant sponsors.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Wizard Form Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-6">
          {/* Vernacular / Multilingual Quick Assist Banner */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-indigo-50 via-slate-50 to-emerald-50 border border-indigo-200 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Languages className="w-4 h-4 text-indigo-700" />
                <h3 className="font-bold text-xs text-indigo-950">
                  Multilingual AI Speech/Text Drafter (Hindi, Tamil, Telugu, Marathi, etc.)
                </h3>
              </div>
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="text-[11px] font-semibold bg-white border border-indigo-200 rounded px-2 py-0.5 text-indigo-900"
              >
                <option value="Hindi">Hindi (हिंदी)</option>
                <option value="Tamil">Tamil (தமிழ்)</option>
                <option value="Telugu">Telugu (తెలుగు)</option>
                <option value="Marathi">Marathi (मराठी)</option>
                <option value="Bengali">Bengali (বাংলা)</option>
                <option value="Kannada">Kannada (ಕನ್ನಡ)</option>
                <option value="English">English / Casual Notes</option>
              </select>
            </div>

            <textarea
              rows={2}
              value={rawCitizenNotes}
              onChange={(e) => setRawCitizenNotes(e.target.value)}
              placeholder="e.g. हमारे गाँव के 3 हैंडपंप में पीला गंदा पानी आ रहा है और बच्चों के दांत खराब हो रहे हैं... (Or describe any issue casually)"
              className="w-full p-2.5 bg-white border border-indigo-200 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
            />

            <div className="flex items-center justify-between">
              <p className="text-[10px] text-indigo-700">
                Gemini will translate, detect SDGs, and structure an engineering brief.
              </p>
              <button
                type="button"
                onClick={handleVernacularTranslate}
                disabled={isTranslating || !rawCitizenNotes.trim()}
                className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-2xs"
              >
                <Sparkles className="w-3.5 h-3.5" />
                {isTranslating ? 'Translating & Structuring...' : 'AI Auto-Draft'}
              </button>
            </div>
          </div>

          {/* Duplicate Warning Box if triggered */}
          {duplicateWarning && (
            <div
              className={`p-4 rounded-xl border ${
                duplicateWarning.isDuplicate
                  ? 'bg-amber-50 border-amber-300 text-amber-900'
                  : 'bg-emerald-50 border-emerald-300 text-emerald-900'
              }`}
            >
              <div className="flex items-start gap-2">
                {duplicateWarning.isDuplicate ? (
                  <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                ) : (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                )}
                <div>
                  <h4 className="text-xs font-bold">
                    {duplicateWarning.isDuplicate
                      ? `Potential Semantic Duplicate Detected (${duplicateWarning.similarityConfidencePercentage}% match)`
                      : 'Unique Challenge Confirmed'}
                  </h4>
                  <p className="text-xs mt-1 leading-relaxed">{duplicateWarning.explanation}</p>
                  <p className="text-[11px] font-semibold mt-1.5">
                    Recommendation: {duplicateWarning.recommendation} (Cluster: {duplicateWarning.clusterTag})
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Core Form Fields */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Title */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-slate-700">
                  Challenge Title <span className="text-rose-500">*</span>
                </label>
                <button
                  type="button"
                  onClick={handleCheckDuplicates}
                  disabled={isCheckingDuplicate || !title}
                  className="text-[11px] text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1"
                >
                  <SearchCheck className="w-3.5 h-3.5" />
                  {isCheckingDuplicate ? 'Scanning...' : 'Check Duplicates'}
                </button>
              </div>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Arsenic Contamination in Rural Handpumps"
                required
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              />
            </div>

            {/* Category & SDG Selection */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Societal Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as ChallengeCategory)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-medium"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Primary UN SDG Goal
                </label>
                <select
                  value={sdgNumber}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setSdgNumber(val);
                    const names: Record<number, string> = {
                      2: 'Zero Hunger & Sustainable Agriculture',
                      3: 'Good Health and Well-being',
                      4: 'Quality Education',
                      5: 'Gender Equality & Safe Spaces',
                      6: 'Clean Water and Sanitation',
                      7: 'Affordable and Clean Energy',
                      11: 'Sustainable Cities and Communities',
                      12: 'Responsible Consumption and Production',
                      13: 'Climate Action',
                    };
                    setSdgName(names[val] || 'Sustainable Development');
                  }}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-medium"
                >
                  <option value={6}>SDG 6: Clean Water and Sanitation</option>
                  <option value={2}>SDG 2: Zero Hunger & Agritech</option>
                  <option value={3}>SDG 3: Good Health and Diagnostics</option>
                  <option value={11}>SDG 11: Sustainable Cities & Mobility</option>
                  <option value={7}>SDG 7: Affordable Clean Energy</option>
                  <option value={5}>SDG 5: Gender Equality & Safety</option>
                  <option value={12}>SDG 12: Circular Economy & Waste</option>
                  <option value={13}>SDG 13: Climate Action</option>
                  <option value={4}>SDG 4: Quality Education</option>
                </select>
              </div>
            </div>

            {/* Description with AI Polish trigger */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-slate-700">
                  Comprehensive Problem Description <span className="text-rose-500">*</span>
                </label>
                <button
                  type="button"
                  onClick={handleAIAutoTriage}
                  disabled={isAnalyzing || !description}
                  className="text-[11px] text-emerald-700 hover:text-emerald-900 font-bold flex items-center gap-1"
                >
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                  {isAnalyzing ? 'Analyzing Root Causes...' : 'AI Auto-Triage & Score'}
                </button>
              </div>
              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Detail the ground situation, community symptoms, failed prior attempts, water/air test parameters..."
                required
                className="w-full p-3 bg-white border border-slate-300 rounded-lg text-xs leading-relaxed focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              />
            </div>

            {/* Location & Geo-coordinates */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  City / District
                </label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">State</label>
                <input
                  type="text"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-[11px] font-bold text-slate-700">GPS Coords</label>
                  <button
                    type="button"
                    onClick={handleDetectLocation}
                    className="text-[10px] text-emerald-700 font-bold hover:underline"
                  >
                    Auto GPS
                  </button>
                </div>
                <div className="flex gap-1 text-xs">
                  <input
                    type="number"
                    step="0.0001"
                    value={latitude}
                    onChange={(e) => setLatitude(parseFloat(e.target.value))}
                    className="w-1/2 px-1.5 py-1.5 bg-white border border-slate-300 rounded-lg text-[11px]"
                    placeholder="Lat"
                  />
                  <input
                    type="number"
                    step="0.0001"
                    value={longitude}
                    onChange={(e) => setLongitude(parseFloat(e.target.value))}
                    className="w-1/2 px-1.5 py-1.5 bg-white border border-slate-300 rounded-lg text-[11px]"
                    placeholder="Lng"
                  />
                </div>
              </div>
            </div>

            {/* Impacted Population & Severity */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Impacted Citizens Count
                </label>
                <input
                  type="number"
                  value={impactedPopulation}
                  onChange={(e) => setImpactedPopulation(Number(e.target.value))}
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Severity Level
                </label>
                <select
                  value={severity}
                  onChange={(e) => setSeverity(e.target.value as SeverityLevel)}
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs"
                >
                  <option value="Critical">Critical (Threat to Life)</option>
                  <option value="High">High (Severe Health / Economic Impact)</option>
                  <option value="Medium">Medium (Quality of Life)</option>
                  <option value="Low">Low (Minor Inconvenience)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Suggested Grant Pool (INR)
                </label>
                <input
                  type="number"
                  value={bountyAmount}
                  onChange={(e) => setBountyAmount(Number(e.target.value))}
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs"
                />
              </div>
            </div>

            {/* Required STEM Disciplines */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Required Technical Disciplines (comma separated)
              </label>
              <input
                type="text"
                value={disciplinesInput}
                onChange={(e) => setDisciplinesInput(e.target.value)}
                placeholder="IoT Telemetry, Edge AI, Chemical Engineering, Solar Microgrid"
                className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs"
              />
            </div>

            {/* Photographic Evidence Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">
                Select Photographic Field Evidence
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {PRESET_EVIDENCE_IMAGES.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedImage(img)}
                    className={`relative rounded-lg overflow-hidden border-2 h-16 transition-all ${
                      selectedImage === img
                        ? 'border-emerald-600 ring-2 ring-emerald-500/30 scale-105'
                        : 'border-slate-200 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="preset" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    {selectedImage === img && (
                      <div className="absolute inset-0 bg-emerald-600/30 flex items-center justify-center text-white">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Submit Actions */}
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
                id="submit-challenge-final-btn"
              >
                <Send className="w-4 h-4" />
                {isSubmitting ? 'Publishing Challenge...' : 'Publish Societal Challenge'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
