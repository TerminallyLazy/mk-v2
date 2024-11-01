
// import { Button } from "@/components/ui/button";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
              Card,
              CardContent,
              CardDescription,
              CardHeader,
              CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Camera, CloudSun, Calendar } from "lucide-react";
import { format } from "date-fns";

interface CareLogComponentProps {
  addPoints?: (amount: number) => void;
  translate?: (en: string, es: string) => string;
}

interface LogEntry {
  id: number;
  childName: string;
  note: string;
  date: string;
  weather: string;
}

export default function CareLogComponent({
  addPoints,
  translate: propTranslate,
}: CareLogComponentProps) {
  const [note, setNote] = useState("");
  const [weather, setWeather] = useState("");
  const [activeChild, setActiveChild] = useState("Billie");
  const [logEntries, setLogEntries] = useState<LogEntry[]>([]);

  // Provide a default translate function if none is passed
  const translate = React.useMemo(
    () => propTranslate || ((en: string) => en),
    [propTranslate],
  );

  useEffect(() => {
    fetch("https://api.weather.gov/points/40.7128,-74.0060")
      .then((response) => response.json())
      .then((data) => {
        return fetch(data.properties.forecast);
      })
      .then((response) => response.json())
      .then((data) => {
        const currentWeather = data.properties.periods[0].shortForecast;
        setWeather(currentWeather);
      })
      .catch((error) => {
        console.error("Error fetching weather:", error);
        setWeather(
          translate(
            "Weather data unavailable",
            "Datos del clima no disponibles",
          ),
        );
      });
  }, [translate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newEntry: LogEntry = {
      id: Date.now(),
      childName: activeChild,
      note: note,
      date: new Date().toLocaleString(),
      weather: weather,
    };
    setLogEntries([newEntry, ...logEntries]);
    setNote("");
    if (addPoints) {
      addPoints(5);
    }
  };

  const children = ["Billie", "Megan"];

  return (
    <Card className="p-2 sm:p-4">
      <CardHeader>
        <CardTitle className="text-lg sm:text-xl">
          {translate("Care Log", "Registro de Cuidados")}
        </CardTitle>
        <CardDescription className="text-sm sm:text-base">
          {translate(
            "Record health events and observations",
            "Registra eventos de salud y observaciones",
          )}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeChild} onValueChange={setActiveChild}>
          <TabsList>
            {children.map((child) => (
              <TabsTrigger key={child} value={child}>
                {child}
              </TabsTrigger>
            ))}
          </TabsList>
          {children.map((child) => (
            <TabsContent key={child} value={child}>
              <form onSubmit={handleSubmit} className="space-y-4 mb-4">
                <Input
                  placeholder={translate(
                    `Describe ${child}'s health event...`,
                    `Describe el evento de salud de ${child}...`,
                  )}
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                />
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <CloudSun className="h-4 w-4" />
                  <span>
                    {translate("Current weather:", "Clima actual:")}{" "}
                    {translate(weather, weather)}
                  </span>
                </div>
                <div className="flex space-x-2">
                  <Button type="button" variant="outline">
                    <Camera className="h-4 w-4 mr-2" />
                    {translate("Add Photo", "Agregar Foto")}
                  </Button>
                  <Button type="submit">
                    {translate("Save Note", "Guardar Nota")}
                  </Button>
                </div>
              </form>
              <ScrollArea className="h-[300px] w-full rounded-md border p-4">
                {logEntries
                  .filter((entry) => entry.childName === child)
                  .map((entry) => (
                    <div
                      key={entry.id}
                      className="mb-4 p-3 bg-gray-100 rounded-lg"
                    >
                      <p className="font-semibold">{entry.note}</p>
                      <div className="flex items-center space-x-2 text-sm text-gray-500 mt-2">
                        <Calendar className="h-4 w-4" />
                        <span>
                          {translate("Date:", "Fecha:")} {entry.date}
                        </span>
                        <CloudSun className="h-4 w-4 ml-2" />
                        <span>
                          {translate("Weather:", "Clima:")}{" "}
                          {translate(entry.weather, entry.weather)}
                        </span>
                      </div>
                    </div>
                  ))}
              </ScrollArea>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
}
