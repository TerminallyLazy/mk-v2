'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card"
import { Button } from "@/app/components/ui/button"
import { Textarea } from "@/app/components/ui/textarea"
import { Label } from "@/app/components/ui/label"
import { Video, FileText, Home, Search, User, MoveRight } from 'lucide-react'
import Image from "next/image";

interface PodcastProps {
  translate: (en: string, es: string) => string;
}

interface PodcastItems {
  id: number
  title: string
  description: string
  duration: string
  image: string
  link: string
  isVideo?: boolean
  textFile?: string
}

const initialPodcasts: PodcastItems[] = [
  {
    id: 1,
    title: "Health Series with a Guide",
    description: "Expert Health Advice for Moms: Building Health Literacy, One Episode at a Time",
    duration: "32:15",
    image: "https://moms-kidz-app.public.blob.vercel-storage.com/tudor-mom-NJOhEZ0.png",
    link: "https://podcasters.spotify.com/pod/show/moms-kidz/episodes/Moms-Know-Health-e2pv5vm",
    isVideo: true,
    textFile: "/moms-know-health-transcript.txt"
  },
  {
    id: 2,
    title: "Nurturing Young Minds",
    description: "Mental health strategies for children",
    duration: "40:30",
    image: "/placeholder.svg?height=100&width=100",
    link: "#",
    textFile: "/nurturing-young-minds-transcript.txt"
  },
  {
    id: 3,
    title: "Navigating Motherhood",
    description: "Tips and tricks for new moms",
    duration: "45:30",
    image: "/placeholder.svg?height=100&width=100",
    link: "#",
    textFile: "/navigating-motherhood-transcript.txt"
  }
]

const suggestedPodcasts: PodcastItems[] = [
  {
    id: 5,
    title: "Toddler Tantrums Tamed",
    description: "Strategies for managing toddler behavior",
    duration: "40:20",
    image: "/placeholder.svg?height=100&width=100",
    link: "#",
    textFile: "/toddler-tantrums-transcript.txt"
  },
  {
    id: 6,
    title: "Elementary Education Essentials",
    description: "Supporting your 6-8 year old's learning",
    duration: "35:45",
    image: "/placeholder.svg?height=100&width=100",
    link: "#",
    textFile: "/elementary-education-transcript.txt"
  },
  {
    id: 7,
    title: "Balancing Act: Work and Family",
    description: "Tips for working moms with young kids",
    duration: "42:10",
    image: "/placeholder.svg?height=100&width=100",
    link: "#",
    textFile: "/work-family-balance-transcript.txt"
  }
]

// function translate(en: string, es: string): string {
//   // In a real application, this would be replaced with a proper translation function
//   return en
// }

export function PodcastComponent({ translate }: PodcastProps) {
  const [featuredPodcasts, setFeaturedPodcasts] = useState<PodcastItems[]>(initialPodcasts)
  const [selectedPodcast, setSelectedPodcast] = useState<PodcastItems | null>(null)
  const [surveyResponses, setSurveyResponses] = useState({
    rating: 0,
    question2: '',
    question3: '',
    futureTopics: ''
  })

  const handleViewSelectedPodcast = React.useCallback(() => {
    if (selectedPodcast) {
      console.log('Viewing Podcast:', selectedPodcast.title)
    }
  }, [selectedPodcast])

  useEffect(() => {
    handleViewSelectedPodcast();
  }, [handleViewSelectedPodcast]);

  const handleSelectPodcast = (podcast: PodcastItems) => {
    setSelectedPodcast(podcast)
  }

  const handleMovePodcast = (podcast: PodcastItems) => {
    setFeaturedPodcasts(prev => [...prev, podcast])
  }

  const handleSurveySubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Survey responses:', surveyResponses)
    alert(translate('Thank you for your feedback!', '¡Gracias por tus comentarios!'))
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-2xl font-bold text-gray-900">{translate("Moms Kidz Podcasts", "Podcasts de Moms Kidz")}</h1>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>{translate("Featured Podcasts", "Podcasts Destacados")}</CardTitle>
              <CardDescription>{translate("Listen to our curated selection of podcasts for mothers", "Escucha nuestra selección de podcasts para madres")}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {featuredPodcasts.map((podcast) => (
                  <Card key={podcast.id} className="flex items-center p-4 cursor-pointer hover:bg-gray-100" onClick={() => handleSelectPodcast(podcast)}>
                    <Image
                    src={podcast.image}
                    alt={podcast.title}
                    width={64}
                    height={64}
                    className="rounded-md object-cover"
                    />
                    <div className="flex-grow">
                      <h3 className="font-semibold">{podcast.title}</h3>
                      <p className="text-sm text-gray-500">{podcast.description}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="text-sm text-gray-500">{podcast.duration}</div>
                      {podcast.textFile && (
                        <a href={podcast.textFile} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-700">
                          <FileText className="h-4 w-4" />
                        </a>
                      )}
                      {podcast.isVideo && (
                        <div className="bg-purple-500 rounded-full p-1">
                          <Video className="h-4 w-4 text-white" />
                        </div>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{translate("Suggested Podcasts", "Podcasts Sugeridos")}</CardTitle>
              <CardDescription>{translate("For moms with toddlers and kids aged 6-8", "Para mamás con niños pequeños y de 6 a 8 años")}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {suggestedPodcasts.map((podcast) => (
                  <Card key={podcast.id} className="flex items-center p-4">
                    <Image
                    src={podcast.image}
                    alt={podcast.title}
                    width={64}
                    height={64}
                    className="rounded-md object-cover"
                    />
                    <div className="flex-grow">
                      <h3 className="font-semibold text-sm">{podcast.title}</h3>
                      <p className="text-xs text-gray-500">{podcast.description}</p>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => handleMovePodcast(podcast)}>
                      <MoveRight className="h-4 w-4 mr-1" />
                      {translate("Move", "Mover")}
                    </Button>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-8">
          <CardHeader>
            <CardTitle>{translate("Feedback Survey", "Encuesta de Retroalimentación")}</CardTitle>
            <CardDescription>{translate("Share your thoughts about the podcast!", "¡Comparte tus pensamientos sobre el podcast!")}</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSurveySubmit} className="space-y-6">
              <div>
                <Label htmlFor="rating">{translate("How would you rate this podcast? (0-5)", "¿Cómo calificarías este podcast? (0-5)")}</Label>
                <div className="flex items-center space-x-2 mt-2">
                  {[0, 1, 2, 3, 4, 5].map((value) => (
                    <Button
                      key={value}
                      type="button"
                      variant={surveyResponses.rating === value ? "default" : "outline"}
                      onClick={() => setSurveyResponses(prev => ({ ...prev, rating: value }))}
                    >
                      {value}
                    </Button>
                  ))}
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  {translate("0 - Poor, 5 - Great", "0 - Pobre, 5 - Excelente")}
                </p>
              </div>
              <div>
                <Label htmlFor="question2">{translate("What did you find most helpful about this podcast?", "¿Qué te pareció más útil de este podcast?")}</Label>
                <Textarea
                  id="question2"
                  value={surveyResponses.question2}
                  onChange={(e) => setSurveyResponses(prev => ({ ...prev, question2: e.target.value }))}
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="question3">{translate("How could we improve our podcasts?", "¿Cómo podríamos mejorar nuestros podcasts?")}</Label>
                <Textarea
                  id="question3"
                  value={surveyResponses.question3}
                  onChange={(e) => setSurveyResponses(prev => ({ ...prev, question3: e.target.value }))}
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="futureTopics">{translate("What topics would you like to see in future podcasts?", "¿Qué temas te gustaría ver en futuros podcasts?")}</Label>
                <Textarea
                  id="futureTopics"
                  value={surveyResponses.futureTopics}
                  onChange={(e) => setSurveyResponses(prev => ({ ...prev, futureTopics: e.target.value }))}
                  className="mt-2"
                />
              </div>
              <Button type="submit">{translate("Submit Feedback", "Enviar Retroalimentación")}</Button>
            </form>
          </CardContent>
        </Card>
      </main>

      <footer className="bg-white shadow-md mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <p className="text-sm text-gray-500">{translate("© 2023 Moms Kidz. All rights reserved.", "© 2023 Moms Kidz. Todos los derechos reservados.")}</p>
          <nav className="flex space-x-4">
            <Button variant="ghost" size="sm">
              <Home className="h-4 w-4 mr-2" />
              {translate("Home", "Inicio")}
            </Button>
            <Button variant="ghost" size="sm">
              <Search className="h-4 w-4 mr-2" />
              {translate("Search", "Buscar")}
            </Button>
            <Button variant="ghost" size="sm">
              <User className="h-4 w-4 mr-2" />
              {translate("Profile", "Perfil")}
            </Button>
          </nav>
        </div>
      </footer>
    </div>
  );
}
