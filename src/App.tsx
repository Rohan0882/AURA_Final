import { useState } from 'react';
import { Layout, Users, Activity, Lightbulb, Database, Search, ChevronLeft, Menu, Bell, Cpu } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ViewType, Student } from './types/slis';
import { MOCK_STUDENTS } from './data/mockData';
import { OverviewView } from './components/views/OverviewView';
import { RiskMonitorView } from './components/views/RiskMonitorView';
import { StudentDetailView } from './components/views/StudentDetailView';
import { RecommendationsView } from './components/views/RecommendationsView';
import { EDAExplorerView } from './components/views/EDAExplorerView';
import { ModelTrainingView } from './components/views/ModelTrainingView';

export default function App() {
  const [activeView, setActiveView] = useState<ViewType>('overview');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  const [showNotifications, setShowNotifications] = useState(false);

  const students = MOCK_STUDENTS;

  const navigateToStudent = (student: Student) => {
    setSelectedStudent(student);
    setActiveView('student_detail');
  };

  const handleExport = () => {
    const data = JSON.stringify(students, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `AURA_Cohort_Analysis_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
  };

  const navItems = [
    { id: 'overview', label: 'Pulse Core', icon: Layout },
    { id: 'risk_monitor', label: 'Risk Radar', icon: Users },
    { id: 'student_detail', label: 'Student Hub', icon: Activity },
    { id: 'recommendations', label: 'Action Flow', icon: Lightbulb },
    { id: 'eda_explorer', label: 'Deep Insight', icon: Database },
    { id: 'model_training', label: 'Model Hub', icon: Cpu },
  ];

  const themeColors = theme === 'dark' 
    ? { bg: 'bg-[#1F2228]', text: 'text-zinc-100', border: 'border-zinc-700/50', card: 'bg-[#2B2F36]', subText: 'text-zinc-400' }
    : { bg: 'bg-[#F9FAFB]', text: 'text-zinc-900', border: 'border-zinc-200', card: 'bg-white', subText: 'text-zinc-500' };

  const notifications = [
    { title: 'Critical Risk Alert', desc: '5 students dropped below 60% attendance.', time: '2m ago', type: 'error' },
    { title: 'New Analysis Ready', desc: 'Clustering model has been updated with new data.', time: '15m ago', type: 'info' },
    { title: 'GPA Prediction', desc: 'GPA trends show a 5% improvement in Grade 10.', time: '1h ago', type: 'success' },
  ];

  return (
    <div className={`min-h-screen ${themeColors.bg} ${themeColors.text} flex font-sans selection:bg-blue-500 selection:text-white transition-colors duration-500`}>
      {/* Notifications Sidebar Popover */}
      <AnimatePresence>
        {showNotifications && (
          <motion.div 
            initial={{ opacity: 0, x: 400 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 400 }}
            className={`fixed right-0 top-0 h-full w-96 ${themeColors.card} border-l ${themeColors.border} z-[100] shadow-2xl p-8`}
          >
             <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-black tracking-tight">Real-time Notifications</h3>
                <button onClick={() => setShowNotifications(false)} className="p-2 hover:bg-white/5 rounded-full">
                   <ChevronLeft size={24} className="rotate-180" />
                </button>
             </div>
             <div className="space-y-4">
                {notifications.map((n, i) => (
                  <div key={i} className={`p-5 rounded-2xl border ${themeColors.border} bg-white/5 hover:bg-white/10 transition-colors cursor-pointer group`}>
                     <div className="flex justify-between items-start mb-2">
                        <span className={`text-[10px] font-black uppercase tracking-widest ${n.type === 'error' ? 'text-red-500' : n.type === 'success' ? 'text-green-500' : 'text-blue-500'}`}>{n.type}</span>
                        <span className="text-[9px] opacity-30 font-mono italic">{n.time}</span>
                     </div>
                     <h4 className="text-sm font-black mb-1 group-hover:text-blue-500 transition-colors uppercase">{n.title}</h4>
                     <p className="text-xs opacity-60 font-medium leading-relaxed italic">{n.desc}</p>
                  </div>
                ))}
             </div>
             <div className="mt-8 pt-8 border-t border-white/5">
                <button className="w-full py-4 text-[10px] font-black uppercase tracking-widest text-zinc-600 hover:text-white transition-colors">Mark all as read</button>
             </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sidebar Navigation */}
      <aside 
        className={`${sidebarOpen ? 'w-80' : 'w-20'} transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] ${themeColors.bg} border-r ${themeColors.border} flex flex-col z-50 overflow-hidden text-inherit`}
      >
        <div className="p-8 flex items-center justify-between whitespace-nowrap">
          <div className={`flex items-center gap-3 transition-opacity duration-300 ${sidebarOpen ? 'opacity-100' : 'opacity-0 w-0 overflow-hidden'}`}>
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-black text-white">A</div>
            <span className="font-black text-2xl tracking-tighter italic">AURA</span>
          </div>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className={`p-2 hover:bg-zinc-500/10 rounded-xl transition-colors ${themeColors.text}`}>
            {sidebarOpen ? <ChevronLeft size={18} /> : <Menu size={18} />}
          </button>
        </div>

        <nav className="flex-1 px-4 mt-8 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id as ViewType)}
              className={`w-full flex items-center gap-4 px-4 py-4 rounded-2xl transition-all duration-300 group whitespace-nowrap overflow-hidden ${
                activeView === item.id 
                  ? 'bg-blue-600 text-white shadow-[0_0_20px_rgba(37,99,235,0.3)]' 
                  : `${themeColors.subText} hover:bg-zinc-500/10 hover:text-blue-500`
              }`}
            >
              <div className="flex-shrink-0 text-inherit">
                <item.icon size={20} className={activeView === item.id ? 'animate-bounce' : 'group-hover:scale-110 transition-transform'} />
              </div>
              {sidebarOpen && <span className="font-bold text-sm tracking-tight">{item.label}</span>}
              {activeView === item.id && sidebarOpen && (
                <motion.div layoutId="nav-dot" className="w-1.5 h-1.5 bg-white rounded-full ml-auto" />
              )}
            </button>
          ))}
        </nav>

        {sidebarOpen && (
          <div className="p-6">
            <div className={`${themeColors.card} border ${themeColors.border} rounded-3xl p-6 space-y-4 shadow-sm`}>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40">Quick Student Lookup</span>
              <div className="relative">
                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 opacity-30" size={14} />
                 <input 
                   placeholder="Student ID..."
                   className={`w-full ${theme === 'dark' ? 'bg-[#1F2228]' : 'bg-zinc-50'} border ${themeColors.border} rounded-xl pl-10 pr-4 py-2 text-xs font-bold focus:border-blue-500 outline-none`}
                 />
              </div>
            </div>
          </div>
        )}
      </aside>

      {/* Main Content Area */}
      <main className={`flex-1 h-screen overflow-y-auto ${themeColors.bg} relative scrollbar-thin scrollbar-thumb-zinc-800 transition-colors duration-500`}>
        {/* Top Header */}
        <header className={`sticky top-0 z-40 ${theme === 'dark' ? 'bg-[#1F2228]/80' : 'bg-white/80'} backdrop-blur-xl border-b ${themeColors.border} px-8 py-6 flex justify-between items-center transition-colors duration-500`}>
           <div className="flex items-center gap-2">
             <span className={`text-[10px] font-mono ${themeColors.subText} opacity-30 uppercase tracking-[0.3em]`}>Module</span>
             <div className="h-1 w-8 bg-blue-600 rounded-full" />
             <span className="text-sm font-black uppercase tracking-widest">{activeView.replace('_', ' ')}</span>
           </div>
           
           <div className="flex items-center gap-4">
              <button 
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className={`p-3 rounded-xl border ${themeColors.border} hover:bg-zinc-500/10 transition-all flex items-center gap-2`}
              >
                {theme === 'dark' ? <Lightbulb size={18} className="text-yellow-500" /> : <Database size={18} className="text-blue-600" />}
                <span className="text-[10px] font-black uppercase tracking-widest">{theme} mode</span>
              </button>

              <button 
                onClick={handleExport}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-blue-500/20 active:scale-95 transition-all"
              >
                Export Cohort Analysis
              </button>
              
              <div 
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative cursor-pointer hover:scale-110 transition-transform ml-2"
              >
                <Bell size={20} className={themeColors.subText} />
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-[8px] font-black text-white">3</div>
              </div>
           </div>
        </header>

        <section className="p-12 max-w-[1600px] mx-auto pb-32">
           <AnimatePresence mode="wait">
             <motion.div
               key={activeView}
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               exit={{ opacity: 0, y: -20 }}
               transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
             >
                {activeView === 'overview' && <OverviewView students={students} />}
                {activeView === 'risk_monitor' && <RiskMonitorView students={students} onSelectStudent={navigateToStudent} />}
                {activeView === 'student_detail' && (
                  <StudentDetailView student={selectedStudent || students[0]} />
                )}
                {activeView === 'recommendations' && <RecommendationsView students={students} />}
                {activeView === 'eda_explorer' && <EDAExplorerView students={students} />}
                {activeView === 'model_training' && <ModelTrainingView students={students} />}
             </motion.div>
           </AnimatePresence>
        </section>

        {/* Floating AI Assistant Bar (Subtle) */}
        <div className="fixed bottom-12 right-12 z-50">
           <motion.button 
             whileHover={{ scale: 1.05, rotate: 5 }}
             whileTap={{ scale: 0.95 }}
             className="w-16 h-16 bg-white text-black rounded-[24px] shadow-2xl shadow-blue-500/20 flex items-center justify-center group"
           >
              <Lightbulb size={28} className="group-hover:text-blue-600 transition-colors" />
           </motion.button>
        </div>
      </main>
    </div>
  );
}
