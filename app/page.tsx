"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@/app/components/ui/button";
import { Card, CardContent } from "@/app/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs";
import HomeComponent from "@/app/components/home-component";
import { CareLogComponentComponent } from "@/app/components/care-log-component";
import { MilestonesComponent } from "@/app/components/milestones-component";
import { MyLibraryComponentComponent } from "@/app/components/my-library-component";
import TapestryComponent from "@/app/components/tapestry-component";
import { PodcastComponent } from "@/app/components/podcast-component";
import { ThemeToggle } from "@/app/components/ui/theme-toggle";
import { AnimatedGlobe } from "@/app/components/ui/animated-globe";
import Image from "next/image";
import { AuthScreen } from "@/app/components/auth-screen";

export default function Home() {
  const [username, setUsername] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [language, setLanguage] = useState("en");
  const [activeTab, setActiveTab] = useState("home");

  const translate = useCallback((en: string, es: string) => {
    return language === "en" ? en : es;
  }, [language]);

  const handleAuthComplete = (name: string) => {
    setUsername(name);
  };

  useEffect(() => {
    // Check for existing username
    const savedUsername = localStorage.getItem('username');
    setUsername(savedUsername);
    setIsLoading(false);
  }, []);

  const handleAddPoints = (amount: number) => {
    // setPoints(prev => prev + amount);
  };

  const toggleLanguage = () => {
    setLanguage(prev => prev === "en" ? "es" : "en");
  };

  if (isLoading) {
    return null; // or a loading spinner
  }

  if (!username) {
    return <AuthScreen onComplete={handleAuthComplete} translate={translate} />;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-primary/95 text-primary-foreground py-4 backdrop-blur-sm border-b border-border/40 sticky top-0 z-50">
        <div className="container mx-auto flex justify-between items-center px-4">
          <div className="flex items-center transition-transform hover:scale-102">
            <Image
              src="/momkidz-white.png"
              alt="MomsKidz Logo"
              width={280}
              height={84}
              className="w-auto h-16 object-contain drop-shadow-md transition-all duration-300 hover:drop-shadow-xl"
              priority
            />
          </div>
          <div className="flex items-center gap-6">
            <Button
              onClick={toggleLanguage}
              className="text-base px-4 py-2 hover:scale-105 transition-all duration-300 bg-primary-foreground/10 hover:bg-primary-foreground/20"
              variant="ghost"
              size="sm"
            >
              <AnimatedGlobe isSpanish={language === "es"} />
            </Button>
            <div className="p-1 rounded-full bg-primary-foreground/10">
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      <main className="flex-grow container mx-auto p-4 bg-background">
        <Card className="border-border">
          <CardContent className="p-6">
            <Tabs 
              defaultValue="home" 
              value={activeTab} 
              onValueChange={setActiveTab}
            >
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
                <HomeComponent 
                  addPoints={handleAddPoints} 
                  translate={translate}
                  toggleLanguage={toggleLanguage}
                  isSpanish={language === 'es'}
                  username={username || ''}
                />
              </TabsContent>
              
              <TabsContent value="tapestry">
                <TapestryComponent addPoints={handleAddPoints} translate={translate} />
              </TabsContent>
              
              <TabsContent value="carelog">
                <CareLogComponentComponent addPoints={handleAddPoints} translate={translate} />
              </TabsContent>
              
              <TabsContent value="milestones">
                <MilestonesComponent />
              </TabsContent>
              
              <TabsContent value="library">
                <MyLibraryComponentComponent translate={translate} />
              </TabsContent>
              
              <TabsContent value="podcasts">
                <PodcastComponent translate={translate} />
              </TabsContent>
            </Tabs> 
          </CardContent>
        </Card>
      </main>

      <footer className="bg-card dark:bg-card text-card-foreground border-t border-border">
        <div className="container mx-auto py-4 flex items-center justify-center space-x-4">
          <span>© {new Date().getFullYear()} MomsKidz</span>
          <Image
            src="/logo.png"
            alt="MomsKidz Logo"
            width={40}
            height={40}
            className="w-auto h-8 object-contain"
          />
          <span>{translate("All rights reserved.", "Todos los derechos reservados.")}</span>
        </div>
      </footer>
    </div>
  );
}
