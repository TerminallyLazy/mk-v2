"use client";

import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/app/components/ui/toast";
import { useToast } from "@/app/hooks/use-toast";
import { AnimatePresence, motion } from "framer-motion";
import { Check, AlertCircle, Info, AlertTriangle } from "lucide-react";
import { useEffect, useRef, useCallback } from "react";
import { createNotificationSound, createSuccessSound, createErrorSound } from "@/app/lib/sound-utils";
import { useSettings } from "@/app/contexts/settings-context";
import { NotificationSettings } from "./notification-settings";

export function Toaster() {
  const { toasts } = useToast();
  const previousToastCount = useRef(0);
  const { notificationVolume, notificationsMuted } = useSettings();

  const playSound = useCallback(async (variant?: string) => {
    if (notificationsMuted || notificationVolume === 0) return;

    try {
      switch (variant) {
        case 'success':
          const successSound = createSuccessSound();
          await successSound?.play(notificationVolume * 0.8);
          break;
        case 'destructive':
          const errorSound = createErrorSound();
          await errorSound?.play(notificationVolume);
          break;
        case 'warning':
          const warningSound = createNotificationSound('warning');
          await warningSound?.play(notificationVolume * 0.9);
          break;
        case 'info':
          const infoSound = createNotificationSound('info');
          await infoSound?.play(notificationVolume * 0.7);
          break;
        default:
          const defaultSound = createNotificationSound('info');
          await defaultSound?.play(notificationVolume * 0.6);
      }
    } catch (error) {
      console.error('Error playing sound:', error);
    }
  }, [notificationVolume, notificationsMuted]);

  useEffect(() => {
    if (toasts.length > previousToastCount.current) {
      const latestToast = toasts[0];
      playSound(latestToast.variant ?? 'default');
    }
    previousToastCount.current = toasts.length;
  }, [toasts, playSound]);

  return (
    <ToastProvider>
      <div className="fixed top-4 right-4 z-[100] flex items-center gap-2">
        <NotificationSettings isOpen={false} translate={function (en: string, es: string): string {
          throw new Error("Function not implemented.");
        } } />
      </div>
      <AnimatePresence mode="popLayout">
        {toasts.map(function ({ id, variant, title, description, action, ...props }) {
          const Icon = variant === 'success' ? Check
            : variant === 'destructive' ? AlertCircle
            : variant === 'warning' ? AlertTriangle
            : variant === 'info' ? Info
            : undefined;

          return (
            <Toast 
              key={id} 
              {...props} 
              variant={variant} 
              asChild
              role={variant === 'destructive' ? 'alert' : 'status'}
              aria-live={variant === 'destructive' ? 'assertive' : 'polite'}
            >
              <motion.div
                layout
                initial={{ opacity: 0, y: 50, scale: 0.3 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.5 }}
                transition={{
                  type: "spring",
                  stiffness: 500,
                  damping: 30,
                }}
                className="relative"
              >
                <motion.div
                  initial={{ x: -10, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  className="flex gap-3"
                >
                  {Icon && (
                    <Icon 
                      className={
                        variant === 'success' ? "h-5 w-5 text-green-600 dark:text-green-400"
                        : variant === 'destructive' ? "h-5 w-5 text-destructive"
                        : variant === 'warning' ? "h-5 w-5 text-yellow-600 dark:text-yellow-400"
                        : variant === 'info' ? "h-5 w-5 text-blue-600 dark:text-blue-400"
                        : "h-5 w-5"
                      }
                      aria-hidden="true"
                    />
                  )}
                  <div className="grid gap-1">
                    {title && (
                      <ToastTitle className="flex items-center gap-2">
                        {title}
                      </ToastTitle>
                    )}
                    {description && (
                      <ToastDescription>{description}</ToastDescription>
                    )}
                  </div>
                </motion.div>
                {action}
                <ToastClose 
                  className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity"
                />
                
                {/* Progress bar */}
                <motion.div
                  initial={{ scaleX: 1 }}
                  animate={{ scaleX: 0 }}
                  transition={{ duration: (props.duration || 5000) / 1000, ease: "linear" }}
                  className={`absolute bottom-0 left-0 right-0 h-1 origin-left ${
                    variant === 'success' ? "bg-green-500/20"
                    : variant === 'destructive' ? "bg-destructive/20"
                    : variant === 'warning' ? "bg-yellow-500/20"
                    : variant === 'info' ? "bg-blue-500/20"
                    : "bg-primary/20"
                  }`}
                />
              </motion.div>
            </Toast>
          );
        })}
      </AnimatePresence>
      <ToastViewport className="gap-2 pt-12" /> {/* Added pt-12 to account for NotificationSettings */}
    </ToastProvider>
  );
}
