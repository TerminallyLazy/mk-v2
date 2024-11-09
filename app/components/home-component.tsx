"use client";
import React, { useState } from 'react'
import { Button } from "@/app/components/ui/button"
import { Input } from "@/app/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card"
import { ScrollArea } from "@/app/components/ui/scroll-area"
import { Send } from 'lucide-react'
import Image from "next/image"
import momClappingWithKidImage from "@/public/momclappingwithkid.webp";
import momWorkWithKidImage from "@/public/momworkwithkid.webp";
import babyNappingImage from "@/public/babynapping.webp";
import medMythImage from "@/public/medmyth.png";

type TranslateFunction = (en: string, es: string) => string;

interface HomeComponentProps {
  addPoints: (amount: number) => void;
  translate: TranslateFunction;
}

const defaultTranslate: TranslateFunction = (en: string) => en;

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  sources?: string[];
}

interface RequestBody {
  prompt: string;
  type: string;
  image?: string;
}

export default function HomeComponent({ addPoints = () => {}, translate = defaultTranslate }: HomeComponentProps) {
  const [question, setQuestion] = useState('')
  const [conversation, setConversation] = useState<ChatMessage[]>([]);
  const [showSources, setShowSources] = useState(false)
  const [medImage, setMedImage] = useState<File | null>(null);

  const toggleSources = () => {
    setShowSources(!showSources)
  }

  const stories = [
    { id: 1, title: "Mom's Innovative Approach to Picky Eating", titleEs: "Enfoque innovador de una madre para niños quisquillosos con la comida", image: "/fruitsandveg.jpg", synopsis: "Learn how one mom transformed mealtime battles into fun food adventures.", synopsisEs: "Descubre cómo una madre transformó las batallas a la hora de comer en divertidas aventuras culinarias." },
    { id: 2, title: "The Power of Positive Reinforcement", titleEs: "El poder del refuerzo positivo", image: momClappingWithKidImage, synopsis: "Discover effective ways to encourage good behavior in children.", synopsisEs: "Descubre formas efectivas de fomentar el buen comportamiento en los niños." },
    { id: 3, title: "Balancing Work and Motherhood", titleEs: "Equilibrando el trabajo y la maternidad", image: momWorkWithKidImage, synopsis: "Tips from successful moms on managing career and family life.", synopsisEs: "Consejos de madres exitosas sobre cómo manejar la carrera y la vida familiar." },
    { id: 4, title: "Creating a Safe Sleep Environment", titleEs: "Creando un ambiente seguro para dormir", image: babyNappingImage, synopsis: "Expert advice on setting up the perfect nursery for your baby.", synopsisEs: "Consejos de expertos para preparar la habitación perfecta para tu bebé." },
    { id: 5, title: "Medical Myths Debunked", titleEs: "Mitos médicos desmentidos", image: medMythImage, synopsis: "Separating fact from fiction in common medical beliefs about children's health.", synopsisEs: "Separando la realidad de la ficción en las creencias médicas comunes sobre la salud infantil." }
]

  const handleSubmit = async (e: React.FormEvent, type: string) => {
    e.preventDefault();
    if (!question.trim() && !medImage) return;

    setConversation(prev => [...prev, { 
      role: 'user', 
      content: `[${type}] ${question}` 
    }]);

    try {
      const requestBody: RequestBody = {
        prompt: question,
        type
      };

      if (type === 'Med Lookup' && medImage) {
        const reader = new FileReader();
        const imageData = await new Promise<string>((resolve) => {
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(medImage);
        });
        requestBody.image = imageData;
      }

      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) throw new Error('Failed to generate response');

      const data = await response.json();

      setConversation(prev => [...prev, { 
        role: 'assistant', 
        content: data.text,
        sources: data.sources || []
      }]);

      if (data.sources?.length) {
        setShowSources(true);
      }

      setQuestion('');
      setMedImage(null);
      if (addPoints) addPoints(5);

    } catch (error) {
      console.error('Error:', error);
      setConversation(prev => [...prev, { 
        role: 'assistant', 
        content: 'I apologize, but I encountered an error. Please try again.',
        sources: []
      }]);
    }
  };

  const handleMedImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setMedImage(file);
      handleSubmit(e, 'Med Lookup');
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 bg-background dark:bg-background p-4 min-h-screen">
      <div className="text-2xl sm:text-[40pt] font-serif text-center text-foreground">
        {translate("Welcome Back Megan", "Bienvenida de nuevo Megan")}
      </div>

      {/* Articles Section - Grid Layout */}
      <div className="grid grid-cols-4 gap-4">
        {/* Featured Story - Takes up 2x2 space */}
        <Card className="col-span-2 row-span-2 bg-card dark:bg-card border-border">
          <CardContent className="p-4">
            <Image 
              src={stories[0].image}
              alt={translate(stories[0].title, stories[0].titleEs)} 
              className="w-full h-[400px] object-cover mb-4 rounded-lg shadow-md"
              width={800}
              height={400}
            />
            <CardTitle className="text-lg mb-2 text-card-foreground">
              {translate(stories[0].title, stories[0].titleEs)}
            </CardTitle>
            <CardDescription className="text-sm text-muted-foreground line-clamp-2">
              {translate(stories[0].synopsis, stories[0].synopsisEs)}
            </CardDescription>
          </CardContent>
        </Card>

        {/* Other Stories - Each takes up 1x1 space */}
        {stories.slice(1).map((story) => (
          <Card key={story.id} className="bg-card dark:bg-card border-border">
            <CardContent className="p-4 flex flex-col h-full">
              <div className="relative w-full pt-[100%] mb-2"> {/* This creates a perfect square */}
                <Image 
                  src={story.image} 
                  alt={translate(story.title, story.titleEs)} 
                  className="absolute top-0 left-0 w-full h-full object-cover rounded-md shadow-sm"
                  width={200}
                  height={200}
                />
              </div>
              <CardTitle className="text-sm mb-1 text-card-foreground line-clamp-1">
                {translate(story.title, story.titleEs)}
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground line-clamp-2">
                {translate(story.synopsis, story.synopsisEs)}
              </CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Chat Interface - Now at the bottom and larger */}
      <Card className="p-4 bg-card dark:bg-card shadow-lg border-border">
        <CardHeader>
          <CardTitle className="text-card-foreground">
            {translate("Ask a Question", "Haz una pregunta")}
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            {translate("Get answers from reliable medical sources", "Obtén respuestas de fuentes médicas confiables")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Chat Messages Area */}
          <ScrollArea className="h-[400px] mb-4 p-4 border rounded-lg">
            {conversation.map((message, index) => (
              <div
                key={index}
                className={`mb-4 p-3 rounded-lg ${
                  message.role === 'assistant'
                    ? 'bg-primary/10 ml-4'
                    : 'bg-muted mr-4'
                }`}
              >
                <div className="flex items-start">
                  <div className="flex-grow">
                    <div className="font-semibold mb-1">
                      {message.role === 'assistant' ? translate('AI Assistant', 'Asistente IA') : translate('You', 'Tú')}
                    </div>
                    <div className="text-sm">{message.content}</div>
                  </div>
                </div>
              </div>
            ))}
          </ScrollArea>

          {/* Sources Panel - Shows when sources are available */}
          {showSources && conversation.length > 0 && (
            <div className="mb-4 p-4 bg-muted rounded-lg">
              <h3 className="font-semibold mb-2">{translate("Sources Used", "Fuentes Utilizadas")}</h3>
              <ul className="text-sm space-y-1">
                {conversation[conversation.length - 1]?.sources?.map((source: string, index: number) => (
                  <li key={index} className="text-muted-foreground">
                    {source}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Input Area */}
          <div className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder={translate("Type your question here...", "Escribe tu pregunta aquí...")}
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                className="flex-grow bg-background dark:bg-background"
              />
              <Button type="submit" onClick={(e) => handleSubmit(e, 'General')}>
                <Send className="h-4 w-4" />
              </Button>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={toggleSources}
                className="bg-background dark:bg-background"
              >
                {translate("Sources", "Fuentes")}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => document.getElementById('med-photo-upload')?.click()}
                className="bg-background dark:bg-background"
              >
                {translate("Med Lookup", "Búsqueda de Medicamentos")}
              </Button>
              <input
                id="med-photo-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleMedImageUpload}
              />
              <Button
                variant="outline"
                size="sm"
                onClick={(event: React.MouseEvent) => handleSubmit(event, 'Mental & Behavioral Health')}
                className="bg-background dark:bg-background"
              >
                {translate("Mental & Behavioral Health", "Salud Mental y Conductual")}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

