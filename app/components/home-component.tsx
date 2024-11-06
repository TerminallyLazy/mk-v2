"use client";
import React, { useState } from 'react'
import { Button } from "@/app/components/ui/button"
import { Input } from "@/app/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card"
import { ScrollArea } from "@/app/components/ui/scroll-area"
import { Send, Share2, Paperclip, Clock } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from "@/app/components/ui/popover"
import Image from "next/image"
import fruitsImage from "@/public/fruits.jpeg";
import babyNappingImage from "@/public/babynapping.webp";
import momWorkWithKidImage from "@/public/momworkwithkid.webp";
import medMythImage from "@/public/medmyth.png";
import momClappingWithKidImage from "@/public/momclappingwithkid.webp";


type TranslateFunction = (en: string, es: string) => string;

interface HomeComponentProps {
  addPoints: (amount: number) => void;
  translate: TranslateFunction;
}

const defaultTranslate: TranslateFunction = (en: string) => en;

const QuestionForm: React.FC<{
  question: string;
  setQuestion: React.Dispatch<React.SetStateAction<string>>;
  handleSubmit: (e: React.FormEvent, type: string) => void;
  translate: TranslateFunction;
}> = ({ question, setQuestion, handleSubmit, translate }) => (
  <form className="space-y-2" onSubmit={(e) => handleSubmit(e, 'General')}>
    <div className="flex space-x-2">
      <Input 
        placeholder={translate("Type your question here...", "Escribe tu pregunta aquí...")}
        value={question} 
        onChange={(e) => setQuestion(e.target.value)}
        className="flex-grow"
      />
      <Button type="submit">
        <Send className="h-4 w-4" />
        <span className="sr-only">{translate("Send", "Enviar")}</span>
      </Button>
    </div>
  </form>
);

const SourcesList: React.FC<{ translate: TranslateFunction }> = ({ translate }) => (
  <div className="mt-2 p-2 bg-gray-100 rounded-md">
    <h4 className="font-semibold mb-1">{translate("Sources:", "Fuentes:")}</h4>
    <ul className="list-disc list-inside text-sm">
      <li>{translate("American Academy of Pediatrics", "Academia Americana de Pediatría")}</li>
      <li>{translate("World Health Organization", "Organización Mundial de la Salud")}</li>
      <li>{translate("Centers for Disease Control and Prevention", "Centros para el Control y la Prevención de Enfermedades")}</li>
    </ul>
  </div>
);

const MedicationLookup: React.FC<{
  translate: TranslateFunction;
  handleSubmit: (e: React.FormEvent, type: string) => void;
}> = ({ translate, handleSubmit }) => (
  <Popover>
    <PopoverTrigger asChild>
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="px-2 py-1 text-xs"
      >
        {translate("Med Lookup", "Búsqueda de Medicamentos")}
      </Button>
    </PopoverTrigger>
    <PopoverContent className="w-80">
      <div className="grid gap-4">
        <div className="space-y-2">
          <h4 className="font-medium leading-none">{translate("Medication Lookup", "Búsqueda de Medicamentos")}</h4>
          <p className="text-sm text-muted-foreground">
            {translate("Please upload a photo of the medication bottle, and I'll provide information on its use, dosage, and other relevant details.", "Por favor, sube una foto del frasco del medicamento y te proporcionaré información sobre su uso, dosis y otros detalles relevantes.")}
          </p>
        </div>
        <div className="grid gap-2">
          <div className="grid grid-cols-3 items-center gap-4">
            <Button size="sm" className="w-full col-span-2" onClick={() => document.getElementById('med-photo-upload')?.click()}>
              <Paperclip className="h-4 w-4 mr-2" />
              {translate("Add Photo", "Agregar Foto")}
            </Button>
            <input
              id="med-photo-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                console.log('File uploaded:', e.target.files?.[0]?.name)
              }}
            />
          </div>
          <Button size="sm" className="w-full" onClick={(e) => handleSubmit(e, 'Med Lookup')}>
            {translate("Search", "Buscar")}
          </Button>
        </div>
      </div>
    </PopoverContent>
  </Popover>
);

const FeaturedStory: React.FC<{
  story: {
    title: string;
    titleEs: string;
    image: string;
    synopsis: string;
    synopsisEs: string;
  };
  translate: TranslateFunction;
  handleShare: (e: React.FormEvent) => void;
  shareText: string;
  setShareText: React.Dispatch<React.SetStateAction<string>>;
}> = ({ story, translate, handleShare, shareText, setShareText }) => (
  <Card className="md:w-2/3 bg-white">
    <CardContent className="p-4 flex flex-col space-y-4">
      <Image 
        src={story.image}
        alt={translate(story.title, story.titleEs)} 
        className="w-full h-[400px] object-cover mb-4"
        width={800}
        height={400}
      />
      <CardTitle className="text-xl mb-2">{translate(story.title, story.titleEs)}</CardTitle>
      <CardDescription className="mb-4">{translate(story.synopsis, story.synopsisEs)}</CardDescription>
      <form onSubmit={handleShare} className="flex space-x-2">
        <Input 
          placeholder={translate("Share with friend or family...", "Compartir con amigo o familiar...")}
          value={shareText} 
          onChange={(e) => setShareText(e.target.value)}
          className="flex-grow"
        />
        <Button type="submit">
          <Share2 className="h-4 w-4 mr-2" />
          {translate("Share", "Compartir")}
        </Button>
      </form>
    </CardContent>
  </Card>
);

const StoryList: React.FC<{
  stories: Array<{
    id: number;
    title: string;
    titleEs: string;
    image: string;
    synopsis: string;
    synopsisEs: string;
  }>;
  translate: TranslateFunction;
}> = ({ stories, translate }) => (
  <div className="md:w-1/3 space-y-4">
    {stories.map((story) => (
      <Card key={story.id} className="bg-white">
        <CardContent className="p-4 flex items-center space-x-4">
          <Image 
            src={story.image} 
            alt={translate(story.title, story.titleEs)} 
            className="w-1/3 h-24 object-cover"
            width={200}
            height={96}
          />
          <div>
            <CardTitle className="text-sm mb-1">{translate(story.title, story.titleEs)}</CardTitle>
            <CardDescription className="text-xs">{translate(story.synopsis, story.synopsisEs)}</CardDescription>
          </div>
        </CardContent>
      </Card>
    ))}
  </div>
);

const RecentPosts: React.FC<{
  posts: Array<{
    id: number;
    title: string;
    titleEs: string;
    date: string;
    dateEs: string;
  }>;
  translate: TranslateFunction;
}> = ({ posts, translate }) => (
  <div className="bg-white rounded-lg p-4">
    <h2 className="text-xl font-bold mb-4 flex items-center">
      <Clock className="mr-2 h-5 w-5" />
      {translate("Recent Posts", "Publicaciones Recientes")}
    </h2>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {posts.map((post) => (
        <Card key={post.id} className="bg-gray-50">
          <CardContent className="p-4">
            <CardTitle className="text-sm mb-2">{translate(post.title, post.titleEs)}</CardTitle>
            <CardDescription className="text-xs text-gray-500">
              {translate(post.date, post.dateEs)}
            </CardDescription>
          </CardContent>
        </Card>
      ))}
    </div>
  </div>
);

export default function HomeComponent({ addPoints = () => {}, translate = defaultTranslate }: HomeComponentProps) {
  const [question, setQuestion] = useState('')
  const [conversation, setConversation] = useState<{role: 'user' | 'assistant', content: string}[]>([])
  const [shareText, setShareText] = useState('')
  const [showSources, setShowSources] = useState(false)

  const toggleSources = () => {
    setShowSources(!showSources)
  }

  const stories = [
    { id: 1, title: "Mom's Innovative Approach to Picky Eating", titleEs: "Enfoque innovador de una madre para niños quisquillosos con la comida", image: fruitsImage, synopsis: "Learn how one mom transformed mealtime battles into fun food adventures.", synopsisEs: "Descubre cómo una madre transformó las batallas a la hora de comer en divertidas aventuras culinarias." },
    { id: 2, title: "The Power of Positive Reinforcement", titleEs: "El poder del refuerzo positivo", image: momClappingWithKidImage, synopsis: "Discover effective ways to encourage good behavior in children.", synopsisEs: "Descubre formas efectivas de fomentar el buen comportamiento en los niños." },
    { id: 3, title: "Balancing Work and Motherhood", titleEs: "Equilibrando el trabajo y la maternidad", image: momWorkWithKidImage, synopsis: "Tips from successful moms on managing career and family life.", synopsisEs: "Consejos de madres exitosas sobre cómo manejar la carrera y la vida familiar." },
    { id: 4, title: "Creating a Safe Sleep Environment", titleEs: "Creando un ambiente seguro para dormir", image: babyNappingImage, synopsis: "Expert advice on setting up the perfect nursery for your baby.", synopsisEs: "Consejos de expertos para preparar la habitación perfecta para tu bebé." },
    { id: 5, title: "Medical Myths Debunked", titleEs: "Mitos médicos desmentidos", image: medMythImage, synopsis: "Separating fact from fiction in common medical beliefs about children's health.", synopsisEs: "Separando la realidad de la ficción en las creencias médicas comunes sobre la salud infantil." }
]

  const recentPosts = [
    { id: 1, title: "Understanding Childhood Vaccines", titleEs: "Entendiendo las vacunas infantiles", date: "2 hours ago", dateEs: "hace 2 horas" },
    { id: 2, title: "Healthy Snacks for Growing Kids", titleEs: "Meriendas saludables para niños en crecimiento", date: "4 hours ago", dateEs: "hace 4 horas" },
    { id: 3, title: "Managing Screen Time Effectively", titleEs: "Gestionando efectivamente el tiempo de pantalla", date: "6 hours ago", dateEs: "hace 6 horas" }
  ]

  const handleSubmit = (e: React.FormEvent, type: string) => {
    e.preventDefault()
    if (question.trim()) {
      setConversation([...conversation, { role: 'user', content: `[${type}] ${question}` }])
      setTimeout(() => {
        setConversation(prev => [...prev, { role: 'assistant', content: translate(`This is a simulated AI response to your ${type} question: "${question}". In a real implementation, this would connect to an AI service using reliable medical sources.`, `Esta es una respuesta simulada de IA a tu pregunta de ${type}: "${question}". En una implementación real, esto se conectaría a un servicio de IA utilizando fuentes médicas confiables.`) }])
        addPoints(5)
      }, 1000)
      setQuestion('')
    }
  }

  const handleShare = (e: React.FormEvent) => {
    e.preventDefault()
    if (shareText.trim()) {
      console.log(`Sharing "${shareText}" with friend or family member`)
      setShareText('')
      addPoints(5)
    }
  }

  return (
    <div className="space-y-6 sm:space-y-8 bg-[#E7E2F3] p-4">
      <div className="text-2xl sm:text-[40pt] font-serif text-center">
        {translate("Welcome Back Megan", "Bienvenida de nuevo Megan")}
      </div>
      <Card className="p-4 bg-white">
        <CardHeader>
          <CardTitle>{translate("Ask a Question", "Haz una pregunta")}</CardTitle>
          <CardDescription>{translate("Get answers from reliable  medical sources", "Obtén respuestas de fuentes médicas confiables")}</CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[80px] mb-4">
            {conversation.map((message, index) => (
              <div key={index} className={`mb-4 ${message.role === 'assistant' ? 'text-blue-600' : 'text-gray-800'}`}>
                <strong>{message.role === 'assistant' ? translate('AI: ', 'IA: ') : translate('You: ', 'Tú: ')}</strong>
                {message.content}
              </div>
            ))}
          </ScrollArea>
          <QuestionForm
            question={question}
            setQuestion={setQuestion}
            handleSubmit={handleSubmit}
            translate={translate}
          />
          <div className="flex justify-start space-x-2 mt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="px-2 py-1 text-xs"
              onClick={toggleSources}
            >
              {translate("Sources", "Fuentes")}
            </Button>
            <MedicationLookup translate={translate} handleSubmit={handleSubmit} />
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="px-2 py-1 text-xs"
              onClick={(e) => handleSubmit(e, 'Mental & Behavioral Health')}
            >
              {translate("Mental & Behavioral Health", "Salud Mental y Conductual")}
            </Button>
          </div>
          {showSources && <SourcesList translate={translate} />}
        </CardContent>
      </Card>
      <div className="flex flex-col md:flex-row gap-4">
        <FeaturedStory
          story={{
            ...stories[0],
            image: stories[0].image.src // Convert StaticImageData to string URL
          }}
          translate={translate}
          handleShare={handleShare}
          shareText={shareText}
          setShareText={setShareText}
        />
        <StoryList 
          stories={stories.map(story => ({
            ...story,
            image: story.image.src // Convert each story's StaticImageData to string URL
          }))} 
          translate={translate} 
        />
      </div>
      <RecentPosts posts={recentPosts} translate={translate} />
    </div>
  )
}

