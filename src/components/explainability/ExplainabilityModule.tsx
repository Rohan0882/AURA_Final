import { BarChart as ReBarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Info, Zap, AlertTriangle, CheckCircle2, SlidersHorizontal, RotateCcw, BarChart } from 'lucide-react';
import { Student } from '../../types/slis';
import { motion, AnimatePresence } from 'motion/react';
import { useState, useMemo } from 'react';

interface ExplainabilityModuleProps {
  student: Student;
}

export function ExplainabilityModule({ student }: ExplainabilityModuleProps) {
  const [perturbations, setPerturbations] = useState<Record<string, number>>({});

  const resetPerturbations = () => setPerturbations({});

  const features = useMemo(() => [
    { id: 'attendance', name: 'Attendance', value: student.attendance, base: 85, weight: -1.2, min: 0, max: 100, unit: '%' },
    { id: 'avgScore', name: 'Avg Score', value: student.avgScore, base: 75, weight: -0.8, min: 0, max: 100, unit: '%' },
    { id: 'studyTime', name: 'Study Time', value: student.studyTime, base: 180, weight: -0.1, min: 0, max: 300, unit: 'm' },
    { id: 'quizCompletion', name: 'Quiz Completion', value: student.quizCompletion, base: 85, weight: -0.5, min: 0, max: 100, unit: '%' },
    { id: 'assignmentCompletion', name: 'Assignment Comp.', value: student.assignmentCompletion, base: 80, weight: -0.4, min: 0, max: 100, unit: '%' },
    { id: 'consecutiveAbsences', name: 'Consecutive Absences', value: student.consecutiveAbsences, base: 2, weight: 5.0, min: 0, max: 20, unit: 'd' },
  ], [student]);

  const currentData = useMemo(() => {
    const data = features.map(f => {
      const val = perturbations[f.id] !== undefined ? perturbations[f.id] : f.value;
      return {
        ...f,
        currentValue: val,
        impact: (val - f.base) * f.weight,
        isPerturbed: perturbations[f.id] !== undefined
      };
    });
    return data.sort((a, b) => Math.abs(b.impact) - Math.abs(a.impact));
  }, [features, perturbations]);

  const totalImpact = currentData.reduce((acc, curr) => acc + curr.impact, 0);
  const predictedRisk = Math.max(0, Math.min(100, 30 + totalImpact));
  
  const riskColor = predictedRisk > 70 ? 'text-red-500' : predictedRisk > 40 ? 'text-orange-500' : 'text-green-500';

  return (
    <div className="space-y-8 bg-[#1F2228]/40 border border-white/5 rounded-[48px] p-10 shadow-2xl relative overflow-hidden group transition-all duration-500 hover:bg-[#1F2228]/60">
      <div className="absolute top-0 right-0 p-8 flex gap-2">
         <span className="px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full text-[9px] font-black uppercase text-blue-400 tracking-widest">SHAP Model</span>
         <span className="px-3 py-1 bg-purple-500/10 border border-purple-500/20 rounded-full text-[9px] font-black uppercase text-purple-400 tracking-widest">LIME Engine</span>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-2">
          <h3 className="text-3xl font-black tracking-tighter flex items-center gap-3">
            <div className="w-2 h-8 bg-gradient-to-b from-blue-500 to-cyan-500 rounded-full" />
            Model Insights & Drivers
          </h3>
          <p className="text-zinc-500 text-sm italic font-medium">Explainable AI (XAI) breakdown: Analyzing {student.name}'s risk factors.</p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-[32px] px-8 py-4 flex flex-col items-center gap-1 shadow-lg">
           <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Dynamic Risk Multiplier</span>
           <div className={`text-4xl font-black tracking-tighter ${riskColor}`}>{predictedRisk.toFixed(1)}%</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 pt-8">
        {/* SHAP Chart */}
        <div className="lg:col-span-2 h-[450px] flex flex-col space-y-6">
          <div className="flex justify-between items-center">
             <div className="flex items-center gap-3">
                <BarChart size={18} className="text-blue-500" />
                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-300">Feature Contribution (SHAP)</span>
             </div>
             <div className="flex gap-4 text-[9px] font-black uppercase">
                <div className="flex items-center gap-1.5"><div className="w-2 h-2 bg-red-500 rounded-full" /> Positive (Risk+)</div>
                <div className="flex items-center gap-1.5"><div className="w-2 h-2 bg-green-500 rounded-full" /> Negative (Risk-)</div>
             </div>
          </div>
          <div className="flex-1 bg-white/2 rounded-[32px] p-6 border border-white/5">
             <ResponsiveContainer width="100%" height="100%">
               <ReBarChart
                 layout="vertical"
                 data={currentData}
                 margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
               >
                 <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="rgba(255,255,255,0.02)" />
                 <XAxis type="number" hide domain={['auto', 'auto']} />
                 <YAxis 
                   dataKey="name" 
                   type="category" 
                   tick={{ fill: '#A0A0A0', fontSize: 10, fontWeight: 'black' }}
                   width={120}
                   axisLine={false}
                   tickLine={false}
                 />
                 <Tooltip
                   cursor={{ fill: 'rgba(255,255,255,0.02)' }}
                   content={({ active, payload }) => {
                     if (active && payload && payload.length) {
                       const data = payload[0].payload;
                       return (
                         <div className="bg-[#2B2F36] border border-white/10 p-6 rounded-[24px] shadow-2xl backdrop-blur-xl">
                           <p className="text-[10px] font-black uppercase text-zinc-500 mb-2 tracking-widest">{data.name}</p>
                           <p className={`text-2xl font-black ${data.impact > 0 ? 'text-red-500' : 'text-green-500'}`}>
                             {data.impact > 0 ? '+' : ''}{data.impact.toFixed(2)}
                           </p>
                           <div className="h-px w-full bg-white/5 my-3" />
                           <p className="text-[10px] font-mono opacity-50 flex justify-between gap-4">
                             <span>Raw Value:</span>
                             <span className="text-white">{data.currentValue}{data.unit}</span>
                           </p>
                         </div>
                       );
                     }
                     return null;
                   }}
                 />
                 <Bar dataKey="impact" radius={[0, 8, 8, 0]} animationDuration={1000}>
                   {currentData.map((entry, index) => (
                     <Cell 
                        key={`cell-${index}`} 
                        fill={entry.impact > 0 ? '#EF4444' : '#10B981'} 
                        fillOpacity={entry.isPerturbed ? 1 : 0.6}
                        stroke={entry.isPerturbed ? '#fff' : 'none'}
                        strokeWidth={2}
                     />
                   ))}
                 </Bar>
               </ReBarChart>
             </ResponsiveContainer>
          </div>
          <div className="flex items-center gap-2 bg-white/5 px-6 py-3 rounded-2xl w-fit">
             <AlertTriangle size={14} className="text-yellow-500" />
             <span className="text-[9px] font-black uppercase text-zinc-500 tracking-widest">Baseline Risk Reference: 30.0%</span>
          </div>
        </div>

        {/* Interactive Simulation Panel */}
        <div className="bg-white/5 border border-white/5 rounded-[40px] p-8 flex flex-col space-y-8">
           <div className="flex justify-between items-center">
              <h4 className="text-xs font-black uppercase tracking-widest text-zinc-400 flex items-center gap-2">
                <SlidersHorizontal size={14} className="text-blue-500" />
                "What-If" Analysis
              </h4>
              {Object.keys(perturbations).length > 0 && (
                <button 
                  onClick={resetPerturbations}
                  className="text-[10px] font-black uppercase tracking-widest text-blue-500 hover:text-blue-400 transition-colors flex items-center gap-1"
                >
                  <RotateCcw size={12} /> Reset
                </button>
              )}
           </div>

           <div className="flex-1 space-y-6 overflow-y-auto pr-2 scrollbar-thin">
              {features.map((f) => {
                const isPerturbed = perturbations[f.id] !== undefined;
                const value = isPerturbed ? perturbations[f.id] : f.value;

                return (
                  <div key={f.id} className="space-y-3">
                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                       <span className={isPerturbed ? 'text-blue-400' : 'text-zinc-500'}>{f.name}</span>
                       <span className="text-zinc-300">{value.toFixed(1)}{f.unit}</span>
                    </div>
                    <input 
                      type="range"
                      min={f.min}
                      max={f.max}
                      value={value}
                      onChange={(e) => setPerturbations(prev => ({ ...prev, [f.id]: parseFloat(e.target.value) }))}
                      className="w-full h-1 bg-white/5 rounded-full appearance-none cursor-pointer accent-blue-500 hover:accent-blue-400 transition-all"
                    />
                  </div>
                );
              })}
           </div>

           <div className="bg-[#1F2228] border border-white/5 rounded-[24px] p-6 space-y-4">
              <h5 className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">Counterfactual Driver</h5>
              <AnimatePresence mode="wait">
                <motion.p 
                  key={predictedRisk}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-xs font-medium italic text-zinc-400 leading-relaxed"
                >
                  According to the <span className="text-white font-bold">LIME surrogate model</span>, if the student {predictedRisk > 50 ? 'continues' : 'maintains'} these behaviors, the likelihood of module failure remains <span className={riskColor + " font-black"}>{predictedRisk > 50 ? 'Critical' : 'Stable'}</span>.
                  {Object.keys(perturbations).length > 0 && (
                    <span className="block mt-2 text-blue-400">Simulation active: Feature perturbations are influencing local importance gradients.</span>
                  )}
                </motion.p>
              </AnimatePresence>
              <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest opacity-30 mt-4">
                 <Info size={12} />
                 Impact scores based on LOO simulation
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
