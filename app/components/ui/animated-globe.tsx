"use client";

import { motion } from 'framer-motion';

interface AnimatedGlobeProps {
  isSpanish: boolean;
}

export function AnimatedGlobe({ isSpanish }: AnimatedGlobeProps) {
  return (
    <div className="relative flex items-center gap-2">
      <motion.div
        className="relative w-5 h-5"
        animate={{ rotate: 360 }}
        transition={{
          rotate: {
            duration: 8,
            repeat: Infinity,
            ease: "linear"
          }
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-full h-full"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
          <path d="M2 12h20" />
        </svg>
      </motion.div>
      <span className="text-sm font-medium">{isSpanish ? 'ES' : 'EN'}</span>
    </div>
  );
}
