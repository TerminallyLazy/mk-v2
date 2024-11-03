"use client";
import React, { useCallback, useEffect, useState } from "react";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/app/components/ui/card";
import { ScrollArea } from "@/app/components/ui/scroll-area";
import { Send, Share2, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";


interface HomeComponentProps {
    addPoints: (amount: number) => void; // Remove optional flag since it's required
    translate?: (en: string, es: string) => string;
  }

 
  interface Story {
    id: number;
    title: string;
    titleEs: string;
    image: string;
    synopsis: string;
    synopsisEs: string;
  }


  export function HomeComponent({ addPoints, translate: propTranslate }: HomeComponentProps) {
    const [language] = useState("en");
    const [question, setQuestion] = useState("");
    const [conversation, setConversation] = useState<
      { role: "user" | "assistant"; content: string }[]
    >([]);
    const [carouselIndex, setCarouselIndex] = useState(0);
    const [shareText, setShareText] = useState("");
    const translate = propTranslate || ((en: string, es: string) => (language === "en" ? en : es));
  

  const stories: Story[] = [
    {
      id: 1,
      title: "Mom's Innovative Approach to Picky Eating",
      titleEs:
        "Enfoque innovador de una madre para niños quisquillosos con la comida",
      image: "",
      synopsis:
        "Learn how one mom transformed mealtime battles into fun food adventures.",
      synopsisEs:
        "Descubre cómo una madre transformó las batallas a la hora de comer en divertidas aventuras culinarias.",
    },
    {
      id: 2,
      title: "The Power of Positive Reinforcement",
      titleEs: "El poder del refuerzo positivo",
      image: "/placeholder.svg",
      synopsis:
        "Discover effective ways to encourage good behavior in children.",
      synopsisEs:
        "Descubre formas efectivas de fomentar el buen comportamiento en los niños.",
    },
    {
      id: 3,
      title: "Balancing Work and Motherhood",
      titleEs: "Equilibrando el trabajo y la maternidad",
      image: "/placeholder.svg",
      synopsis: "Tips from successful moms on managing career and family life.",
      synopsisEs:
        "Consejos de madres exitosas sobre cómo manejar la carrera y la vida familiar.",
    },
    {
      id: 4,
      title: "Creating a Safe Sleep Environment",
      titleEs: "Creando un ambiente seguro para dormir",
      image: "/placeholder.svg",
      synopsis:
        "Expert advice on setting up the perfect nursery for your baby.",
      synopsisEs:
        "Consejos de expertos para preparar la habitación perfecta para tu bebé.",
    },
    {
      id: 5,
      title: "Nutrition for Growing Minds",
      titleEs: "Nutrición para mentes en crecimiento",
      image: "/placeholder.svg",
      synopsis:
        "Explore the best foods to boost your child's cognitive development.",
      synopsisEs:
        "Explora los mejores alimentos para impulsar el desarrollo cognitivo de tu hijo.",
    },
    {
      id: 6,
      title: "Fostering Creativity in Children",
      titleEs: "Fomentando la creatividad en los niños",
      image: "/placeholder.svg",
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
      if (typeof addPoints === 'function') {
        addPoints(5);
      }
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
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQuestion(e.target.value)}
                className="flex-grow"
              />
              <Button type="submit" onClick={(e: React.MouseEvent<HTMLButtonElement>) => handleSubmit(e, "General")}>
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
                onClick={(e: React.MouseEvent<HTMLButtonElement>) => handleSubmit(e, "Med Lookup")}
              >
                {translate("Med Lookup", "Búsqueda de Medicamentos")}
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="px-2 py-1 text-xs"
                onClick={(e: React.MouseEvent<HTMLButtonElement>) => handleSubmit(e, "Mental & Behavioral Health")}
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
        <Image
            src={stories[0].image}
            alt={translate(stories[0].title, stories[0].titleEs)}
            width={400}
            height={200}
            className="object-cover"
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
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setShareText(e.target.value)}
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
                      width={200}
                      height={100}
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

      <NewsTicker translate={translate as (en: string, es: string) => string} />
    </div>
  );
}

function NewsTicker({ translate }: { translate: (en: string, es: string) => string }) {
  // const [setNewsIndex] = useState(0);

  const news = [
    {
      text: translate("CDC recommends new COVID-19 booster for children under 5",
                     "CDC recomienda nuevo refuerzo de COVID-19 para niños menores de 5 años"),
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
              {item.en} / {item.es}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

