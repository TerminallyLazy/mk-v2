"use client";

import { useState, useEffect } from 'react';
import { Tooltip } from './tooltip';
import { motion, AnimatePresence } from 'framer-motion';

type StatusType = 'active' | 'busy' | 'inactive';

export function GeminiStatus() {
  const [status, setStatus] = useState<StatusType>('inactive');
  const [isHovered, setIsHovered] = useState(false);

  const checkGeminiStatus = async () => {
    try {
      const response = await fetch('/api/ai/status', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      
      if (response.ok) {
        const data = await response.json();
        setStatus(data.status);
      } else {
        setStatus('inactive');
      }
    } catch {
      setStatus('inactive');
    }
  };

  useEffect(() => {
    checkGeminiStatus();
    const interval = setInterval(checkGeminiStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  const statusColors = {
    active: 'bg-green-500 shadow-green-500/50',
    busy: 'bg-yellow-500 shadow-yellow-500/50',
    inactive: 'bg-red-500 shadow-red-500/50'
  };

  const statusMessages = {
    active: 'Gemini API is active',
    busy: 'Gemini API is busy',
    inactive: 'Gemini API is inactive'
  };

  const pulseAnimation = {
    active: {
      scale: [1, 1.2, 1],
      opacity: [0.5, 1, 0.5],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    },
    busy: {
      scale: [1, 1.1, 1],
      opacity: [0.7, 1, 0.7],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut"
      }
    },
    inactive: {
      scale: 1,
      opacity: 0.8,
    }
  };

  return (
    <Tooltip content={statusMessages[status]}>
      <motion.div
        className="relative"
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
      >
        <motion.div
          className={`w-2 h-2 rounded-full ${statusColors[status]} shadow-sm`}
          animate={pulseAnimation[status]}
        />
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              className={`absolute -inset-0.5 rounded-full ${statusColors[status]} opacity-20`}
            />
          )}
        </AnimatePresence>
      </motion.div>
    </Tooltip>
  );
}
