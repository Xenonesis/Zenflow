import { Info, Coffee, Server, Code, Palette, LayoutDashboard, Activity, Sparkles } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { useState } from "react";

const About = () => {
  const [healthMode, setHealthMode] = useState<"physical" | "mental">("physical");

  const teamMembers = [
    {
      name: "Alex Johnson",
      role: "Lead Developer",
      avatar: "https://ui-avatars.com/api/?name=Alex+Johnson&background=8B5CF6&color=fff",
      bio: "Full-stack developer with 8 years of experience in health tech."
    },
    {
      name: "Sarah Chen",
      role: "UI/UX Designer",
      avatar: "https://ui-avatars.com/api/?name=Sarah+Chen&background=33C3F0&color=fff",
      bio: "Designer focused on creating intuitive and accessible health interfaces."
    },
    {
      name: "Marcus Lee",
      role: "Health Data Specialist",
      avatar: "https://ui-avatars.com/api/?name=Marcus+Lee&background=F97316&color=fff",
      bio: "Former personal trainer with expertise in health metrics and analytics."
    }
  ];

  const updates = [
    {
      version: "1.3.0",
      date: "May 4, 2025",
      title: "AI Insights Integration",
      description: "Added personalized AI insights based on user health data.",
      changes: [
        "Integrated AI model for personalized health recommendations",
        "Added chat interface for interacting with health data",
        "Improved data visualization for better insights",
        "Added AI configuration options in settings"
      ],
      type: "feature"
    },
    {
      version: "1.2.0",
      date: "April 15, 2025",
      title: "Mental Health Tracking",
      description: "Added comprehensive mental health tracking features.",
      changes: [
        "Added mood tracking and visualization",
        "Integrated meditation and mindfulness timers",
        "Added journal functionality for mental wellness",
        "Created self-care recommendation system"
      ],
      type: "feature"
    },
    {
      version: "1.1.2",
      date: "March 27, 2025",
      title: "Performance & UI Improvements",
      description: "Enhanced performance and user interface elements.",
      changes: [
        "Optimized dashboard loading speed by 40%",
        "Improved mobile responsiveness across all pages",
        "Added dark mode toggle with improved color scheme",
        "Fixed several minor UI bugs"
      ],
      type: "improvement"
    },
    {
      version: "1.1.0",
      date: "March 5, 2025",
      title: "Workout Library Expansion",
      description: "Expanded workout library and tracking capabilities.",
      changes: [
        "Added 200+ new workout exercises with animations",
        "Implemented custom workout builder",
        "Added exercise history and progress tracking",
        "Integrated with popular fitness wearables"
      ],
      type: "feature"
    },
    {
      version: "1.0.0",
      date: "February 10, 2025",
      title: "Initial Release",
      description: "First public release of ZenFlow application.",
      changes: [
        "Core health tracking functionality",
        "Basic workout tracking",
        "Progress visualization",
        "User account management"
      ],
      type: "release"
    }
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-slate-900">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header mode={healthMode} onModeChange={setHealthMode} />
        <main className="flex-1 overflow-auto p-6">
          <div className="mx-auto max-w-5xl animate-fade-in">
            <Tabs defaultValue="overview">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                <div>
                  <h1 className="text-3xl font-bold text-health-dark dark:text-white">About ZenFlow</h1>
                  <p className="text-muted-foreground mt-1 mb-4 md:mb-0">Learn about our mission and latest updates</p>
                </div>
                <TabsList>
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="updates">Updates</TabsTrigger>
                  <TabsTrigger value="team">Team</TabsTrigger>
                </TabsList>
              </div>
              
              <Separator className="my-6" />
              
              <TabsContent value="overview" className="space-y-8">
                <section>
                  <h2 className="text-2xl font-semibold text-health-dark dark:text-white flex items-center gap-2 mb-4">
                    <LayoutDashboard className="h-6 w-6 text-health-primary" />
                    Our Mission
                  </h2>
                  <div className="grid md:grid-cols-2 gap-6">
                    <Card>
                      <CardContent className="p-6">
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                          ZenFlow is built on the belief that better health comes from better understanding. 
                          Our mission is to provide a comprehensive platform that helps users track both physical and mental health 
                          in one intuitive dashboard, making health data accessible and actionable.
                        </p>
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed mt-4">
                          By combining cutting-edge technology with evidence-based health practices, we aim to empower users 
                          to take control of their wellbeing through data-driven insights and personalized recommendations.
                        </p>
                      </CardContent>
                    </Card>
                    <Card className="bg-gradient-health text-white">
                      <CardContent className="p-6">
                        <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                          <Sparkles className="h-5 w-5" />
                          Our Vision
                        </h3>
                        <p className="leading-relaxed">
                          We envision a world where everyone has access to personalized health insights powered by their own data.
                          ZenFlow aims to be the bridge between complex health metrics and simple, actionable steps toward better wellbeing.
                        </p>
                        <div className="flex gap-2 mt-4">
                          <Badge variant="outline" className="bg-white/20 hover:bg-white/30 border-white/30">Personalization</Badge>
                          <Badge variant="outline" className="bg-white/20 hover:bg-white/30 border-white/30">Data Privacy</Badge>
                          <Badge variant="outline" className="bg-white/20 hover:bg-white/30 border-white/30">Accessibility</Badge>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </section>
                
                <section className="mb-8">
                  <h2 className="text-2xl font-semibold text-health-dark dark:text-white flex items-center gap-2 mb-4">
                    <Info className="h-6 w-6 text-health-primary" />
                    App Overview
                  </h2>
                  <div className="bg-white/60 dark:bg-slate-800/60 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700">
                    <p className="text-gray-700 dark:text-gray-300 mb-4">
                      ZenFlow is a comprehensive health monitoring application designed to help users track both their physical and mental wellness. 
                      The dashboard provides an intuitive interface to visualize health data, record activities, and gain insights into your well-being.
                    </p>
                    <p className="text-gray-700 dark:text-gray-300">
                      Key features include workout history tracking, personal records, progress charts for physical health, 
                      as well as mood tracking, self-care logging, and wellness trend visualization for mental health.
                    </p>
                  </div>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-semibold text-health-dark dark:text-white flex items-center gap-2 mb-4">
                    <Code className="h-6 w-6 text-health-primary" />
                    Tech Stack
                  </h2>
                  <div className="bg-white/60 dark:bg-slate-800/60 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="bg-gray-50 dark:bg-slate-700/50 p-4 rounded-md">
                        <h3 className="font-medium text-health-primary mb-2">Frontend</h3>
                        <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-300">
                          <li>React + TypeScript</li>
                          <li>Tailwind CSS for styling</li>
                          <li>ShadCN UI for components</li>
                          <li>Lucide React for icons</li>
                          <li>React Router for navigation</li>
                        </ul>
                      </div>
                      <div className="bg-gray-50 dark:bg-slate-700/50 p-4 rounded-md">
                        <h3 className="font-medium text-health-primary mb-2">State Management</h3>
                        <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-300">
                          <li>React Context API</li>
                          <li>React Query for data fetching</li>
                        </ul>
                      </div>
                      <div className="bg-gray-50 dark:bg-slate-700/50 p-4 rounded-md">
                        <h3 className="font-medium text-health-primary mb-2">Data Visualization</h3>
                        <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-300">
                          <li>Recharts for interactive graphs</li>
                          <li>Custom visualization components</li>
                        </ul>
                      </div>
                      <div className="bg-gray-50 dark:bg-slate-700/50 p-4 rounded-md">
                        <h3 className="font-medium text-health-primary mb-2">AI Integration</h3>
                        <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-300">
                          <li>Natural language processing</li>
                          <li>Personalized health insights</li>
                          <li>Multiple AI model options</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-health-dark dark:text-white flex items-center gap-2 mb-4">
                    <Palette className="h-6 w-6 text-health-primary" />
                    Design Principles
                  </h2>
                  <div className="bg-white/60 dark:bg-slate-800/60 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700">
                    <ul className="grid md:grid-cols-2 gap-4 text-gray-700 dark:text-gray-300">
                      <li className="flex gap-2 items-start">
                        <span className="font-medium min-w-20">Responsive Design:</span> 
                        <span>Optimized for all device sizes from mobile to desktop</span>
                      </li>
                      <li className="flex gap-2 items-start">
                        <span className="font-medium min-w-20">Accessibility:</span> 
                        <span>Focus on keyboard navigation and screen reader compatibility</span>
                      </li>
                      <li className="flex gap-2 items-start">
                        <span className="font-medium min-w-20">Dark Mode:</span> 
                        <span>Reduced eye strain with automatic and manual theme switching</span>
                      </li>
                      <li className="flex gap-2 items-start">
                        <span className="font-medium min-w-20">Data Visualization:</span> 
                        <span>Clear, intuitive charts that reveal patterns in health data</span>
                      </li>
                    </ul>
                    <div className="mt-4 border-t border-gray-200 dark:border-gray-700 pt-4">
                      <p className="text-gray-600 dark:text-gray-400">
                        Our design philosophy centers on creating an interface that is both visually appealing and highly functional,
                        allowing users to focus on their health journey without technological barriers.
                      </p>
                    </div>
                  </div>
                </section>

                <div className="flex justify-center mt-12 mb-6">
                  <Button variant="outline" asChild className="bg-gradient-health text-white hover:text-white hover:opacity-90 border-none">
                    <Link to="/updates">
                      View Our Latest Updates
                      <Activity className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </TabsContent>
              
              <TabsContent value="updates" className="space-y-6">
                <div className="space-y-2">
                  <h2 className="text-2xl font-semibold text-health-dark dark:text-white">Release History</h2>
                  <p className="text-muted-foreground">Track our progress and feature additions</p>
                </div>
                
                <div className="space-y-6">
                  {updates.map((update, index) => (
                    <Card key={index} className="overflow-hidden">
                      <CardHeader className="bg-accent/50">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-xl flex items-center gap-2">{update.title}</CardTitle>
                            <CardDescription>Version {update.version} - {update.date}</CardDescription>
                          </div>
                          <Badge variant={update.type === "feature" ? "default" : "secondary"}>
                            {update.type === "feature" ? "New Feature" : update.type === "improvement" ? "Improvement" : "Release"}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-6">
                        <p className="mb-4">{update.description}</p>
                        <h4 className="font-medium mb-2">Changes:</h4>
                        <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                          {update.changes.map((change, i) => (
                            <li key={i}>{change}</li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="team" className="space-y-6">
                <div className="flex flex-col items-start justify-between mb-4">
                  <h2 className="text-2xl font-semibold text-health-dark dark:text-white flex items-center gap-2">
                    <Coffee className="h-6 w-6 text-health-primary" />
                    Our Team
                  </h2>
                  <p className="text-muted-foreground">The people behind ZenFlow</p>
                </div>
                
                <div className="grid md:grid-cols-3 gap-6">
                  {teamMembers.map((member, index) => (
                    <Card key={index} className="overflow-hidden card-hover">
                      <div className="h-24 bg-gradient-health"></div>
                      <div className="px-6 pb-6">
                        <div className="-mt-12 mb-6 flex justify-center">
                          <img 
                            src={member.avatar} 
                            alt={member.name} 
                            className="h-24 w-24 rounded-full border-4 border-white dark:border-slate-900" 
                          />
                        </div>
                        <h3 className="text-xl font-semibold text-center">{member.name}</h3>
                        <p className="text-center text-muted-foreground mb-3">{member.role}</p>
                        <p className="text-center text-sm">{member.bio}</p>
                      </div>
                    </Card>
                  ))}
                </div>
                
                <div className="text-center mt-8">
                  <p className="text-center text-gray-500 dark:text-gray-400 flex items-center justify-center gap-2">
                    <Coffee className="h-4 w-4" />
                    Built with care for health-conscious individuals
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
};

export default About;
