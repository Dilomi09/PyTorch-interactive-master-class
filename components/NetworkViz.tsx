import React from 'react';
import { motion } from 'framer-motion';
import { ModelLayer } from '../types';

interface NetworkVizProps {
  layers: ModelLayer[];
}

export const NetworkViz: React.FC<NetworkVizProps> = ({ layers }) => {
  if (!layers || layers.length === 0) return <div className="text-center text-gray-400 mt-10">Define a model to see structure</div>;

  return (
    <div className="flex flex-col items-center justify-center h-full gap-4 p-4 overflow-auto">
      {layers.map((layer, index) => (
        <React.Fragment key={index}>
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="relative p-3 min-w-[120px] text-center rounded-lg liquid-glass border-l-4 border-l-accent-blue"
          >
            <div className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">{layer.type}</div>
            <div className="text-sm font-mono mt-1">{layer.params}</div>
          </motion.div>
          
          {index < layers.length - 1 && (
            <motion.div 
              initial={{ height: 0 }}
              animate={{ height: 20 }}
              className="w-0.5 bg-gradient-to-b from-accent-blue to-purple-500 opacity-50"
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};