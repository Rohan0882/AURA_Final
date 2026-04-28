import React, { useState } from 'react';
import { Search, ChevronDown, Filter, LayoutGrid, Info, Check, Bell, Users, MoreHorizontal } from 'lucide-react';
import { Student, RiskLevel } from '../../types/slis';
import { motion, AnimatePresence } from 'motion/react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface RiskMonitorViewProps {
  students: Student[];
  onSelectStudent: (student: Student) => void;
}

export function RiskMonitorView({ students, onSelectStudent }: RiskMonitorViewProps) {
  const [riskFilters, setRiskFilters] = useState<RiskLevel[]>(['critical', 'high']);
  const [gradeFilter, setGradeFilter] = useState<string>('All');
  const [search, setSearch] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [showBulkActions, setShowBulkActions] = useState(false);

  const filteredStudents = students.filter(s => {
    const riskMatch = riskFilters.length === 0 || riskFilters.includes(s.riskLevel);
    const gradeMatch = gradeFilter === 'All' || s.grade.toString() === gradeFilter;
    const searchMatch = s.name.toLowerCase().includes(search.toLowerCase()) || s.id.toLowerCase().includes(search.toLowerCase());
    return riskMatch && gradeMatch && searchMatch;
  });

  const toggleRiskFilter = (level: RiskLevel) => {
    setRiskFilters(prev => 
      prev.includes(level) ? prev.filter(l => l !== level) : [...prev, level]
    );
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredStudents.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredStudents.map(s => s.id));
    }
  };

  const toggleSelectStudent = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleBulkAction = (action: string) => {
    console.log(`Executing ${action} for students:`, selectedIds);
    // In a real app, this would trigger an API call
    alert(`Action "${action}" applied to ${selectedIds.length} students`);
    setSelectedIds([]);
    setShowBulkActions(false);
  };

  const riskStats = {
    low: students.filter(s => s.riskLevel === 'low').length,
    medium: students.filter(s => s.riskLevel === 'medium').length,
    high: students.filter(s => s.riskLevel === 'high').length,
    critical: students.filter(s => s.riskLevel === 'critical').length,
  };

  // Data for "Risk Distribution by Grade"
  const grades = [9, 10, 11, 12];
  const distributionData = grades.map(g => ({
    grade: `Grade ${g}`,
    critical: students.filter(s => s.grade === g && s.riskLevel === 'critical').length,
    high: students.filter(s => s.grade === g && s.riskLevel === 'high').length,
    medium: students.filter(s => s.grade === g && s.riskLevel === 'medium').length,
    low: students.filter(s => s.grade === g && s.riskLevel === 'low').length,
  }));

  return (
    <div className="space-y-12">
      <header className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-5xl font-black tracking-tighter flex items-center gap-4">
            <div className="w-12 h-12 bg-orange-600 rounded-2xl flex items-center justify-center text-2xl">⚠️</div>
            Risk Observation Pulse
          </h1>
          <p className="text-zinc-400 font-medium tracking-wide italic leading-relaxed">Identify and prioritize students who need immediate intervention based on high-velocity data</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 bg-[#2B2F36]/40 border border-white/5 p-8 rounded-[40px] backdrop-blur-xl">
           <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-100 flex items-center gap-2">
                <Filter size={12} /> Risk Level Filter
              </label>
              <div className="flex flex-wrap gap-2">
                 {(['low', 'medium', 'high', 'critical'] as RiskLevel[]).map(level => (
                   <button 
                     key={level}
                     onClick={() => toggleRiskFilter(level)}
                     className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
                       riskFilters.includes(level) 
                        ? (level === 'critical' ? 'bg-red-500 text-black shadow-[0_0_15px_rgba(239,68,68,0.4)]' : 
                           level === 'high' ? 'bg-orange-500 text-black shadow-[0_0_15px_rgba(249,115,22,0.4)]' :
                           level === 'medium' ? 'bg-yellow-500 text-black shadow-[0_0_15px_rgba(234,179,8,0.4)]' : 
                           'bg-green-500 text-black shadow-[0_0_15px_rgba(34,197,94,0.4)]')
                        : 'bg-white/10 text-zinc-300 hover:text-white border border-transparent hover:border-white/10'
                     }`}
                   >
                     {level}
                   </button>
                 ))}
              </div>
           </div>

           <div className="space-y-3">
             <label className="text-[10px] font-black uppercase tracking-widest text-zinc-300">Grade Level</label>
             <div className="relative group">
                <select 
                  value={gradeFilter}
                  onChange={(e) => setGradeFilter(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-3 text-xs font-black appearance-none outline-none focus:border-blue-500 cursor-pointer transition-colors text-zinc-100"
                >
                  <option value="All" className="bg-zinc-800">All Grades</option>
                  <option value="9" className="bg-zinc-800">Grade 9</option>
                  <option value="10" className="bg-zinc-800">Grade 10</option>
                  <option value="11" className="bg-zinc-800">Grade 11</option>
                  <option value="12" className="bg-zinc-800">Grade 12</option>
                </select>
                <ChevronDown size={14} className="absolute right-6 top-1/2 -translate-y-1/2 opacity-40 pointer-events-none group-hover:opacity-100 transition-opacity text-white" />
             </div>
           </div>

        <div className="md:col-span-2 space-y-3">
             <label className="text-[10px] font-black uppercase tracking-widest text-zinc-300">Student Search</label>
             <div className="relative">
                <Search size={16} className="absolute left-6 top-1/2 -translate-y-1/2 text-white/40" />
                <input 
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search ID or Name..."
                  className="w-full bg-white/5 border border-white/10 rounded-2xl pl-14 pr-6 py-3 text-xs font-black outline-none focus:border-blue-500 transition-colors text-white placeholder:text-zinc-500"
                />
             </div>
           </div>
        </div>
      </header>

       <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
         {[
           { color: 'bg-green-500', label: 'LOW', value: riskStats.low, subText: '0% of filtered' },
           { color: 'bg-yellow-500', label: 'MEDIUM', value: riskStats.medium, subText: '0% of filtered' },
           { color: 'bg-orange-500', label: 'HIGH', value: riskStats.high, subText: '49% of filtered' },
           { color: 'bg-red-500', label: 'CRITICAL', value: riskStats.critical, subText: '51% of filtered' },
         ].map((s, i) => (
           <div key={i} className="bg-[#2B2F36]/40 border border-white/5 rounded-3xl p-6 flex flex-col items-center justify-center space-y-2 group hover:bg-[#2B2F36]/60 transition-all shadow-lg">
              <div className="text-4xl font-black tracking-tighter" style={{ color: s.color.replace('bg-', 'var(--') }}>{s.value}</div>
              <div className="px-3 py-1 rounded-full text-[9px] font-black tracking-[0.2em] border border-white/10 text-zinc-300 group-hover:text-white transition-colors uppercase">{s.label}</div>
              <div className="text-[8px] font-mono text-zinc-400 opacity-90 italic">{s.subText}</div>
           </div>
         ))}
       </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-[#2B2F36]/20 border border-white/5 rounded-[48px] p-10 h-[500px] flex flex-col relative overflow-hidden shadow-inner">
             <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-black tracking-tight flex items-center gap-3">
                   <LayoutGrid size={24} className="text-blue-600" />
                   Risk Distribution by Grade
                </h3>
                <Info size={18} className="opacity-20 cursor-help hover:opacity-100 transition-opacity" />
             </div>
             <div className="flex-1">
                <ResponsiveContainer width="100%" height="100%">
                   <BarChart data={distributionData} stackOffset="expand" margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#3F3F46" vertical={false} />
                      <XAxis dataKey="grade" axisLine={false} tickLine={false} tick={{ fill: '#A1A1AA', fontSize: 10, fontWeight: '900' }} height={50} />
                      <YAxis hide />
                      <Tooltip 
                         cursor={{ fill: 'rgba(255,255,255,0.03)' }}
                         contentStyle={{ backgroundColor: '#2B2F36', border: '1px solid #3F3F46', borderRadius: '24px' }}
                      />
                      <Bar dataKey="low" stackId="a" fill="#22C55E" barSize={40} />
                      <Bar dataKey="medium" stackId="a" fill="#EAB308" barSize={40} />
                      <Bar dataKey="high" stackId="a" fill="#F97316" barSize={40} />
                      <Bar dataKey="critical" stackId="a" fill="#EF4444" barSize={40} radius={[8, 8, 0, 0]} />
                   </BarChart>
                </ResponsiveContainer>
             </div>
             <div className="mt-8 flex gap-6 text-[9px] font-black uppercase tracking-widest text-zinc-300 justify-center">
                {['low', 'medium', 'high', 'critical'].map(l => (
                  <div key={l} className="flex items-center gap-2">
                     <div className={`w-2 h-2 rounded-full ${l === 'low' ? 'bg-green-500' : l === 'medium' ? 'bg-yellow-500' : l === 'high' ? 'bg-orange-500' : 'bg-red-500'}`} />
                     <span>{l}</span>
                  </div>
                ))}
             </div>
          </div>

          <div className="bg-[#2B2F36]/20 border border-white/5 rounded-[48px] p-10 h-[500px] flex flex-col relative overflow-hidden shadow-inner">
             <h3 className="text-2xl font-black mb-8 tracking-tight flex items-center gap-3">
                <Filter size={24} className="text-cyan-600" />
                Risk Factor Distribution
             </h3>
             <div className="flex-1 flex flex-col gap-8 justify-center">
                {['Average Score', 'Attendance', 'Study Time'].map((factor, i) => (
                  <div key={factor} className="space-y-4">
                     <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-zinc-300">
                        <span>{factor} Variance</span>
                        <span className="font-mono opacity-60">σ Analysis</span>
                     </div>
                     <div className="h-12 w-full bg-white/5 rounded-2xl relative overflow-hidden flex items-center border border-white/10">
                         <div className={`absolute h-full w-12 blur-xl opacity-20 ${i === 0 ? 'bg-blue-500' : i === 1 ? 'bg-red-500' : 'bg-cyan-500'}`} style={{ left: '40%' }} />
                         <div className="absolute left-[40%] right-[30%] h-4 bg-white/10 rounded-full border border-white/20 flex items-center justify-center">
                            <div className="w-1 h-8 bg-white/40 rounded-full" />
                         </div>
                     </div>
                  </div>
                ))}
             </div>
             <div className="mt-8 text-center text-[9px] font-mono opacity-30">Box-plot visualization of core variables vs risk level</div>
          </div>
       </div>

       <div className="bg-[#2B2F36]/40 border border-white/5 rounded-[48px] overflow-hidden backdrop-blur-xl shadow-2xl">
         <div className="px-10 py-8 border-b border-white/10 flex justify-between items-center bg-white/[0.02]">
            <div className="flex items-center gap-6">
               <h3 className="text-2xl font-black tracking-tight text-white">Active Intervention List</h3>
              {selectedIds.length > 0 && (
                <motion.div 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center gap-2 bg-blue-600 px-4 py-1.5 rounded-full"
                >
                   <span className="text-[10px] font-black uppercase tracking-widest text-white">{selectedIds.length} Selected</span>
                </motion.div>
              )}
           </div>
           
           <div className="flex items-center gap-4">
              <div className="text-[10px] font-mono opacity-30">{filteredStudents.length} Students matching current filters</div>
              
              {selectedIds.length > 0 && (
                <div className="relative">
                  <button 
                    onClick={() => setShowBulkActions(!showBulkActions)}
                    className="flex items-center gap-2 bg-white text-black px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-zinc-200 transition-colors"
                  >
                    Bulk Actions <ChevronDown size={14} className={`transition-transform ${showBulkActions ? 'rotate-180' : ''}`} />
                  </button>
                  
                  <AnimatePresence>
                    {showBulkActions && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute right-0 mt-2 w-56 bg-[#1A1A1A] border border-white/10 rounded-3xl p-2 z-50 shadow-2xl"
                      >
                         <button 
                           onClick={() => handleBulkAction('Assign to Counselor')}
                           className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 rounded-2xl text-xs font-black transition-colors"
                         >
                            <Users size={16} className="text-blue-500" /> Assign Counselor
                         </button>
                         <button 
                           onClick={() => handleBulkAction('Send Notification')}
                           className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 rounded-2xl text-xs font-black transition-colors"
                         >
                            <Bell size={16} className="text-orange-500" /> Send Notification
                         </button>
                         <button 
                           onClick={() => handleBulkAction('Export Student Data')}
                           className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 rounded-2xl text-xs font-black transition-colors border-t border-white/5 mt-1 pt-3"
                         >
                            <MoreHorizontal size={16} className="opacity-40" /> Export Selected
                         </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
           </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/5">
                <th className="px-10 py-6 w-10">
                   <div 
                     onClick={toggleSelectAll}
                     className={`w-5 h-5 rounded-md border-2 flex items-center justify-center cursor-pointer transition-all ${
                       selectedIds.length === filteredStudents.length && filteredStudents.length > 0
                        ? 'bg-blue-600 border-blue-600' 
                        : 'border-white/20 hover:border-white/40'
                     }`}
                   >
                     {selectedIds.length === filteredStudents.length && filteredStudents.length > 0 && <Check size={12} className="text-white" />}
                   </div>
                </th>
                {['ID', 'Name', 'Grade', 'Risk', 'Score', 'GPA', 'Attendance', 'Consec. Abs.', 'Trend'].map(h => (
                  <th key={h} className="px-10 py-6 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-300">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              <AnimatePresence>
                {filteredStudents.map((s, idx) => (
                  <motion.tr 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    key={s.id}
                    onClick={() => onSelectStudent(s)}
                    className={`group hover:bg-[#1F2228]/50 cursor-pointer transition-colors ${selectedIds.includes(s.id) ? 'bg-blue-600/10' : ''}`}
                  >
                    <td className="px-10 py-6" onClick={(e) => toggleSelectStudent(e, s.id)}>
                       <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${
                         selectedIds.includes(s.id)
                          ? 'bg-blue-600 border-blue-600' 
                          : 'border-white/10 group-hover:border-white/40'
                       }`}>
                         {selectedIds.includes(s.id) && <Check size={12} className="text-white" />}
                       </div>
                    </td>
                    <td className="px-10 py-6 text-xs font-mono font-black group-hover:text-blue-500 transition-colors uppercase">{s.id}</td>
                    <td className="px-10 py-6 text-xs font-black text-white">{s.name}</td>
                    <td className="px-10 py-6 text-xs font-black text-zinc-400">{s.grade}</td>
                    <td className="px-10 py-6">
                       <div className={`inline-block px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                         s.riskLevel === 'critical' ? 'bg-red-500 text-black' :
                         s.riskLevel === 'high' ? 'bg-orange-500 text-black' :
                         s.riskLevel === 'medium' ? 'bg-yellow-500 text-black' : 'bg-green-500 text-black'
                       }`}>
                         {s.riskLevel}
                       </div>
                    </td>
                    <td className="px-10 py-6 text-xs font-mono font-black text-white">{s.avgScore}%</td>
                    <td className="px-10 py-6 text-xs font-mono font-black text-zinc-300">{s.gpa.toFixed(2)}</td>
                    <td className="px-10 py-6 text-xs font-mono font-black text-white">{s.attendance.toFixed(1)}%</td>
                    <td className="px-10 py-6 text-xs font-mono font-black text-zinc-400">{s.consecutiveAbsences}</td>
                    <td className="px-10 py-6">
                       <div className={`flex items-center gap-2 text-xs font-black ${s.scoreTrend >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                          {s.scoreTrend >= 0 ? '▲' : '▼'} {Math.abs(s.scoreTrend).toFixed(2)}
                       </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
        {filteredStudents.length === 0 && (
          <div className="py-20 text-center space-y-4">
             <div className="text-4xl">🔍</div>
             <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">No students matching these filters</p>
          </div>
        )}
      </div>
    </div>
  );
}
