import express from 'express';
import path from 'path';
import { pathToFileURL } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import { INITIAL_CHALLENGES } from './src/data/seedChallenges';
import { Challenge, Solution, Comment, AnalyticsSummary } from './src/types';

export const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '10mb' }));

// In-memory data store seeded with initial challenges
let challenges: Challenge[] = JSON.parse(JSON.stringify(INITIAL_CHALLENGES));

// Lazy-initialized Gemini AI Client
let aiClient: GoogleGenAI | null = null;
function getGeminiAI(): GoogleGenAI {
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY || 'AQ.Ab8RN6JSV2fHfIEQy0YkItXxFFJbj5E2s319wH3AUzYONWf_1w',
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

// ----------------------------------------------------
// REST API ROUTES
// ----------------------------------------------------

// 1. Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    totalChallenges: challenges.length,
    timestamp: new Date().toISOString(),
  });
});

// 2. Get all challenges with filtering & searching
app.get('/api/challenges', (req, res) => {
  const { category, sdg, severity, status, search, minBounty, sortBy } = req.query;

  let filtered = [...challenges];

  if (category && category !== 'All') {
    filtered = filtered.filter((c) => c.category === category);
  }

  if (sdg && sdg !== 'All') {
    filtered = filtered.filter((c) => c.sdgNumber.toString() === sdg.toString());
  }

  if (severity && severity !== 'All') {
    filtered = filtered.filter((c) => c.severity === severity);
  }

  if (status && status !== 'All') {
    filtered = filtered.filter((c) => c.status === status);
  }

  if (minBounty) {
    filtered = filtered.filter((c) => c.bountyAmount >= Number(minBounty));
  }

  if (search && typeof search === 'string') {
    const q = search.toLowerCase();
    filtered = filtered.filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q) ||
        c.location.city.toLowerCase().includes(q) ||
        c.location.state.toLowerCase().includes(q) ||
        c.primaryTechDisciplines.some((t) => t.toLowerCase().includes(q))
    );
  }

  // Sorting
  if (sortBy === 'upvotes') {
    filtered.sort((a, b) => b.upvotes - a.upvotes);
  } else if (sortBy === 'severity') {
    filtered.sort((a, b) => b.severityScore - a.severityScore);
  } else if (sortBy === 'bounty') {
    filtered.sort((a, b) => b.bountyAmount - a.bountyAmount);
  } else if (sortBy === 'solutions') {
    filtered.sort((a, b) => b.solutionsCount - a.solutionsCount);
  } else {
    // Default newest first
    filtered.sort(
      (a, b) => new Date(b.reportedDate).getTime() - new Date(a.reportedDate).getTime()
    );
  }

  res.json({
    success: true,
    count: filtered.length,
    data: filtered,
  });
});

// 3. Get single challenge
app.get('/api/challenges/:id', (req, res) => {
  const challenge = challenges.find((c) => c.id === req.params.id);
  if (!challenge) {
    return res.status(404).json({ success: false, error: 'Challenge not found' });
  }
  res.json({ success: true, data: challenge });
});

// 4. Create new challenge
app.post('/api/challenges', async (req, res) => {
  try {
    const newChallengeData = req.body;
    const challengeId = `CH-26043-${String(challenges.length + 1).padStart(3, '0')}`;

    const newChallenge: Challenge = {
      id: challengeId,
      title: newChallengeData.title || 'Untitled Challenge',
      category: newChallengeData.category || 'Water & Sanitation',
      sdgNumber: newChallengeData.sdgNumber || 6,
      sdgName: newChallengeData.sdgName || 'Clean Water and Sanitation',
      description: newChallengeData.description || '',
      impactedPopulation: Number(newChallengeData.impactedPopulation) || 1000,
      location: newChallengeData.location || {
        city: 'New Delhi',
        state: 'Delhi',
        country: 'India',
        latitude: 28.6139,
        longitude: 77.2090,
      },
      severity: newChallengeData.severity || 'Medium',
      severityScore: Number(newChallengeData.severityScore) || 75,
      status: 'open_for_solutions',
      reportedBy: newChallengeData.reportedBy || {
        name: 'Community Member',
        role: 'citizen',
      },
      reportedDate: new Date().toISOString().split('T')[0],
      upvotes: 1,
      hasUpvoted: true,
      bountyAmount: Number(newChallengeData.bountyAmount) || 0,
      sponsors: newChallengeData.sponsors || [],
      evidenceImages: newChallengeData.evidenceImages || [
        'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80',
      ],
      primaryTechDisciplines: newChallengeData.primaryTechDisciplines || ['Civic Engineering'],
      aiAnalysis: newChallengeData.aiAnalysis,
      solutionsCount: 0,
      solutions: [],
      comments: [],
      verifiedByOfficial: Boolean(newChallengeData.verifiedByOfficial) || false,
      officialVerifierName: newChallengeData.officialVerifierName,
    };

    challenges.unshift(newChallenge);
    res.status(201).json({ success: true, data: newChallenge });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 5. Upvote challenge
app.post('/api/challenges/:id/vote', (req, res) => {
  const challenge = challenges.find((c) => c.id === req.params.id);
  if (!challenge) {
    return res.status(404).json({ success: false, error: 'Challenge not found' });
  }

  if (challenge.hasUpvoted) {
    challenge.upvotes -= 1;
    challenge.hasUpvoted = false;
  } else {
    challenge.upvotes += 1;
    challenge.hasUpvoted = true;
  }

  res.json({ success: true, upvotes: challenge.upvotes, hasUpvoted: challenge.hasUpvoted });
});

// 6. Submit a solution to a challenge
app.post('/api/challenges/:id/solutions', (req, res) => {
  const challenge = challenges.find((c) => c.id === req.params.id);
  if (!challenge) {
    return res.status(404).json({ success: false, error: 'Challenge not found' });
  }

  const solData = req.body;
  const newSolution: Solution = {
    id: `SOL-${Date.now().toString().slice(-4)}`,
    challengeId: challenge.id,
    title: solData.title,
    teamName: solData.teamName,
    teamLead: solData.teamLead || {
      name: 'Team Innovator',
      email: 'innovator@team.org',
      organizationOrCollege: 'Innovation Hub',
    },
    abstract: solData.abstract,
    methodology: solData.methodology,
    trlLevel: Number(solData.trlLevel) || 4,
    estimatedBudget: Number(solData.estimatedBudget) || 250000,
    durationWeeks: Number(solData.durationWeeks) || 12,
    prototypeUrl: solData.prototypeUrl,
    githubUrl: solData.githubUrl,
    videoPitchUrl: solData.videoPitchUrl,
    upvotes: 1,
    status: 'submitted',
    submittedAt: new Date().toISOString().split('T')[0],
    aiFeasibilityScore: Number(solData.aiFeasibilityScore) || 85,
    aiReviewSummary: solData.aiReviewSummary || 'Initial technical submission queued for review.',
    endorsements: 0,
    milestones: solData.milestones || [
      {
        id: 'm1',
        title: 'Prototype validation & pilot test plan',
        targetDate: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
        fundsPercentage: 40,
        status: 'pending',
      },
      {
        id: 'm2',
        title: 'Community deployment and NABL metrics handoff',
        targetDate: new Date(Date.now() + 90 * 86400000).toISOString().split('T')[0],
        fundsPercentage: 60,
        status: 'pending',
      },
    ],
  };

  challenge.solutions.push(newSolution);
  challenge.solutionsCount = challenge.solutions.length;

  res.status(201).json({ success: true, data: newSolution });
});

// 7. Upvote a solution
app.post('/api/solutions/:id/vote', (req, res) => {
  for (const c of challenges) {
    const sol = c.solutions.find((s) => s.id === req.params.id);
    if (sol) {
      sol.upvotes += 1;
      return res.json({ success: true, upvotes: sol.upvotes });
    }
  }
  res.status(404).json({ success: false, error: 'Solution not found' });
});

// 8. Endorse/Review a solution (for mentors/officials)
app.post('/api/solutions/:id/endorse', (req, res) => {
  const { status, officialComment } = req.body;
  for (const c of challenges) {
    const sol = c.solutions.find((s) => s.id === req.params.id);
    if (sol) {
      sol.endorsements += 1;
      if (status) {
        sol.status = status;
        if (status === 'pilot_approved') {
          c.status = 'pilot_in_progress';
        }
      }
      if (officialComment) {
        c.comments.push({
          id: `c-${Date.now()}`,
          authorName: 'Official Innovation Reviewer',
          authorRole: 'evaluator',
          text: `Solution "${sol.title}" endorsement update: ${officialComment}`,
          createdAt: new Date().toISOString(),
          isOfficialUpdate: true,
        });
      }
      return res.json({ success: true, solution: sol });
    }
  }
  res.status(404).json({ success: false, error: 'Solution not found' });
});

// 9. Add comment / ground update
app.post('/api/challenges/:id/comments', (req, res) => {
  const challenge = challenges.find((c) => c.id === req.params.id);
  if (!challenge) {
    return res.status(404).json({ success: false, error: 'Challenge not found' });
  }

  const { authorName, authorRole, authorOrg, text, isOfficialUpdate, evidenceUrl } = req.body;
  const newComment: Comment = {
    id: `c-${Date.now()}`,
    authorName: authorName || 'Citizen Contributor',
    authorRole: authorRole || 'citizen',
    authorOrg,
    text,
    createdAt: new Date().toISOString(),
    isOfficialUpdate: Boolean(isOfficialUpdate),
    evidenceUrl,
  };

  challenge.comments.push(newComment);
  res.status(201).json({ success: true, data: newComment });
});

// 10. Pledge bounty / grant
app.post('/api/challenges/:id/pledge', (req, res) => {
  const challenge = challenges.find((c) => c.id === req.params.id);
  if (!challenge) {
    return res.status(404).json({ success: false, error: 'Challenge not found' });
  }

  const { sponsorName, sponsorType, amount } = req.body;
  const pledgeAmount = Number(amount) || 50000;

  challenge.bountyAmount += pledgeAmount;
  challenge.sponsors.push({
    id: `sp-${Date.now()}`,
    name: sponsorName || 'Civic Benefactor',
    type: sponsorType || 'CSR Foundation',
    amount: pledgeAmount,
  });

  res.json({
    success: true,
    totalBounty: challenge.bountyAmount,
    sponsors: challenge.sponsors,
  });
});

// 11. Analytics Overview
app.get('/api/analytics', (req, res) => {
  const totalChallenges = challenges.length;
  const resolvedChallenges = challenges.filter(
    (c) => c.status === 'resolved' || c.status === 'pilot_in_progress'
  ).length;
  const activeInnovatorTeams = challenges.reduce((acc, c) => acc + c.solutionsCount, 0);
  const totalBountyPool = challenges.reduce((acc, c) => acc + c.bountyAmount, 0);
  const totalCitizensImpacted = challenges.reduce((acc, c) => acc + c.impactedPopulation, 0);

  // SDG breakdown
  const sdgMap = new Map<string, number>();
  const sdgColors: Record<number, string> = {
    2: '#DDA63A',
    3: '#4C9F38',
    4: '#C5192D',
    5: '#FF3A21',
    6: '#26BDE2',
    7: '#FCC30B',
    11: '#FD9D24',
    12: '#BF8B2E',
    13: '#3F7E44',
  };

  challenges.forEach((c) => {
    const key = `SDG ${c.sdgNumber}: ${c.sdgName}`;
    sdgMap.set(key, (sdgMap.get(key) || 0) + 1);
  });

  const sdgDistribution = Array.from(sdgMap.entries()).map(([sdg, count]) => {
    const match = sdg.match(/SDG (\d+)/);
    const num = match ? parseInt(match[1]) : 6;
    return {
      sdg,
      count,
      color: sdgColors[num] || '#059669',
    };
  });

  // Regional breakdown
  const regionMap = new Map<string, { count: number; resolved: number }>();
  challenges.forEach((c) => {
    const state = c.location.state;
    const current = regionMap.get(state) || { count: 0, resolved: 0 };
    current.count += 1;
    if (c.status === 'resolved' || c.status === 'pilot_in_progress') {
      current.resolved += 1;
    }
    regionMap.set(state, current);
  });

  const regionalBreakdown = Array.from(regionMap.entries()).map(([state, data]) => ({
    state,
    count: data.count,
    resolved: data.resolved,
  }));

  // Category stats
  const catMap = new Map<string, { count: number; funding: number }>();
  challenges.forEach((c) => {
    const cur = catMap.get(c.category) || { count: 0, funding: 0 };
    cur.count += 1;
    cur.funding += c.bountyAmount;
    catMap.set(c.category, cur);
  });

  const categoryStats = Array.from(catMap.entries()).map(([category, data]) => ({
    category,
    count: data.count,
    funding: data.funding,
  }));

  const summary: AnalyticsSummary = {
    totalChallenges,
    resolvedChallenges,
    activeInnovatorTeams,
    totalBountyPool,
    totalCitizensImpacted,
    sdgDistribution,
    regionalBreakdown,
    categoryStats,
  };

  res.json({ success: true, data: summary });
});

// ----------------------------------------------------
// AI INTELLIGENCE ENGINE (GEMINI 3.7 FLASH)
// ----------------------------------------------------

// A. AI Analyze & Triage Challenge
app.post('/api/ai/analyze-challenge', async (req, res) => {
  try {
    const { rawDescription, locationText, reportedCategory } = req.body;
    const ai = getGeminiAI();

    const prompt = `You are the Lead Civic Solutions Architect & Chief Technology Evaluator for the Smart India Hackathon (SIH) Societal Challenges Crowdsourcing Platform.
Analyze this crowdsourced citizen problem statement and structure it into a high-precision, actionable engineering challenge brief.

Citizen Report:
"${rawDescription}"
Location: ${locationText || 'Rural / Semi-urban India'}
Reported Category: ${reportedCategory || 'General Societal Problem'}

Return a structured JSON adhering to the exact schema.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            refinedTitle: {
              type: Type.STRING,
              description: 'Crisp, professional engineering problem statement title',
            },
            refinedDescription: {
              type: Type.STRING,
              description: 'Structured comprehensive description highlighting exact technical bottlenecks and societal stakes',
            },
            sdgNumber: {
              type: Type.INTEGER,
              description: 'Primary UN Sustainable Development Goal number (1 to 17)',
            },
            sdgName: {
              type: Type.STRING,
              description: 'Official name of the primary UN SDG',
            },
            recommendedCategory: {
              type: Type.STRING,
              description: 'Best matching category: Water & Sanitation, Clean Energy & Climate, Rural Healthcare, Urban Infrastructure & Mobility, Agriculture & Agritech, Quality Education, Disaster Management, Women Safety & Inclusion, Waste Management & Circular Economy',
            },
            severityScore: {
              type: Type.INTEGER,
              description: 'Calculated urgency and severity score from 1 to 100 based on public health, safety, and scale',
            },
            severityLevel: {
              type: Type.STRING,
              description: 'Critical, High, Medium, or Low',
            },
            estimatedImpactedPopulation: {
              type: Type.INTEGER,
              description: 'Realistic estimate of impacted community population',
            },
            primaryTechDisciplines: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: '3 to 5 core STEM disciplines required (e.g. IoT Telemetry, Green Chemistry, Edge AI, Civil Hydraulics)',
            },
            rootCauses: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: '3 primary systemic or technological root causes',
            },
            suggestedApproaches: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: '3 high-potential technical or grassroots solution directions',
            },
            potentialRisks: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Key execution or maintenance risks to mitigate',
            },
            suggestedBountyINR: {
              type: Type.INTEGER,
              description: 'Recommended initial grant or hackathon prize pool in INR',
            },
            targetTRL: {
              type: Type.INTEGER,
              description: 'Target Technology Readiness Level (1-9) needed for pilot rollout',
            },
          },
          required: [
            'refinedTitle',
            'refinedDescription',
            'sdgNumber',
            'sdgName',
            'recommendedCategory',
            'severityScore',
            'severityLevel',
            'primaryTechDisciplines',
            'rootCauses',
            'suggestedApproaches',
          ],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    res.json({ success: true, data: parsed });
  } catch (error: any) {
    console.error('AI analyze-challenge error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// B. AI Evaluate & Score Solution
app.post('/api/ai/evaluate-solution', async (req, res) => {
  try {
    const { challengeTitle, challengeDescription, solutionTitle, methodology, trlLevel, budgetINR } = req.body;
    const ai = getGeminiAI();

    const prompt = `You are an expert technical evaluator and hackathon jury member assessing a societal solution proposal.
Challenge: "${challengeTitle}"
Challenge Details: "${challengeDescription}"

Submitted Solution:
Title: "${solutionTitle}"
Methodology & Tech Architecture: "${methodology}"
Current TRL Level: ${trlLevel} (1-9 scale)
Proposed Budget: ₹${budgetINR}

Evaluate this solution thoroughly across 5 standard engineering and social impact dimensions:
1. Technical Feasibility (0-20)
2. Scalability & Field Deployability (0-20)
3. Cost-Effectiveness & CAPEX/OPEX Efficiency (0-20)
4. Environmental Sustainability & Social Impact (0-20)
5. Risk Mitigation & Long-term Maintainability (0-20)

Return a structured JSON with total score (0-100) and actionable feedback.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            overallFeasibilityScore: {
              type: Type.INTEGER,
              description: 'Total score out of 100',
            },
            verdict: {
              type: Type.STRING,
              description: 'Strongly Recommended for Pilot, Promising with Refinements, Needs Further R&D, or Low Feasibility',
            },
            rubricBreakdown: {
              type: Type.OBJECT,
              properties: {
                technicalFeasibility: { type: Type.INTEGER },
                scalability: { type: Type.INTEGER },
                costEffectiveness: { type: Type.INTEGER },
                socialEnvironmentalImpact: { type: Type.INTEGER },
                riskMitigation: { type: Type.INTEGER },
              },
              required: [
                'technicalFeasibility',
                'scalability',
                'costEffectiveness',
                'socialEnvironmentalImpact',
                'riskMitigation',
              ],
            },
            keyStrengths: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Top 3 engineering or deployment strengths',
            },
            criticalVulnerabilities: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Potential failure modes, supply chain bottlenecks, or community resistance factors',
            },
            actionableRecommendations: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Concrete steps the team should take to accelerate deployment',
            },
            executiveSummary: {
              type: Type.STRING,
              description: 'Concise summary for government sponsors and CSR committee',
            },
          },
          required: [
            'overallFeasibilityScore',
            'verdict',
            'rubricBreakdown',
            'keyStrengths',
            'criticalVulnerabilities',
            'actionableRecommendations',
            'executiveSummary',
          ],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    res.json({ success: true, data: parsed });
  } catch (error: any) {
    console.error('AI evaluate-solution error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// C. AI Semantic Duplicate & Clustering Check
app.post('/api/ai/duplicate-check', async (req, res) => {
  try {
    const { title, description, city, state } = req.body;
    const ai = getGeminiAI();

    const existingBriefs = challenges.map((c) => ({
      id: c.id,
      title: c.title,
      location: `${c.location.city}, ${c.location.state}`,
      category: c.category,
      summary: c.description.slice(0, 150),
    }));

    const prompt = `Compare this newly submitted societal challenge report against existing active platform challenges to detect semantic duplicates or nearby problem clusters.

New Report:
Title: "${title}"
Description: "${description}"
Location: ${city}, ${state}

Existing Challenges Database:
${JSON.stringify(existingBriefs, null, 2)}

Return a structured JSON identifying if this is a unique issue or a duplicate/related cluster.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            isDuplicate: { type: Type.BOOLEAN },
            similarityConfidencePercentage: { type: Type.INTEGER },
            matchedChallengeId: { type: Type.STRING, description: 'ID if matched, else empty' },
            clusterTag: { type: Type.STRING, description: 'E.g., Rural-Water-Toxicity-North-India' },
            explanation: { type: Type.STRING },
            recommendation: {
              type: Type.STRING,
              description: 'Merge with existing challenge, Create as distinct regional sub-challenge, or Post as brand new challenge',
            },
          },
          required: [
            'isDuplicate',
            'similarityConfidencePercentage',
            'clusterTag',
            'explanation',
            'recommendation',
          ],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    res.json({ success: true, data: parsed });
  } catch (error: any) {
    console.error('AI duplicate-check error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// D. AI Formal CSR / Municipal Grant Proposal Generator
app.post('/api/ai/generate-proposal', async (req, res) => {
  try {
    const { challengeId, selectedSolutionId, sponsorFocus } = req.body;
    const challenge = challenges.find((c) => c.id === challengeId);
    if (!challenge) {
      return res.status(404).json({ success: false, error: 'Challenge not found' });
    }

    const solution = selectedSolutionId
      ? challenge.solutions.find((s) => s.id === selectedSolutionId)
      : challenge.solutions[0];

    const ai = getGeminiAI();

    const prompt = `Generate a formal Grant & Pilot Deployment Proposal ready for submission to government bodies (Smart Cities Mission, Jal Jeevan Mission, MeitY, NITI Aayog) and CSR Foundations (Tata, Infosys, Reliance, Wipro).

Challenge:
"${challenge.title}"
Location: ${challenge.location.city}, ${challenge.location.state}
Impacted Population: ${challenge.impactedPopulation.toLocaleString()} citizens
SDG Goal: SDG ${challenge.sdgNumber} - ${challenge.sdgName}
Severity: ${challenge.severity} (${challenge.severityScore}/100)

Proposed Solution (if any):
Title: ${solution ? solution.title : 'Decentralized Community Engineering Pilot'}
Team: ${solution ? solution.teamName : 'SIH Interdisciplinary Solver Consortium'}
Methodology: ${solution ? solution.methodology : 'Smart sensor and resilient local intervention'}
Budget: ₹${solution ? solution.estimatedBudget.toLocaleString() : challenge.bountyAmount.toLocaleString()}

Focus/Theme: ${sponsorFocus || 'Public-Private Civic Innovation Grant'}

Return a structured JSON with comprehensive formal executive pitch, budget justification, timeline milestones, measurable KPI targets, and CSR compliance section.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            projectTitle: { type: Type.STRING },
            executiveSummary: { type: Type.STRING },
            problemStatementAndUrgency: { type: Type.STRING },
            proposedInterventionModel: { type: Type.STRING },
            keyBeneficiariesCount: { type: Type.INTEGER },
            budgetBreakdown: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  head: { type: Type.STRING },
                  amountINR: { type: Type.INTEGER },
                  rationale: { type: Type.STRING },
                },
                required: ['head', 'amountINR', 'rationale'],
              },
            },
            totalGrantRequestedINR: { type: Type.INTEGER },
            executionMilestones: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  month: { type: Type.STRING },
                  deliverable: { type: Type.STRING },
                  targetOutput: { type: Type.STRING },
                },
                required: ['month', 'deliverable', 'targetOutput'],
              },
            },
            measurableImpactKPIs: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            csrAndGovernmentAlignment: { type: Type.STRING },
          },
          required: [
            'projectTitle',
            'executiveSummary',
            'problemStatementAndUrgency',
            'proposedInterventionModel',
            'budgetBreakdown',
            'totalGrantRequestedINR',
            'executionMilestones',
            'measurableImpactKPIs',
            'csrAndGovernmentAlignment',
          ],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    res.json({ success: true, data: parsed });
  } catch (error: any) {
    console.error('AI generate-proposal error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// E. JanSetu AI Civic Assistant Chatbot
app.post('/api/ai/civic-assistant', async (req, res) => {
  try {
    const { messages, userRole, currentContext } = req.body;
    const ai = getGeminiAI();

    const systemInstruction = `You are "JanSetu AI", an intelligent, empathetic, and knowledgeable Civic Innovation AI Assistant powering the SIH26043 Crowdsourcing Societal Challenges Platform.

Your primary roles:
1. Help citizens translate everyday pain points (water, traffic, waste, hospitals, safety, agriculture) into structured, clear, and high-impact problem statements.
2. Guide student innovators and SIH hackathon teams in discovering problem statements, refining technical architectures, and improving TRL readiness.
3. Assist government officials and CSR foundations in calculating social return on investment (SROI), structuring bounties, and monitoring milestone verifications.
4. Always be encouraging, constructive, precise, and culturally attuned to Indian and global grassroots realities.

Current User Role: ${userRole || 'citizen'}.
Platform Active Challenges Count: ${challenges.length}. Total Bounty Pool: ₹${challenges
      .reduce((a, b) => a + b.bountyAmount, 0)
      .toLocaleString()}.
Context: ${currentContext ? JSON.stringify(currentContext) : 'Browsing platform'}`;

    // Format chat history
    const contents = messages.map((m: any) => ({
      role: m.sender === 'user' ? 'user' : 'model',
      parts: [{ text: m.text }],
    }));

    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: contents,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    res.json({
      success: true,
      text: response.text || 'I am here to assist your civic innovation journey!',
    });
  } catch (error: any) {
    console.error('AI civic-assistant error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// F. Multilingual Grassroots Speech-to-Problem Drafter
app.post('/api/ai/multilingual-assist', async (req, res) => {
  try {
    const { inputQuery, sourceLanguage } = req.body;
    const ai = getGeminiAI();

    const prompt = `You are a multilingual vernacular language bridge for Indian citizens submitting societal problems.
The user provided input in ${sourceLanguage || 'their native language (Hindi/Tamil/Telugu/Marathi/Bengali/Kannada/Gujarati/etc.)'}:

User Input:
"${inputQuery}"

Task:
1. Translate and synthesize this raw expression into a professional, clear English problem statement.
2. Provide a bilingual summary so the citizen can confirm accuracy.
3. Automatically identify the primary UN SDG, severity level, and key keywords.

Return a structured JSON format.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            detectedLanguage: { type: Type.STRING },
            translatedTitle: { type: Type.STRING },
            structuredDescription: { type: Type.STRING },
            vernacularConfirmationMessage: { type: Type.STRING },
            suggestedCategory: { type: Type.STRING },
            sdgNumber: { type: Type.INTEGER },
            urgencyFlag: { type: Type.STRING },
          },
          required: [
            'detectedLanguage',
            'translatedTitle',
            'structuredDescription',
            'vernacularConfirmationMessage',
            'suggestedCategory',
            'sdgNumber',
          ],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    res.json({ success: true, data: parsed });
  } catch (error: any) {
    console.error('AI multilingual-assist error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ----------------------------------------------------
// VITE / STATIC SERVING INTEGRATION
// ----------------------------------------------------
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`JanSetu Crowdsourcing Server running on http://0.0.0.0:${PORT}`);
  });
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  startServer();
}

export default app;
