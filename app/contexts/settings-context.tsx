"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';

interface SettingsContextType {
  notificationVolume: number;
  setNotificationVolume: (volume: number) => void;
  notificationsMuted: boolean;
  setNotificationsMuted: (muted: boolean) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [notificationVolume, setNotificationVolume] = useState(0.5);
  const [notificationsMuted, setNotificationsMuted] = useState(false);

  // Load settings from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedVolume = localStorage.getItem('notificationVolume');
      const savedMuted = localStorage.getItem('notificationsMuted');
      
      if (savedVolume) setNotificationVolume(parseFloat(savedVolume));
      if (savedMuted) setNotificationsMuted(savedMuted === 'true');
    }
  }, []);

  // Save settings to localStorage when they change
  useEffect(() => {
    localStorage.setItem('notificationVolume', notificationVolume.toString());
    localStorage.setItem('notificationsMuted', notificationsMuted.toString());
  }, [notificationVolume, notificationsMuted]);

  return (
    <SettingsContext.Provider 
      value={{ 
        notificationVolume, 
        setNotificationVolume,
        notificationsMuted,
        setNotificationsMuted
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}