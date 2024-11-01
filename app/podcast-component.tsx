import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Play, Pause, SkipBack, SkipForward, Video, FileText, MoveRight } from 'lucide-react'

interface Podcast {
  id: number
  title: string
  description: string
  duration: string
  image: string
  link: string
  isVideo?: boolean
  textFile?: string
}

const initialPodcasts: Podcast[] = [
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
  // ... other podcasts
]

const suggestedPodcasts: Podcast[] = [
  // ... suggested podcasts
]

interface PodcastComponentProps {
  translate: (en: string, es: string) => string
  addPoints: (amount: number) => void
}

export default function PodcastComponent({ translate, addPoints }: PodcastComponentProps) {
  const [featuredPodcasts, setFeaturedPodcasts] = useState<Podcast[]>(initialPodcasts)
  const [selectedPodcast, setSelectedPodcast] = useState<Podcast | null>(null)
  const [surveyResponses, setSurveyResponses] = useState({
    rating: 0,
    question2: '',
    question3: '',
    futureTopics: ''
  })

  const handleSelectPodcast = (podcast: Podcast) => {
    setSelectedPodcast(podcast)
  }

  const handleMovePodcast = (podcast: Podcast) => {
    setFeaturedPodcasts(prev => [...prev, podcast])
    addPoints(5) // Add points when a podcast is moved to featured
  }

  const handleSurveySubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Survey responses:', surveyResponses)
    alert(translate('Thank you for your feedback!', '¡Gracias por tus comentarios!'))
    addPoints(10) // Add points for submitting feedback
  }

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>{translate("Featured Podcasts", "Podcasts Destacados")}</CardTitle>
          <CardDescription>{translate("Listen to our curated selection of podcasts for mothers", "Escucha nuestra selección de podcasts para madres")}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {featuredPodcasts.map((podcast) => (
              <Card key={podcast.id} className="flex items-center p-4 cursor-pointer hover:bg-gray-100" onClick={() => handleSelectPodcast(podcast)}>
                <img src={podcast.image} alt={podcast.title} className="w-16 h-16 rounded-md mr-4 object-cover" />
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
                <img src={podcast.image} alt={podcast.title} className="w-12 h-12 rounded-md mr-3 object-cover" />
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

      <Card>
        <CardHeader>
          <CardTitle>{translate("Feedback Survey", "Encuesta de Retroalimentación")}</CardTitle>
          <CardDescription>{translate("Share your thoughts about the podcast!", "¡Comparte tus pensamientos sobre el podcast!")}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSurveySubmit} className="space-y-6">
            {/* Survey form fields... */}
            <Button type="submit">{translate("Submit Feedback", "Enviar Retroalimentación")}</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}