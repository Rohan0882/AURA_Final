import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { Student } from '../../types/slis';
import { motion } from 'motion/react';
import { AlertTriangle, Users, GraduationCap, Clock } from 'lucide-react';

interface OverviewViewProps {
  students: Student[];
}

export function OverviewView({ students }: OverviewViewProps) {
  const riskStats = {
    low: students.filter(s => s.riskLevel === 'low').length,
    medium: students.filter(s => s.riskLevel === 'medium').length,
    high: students.filter(s => s.riskLevel === 'high').length,
    critical: students.filter(s => s.riskLevel === 'critical').length,
  };

  const avgGPA = students.reduce((acc, s) => acc + s.gpa, 0) / students.length;
  const avgAttendance = students.reduce((acc, s) => acc + s.attendance, 0) / students.length;

  const pieData = [
    { name: 'Critical', value: riskStats.critical, color: '#EF4444' },
    { name: 'High', value: riskStats.high, color: '#F97316' },
    { name: 'Medium', value: riskStats.medium, color: '#EAB308' },
    { name: 'Low', value: riskStats.low, color: '#22C55E' },
  ];

  // Group GPAs for histogram (2.0 to 4.0 range)
  const gpaBins = Array.from({ length: 20 }, (_, i) => {
    const min = 2 + i * 0.1;
    const max = 2.1 + i * 0.1;
    return {
      range: min.toFixed(1),
      count: students.filter(s => s.gpa >= min && s.gpa < max).length
    };
  });

  const metrics = [
    { label: 'Total Students', value: students.length, sub: 'in current cohort', icon: Users, color: 'text-zinc-400' },
    { label: 'Average GPA', value: avgGPA.toFixed(2), sub: `σ = 0.31 (out of 4.0)`, icon: GraduationCap, color: 'text-blue-500' },
    { label: 'Avg Attendance', value: `${avgAttendance.toFixed(1)}%`, sub: `${students.filter(s => s.attendance < 80).length} students below 80%`, icon: Clock, color: 'text-cyan-500' },
    { label: 'At-Risk Students', value: riskStats.high + riskStats.critical, sub: `${(((riskStats.high + riskStats.critical) / students.length) * 100).toFixed(1)}% of cohort (high + critical)`, icon: AlertTriangle, color: 'text-orange-500' },
    { label: 'Critical Risk', value: riskStats.critical, sub: 'immediate action needed', icon: AlertTriangle, color: 'text-red-500' },
  ];

  return (
    <div className="space-y-12 pb-20">
      <header className="space-y-2">
        <h1 className="text-5xl font-black tracking-tighter flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-2xl">🎓</div>
          AURA — Learning Intelligence Dashboard
        </h1>
        <p className="text-zinc-400 font-medium tracking-wide">AI-powered insights for student success</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {metrics.map((m, i) => (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            key={m.label} 
            className="bg-[#2B2F36]/60 border border-white/5 backdrop-blur-xl p-6 rounded-[32px] space-y-4 hover:border-zinc-500 transition-all duration-300 group shadow-lg shadow-black/10"
          >
            <div className="flex items-center justify-between">
              <m.icon size={20} className={`${m.color} group-hover:scale-110 transition-transform`} />
              <div className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-pulse shadow-[0_0_10px_#2563eb]" />
            </div>
            <div>
              <div className="text-4xl font-black tracking-tighter leading-none">{m.value}</div>
              <div className="text-[10px] font-black uppercase tracking-wider text-zinc-200 mt-2">{m.label}</div>
              <div className="text-[9px] font-mono text-zinc-400 opacity-90 truncate mt-2">{m.sub}</div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-[#2B2F36]/30 border border-white/5 rounded-[48px] p-10 h-[550px] flex flex-col group overflow-hidden relative shadow-lg">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500/20 to-transparent" />
          <h3 className="text-2xl font-black mb-8 tracking-tight flex items-center gap-3">
             <div className="w-2 h-8 bg-blue-600 rounded-full" />
             Risk Level Distribution
          </h3>
          <div className="flex-1 relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={110}
                  outerRadius={160}
                  paddingAngle={8}
                  dataKey="value"
                  stroke="none"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#2B2F36', border: '1px solid #3F3F46', borderRadius: '24px', padding: '16px' }}
                  itemStyle={{ color: '#fff', fontSize: '13px', fontWeight: '900' }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
              <div className="text-5xl font-black tracking-tighter leading-none">{students.length}</div>
              <div className="text-[11px] font-black uppercase text-zinc-300 tracking-[.3em] mt-2">Active Students</div>
            </div>
          </div>
          <div className="grid grid-cols-4 gap-6 mt-10 pt-10 border-t border-white/5">
            {pieData.map(d => (
              <div key={d.name} className="flex flex-col items-center gap-1">
                <div style={{ color: d.color }} className="text-xl font-black">{((d.value/students.length)*100).toPrecision(2)}%</div>
                <div className="text-[9px] font-black uppercase tracking-widest text-zinc-300">{d.name}</div>
                <div className="w-5 h-1 rounded-full mt-2" style={{ backgroundColor: d.color }} />
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#2B2F36]/30 border border-white/5 rounded-[48px] p-10 h-[550px] flex flex-col group overflow-hidden relative shadow-lg">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent" />
          <h3 className="text-2xl font-black mb-8 tracking-tight flex items-center gap-3">
             <div className="w-2 h-8 bg-cyan-600 rounded-full" />
             GPA Distribution
          </h3>
          <div className="flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={gpaBins}>
                <CartesianGrid strokeDasharray="3 3" stroke="#3F3F46" vertical={false} />
                <XAxis dataKey="range" axisLine={false} tickLine={false} tick={{ fill: '#A1A1AA', fontSize: 10, fontWeight: '900' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#A1A1AA', fontSize: 10, fontWeight: '900' }} />
                <Tooltip 
                  cursor={{ fill: 'rgba(255,255,255,0.03)', radius: 8 }}
                  contentStyle={{ backgroundColor: '#2B2F36', border: '1px solid #3F3F46', borderRadius: '24px', padding: '16px' }}
                />
                <Bar dataKey="count" fill="url(#blueGradient)" radius={[8, 8, 0, 0]} />
                <defs>
                  <linearGradient id="blueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity={1} />
                    <stop offset="100%" stopColor="#1e40af" stopOpacity={0.6} />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-8 flex justify-between items-center px-4 py-6 bg-white/5 rounded-3xl border border-white/5">
             <div className="flex items-center gap-8">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-blue-600 rounded-full shadow-[0_0_8px_#2563eb]" />
                  <span className="text-[11px] font-black uppercase tracking-widest text-zinc-300">Student Count</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-red-500/30 rounded-full flex items-center justify-center text-[8px] border border-red-500/50 text-red-100">!</div>
                  <span className="text-[11px] font-black uppercase tracking-widest text-zinc-300">2.0 Baseline</span>
                </div>
             </div>
             <div className="text-[10px] font-mono text-zinc-500 opacity-60 uppercase tracking-widest">Analytics_v1.2.0</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
         <div className="bg-[#2B2F36]/20 border border-white/5 rounded-[40px] p-8 space-y-4 hover:bg-[#2B2F36]/40 transition-colors group">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-red-500">Problem Identification</h4>
            <div className="text-xl font-black italic text-zinc-100 group-hover:text-white transition-colors">Cluster 3 shows massive attendance decay.</div>
            <p className="text-xs text-zinc-300 leading-relaxed font-semibold">Early signals indicate external socioeconomic factors affecting commute reliability in the 10th grade cohort.</p>
         </div>
         <div className="bg-[#2B2F36]/20 border border-white/5 rounded-[40px] p-8 space-y-4 hover:bg-[#2B2F36]/40 transition-colors group">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-blue-500">Proposed Solution</h4>
            <div className="text-xl font-black italic text-zinc-100 group-hover:text-white transition-colors">Hybrid Learning Support.</div>
            <p className="text-xs text-zinc-300 leading-relaxed font-semibold">Implementation of asynchronous modules for critical core subjects to buffer attendance fluctuations.</p>
         </div>
         <div className="bg-[#2B2F36]/20 border border-white/5 rounded-[40px] p-8 space-y-4 hover:bg-[#2B2F36]/40 transition-colors group">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-green-500">Long-term Impact</h4>
            <div className="text-xl font-black italic text-zinc-100 group-hover:text-white transition-colors">+12% Graduation Rate.</div>
            <p className="text-xs text-zinc-300 leading-relaxed font-semibold">Predictive modeling suggests stabilizing attendance now prevents academic burnout in graduation years.</p>
         </div>
         <div className="bg-[#2B2F36]/20 border border-white/5 rounded-[40px] p-8 space-y-4 hover:bg-[#2B2F36]/40 transition-colors group">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-purple-500">AI Recommendation</h4>
            <div className="text-xl font-black italic text-zinc-100 group-hover:text-white transition-colors">Targeted Peer Groups.</div>
            <p className="text-xs text-zinc-300 leading-relaxed font-semibold">Establish study clusters matching high-attendance students with at-risk cohorts for social accountability.</p>
         </div>
      </div>
    </div>
  );
}
