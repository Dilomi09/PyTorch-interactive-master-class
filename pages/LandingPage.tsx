import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { MODULES } from '../constants';
import { ArrowRight, Brain, TrendingUp, Code2 } from 'lucide-react';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1 }
};

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-6xl mx-auto pt-12 pb-24">
      <header className="mb-12">
        <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-bold tracking-tighter mb-8 pb-2 bg-clip-text text-transparent bg-gradient-to-br from-slate-800 to-slate-500 dark:from-white dark:to-slate-500"
        >
          PyTorch Master Class
        </motion.h1>
        <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed"
        >
          Master deep learning through interactive visuals and liquid interfaces. 
          Experience the future of coding education.
        </motion.p>
      </header>

      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-3 gap-6 grid-rows-[auto_auto]"
      >
        {/* Featured Large Card */}
        <motion.div 
            variants={item}
            className="md:col-span-2 md:row-span-2 liquid-glass rounded-3xl p-8 relative group overflow-hidden cursor-pointer"
            onClick={() => navigate(`/module/${MODULES[0].id}`)}
        >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative z-10 h-full flex flex-col justify-between">
                <div>
                    <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-600 dark:text-blue-300 text-xs font-bold uppercase tracking-widest">Start Here</span>
                    <h2 className="text-4xl font-bold mt-4 mb-2">Zero to Hero</h2>
                    <p className="text-slate-600 dark:text-slate-300 text-lg">Start your journey with Tensors and fundamental operations.</p>
                </div>
                <div className="flex items-center gap-2 text-accent-blue font-semibold mt-8 group-hover:translate-x-2 transition-transform">
                    Begin Module <ArrowRight size={20} />
                </div>
            </div>
            <div className="absolute -right-12 -bottom-12 opacity-20 group-hover:scale-110 transition-transform duration-700">
                <Brain size={300} />
            </div>
        </motion.div>

        {/* Stat Card 1 */}
        <motion.div variants={item} className="liquid-glass rounded-3xl p-6 flex flex-col justify-center items-center text-center">
            <div className="w-12 h-12 rounded-full bg-orange-500/20 flex items-center justify-center text-accent-orange mb-4">
                <TrendingUp size={24} />
            </div>
            <div className="text-3xl font-bold">Real-time</div>
            <div className="text-sm text-slate-500">Loss Visualization</div>
        </motion.div>

        {/* Stat Card 2 */}
        <motion.div variants={item} className="liquid-glass rounded-3xl p-6 flex flex-col justify-center items-center text-center">
             <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 mb-4">
                <Code2 size={24} />
            </div>
            <div className="text-3xl font-bold">Interactive</div>
            <div className="text-sm text-slate-500">Code Execution</div>
        </motion.div>

        {/* Remaining Modules List */}
        <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
             {MODULES.slice(1).map((mod) => (
                <motion.div 
                    key={mod.id}
                    variants={item}
                    whileHover={{ y: -5 }}
                    onClick={() => navigate(`/module/${mod.id}`)}
                    className="liquid-glass rounded-2xl p-6 cursor-pointer border border-transparent hover:border-blue-500/30 transition-all"
                >
                    <h3 className="text-xl font-bold mb-2">{mod.title}</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 mb-4">{mod.description}</p>
                    <div className="flex gap-2">
                        {mod.tags.map(tag => (
                            <span key={tag} className="text-xs px-2 py-1 rounded-md bg-black/5 dark:bg-white/5 font-mono">{tag}</span>
                        ))}
                    </div>
                </motion.div>
            ))}
        </div>
      </motion.div>
    </div>
  );
};