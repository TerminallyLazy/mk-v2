"use client";

import React from "react";
import { Button } from "@/app/components/ui/button";
import { Card, CardContent } from "@/app/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs";
import  HomeComponent  from "@/app/components/home-component";
import { CareLogComponentComponent } from "@/app/components/care-log-component";
import { MilestonesComponent } from "@/app/components/milestones-component";
import { MyLibraryComponentComponent } from "@/app/components/my-library-component";
import TapestryComponent from "@/app/components/tapestry-component";
import { PodcastComponent } from "@/app/components/podcast-component";

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

  const translate = React.useMemo(() => {
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
            <Tabs defaultValue="home" value={activeTab} onValueChange={setActiveTab}>
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
              
              <TabsContent value="tapestry">
                <TapestryComponent addPoints={addPoints} translate={translate} />
              </TabsContent>
              
              <TabsContent value="carelog">
                <CareLogComponentComponent addPoints={addPoints} translate={translate} />
              </TabsContent>
              
              <TabsContent value="milestones">
                <MilestonesComponent  />
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

      <footer className="bg-gray-100 text-gray-600 p-4">
        <div className="container mx-auto text-center">
          &copy; {new Date().getFullYear()} MomsKidz.{" "}
          {translate("All rights reserved.", "Todos los derechos reservados.")}
        </div>
      </footer>
    </div>
  );
}
