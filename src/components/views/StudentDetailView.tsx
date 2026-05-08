import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine } from 'recharts';
import { User, Search, Activity, Zap, TrendingUp, TrendingDown } from 'lucide-react';
import { Student } from '../../types/slis';
import { motion } from 'motion/react';
import { ExplainabilityModule } from '../explainability/ExplainabilityModule';

interface StudentDetailViewProps {
  student: Student;
}

const GaugeItem = ({ label, value, color, secondary, unit = '%' }: { label: string; value: number; color: string; secondary?: string; unit?: string }) => (
  <div className="bg-[#2B2F36]/40 border border-white/5 p-8 rounded-[40px] flex flex-col items-center group relative overflow-hidden shadow-lg">
    <div className="absolute top-0 left-0 w-full h-1 opacity-20" style={{ backgroundColor: color }} />
    <h4 className="text-[10px] uppercase tracking-[0.2em] font-black text-zinc-300 mb-8 italic">{label}</h4>
    <div className="relative w-full aspect-[4/3] flex items-center justify-center">
       {/* Semi-circle Gauge */}
       <svg viewBox="0 0 100 60" className="w-full h-full">
          <path d="M 10 50 A 40 40 0 0 1 90 50" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" strokeLinecap="round" />
          <motion.path 
            initial={{ pathLength: 0 }}
            animate={{ pathLength: value / 100 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            d="M 10 50 A 40 40 0 0 1 90 50" 
            fill="none" 
            stroke={color} 
            strokeWidth="8" 
            strokeLinecap="round" 
            style={{ filter: `drop-shadow(0 0 10px ${color}88)` }}
          />
       </svg>
       <div className="absolute bottom-2 text-center">
          <div className="text-5xl font-black tracking-tighter leading-none">{value.toFixed(1)}{unit}</div>
          {secondary && (
            <div className={`text-[11px] font-black uppercase mt-2 flex items-center justify-center gap-1 ${secondary.includes('-') && !secondary.includes('vs') ? 'text-red-500' : 'text-green-500'}`}>
               {secondary}
            </div>
          )}
       </div>
    </div>
    <div className="mt-4 flex justify-between w-full px-4 font-mono text-[8px] opacity-20 uppercase font-black tracking-widest">
       <span>0</span>
       <span>{label === 'Study Time' ? '300' : '100'}</span>
    </div>
  </div>
);

export function StudentDetailView({ student }: StudentDetailViewProps) {
  const radarData = student.metrics.map(m => ({
    subject: m.subject,
    Student: m.score,
    ClassAvg: m.avg
  }));

  const riskFactors = [
    { label: 'Average Score', value: student.avgScore, max: 100, color: 'bg-blue-600' },
    { label: 'Attendance Rate', value: student.attendance, max: 100, color: 'bg-red-500' },
    { label: 'Study Time (min/wk)', value: student.studyTime, max: 300, color: 'bg-cyan-500' },
    { label: 'Quiz Completion', value: student.quizCompletion, max: 100, color: 'bg-blue-400' },
    { label: 'Assignment Completion', value: student.assignmentCompletion, max: 100, color: 'bg-blue-300' },
  ];

  return (
    <div className="space-y-12 pb-32">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 bg-white/5 border border-white/10 rounded-[28px] flex items-center justify-center relative group">
             <div className="absolute inset-0 bg-blue-600/20 blur-2xl group-hover:bg-blue-600/40 transition-colors" />
             <User size={36} className="text-white relative z-10" />
          </div>
          <div>
            <h2 className="text-6xl font-black tracking-tighter">{student.name}</h2>
            <div className="flex gap-6 mt-3 text-[10px] font-mono font-black uppercase tracking-widest text-zinc-500">
              <div className="flex items-center gap-2">
                 <span className="opacity-30">Student ID:</span>
                 <span className="text-blue-500 font-bold uppercase">{student.id}</span>
              </div>
              <div className="flex items-center gap-2">
                 <span className="opacity-30">Grade:</span>
                 <span className="text-white">{student.grade}</span>
              </div>
              <div className="flex items-center gap-2">
                 <span className="opacity-30">Enrolled:</span>
                 <span className="text-white">{student.enrolledWeeks} weeks</span>
              </div>
            </div>
          </div>
        </div>

        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className={`bg-[#2B2F36] border-2 px-14 py-8 rounded-[40px] flex flex-col items-center gap-3 shadow-2xl ${
            student.riskLevel === 'critical' ? 'border-red-500/50 shadow-red-500/10' : 
            student.riskLevel === 'high' ? 'border-orange-500/50 shadow-orange-500/10' :
            'border-green-500/50 shadow-green-500/10'
          }`}
        >
          <div className={`w-4 h-4 rounded-full animate-ping ${
            student.riskLevel === 'critical' ? 'bg-red-500' : 'bg-orange-500'
          }`} />
          <span className="text-xl font-black uppercase tracking-[.2em]">{student.riskLevel} RISK</span>
        </motion.div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <GaugeItem label="Average Score" value={student.avgScore} color="#EF4444" secondary="▼ -12.4 vs PW" />
        <GaugeItem label="Attendance Rate" value={student.attendance} color="#F97316" secondary="▼ -61.0" />
        <GaugeItem label="Study Time" value={student.studyTime} color="#818CF8" unit=" min/wk" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-[#2B2F36]/20 border border-white/5 rounded-[48px] p-10 h-[550px] flex flex-col relative overflow-hidden group shadow-inner">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500/20 to-transparent" />
          <h3 className="text-2xl font-black mb-8 tracking-tight flex items-center gap-3 text-white">
             <div className="w-1.5 h-8 bg-blue-600 rounded-full" />
             Subject Performance Radar
          </h3>
          <div className="flex-1">
             <ResponsiveContainer width="100%" height="100%">
               <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                 <PolarGrid stroke="rgba(255,255,255,0.05)" />
                 <PolarAngleAxis dataKey="subject" tick={{ fill: '#A0A0A0', fontSize: 11, fontWeight: 'black' }} />
                 <Radar name="Student" dataKey="Student" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.6} />
                 <Radar name="Class Average" dataKey="ClassAvg" stroke="#ffffff" fill="transparent" strokeDasharray="5 5" fillOpacity={0} />
               </RadarChart>
             </ResponsiveContainer>
          </div>
          <div className="mt-8 flex justify-center gap-8 text-[10px] font-black uppercase tracking-widest text-zinc-400">
             <div className="flex items-center gap-2">
                <div className="w-3 h-1 bg-blue-500 rounded-full" />
                <span>Student</span>
             </div>
             <div className="flex items-center gap-2">
                <div className="w-3 h-1 border border-white border-dashed rounded-full" />
                <span>Class Avg (75%)</span>
             </div>
          </div>
        </div>

        <div className="bg-[#2B2F36]/20 border border-white/5 rounded-[48px] p-10 h-[550px] flex flex-col relative overflow-hidden group shadow-inner">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent" />
          <h3 className="text-2xl font-black mb-8 tracking-tight flex items-center gap-3 text-white">
             <div className="w-1.5 h-8 bg-cyan-600 rounded-full" />
             Risk Factor Analysis
          </h3>
          <div className="flex-1 space-y-8 flex flex-col justify-center">
            {riskFactors.map(f => (
               <div key={f.label} className="space-y-3">
                  <div className="flex justify-between items-center text-[11px] font-black uppercase tracking-widest">
                     <div className="flex items-center gap-3">
                        <Search size={14} className="opacity-20" />
                        <span>{f.label}: {f.value.toFixed(1)}</span>
                     </div>
                     <span className="font-mono opacity-20">w_imp: 0.88</span>
                  </div>
                  <div className="h-4 bg-white/5 rounded-full overflow-hidden border border-white/5 p-1">
                     <motion.div 
                       initial={{ width: 0 }}
                       animate={{ width: `${(f.value / f.max) * 100}%` }}
                       transition={{ duration: 1, ease: [0.23, 1, 0.32, 1] }}
                       className={`h-full rounded-full ${f.color}`}
                     />
                  </div>
               </div>
            ))}
          </div>
          <div className="mt-8 text-center text-[10px] font-mono opacity-20 italic">SHAP value analysis / Local surrogate explanation active</div>
        </div>
      </div>

      <ExplainabilityModule student={student} />

      <div className="bg-[#2B2F36]/30 border border-white/5 rounded-[48px] p-12 relative overflow-hidden shadow-xl">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-600/5 blur-[120px] rounded-full" />
        <div className="flex justify-between items-center mb-12">
           <div className="flex items-center gap-4">
              <div className="w-1.5 h-10 bg-white rounded-full" />
              <h3 className="text-3xl font-black tracking-tighter text-white">Performance Trend</h3>
           </div>
           <div className="flex items-center gap-6">
              <div className="flex flex-col items-end">
                 <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Score Trend</span>
                 <div className={`flex items-center gap-2 text-sm font-black ${student.scoreTrend >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {student.scoreTrend >= 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                    {student.scoreTrend >= 0 ? 'Improving' : 'Declining'}
                 </div>
              </div>
              <div className="h-10 w-px bg-white/10" />
              <Zap className="text-yellow-500" />
           </div>
        </div>
        <div className="h-[400px]">
           <ResponsiveContainer width="100%" height="100%">
              <LineChart data={student.performanceHistory}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="week" axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 'black', fill: '#A1A1AA' }} label={{ value: 'Academic Week', position: 'insideBottom', offset: -10, fill: '#A1A1AA', fontSize: 10, fontWeight: 'black' }} />
                <YAxis hide domain={[0, 100]} />
                <Tooltip 
                   contentStyle={{ backgroundColor: '#2B2F36', border: '1px solid #3F3F46', borderRadius: '24px', padding: '16px' }}
                   itemStyle={{ color: '#fff', fontSize: '13px', fontWeight: '900' }}
                />
                <ReferenceLine y={60} stroke="#EF4444" strokeDasharray="5 5" label={{ value: 'Pass threshold (60%)', fill: '#EF4444', fontSize: 10, fontWeight: 'black', position: 'right' }} />
                <ReferenceLine y={student.avgScore} stroke="#3b82f6" strokeDasharray="3 3" label={{ value: `Avg: ${student.avgScore.toFixed(1)}%`, fill: '#3b82f6', fontSize: 10, fontWeight: 'black', position: 'right' }} />
                <Line type="monotone" dataKey="score" stroke="#3b82f6" strokeWidth={5} dot={{ r: 6, fill: '#3b82f6', strokeWidth: 0 }} activeDot={{ r: 8, stroke: '#fff', strokeWidth: 4 }} />
              </LineChart>
           </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
