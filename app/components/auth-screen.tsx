"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";

interface AuthScreenProps {
  onComplete: (username: string) => void;
  translate: (en: string, es: string) => string;
}

export function AuthScreen({ onComplete, translate }: AuthScreenProps) {
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) {
      setError(translate('Please enter your name', 'Por favor ingresa tu nombre'));
      return;
    }
    
    // Save username to localStorage
    localStorage.setItem('username', username.trim());
    onComplete(username.trim());
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen flex items-center justify-center p-4 bg-background"
    >
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">
            {translate('Welcome to MomsKidz!', '¡Bienvenida a MomsKidz!')}
          </CardTitle>
          <CardDescription className="text-center">
            {translate(
              'Please enter your name to get started',
              'Por favor ingresa tu nombre para comenzar'
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Input
                type="text"
                placeholder={translate('Your name', 'Tu nombre')}
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  setError('');
                }}
                className="w-full"
              />
              {error && (
                <p className="text-sm text-destructive">
                  {error}
                </p>
              )}
            </div>
            <Button type="submit" className="w-full">
              {translate('Continue', 'Continuar')}
            </Button>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
} 