"use client";

import React, { useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from './card';
import { cn } from "@/lib/utils";
import { getMessageTypeStyles } from "@/lib/utils";
import { useState } from 'react';
import { MapPin, Navigation } from 'lucide-react';
import { Button } from './button';
import type { ReactNode } from 'react';

interface ChatMessageProps {
  role: 'user' | 'assistant';
  content: string;
  images?: string[];
  translate: (en: string, es: string) => string;
  type?: string;
  location?: {
    lat: number;
    lng: number;
  };
  onImageLoad?: () => void;
}

interface Location {
  lat: number;
  lng: number;
  name: string;
  address?: string;
}

interface Coordinates {
  lat: number;
  lng: number;
}

interface MessageData {
  locations?: Location[];
  center?: Coordinates;
  text?: string;
}

interface MarkdownComponentProps {
  children: ReactNode;
  className?: string;
}

export function ChatMessage({ role, content, images = [], translate, type, location, onImageLoad }: ChatMessageProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  // Handle keyboard events for the image modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedImage) {
        if (e.key === 'Escape') {
          setSelectedImage(null);
        } else if ((e.key === 'ArrowLeft' || e.key === 'ArrowRight') && images?.length > 0) {
          const currentIndex = images.indexOf(selectedImage);
          if (e.key === 'ArrowLeft') {
            const prevIndex = currentIndex > 0 ? currentIndex - 1 : images.length - 1;
            setSelectedImage(images[prevIndex]);
          } else {
            const nextIndex = currentIndex < images.length - 1 ? currentIndex + 1 : 0;
            setSelectedImage(images[nextIndex]);
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedImage, images]);

  useEffect(() => {
    // Get user's location if this is a location-based query
    if (type === 'location' && 'geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.error('Error getting location:', error);
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        }
      );
    }
  }, [type]);

  // Function to calculate distance between two points
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2); 
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    const d = R * c; // Distance in km
    return d;
  };

  const deg2rad = (deg: number) => {
    return deg * (Math.PI/180);
  };

  // Render location-based content
  const renderLocationContent = (data: any) => {
    if (!data?.locations?.length) return null;

    return (
      <div className="mt-4 space-y-4">
        {data.locations.map((location: any, index: number) => {
          const distance = userLocation 
            ? calculateDistance(
                userLocation.lat, 
                userLocation.lng, 
                location.lat, 
                location.lng
              ).toFixed(1)
            : null;

          return (
            <div key={index} className="flex items-start gap-3 p-3 bg-muted rounded-lg">
              <MapPin className="w-5 h-5 text-primary mt-1" />
              <div className="flex-1">
                <h3 className="font-medium">{location.name}</h3>
                {location.address && (
                  <p className="text-sm text-muted-foreground">{location.address}</p>
                )}
                <div className="flex items-center gap-4 mt-2 text-sm">
                  {distance && (
                    <span className="flex items-center gap-1">
                      <Navigation className="w-4 h-4" />
                      {distance}km away
                    </span>
                  )}
                  {location.openNow !== undefined && (
                    <span className={location.openNow ? 'text-green-500' : 'text-red-500'}>
                      {location.openNow ? 'Open' : 'Closed'}
                    </span>
                  )}
                  {location.rating && (
                    <span className="flex items-center gap-1">
                      ★ {location.rating}
                    </span>
                  )}
                </div>
                <Button
                  variant="link"
                  size="sm"
                  className="mt-2 p-0 h-auto"
                  onClick={() => window.open(
                    `https://www.google.com/maps/dir/?api=1&destination=${location.lat},${location.lng}`,
                    '_blank'
                  )}
                >
                  {translate("Get Directions", "Obtener Direcciones")}
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`mb-4 ${role === 'assistant' ? 'ml-4' : 'mr-4'}`}
    >
      <Card 
        className={cn(
          "p-4",
          role === 'assistant' 
            ? getMessageTypeStyles(type)
            : 'bg-muted border-muted-foreground/20',
          "transition-colors duration-200 hover:shadow-md"
        )}
      >
        <div className="flex items-start gap-3">
          <div className="flex-grow space-y-2">
            <div className="flex items-center justify-between">
              <div className="font-semibold text-sm text-foreground/80 flex items-center gap-2">
                {role === 'assistant' ? translate('AI Assistant', 'Asistente IA') : translate('You', 'Tú')}
                {type && type !== 'error' && (
                  <span className="px-2 py-0.5 rounded-full text-xs bg-primary/20 text-primary">
                    {type}
                  </span>
                )}
              </div>
              {role === 'assistant' && type === 'error' && (
                <span className="text-xs text-destructive">Error</span>
              )}
            </div>
            
            <div className="prose prose-sm dark:prose-invert max-w-none">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw]}
                components={{
                  pre: ({ children, ...props }) => (
                    <pre {...props} className="bg-muted p-4 rounded-lg overflow-x-auto font-mono text-sm">
                      {children}
                    </pre>
                  ),
                  p: ({ children, ...props }) => (
                    <p {...props} className="mb-2 last:mb-0 leading-relaxed">
                      {children}
                    </p>
                  ),
                  ul: ({ children, ...props }) => (
                    <ul {...props} className="list-disc pl-4 mb-2 space-y-1">
                      {children}
                    </ul>
                  ),
                  ol: ({ children, ...props }) => (
                    <ol {...props} className="list-decimal pl-4 mb-2 space-y-1">
                      {children}
                    </ol>
                  ),
                  blockquote: ({ children, ...props }) => (
                    <blockquote {...props} className="border-l-4 border-primary/50 pl-4 italic my-2">
                      {children}
                    </blockquote>
                  )
                }}
              >
                {content}
              </ReactMarkdown>
            </div>

            {images && images.length > 0 && (
              <div className="grid grid-cols-2 gap-2 mt-4">
                {images.map((image, index) => (
                  <motion.div 
                    key={index} 
                    className="relative aspect-square rounded-lg overflow-hidden cursor-pointer"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.2 }}
                    onClick={() => setSelectedImage(image)}
                  >
                    <Image
                      src={image}
                      alt={`Chat image ${index + 1}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 50vw, 33vw"
                      onLoad={onImageLoad}
                    />
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </Card>

      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
            role="dialog"
            aria-modal="true"
            aria-label="Image preview"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="relative max-w-3xl max-h-[80vh] rounded-lg overflow-hidden"
              onClick={e => e.stopPropagation()}
            >
              <div className="absolute top-4 right-4 flex gap-2">
                {images && images.length > 1 && (
                  <div className="flex gap-2 bg-background/50 rounded-full p-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        const currentIndex = images.indexOf(selectedImage);
                        const prevIndex = currentIndex > 0 ? currentIndex - 1 : images.length - 1;
                        setSelectedImage(images[prevIndex]);
                      }}
                      className="p-2 rounded-full hover:bg-background/80 transition-colors"
                      aria-label="Previous image"
                    >
                      ←
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        const currentIndex = images.indexOf(selectedImage);
                        const nextIndex = currentIndex < images.length - 1 ? currentIndex + 1 : 0;
                        setSelectedImage(images[nextIndex]);
                      }}
                      className="p-2 rounded-full hover:bg-background/80 transition-colors"
                      aria-label="Next image"
                    >
                      →
                    </button>
                  </div>
                )}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedImage(null);
                  }}
                  className="p-2 rounded-full bg-background/50 hover:bg-background/80 transition-colors"
                  aria-label="Close image preview"
                >
                  ×
                </button>
              </div>
              <Image
                src={selectedImage}
                alt="Enlarged image"
                width={800}
                height={600}
                className="object-contain"
                priority
              />
              {images && images.length > 1 && (
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-background/50 rounded-full px-3 py-1">
                  {`${images.indexOf(selectedImage) + 1} / ${images.length}`}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
