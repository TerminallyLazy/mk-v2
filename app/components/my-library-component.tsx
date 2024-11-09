'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card"
import { Button } from "@/app/components/ui/button"
import { Input } from "@/app/components/ui/input"
import { ScrollArea } from "@/app/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/app/components/ui/dialog"
import { Plus, Trash2, Send, Calendar, Clock, Share2, FileUp, CloudSun, FileText } from 'lucide-react'
import { jsPDF } from "jspdf";

interface MyLibraryComponentps {
  translate?: (en: string, es: string) => string;
}

interface WeatherStamp {
  temperature: number;
  condition: string;
}

interface LibraryItem {
  id: number;
  title: string;
  content: string;
  section: string;
  date: string;
  time: string;
  tags: string[];
  weatherStamp?: WeatherStamp;
}

export function MyLibraryComponentComponent({ translate: propTranslate }: MyLibraryComponentps) {
  const translate = propTranslate || ((en: string) => en);
  const [isClient, setIsClient] = useState(false);

  // Create a deterministic weather generator
  const generateWeatherStamp = (date: string): WeatherStamp => {
    // Use the date string to generate consistent weather
    const dateNum = new Date(date).getTime();
    const dayOfYear = Math.floor((dateNum - new Date(new Date(date).getFullYear(), 0, 0).getTime()) / 1000 / 60 / 60 / 24);
    
    const conditions = ['Sunny', 'Cloudy', 'Rainy', 'Windy'];
    const conditionIndex = dayOfYear % conditions.length;
    
    return {
      temperature: 20 + (dayOfYear % 15), // Temperature between 20-35
      condition: conditions[conditionIndex]
    };
  };

  // Initialize items with weather stamps
  const initialItems = [
    { id: 1, title: "Billie's Fever", content: "Billie had a fever of 101°F. Gave acetaminophen and monitored throughout the night. Fever broke by morning.", section: "Billie's Care Log", date: "2023-05-15", time: "20:30", tags: ["fever", "medication"], weatherStamp: generateWeatherStamp("2023-05-15") },
    { id: 2, title: "Billie's Rash", content: "Noticed a small rash on Billie's arm. Applied hydrocortisone cream. Will monitor for changes.", section: "Billie's Care Log", date: "2023-05-20", time: "10:15", tags: ["rash", "skin"], weatherStamp: generateWeatherStamp("2023-05-20") },
    { id: 3, title: "Billie's First Steps", content: "Billie took his first steps today! He managed to walk three steps before sitting down.", section: "Billie's Care Log", date: "2023-06-01", time: "18:45", tags: ["milestone", "walking"], weatherStamp: generateWeatherStamp("2023-06-01") },
    { id: 4, title: "Billie's Teething", content: "Billie seems to be teething. Gums are swollen and he's drooling more than usual. Using teething ring for relief.", section: "Billie's Care Log", date: "2023-06-10", time: "14:20", tags: ["teething", "discomfort"], weatherStamp: generateWeatherStamp("2023-06-10") },
    { id: 5, title: "Megan's Vaccination", content: "Megan received her MMR vaccine. No immediate side effects observed. Will monitor for the next 48 hours.", section: "Megan's Care Log", date: "2023-06-01", time: "14:15", tags: ["vaccination", "MMR"], weatherStamp: generateWeatherStamp("2023-06-01") },
    { id: 6, title: "Megan's Allergic Reaction", content: "Megan developed a mild rash after eating strawberries. Administered antihistamine. Will avoid strawberries in the future.", section: "Megan's Care Log", date: "2023-06-15", time: "19:30", tags: ["allergy", "food"], weatherStamp: generateWeatherStamp("2023-06-15") },
    { id: 7, title: "Megan's Sleep Regression", content: "Megan has been waking up multiple times at night. Trying adjusted bedtime routine to help her sleep through the night.", section: "Megan's Care Log", date: "2023-06-20", time: "22:00", tags: ["sleep", "routine"], weatherStamp: generateWeatherStamp("2023-06-20") },
    { id: 8, title: "Megan's First Words", content: "Megan said her first word today: 'Mama'! She's been babbling more frequently lately.", section: "Megan's Care Log", date: "2023-06-25", time: "09:10", tags: ["milestone", "language"], weatherStamp: generateWeatherStamp("2023-06-25") },
    { id: 9, title: "Fever Management", content: "Q&A about managing child fevers. Key points: stay hydrated, rest, when to call the doctor.", section: "Q&A", date: "2023-05-20", time: "10:00", tags: ["fever", "health tips"], weatherStamp: generateWeatherStamp("2023-05-20") },
    { id: 10, title: "Picky Eating Strategies", content: "Q&A session on dealing with picky eaters. Suggestions include involving kids in meal prep and offering variety.", section: "Q&A", date: "2023-06-05", time: "15:30", tags: ["nutrition", "behavior"], weatherStamp: generateWeatherStamp("2023-06-05") },
    { id: 11, title: "Potty Training Tips", content: "Q&A on effective potty training methods. Discussed consistency, positive reinforcement, and patience.", section: "Q&A", date: "2023-06-18", time: "11:45", tags: ["potty training", "development"], weatherStamp: generateWeatherStamp("2023-06-18") },
    { id: 12, title: "Sibling Rivalry Management", content: "Q&A about managing sibling rivalry. Strategies include individual attention and promoting cooperation.", section: "Q&A", date: "2023-06-30", time: "14:00", tags: ["behavior", "siblings"], weatherStamp: generateWeatherStamp("2023-06-30") },
    { id: 13, title: "Sleep Training Podcast", content: "Notes from sleep training podcast episode. Discussed cry-it-out method, gradual retreat, and bedtime routines.", section: "Podcasts", date: "2023-06-10", time: "22:00", tags: ["sleep training", "podcast"], weatherStamp: generateWeatherStamp("2023-06-10") },
    { id: 14, title: "Nutrition for Toddlers Podcast", content: "Podcast notes on balanced diets for toddlers. Covered importance of variety, portion sizes, and dealing with food refusal.", section: "Podcasts", date: "2023-06-20", time: "20:30", tags: ["nutrition", "podcast"], weatherStamp: generateWeatherStamp("2023-06-20") },
    { id: 15, title: "Positive Discipline Podcast", content: "Podcast discussing positive discipline techniques. Emphasized consistency, clear communication, and natural consequences.", section: "Podcasts", date: "2023-07-01", time: "19:15", tags: ["discipline", "podcast"], weatherStamp: generateWeatherStamp("2023-07-01") },
    { id: 16, title: "Early Childhood Education Podcast", content: "Podcast on the importance of early childhood education. Discussed various learning styles and at-home activities.", section: "Podcasts", date: "2023-07-10", time: "21:00", tags: ["education", "podcast"], weatherStamp: generateWeatherStamp("2023-07-10") },
    { id: 17, title: "Billie's Check-up", content: "Prepare questions about Billie's recent fever and sleep patterns. Don't forget to bring vaccination records.", section: "Doctor's Notes", date: "2023-07-01", time: "09:30", tags: ["check-up", "questions"], weatherStamp: generateWeatherStamp("2023-07-01") },
    { id: 18, title: "Megan's Allergy Consult", content: "Appointment for Megan's allergy testing. Bring food diary and list of observed reactions.", section: "Doctor's Notes", date: "2023-07-15", time: "14:00", tags: ["allergy", "testing"], weatherStamp: generateWeatherStamp("2023-07-15") },
    { id: 19, title: "Billie's Dental Visit", content: "First dental check-up for Billie. Questions about teething and proper oral care for toddlers.", section: "Doctor's Notes", date: "2023-07-20", time: "11:00", tags: ["dental", "oral health"], weatherStamp: generateWeatherStamp("2023-07-20") },
    { id: 20, title: "Family Flu Shots", content: "Schedule flu shots for the whole family. Check if any new vaccinations are recommended.", section: "Doctor's Notes", date: "2023-08-01", time: "10:00", tags: ["vaccination", "preventive care"], weatherStamp: generateWeatherStamp("2023-08-01") },
  ];

  const [libraryItems, setLibraryItems] = useState<LibraryItem[]>(initialItems);
  const [newItem, setNewItem] = useState({ title: '', content: '', date: '', time: '', tags: [] });
  const [activeSection, setActiveSection] = useState("Billie's Care Log");

  useEffect(() => {
    setIsClient(true);
  }, []);

  const addItem = () => {
    if (newItem.title && newItem.content && newItem.date) {
      const weatherStamp = generateWeatherStamp(newItem.date);
      setLibraryItems(prev => [...prev, { 
        id: Date.now(), 
        ...newItem, 
        section: activeSection, 
        weatherStamp 
      }]);
      setNewItem({ title: '', content: '', date: '', time: '', tags: [] });
    }
  };

  // Only render after client-side hydration is complete
  if (!isClient) {
    return null; // or a loading state
  }

  const removeItem = (id: number) => {
    setLibraryItems(libraryItems.filter(item => item.id !== id))
  }

  const shareItem = async (item: LibraryItem) => {
    try {
      // Create share text
      const shareText = `
${item.title}
Date: ${item.date}
Time: ${item.time}
${item.weatherStamp ? `Weather: ${item.weatherStamp.temperature}°C, ${item.weatherStamp.condition}\n` : ''}
Tags: ${item.tags.join(', ')}

${item.content}`;

      // Check if Web Share API is supported
      if (navigator.share) {
        await navigator.share({
          title: item.title,
          text: shareText,
        });
      } else {
        // Fallback to clipboard copy if Web Share API is not available
        await navigator.clipboard.writeText(shareText);
        alert('Content copied to clipboard!');
      }
    } catch (error) {
      console.error('Error sharing:', error);
      alert('Failed to share content. Please try again.');
    }
  };

  const createPDF = (item: LibraryItem) => {
    try {
      // Initialize PDF document
      const doc = new jsPDF();
      
      // Set font size and styles
      doc.setFontSize(20);
      doc.text(item.title, 20, 20);
      
      doc.setFontSize(12);
      doc.text(`Date: ${item.date}`, 20, 30);
      doc.text(`Time: ${item.time}`, 20, 37);
      
      if (item.weatherStamp) {
        doc.text(
          `Weather: ${item.weatherStamp.temperature}°C, ${item.weatherStamp.condition}`, 
          20, 
          44
        );
      }
      
      doc.text(`Tags: ${item.tags.join(', ')}`, 20, 51);
      
      // Add content with word wrap
      const splitContent = doc.splitTextToSize(item.content, 170);
      doc.text(splitContent, 20, 65);
      
      // Save the PDF
      doc.save(`${item.title.replace(/\s+/g, '_')}.pdf`);
    } catch (error) {
      console.error('Error creating PDF:', error);
      alert('Failed to create PDF. Please try again.');
    }
  };

  const sections = ["Billie's Care Log", "Megan's Care Log", "Q&A", "Podcasts", "Doctor's Notes"]
  return (
    <Card className="w-full max-w-4xl mx-auto bg-card dark:bg-card border-border">
      <CardHeader>
        <CardTitle className="text-card-foreground">
          {translate("My Library", "Mi Biblioteca")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="mb-4 text-muted-foreground">
          {translate("Manage your files.", "Administra tus archivos.")}
        </p>

        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 mb-4">
          <Input
            placeholder={translate("File Title", "Título del Archivo")}
            value={newItem.title}
            onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
            className="flex-grow bg-background dark:bg-background text-foreground border-input"
          />
          <Input
            placeholder={translate("Content", "Contenido")}
            value={newItem.content}
            onChange={(e) => setNewItem({ ...newItem, content: e.target.value })}
            className="flex-grow bg-background dark:bg-background text-foreground border-input"
          />
          <Input
            type="date"
            value={newItem.date}
            onChange={(e) => setNewItem({ ...newItem, date: e.target.value })}
            className="flex-grow bg-background dark:bg-background text-foreground border-input"
          />
          <Input
            type="time"
            value={newItem.time}
            onChange={(e) => setNewItem({ ...newItem, time: e.target.value })}
            className="flex-grow bg-background dark:bg-background text-foreground border-input"
          />
          <Button onClick={addItem} className="w-full sm:w-auto bg-purple-700 hover:bg-purple-800 text-white">
            <Plus className="h-4 w-4 mr-2" />
            {translate("Add", "Añadir")}
          </Button>
        </div>

        <Tabs defaultValue="Billie's Care Log" className="w-full">
          <TabsList className="flex space-x-2 mb-4 overflow-x-auto bg-muted dark:bg-muted">
            {sections.map((section) => (
              <TabsTrigger
                key={section}
                value={section}
                onClick={() => setActiveSection(section)}
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                {translate(section, section)}
              </TabsTrigger>
            ))}
          </TabsList>
          {sections.map((section) => (
            <TabsContent key={section} value={section}>
              <ScrollArea className="h-[400px] w-full border-border rounded-md p-4 bg-card dark:bg-card">
                {libraryItems.filter(item => item.section === section).map(item => (
                  <div key={item.id} className="flex items-center justify-between mb-2 hover:bg-accent/50 dark:hover:bg-accent/50 transition-colors duration-200">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" className="w-full justify-start mr-2 py-2 px-3 h-auto text-left bg-background dark:bg-background text-foreground">
                          <div className="flex items-center w-full">
                            <FileText className="h-4 w-4 mr-2 flex-shrink-0" />
                            <div className="text-left flex-grow">
                              <div className="font-semibold">{item.title}</div>
                              <div className="text-sm text-gray-500 flex items-center">
                                <Calendar className="h-3 w-3 mr-1" />
                                {item.date}
                                <Clock className="h-3 w-3 ml-2 mr-1" />
                                {item.time}
                                {item.weatherStamp && (
                                  <span className="ml-2 flex items-center">
                                    <CloudSun className="h-3 w-3 mr-1" />
                                    {item.weatherStamp.temperature}°C, {item.weatherStamp.condition}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="bg-card dark:bg-card border-border">
                        <DialogHeader>
                          <DialogTitle className="dark:text-white">{item.title}</DialogTitle>
                        </DialogHeader>
                        <div className="mt-2">
                          <p>{item.content}</p>
                          <div className="mt-4">
                            <strong>{translate("Date:", "Fecha:")}</strong> {item.date}
                          </div>
                          <div>
                            <strong>{translate("Time:", "Hora:")}</strong> {item.time}
                          </div>
                          {item.weatherStamp && (
                            <div>
                              <strong>{translate("Weather:", "Clima:")}</strong> {item.weatherStamp.temperature}°C, {item.weatherStamp.condition}
                            </div>
                          )}
                          <div className="mt-2">
                            <strong>{translate("Tags:", "Etiquetas:")}</strong> {item.tags.join(", ")}
                          </div>
                        </div>
                        <div className="flex justify-end space-x-2 mt-4">
                          {section === "Doctor's Notes" && (
                          <Button onClick={() => createPDF(item)}>
                            <FileUp className="h-4 w-4 mr-2" />
                            {translate("Create PDF", "Crear PDF")}
                          </Button>
                          )}
                          <Button onClick={() => shareItem(item)}>
                            <Send className="h-4 w-4 mr-2" />
                            {translate("Share", "Compartir")}
                          </Button>
                          <Button variant="destructive" onClick={() => removeItem(item.id)}>
                            <Trash2 className="h-4 w-4 mr-2" />
                            {translate("Remove", "Eliminar")}
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                    <Button size="sm" variant="ghost" onClick={() => shareItem(item)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200">
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </ScrollArea>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  )
}


// In HTML, <button> cannot be a descendant of <button>.
// This will cause a hydration error.