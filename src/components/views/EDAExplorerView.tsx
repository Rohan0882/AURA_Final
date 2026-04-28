import { useState, useMemo } from 'react';
import { Activity, Search, Info, BarChart3, ScatterChart as ScatterIcon, Layers, BrainCircuit, Target, RefreshCcw } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ScatterChart, Scatter, ZAxis, Cell, Legend } from 'recharts';
import { Student } from '../../types/slis';
import { motion, AnimatePresence } from 'motion/react';

interface EDAExplorerViewProps {
  students: Student[];
}

type ClusteringFeature = 'attendance' | 'avgScore' | 'studyTime';

export function EDAExplorerView({ students }: EDAExplorerViewProps) {
  const [features, setFeatures] = useState<ClusteringFeature[]>(['attendance', 'avgScore']);
  const [clusterCount, setClusterCount] = useState(3);
  const [selectedCluster, setSelectedCluster] = useState<number | null>(null);
  const [comparisonIndices, setComparisonIndices] = useState<number[]>([]);

  // Variable Importance Data
  const variableImportance = [
    { name: 'Average Score', importance: 0.94, impact: '+8.2' },
    { name: 'Attendance', importance: 0.88, impact: '+6.1' },
    { name: 'Study Time', importance: 0.72, impact: '+4.4' },
    { name: 'Engagement', importance: 0.65, impact: '+3.9' },
    { name: 'Socioeconomic', importance: 0.42, impact: '+2.1' },
    { name: 'Score Trend', importance: 0.38, impact: '+1.8' }
  ];

  const socioeconomicData = [
    { level: 'Tier 1', critical: 12, high: 24, medium: 35, low: 58 },
    { level: 'Tier 2', critical: 18, high: 32, medium: 45, low: 45 },
    { level: 'Tier 3', critical: 25, high: 45, medium: 32, low: 28 },
    { level: 'Tier 4', critical: 42, high: 58, medium: 24, low: 12 }
  ];

  // Colors for visualization
  const COLORS = {
    critical: '#ef4444',
    high: '#f97316',
    medium: '#eab308',
    low: '#22c55e',
    cluster1: '#3b82f6',
    cluster2: '#8b5cf6',
    cluster3: '#ec4899',
    cluster4: '#14b8a6'
  };

  // Generate Cluster Data
  const clusterAnalysis = useMemo(() => {
    // Simplified clustering algorithm simulation
    const data = students.slice(0, 150).map((s, idx) => {
      // Assign to cluster based on heuristics for visualization
      let cluster = (idx % clusterCount) + 1;
      
      // Map to values based on selected features
      const xVal = features[0] === 'attendance' ? s.attendance : features[0] === 'avgScore' ? s.avgScore : s.studyTime / 3;
      const yVal = features[1] === 'attendance' ? s.attendance : features[1] === 'avgScore' ? s.avgScore : s.studyTime / 3;
      
      return {
        id: s.id,
        name: s.name,
        x: xVal,
        y: yVal,
        cluster: `Cluster ${cluster}`,
        risk: s.riskLevel
      };
    });

    // Calculate mock centroids
    const centroids = Array.from({ length: clusterCount }, (_, i) => {
      const clusterData = data.filter(d => d.cluster === `Cluster ${i + 1}`);
      const avgX = clusterData.reduce((acc, curr) => acc + curr.x, 0) / (clusterData.length || 1);
      const avgY = clusterData.reduce((acc, curr) => acc + curr.y, 0) / (clusterData.length || 1);
      return { x: avgX, y: avgY, cluster: `Cluster ${i + 1}`, isCentroid: true };
    });

    return { data, centroids };
  }, [students, features, clusterCount]);

  const riskDistributionPerCluster = useMemo(() => {
    return Array.from({ length: clusterCount }, (_, i) => {
      const clusterName = `Cluster ${i + 1}`;
      const clusterData = clusterAnalysis.data.filter(d => d.cluster === clusterName);
      return {
        name: `Cohort ${i + 1}`,
        critical: clusterData.filter(d => d.risk === 'critical').length,
        high: clusterData.filter(d => d.risk === 'high').length,
        medium: clusterData.filter(d => d.risk === 'medium').length,
        low: clusterData.filter(d => d.risk === 'low').length,
      };
    });
  }, [clusterAnalysis.data, clusterCount]);

  const toggleClusterSelection = (id: number) => {
    setComparisonIndices(prev => {
      if (prev.includes(id)) return prev.filter(i => i !== id);
      if (prev.length >= 2) return [prev[1], id];
      return [...prev, id];
    });
    setSelectedCluster(id);
  };

  const comparisonData = useMemo(() => {
    if (comparisonIndices.length < 2) return null;
    
    const c1Index = comparisonIndices[0] - 1;
    const c2Index = comparisonIndices[1] - 1;
    
    const risk1 = riskDistributionPerCluster[c1Index];
    const risk2 = riskDistributionPerCluster[c2Index];
    
    // Add feature distributions for comparison
    const getClusterMetrics = (index: number) => {
      const data = clusterAnalysis.data.filter(d => d.cluster === `Cluster ${index + 1}`);
      const count = data.length || 1;
      return {
        avgX: data.reduce((acc, curr) => acc + curr.x, 0) / count,
        avgY: data.reduce((acc, curr) => acc + curr.y, 0) / count,
        size: data.length
      };
    };

    const strategies = [
      ['Academic Mentoring', 'Peer Study Groups', 'Grade Monitoring'],
      ['Attendance Counseling', 'Family Engagement', 'Transport Aid'],
      ['Mental Health Support', 'Resource Allocation', 'Financial Counseling'],
      ['Career Alignment', 'Skill Workshops', 'Advanced Placement']
    ];

    return {
      c1: { ...risk1, metrics: getClusterMetrics(c1Index), strategy: strategies[c1Index % 4] },
      c2: { ...risk2, metrics: getClusterMetrics(c2Index), strategy: strategies[c2Index % 4] }
    };
  }, [comparisonIndices, riskDistributionPerCluster, clusterAnalysis, features]);

  const toggleFeature = (f: ClusteringFeature) => {
    if (features.includes(f)) {
      if (features.length > 2) setFeatures(prev => prev.filter(x => x !== f));
    } else {
      setFeatures(prev => [prev[1], f]); // Keep only 2 for 2D plot
    }
  };

  return (
    <div className="space-y-12 pb-32">
      <header className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <h1 className="text-5xl font-black tracking-tighter flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-2xl">📊</div>
              Data Insight Core
            </h1>
            <p className="text-zinc-400 font-medium tracking-wide">Explore deep behavioral clusters and academic correlations</p>
          </div>
          
          <div className="flex gap-2 bg-white/5 p-1.5 rounded-2xl border border-white/5">
             {['Overview', 'Clusters', 'Heatmap'].map(tab => (
               <button key={tab} className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${tab === 'Clusters' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'text-zinc-500 hover:text-white'}`}>
                 {tab}
               </button>
             ))}
          </div>
        </div>
      </header>

      {/* NEW CLUSTERING SECTION */}
      <section className="bg-[#2B2F36]/40 border border-white/5 rounded-[56px] p-12 relative overflow-hidden group shadow-2xl">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-purple-500/5 blur-[120px] pointer-events-none" />
        
        <div className="flex flex-col lg:flex-row gap-12">
               <div className="lg:w-1/3 space-y-10">
              <div className="space-y-4">
                 <div className="flex items-center gap-4 text-purple-500">
                    <BrainCircuit size={32} />
                    <h3 className="text-3xl font-black tracking-tighter">Neural Clustering</h3>
                 </div>
                 <p className="text-xs font-black uppercase tracking-widest text-zinc-400 italic">Advanced unsupervised grouping algorithm</p>
              </div>

              <div className="space-y-8">
                 <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Select Dimensions</label>
                    <div className="flex flex-wrap gap-3">
                       {(['attendance', 'avgScore', 'studyTime'] as ClusteringFeature[]).map(f => (
                         <button 
                           key={f}
                           onClick={() => toggleFeature(f)}
                           className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${
                             features.includes(f) ? 'bg-purple-600 border-purple-500 text-white shadow-lg shadow-purple-500/20' : 'bg-white/5 border-white/5 text-zinc-500'
                           }`}
                         >
                           {f === 'avgScore' ? 'Academic Score' : f}
                         </button>
                       ))}
                    </div>
                 </div>

                 <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Optimal K (Clusters: {clusterCount})</label>
                    <input 
                      type="range" min="2" max="4" value={clusterCount} 
                      onChange={(e) => setClusterCount(parseInt(e.target.value))}
                      className="w-full h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer accent-purple-500"
                    />
                    <div className="flex justify-between text-[10px] font-mono opacity-30">
                       <span>K=2 (Broad)</span>
                       <span>K=4 (Granular)</span>
                    </div>
                 </div>

                 <div className="p-6 bg-purple-500/5 rounded-3xl border border-purple-500/10 space-y-4">
                    <div className="flex items-center gap-3 text-purple-500">
                       <Target size={18} />
                       <span className="text-xs font-black uppercase tracking-widest">Inertia Score: 124.2</span>
                    </div>
                    <p className="text-[11px] font-black leading-relaxed text-zinc-400 italic">
                       Clusters 2 and 3 show highest variance in engagement metrics, suggesting distinct intervention paths needed for these cohorts.
                    </p>
                 </div>
                 
                 <button className="w-full py-4 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all">
                    <RefreshCcw size={16} /> Re-run Algorithm
                 </button>
              </div>
           </div>

           <div className="flex-1 h-[600px] relative">
              <ResponsiveContainer width="100%" height="100%">
                 <ScatterChart margin={{ top: 20, right: 30, bottom: 20, left: 30 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.02)" />
                    <XAxis 
                      type="number" dataKey="x" name={features[0]} unit={features[0] === 'studyTime' ? 'm' : '%'} 
                      stroke="#404040" fontSize={11} fontWeight="black" domain={['auto', 'auto']} axisLine={false} tickLine={false} 
                    />
                    <YAxis 
                      type="number" dataKey="y" name={features[1]} unit={features[1] === 'studyTime' ? 'm' : '%'} 
                      stroke="#404040" fontSize={11} fontWeight="black" domain={['auto', 'auto']} axisLine={false} tickLine={false} 
                    />
                    <ZAxis type="number" range={[100, 300]} />
                    <Tooltip 
                       cursor={{ strokeDasharray: '3 3', stroke: '#52525B' }} 
                       contentStyle={{ backgroundColor: '#2B2F36', border: '1px solid #3F3F46', borderRadius: '24px', padding: '16px' }}
                    />
                    <Legend iconType="circle" />
                    {Array.from({ length: clusterCount }).map((_, i) => (
                      <Scatter 
                        key={`cluster-${i}`}
                        name={`Cohort ${i + 1}`} 
                        data={clusterAnalysis.data.filter(d => d.cluster === `Cluster ${i + 1}`)} 
                        fill={i === 0 ? COLORS.cluster1 : i === 1 ? COLORS.cluster2 : i === 2 ? COLORS.cluster3 : COLORS.cluster4} 
                        onClick={() => toggleClusterSelection(i + 1)}
                        className={`cursor-pointer transition-all ${comparisonIndices.includes(i + 1) ? 'opacity-100 scale-110 stroke-white stroke-2' : 'opacity-60 hover:opacity-100'}`}
                      />
                    ))}
                    {/* Centroids */}
                    <Scatter 
                       name="Centroids" 
                       data={clusterAnalysis.centroids} 
                       shape="cross" 
                       fill="#fff" 
                    />
                 </ScatterChart>
              </ResponsiveContainer>
              
              <div className="absolute top-4 right-4 flex flex-col gap-2">
                 {['critical', 'high', 'medium', 'low'].map(r => (
                   <div key={r} className="flex items-center gap-2 opacity-40 hover:opacity-100 transition-opacity">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[r as keyof typeof COLORS] }} />
                      <span className="text-[9px] font-black uppercase tracking-widest text-zinc-500">{r} risk ref</span>
                   </div>
                 ))}
              </div>
           </div>
        </div>

        <div className="mt-12 bg-[#2B2F36]/20 border border-white/5 rounded-[48px] p-10 overflow-hidden relative group shadow-inner">
           <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-purple-500/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
           <div className="flex flex-col lg:flex-row gap-16">
              <div className="lg:w-3/4">
                 <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
                    <div className="space-y-1">
                       <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-purple-400 flex items-center gap-3">
                          <Target size={14} />
                          Cohort Risk Profile
                       </h4>
                       <span className="text-sm font-black tracking-tight text-white/40 italic">Distribution of risk levels across student clusters</span>
                    </div>
                    <div className="flex gap-6 text-[9px] font-black uppercase tracking-widest text-zinc-400">
                       {['low', 'medium', 'high', 'critical'].map(l => (
                         <div key={l} className="flex items-center gap-2 group/legend">
                            <div className={`w-3 h-1 rounded-full ${l === 'low' ? 'bg-green-500' : l === 'medium' ? 'bg-yellow-500' : l === 'high' ? 'bg-orange-500' : 'bg-red-500'}`} />
                            <span className="group-hover/legend:text-white transition-colors">{l}</span>
                         </div>
                       ))}
                    </div>
                 </div>
                 <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                       <BarChart data={riskDistributionPerCluster} stackOffset="expand" margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
                          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#71717A', fontSize: 11, fontWeight: '900' }} height={40} />
                          <YAxis hide />
                          <Tooltip 
                             contentStyle={{ backgroundColor: '#2B2F36', border: '1px solid #3F3F46', borderRadius: '24px', padding: '16px' }}
                             itemStyle={{ fontWeight: '900' }}
                          />
                          <Bar dataKey="low" stackId="a" fill="#22C55E" barSize={50} />
                          <Bar dataKey="medium" stackId="a" fill="#EAB308" barSize={50} />
                          <Bar dataKey="high" stackId="a" fill="#F97316" barSize={50} />
                          <Bar dataKey="critical" stackId="a" fill="#EF4444" barSize={50} radius={[12, 12, 0, 0]} />
                       </BarChart>
                    </ResponsiveContainer>
                 </div>
              </div>

              <div className="lg:w-1/4 border-l border-white/10 pl-10">
                 <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-300 mb-8 font-mono">Driving Variables</h4>
                 <div className="space-y-4">
                    {[
                      { name: 'Engagement Depth', value: 85, color: 'bg-purple-600' },
                      { name: 'Attendance Stability', value: 64, color: 'bg-blue-600' },
                      { name: 'Study Consistency', value: 42, color: 'bg-cyan-600' }
                    ].map(f => (
                      <div key={f.name} className="space-y-2">
                         <div className="flex justify-between text-[9px] font-black uppercase">
                            <span>{f.name}</span>
                            <span className="opacity-40">{f.value}%</span>
                         </div>
                         <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: `${f.value}%` }}
                              className={`h-full ${f.color}`}
                            />
                         </div>
                      </div>
                    ))}
                 </div>
              </div>
           </div>
        </div>

        {/* Comparison Section */}
        <AnimatePresence>
          {comparisonData && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-12 overflow-hidden"
            >
              <div className="bg-[#1F2228]/80 border border-purple-500/30 rounded-[48px] p-12 backdrop-blur-3xl shadow-2xl space-y-12">
                <div className="flex items-center justify-between">
                   <div className="space-y-2">
                      <h3 className="text-3xl font-black tracking-tighter flex items-center gap-4">
                         <RefreshCcw className="text-purple-500" />
                         Cohort Contrast Analysis
                      </h3>
                      <p className="text-sm font-black italic opacity-40 uppercase tracking-widest">Side-by-side behavioral variance report</p>
                   </div>
                   <button 
                     onClick={() => setComparisonIndices([])}
                     className="px-8 py-3 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all"
                   >
                     Clear Selection
                   </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 relative">
                   <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-px h-2/3 bg-white/5 hidden lg:block" />
                   
                   {[comparisonData.c1, comparisonData.c2].map((c, i) => (
                     <div key={i} className="space-y-10">
                        <div className="flex items-center justify-between">
                           <div className="flex items-center gap-4">
                              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl font-black`} style={{ backgroundColor: i === 0 ? COLORS.cluster1 : COLORS.cluster2 }}>
                                 {comparisonIndices[i]}
                              </div>
                              <div>
                                 <h4 className="text-2xl font-black tracking-tighter">Cohort {comparisonIndices[i]}</h4>
                                 <span className="text-[10px] font-black uppercase opacity-40">{c.metrics.size} Students Identified</span>
                              </div>
                           </div>
                        </div>

                        {/* Risk Profile */}
                        <div className="space-y-4">
                           <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Risk Allocation</label>
                           <div className="h-6 w-full flex rounded-full overflow-hidden border border-white/5">
                              {['low', 'medium', 'high', 'critical'].map(l => {
                                const val = (c as any)[l];
                                const total = c.low + c.medium + c.high + c.critical;
                                const width = (val / (total || 1)) * 100;
                                return (
                                  <div 
                                    key={l}
                                    style={{ width: `${width}%`, backgroundColor: COLORS[l as keyof typeof COLORS] }}
                                    className="h-full flex items-center justify-center text-[8px] font-bold text-black/60"
                                  >
                                    {width > 15 && `${Math.round(width)}%`}
                                  </div>
                                );
                              })}
                           </div>
                        </div>

                        {/* Feature Averages */}
                        <div className="grid grid-cols-2 gap-6">
                           {[
                             { label: features[0], value: c.metrics.avgX },
                             { label: features[1], value: c.metrics.avgY }
                           ].map((m, idx) => (
                             <div key={idx} className="bg-white/5 p-6 rounded-3xl border border-white/5 space-y-2">
                                <div className="text-[9px] font-black uppercase tracking-widest text-zinc-500">{m.label === 'avgScore' ? 'Academic Score' : m.label}</div>
                                <div className="text-2xl font-black">{m.value.toFixed(1)}{m.label === 'studyTime' ? 'm' : '%'}</div>
                             </div>
                           ))}
                        </div>

                        {/* Intervention Strategy */}
                        <div className="space-y-6">
                           <div className="flex items-center justify-between">
                              <label className="text-[10px] font-black uppercase tracking-widest text-purple-400">Strategic Alignment</label>
                              <div className="px-3 py-1 bg-purple-500/10 border border-purple-500/20 rounded-full text-[8px] font-black uppercase tracking-tighter text-purple-500">Optimized</div>
                           </div>
                           <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                              {c.strategy.map((s, idx) => (
                                <div key={idx} className="bg-purple-500/5 border border-purple-500/10 p-4 rounded-2xl flex items-center justify-center text-center">
                                   <span className="text-[9px] font-black uppercase tracking-tight text-purple-300">{s}</span>
                                </div>
                              ))}
                           </div>
                        </div>
                     </div>
                   ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Detailed Cluster View Modal/Overlay */}
        <AnimatePresence>
          {selectedCluster && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="mt-8 bg-purple-600/10 border border-purple-500/20 rounded-[40px] p-10 flex flex-col md:flex-row gap-10 items-center justify-between"
            >
               <div className="space-y-4">
                  <div className="text-[10px] font-black uppercase tracking-[0.3em] text-purple-400 font-mono">Deep Cohort Analysis</div>
                  <h3 className="text-4xl font-black tracking-tighter">Cohort {selectedCluster} Details</h3>
                  <p className="text-sm opacity-60 max-w-xl font-medium leading-relaxed italic">
                    This cohort is characterized by high variability in {features[0]} but exhibits strong internal correlation with {features[1]}. Recommended intervention includes peer-led workshops.
                  </p>
               </div>
               <div className="flex gap-4">
                  <div className="bg-white/5 p-6 rounded-3xl border border-white/5 text-center px-10">
                     <div className="text-2xl font-black text-purple-500">42</div>
                     <div className="text-[9px] font-black uppercase tracking-widest opacity-40">Students</div>
                  </div>
                  <button 
                    onClick={() => setSelectedCluster(null)}
                    className="h-full px-8 bg-purple-600 text-white rounded-3xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-purple-500/40 hover:bg-purple-700 transition-all font-mono"
                  >
                    View Student List
                  </button>
               </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-[#2B2F36]/40 border border-white/5 rounded-[48px] p-10 h-[600px] flex flex-col relative overflow-hidden backdrop-blur-xl shadow-lg">
          <div className="flex items-center justify-between mb-10">
            <h3 className="text-2xl font-black tracking-tight flex items-center gap-3">
               <BarChart3 size={24} className="text-blue-500" />
               Variable Importance (SHAP)
            </h3>
            <Info size={18} className="opacity-20 cursor-help hover:opacity-100 transition-opacity" />
          </div>
          <div className="flex-1">
             <ResponsiveContainer width="100%" height="100%">
                <BarChart data={variableImportance} layout="vertical" margin={{ left: 40, right: 40 }}>
                   <XAxis type="number" hide />
                   <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: '#A1A1AA', fontSize: 11, fontWeight: 'black' }} />
                   <Tooltip 
                     cursor={{ fill: 'rgba(255,255,255,0.02)' }}
                     contentStyle={{ backgroundColor: '#2B2F36', border: '1px solid #3F3F46', borderRadius: '24px' }}
                   />
                   <Bar dataKey="importance" fill="#3b82f6" radius={[0, 8, 8, 0]} barSize={20}>
                      {variableImportance.map((_, i) => (
                         <Cell key={i} fillOpacity={1 - (i * 0.12)} />
                      ))}
                   </Bar>
                </BarChart>
             </ResponsiveContainer>
          </div>
          <div className="mt-8 flex justify-between px-4 pb-2">
            <div className="space-y-2">
               <span className="text-[10px] uppercase font-black tracking-widest text-zinc-300 block">Top Factor</span>
               <div className="text-xl font-black text-blue-500 uppercase">Average Score (0.94)</div>
            </div>
            <div className="text-right space-y-2">
               <span className="text-[10px] uppercase font-black tracking-widest text-zinc-300 block">Algorithm</span>
               <div className="text-xl font-black opacity-40 uppercase italic">LightGBM V3</div>
            </div>
          </div>
        </div>

        <div className="bg-[#2B2F36]/40 border border-white/5 rounded-[48px] p-10 h-[600px] flex flex-col relative overflow-hidden backdrop-blur-xl shadow-lg">
          <div className="flex items-center justify-between mb-10">
            <h3 className="text-2xl font-black tracking-tight flex items-center gap-3">
               <Layers size={24} className="text-purple-500" />
               Socioeconomic vs Risk
            </h3>
            <div className="flex gap-2">
               {['low', 'medium', 'high', 'critical'].map(l => (
                 <div key={l} className={`w-3 h-3 rounded-full ${l === 'low' ? 'bg-green-500' : l === 'medium' ? 'bg-yellow-500' : l === 'high' ? 'bg-orange-500' : 'bg-red-500'}`} />
               ))}
            </div>
          </div>
          <div className="flex-1">
             <ResponsiveContainer width="100%" height="100%">
                <BarChart data={socioeconomicData} stackOffset="expand" margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                   <CartesianGrid strokeDasharray="3 3" stroke="#3F3F46" vertical={false} />
                   <XAxis dataKey="level" axisLine={false} tickLine={false} tick={{ fill: '#A1A1AA', fontSize: 11, fontWeight: '900' }} height={50} />
                   <YAxis hide />
                   <Tooltip 
                     contentStyle={{ backgroundColor: '#2B2F36', border: '1px solid #3F3F46', borderRadius: '24px' }}
                   />
                   <Bar dataKey="low" stackId="a" fill="#22C55E" barSize={40} />
                   <Bar dataKey="medium" stackId="a" fill="#EAB308" barSize={40} />
                   <Bar dataKey="high" stackId="a" fill="#F97316" barSize={40} />
                   <Bar dataKey="critical" stackId="a" fill="#EF4444" barSize={40} radius={[8, 8, 0, 0]} />
                </BarChart>
             </ResponsiveContainer>
          </div>
          <div className="mt-8 p-6 bg-white/5 rounded-[32px] border border-white/5 italic">
             <p className="text-[11px] font-black leading-relaxed text-zinc-400 text-center">
               Correlation detected: Tier 4 students show a 3.5x higher probability of critical risk classification compared to Tier 1.
             </p>
          </div>
        </div>
      </div>
    </div>
  );
}

