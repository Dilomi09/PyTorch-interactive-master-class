import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, BookOpen, CheckCircle, Circle, ChevronRight, Hash } from 'lucide-react';
import { useStore } from '../store';
import { MODULES } from '../constants';
import { useNavigate, useLocation } from 'react-router-dom';

export const CourseMap: React.FC = () => {
  const { isMapOpen, setMapOpen, completedModules, xp } = useStore();
  const navigate = useNavigate();
  const location = useLocation();

  const progress = (completedModules.length / MODULES.length) * 100;

  // Extract sub-sections from markdown content using simple regex
  const modulesWithSections = useMemo(() => {
    return MODULES.map(mod => {
      // Match headers like "# Title" or "## Title"
      const lines = mod.content.split('\n');
      const sections = lines
        .filter(line => line.startsWith('#'))
        .map(line => {
            const level = line.match(/^#+/)?.[0].length || 0;
            const text = line.replace(/^#+\s+/, '');
            // Create a URL-friendly ID
            const id = text.toLowerCase().replace(/[^\w]+/g, '-');
            return { level, text, id };
        });
      return { ...mod, sections };
    });
  }, []);

  const handleNavigation = (moduleId: string, sectionId?: string) => {
    setMapOpen(false);
    if (location.pathname !== `/module/${moduleId}`) {
        navigate(`/module/${moduleId}`);
        // Allow time for page load before scrolling
        if (sectionId) {
            setTimeout(() => {
                const element = document.getElementById(sectionId);
                element?.scrollIntoView({ behavior: 'smooth' });
            }, 500);
        }
    } else if (sectionId) {
        const element = document.getElementById(sectionId);
        element?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <AnimatePresence>
      {isMapOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMapOpen(false)}
            className="fixed inset-0 bg-black/20 dark:bg-black/60 backdrop-blur-sm z-[60]"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed left-0 top-0 bottom-0 w-full max-w-md bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-r border-white/20 shadow-2xl z-[70] flex flex-col"
          >
            {/* Header */}
            <div className="p-6 border-b border-black/5 dark:border-white/5 flex justify-between items-center">
              <h2 className="text-2xl font-bold tracking-tight">Course Map</h2>
              <button 
                onClick={() => setMapOpen(false)}
                className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Progress Section */}
            <div className="p-6 bg-gradient-to-br from-blue-500/10 to-purple-500/10">
                <div className="flex justify-between items-end mb-2">
                    <div>
                        <div className="text-sm text-slate-500 font-medium uppercase tracking-wider">Total Progress</div>
                        <div className="text-3xl font-bold text-accent-blue">{Math.round(progress)}%</div>
                    </div>
                    <div className="text-right">
                         <div className="text-sm text-slate-500 font-medium uppercase tracking-wider">Total XP</div>
                         <div className="text-xl font-bold text-accent-orange">{xp}</div>
                    </div>
                </div>
                <div className="w-full h-2 bg-black/5 dark:bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        className="h-full bg-accent-blue"
                    />
                </div>
            </div>

            {/* Module List */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
                {modulesWithSections.map((mod, idx) => {
                    const isCompleted = completedModules.includes(mod.id);
                    const isActive = location.pathname === `/module/${mod.id}`;

                    return (
                        <div key={mod.id} className="group">
                            {/* Module Header */}
                            <div 
                                onClick={() => handleNavigation(mod.id)}
                                className={`flex items-center gap-4 p-3 rounded-xl cursor-pointer transition-all
                                    ${isActive ? 'bg-accent-blue/10 border border-accent-blue/30' : 'hover:bg-black/5 dark:hover:bg-white/5 border border-transparent'}
                                `}
                            >
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0
                                    ${isCompleted ? 'bg-green-500 text-white' : isActive ? 'bg-accent-blue text-white' : 'bg-black/10 dark:bg-white/10 text-slate-500'}
                                `}>
                                    {isCompleted ? <CheckCircle size={16} /> : <span className="text-xs font-bold">{idx + 1}</span>}
                                </div>
                                
                                <div className="flex-1">
                                    <div className={`font-semibold ${isActive ? 'text-accent-blue' : ''}`}>{mod.title}</div>
                                    <div className="text-xs text-slate-500">{mod.estimatedTime} • {mod.difficulty}</div>
                                </div>

                                <ChevronRight size={16} className={`text-slate-400 transition-transform ${isActive ? 'rotate-90' : ''}`} />
                            </div>

                            {/* Sub-sections (Table of Contents) */}
                            <div className="ml-11 mt-2 space-y-1 border-l border-black/5 dark:border-white/10 pl-4">
                                {mod.sections.map((sec, i) => (
                                    <div 
                                        key={i}
                                        onClick={() => handleNavigation(mod.id, sec.id)}
                                        className="text-sm py-1 text-slate-500 dark:text-slate-400 hover:text-accent-blue dark:hover:text-accent-blue cursor-pointer flex items-center gap-2 transition-colors"
                                    >
                                        {sec.level > 1 && <div className="w-1 h-1 rounded-full bg-slate-400" />} 
                                        {sec.text}
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};