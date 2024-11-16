"use client";

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX, Volume1, Volume } from 'lucide-react';
import { Slider } from "@/app/components/ui/slider";
import { Button } from "@/app/components/ui/button";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

type VolumeIconType = typeof Volume2 | typeof VolumeX | typeof Volume1 | typeof Volume;

interface NotificationSettingsProps {
  isOpen: boolean;
  onClose?: () => void;
  translate: (en: string, es: string) => string;
}

export function NotificationSettings({ 
  isOpen, 
  onClose = () => {},
  translate 
}: NotificationSettingsProps) {
  const [notificationVolume, setNotificationVolume] = useState(50);
  const [isMuted, setIsMuted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleVolumeChange = useCallback(async (value: number[]) => {
    const newVolume = value[0];
    setNotificationVolume(newVolume);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 100));
    } catch (error) {
      console.error('Error changing volume:', error);
    }
  }, []);

  const toggleMute = useCallback(() => {
    setIsMuted(prev => !prev);
    if (!isMuted) {
      setNotificationVolume(0);
    }
  }, [isMuted]);

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && typeof onClose === 'function') {
        onClose();
      }
    };

    if (isOpen) {
      window.addEventListener('keydown', handleKeyPress);
      return () => window.removeEventListener('keydown', handleKeyPress);
    }
  }, [isOpen, onClose]);

  const VolumeIcon: VolumeIconType = isMuted || notificationVolume === 0
    ? VolumeX
    : notificationVolume > 50
    ? Volume2
    : notificationVolume > 25
    ? Volume1
    : Volume;

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        ref={containerRef}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm"
      >
        <div className="bg-card p-6 rounded-lg shadow-lg w-full max-w-md">
          <h2 className="text-xl font-semibold mb-4">
            {translate("Notification Settings", "Configuración de Notificaciones")}
          </h2>
          
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleMute}
                className={cn(
                  "p-2",
                  isMuted && "text-destructive"
                )}
              >
                <VolumeIcon className="h-6 w-6" />
              </Button>
              
              <Slider
                value={[notificationVolume]}
                min={0}
                max={100}
                step={1}
                onValueChange={handleVolumeChange}
                className="flex-1"
              />
            </div>
            
            <div className="flex justify-end gap-2">
              <Button 
                variant="outline" 
                onClick={onClose}
                className="hover:bg-secondary/80"
              >
                {translate("Close", "Cerrar")}
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
