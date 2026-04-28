import { useState } from 'react';
import { Lightbulb, Search, AlertCircle, ChevronDown, Layout, Target, Info, UserCheck, Inbox } from 'lucide-react';
import { Student } from '../../types/slis';
import { motion, AnimatePresence } from 'motion/react';

interface RecommendationsViewProps {
  students: Student[];
}

export function RecommendationsView({ students }: RecommendationsViewProps) {
  const [activeTab, setActiveTab] = useState<'individual' | 'queue'>('individual');
  const [search, setSearch] = useState('');
  const [selectedId, setSelectedId] = useState(students[0].id);

  const selectedStudent = students.find(s => s.id === selectedId) || students[0];

  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(search.toLowerCase()) || 
    s.id.toLowerCase().includes(search.toLowerCase())
  ).slice(0, 5);

  return (
    <div className="space-y-12 pb-32">
      <header className="space-y-2">
        <h1 className="text-5xl font-black tracking-tighter flex items-center gap-4">
          <div className="w-12 h-12 bg-yellow-500 rounded-2xl flex items-center justify-center text-2xl">💡</div>
          Personalized Recommendations
        </h1>
        <p className="text-zinc-500 font-medium tracking-wide">AI-generated, actionable interventions based on each student's unique profile</p>
      </header>

      <div className="flex gap-4">
         <button 
           onClick={() => setActiveTab('individual')}
           className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-3 transition-all ${
             activeTab === 'individual' ? 'bg-red-500/20 text-red-500 border border-red-500/20' : 'bg-white/5 text-zinc-500 hover:text-white'
           }`}
         >
           <UserCheck size={16} /> Individual Student
         </button>
         <button 
           onClick={() => setActiveTab('queue')}
           className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-3 transition-all ${
             activeTab === 'queue' ? 'bg-red-500/20 text-red-500 border border-red-500/20' : 'bg-white/5 text-zinc-500 hover:text-white'
           }`}
         >
           <Inbox size={16} /> Intervention Queue
         </button>
      </div>

      <div className="bg-[#2B2F36]/30 border border-white/5 p-10 rounded-[48px] space-y-12 backdrop-blur-xl relative overflow-hidden shadow-2xl">
        <div className="space-y-4">
          <h3 className="text-2xl font-black tracking-tight flex items-center gap-3">
             <div className="w-1.5 h-8 bg-blue-600 rounded-full" />
             Select a Student
          </h3>
          <div className="relative group max-w-2xl">
             <div className="flex items-center gap-3 mb-2 px-1">
                <Search size={14} className="opacity-40" />
                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Search by name or ID</span>
             </div>
             <div className="relative">
                <input 
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="e.g. STU0042 or Sarah" 
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm font-black outline-none focus:border-blue-500 transition-all"
                />
                <AnimatePresence>
                   {search && filteredStudents.length > 0 && (
                     <motion.div 
                       initial={{ opacity: 0, y: 10 }}
                       animate={{ opacity: 1, y: 0 }}
                       exit={{ opacity: 0, y: 10 }}
                       className="absolute top-full left-0 w-full bg-[#1F2228] border border-white/10 mt-2 rounded-2xl p-2 z-50 shadow-2xl"
                     >
                        {filteredStudents.map(s => (
                          <button 
                            key={s.id}
                            onClick={() => { setSelectedId(s.id); setSearch(''); }}
                            className="w-full truncate text-left px-4 py-3 hover:bg-white/5 rounded-xl text-xs font-black transition-colors"
                          >
                             {s.id} — {s.name}
                          </button>
                        ))}
                     </motion.div>
                   )}
                </AnimatePresence>
             </div>
          </div>
        </div>

        <div className="bg-[#1F2228]/60 border border-white/5 p-10 rounded-[40px] flex flex-col xl:flex-row justify-between items-start xl:items-center gap-12 group hover:border-white/10 transition-colors shadow-inner">
          <div className="space-y-4">
            <span className="text-[10px] uppercase tracking-[0.3em] font-black text-zinc-600 block">Student Identity</span>
            <div className="text-3xl font-black tracking-tighter flex items-center gap-4">
               {selectedStudent.name}
               <div className="bg-red-500/10 text-red-500 px-3 py-1 rounded-full text-[10px] font-black tracking-widest border border-red-500/20">{selectedStudent.riskLevel.toUpperCase()}</div>
            </div>
            <div className="text-xs font-mono font-black italic text-zinc-500 opacity-60">ID: {selectedStudent.id} — Grade {selectedStudent.grade}</div>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 xl:gap-20">
            {[
              { label: 'Average Score', value: `${selectedStudent.avgScore.toFixed(1)}%` },
              { label: 'GPA', value: selectedStudent.gpa.toFixed(2) },
              { label: 'Attendance', value: `${selectedStudent.attendance.toFixed(1)}%` },
              { label: 'Risk Level', value: selectedStudent.riskLevel.toUpperCase(), color: selectedStudent.riskLevel === 'critical' ? 'text-red-500' : 'text-orange-500' },
            ].map((s, i) => (
              <div key={i} className="space-y-2">
                <span className="text-[10px] uppercase tracking-widest font-black text-zinc-600 block">{s.label}</span>
                <span className={`text-3xl font-black tabular-nums tracking-tighter ${s.color || 'text-white'}`}>{s.value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-red-500/10 border border-red-500/20 p-6 rounded-[32px] flex items-center gap-4">
           <AlertCircle className="text-red-500 animate-pulse" size={24} />
           <span className="text-sm font-black tracking-tight">{selectedStudent.recommendations.length} URGENT action(s) required</span>
        </div>

        <div className="space-y-6">
          {selectedStudent.recommendations.map((rec, i) => (
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              key={i} 
              className="bg-white/5 border border-white/5 rounded-[40px] overflow-hidden group hover:border-white/10 transition-all"
            >
              <div className="bg-white/5 px-10 py-8 flex justify-between items-center border-b border-white/5">
                 <div className="flex items-center gap-4">
                   <div className="w-10 h-10 bg-red-500/20 rounded-xl flex items-center justify-center">
                     <AlertCircle size={20} className="text-red-500" />
                   </div>
                   <div>
                     <h4 className="font-black text-xl tracking-tight leading-none mb-1">{rec.title}</h4>
                     <span className="text-xs font-black text-red-500 tracking-widest uppercase opacity-80 flex items-center gap-2">
                        <div className="w-1 h-1 bg-red-500 rounded-full" />
                        Urgent Intervention Needed
                     </span>
                   </div>
                 </div>
                 <ChevronDown size={20} className="opacity-20 group-hover:opacity-100 transition-opacity" />
              </div>
              
              <div className="p-10 grid grid-cols-1 lg:grid-cols-12 gap-12">
                <div className="lg:col-span-8 space-y-10">
                  <div className="p-8 bg-red-500/5 rounded-[32px] border border-red-500/10 italic text-sm font-black text-zinc-400 relative">
                     <div className="absolute top-0 left-8 w-1 h-full bg-red-500/40" />
                     {rec.rationale}
                  </div>
                  
                  <div className="space-y-6">
                    <h5 className="flex items-center gap-3 text-[11px] font-black uppercase tracking-widest text-zinc-500">
                      <Layout size={16} /> Action Steps:
                    </h5>
                    <ul className="space-y-4">
                      {rec.actionSteps.map((step, si) => (
                        <li key={si} className="flex gap-4 group/item">
                          <div className="mt-1.5 w-2 h-2 rounded-full bg-red-500 group-hover/item:scale-125 transition-transform" />
                          <span className="text-sm font-black text-zinc-300">{step}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="lg:col-span-4 space-y-10 border-l border-white/5 pl-10">
                   <div className="space-y-6">
                      <h5 className="flex items-center gap-3 text-[11px] font-black uppercase tracking-widest text-zinc-500">
                        <Target size={16} /> Targets:
                      </h5>
                      <div className="space-y-4">
                         {rec.targets.map((t, ti) => (
                            <div key={ti} className="flex items-center gap-3">
                               <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                               <span className="text-xs font-black text-blue-500 uppercase tracking-widest">{t}</span>
                            </div>
                         ))}
                      </div>
                   </div>

                   <div className="space-y-6">
                      <h5 className="flex items-center gap-3 text-[11px] font-black uppercase tracking-widest text-zinc-500">
                        <Info size={16} /> AI Rationale:
                      </h5>
                      <p className="text-[11px] font-black leading-relaxed text-zinc-500 italic opacity-60">
                        Historical data from {selectedStudent.grade} cohort indicates that {selectedStudent.attendance.toFixed(1)}% attendance is below the 70% retention threshold. Model confidence: 94.2%.
                      </p>
                   </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
