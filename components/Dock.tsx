import React, { useRef } from 'react';
import { motion, MotionValue, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Home, Award, Settings, Terminal, Upload, Download, Map } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useStore } from '../store';
import toast from 'react-hot-toast';

export const Dock: React.FC = () => {
  const mouseY = useMotionValue(Infinity);
  const navigate = useNavigate();
  const location = useLocation();
  const { xp, toggleDarkMode, loadState, setMapOpen } = useStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSave = () => {
    const state = useStore.getState();
    const dataToSave = {
      xp: state.xp,
      completedModules: state.completedModules,
      darkMode: state.darkMode,
      currentModuleId: state.currentModuleId
    };
    const blob = new Blob([JSON.stringify(dataToSave, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'pytorch-masterclass-save.json';
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Progress Saved!");
  };

  const handleLoadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        loadState(json);
        toast.success("Progress Loaded!");
      } catch (err) {
        toast.error("Invalid save file");
      }
    };
    reader.readAsText(file);
    // Reset input
    e.target.value = '';
  };

  return (
    <>
      <motion.div
        onMouseMove={(e) => mouseY.set(e.pageY)}
        onMouseLeave={() => mouseY.set(Infinity)}
        className="fixed left-4 top-1/2 -translate-y-1/2 h-auto w-16 flex flex-col items-center gap-4 p-3 rounded-full liquid-glass z-50"
      >
        <DockIcon mouse={mouseY} icon={Home} label="Home" onClick={() => navigate('/')} active={location.pathname === '/'} />
        <div className="w-8 h-[1px] bg-black/10 dark:bg-white/10" />
        
        {/* Course Map Toggle */}
        <DockIcon mouse={mouseY} icon={Map} label="Course Map" onClick={() => setMapOpen(true)} active={false} />
        
        <DockIcon mouse={mouseY} icon={Terminal} label="Playground" onClick={() => navigate('/module/tensors-101')} active={location.pathname.includes('/module')} />
        <DockIcon mouse={mouseY} icon={Award} label={`XP: ${xp}`} onClick={() => {}} active={false} badge={xp > 0} />
        <div className="w-8 h-[1px] bg-black/10 dark:bg-white/10" />
        <DockIcon mouse={mouseY} icon={Download} label="Save Progress" onClick={handleSave} active={false} />
        <DockIcon mouse={mouseY} icon={Upload} label="Load Progress" onClick={handleLoadClick} active={false} />
        <div className="w-8 h-[1px] bg-black/10 dark:bg-white/10" />
        <DockIcon mouse={mouseY} icon={Settings} label="Theme" onClick={toggleDarkMode} active={false} />
      </motion.div>
      
      <input 
        type="file" 
        ref={fileInputRef} 
        className="hidden" 
        accept=".json" 
        onChange={handleFileChange} 
      />
    </>
  );
};

interface DockIconProps {
  mouse: MotionValue<number>;
  icon: React.ElementType;
  label: string;
  onClick: () => void;
  active: boolean;
  badge?: boolean;
}

const DockIcon: React.FC<DockIconProps> = ({ mouse, icon: Icon, label, onClick, active, badge }) => {
  const ref = React.useRef<HTMLDivElement>(null);

  const distance = useTransform(mouse, (val) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { y: 0, height: 0 };
    return val - bounds.y - bounds.height / 2;
  });

  const widthSync = useTransform(distance, [-150, 0, 150], [40, 60, 40]);
  const width = useSpring(widthSync, { mass: 0.1, stiffness: 150, damping: 12 });

  return (
    <div className="relative group">
       <motion.div
        ref={ref}
        style={{ width, height: width }}
        onClick={onClick}
        className={`rounded-full flex items-center justify-center cursor-pointer transition-colors duration-200 relative
          ${active ? 'bg-accent-blue text-white shadow-lg shadow-blue-500/30' : 'bg-white/50 dark:bg-white/10 hover:bg-white/80 dark:hover:bg-white/20 text-slate-700 dark:text-slate-200'}
        `}
      >
        <Icon size={20} strokeWidth={2} />
        {badge && (
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-accent-orange rounded-full border-2 border-white dark:border-black" />
        )}
      </motion.div>
      
      {/* Tooltip */}
      <div className="absolute left-full ml-4 top-1/2 -translate-y-1/2 px-2 py-1 rounded bg-black/80 text-white text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none backdrop-blur-md z-50">
        {label}
      </div>
    </div>
  );
};