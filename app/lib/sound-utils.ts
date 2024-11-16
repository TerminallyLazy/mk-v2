"use client";

export function createNotificationSound(type: 'success' | 'error' | 'warning' | 'info' = 'success') {
  if (typeof window === 'undefined') return null;
  
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  
  const soundConfigs = {
    success: {
      frequency: 1046.50, // C6
      duration: 0.1,
      type: 'sine'
    },
    error: {
      frequency: 220.00, // A3
      duration: 0.2,
      type: 'triangle'
    },
    warning: {
      frequency: 440.00, // A4
      duration: 0.15,
      type: 'square'
    },
    info: {
      frequency: 523.25, // C5
      duration: 0.1,
      type: 'sine'
    }
  };

  const config = soundConfigs[type];
  
  return {
    play: (volume = 0.1) => {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.type = config.type as OscillatorType;
      oscillator.frequency.value = config.frequency;
      
      gainNode.gain.setValueAtTime(0, audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(volume, audioContext.currentTime + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + config.duration);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + config.duration);
      
      return new Promise(resolve => {
        setTimeout(resolve, config.duration * 1000);
      });
    }
  };
}

export function createSuccessSound() {
  if (typeof window === 'undefined') return null;
  
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  
  return {
    play: async (volume = 0.1) => {
      // Play two tones in sequence
      const sound1 = createNotificationSound('success');
      const sound2 = createNotificationSound('info');
      
      if (sound1 && sound2) {
        await sound1.play(volume);
        await new Promise(resolve => setTimeout(resolve, 50));
        await sound2.play(volume);
      }
    }
  };
}

export function createErrorSound() {
  if (typeof window === 'undefined') return null;
  
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  
  return {
    play: async (volume = 0.1) => {
      // Play two tones in sequence
      const sound1 = createNotificationSound('error');
      const sound2 = createNotificationSound('warning');
      
      if (sound1 && sound2) {
        await sound1.play(volume);
        await new Promise(resolve => setTimeout(resolve, 50));
        await sound2.play(volume * 0.8);
      }
    }
  };
}