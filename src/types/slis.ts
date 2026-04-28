export type RiskLevel = 'low' | 'medium' | 'high' | 'critical';

export interface StudentMetric {
  subject: string;
  score: number;
  avg: number;
}

export interface AssessmentPoint {
  week: number;
  score: number;
}

export interface Student {
  id: string;
  name: string;
  grade: number;
  riskLevel: RiskLevel;
  gpa: number;
  avgScore: number;
  attendance: number;
  studyTime: number; // minutes per week
  quizCompletion: number;
  assignmentCompletion: number;
  consecutiveAbsences: number;
  socioeconomicIndex: number;
  scoreTrend: number;
  metrics: StudentMetric[];
  performanceHistory: AssessmentPoint[];
  enrolledWeeks: number;
  recommendations: {
    title: string;
    priority: 'high' | 'medium' | 'low';
    actionSteps: string[];
    rationale: string;
    targets: string[];
  }[];
}

export type ViewType = 'overview' | 'risk_monitor' | 'student_detail' | 'recommendations' | 'eda_explorer' | 'model_training';
