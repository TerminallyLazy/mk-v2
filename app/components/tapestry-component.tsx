/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/no-unescaped-entities */

"use client"

import React, { useState } from 'react'
import { Button } from "@/app/components/ui/button"
import { Avatar, AvatarImage, AvatarFallback } from "@/app/components/ui/avatar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs"
import { Input } from "@/app/components/ui/input"
import { ScrollArea } from "@/app/components/ui/scroll-area"
import { Popover, PopoverContent, PopoverTrigger } from "@/app/components/ui/popover"
import { Heart, MessageCircle, Plus, ChevronLeft, ChevronRight, Image as ImageIcon, X } from 'lucide-react'
import { Calendar } from "@/app/components/ui/calendar"
import { cn } from "../../lib/utils"
import Image from "next/image"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/app/components/ui/dialog"
import { Textarea } from "@/app/components/ui/textarea"

// Define the TranslateFunction type
type TranslateFunction = (en: string, es: string) => string;

interface MoodTrackerProps {
  translate?: TranslateFunction;
}

function MoodTracker({ translate }: MoodTrackerProps) {
  const [selectedDates, setSelectedDates] = useState<Date[]>([])

  const moodColors = {
    1: "bg-red-200",
    2: "bg-orange-200",
    3: "bg-yellow-200",
    4: "bg-green-200",
    5: "bg-blue-200"
  }

  // const getMoodForDate = (date: Date) => {
  //   return ((date.getTime() % 5) + 1)
  // }

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle>{translate ? translate("Mood Tracker", "Rastreador de Estado de Ánimo") : "Mood Tracker"}</CardTitle>
        <CardDescription>
          {translate ? translate("Track your daily mood", "Registra tu estado de ánimo diario") : "Track your daily mood"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline">{translate ? translate("Select Mood", "Seleccionar Estado de Ánimo") : "Select Mood"}</Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <div className="rounded-md border">
              <Calendar
                mode="multiple"
                selected={selectedDates}
                onSelect={(dates) => dates && setSelectedDates(dates)}
                initialFocus
                numberOfMonths={1}
                fixedWeeks
                showOutsideDays={false}
                classNames={{
                  day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
                  day_today: "bg-accent text-accent-foreground",
                  day: cn(
                    "h-9 w-9 p-0 font-normal",
                    selectedDates.length > 0 && "aria-selected:opacity-100"
                  ),
                }}
              />
            </div>
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
  )
}

interface Mom {
  id: number;
  name: string;
  email: string;
  image: string;
  children: {
    name: string;
    age: number;
    diagnosis?: string;
  }[];
  interests: string[];
}

interface TapestryComponentProps {
  addPoints?: (amount: number) => void;
  translate?: TranslateFunction;
}

interface Post {
  id: number;
  author: string;
  content: string;
  likes: number;
  comments: number;
  viewCount?: number;
  lastViewed?: string;
}

export default function TapestryComponent({ addPoints, translate }: TapestryComponentProps) {
  const [activeTab, setActiveTab] = useState("feed");
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [posts, setPosts] = useState<Post[]>([
    { id: 1, author: "Sarah M.", content: translate ? translate("Just discovered a great way to make veggies fun for kids!", "¡Acabo de descubrir una excelente manera de hacer que las verduras sean divertidas para los niños!") : "Just discovered a great way to make veggies fun for kids!", likes: 15, comments: 2 },
    { id: 2, author: "Emily R.", content: translate ? translate("Any tips for dealing with toddler tantrums?", "¿Algún consejo para lidiar con las rabietas de los niños pequeños?") : "Any tips for dealing with toddler tantrums?", likes: 8, comments: 3 },
    { id: 3, author: "Jessica T.", content: translate ? translate("Proud mom moment: My little one took their first steps today!", "Momento de orgullo materno: ¡Mi pequeño dio sus primeros pasos hoy!") : "Proud mom moment: My little one took their first steps today!", likes: 32, comments: 5 },
    { id: 4, author: "Laura K.", content: translate ? translate("Looking for book recommendations for toddlers. Any suggestions?", "Busco recomendaciones de libros para niños pequeños. ¿Alguna sugerencia?") : "Looking for book recommendations for toddlers. Any suggestions?", likes: 12, comments: 7 },
    { id: 5, author: "Megan P.", content: translate ? translate("Just meal prepped for the whole week. Feeling accomplished!", "Acabo de preparar las comidas para toda la semana. ¡Me siento realizada!") : "Just meal prepped for the whole week. Feeling accomplished!", likes: 28, comments: 4 },
    { id: 6, author: "Rachel S.", content: translate ? translate("First day back at work after maternity leave. Mixed emotions!", "Primer día de vuelta al trabajo después de la baja por maternidad. ¡Emociones encontradas!") : "First day back at work after maternity leave. Mixed emotions!", likes: 45, comments: 10 },
  ]);

  const [momsCommunity, setMomsCommunity] = useState<Mom[]>([
    {
      id: 1,
      name: "Anna Smith",
      email: "anna.smith@example.com",
      image: "https://i.pravatar.cc/150?img=1",
      children: [
        { name: "Emma", age: 3, diagnosis: "Asthma" },
        { name: "Liam", age: 1 }
      ],
      interests: ["Cooking", "Yoga", "Reading"]
    },
    {
      id: 2,
      name: "Beth Johnson",
      email: "beth.johnson@example.com",
      image: "https://i.pravatar.cc/150?img=2",
      children: [
        { name: "Oliver", age: 4 },
        { name: "Sophia", age: 2, diagnosis: "Eczema" }
      ],
      interests: ["Gardening", "Photography", "Hiking"]
    },
    {
      id: 3,
      name: "Cathy Davis",
      email: "cathy.davis@example.com",
      image: "https://i.pravatar.cc/150?img=3",
      children: [
        { name: "Ethan", age: 5, diagnosis: "ADHD" }
      ],
      interests: ["Painting", "Swimming", "Volunteering"]
    },
    {
      id: 4,
      name: "Diana Wilson",
      email: "diana.wilson@example.com",
      image: "https://i.pravatar.cc/150?img=4",
      children: [
        { name: "Ava", age: 2 },
        { name: "Noah", age: 4 }
      ],
      interests: ["Baking", "Cycling", "Meditation"]
    },
  ]);


  const stories = [
    { 
      id: 1, 
      title: translate ? translate("Overcoming Picky Eating", "Superando la alimentación selectiva") : "Overcoming Picky Eating", 
      author: translate ? translate("Nutritionist Dr. Smith", "Nutricionista Dra. Smith") : "Nutritionist Dr. Smith", 
      image: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d",
      width: 100,
      height: 100
    },
    { 
      id: 2, 
      title: translate ? translate("Sleep Training Success", "Éxito en el entrenamiento del sueño") : "Sleep Training Success", 
      author: translate ? translate("Sleep Coach Johnson", "Entrenadora de sueño Johnson") : "Sleep Coach Johnson", 
      image: "https://images.unsplash.com/photo-1535571393765-ea44927160be",
      width: 100,
      height: 100
    },
    { 
      id: 3, 
      title: translate ? translate("Balancing Work and Family", "Equilibrando trabajo y familia") : "Balancing Work and Family", 
      author: translate ? translate("Career Counselor Brown", "Consejera de carrera Brown") : "Career Counselor Brown", 
      image: "https://images.unsplash.com/photo-1484863137850-59afcfe05386",
      width: 100,
      height: 100
    },
  ];

  const [isCreatingPost, setIsCreatingPost] = useState(false);
  const [newPost, setNewPost] = useState({
    content: '',
    image: null as File | null,
    imagePreview: null as string | null
  });

  const handleNewPost = () => {
    if (addPoints) addPoints(10);
  };

  const handleLike = (id: number) => {
    setPosts(posts.map(post => 
      post.id === id ? { ...post, likes: post.likes + 1 } : post
    ));
    if (addPoints) addPoints(1);
  };

  const handleAddMom = () => {
    const newMom: Mom = {
      id: momsCommunity.length + 1,
      name: `New Mom ${momsCommunity.length + 1}`,
      email: `newmom${momsCommunity.length + 1}@example.com`,
      image: `https://i.pravatar.cc/150?img=${momsCommunity.length + 5}`,
      children: [
        { name: `Child ${momsCommunity.length + 1}`, age: Math.floor(Math.random() * 5) + 1 }
      ],
      interests: ["Parenting", "Self-care", "Community"]
    };
    setMomsCommunity([...momsCommunity, newMom]);
  };

  const handleRemoveMom = (id: number) => {
    setMomsCommunity(momsCommunity.filter(mom => mom.id !== id));
  };

  const nextSlide = () => {
    setCarouselIndex((prevIndex) => (prevIndex + 1) % Math.ceil(posts.length / 5));
  };

  const prevSlide = () => {
    setCarouselIndex((prevIndex) => (prevIndex - 1 + Math.ceil(posts.length / 5)) % Math.ceil(posts.length / 5));
  };

  const handleStoryClick = (storyId: number) => {
    const story = stories.find(s => s.id === storyId);
    if (!story) return;

    // Track story engagement
    if (addPoints) addPoints(5);
    
    // Update story metrics
    const storyMetrics = {
      id: story.id,
      title: story.title,
      timestamp: new Date().toISOString(),
      type: 'view'
    };

    // Update local storage metrics
    const existingMetrics = JSON.parse(localStorage.getItem('storyMetrics') || '[]');
    localStorage.setItem('storyMetrics', JSON.stringify([
      ...existingMetrics,
      storyMetrics
    ]));
  };

  return (
    <Card className="p-2 sm:p-4 bg-background dark:bg-background">
      <CardHeader>
        <CardTitle className="text-lg sm:text-xl text-foreground">Tapestry</CardTitle>
        <CardDescription className="text-sm sm:text-base text-muted-foreground">
          Connect with other moms and share your journey
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <h3 className="text-base sm:text-lg font-semibold mb-2 text-foreground">Mom's Community</h3>
          <div className="flex items-center space-x-2 overflow-x-auto pb-2">
            {momsCommunity.map((mom) => (
              <Popover key={mom.id}>
                <PopoverTrigger asChild>
                  <Avatar 
                    className="w-12 h-12 cursor-pointer"
                  >
                    <AvatarImage src={mom.image} alt={mom.name} />
                    <AvatarFallback>{mom.name[0]}</AvatarFallback>
                  </Avatar>
                </PopoverTrigger>
                <PopoverContent className="w-80 p-4">
                  <div className="text-sm">
                    <p className="font-bold">{mom.name}</p>
                    <p>{mom.email}</p>
                    <p className="mt-1 font-semibold">Children:</p>
                    <ul className="list-disc list-inside">
                      {mom.children.map((child, index) => (
                        <li key={index}>
                          {child.name} ({child.age} y/o)
                          {child.diagnosis && ` - ${child.diagnosis}`}
                        </li>
                      ))}
                    </ul>
                    <p className="mt-1 font-semibold">Interests:</p>
                    <p>{mom.interests.join(", ")}</p>
                    <Button 
                      variant="link" 
                      className="mt-2 p-0 h-auto text-red-500 hover:text-red-700"
                      onClick={() => handleRemoveMom(mom.id)}
                    >
                      Remove from community
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
            ))}
            <Button variant="outline" size="icon" onClick={handleAddMom}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="mb-4">
          <h3 className="text-base sm:text-lg font-semibold mb-2 text-foreground">Featured Stories</h3>
          <div className="flex space-x-2 sm:space-x-4 overflow-x-auto pb-2">
            {stories.map((story) => (
              <Card 
                key={story.id} 
                className="flex-shrink-0 w-48 sm:w-64 cursor-pointer transition-all bg-card dark:bg-card hover:bg-accent dark:hover:bg-accent"
                onClick={() => handleStoryClick(story.id)}
              >
                <CardContent className="p-4">
                  <Image 
                    src={story.image} 
                    alt={story.title} 
                    width={story.width}
                    height={story.height}
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
          <TabsList className="grid w-full grid-cols-2 bg-muted dark:bg-muted">
            <TabsTrigger value="feed" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              Feed
            </TabsTrigger>
            <TabsTrigger value="community" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              Community
            </TabsTrigger>
          </TabsList>
          <TabsContent value="feed">
            <Dialog open={isCreatingPost} onOpenChange={setIsCreatingPost}>
              <DialogTrigger asChild>
                <Button className="w-full mb-4">
                  <Plus className="w-4 h-4 mr-2" /> Create New Post
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-card dark:bg-card border-border">
                <DialogHeader>
                  <DialogTitle>Create New Post</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <Textarea
                    placeholder="What's on your mind?"
                    value={newPost.content}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setNewPost({ ...newPost, content: e.target.value })}
                    className="min-h-[100px] bg-background dark:bg-background"
                  />
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      onClick={() => document.getElementById('post-image')?.click()}
                      className="bg-background dark:bg-background"
                    >
                      <ImageIcon className="h-4 w-4 mr-2" />
                      Add Image
                    </Button>
                    <input
                      id="post-image"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            setNewPost({
                              ...newPost,
                              image: file,
                              imagePreview: reader.result as string
                            });
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </div>
                  {newPost.imagePreview && (
                    <div className="relative">
                      <Image
                        src={newPost.imagePreview}
                        alt="Post preview"
                        width={300}
                        height={200}
                        className="rounded-md object-cover"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2"
                        onClick={() => setNewPost({ ...newPost, image: null, imagePreview: null })}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setIsCreatingPost(false)}>
                      Cancel
                    </Button>
                    <Button onClick={() => {
                      // Handle post creation
                      handleNewPost();
                      setIsCreatingPost(false);
                      setNewPost({ content: '', image: null, imagePreview: null });
                    }}>
                      Post
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
            <div className="relative">
              <div className="overflow-hidden space-y-4">
                {[...Array(Math.ceil(posts.length / 5))].map((_, pageIndex) => (
                  <div
                    key={pageIndex}
                    className="transition-transform duration-300 ease-in-out"
                    style={{ transform: `translateY(-${carouselIndex * 100}%)` }}
                  >
                    {posts.slice(pageIndex * 5, (pageIndex + 1) * 5).map(post => (
                      <Card key={post.id} className="mb-4 last:mb-0">
                        <CardContent className="flex items-center justify-between py-2">
                          <div className="flex items-center space-x-2">
                            <Avatar className="w-8 h-8">
                              <AvatarFallback>{post.author[0]}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="text-sm font-medium">{post.author}</p>
                              <p className="text-xs text-gray-500">{post.content}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button variant="ghost" size="sm" onClick={() => handleLike(post.id)}>
                              <Heart className={`w-3 h-3 mr-1 ${post.likes > 0 ? 'fill-red-500' : ''}`} />
                              <span className="text-xs">{post.likes}</span>
                            </Button>
                            <Button variant="ghost" size="sm">
                              <MessageCircle className="w-3 h-3 mr-1" />
                              <span className="text-xs">{post.comments}</span>
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ))}
              </div>
              
              <Button
                variant="outline"
                size="icon"
                className="absolute top-1/2 left-0 transform -translate-y-1/2 -translate-x-1/2"
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
              <Input placeholder={translate ? translate("Search communities...", "Buscar comunidades...") : "Search communities..."} />
              <ScrollArea className="h-[400px]">
                {/* Community content here */}
              </ScrollArea>
            </div>
          </TabsContent>
        </Tabs>
        
        <MoodTracker translate={translate} />
      </CardContent>
    </Card>
  )
}