import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { MODULES } from '../constants';
import { CodeEditor } from '../components/CodeEditor';
import { NetworkViz } from '../components/NetworkViz';
import { TrainingCurve } from '../components/TrainingCurve';
import { executeCode } from '../services/backendService';
import { ExecutionResponse, VisualizationType } from '../types';
import { useStore } from '../store';
import { Play, RotateCcw, Database } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import confetti from 'canvas-confetti';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

export const ModulePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const moduleData = MODULES.find(m => m.id === id);
  const { addXp, completeModule } = useStore();

  const [code, setCode] = useState(moduleData?.initialCode || '');
  const [output, setOutput] = useState<ExecutionResponse | null>(null);
  const [activeTab, setActiveTab] = useState<VisualizationType>(VisualizationType.NONE);
  const [isRunning, setIsRunning] = useState(false);
  
  // User Data State
  const [userData, setUserData] = useState('');
  const [showDataInput, setShowDataInput] = useState(false);

  useEffect(() => {
    if (moduleData) {
      setCode(moduleData.initialCode);
      setOutput(null);
      setActiveTab(VisualizationType.NONE);
      setUserData('');
    }
  }, [id, moduleData]);

  if (!moduleData) return <div className="text-center mt-20">Module not found</div>;

  const handleRun = async () => {
    setIsRunning(true);
    toast.loading('Executing on Neural Engine...', { id: 'exec' });
    
    const result = await executeCode(code, userData);
    setOutput(result);
    
    toast.dismiss('exec');
    
    if (result.error) {
      toast.error('Execution failed');
    } else {
      toast.success('Execution successful');
      
      // Switch tab based on output
      if (result.loss_history && result.loss_history.length > 0) {
        setActiveTab(VisualizationType.TRAINING);
      } else if (result.model_structure && result.model_structure.length > 0) {
        setActiveTab(VisualizationType.NETWORK);
      } else {
          setActiveTab(VisualizationType.NONE);
      }

      // Simulate "Pass" condition loosely for demo
      if (!result.error && code.length > moduleData.initialCode.length) {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
        addXp(50);
        completeModule(moduleData.id);
      }
    }
    setIsRunning(false);
  };

  return (
    <div className="h-[calc(100vh-6rem)] flex flex-col lg:flex-row gap-6">
      {/* Left Column: Content */}
      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
        <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="liquid-glass rounded-3xl p-8 mb-6"
        >
          <div className="flex items-center justify-between mb-6">
            <span className="text-xs font-bold uppercase tracking-widest text-accent-blue">{moduleData.difficulty}</span>
            <span className="text-xs text-slate-500">{moduleData.estimatedTime}</span>
          </div>
          <h1 className="text-3xl font-bold mb-6 tracking-tight">{moduleData.title}</h1>
          <div className="prose dark:prose-invert max-w-none">
            <ReactMarkdown
              components={{
                h1: ({node, ...props}) => {
                    const id = props.children?.toString().toLowerCase().replace(/[^\w]+/g, '-') || '';
                    return <h1 id={id} {...props} />
                },
                h2: ({node, ...props}) => {
                    const id = props.children?.toString().toLowerCase().replace(/[^\w]+/g, '-') || '';
                    return <h2 id={id} {...props} />
                },
                h3: ({node, ...props}) => {
                    const id = props.children?.toString().toLowerCase().replace(/[^\w]+/g, '-') || '';
                    return <h3 id={id} {...props} />
                }
              }}
            >
                {moduleData.content}
            </ReactMarkdown>
          </div>
        </motion.div>
      </div>

      {/* Right Column: Playground */}
      <div className="flex-1 flex flex-col gap-4">
        {/* Editor Toolbar */}
        <div className="flex justify-between items-center p-2 liquid-glass rounded-xl">
          <div className="flex gap-2 items-center">
            <div className="flex gap-1.5 px-2 mr-2">
                <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
            </div>
            {/* Data Input Toggle */}
             <button 
                onClick={() => setShowDataInput(!showDataInput)}
                className={`flex items-center gap-1 px-3 py-1 rounded-md text-xs font-medium transition-colors ${showDataInput ? 'bg-accent-blue/20 text-accent-blue' : 'text-slate-500 hover:bg-black/5 dark:hover:bg-white/10'}`}
            >
                <Database size={14} />
                {showDataInput ? 'Hide Data' : 'Input Data'}
            </button>
          </div>
          
          <div className="flex gap-2">
            <button 
                onClick={() => setCode(moduleData.initialCode)}
                className="p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
                title="Reset Code"
            >
                <RotateCcw size={18} />
            </button>
            <button 
                onClick={handleRun}
                disabled={isRunning}
                className="flex items-center gap-2 px-4 py-1.5 bg-accent-blue text-white rounded-lg font-medium shadow-lg shadow-blue-500/30 hover:bg-blue-600 transition-all active:scale-95 disabled:opacity-50 disabled:scale-100"
            >
                <Play size={16} fill="currentColor" />
                {isRunning ? 'Running...' : 'Run'}
            </button>
          </div>
        </div>

        {/* Data Input Area (Collapsible) */}
        <AnimatePresence>
            {showDataInput && (
                <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 100, opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="liquid-glass rounded-xl overflow-hidden"
                >
                    <textarea 
                        value={userData}
                        onChange={(e) => setUserData(e.target.value)}
                        placeholder="Paste text or data here. It will be available as the variable 'user_data' (string) in your Python code."
                        className="w-full h-full bg-transparent p-3 text-sm font-mono focus:outline-none resize-none placeholder:text-slate-400/50"
                    />
                </motion.div>
            )}
        </AnimatePresence>

        {/* Editor Area */}
        <div className="flex-1 min-h-[300px]">
            <CodeEditor code={code} onChange={setCode} />
        </div>

        {/* Output / Visualization Area */}
        <div className="h-[300px] liquid-glass rounded-2xl overflow-hidden flex flex-col">
            <div className="flex border-b border-white/10 px-4">
                {[
                    { id: VisualizationType.NONE, label: 'Terminal' },
                    { id: VisualizationType.NETWORK, label: 'Network' },
                    { id: VisualizationType.TRAINING, label: 'Training' },
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === tab.id ? 'border-accent-blue text-accent-blue' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>
            
            <div className="flex-1 p-4 overflow-auto bg-black/5 dark:bg-black/20 font-mono text-sm">
                {activeTab === VisualizationType.NONE && (
                    <pre className="whitespace-pre-wrap text-slate-700 dark:text-slate-300">
                        {output?.error ? <span className="text-red-500">{output.error}</span> : (output?.stdout || <span className="opacity-40">Ready to execute...</span>)}
                    </pre>
                )}
                {activeTab === VisualizationType.NETWORK && (
                    <NetworkViz layers={output?.model_structure || []} />
                )}
                {activeTab === VisualizationType.TRAINING && (
                    <TrainingCurve data={output?.loss_history || []} />
                )}
            </div>
        </div>
      </div>
    </div>
  );
};