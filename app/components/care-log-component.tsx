'use client'

import React, { useState, useEffect } from 'react'
import { Button } from "@/app/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card"
import { Input } from "@/app/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs"
import { ScrollArea } from "@/app/components/ui/scroll-area"
import { Camera, CloudSun, Calendar, Clock } from 'lucide-react'
import Image from 'next/image'
import { X } from 'lucide-react'

interface CareLogComponentProps {
  addPoints?: (amount: number) => void;
  translate?: (en: string, es: string) => string;
}

interface LogEntry {
  id: number;
  childName: string;
  note: string;
  date: string;
  weather: string;
}

export function CareLogComponentComponent({ addPoints, translate: propTranslate }: CareLogComponentProps) {
  const [note, setNote] = useState('')
  const [weather, setWeather] = useState('')
  const [activeChild, setActiveChild] = useState('Billie')
  const [logEntries, setLogEntries] = useState<LogEntry[]>([])
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Provide a default translate function if none is passed
  const translate = React.useMemo(

    () => propTranslate || ((en: string) => en),

    [propTranslate]

  );

  useEffect(() => {
    fetch('https://api.weather.gov/points/40.7128,-74.0060')
      .then(response => response.json())
      .then(data => {
        return fetch(data.properties.forecast);
      })
      .then(response => response.json())
      .then(data => {
        const currentWeather = data.properties.periods[0].shortForecast;
        setWeather(currentWeather);
      })
      .catch(error => {
        console.error('Error fetching weather:', error);
        setWeather(translate('Weather data unavailable', 'Datos del clima no disponibles'));
      });
  }, [translate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newEntry: LogEntry = {
      id: Date.now(),
      childName: activeChild,
      note: note,
      date: new Date().toLocaleString(),
      weather: weather
    }
    setLogEntries([newEntry, ...logEntries])
    setNote('')
    if (addPoints) {
      addPoints(5)
    }
  }

  const children = ['Billie', 'Megan']

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Card className="p-2 sm:p-4">
      <CardHeader>
        <CardTitle className="text-lg sm:text-xl">{translate("Care Log", "Registro de Cuidados")}</CardTitle>
        <CardDescription className="text-sm sm:text-base">
          {translate("Record health events and observations", "Registra eventos de salud y observaciones")}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeChild} onValueChange={setActiveChild}>
          <TabsList>
            {children.map((child) => (
              <TabsTrigger key={child} value={child}>
                {child}
              </TabsTrigger>
            ))}
          </TabsList>
          {children.map((child) => (
            <TabsContent key={child} value={child}>
              <form onSubmit={handleSubmit} className="space-y-4 mb-4">
                <Input 
                  placeholder={translate(`Describe ${child}'s health event...`, `Describe el evento de salud de ${child}...`)}
                  value={note} 
                  onChange={(e) => setNote(e.target.value)}
                />
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <CloudSun className="h-4 w-4" />
                  <span>{translate("Current weather:", "Clima actual:")} {translate(weather, weather)}</span>
                </div>
                <div className="flex space-x-2">
                  <Button 
                    onClick={() => document.getElementById('care-log-photo')?.click()} 
                    variant="outline"
                    className="bg-background dark:bg-background"
                  >
                    <Camera className="h-4 w-4 mr-2" />
                    Add Photo
                  </Button>
                  <input
                    id="care-log-photo"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                  <Button type="submit">{translate("Save Note", "Guardar Nota")}</Button>
                </div>
              </form>
              <ScrollArea className="h-[300px] w-full rounded-md border p-4">
                {logEntries.filter(entry => entry.childName === child).map((entry) => (
                  <Card 
                    key={entry.id} 
                    className="bg-card dark:bg-card border-border mb-4 hover:bg-accent/50 dark:hover:bg-accent/50 transition-duration-200"
                  >
                    <CardContent className="p-4">
                      <div className="text-card-foreground dark:text-card-foreground">
                        {entry.note}
                      </div>
                      <div className="text-sm text-muted-foreground mt-2 flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        {entry.date}
                        <Clock className="h-3 w-3 ml-2 mr-1" />
                        {entry.weather}
                        {entry.weather && (
                          <span className="ml-2 flex items-center">
                            <CloudSun className="h-3 w-3 mr-1" />
                            {entry.weather}
                          </span>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </ScrollArea>
              {imagePreview && (
                <div className="mt-4">
                  <Image
                    src={imagePreview}
                    alt="Selected"
                    width={200}
                    height={200}
                    className="rounded-md object-cover"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSelectedImage(null);
                      setImagePreview(null);
                    }}
                    className="mt-2"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Remove Image
                  </Button>
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  )
}