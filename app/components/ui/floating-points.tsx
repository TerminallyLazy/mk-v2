"use client";

import { useState, useEffect } from 'react';
import { Button } from './button';
import { motion } from 'framer-motion';

interface FloatingPointsProps {
  points: number;
}

export function FloatingPoints({ points }: FloatingPointsProps) {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    setIsAnimating(true);
    const timer = setTimeout(() => setIsAnimating(false), 500);
    return () => clearTimeout(timer);
  }, [points]);

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed right-8 top-[10rem] z-50"
    >
      <Button
        variant="default"
        className="gap-1 whitespace-nowrap text-sm font-medium w-12 h-12 flex flex-col items-center justify-center rounded-md transition-all duration-300"
      >
        <span className="text-[10px] font-medium text-primary-foreground/80 -mb-2">
          Points
        </span>
        <motion.span
          key={points}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-lg font-bold text-center -mt-1 text-primary-foreground"
        >
          {points}
        </motion.span>
      </Button>
    </motion.div>
  );
}
