import { Student, RiskLevel } from '../types/slis';

const NAMES = ["Angie Henderson", "Crystal Johnson", "Patrick Thornton", "Richard Henson", "Gina Moore", "Susan Murray MD", "Jasmine Beltran", "William Herrera", "Jeremy Dalton", "Benjamin Smith"];

export const generateMockStudents = (count: number): Student[] => {
  return Array.from({ length: count }, (_, i) => {
    const riskLevels: RiskLevel[] = ['low', 'medium', 'high', 'critical'];
    const riskLevel = riskLevels[Math.floor(Math.random() * 4)];
    
    // Adjust metrics based on risk level for realism
    let baseScore = 75;
    let baseAttendance = 0.85;
    if (riskLevel === 'critical') { baseScore = 55; baseAttendance = 0.4; }
    else if (riskLevel === 'high') { baseScore = 65; baseAttendance = 0.6; }
    else if (riskLevel === 'low') { baseScore = 90; baseAttendance = 0.95; }

    const avgScore = baseScore + (Math.random() * 10 - 5);
    const attendance = Math.min(1, Math.max(0, baseAttendance + (Math.random() * 0.2 - 0.1)));

    return {
      id: `STU${String(i + 1).padStart(4, '0')}`,
      name: NAMES[i % NAMES.length],
      grade: 9 + Math.floor(Math.random() * 4),
      riskLevel,
      gpa: Number((2.0 + Math.random() * 2.0).toFixed(2)),
      avgScore: Number(avgScore.toFixed(1)),
      attendance: Number((attendance * 100).toFixed(1)),
      studyTime: Math.floor(Math.random() * 300),
      quizCompletion: Number((70 + Math.random() * 30).toFixed(1)),
      assignmentCompletion: Number((60 + Math.random() * 40).toFixed(1)),
      consecutiveAbsences: Math.floor(Math.random() * 15),
      socioeconomicIndex: Number(Math.random().toFixed(2)),
      scoreTrend: Number((Math.random() * 2 - 1).toFixed(2)),
      enrolledWeeks: 10 + Math.floor(Math.random() * 160),
      metrics: [
        { subject: 'Science', score: 70 + Math.random() * 20, avg: 75 },
        { subject: 'Mathematics', score: 65 + Math.random() * 25, avg: 72 },
        { subject: 'Computer Sci.', score: 80 + Math.random() * 15, avg: 78 },
        { subject: 'History', score: 60 + Math.random() * 30, avg: 70 },
        { subject: 'English', score: 75 + Math.random() * 20, avg: 75 },
      ],
      performanceHistory: Array.from({ length: 20 }, (_, week) => ({
        week: week + 1,
        score: Math.max(0, Math.min(100, (baseScore - 10) + Math.random() * 40))
      })),
      recommendations: [
        {
          title: "Critical Attendance Intervention Required",
          priority: 'high',
          actionSteps: [
            "Schedule an immediate meeting with the student and their guardian",
            "Identify root cause: health, transportation, family situation, or disengagement",
            "Create a formal Attendance Improvement Plan (AIP) with weekly check-ins"
          ],
          rationale: `Attendance rate of ${Number((attendance * 100).toFixed(1))}% is critically low.`,
          targets: ["Attendance rate → GPA", "Risk level"]
        }
      ]
    };
  });
};

export const MOCK_STUDENTS = generateMockStudents(500); // Increased to match the 500+ student scale in screenshots
