import React, { useState } from "react";
import { Button } from "./ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Input } from "./ui/input";
import { ScrollArea } from "./ui/scroll-area";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@radix-ui/react-popover";

import {
  Heart,
  MessageCircle,
  X,
  Date,
  Plus,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Calendar } from "@radix-ui/react-calendar";
import { cn } from "@/lib/utils";

// Define the TranslateFunction type
type TranslateFunction = (en: string, es: string) => string;

interface MoodTrackerProps {
  translate?: TranslateFunction;
}

function MoodTracker({ translate }: MoodTrackerProps) {
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);

  const moodColors = {
    1: "bg-red-500",
    2: "bg-orange-500",
    3: "bg-yellow-500",
    4: "bg-green-500",    
    5: "bg-blue-500",
    6: "bg-red-200",
    7: "bg-orange-200",
    8: "bg-yellow-200",
    9: "bg-green-200",
    10: "bg-blue-200",
  };

  const handleSelect = (date: Date | undefined) => {
    if (date) {
      setSelectedDates((prev) => {
        const existing = prev.find(
          (d) => d.toDateString() === date.toDateString(),
        );
        if (existing) {
          return prev.filter((d) => d.toDateString() !== date.toDateString());
        } else {
          return [...prev, date];
        }
      });
    }
  };

  const getMoodForDate = (date: Date) => {
    return Math.floor(Math.random() * 5) + 1;
  };

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle>
          {translate
            ? translate("Mood Tracker", "Rastreador de Estado de Ánimo")
            : "Mood Tracker"}
        </CardTitle>
        <CardDescription>
          {translate
            ? translate(
                "Track your daily mood",
                "Registra tu estado de ánimo diario",
              )
            : "Track your daily mood"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline">
              {translate
                ? translate("Select Mood", "Seleccionar Estado de Ánimo")
                : "Select Mood"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="multiple"
              selected={selectedDates}
              onSelect={handleSelect}
              className="rounded-md border"
              components={{
                Day: ({ date,...props }: { date: Date } & React.HTMLAttributes<HTMLButtonElement>) => {
                  const mood = getMoodForDate(date);
                  return (
                    <Button
                      {...props}
                      className={cn(
                        props.className,
                        "h-9 w-9",
                        selectedDates.some(
                          (selectedDate) =>
                            selectedDate.toDateString() === date.toDateString(),
                        ) && moodColors[mood as keyof typeof moodColors],
                      )}
                    />
                  );
                },
              }}
            />
          </PopoverContent>
        </Popover>
        <div className="mt-4 flex justify-between">
          {Object.entries(moodColors).map(([mood, color]) => (
            <div key={mood} className="flex items-center">
              <div className={`w-4 h-4 ${color} rounded-full mr-2`}></div>
              <span>{mood}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

interface TapestryComponentProps {
  addPoints?: (amount: number) => void;
  translate?: TranslateFunction;
}

export default function TapestryComponent({
  addPoints,
  translate,
}: TapestryComponentProps) {
  const [activeStory, setActiveStory] = useState(0);
  const [activeTab, setActiveTab] = useState("feed");
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [posts, setPosts] = useState([
    {
      id: 1,
      author: "Sarah M.",
      content: translate
        ? translate(
            "Just discovered a great way to make veggies fun for kids!",
            "¡Acabo de descubrir una excelente manera de hacer que las verduras sean divertidas para los niños!",
          )
        : "Just discovered a great way to make veggies fun for kids!",
      likes: 15,
      comments: 2,
    },
    {
      id: 2,
      author: "Emily R.",
      content: translate
        ? translate(
            "Any tips for dealing with toddler tantrums?",
            "¿Algún consejo para lidiar con las rabietas de los niños pequeños?",
          )
        : "Any tips for dealing with toddler tantrums?",
      likes: 8,
      comments: 3,
    },
    {
      id: 3,
      author: "Jessica T.",
      content: translate
        ? translate(
            "Proud mom moment: My little one took her first steps today!",
            "Momento de orgullo materno: ¡Mi pequeño dio sus primeros pasos hoy!",
          )
        : "Proud mom moment: My little one took her first steps today!",
      likes: 32,
      comments: 5,
    },
    {
      id: 4,
      author: "Laura K.",
      content: translate
        ? translate(
            "Looking for book recommendations for toddlers. Any suggestions?",
            "Busco recomendaciones de libros para niños pequeños. ¿Alguna sugerencia?",
          )
        : "Looking for book recommendations for toddlers. Any suggestions?",
      likes: 12,
      comments: 7,
    },
    {
      id: 5,
      author: "Megan P.",
      content: translate
        ? translate(
            "Just meal prepped for the whole week. Feeling accomplished!",
            "Acabo de preparar las comidas para toda la semana. ¡Me siento realizada!",
          )
        : "Just meal prepped for the whole week. Feeling accomplished!",
      likes: 28,
      comments: 4,
    },
    {
      id: 6,
      author: "Rachel S.",
      content: translate
        ? translate(
            "First day back at work after maternity leave. Mixed emotions!",
            "Primer día de vuelta al trabajo después de la baja por maternidad. ¡Emociones encontradas!",
          )
        : "First day back at work after maternity leave. Mixed emotions!",
      likes: 45,
      comments: 10,
    },
  ]);

  const [momsCommunity, setMomsCommunity] = useState([
    { id: 1, name: "Anna", image: "/placeholder.svg?height=50&width=50" },
    { id: 2, name: "Beth", image: "/placeholder.svg?height=50&width=50" },
    { id: 3, name: "Cathy", image: "/placeholder.svg?height=50&width=50" },
    { id: 4, name: "Diana", image: "/placeholder.svg?height=50&width=50" },
  ]);

  const stories = [
    {
      id: 1,
      title: translate
        ? translate(
            "Overcoming Picky Eating",
            "Superando la alimentación selectiva",
          )
        : "Overcoming Picky Eating",
      author: translate
        ? translate("Nutritionist Dr. Smith", "Nutricionista Dra. Smith")
        : "Nutritionist Dr. Smith",
      image: "/placeholder.svg?height=100&width=100",
    },
    {
      id: 2,
      title: translate
        ? translate(
            "Sleep Training Success",
            "Éxito en el entrenamiento del sueño",
          )
        : "Sleep Training Success",
      author: translate
        ? translate("Sleep Coach Johnson", "Entrenadora de sueño Johnson")
        : "Sleep Coach Johnson",
      image: "/placeholder.svg?height=100&width=100",
    },
    {
      id: 3,
      title: translate
        ? translate(
            "Balancing Work and Family",
            "Equilibrando trabajo y familia",
          )
        : "Balancing Work and Family",
      author: translate
        ? translate("Career Counselor Brown", "Consejera de carrera Brown")
        : "Career Counselor Brown",
      image: "/placeholder.svg?height=100&width=100",
    },
  ];

  const handleNewPost = () => {
    if (addPoints) addPoints(10);
  };

  const handleLike = (id: number) => {
    setPosts(
      posts.map((post) =>
        post.id === id ? { ...post, likes: post.likes + 1 } : post,
      ),
    );
    if (addPoints) addPoints(1);
  };

  const handleAddMom = () => {
    const newMom = {
      id: momsCommunity.length + 1,
      name: `Mom ${momsCommunity.length + 1}`,
      image: "/placeholder.svg?height=50&width=50",
    };
    setMomsCommunity([...momsCommunity, newMom]);
  };

  const handleRemoveMom = (id: number) => {
    setMomsCommunity(momsCommunity.filter((mom) => mom.id !== id));
  };

  const nextSlide = () => {
    setCarouselIndex(
      (prevIndex) => (prevIndex + 1) % Math.ceil(posts.length / 5),
    );
  };

  const prevSlide = () => {
    setCarouselIndex(
      (prevIndex) =>
        (prevIndex - 1 + Math.ceil(posts.length / 5)) %
        Math.ceil(posts.length / 5),
    );
  };

  return (
    <Card className="p-2 sm:p-4">
      <CardHeader>
        <CardTitle className="text-lg sm:text-xl">
          {translate ? translate("Tapestry", "Tapiz") : "Tapestry"}
        </CardTitle>
        <CardDescription className="text-sm sm:text-base">
          {translate
            ? translate(
                "Connect with other moms and share your journey",
                "Conéctate con otras madres y comparte tu experiencia",
              )
            : "Connect with other moms and share your journey"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <h3 className="text-base sm:text-lg font-semibold mb-2">
            {translate
              ? translate("Mom's Community", "Comunidad de Madres")
              : "Mom's Community"}
          </h3>
          <div className="flex items-center space-x-2 overflow-x-auto pb-2">
            {momsCommunity.map((mom) => (
              <div key={mom.id} className="relative">
                <Avatar className="w-12 h-12">
                  <AvatarFallback>{mom.name[0]}</AvatarFallback>
                </Avatar>
                <button
                  className="absolute -top-1 -right-1 bg-red-500 rounded-full p-1"
                  onClick={() => handleRemoveMom(mom.id)}
                >
                  <X className="w-3 h-3 text-white" />
                </button>
              </div>
            ))}
            <Button variant="outline" size="icon" onClick={handleAddMom}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="mb-4">
          <h3 className="text-base sm:text-lg font-semibold mb-2">
            {translate
              ? translate("Featured Stories", "Historias Destacadas")
              : "Featured Stories"}
          </h3>
          <div className="flex space-x-2 sm:space-x-4 overflow-x-auto pb-2">
            {stories.map((story, index) => (
              <Card
                key={story.id}
                className={`flex-shrink-0 w-48 sm:w-64 cursor-pointer transition-all ${index === activeStory ? "ring-2 ring-purple-500" : ""}`}
                onClick={() => setActiveStory(index)}
              >
                <CardContent className="p-4">
                  <img
                    src={story.image}
                    alt={story.title}
                    className="w-full h-32 object-cover mb-2 rounded"
                  />
                  <h4 className="font-semibold">{story.title}</h4>
                  <p className="text-sm text-gray-600">{story.author}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="feed">
              {translate ? translate("Feed", "Noticias") : "Feed"}
            </TabsTrigger>
            <TabsTrigger value="community">
              {translate ? translate("Community", "Comunidad") : "Community"}
            </TabsTrigger>
          </TabsList>
          <TabsContent value="feed">
            <Button onClick={handleNewPost} className="w-full mb-4">
              <Plus className="w-4 h-4 mr-2" />{" "}
              {translate
                ? translate("Create New Post", "Crear Nueva Publicación")
                : "Create New Post"}
            </Button>
            <div className="relative">
              <div className="overflow-hidden">
                {[...Array(Math.ceil(posts.length / 5))].map((_, pageIndex) => (
                  <div
                    key={pageIndex}
                    className="transition-transform duration-300 ease-in-out"
                    style={{
                      transform: `translateY(-${carouselIndex * 100}%)`,
                    }}
                  >
                    {posts
                      .slice(pageIndex * 5, (pageIndex + 1) * 5)
                      .map((post) => (
                        <div
                          key={post.id}
                          className="flex items-center justify-between py-2 border-b last:border-b-0"
                        >
                          <div className="flex items-center space-x-2">
                            <Avatar className="w-8 h-8">
                              <AvatarFallback>{post.author[0]}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="text-sm font-medium">
                                {post.author}
                              </p>
                              <p className="text-xs text-gray-500">
                                {post.content}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleLike(post.id)}
                            >
                              <Heart
                                className={`w-3 h-3 mr-1 ${post.likes > 0 ? "fill-red-500" : ""}`}
                              />
                              <span className="text-xs">{post.likes}</span>
                            </Button>
                            <Button variant="ghost" size="sm">
                              <MessageCircle className="w-3 h-3 mr-1" />
                              <span className="text-xs">{post.comments}</span>
                            </Button>
                          </div>
                        </div>
                      ))}
                  </div>
                ))}
              </div>
              <Button
                variant="outline"
                size="icon"
                className="absolute top-1/2 left-0 transform -translate-y-1/2  -translate-x-1/2"
                onClick={prevSlide}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="absolute top-1/2 right-0 transform -translate-y-1/2 translate-x-1/2"
                onClick={nextSlide}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </TabsContent>
          <TabsContent value="community">
            <div className="space-y-4">
              <Input
                placeholder={
                  translate
                    ? translate(
                        "Search communities...",
                        "Buscar comunidades...",
                      )
                    : "Search communities..."
                }
              />
              <ScrollArea className="h-[400px]">
                {/* Community content here */}
              </ScrollArea>
            </div>
          </TabsContent>
        </Tabs>

        <MoodTracker translate={translate} />
      </CardContent>
    </Card>
  );
}
