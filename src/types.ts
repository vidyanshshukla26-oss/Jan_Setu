export type ChallengeCategory =
  | 'Water & Sanitation'
  | 'Clean Energy & Climate'
  | 'Rural Healthcare'
  | 'Urban Infrastructure & Mobility'
  | 'Agriculture & Agritech'
  | 'Quality Education'
  | 'Disaster Management'
  | 'Women Safety & Inclusion'
  | 'Waste Management & Circular Economy';

export type SeverityLevel = 'Critical' | 'High' | 'Medium' | 'Low';

export type ChallengeStatus =
  | 'open_for_solutions'
  | 'under_review'
  | 'pilot_in_progress'
  | 'resolved'
  | 'grant_allocated';

export type UserRole = 'citizen' | 'innovator' | 'government_csr' | 'evaluator';

export interface LocationData {
  city: string;
  state: string;
  country: string;
  latitude: number;
  longitude: number;
  address?: string;
  pincode?: string;
}

export interface Sponsor {
  id: string;
  name: string;
  type: 'Government' | 'CSR Foundation' | 'NGO' | 'Corporate' | 'Incubator';
  logo?: string;
  amount: number; // in INR
}

export interface Milestone {
  id: string;
  title: string;
  targetDate: string;
  fundsPercentage: number;
  status: 'pending' | 'in_review' | 'verified' | 'completed';
  proofUrl?: string;
}

export interface Solution {
  id: string;
  challengeId: string;
  title: string;
  teamName: string;
  teamLead: {
    name: string;
    email: string;
    organizationOrCollege: string;
    avatar?: string;
  };
  abstract: string;
  methodology: string;
  trlLevel: number; // Technology Readiness Level (1-9)
  estimatedBudget: number; // in INR
  durationWeeks: number;
  prototypeUrl?: string;
  githubUrl?: string;
  videoPitchUrl?: string;
  upvotes: number;
  status: 'submitted' | 'shortlisted' | 'pilot_approved' | 'awarded' | 'implemented';
  submittedAt: string;
  aiFeasibilityScore?: number;
  aiReviewSummary?: string;
  endorsements: number;
  milestones: Milestone[];
}

export interface Comment {
  id: string;
  authorName: string;
  authorRole: UserRole;
  authorOrg?: string;
  text: string;
  createdAt: string;
  isOfficialUpdate?: boolean;
  evidenceUrl?: string;
}

export interface Challenge {
  id: string;
  title: string;
  category: ChallengeCategory;
  sdgNumber: number;
  sdgName: string;
  description: string;
  impactedPopulation: number;
  location: LocationData;
  severity: SeverityLevel;
  severityScore: number; // 1-100
  status: ChallengeStatus;
  reportedBy: {
    name: string;
    role: UserRole;
    organization?: string;
    avatar?: string;
  };
  reportedDate: string;
  upvotes: number;
  hasUpvoted?: boolean;
  bountyAmount: number; // in INR
  sponsors: Sponsor[];
  evidenceImages: string[];
  primaryTechDisciplines: string[];
  aiAnalysis?: {
    summary: string;
    rootCauses: string[];
    suggestedApproaches: string[];
    potentialRisks: string[];
    estimatedTimelineMonths: number;
    recommendedTRLTarget: number;
  };
  solutionsCount: number;
  solutions: Solution[];
  comments: Comment[];
  verifiedByOfficial: boolean;
  officialVerifierName?: string;
}

export interface AnalyticsSummary {
  totalChallenges: number;
  resolvedChallenges: number;
  activeInnovatorTeams: number;
  totalBountyPool: number;
  totalCitizensImpacted: number;
  sdgDistribution: { sdg: string; count: number; color: string }[];
  regionalBreakdown: { state: string; count: number; resolved: number }[];
  categoryStats: { category: string; count: number; funding: number }[];
}

export interface AIChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  actions?: { label: string; actionType: string; payload?: any }[];
}
