'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card"
import { Button } from "@/app/components/ui/button"
import { Input } from "@/app/components/ui/input"
import { ScrollArea } from "@/app/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/app/components/ui/dialog"
import { Plus, Trash2, Send, Calendar, Clock, Share2, FileUp } from 'lucide-react'

interface MyLibraryComponentps {
  translate?: (en: string, es: string) => string;
}

interface LibraryItem {
  id: number;
  title: string;
  content: string;
  section: string;
  date: string;
  time: string;
  tags: string[];
}

export function MyLibraryComponentComponent({ translate: propTranslate }: MyLibraryComponentps) {
  const translate = propTranslate || ((en: string) => en);

  const [libraryItems, setLibraryItems] = useState<LibraryItem[]>([
    { id: 1, title: "Billie's Fever", content: "Billie had a fever of 101°F. Gave acetaminophen and monitored throughout the night. Fever broke by morning.", section: "Billie's Care Log", date: "2023-05-15", time: "20:30", tags: ["fever", "medication"] },
    { id: 2, title: "Billie's Rash", content: "Noticed a small rash on Billie's arm. Applied hydrocortisone cream. Will monitor for changes.", section: "Billie's Care Log", date: "2023-05-20", time: "10:15", tags: ["rash", "skin"] },
    { id: 3, title: "Billie's First Steps", content: "Billie took his first steps today! He managed to walk three steps before sitting down.", section: "Billie's Care Log", date: "2023-06-01", time: "18:45", tags: ["milestone", "walking"] },
    { id: 4, title: "Billie's Teething", content: "Billie seems to be teething. Gums are swollen and he's drooling more than usual. Using teething ring for relief.", section: "Billie's Care Log", date: "2023-06-10", time: "14:20", tags: ["teething", "discomfort"] },
    { id: 5, title: "Megan's Vaccination", content: "Megan received her MMR vaccine. No immediate side effects observed. Will monitor for the next 48 hours.", section: "Megan's Care Log", date: "2023-06-01", time: "14:15", tags: ["vaccination", "MMR"] },
    { id: 6, title: "Megan's Allergic Reaction", content: "Megan developed a mild rash after eating strawberries. Administered antihistamine. Will avoid strawberries in the future.", section: "Megan's Care Log", date: "2023-06-15", time: "19:30", tags: ["allergy", "food"] },
    { id: 7, title: "Megan's Sleep Regression", content: "Megan has been waking up multiple times at night. Trying adjusted bedtime routine to help her sleep through the night.", section: "Megan's Care Log", date: "2023-06-20", time: "22:00", tags: ["sleep", "routine"] },
    { id: 8, title: "Megan's First Words", content: "Megan said her first word today: 'Mama'! She's been babbling more frequently lately.", section: "Megan's Care Log", date: "2023-06-25", time: "09:10", tags: ["milestone", "language"] },
    { id: 9, title: "Fever Management", content: "Q&A about managing child fevers. Key points: stay hydrated, rest, when to call the doctor.", section: "Q&A", date: "2023-05-20", time: "10:00", tags: ["fever", "health tips"] },
    { id: 10, title: "Picky Eating Strategies", content: "Q&A session on dealing with picky eaters. Suggestions include involving kids in meal prep and offering variety.", section: "Q&A", date: "2023-06-05", time: "15:30", tags: ["nutrition", "behavior"] },
    { id: 11, title: "Potty Training Tips", content: "Q&A on effective potty training methods. Discussed consistency, positive reinforcement, and patience.", section: "Q&A", date: "2023-06-18", time: "11:45", tags: ["potty training", "development"] },
    { id: 12, title: "Sibling Rivalry Management", content: "Q&A about managing sibling rivalry. Strategies include individual attention and promoting cooperation.", section: "Q&A", date: "2023-06-30", time: "14:00", tags: ["behavior", "siblings"] },
    { id: 13, title: "Sleep Training Podcast", content: "Notes from sleep training podcast episode. Discussed cry-it-out method, gradual retreat, and bedtime routines.", section: "Podcasts", date: "2023-06-10", time: "22:00", tags: ["sleep training", "podcast"] },
    { id: 14, title: "Nutrition for Toddlers Podcast", content: "Podcast notes on balanced diets for toddlers. Covered importance of variety, portion sizes, and dealing with food refusal.", section: "Podcasts", date: "2023-06-20", time: "20:30", tags: ["nutrition", "podcast"] },
    { id: 15, title: "Positive Discipline Podcast", content: "Podcast discussing positive discipline techniques. Emphasized consistency, clear communication, and natural consequences.", section: "Podcasts", date: "2023-07-01", time: "19:15", tags: ["discipline", "podcast"] },
    { id: 16, title: "Early Childhood Education Podcast", content: "Podcast on the importance of early childhood education. Discussed various learning styles and at-home activities.", section: "Podcasts", date: "2023-07-10", time: "21:00", tags: ["education", "podcast"] },
    { id: 17, title: "Billie's Check-up", content: "Prepare questions about Billie's recent fever and sleep patterns. Don't forget to bring vaccination records.", section: "Doctor's Notes", date: "2023-07-01", time: "09:30", tags: ["check-up", "questions"] },
    { id: 18, title: "Megan's Allergy Consult", content: "Appointment for Megan's allergy testing. Bring food diary and list of observed reactions.", section: "Doctor's Notes", date: "2023-07-15", time: "14:00", tags: ["allergy", "testing"] },
    { id: 19, title: "Billie's Dental Visit", content: "First dental check-up for Billie. Questions about teething and proper oral care for toddlers.", section: "Doctor's Notes", date: "2023-07-20", time: "11:00", tags: ["dental", "oral health"] },
    { id: 20, title: "Family Flu Shots", content: "Schedule flu shots for the whole family. Check if any new vaccinations are recommended.", section: "Doctor's Notes", date: "2023-08-01", time: "10:00", tags: ["vaccination", "preventive care"] },
  ])
  const [newItem, setNewItem] = useState({ title: '', content: '', section: 'Billie\'s Care Log', date: '', time: '', tags: [] })

  const addItem = () => {
    if (newItem.title && newItem.content) {
      setLibraryItems([...libraryItems, { id: Date.now(), ...newItem }])
      setNewItem({ title: '', content: '', section: 'Billie\'s Care Log', date: '', time: '', tags: [] })
    }
  }

  const removeItem = (id: number) => {
    setLibraryItems(libraryItems.filter(item => item.id !== id))
  }

  const shareItem = (item: LibraryItem) => {
    console.log(`Sharing item: ${item.title}`)
    // Here you would implement the logic to share the item
  }

  const createPDF = (item: LibraryItem) => {
    console.log(`Creating PDF for item: ${item.title}`)
    // Here you would implement the logic to create a PDF
  }

  const sections = ["Billie's Care Log", "Megan's Care Log", "Q&A", "Podcasts", "Doctor's Notes"]

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>{translate("My Library", "Mi Biblioteca")}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="mb-4">{translate("Manage your files.", "Administra tus archivos.")}</p>
        
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 mb-4">
          <Input
            placeholder={translate("File Title", "Título del Archivo")}
            value={newItem.title}
            onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
            className="flex-grow"
          />
          <Input
            placeholder={translate("Content", "Contenido")}
            value={newItem.content}
            onChange={(e) => setNewItem({ ...newItem, content: e.target.value })}
            className="flex-grow"
          />
          <select
            value={newItem.section}
            onChange={(e) => setNewItem({ ...newItem, section: e.target.value })}
            className="border rounded-md p-2"
          >
            {sections.map((section) => (
              <option key={section} value={section}>{translate(section, section)}</option>
            ))}
          </select>
          <Input
            type="date"
            value={newItem.date}
            onChange={(e) => setNewItem({ ...newItem, date: e.target.value })}
            className="flex-grow"
          />
          <Input
            type="time"
            value={newItem.time}
            onChange={(e) => setNewItem({ ...newItem, time: e.target.value })}
            className="flex-grow"
          />
          <Button onClick={addItem} className="w-full sm:w-auto">
            <Plus className="h-4 w-4 mr-2" />
            {translate("Add", "Añadir")}
          </Button>
        </div>

        <Tabs defaultValue="Billie's Care Log" className="w-full">
          <TabsList>
            {sections.map((section) => (
              <TabsTrigger key={section} value={section}>
                {translate(section, section)}
              </TabsTrigger>
            ))}
          </TabsList>
          {sections.map((section) => (
            <TabsContent key={section} value={section}>
              <ScrollArea className="h-[400px] w-full border rounded-md p-4">
                {libraryItems.filter(item => item.section === section).map(item => (
                  <div key={item.id} className="flex items-start justify-between mb-4 hover:bg-gray-50 transition-colors duration-200 rounded-lg overflow-hidden shadow-md">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" className="w-full justify-start mr-2 py-4 px-5 hover:shadow-lg transition-shadow duration-200 bg-white">
                          <div className="flex flex-col items-start w-full">
                            <div className="font-semibold text-lg mb-2">{item.title}</div>
                            <div className="text-sm text-gray-500 flex items-center mb-2">
                              <Calendar className="h-3 w-3 mr-1" />
                              {item.date}
                              <Clock className="h-3 w-3 ml-2 mr-1" />
                              {item.time}
                            </div>
                            <div className="text-sm text-gray-600">{item.content}</div>
                          </div>
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>{item.title}</DialogTitle>
                        </DialogHeader>
                        <div className="mt-2">
                          <p>{item.content}</p>
                          <div className="mt-4">
                            <strong>{translate("Date:", "Fecha:")}</strong> {item.date}
                          </div>
                          <div>
                            <strong>{translate("Time:", "Hora:")}</strong> {item.time}
                          </div>
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
                    <Button size="sm" variant="ghost" onClick={() => shareItem(item)} className="p-2 hover:bg-gray-100 transition-colors duration-200 self-start mt-1">
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