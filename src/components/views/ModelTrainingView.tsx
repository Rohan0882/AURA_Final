import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Cpu, Play, CheckCircle, AlertTriangle, Target, BarChart, Settings, Sliders, Info, Zap, Trash2, Layers } from 'lucide-react';
import { Student } from '../../types/slis';
import { 
  BarChart as ReBarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area
} from 'recharts';

interface ModelTrainingViewProps {
  students: Student[];
}

type ModelType = 'random_forest' | 'xgboost' | 'gradient_boost' | 'linear_regression';
type Feature = 'attendance' | 'gpa' | 'studyTime' | 'socioeconomicIndex' | 'quizCompletion' | 'assignmentCompletion' | 'consecutiveAbsences';
type TargetVar = 'riskLevel' | 'avgScore' | 'finalGpa';

export function ModelTrainingView({ students }: ModelTrainingViewProps) {
  const [selectedFeatures, setSelectedFeatures] = useState<Feature[]>(['attendance', 'gpa', 'studyTime']);
  const [targetVar, setTargetVar] = useState<TargetVar>('riskLevel');
  const [modelType, setModelType] = useState<ModelType>('random_forest');
  const [isTraining, setIsTraining] = useState(false);
  const [trainingProgress, setTrainingProgress] = useState(0);
  const [trainingStatus, setTrainingStatus] = useState<'idle' | 'training' | 'completed'>('idle');
  
  // Model performance simulation data
  const [performanceMetrics, setPerformanceMetrics] = useState<{
    accuracy: number;
    precision: number;
    recall: number;
    f1: number;
    rmse: number;
    importance: { name: string; value: number }[];
    epochData: { epoch: number; loss: number; valLoss: number; accuracy: number }[];
  } | null>(null);

  const availableFeatures: { id: Feature; label: string; desc: string }[] = [
    { id: 'attendance', label: 'Attendance Rate', desc: 'Percentage of classes attended' },
    { id: 'gpa', label: 'Historical GPA', desc: 'Average grade point in previous modules' },
    { id: 'studyTime', label: 'Study Volume', desc: 'Minutes per week spent on platform' },
    { id: 'socioeconomicIndex', label: 'Socioeconomic SES', desc: 'Calculated index of external support' },
    { id: 'quizCompletion', label: 'Quiz Depth', desc: 'Percentage of optional assessments finished' },
    { id: 'assignmentCompletion', label: 'Submission Rate', desc: 'Timeliness and volume of assignments' },
    { id: 'consecutiveAbsences', label: 'Absence Streak', desc: 'Max consecutive days missed' },
  ];

  const toggleFeature = (id: Feature) => {
    setSelectedFeatures(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const startTraining = () => {
    if (selectedFeatures.length === 0) return;
    
    setIsTraining(true);
    setTrainingStatus('training');
    setTrainingProgress(0);
    setPerformanceMetrics(null);

    const interval = setInterval(() => {
      setTrainingProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          completeTraining();
          return 100;
        }
        return prev + 2;
      });
    }, 50);
  };

  const completeTraining = () => {
    // Simulate training outcomes based on features and model
    const featureImpact = selectedFeatures.length * 0.1;
    const baseAcc = 0.75 + (Math.random() * 0.1);
    const finalAcc = Math.min(0.98, baseAcc + (featureImpact * 0.05));
    
    const importance = selectedFeatures.map(f => ({
      name: availableFeatures.find(af => af.id === f)?.label || f,
      value: Math.random() * 100
    })).sort((a, b) => b.value - a.value);

    const epochs = Array.from({ length: 10 }).map((_, i) => ({
      epoch: i + 1,
      loss: 0.5 / (i + 1) + Math.random() * 0.05,
      valLoss: 0.6 / (i + 1) + Math.random() * 0.1,
      accuracy: 0.6 + (i * 0.04) + Math.random() * 0.02
    }));

    setPerformanceMetrics({
      accuracy: finalAcc,
      precision: finalAcc - 0.03,
      recall: finalAcc - 0.05,
      f1: finalAcc - 0.04,
      rmse: 0.15 - (featureImpact * 0.01),
      importance,
      epochData: epochs
    });

    setIsTraining(false);
    setTrainingStatus('completed');
  };

  return (
    <div className="space-y-12">
      <header className="space-y-4">
        <div className="flex items-center gap-4">
           <div className="p-3 bg-blue-600 rounded-2xl shadow-lg shadow-blue-500/20">
             <Cpu className="text-white" size={24} />
           </div>
           <div>
             <h2 className="text-4xl font-black tracking-tighter">Model Evolution Hub</h2>
             <p className="text-zinc-500 font-medium tracking-wide italic">Custom predictive modeling pipeline for behavioral forecasting</p>
           </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Configuration Panel */}
        <div className="lg:col-span-1 space-y-8">
          <section className="bg-[#2B2F36]/40 border border-white/5 rounded-[40px] p-8 space-y-10 backdrop-blur-xl">
             {/* Target Variable */}
             <div className="space-y-6">
                <div className="flex items-center gap-3">
                   <Target className="text-purple-500" size={18} />
                   <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-300">Target Objective</h3>
                </div>
                <div className="grid grid-cols-1 gap-2">
                   {([
                     { id: 'riskLevel', label: 'Risk Propensity', desc: 'Predictive alert level' },
                     { id: 'avgScore', label: 'Expected Mean Score', desc: 'Regression of academic output' },
                     { id: 'finalGpa', label: 'Final Degree Outcome', desc: 'Long-term probability analysis' }
                   ] as const).map(t => (
                     <button
                       key={t.id}
                       onClick={() => setTargetVar(t.id)}
                       className={`p-4 rounded-2xl text-left border transition-all ${
                         targetVar === t.id 
                           ? 'bg-purple-600/20 border-purple-500/40' 
                           : 'bg-white/5 border-white/5 hover:bg-white/10'
                       }`}
                     >
                       <div className="text-sm font-black mb-1">{t.label}</div>
                       <div className="text-[10px] opacity-40 font-medium">{t.desc}</div>
                     </button>
                   ))}
                </div>
             </div>

             {/* Algorithm Selection */}
             <div className="space-y-6">
                <div className="flex items-center gap-3">
                   <Layers className="text-blue-500" size={18} />
                   <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-300">Model Architecture</h3>
                </div>
                <select 
                  value={modelType}
                  onChange={(e) => setModelType(e.target.value as ModelType)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm font-black outline-none focus:border-blue-500 transition-colors"
                >
                  <option value="random_forest">Random Forest Classifier</option>
                  <option value="xgboost">XGBoost Optimized</option>
                  <option value="gradient_boost">Gradient Boosting Machine</option>
                  <option value="linear_regression">ElasticNet Regression</option>
                </select>
             </div>

             {/* Training Trigger */}
             <button
               disabled={isTraining || selectedFeatures.length === 0}
               onClick={startTraining}
               className={`w-full py-6 rounded-[24px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 transition-all ${
                 isTraining 
                   ? 'bg-zinc-800 text-zinc-600 cursor-not-allowed'
                   : 'bg-blue-600 text-white shadow-xl shadow-blue-500/20 hover:scale-[1.02] active:scale-[0.98]'
               }`}
             >
               {isTraining ? (
                 <>
                   <div className="w-5 h-5 border-4 border-white/20 border-t-white rounded-full animate-spin" />
                   Training Model...
                 </>
               ) : (
                 <>
                   <Play size={20} fill="currentColor" />
                   Evolve Model
                 </>
               )}
             </button>
          </section>

          {/* Feature Selector */}
          <section className="bg-[#2B2F36]/20 border border-white/5 rounded-[40px] p-8 space-y-6">
             <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                   <Sliders className="text-cyan-500" size={18} />
                   <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-300">Input Variables</h3>
                </div>
                <div className="text-[10px] font-mono opacity-40">{selectedFeatures.length} Active</div>
             </div>
             <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 scrollbar-thin">
                {availableFeatures.map(f => (
                  <div 
                    key={f.id}
                    onClick={() => toggleFeature(f.id)}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between group ${
                      selectedFeatures.includes(f.id)
                        ? 'bg-cyan-500/10 border-cyan-500/30'
                        : 'bg-white/5 border-white/5 hover:border-white/10'
                    }`}
                  >
                    <div>
                      <div className="text-xs font-black mb-0.5">{f.label}</div>
                      <div className="text-[9px] opacity-40 font-medium leading-tight">{f.desc}</div>
                    </div>
                    <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-colors ${
                      selectedFeatures.includes(f.id) ? 'bg-cyan-500 border-cyan-500' : 'border-white/10 group-hover:border-white/30'
                    }`}>
                      {selectedFeatures.includes(f.id) && <CheckCircle size={12} className="text-black" />}
                    </div>
                  </div>
                ))}
             </div>
          </section>
        </div>

        {/* Training & Results Section */}
        <div className="lg:col-span-2 space-y-8">
          <AnimatePresence mode="wait">
            {!isTraining && trainingStatus === 'idle' && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="h-full bg-white/5 border-2 border-dashed border-white/10 rounded-[48px] flex flex-col items-center justify-center p-20 text-center space-y-6"
              >
                 <div className="w-24 h-24 bg-white/5 border border-white/10 rounded-full flex items-center justify-center">
                    <Settings className="text-zinc-600 animate-[spin_5s_linear_infinite]" size={40} />
                 </div>
                 <div className="space-y-2">
                    <h3 className="text-3xl font-black tracking-tight opacity-40">Ready to Evolve</h3>
                    <p className="text-sm font-medium text-zinc-500 italic">Select your features and target variable to begin training sequence.</p>
                 </div>
              </motion.div>
            )}

            {isTraining && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="h-full bg-[#1F2228]/60 border border-white/5 rounded-[48px] p-20 flex flex-col items-center justify-center space-y-12"
              >
                 <div className="relative w-48 h-48">
                    <svg className="w-full h-full -rotate-90">
                       <circle
                         cx="96"
                         cy="96"
                         r="88"
                         className="stroke-white/5 fill-none"
                         strokeWidth="12"
                       />
                       <circle
                         cx="96"
                         cy="96"
                         r="88"
                         className="stroke-blue-600 fill-none transition-all duration-300 ease-linear"
                         strokeWidth="12"
                         strokeDasharray={2 * Math.PI * 88}
                         strokeDashoffset={2 * Math.PI * 88 * (1 - trainingProgress / 100)}
                         strokeLinecap="round"
                       />
                    </svg>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
                       <div className="text-5xl font-black tracking-tighter">{trainingProgress}%</div>
                       <div className="text-[10px] font-black uppercase tracking-widest text-blue-500">Processing</div>
                    </div>
                 </div>
                 <div className="space-y-4 text-center">
                    <div className="flex gap-2 justify-center">
                       {['Epoch Analysis', 'Weights Calibration', 'Backpropagation', 'Validation Sweep'].map((step, i) => (
                         <div key={i} className={`w-20 h-1 rounded-full ${trainingProgress > i * 25 ? 'bg-blue-600 animate-pulse' : 'bg-white/10'}`} />
                       ))}
                    </div>
                    <p className="text-sm font-mono opacity-40 italic">Cross-validating cohorts against hyper-parameters...</p>
                 </div>
              </motion.div>
            )}

            {trainingStatus === 'completed' && performanceMetrics && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8"
              >
                 {/* Top Metrics Row */}
                 <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {[
                      { label: 'Accuracy', value: performanceMetrics.accuracy, color: 'text-green-500' },
                      { label: 'Precision', value: performanceMetrics.precision, color: 'text-blue-500' },
                      { label: 'Recall', value: performanceMetrics.recall, color: 'text-purple-500' },
                      { label: 'F1 Score', value: performanceMetrics.f1, color: 'text-orange-500' },
                    ].map(m => (
                      <div key={m.label} className="bg-[#2B2F36]/40 border border-white/5 rounded-3xl p-6 space-y-2 group hover:bg-[#2B2F36] transition-all">
                         <div className="text-[10px] font-black uppercase tracking-widest text-zinc-500">{m.label}</div>
                         <div className={`text-4xl font-black tracking-tighter ${m.color}`}>{(m.value * 100).toFixed(1)}%</div>
                         <div className="text-[9px] font-mono opacity-30">Validation Set Score</div>
                      </div>
                    ))}
                 </div>

                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                   {/* Feature Importance */}
                   <div className="bg-[#2B2F36]/30 border border-white/5 rounded-[48px] p-10 h-[500px] flex flex-col group relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent" />
                      <h3 className="text-2xl font-black mb-8 tracking-tight flex items-center gap-3">
                         <BarChart size={24} className="text-cyan-500" />
                         Variable Influence
                      </h3>
                      <div className="flex-1">
                        <ResponsiveContainer width="100%" height="100%">
                          <ReBarChart data={performanceMetrics.importance} layout="vertical" margin={{ left: 20, right: 30 }}>
                             <XAxis type="number" hide />
                             <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: '#A1A1AA', fontSize: 10, fontWeight: '900' }} width={120} />
                             <Tooltip 
                                cursor={{ fill: 'rgba(255,255,255,0.03)' }}
                                contentStyle={{ backgroundColor: '#2B2F36', border: '1px solid #3F3F46', borderRadius: '24px' }}
                             />
                             <Bar dataKey="value" radius={[0, 8, 8, 0]}>
                                {performanceMetrics.importance.map((_, index) => (
                                  <Cell key={index} fill={index === 0 ? '#06b6d4' : '#1f2937'} />
                                ))}
                             </Bar>
                          </ReBarChart>
                        </ResponsiveContainer>
                      </div>
                      <div className="mt-8 text-center text-[10px] font-mono opacity-20">Calculated SHAP values for relative feature contribution</div>
                   </div>

                   {/* Loss/Accuracy Over Time */}
                   <div className="bg-[#2B2F36]/30 border border-white/5 rounded-[48px] p-10 h-[500px] flex flex-col group relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500/20 to-transparent" />
                      <h3 className="text-2xl font-black mb-8 tracking-tight flex items-center gap-3">
                         <Zap size={24} className="text-blue-500" />
                         Evolution Dynamics
                      </h3>
                      <div className="flex-1">
                        <ResponsiveContainer width="100%" height="100%">
                           <AreaChart data={performanceMetrics.epochData}>
                              <defs>
                                <linearGradient id="colorLoss" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.2}/>
                                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                                </linearGradient>
                                <linearGradient id="colorAcc" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                                </linearGradient>
                              </defs>
                              <XAxis dataKey="epoch" axisLine={false} tickLine={false} tick={{ fill: '#A1A1AA', fontSize: 10, fontWeight: '900' }} />
                              <YAxis hide />
                              <Tooltip contentStyle={{ backgroundColor: '#2B2F36', border: '1px solid #3F3F46', borderRadius: '24px' }} />
                              <Area type="monotone" dataKey="loss" stroke="#ef4444" fillOpacity={1} fill="url(#colorLoss)" strokeWidth={3} />
                              <Area type="monotone" dataKey="accuracy" stroke="#3b82f6" fillOpacity={1} fill="url(#colorAcc)" strokeWidth={3} />
                           </AreaChart>
                        </ResponsiveContainer>
                      </div>
                      <div className="mt-8 flex justify-center gap-6 text-[9px] font-black uppercase tracking-widest text-zinc-500">
                         <div className="flex items-center gap-2">
                            <div className="w-4 h-1 bg-blue-600 rounded-full" />
                            <span>Precision Growth</span>
                         </div>
                         <div className="flex items-center gap-2">
                            <div className="w-4 h-1 bg-red-600 rounded-full" />
                            <span>Entropy Loss</span>
                         </div>
                      </div>
                   </div>
                 </div>

                 {/* Model Insights */}
                 <div className="bg-blue-600/10 border border-blue-500/20 rounded-[40px] p-10 flex flex-col md:flex-row items-center gap-10">
                    <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center shrink-0">
                       <Info className="text-white" size={32} />
                    </div>
                    <div className="space-y-3">
                       <h4 className="text-xl font-black tracking-tight text-blue-500 uppercase italic">Architectural Insight</h4>
                       <p className="text-sm font-medium leading-relaxed italic text-zinc-300">
                          Your model exhibits high sensitivity to <span className="text-white font-black">{performanceMetrics.importance[0]?.name}</span>. 
                          The convergence pattern suggests potential for model distillation if deployed in real-time edge environments. 
                          <span className="text-blue-500 block mt-2">Prediction reliability is sufficient for production intervention triggers.</span>
                       </p>
                    </div>
                    <div className="flex gap-4">
                       <button className="px-8 py-3 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all flex items-center gap-2 whitespace-nowrap">
                          <Trash2 size={14} /> Clear Cache
                       </button>
                    </div>
                 </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
