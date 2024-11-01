import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Trophy,
  Star,
  Podcast,
  FileText,
  UserPlus,
  Gift,
  TrendingUp,
  Share2,
} from "lucide-react";

interface Milestone {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  points: number;
  icon: React.ReactNode;
}

interface Mom {
  id: number;
  name: string;
  points: number;
  avatar: string;
}

const initialMilestones: Milestone[] = [
  {
    id: 1,
    title: "Listen to a Podcast",
    description: "Complete a full podcast episode",
    completed: false,
    points: 10,
    icon: <Podcast className="h-5 w-5" />,
  },
  {
    id: 2,
    title: "Add to Care Log",
    description: "Record a new entry in your care log",
    completed: false,
    points: 5,
    icon: <FileText className="h-5 w-5" />,
  },
  {
    id: 3,
    title: "Complete a Survey",
    description: "Provide feedback through a survey",
    completed: false,
    points: 15,
    icon: <Star className="h-5 w-5" />,
  },
  {
    id: 4,
    title: "Onboard New Child",
    description: "Add a new child to your profile",
    completed: false,
    points: 20,
    icon: <UserPlus className="h-5 w-5" />,
  },
  {
    id: 5,
    title: "Invite a Friend",
    description: "Bring a new mother into the community",
    completed: false,
    points: 25,
    icon: <UserPlus className="h-5 w-5" />,
  },
  {
    id: 6,
    title: "Share Your Story",
    description: "Share a personal story with the community",
    completed: false,
    points: 20,
    icon: <Share2 className="h-5 w-5" />,
  },
];

const topMoms: Mom[] = [
  {
    id: 1,
    name: "Sarah Johnson",
    points: 450,
    avatar: "/placeholder.svg?height=32&width=32",
  },
  {
    id: 2,
    name: "Emily Davis",
    points: 425,
    avatar: "/placeholder.svg?height=32&width=32",
  },
  {
    id: 3,
    name: "Jessica Brown",
    points: 410,
    avatar: "/placeholder.svg?height=32&width=32",
  },
];

const getRankColor = (points: number) => {
  if (points >= 500) return "text-purple-600";
  if (points >= 300) return "text-blue-600";
  if (points >= 100) return "text-green-600";
  return "text-gray-600";
};

export default function Component() {
  const [milestones, setMilestones] = useState<Milestone[]>(initialMilestones);
  const [totalPoints, setTotalPoints] = useState(250);
  const [rank, setRank] = useState(4); // Assuming the user starts at rank 4
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const completed = milestones.filter((m) => m.completed);
    const points = completed.reduce((sum, m) => sum + m.points, 0);
    setTotalPoints(points);
    setProgress((completed.length / milestones.length) * 100);
  }, [milestones]);

  return (
    <Card className="w-full max-w-4xl mx-auto bg-purple-25">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Mom Achievements</span>
          <Trophy className="h-10 w-10 text-yellow-500" />
        </CardTitle>
        <CardDescription>Track your progress and earn rewards</CardDescription>
      </CardHeader>
      <CardContent>
        <Card className="p-4 mb-6">
          <h3 className="font-semibold mb-2 flex items-center">
            <Gift className="h-6 w-6 mr-2 text-yellow-500" />
            Rewards
          </h3>
          {newFunction()}
          <Progress value={50} className="w-full bg-gray-200">
            <div
              className="h-full bg-yellow-500 rounded-full transition-all duration-500 ease-in-out"
              style={{ width: "50%" }}
            />
          </Progress>
          <p className="text-sm text-gray-500 mt-1">
            250 points earned. 250 more points to go!
          </p>
        </Card>

        <div className="mb-6">
          <div className="flex justify-end items-center">
            <span className="text-2xl font-bold text-purple-600">
              Rank: {rank}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {milestones.map((milestone) => (
            <Card
              key={milestone.id}
              className={`p-4 ${milestone.completed ? "bg-green-50" : ""}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div
                    className={`p-2 rounded-full ${milestone.completed ? "bg-green-500" : "bg-gray-200"}`}
                  >
                    {milestone.icon}
                  </div>
                  <div>
                    <h3 className="font-medium">{milestone.title}</h3>
                    <p className="text-sm text-gray-500">
                      {milestone.description}
                    </p>
                  </div>
                </div>
                <div className="flex items-center">
                  <span className="font-bold text-lg">{milestone.points}</span>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <Card className="p-4 mb-6">
          <h3 className="font-semibold mb-2 flex items-center">
            <Trophy className="h-6 w-6 mr-2 text-yellow-500" />
            Top Moms This Month
          </h3>
          <div className="space-y-2">
            {topMoms.map((mom, index) => (
              <div key={mom.id} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-lg">{index + 1}.</span>
                  <Avatar>
                    <AvatarImage src={mom.avatar} alt={mom.name} />
                    <AvatarFallback>
                      {mom.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <span>{mom.name}</span>
                </div>
                <span className="font-bold">{mom.points} pts</span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-4">
          <h3 className="font-semibold mb-2 flex items-center">
            <TrendingUp className="h-6 w-6 mr-2 text-green-500" />
            Boost Your Points
          </h3>
          <ul className="list-disc list-inside space-y-2 text-sm text-gray-600">
            <li>Complete daily check-ins for a 5-point bonus</li>
            <li>Participate in weekly challenges for up to 50 points</li>
            <li>
              Share your experiences in the community forum for 10 points per
              post
            </li>
          </ul>
        </Card>
      </CardContent>
    </Card>
  );

  function newFunction() {
    return (
      <p className="text-sm text-gray-600 mb-2">
        You're halfway to earning a free month!
      </p>
    );
  }
}
