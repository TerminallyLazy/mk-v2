"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronLeft, ChevronRight, Send, Share2 } from "lucide-react";
import Image from "next/image"; // error: Module '"next/image"' has no exported member 'Image'. Did you mean to use 'import Image from "next/image"' instead?
import React, { useCallback, useEffect, useState } from "react";
type TranslateFunction = (en: string, es: string) => string;

// Added custom marquee animation styles
// const marqueeStyles = {
//   animation: "marquee 20s linear infinite",
//   "@keyframes marquee": {
//     "0%": { transform: "translateX(100%)" },
//     "100%": { transform: "translateX(-100%)" },
//   },
// };

export default function Home() {
  const [activeTab, setActiveTab] = React.useState("home");
  const [points, setPoints] = React.useState(0);
  const [language, setLanguage] = React.useState("en");

  const addPoints = (amount: number) => {
    setPoints((prevPoints) => prevPoints + amount);
  };

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === "en" ? "es" : "en"));
  };

  const translate: TranslateFunction = React.useMemo(() => {
    return (en: string, es: string) => (language === "en" ? en : es);
  }, [language]);

  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-primary text-primary-foreground p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">MomsKidz</h1>
          <div className="flex items-center gap-4">
            <span>
              {translate("Points", "Puntos")}: {points}
            </span>
            <Button onClick={toggleLanguage}>
              {language === "en" ? "ES" : "EN"}
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-grow container mx-auto p-4">
        <Card>
          <CardContent className="p-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6">
                <TabsTrigger value="home">
                  {translate("Home", "Inicio")}
                </TabsTrigger>
                <TabsTrigger value="tapestry">
                  {translate("Tapestry", "Tapiz")}
                </TabsTrigger>
                <TabsTrigger value="carelog">
                  {translate("Care Log", "Registro de Cuidados")}
                </TabsTrigger>
                <TabsTrigger value="milestones">
                  {translate("Milestones", "Hitos")}
                </TabsTrigger>
                <TabsTrigger value="library">
                  {translate("My Library", "Mi Biblioteca")}
                </TabsTrigger>
                <TabsTrigger value="podcasts">
                  {translate("Podcasts", "Podcasts")}
                </TabsTrigger>
              </TabsList>
              <TabsContent value="home">
                <HomeComponent addPoints={addPoints} translate={translate} />
              </TabsContent>
              {/* Add other TabsContent components here for other tabs */}
            </Tabs>
          </CardContent>
        </Card>
      </main>

      <footer className="bg-gray-100 text-gray-600 p-4">
        <div className="container mx-auto text-center">
          &copy; {new Date().getFullYear()} MomsKidz.{" "}
          {translate("All rights reserved.", "Todos los derechos reservados.")}
        </div>
      </footer>
    </div>
  );
}

function HomeComponent({
  addPoints,
  translate,
}: {
  addPoints: (amount: number) => void;
  translate: TranslateFunction;
}) {
  const [question, setQuestion] = useState("");
  const [conversation, setConversation] = useState<
    { role: "user" | "assistant"; content: string }[]
  >([]);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [shareText, setShareText] = useState("");

  interface Story {
    id: number;
    title: string;
    titleEs: string;
    image: string;
    synopsis: string;
    synopsisEs: string;
  }

  const stories: Story[] = [
    {
      id: 1,
      title: "Mom's Innovative Approach to Picky Eating",
      titleEs:
        "Enfoque innovador de una madre para niños quisquillosos con la comida",
      image: "/placeholder.svg?height=200&width=400",
      synopsis:
        "Learn how one mom transformed mealtime battles into fun food adventures.",
      synopsisEs:
        "Descubre cómo una madre transformó las batallas a la hora de comer en divertidas aventuras culinarias.",
    },
    {
      id: 2,
      title: "The Power of Positive Reinforcement",
      titleEs: "El poder del refuerzo positivo",
      image: "/placeholder.svg?height=100&width=200",
      synopsis:
        "Discover effective ways to encourage good behavior in children.",
      synopsisEs:
        "Descubre formas efectivas de fomentar el buen comportamiento en los niños.",
    },
    {
      id: 3,
      title: "Balancing Work and Motherhood",
      titleEs: "Equilibrando el trabajo y la maternidad",
      image: "/placeholder.svg?height=100&width=200",
      synopsis: "Tips from successful moms on managing career and family life.",
      synopsisEs:
        "Consejos de madres exitosas sobre cómo manejar la carrera y la vida familiar.",
    },
    {
      id: 4,
      title: "Creating a Safe Sleep Environment",
      titleEs: "Creando un ambiente seguro para dormir",
      image: "/placeholder.svg?height=100&width=200",
      synopsis:
        "Expert advice on setting up the perfect nursery for your baby.",
      synopsisEs:
        "Consejos de expertos para preparar la habitación perfecta para tu bebé.",
    },
    {
      id: 5,
      title: "Nutrition for Growing Minds",
      titleEs: "Nutrición para mentes en crecimiento",
      image: "/placeholder.svg?height=100&width=200",
      synopsis:
        "Explore the best foods to boost your child's cognitive development.",
      synopsisEs:
        "Explora los mejores alimentos para impulsar el desarrollo cognitivo de tu hijo.",
    },
    {
      id: 6,
      title: "Fostering Creativity in Children",
      titleEs: "Fomentando la creatividad en los niños",
      image: "/placeholder.svg?height=100&width=200",
      synopsis:
        "Fun activities to nurture your child's imagination and artistic skills.",
      synopsisEs:
        "Actividades divertidas para nutrir la imaginación y las habilidades artísticas de tu hijo.",
    },
  ];

  const handleSubmit = (e: React.FormEvent, type: string) => {
    e.preventDefault();
    if (question.trim()) {
      setConversation([
        ...conversation,
        { role: "user", content: `[${type}] ${question}` },
      ]);
      // Simulate AI response
      setTimeout(() => {
        setConversation((prev) => [
          ...prev,
          {
            role: "assistant",
            content: translate(
              `This is a simulated AI response to your ${type} question: "${question}". In a real implementation, this would connect to an AI service using reliable medical sources.`,
              `Esta es una respuesta simulada de IA a tu pregunta de ${type}: "${question}". En una implementación real, esto se conectaría a un servicio de IA utilizando fuentes médicas confiables.`,
            ),
          },
        ]);
        addPoints(5);
      }, 1000);
      setQuestion("");
    }
  };

  const handleShare = (e: React.FormEvent) => {
    e.preventDefault();
    if (shareText.trim()) {
      console.log(`Sharing "${shareText}" with friend or family member`);
      setShareText("");
      addPoints(5);
    }
  };

  const carouselLength = stories.length;

  const nextSlide = useCallback(() => {
    setCarouselIndex((prev) => (prev + 1) % carouselLength);
  }, [carouselLength]);

  const prevSlide = useCallback(() => {
    setCarouselIndex((prev) => (prev === 0 ? carouselLength - 1 : prev - 1));
  }, [carouselLength]);

  // Add this useEffect for auto-advance
  useEffect(() => {
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, [nextSlide]);

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="text-2xl sm:text-[40pt] font-serif p-2 sm:p-4 text-center">
        {translate("Welcome Back Megan", "Bienvenida de nuevo Megan")}
      </div>
      <Card className="p-2 sm:p-4 bg-gray-50">
        <CardHeader>
          <CardTitle>
            {translate("Ask a Question", "Haz una pregunta")}
          </CardTitle>
          <CardDescription>
            {translate(
              "Get answers from reliable medical sources",
              "Obtén respuestas de fuentes médicas confiables",
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[100px] mb-4">
            {conversation.map((message, index) => (
              <div
                key={index}
                className={`mb-4 ${message.role === "assistant" ? "text-blue-600" : "text-gray-800"}`}
              >
                <strong>
                  {message.role === "assistant"
                    ? translate("AI: ", "IA: ")
                    : translate("You: ", "Tú: ")}
                </strong>
                {message.content}
              </div>
            ))}
          </ScrollArea>
          <form className="space-y-2">
            <div className="flex space-x-2">
              <Input
                placeholder={translate(
                  "Type your question here...",
                  "Escribe tu pregunta aquí...",
                )}
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                className="flex-grow"
              />
              <Button type="submit" onClick={(e) => handleSubmit(e, "General")}>
                <Send className="h-4 w-4" />
                <span className="sr-only">{translate("Send", "Enviar")}</span>
              </Button>
            </div>
            <div className="flex justify-start space-x-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="px-2 py-1 text-xs"
                onClick={(e) => handleSubmit(e, "Med Lookup")}
              >
                {translate("Med Lookup", "Búsqueda de Medicamentos")}
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="px-2 py-1 text-xs"
                onClick={(e) => handleSubmit(e, "Mental & Behavioral Health")}
              >
                {translate(
                  "Mental & Behavioral Health",
                  "Salud Mental y Conductual",
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
      <Card className="p-2 sm:p-4">
        <CardContent className="p-0">
          <img
            src={stories[0].image}
            alt={translate(stories[0].title, stories[0].titleEs)}
            className="w-full h-32 sm:h-48 object-cover"
          />
        </CardContent>
        <CardHeader>
          <CardTitle>
            {translate(stories[0].title, stories[0].titleEs)}
          </CardTitle>
          <CardDescription>
            {translate(stories[0].synopsis, stories[0].synopsisEs)}
          </CardDescription>
        </CardHeader>
        <CardFooter className="flex justify-end">
          <form onSubmit={handleShare} className="flex space-x-2">
            <Input
              placeholder={translate(
                "Share with friend or family...",
                "Compartir con amigo o familiar...",
              )}
              value={shareText}
              onChange={(e) => setShareText(e.target.value)}
              className="w-64"
            />
            <Button type="submit">
              <Share2 className="h-4 w-4 mr-2" />
              {translate("Share", "Compartir")}
            </Button>
          </form>
        </CardFooter>
      </Card>

      <div className="relative">
        <div className="flex overflow-hidden">
          <div
            className="flex transition-transform duration-300 ease-in-out"
            style={{ transform: `translateX(-${carouselIndex * 100}%)` }}
          >
            {stories.slice(1).map((story) => (
              <div
                key={story.id}
                className="flex-shrink-0 w-full sm:w-1/3 md:w-1/4 px-1 sm:px-2"
              >
                <Card>
                  <CardContent className="p-0 relative h-32">
                    <Image
                      src={story.image}
                      alt={translate(story.title, story.titleEs)}
                      fill
                      className="object-cover"
                    />
                  </CardContent>
                  <CardHeader>
                    <CardTitle className="text-sm">
                      {translate(story.title, story.titleEs)}
                    </CardTitle>
                    <CardDescription className="text-xs">
                      {translate(story.synopsis, story.synopsisEs)}
                    </CardDescription>
                  </CardHeader>
                </Card>
              </div>
            ))}
          </div>
          <Button
            variant="outline"
            size="icon"
            className="absolute top-1/2 left-0 transform -translate-y-1/2"
            onClick={prevSlide}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="absolute top-1/2 right-0 transform -translate-y-1/2"
            onClick={nextSlide}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <NewsTicker translate={translate} />
    </div>
  );
}

function NewsTicker({ translate }: { translate: TranslateFunction }) {
  const [newsIndex, setNewsIndex] = useState(0);

  const news = [
    {
      en: "CDC recommends new COVID-19 booster for children under 5",
      es: "CDC recomienda nuevo refuerzo de COVID-19 para niños menores de 5 años",
    },
    {
      en: "Study shows benefits of early childhood education on long-term health",
      es: "Estudio muestra beneficios de la educación infantil temprana en la salud a largo plazo",
    },
    {
      en: "New legislation aims to improve maternal healthcare access",
      es: "Nueva legislación busca mejorar el acceso a la atención médica materna",
    },
    {
      en: "Experts emphasize importance of mental health support for new mothers",
      es: "Expertos enfatizan la importancia del apoyo de salud mental para nuevas madres",
    },
    {
      en: "Research reveals link between nutrition and cognitive development in infants",
      es: "Investigación revela vínculo entre nutrición y desarrollo cognitivo en bebés",
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setNewsIndex((prevIndex: number) => (prevIndex + 1) % news.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [news.length]);

  return (
    <div className="bg-purple-100 p-2 sm:p-4 overflow-hidden">
      <div className="relative w-full">
        <div
          className="flex whitespace-nowrap"
          style={{
            animation: "marquee 20s linear infinite",
          }}
        >
          {news.concat(news).map((item, index) => (
            <span key={index} className="inline-block px-4">
              {translate(item.en, item.es)}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
