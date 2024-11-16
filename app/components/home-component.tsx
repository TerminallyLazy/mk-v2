"use client";
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { readFileAsDataURL, formatMarkdownContent, cn } from "@/lib/utils";
import { TypingIndicator } from "@/app/components/ui/typing-indicator";
import { Button } from "@/app/components/ui/button"
import { Input } from "@/app/components/ui/input"
import { Spinner } from "@/app/components/ui/spinner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card"
import { ScrollArea } from "@/app/components/ui/scroll-area"
import { Send, ImagePlus } from 'lucide-react'
import { FloatingPoints } from "@/app/components/ui/floating-points"
import { GeminiStatus } from "@/app/components/ui/gemini-status"
import { ChatMessage as ChatMessageComponent } from "@/app/components/ui/chat-message"
import { ArticleCard } from "@/app/components/ui/article-card"
import { ArticleModal } from "@/app/components/ui/article-modal"
import Image from "next/image"
import momClappingWithKidImage from "@/public/momclappingwithkid.webp";
import momWorkWithKidImage from "@/public/momworkwithkid.webp";
import babyNappingImage from "@/public/babynapping.webp";
import medMythImage from "@/public/medmyth.png";
import { RequestBody } from '@/app/types/global';
import type { StaticImageData } from 'next/image';

type TranslateFunction = (en: string, es: string) => string;

interface HomeComponentProps {
  addPoints: (amount: number) => void;
  translate: TranslateFunction;
  toggleLanguage: () => void;
  isSpanish: boolean;
  username: string;
}

const defaultTranslate: TranslateFunction = (en: string) => en;

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  type?: string;
  images?: string[];
  sources?: string[];
}

interface Article {
  id: number;
  title: string;
  titleEs: string;
  image: string | StaticImageData;
  synopsis: string;
  synopsisEs: string;
  content?: string;
  contentEs?: string;
}

const stories: Article[] = [
  {
    id: 1,
    title: "Mom's Innovative Approach to Picky Eating",
    titleEs: "Enfoque innovador de una madre para niños quisquillosos con la comida",
    image: "/fruitsandveg.jpg",
    synopsis: "Learn how one mom transformed mealtime battles into fun food adventures.",
    synopsisEs: "Descubre cómo una madre transformó las batallas a la hora de comer en divertidas aventuras culinarias.",
    content: `
# Transforming Mealtime Battles

Every parent knows the struggle of dealing with a picky eater. But one mom's innovative approach is changing the game. Through a combination of creative presentation, involvement in food preparation, and making mealtimes fun, she's managed to turn her picky eater into an adventurous food explorer.

## Key Strategies

1. **Make it Fun**
   - Transform ordinary foods into exciting shapes
   - Create themed meals
   - Use colorful presentations
   - Make food art together

2. **Get Kids Involved**
   - Let them help with meal planning
   - Teach basic cooking skills
   - Go grocery shopping together
   - Plant a small herb garden

3. **Lead by Example**
   - Show enthusiasm for new foods
   - Share family meals together
   - Talk positively about different foods
   - Celebrate trying new things

4. **Be Patient**
   - Change takes time
   - Celebrate small victories
   - Keep offering variety
   - Don't force or pressure

> "The key is to make it an adventure, not a battle," says Sarah, mother of two.

## Results

After implementing these strategies:

- **Increased Food Variety**
  - Trying new vegetables weekly
  - More willing to taste unfamiliar foods
  - Expanded protein choices

- **Improved Mealtime Atmosphere**
  - Less stress at the table
  - More family engagement
  - Positive food conversations

- **Better Nutrition**
  - Balanced meals
  - More colorful plates
  - Healthier snack choices

- **Long-term Benefits**
  - Better relationship with food
  - Increased confidence in trying new things
  - Valuable life skills learned
`,
    contentEs: `
# Transformando las Batallas a la Hora de Comer

Todo padre conoce la lucha de lidiar con un niño quisquilloso con la comida. Pero el enfoque innovador de una madre está cambiando el juego. A través de una combinación de presentación creativa, participación en la preparación de alimentos y hacer que las comidas sean divertidas, ha logrado convertir a su hijo quisquilloso en un explorador aventurero de la comida.

## Estrategias Clave

1. **Hazlo Divertido**
   - Transforma alimentos ordinarios en formas emocionantes
   - Crea comidas temáticas
   - Usa presentaciones coloridas
   - Haz arte con la comida juntos

2. **Involucra a los Niños**
   - Déjalos ayudar con la planificación de comidas
   - Enseña habilidades básicas de cocina
   - Vayan de compras juntos
   - Planten un pequeño jardín de hierbas

3. **Lidera con el Ejemplo**
   - Muestra entusiasmo por nuevos alimentos
   - Compartan comidas familiares
   - Habla positivamente sobre diferentes alimentos
   - Celebra probar cosas nuevas

4. **Ten Paciencia**
   - El cambio lleva tiempo
   - Celebra pequeñas victorias
   - Sigue ofreciendo variedad
   - No fuerces ni presiones

> "La clave es convertirlo en una aventura, no en una batalla", dice Sarah, madre de dos.

## Resultados

Después de implementar estas estrategias:

- **Mayor Variedad de Alimentos**
  - Probando nuevas verduras semanalmente
  - Más disposición a probar alimentos desconocidos
  - Opciones de proteínas ampliadas

- **Mejor Ambiente durante las Comidas**
  - Menos estrés en la mesa
  - Mayor participación familiar
  - Conversaciones positivas sobre la comida

- **Mejor Nutrición**
  - Comidas balanceadas
  - Platos más coloridos
  - Opciones de snacks más saludables

- **Beneficios a Largo Plazo**
  - Mejor relación con la comida
  - Mayor confianza al probar cosas nuevas
  - Valiosas habilidades de vida aprendidas
`
  },
  {
    id: 2,
    title: "The Power of Positive Reinforcement",
    titleEs: "El poder del refuerzo positivo",
    image: momClappingWithKidImage,
    synopsis: "Discover effective ways to encourage good behavior in children.",
    synopsisEs: "Descubre formas efectivas de fomentar el buen comportamiento en los niños.",
    content: `# The Power of Positive Reinforcement

Positive reinforcement is one of the most effective tools in a parent's arsenal. When used correctly, it can help shape behavior, build confidence, and create a more harmonious home environment.

## Understanding Positive Reinforcement

- Immediate recognition of good behavior
- Specific praise that describes the behavior
- Consistent application of rewards
- Natural consequences that encourage repetition

## Implementation Strategies

1. **Be Specific**: Instead of "good job," say "I love how you helped your sister with her homework"
2. **Be Timely**: Reinforce behavior immediately
3. **Be Consistent**: Create predictable patterns of recognition
4. **Be Genuine**: Show authentic appreciation

## Long-term Benefits

- Improved self-esteem
- Better decision-making skills
- Stronger parent-child relationships
- More positive behavior choices`,
    contentEs: `# El Poder del Refuerzo Positivo

El refuerzo positivo es una de las herramientas más efectivas en el arsenal de un padre. Cuando se usa correctamente, puede ayudar a moldear el comportamiento, construir confianza y crear un ambiente hogareño más armonioso.

## Entendiendo el Refuerzo Positivo

- Reconocimiento inmediato del buen comportamiento
- Elogios específicos que describen el comportamiento
- Aplicación consistente de recompensas
- Consecuencias naturales que fomentan la repetición

## Estrategias de Implementación

1. **Sé Específico**: En lugar de "buen trabajo," di "Me encanta cómo ayudaste a tu hermana con su tarea"
2. **Sé Oportuno**: Refuerza el comportamiento inmediatamente
3. **Sé Consistente**: Crea patrones predecibles de reconocimiento
4. **Sé Genuino**: Muestra apreciación auténtica

## Beneficios a Largo Plazo

- Mejor autoestima
- Mejores habilidades para tomar decisiones
- Relaciones más fuertes entre padres e hijos
- Elecciones de comportamiento más positivas`
  },
  {
    id: 3,
    title: "Balancing Work and Motherhood",
    titleEs: "Equilibrando el trabajo y la maternidad",
    image: momWorkWithKidImage,
    synopsis: "Tips from successful moms on managing career and family life.",
    synopsisEs: "Consejos de madres exitosas sobre cómo manejar la carrera y la vida familiar.",
    content: `# Finding Balance: Work and Motherhood

Navigating the demands of a career while being present for your children is a challenge many mothers face. Here's how successful moms are making it work.

## Key Strategies

1. **Set Clear Boundaries**: Designate specific work hours and family time
2. **Build a Support Network**: Connect with other working moms
3. **Prioritize Self-Care**: Make time for your own well-being
4. **Embrace Flexibility**: Adapt your schedule when needed

## Tips for Success

- Create morning and evening routines
- Use technology to stay organized
- Quality time over quantity
- Learn to delegate effectively

## Remember

> "You don't have to be perfect to be amazing."`,
    contentEs: `# Encontrando el Equilibrio: Trabajo y Maternidad

Navegar las exigencias de una carrera mientras estás presente para tus hijos es un desafío que muchas madres enfrentan. Así es cómo las madres exitosas lo están logrando.

## Estrategias Clave

1. **Establece Límites Claros**: Designa horas específicas para el trabajo y la familia
2. **Construye una Red de Apoyo**: Conéctate con otras madres trabajadoras
3. **Prioriza el Autocuidado**: Haz tiempo para tu propio bienestar
4. **Abraza la Flexibilidad**: Adapta tu horario cuando sea necesario

## Consejos para el Éxito

- Crea rutinas matutinas y nocturnas
- Usa la tecnología para mantenerte organizada
- Calidad sobre cantidad
- Aprende a delegar efectivamente

## Recuerda

> "No tienes que ser perfecta para ser increíble."`
  },
  {
    id: 4,
    title: "Creating a Safe Sleep Environment",
    titleEs: "Creando un ambiente seguro para dormir",
    image: babyNappingImage,
    synopsis: "Expert advice on setting up the perfect nursery for your baby.",
    synopsisEs: "Consejos de expertos para preparar la habitación perfecta para tu bebé.",
    content: `# Safe Sleep Guidelines

Creating a safe sleep environment is crucial for your baby's well-being. Follow these expert-recommended guidelines to ensure your little one sleeps safely and soundly.

## Essential Safety Tips

1. **Back to Sleep**: Always place baby on their back
2. **Firm Surface**: Use a firm mattress with fitted sheet
3. **Clear Crib**: No blankets, pillows, or toys
4. **Room Temperature**: Keep it comfortable (68-72°F)

## Room Setup

- Position crib away from windows
- Install smoke detectors
- Use a video monitor
- Consider room-sharing for first 6 months

## Additional Recommendations

- Use sleep sacks instead of blankets
- Keep room well-ventilated
- Regular safety checks of equipment`,
    contentEs: `# Pautas para un Sueño Seguro

Crear un ambiente seguro para dormir es crucial para el bienestar de tu bebé. Sigue estas pautas recomendadas por expertos para asegurar que tu pequeño duerma de manera segura y tranquila.

## Consejos Esenciales de Seguridad

1. **Dormir Boca Arriba**: Siempre coloca al bebé boca arriba
2. **Superficie Firme**: Usa un colchón firme con sábana ajustable
3. **Cuna Despejada**: Sin mantas, almohadas o juguetes
4. **Temperatura Ambiente**: Mantenla cómoda (20-22°C)

## Configuración de la Habitación

- Posiciona la cuna lejos de las ventanas
- Instala detectores de humo
- Usa un monitor con video
- Considera compartir habitación los primeros 6 meses

## Recomendaciones Adicionales

- Usa sacos de dormir en lugar de mantas
- Mantén la habitación bien ventilada
- Realiza controles regulares de seguridad del equipo`
  },
  {
    id: 5,
    title: "Medical Myths Debunked",
    titleEs: "Mitos médicos desmentidos",
    image: medMythImage,
    synopsis: "Separating fact from fiction in common medical beliefs about children's health.",
    synopsisEs: "Separando la realidad de la ficción en las creencias médicas comunes sobre la salud infantil.",
    content: `# Common Medical Myths: Fact vs Fiction

Let's examine some widespread beliefs about children's health and separate fact from fiction with evidence-based information.

## Popular Myths Debunked

1. **"Feed a cold, starve a fever"**
   - Myth: This old saying has no scientific basis
   - Fact: Proper nutrition is important for all illnesses

2. **"Sugar causes hyperactivity"**
   - Myth: No scientific evidence supports this
   - Fact: Excitement about treats may cause behavioral changes

3. **"Wait an hour after eating to swim"**
   - Myth: No direct link to cramping
   - Fact: Basic water safety is more important

## Evidence-Based Practices

- Regular check-ups are essential
- Vaccines prevent serious diseases
- Sleep is crucial for development
- Balanced nutrition supports growth`,
    contentEs: `# Mitos Médicos Comunes: Realidad vs Ficción

Examinemos algunas creencias generalizadas sobre la salud infantil y separemos la realidad de la ficción con información basada en evidencia.

## Mitos Populares Desmentidos

1. **"Alimenta un resfriado, mata de hambre una fiebre"**
   - Mito: Este viejo dicho no tiene base científica
   - Realidad: La nutrición adecuada es importante para todas las enfermedades

2. **"El azúcar causa hiperactividad"**
   - Mito: No hay evidencia científica que lo respalde
   - Realidad: La emoción por los dulces puede causar cambios de comportamiento

3. **"Espera una hora después de comer para nadar"**
   - Mito: No hay relación directa con los calambres
   - Realidad: La seguridad básica en el agua es más importante

## Prácticas Basadas en Evidencia

- Los chequeos regulares son esenciales
- Las vacunas previenen enfermedades graves
- El sueño es crucial para el desarrollo
- La nutrición equilibrada apoya el crecimiento`
  }
];

// Add interfaces for session storage
interface ChatSession {
  id: string;
  conversation: ChatMessage[];
  points: number;
  timestamp: number;
}

export default function HomeComponent({ 
  addPoints = () => {}, 
  translate = defaultTranslate,
  username 
}: HomeComponentProps) {
  const [question, setQuestion] = useState('')
  const [conversation, setConversation] = useState<ChatMessage[]>([]);
  const [showSources, setShowSources] = useState(false)
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isMedLoading, setIsMedLoading] = useState(false);
  const [points, setPoints] = useState(0);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  //const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  //const [medImage, setMedImage] = useState<File | null>(null);
  const medFileInputRef = useRef<HTMLInputElement>(null);

  // Create ref for scroll container
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Enhanced scroll to bottom functionality
  const scrollToBottom = useCallback(() => {
    if (scrollContainerRef.current) {
      const scrollContainer = scrollContainerRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTo({
          top: scrollContainer.scrollHeight,
          behavior: 'smooth'
        });
      }
    }
  }, []);

  // Scroll when conversation updates or loading state changes
  useEffect(() => {
    // Small delay to ensure content is rendered
    const timeoutId = setTimeout(() => {
      scrollToBottom();
    }, 100);
    return () => clearTimeout(timeoutId);
  }, [conversation, isLoading, scrollToBottom]);

  const toggleSources = () => {
    setShowSources(!showSources);
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
    }
  };

  const updatePoints = () => {
    const newPoints = points + 5;
    setPoints(newPoints);
    if (addPoints) addPoints(5);
  };

  const handleError = (message: string = 'I apologize, but I encountered an error. Please try again.') => {
    setConversation(prev => [...prev, { 
      role: 'assistant', 
      content: message,
      type: 'error'
    }]);
  };

  const handleMedImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsMedLoading(true);
    
    try {
      const imageData = await readFileAsDataURL(file);
      const userMessage: ChatMessage = {
        role: 'user',
        content: 'Analyze this medication',
        type: 'Med Lookup',
        images: [imageData]
      };

      setConversation(prev => [...prev, userMessage]);

      const requestBody: RequestBody = {
        prompt: 'Analyze this medication',
        type: 'Med Lookup',
        image: imageData
      };

      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) throw new Error('Failed to generate response');

      const data = await response.json();

      setConversation(prev => [...prev, {
        role: 'assistant',
        content: formatMarkdownContent(data.text, 'Med Lookup'),
        type: 'Med Lookup',
        images: data.images
      }]);

      updatePoints();
    } catch (error) {
      console.error('Error:', error);
      handleError('Error analyzing the medication');
    } finally {
      setIsMedLoading(false);
    }
  };

  // Load session from localStorage on mount
  useEffect(() => {
    const loadSession = () => {
      try {
        const savedSession = localStorage.getItem('currentChatSession');
        if (savedSession) {
          const session: ChatSession = JSON.parse(savedSession);
          setConversation(session.conversation);
          setPoints(session.points);
        }
      } catch (error) {
        console.error('Error loading session:', error);
      }
    };

    loadSession();
  }, []);

  // Save session to localStorage whenever conversation or points change
  useEffect(() => {
    const saveSession = () => {
      try {
        const currentSession: ChatSession = {
          id: new Date().toISOString(),
          conversation,
          points,
          timestamp: Date.now()
        };
        localStorage.setItem('currentChatSession', JSON.stringify(currentSession));

        // Also save to history
        const savedHistory = localStorage.getItem('chatSessionHistory');
        const history: ChatSession[] = savedHistory ? JSON.parse(savedHistory) : [];
        
        // Keep only last 10 sessions
        const updatedHistory = [currentSession, ...history].slice(0, 10);
        localStorage.setItem('chatSessionHistory', JSON.stringify(updatedHistory));
      } catch (error) {
        console.error('Error saving session:', error);
      }
    };

    if (conversation.length > 0) {
      saveSession();
    }
  }, [conversation, points]);

  // Function to clear current session
  const clearSession = useCallback(() => {
    setConversation([]);
    setPoints(0);
    localStorage.removeItem('currentChatSession');
  }, []);

  // Update the handleSubmit function to handle errors better
  const handleSubmit = async (e: React.FormEvent, type: string = 'General') => {
    e.preventDefault();
    if ((!question.trim() && !selectedImage) || isLoading) return;

    setIsLoading(true);
    let imageData = '';
    
    try {
      if (selectedImage) {
        imageData = await readFileAsDataURL(selectedImage);
      }

      const userMessage: ChatMessage = {
        role: 'user',
        content: question,
        type,
        images: imageData ? [imageData] : undefined
      };

      // Add only the user message initially
      setConversation(prev => [...prev, userMessage]);
      setQuestion('');
      setSelectedImage(null);

      const requestBody: RequestBody = {
        prompt: question,
        type,
        image: imageData || undefined
      };

      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) throw new Error('Failed to generate response');

      const data = await response.json();

      // Add the AI response after we receive it
      setConversation(prev => [...prev, {
        role: 'assistant',
        content: formatMarkdownContent(data.text, type),
        type: data.type,
        images: data.images
      }]);

      updatePoints();
    } catch (error) {
      console.error('Error:', error);
      handleError();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-6 sm:space-y-8 bg-background dark:bg-background p-4 min-h-screen relative"
    >
      <FloatingPoints points={points} />

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="text-2xl sm:text-[40pt] font-serif text-center text-foreground mb-8"
      >
        {translate(`Welcome Back ${username}`, `Bienvenida de nuevo ${username}`)}
      </motion.div>

      {/* Articles Grid - Updated Layout */}
      <div className="grid grid-cols-6 gap-6">
        {/* Featured Article - Left Side */}
        <motion.div 
          className="col-span-3 row-span-2"
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0 }
          }}
        >
          <ArticleCard
            article={stories[0]}
            translate={translate}
            onClick={() => setSelectedArticle(stories[0])}
            featured={true}
          />
        </motion.div>

        {/* Other Articles - Right Side */}
        <div className="col-span-3 grid grid-cols-2 gap-6">
          {stories.slice(1).map((article) => (
            <motion.div
              key={article.id}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 }
              }}
            >
              <ArticleCard
                article={article}
                translate={translate}
                onClick={() => setSelectedArticle(article)}
                featured={false}
              />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Chat Interface - Now at the bottom and larger */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        <Card className="p-4 bg-card dark:bg-card shadow-lg border-border mt-8">
          <CardHeader>
            <CardTitle className="text-card-foreground flex items-center gap-2">
              <GeminiStatus />
              <svg
                xmlns="http://www.w3.org/2000/svg" 
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-primary"
              >
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
              {translate("Ask a Question", "Haz una pregunta")}
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              {translate(
                "Powered by Gemini Pro - Ask questions or upload images for analysis",
                "Impulsado por Gemini Pro - Haz preguntas o sube imágenes para análisis"
              )}
            </CardDescription>
          </CardHeader>
        <CardContent>
          {/* Chat Messages Area */}
          <div ref={scrollContainerRef}>
            <ScrollArea className="h-[400px] mb-4 p-4 border rounded-lg">
              <div className="space-y-4">
                <AnimatePresence mode="popLayout">
                  {conversation.map((message, index) => (
                    <ChatMessageComponent
                      key={`chat-message-${index}-${message.role}-${message.content.slice(0, 10)}`}
                      role={message.role}
                      content={message.content}
                      images={message.images}
                      translate={translate}
                      type={message.type}
                      onImageLoad={scrollToBottom}
                    />
                  ))}
                  {isLoading && (
                    <motion.div
                      key="chat-loading-indicator"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      onAnimationComplete={scrollToBottom}
                      className="ml-4"
                    >
                      <Card className={cn(
                        "p-4",
                        "bg-primary/10 border-primary/20",
                        "transition-colors duration-200"
                      )}>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-foreground/80">
                            {translate("AI Assistant", "Asistente IA")}
                          </span>
                          <TypingIndicator />
                        </div>
                      </Card>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </ScrollArea>
          </div>

            {/* Sources Panel */}
            <AnimatePresence>
              {showSources && conversation.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-4 overflow-hidden"
                >
                  <Card className="p-4 bg-muted">
                    <h3 className="font-semibold mb-2">
                      {translate("Sources Used", "Fuentes Utilizadas")}
                    </h3>
                    <ul className="text-sm space-y-1">
                      {conversation[conversation.length - 1]?.sources?.map((source: string, index: number) => (
                        <li key={index} className="text-muted-foreground">
                          {source}
                        </li>
                      ))}
                    </ul>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Chat Input and Actions */}
          <div className="space-y-4">
            <form onSubmit={(e) => handleSubmit(e)} className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder={translate("Type your question here...", "Escribe tu pregunta aquí...")}
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  className="flex-grow bg-background dark:bg-background"
                  disabled={isLoading}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-background dark:bg-background"
                  disabled={isLoading}
                >
                  <ImagePlus className="h-4 w-4" />
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? <Spinner size="sm" /> : <Send className="h-4 w-4" />}
                </Button>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                className="hidden"
                disabled={isLoading}
              />
              {selectedImage && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="relative w-20 h-20"
                >
                  <Image
                    src={URL.createObjectURL(selectedImage)}
                    alt="Selected image"
                    fill
                    className="object-cover rounded-md"
                  />
                  <Button
                    size="sm"
                    variant="destructive"
                    className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                    onClick={() => setSelectedImage(null)}
                    disabled={isLoading}
                  >
                    ×
                  </Button>
                </motion.div>
              )}
            </form>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={toggleSources}
                className="bg-background dark:bg-background hover:bg-primary/10"
                disabled={isLoading}
              >
                {translate("Sources", "Fuentes")}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => medFileInputRef.current?.click()}
                className="bg-background dark:bg-background hover:bg-primary/10"
                disabled={isLoading || isMedLoading}
              >
                {isMedLoading ? (
                  <Spinner size="sm" className="mr-2" />
                ) : null}
                {translate("Med Lookup", "Búsqueda de Medicamentos")}
              </Button>
              <input
                ref={medFileInputRef}
                type="file"
                accept="image/*"
                onChange={handleMedImageUpload}
                className="hidden"
                disabled={isLoading || isMedLoading}
              />
              <Button
                variant="outline"
                size="sm"
                onClick={(e: React.MouseEvent) => handleSubmit(e, 'Mental & Behavioral Health')}
                className="bg-background dark:bg-background hover:bg-primary/10"
                disabled={isLoading}
              >
                {translate("Mental & Behavioral Health", "Salud Mental y Conductual")}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>

      {/* Article Modal */}
      <AnimatePresence>
        {selectedArticle && (
          <ArticleModal
            isOpen={!!selectedArticle}
            onClose={() => setSelectedArticle(null)}
            article={selectedArticle}
            translate={translate}
          />
        )}
      </AnimatePresence>

      {/* Add session controls */}
      <div className="flex justify-end gap-2 mb-4">
        <Button
          variant="outline"
          size="sm"
          onClick={clearSession}
          className="text-destructive hover:text-destructive"
        >
          {translate("Clear Chat", "Limpiar Chat")}
        </Button>
      </div>
    </motion.div>
  );
}

