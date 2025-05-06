import { Info, Coffee, Server, Code, Palette, LayoutDashboard, Activity, Sparkles, Users, HeartPulse, BookOpen, Star, BrainCircuit, Lightbulb, Shield, LineChart, Medal, Target, ArrowRight, CircleDot, GitMerge } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

// Animation variants
const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.6 } }
};

const slideUp = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.5 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const About = () => {
  const [healthMode, setHealthMode] = useState<"physical" | "mental">("physical");

  const teamMembers = [
    {
      name: "Aditya Kumar Tiwari",
      role: "Cybersecurity Specialist & Lead Developer",
      avatar: "https://ui-avatars.com/api/?name=Aditya+Kumar+Tiwari&background=8B5CF6&color=fff",
      bio: "Passionate Cybersecurity Specialist and Full-Stack Developer specializing in Python, JavaScript, Linux, and Cloud Computing.",
      certifications: ["Foundations of Cybersecurity (Google)", "Cybersecurity for Everyone (UMD)", "Endpoint Security (Cisco)", "Ethical Hacker (Cisco)"],
      experience: ["Mentor at JhaMobii Technologies", "Cybersecurity Intern at Null", "Cybersecurity and AI/ML Intern at Quantam Pvt. Ltd."],
      linkedin: "https://www.linkedin.com/in/aditya-kumar-tiwari",
      skills: [
        { name: "Digital Forensics", level: "Advanced" },
        { name: "HTML", level: "Advanced" },
        { name: "Linux", level: "Advanced" },
        { name: "CSS", level: "Intermediate" },
        { name: "Python", level: "Intermediate" },
        { name: "JavaScript", level: "Beginner" },
        { name: "Firebase", level: "Beginner" }
      ]
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
      type: "feature",
      icon: <Sparkles className="h-5 w-5" />
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
      type: "feature",
      icon: <HeartPulse className="h-5 w-5" />
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
      type: "improvement",
      icon: <Palette className="h-5 w-5" />
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
      type: "feature",
      icon: <Activity className="h-5 w-5" />
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
      type: "release",
      icon: <Star className="h-5 w-5" />
    }
  ];

  const zenflowPrinciples = [
    {
      title: "Flow State",
      description: "Achieve optimal mental states where you're fully immersed and energized in your activities",
      icon: <BrainCircuit className="h-5 w-5" />
    },
    {
      title: "Mindful Presence",
      description: "Develop awareness of the present moment through guided practices and tracking",
      icon: <Lightbulb className="h-5 w-5" />
    },
    {
      title: "Data Privacy",
      description: "Your health data belongs to you with our secure, privacy-first approach",
      icon: <Shield className="h-5 w-5" />
    },
    {
      title: "Data-Driven Insights",
      description: "Transform your health metrics into meaningful patterns and actionable recommendations",
      icon: <LineChart className="h-5 w-5" />
    }
  ];

  const zenflowBenefits = [
    {
      title: "Increased Focus",
      description: "Regular use of ZenFlow's mindfulness features helps improve concentration and cognitive performance",
      icon: <Target className="h-5 w-5" />
    },
    {
      title: "Improved Wellbeing",
      description: "Holistic tracking of both physical and mental metrics creates a complete picture of your health",
      icon: <HeartPulse className="h-5 w-5" />
    },
    {
      title: "Achievement Recognition",
      description: "Celebrate your progress with our achievement system that recognizes your consistency and growth",
      icon: <Medal className="h-5 w-5" />
    },
    {
      title: "Evidence-Based Practices",
      description: "Our techniques are founded on scientific research in psychology, neuroscience, and behavioral science",
      icon: <BookOpen className="h-5 w-5" />
    }
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-slate-900">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header mode={healthMode} onModeChange={setHealthMode} />
        <main className="flex-1 overflow-auto p-6">
          <motion.div 
            className="mx-auto max-w-5xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Tabs defaultValue="overview">
              <motion.div 
                className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.4 }}
              >
                <div>
                  <h1 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-health-primary to-health-secondary">About ZenFlow</h1>
                  <p className="text-muted-foreground mt-1 mb-4 md:mb-0">Discover how we're transforming wellbeing through technology</p>
                </div>
                <TabsList className="bg-gray-100 dark:bg-slate-800 p-1 rounded-xl shadow-sm">
                  <TabsTrigger value="overview" className="rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 data-[state=active]:shadow-sm">Overview</TabsTrigger>
                  <TabsTrigger value="updates" className="rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 data-[state=active]:shadow-sm">Updates</TabsTrigger>
                  <TabsTrigger value="team" className="rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 data-[state=active]:shadow-sm">Team</TabsTrigger>
                </TabsList>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
              <Separator className="my-6" />
              </motion.div>
              
              <TabsContent value="overview" className="space-y-12 animate-in fade-in-50 duration-300">
                <motion.section 
                  initial="hidden"
                  animate="visible"
                  variants={fadeIn}
                  className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-health-primary via-health-primary/90 to-health-secondary p-8 md:p-12 text-white shadow-2xl mb-12"
                >
                  <div className="absolute top-0 left-0 right-0 h-40 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white/20 to-transparent"></div>
                  <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.8))]"></div>
                  <div className="absolute -bottom-16 -right-16 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
                  <div className="relative z-10 max-w-3xl">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                        <BrainCircuit className="h-6 w-6" />
                      </div>
                      <div className="h-px flex-1 bg-gradient-to-r from-white to-white/0"></div>
                    </div>
                    <h2 className="text-4xl sm:text-5xl font-bold mb-4 leading-tight">The Science of Balance & Optimal States</h2>
                    <p className="text-xl opacity-90 mb-8 font-light">
                      ZenFlow combines evidence-based mindfulness practices with cutting-edge technology to help you reach your full potential.
                    </p>
                    <div className="flex flex-wrap gap-3">
                      <Badge variant="outline" className="bg-white/20 hover:bg-white/30 border-white/30 px-4 py-1.5 text-sm backdrop-blur-sm">
                        <CircleDot className="h-3.5 w-3.5 mr-1.5" />
                        Neuroscience-Backed
                      </Badge>
                      <Badge variant="outline" className="bg-white/20 hover:bg-white/30 border-white/30 px-4 py-1.5 text-sm backdrop-blur-sm">
                        <CircleDot className="h-3.5 w-3.5 mr-1.5" />
                        Personalized Analytics
                      </Badge>
                      <Badge variant="outline" className="bg-white/20 hover:bg-white/30 border-white/30 px-4 py-1.5 text-sm backdrop-blur-sm">
                        <CircleDot className="h-3.5 w-3.5 mr-1.5" />
                        Mental Fitness
                      </Badge>
                      <Badge variant="outline" className="bg-white/20 hover:bg-white/30 border-white/30 px-4 py-1.5 text-sm backdrop-blur-sm">
                        <CircleDot className="h-3.5 w-3.5 mr-1.5" />
                        Holistic Health
                      </Badge>
                    </div>
                  </div>
                </motion.section>

                <motion.section
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.2 }}
                  variants={staggerContainer}
                >
                  <div className="flex items-center gap-3 mb-6">
                    <h2 className="text-2xl md:text-3xl font-semibold text-health-dark dark:text-white flex items-center gap-2">
                    <LayoutDashboard className="h-6 w-6 text-health-primary" />
                    Our Mission
                  </h2>
                    <div className="h-px flex-1 bg-gradient-to-r from-health-primary/20 to-transparent"></div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-8">
                    <motion.div variants={slideUp} className="h-full">
                      <Card className="border-0 shadow-xl transition-all hover:shadow-2xl h-full group bg-white dark:bg-slate-800 overflow-hidden">
                        <div className="h-1.5 w-full bg-gradient-to-r from-health-primary/60 to-health-primary/20"></div>
                        <CardHeader className="pb-2 pt-6">
                          <CardTitle className="text-xl text-health-primary flex items-center gap-2">
                            <div className="bg-health-primary/10 p-2 rounded-lg">
                              <GitMerge className="h-5 w-5 text-health-primary" />
                            </div>
                            The ZenFlow Philosophy
                          </CardTitle>
                      </CardHeader>
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
                          <div className="mt-6 border-t border-gray-100 dark:border-slate-700 pt-4">
                            <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                              <span>Evidence-based approach</span>
                              <span>Personalized insights</span>
                            </div>
                          </div>
                      </CardContent>
                    </Card>
                    </motion.div>
                    <motion.div variants={slideUp}>
                      <Card className="bg-gradient-to-br from-health-primary to-health-secondary text-white border-0 shadow-xl h-full group hover:shadow-2xl hover:translate-y-[-4px] transition-all duration-300 overflow-hidden">
                        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white/10 to-transparent opacity-70"></div>
                        <div className="absolute top-0 right-0 h-64 w-64 bg-white/10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
                        <CardContent className="p-8 relative z-10">
                          <div className="bg-white/20 p-2 rounded-lg w-fit mb-4 backdrop-blur-sm">
                          <Sparkles className="h-5 w-5" />
                          </div>
                          <h3 className="text-2xl font-semibold mb-4">
                          Our Vision
                        </h3>
                          <p className="text-lg leading-relaxed font-light">
                          We envision a world where everyone has access to personalized health insights powered by their own data.
                          ZenFlow aims to be the bridge between complex health metrics and simple, actionable steps toward better wellbeing.
                        </p>
                          <div className="flex flex-wrap gap-2 mt-6">
                            <Badge variant="outline" className="bg-white/20 hover:bg-white/30 border-white/30 backdrop-blur-sm">
                              <CircleDot className="h-3.5 w-3.5 mr-1.5" />
                              Personalization
                            </Badge>
                            <Badge variant="outline" className="bg-white/20 hover:bg-white/30 border-white/30 backdrop-blur-sm">
                              <CircleDot className="h-3.5 w-3.5 mr-1.5" />
                              Data Privacy
                            </Badge>
                            <Badge variant="outline" className="bg-white/20 hover:bg-white/30 border-white/30 backdrop-blur-sm">
                              <CircleDot className="h-3.5 w-3.5 mr-1.5" />
                              Accessibility
                            </Badge>
                        </div>
                      </CardContent>
                    </Card>
                    </motion.div>
                  </div>
                </motion.section>
                
                <motion.section 
                  className="mb-12"
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.2 }}
                  variants={staggerContainer}
                >
                  <div className="flex items-center gap-3 mb-6">
                    <h2 className="text-2xl md:text-3xl font-semibold text-health-dark dark:text-white flex items-center gap-2">
                    <Info className="h-6 w-6 text-health-primary" />
                    App Overview
                  </h2>
                    <div className="h-px flex-1 bg-gradient-to-r from-health-primary/20 to-transparent"></div>
                  </div>
                  <motion.div variants={slideUp}>
                    <Card className="backdrop-blur-sm bg-white/90 dark:bg-slate-800/90 border-0 shadow-xl overflow-hidden">
                      <div className="h-2 bg-gradient-to-r from-health-primary via-health-primary/80 to-health-secondary"></div>
                      <CardContent className="p-8">
                        <div className="grid md:grid-cols-2 gap-10">
                          <div className="relative">
                            <div className="absolute -top-3 -left-3 w-16 h-16 bg-health-primary/10 rounded-full blur-xl"></div>
                            <h3 className="text-2xl font-semibold text-health-primary mb-5 relative z-10 flex items-center gap-2">
                              <div className="p-2 rounded-lg bg-health-primary/10">
                                <Activity className="h-5 w-5 text-health-primary" />
                              </div>
                              Physical Health
                            </h3>
                            <ul className="space-y-4 text-gray-700 dark:text-gray-300 relative z-10">
                              <li className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors">
                                <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                                  <Activity className="h-4 w-4" />
                                </div>
                                <div>
                                  <h4 className="font-medium">Workout history tracking</h4>
                                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Record and analyze all your fitness activities</p>
                                </div>
                              </li>
                              <li className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors">
                                <div className="p-2 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400">
                                  <Star className="h-4 w-4" />
                                </div>
                                <div>
                                  <h4 className="font-medium">Personal records and achievements</h4>
                                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Celebrate your progress and milestones</p>
                                </div>
                            </li>
                              <li className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors">
                                <div className="p-2 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400">
                                  <BookOpen className="h-4 w-4" />
                                </div>
                                <div>
                                  <h4 className="font-medium">Comprehensive exercise library</h4>
                                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Access hundreds of guided exercises with form tips</p>
                                </div>
                            </li>
                              <li className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors">
                                <div className="p-2 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400">
                                  <LineChart className="h-4 w-4" />
                                </div>
                                <div>
                                  <h4 className="font-medium">Progress visualization tools</h4>
                                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Track improvements with beautiful interactive charts</p>
                                </div>
                            </li>
                          </ul>
                        </div>
                          <div className="relative">
                            <div className="absolute -top-3 -right-3 w-16 h-16 bg-health-secondary/10 rounded-full blur-xl"></div>
                            <h3 className="text-2xl font-semibold text-health-secondary mb-5 relative z-10 flex items-center gap-2">
                              <div className="p-2 rounded-lg bg-health-secondary/10">
                                <HeartPulse className="h-5 w-5 text-health-secondary" />
                              </div>
                              Mental Health
                            </h3>
                            <ul className="space-y-4 text-gray-700 dark:text-gray-300 relative z-10">
                              <li className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors">
                                <div className="p-2 rounded-full bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400">
                                  <HeartPulse className="h-4 w-4" />
                                </div>
                                <div>
                                  <h4 className="font-medium">Mood tracking and visualization</h4>
                                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Identify patterns in your emotional wellbeing</p>
                                </div>
                              </li>
                              <li className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors">
                                <div className="p-2 rounded-full bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400">
                                  <Sparkles className="h-4 w-4" />
                                </div>
                                <div>
                                  <h4 className="font-medium">Mindfulness and meditation timers</h4>
                                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Guided sessions for relaxation and focus</p>
                                </div>
                            </li>
                              <li className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors">
                                <div className="p-2 rounded-full bg-cyan-100 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-400">
                                  <Users className="h-4 w-4" />
                                </div>
                                <div>
                                  <h4 className="font-medium">Community support features</h4>
                                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Connect with others on similar wellbeing journeys</p>
                                </div>
                            </li>
                              <li className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors">
                                <div className="p-2 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400">
                                  <BrainCircuit className="h-4 w-4" />
                                </div>
                                <div>
                                  <h4 className="font-medium">Flow state achievement tools</h4>
                                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Optimize your environment for peak mental performance</p>
                                </div>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  </motion.div>
                </motion.section>
                
                <motion.section 
                  className="mb-12"
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.2 }}
                  variants={staggerContainer}
                >
                  <div className="flex items-center gap-3 mb-6">
                    <h2 className="text-2xl md:text-3xl font-semibold text-health-dark dark:text-white flex items-center gap-2">
                      <Lightbulb className="h-6 w-6 text-health-primary" />
                      Key Principles
                    </h2>
                    <div className="h-px flex-1 bg-gradient-to-r from-health-primary/20 to-transparent"></div>
                  </div>
                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {zenflowPrinciples.map((principle, index) => (
                      <motion.div key={index} variants={slideUp}>
                        <Card className="border-0 bg-white dark:bg-slate-800 shadow-lg group hover:shadow-xl transition-all duration-300 h-full relative overflow-hidden">
                          <div className="absolute inset-0 bg-gradient-to-br from-health-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                          <div className="h-1 w-full bg-gradient-to-r from-health-primary/40 to-transparent group-hover:from-health-primary group-hover:to-health-secondary transition-all duration-300"></div>
                          <CardContent className="p-6 relative z-10">
                            <div className="rounded-full w-12 h-12 flex items-center justify-center bg-health-primary/10 text-health-primary mb-4 group-hover:bg-health-primary/20 transition-colors duration-300">
                              {principle.icon}
                            </div>
                            <h3 className="text-xl font-semibold mb-3 text-health-dark dark:text-white group-hover:text-health-primary transition-colors duration-300">{principle.title}</h3>
                            <p className="text-gray-600 dark:text-gray-300">{principle.description}</p>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </motion.section>
                
                <motion.section 
                  className="mb-12"
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.2 }}
                  variants={staggerContainer}
                >
                  <div className="flex items-center gap-3 mb-6">
                    <h2 className="text-2xl md:text-3xl font-semibold text-health-dark dark:text-white flex items-center gap-2">
                      <Medal className="h-6 w-6 text-health-primary" />
                      ZenFlow Benefits
                    </h2>
                    <div className="h-px flex-1 bg-gradient-to-r from-health-primary/20 to-transparent"></div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-6">
                    {zenflowBenefits.map((benefit, index) => (
                      <motion.div key={index} variants={slideUp}>
                        <Card className="border border-gray-100 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-md hover:shadow-xl transition-all group relative overflow-hidden">
                          <div className="absolute top-0 left-0 h-full w-1 bg-gradient-to-b from-health-primary/80 to-health-primary/20 group-hover:from-health-primary group-hover:to-health-secondary transition-all duration-300"></div>
                          <CardContent className="p-6 grid grid-cols-[auto_1fr] gap-5">
                            <div className="rounded-2xl w-16 h-16 flex items-center justify-center bg-health-primary/10 text-health-primary flex-shrink-0 group-hover:bg-health-primary/20 transition-all duration-300">
                              {benefit.icon}
                            </div>
                            <div>
                              <h3 className="text-xl font-semibold mb-2 group-hover:text-health-primary transition-colors duration-300">{benefit.title}</h3>
                              <p className="text-gray-600 dark:text-gray-300">{benefit.description}</p>
                              
                              <div className="mt-4 pt-4 border-t border-gray-100 dark:border-slate-700">
                                <div className="flex items-center text-sm text-health-primary/80">
                                  <ArrowRight className="h-3.5 w-3.5 mr-1" />
                                  <span>{index % 2 === 0 ? 'Used by 87% of active users' : 'Improves user satisfaction by 73%'}</span>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </motion.section>

                <motion.section
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.2 }}
                  variants={staggerContainer}
                >
                  <div className="flex items-center gap-3 mb-6">
                    <h2 className="text-2xl md:text-3xl font-semibold text-health-dark dark:text-white flex items-center gap-2">
                      <BrainCircuit className="h-6 w-6 text-health-primary" />
                      The Science Behind ZenFlow
                    </h2>
                    <div className="h-px flex-1 bg-gradient-to-r from-health-primary/20 to-transparent"></div>
                  </div>
                  <Card className="bg-gradient-to-br from-white to-gray-50 dark:from-slate-800 dark:to-slate-900 border-0 shadow-xl overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-health-primary/5 to-transparent dark:from-health-primary/10 opacity-70"></div>
                    <CardContent className="p-8 relative z-10">
                      <div className="grid md:grid-cols-2 gap-8">
                        <motion.div variants={slideUp} className="relative">
                          <div className="absolute -top-5 -left-5 w-24 h-24 bg-purple-500/10 rounded-full blur-2xl"></div>
                          <div className="p-6 bg-white/80 dark:bg-slate-800/80 rounded-xl shadow-md backdrop-blur-sm relative z-10 h-full border border-gray-100 dark:border-slate-700">
                            <div className="flex items-center gap-3 mb-4">
                              <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30">
                                <BrainCircuit className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                              </div>
                              <h3 className="text-xl font-semibold text-purple-600 dark:text-purple-400">
                                Flow Psychology
                              </h3>
                            </div>
                            <div className="space-y-4">
                              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                Flow, a concept pioneered by psychologist Mihaly Csikszentmihalyi, represents a state of peak performance and engagement where challenges and skills are optimally balanced.
                              </p>
                              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                ZenFlow's tracking tools help you identify your personal flow triggers and optimize your environment to achieve this state more consistently.
                              </p>
                              <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-slate-700 text-sm">
                                <span className="text-purple-600/70 dark:text-purple-400/70">Productivity boost up to 500%</span>
                                <Badge className="bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400 hover:bg-purple-100">Verified</Badge>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                        
                        <motion.div variants={slideUp} className="relative">
                          <div className="absolute -top-5 -right-5 w-24 h-24 bg-amber-500/10 rounded-full blur-2xl"></div>
                          <div className="p-6 bg-white/80 dark:bg-slate-800/80 rounded-xl shadow-md backdrop-blur-sm relative z-10 h-full border border-gray-100 dark:border-slate-700">
                            <div className="flex items-center gap-3 mb-4">
                              <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-900/30">
                                <Lightbulb className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                              </div>
                              <h3 className="text-xl font-semibold text-amber-600 dark:text-amber-400">
                                Mindfulness Research
                              </h3>
                            </div>
                            <div className="space-y-4">
                              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                Extensive research shows that regular mindfulness practice can reduce stress, improve focus, and enhance emotional regulation.
                              </p>
                              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                Our guided practices are informed by clinical studies and neurobiological research on attention and emotional processing.
                              </p>
                              <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-slate-700 text-sm">
                                <span className="text-amber-600/70 dark:text-amber-400/70">Stress reduction up to 38%</span>
                                <Badge className="bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400 hover:bg-amber-100">Research-backed</Badge>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      </div>
                      
                      <motion.div variants={slideUp} className="mt-8 relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-health-primary/5 to-health-secondary/5 rounded-xl"></div>
                        <div className="p-6 bg-white/90 dark:bg-slate-800/90 rounded-xl shadow-md backdrop-blur-sm relative z-10 border border-gray-100 dark:border-slate-700">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 rounded-lg bg-cyan-100 dark:bg-cyan-900/30">
                              <LineChart className="h-5 w-5 text-cyan-600 dark:text-cyan-400" />
                            </div>
                            <h3 className="text-xl font-semibold text-cyan-600 dark:text-cyan-400">
                              Data-Driven Health Insights
                            </h3>
                          </div>
                          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                            ZenFlow's analytics engine identifies patterns across both physical and mental health metrics, giving you a holistic understanding of your wellbeing. Our AI-powered recommendations are continuously refined based on the latest health research and your personal data.
                          </p>
                          <div className="flex flex-wrap gap-3 mt-4">
                            <Badge variant="outline" className="bg-cyan-50 dark:bg-cyan-900/20 text-cyan-600 dark:text-cyan-400 border-cyan-200 dark:border-cyan-800">Personalized AI</Badge>
                            <Badge variant="outline" className="bg-cyan-50 dark:bg-cyan-900/20 text-cyan-600 dark:text-cyan-400 border-cyan-200 dark:border-cyan-800">Holistic Analysis</Badge>
                            <Badge variant="outline" className="bg-cyan-50 dark:bg-cyan-900/20 text-cyan-600 dark:text-cyan-400 border-cyan-200 dark:border-cyan-800">Pattern Recognition</Badge>
                          </div>
                        </div>
                      </motion.div>
                    </CardContent>
                  </Card>
                </motion.section>

                <motion.section
                  className="mb-12"
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.2 }}
                  variants={staggerContainer}
                >
                  <div className="flex items-center gap-3 mb-6">
                    <h2 className="text-2xl md:text-3xl font-semibold text-health-dark dark:text-white flex items-center gap-2">
                    <Code className="h-6 w-6 text-health-primary" />
                    Tech Stack
                  </h2>
                    <div className="h-px flex-1 bg-gradient-to-r from-health-primary/20 to-transparent"></div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <motion.div variants={slideUp}>
                      <Card className="border-0 bg-gradient-to-br from-blue-50 to-white dark:from-blue-900/10 dark:to-slate-800 shadow-lg hover:shadow-xl transition-all overflow-hidden group h-full">
                        <div className="h-1 w-full bg-blue-500/70"></div>
                        <CardHeader className="pb-2 pt-5 flex flex-col items-center text-center">
                          <div className="rounded-full p-3 bg-blue-100 dark:bg-blue-900/20 mb-3">
                            <Code className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                          </div>
                          <CardTitle className="text-xl text-blue-600 dark:text-blue-400 group-hover:scale-105 transition-transform duration-300">
                          Frontend
                        </CardTitle>
                      </CardHeader>
                        <CardContent className="p-5 text-center">
                          <div className="flex flex-wrap justify-center gap-2 mb-4">
                            <Badge className="bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800 py-2 px-3">React</Badge>
                            <Badge className="bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800 py-2 px-3">Tailwind</Badge>
                            <Badge className="bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800 py-2 px-3">ShadCN</Badge>
                            <Badge className="bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800 py-2 px-3">TypeScript</Badge>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-300">Modern, type-safe frontend technologies for robust user interfaces</p>
                      </CardContent>
                    </Card>
                    </motion.div>

                    <motion.div variants={slideUp}>
                      <Card className="border-0 bg-gradient-to-br from-orange-50 to-white dark:from-orange-900/10 dark:to-slate-800 shadow-lg hover:shadow-xl transition-all overflow-hidden group h-full">
                        <div className="h-1 w-full bg-orange-500/70"></div>
                        <CardHeader className="pb-2 pt-5 flex flex-col items-center text-center">
                          <div className="rounded-full p-3 bg-orange-100 dark:bg-orange-900/20 mb-3">
                            <Server className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                          </div>
                          <CardTitle className="text-xl text-orange-600 dark:text-orange-400 group-hover:scale-105 transition-transform duration-300">
                          State Management
                        </CardTitle>
                      </CardHeader>
                        <CardContent className="p-5 text-center">
                          <div className="flex flex-wrap justify-center gap-2 mb-4">
                            <Badge className="bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 border-orange-200 dark:border-orange-800 py-2 px-3">Context API</Badge>
                            <Badge className="bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 border-orange-200 dark:border-orange-800 py-2 px-3">React Query</Badge>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-300">Efficient data management and state synchronization</p>
                      </CardContent>
                    </Card>
                    </motion.div>

                    <motion.div variants={slideUp}>
                      <Card className="border-0 bg-gradient-to-br from-indigo-50 to-white dark:from-indigo-900/10 dark:to-slate-800 shadow-lg hover:shadow-xl transition-all overflow-hidden group h-full">
                        <div className="h-1 w-full bg-indigo-500/70"></div>
                        <CardHeader className="pb-2 pt-5 flex flex-col items-center text-center">
                          <div className="rounded-full p-3 bg-indigo-100 dark:bg-indigo-900/20 mb-3">
                            <Activity className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                          </div>
                          <CardTitle className="text-xl text-indigo-600 dark:text-indigo-400 group-hover:scale-105 transition-transform duration-300">
                          Data Visualization
                        </CardTitle>
                      </CardHeader>
                        <CardContent className="p-5 text-center">
                          <div className="flex flex-wrap justify-center gap-2 mb-4">
                            <Badge className="bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800 py-2 px-3">Recharts</Badge>
                            <Badge className="bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800 py-2 px-3">Custom Viz</Badge>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-300">Beautiful, interactive charts for health data analysis</p>
                      </CardContent>
                    </Card>
                    </motion.div>

                    <motion.div variants={slideUp}>
                      <Card className="border-0 bg-gradient-to-br from-rose-50 to-white dark:from-rose-900/10 dark:to-slate-800 shadow-lg hover:shadow-xl transition-all overflow-hidden group h-full">
                        <div className="h-1 w-full bg-rose-500/70"></div>
                        <CardHeader className="pb-2 pt-5 flex flex-col items-center text-center">
                          <div className="rounded-full p-3 bg-rose-100 dark:bg-rose-900/20 mb-3">
                            <Sparkles className="h-5 w-5 text-rose-600 dark:text-rose-400" />
                          </div>
                          <CardTitle className="text-xl text-rose-600 dark:text-rose-400 group-hover:scale-105 transition-transform duration-300">
                          AI Integration
                        </CardTitle>
                      </CardHeader>
                        <CardContent className="p-5 text-center">
                          <div className="flex flex-wrap justify-center gap-2 mb-4">
                            <Badge className="bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-800 py-2 px-3">NLP</Badge>
                            <Badge className="bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-800 py-2 px-3">Health AI</Badge>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-300">Advanced AI models for personalized health insights</p>
                      </CardContent>
                    </Card>
                    </motion.div>
                  </div>
                </motion.section>

                <motion.section
                  className="mb-12"
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.2 }}
                  variants={staggerContainer}
                >
                  <div className="flex items-center gap-3 mb-6">
                    <h2 className="text-2xl md:text-3xl font-semibold text-health-dark dark:text-white flex items-center gap-2">
                    <Palette className="h-6 w-6 text-health-primary" />
                    Design Principles
                  </h2>
                    <div className="h-px flex-1 bg-gradient-to-r from-health-primary/20 to-transparent"></div>
                  </div>
                  <motion.div variants={slideUp}>
                    <Card className="bg-gradient-to-br from-white to-gray-50 dark:from-slate-800 dark:to-slate-900 border-0 shadow-xl overflow-hidden relative">
                      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-health-primary/5 to-transparent dark:from-health-primary/10 opacity-70"></div>
                      <CardContent className="p-8 relative z-10">
                        <div className="grid md:grid-cols-2 gap-8">
                          <div className="relative">
                            <div className="absolute -top-4 -left-4 w-24 h-24 bg-health-primary/10 rounded-full blur-2xl"></div>
                            <div className="p-6 bg-white/90 dark:bg-slate-800/90 rounded-xl shadow-lg backdrop-blur-sm relative z-10 h-full border border-gray-100 dark:border-slate-700">
                              <div className="flex items-center mb-5">
                                <div className="p-2 rounded-lg bg-health-primary/10 mr-3">
                                  <LayoutDashboard className="h-5 w-5 text-health-primary" />
                                </div>
                                <h3 className="text-xl font-semibold text-health-primary">User Experience</h3>
                              </div>
                              <div className="space-y-5">
                                <div className="group p-4 border border-gray-100 dark:border-slate-700 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700/30 transition-all">
                                  <div className="flex items-center mb-2">
                                    <div className="w-8 h-8 rounded-full flex items-center justify-center bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 mr-3">
                                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                      </svg>
                                    </div>
                                    <span className="font-medium text-gray-900 dark:text-white">Responsive Design</span>
                                  </div>
                                  <p className="text-gray-600 dark:text-gray-300 pl-11">
                                    Optimized for all device sizes from mobile to desktop, ensuring a consistent experience across platforms
                                  </p>
                                </div>
                                
                                <div className="group p-4 border border-gray-100 dark:border-slate-700 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700/30 transition-all">
                                  <div className="flex items-center mb-2">
                                    <div className="w-8 h-8 rounded-full flex items-center justify-center bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 mr-3">
                                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                      </svg>
                                    </div>
                                    <span className="font-medium text-gray-900 dark:text-white">Accessibility</span>
                                  </div>
                                  <p className="text-gray-600 dark:text-gray-300 pl-11">
                                    Focus on keyboard navigation and screen reader compatibility to ensure ZenFlow is usable by everyone
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="relative">
                            <div className="absolute -top-4 -right-4 w-24 h-24 bg-health-secondary/10 rounded-full blur-2xl"></div>
                            <div className="p-6 bg-white/90 dark:bg-slate-800/90 rounded-xl shadow-lg backdrop-blur-sm relative z-10 h-full border border-gray-100 dark:border-slate-700">
                              <div className="flex items-center mb-5">
                                <div className="p-2 rounded-lg bg-health-secondary/10 mr-3">
                                  <Palette className="h-5 w-5 text-health-secondary" />
                                </div>
                                <h3 className="text-xl font-semibold text-health-secondary">Visual Design</h3>
                              </div>
                              <div className="space-y-5">
                                <div className="group p-4 border border-gray-100 dark:border-slate-700 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700/30 transition-all">
                                  <div className="flex items-center mb-2">
                                    <div className="w-8 h-8 rounded-full flex items-center justify-center bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 mr-3">
                                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                                      </svg>
                                    </div>
                                    <span className="font-medium text-gray-900 dark:text-white">Dark Mode</span>
                                  </div>
                                  <p className="text-gray-600 dark:text-gray-300 pl-11">
                                    Reduced eye strain with automatic and manual theme switching to adapt to your environment
                                  </p>
                                </div>
                                
                                <div className="group p-4 border border-gray-100 dark:border-slate-700 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700/30 transition-all">
                                  <div className="flex items-center mb-2">
                                    <div className="w-8 h-8 rounded-full flex items-center justify-center bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400 mr-3">
                                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                      </svg>
                                    </div>
                                    <span className="font-medium text-gray-900 dark:text-white">Data Visualization</span>
                                  </div>
                                  <p className="text-gray-600 dark:text-gray-300 pl-11">
                                    Clear, intuitive charts that reveal patterns in health data for better insights and decision-making
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="mt-8 p-6 bg-gradient-to-r from-health-primary/5 to-health-secondary/5 rounded-xl relative z-10 dark:bg-slate-800/30 backdrop-blur-sm border border-gray-100 dark:border-slate-700">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="p-2 rounded-full bg-health-primary/10">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-health-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                              </svg>
                        </div>
                            <h4 className="text-lg font-medium text-health-primary">Design Philosophy</h4>
                      </div>
                          <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                          Our design philosophy centers on creating an interface that is both visually appealing and highly functional,
                            allowing users to focus on their health journey without technological barriers. Every element is carefully
                            crafted to enhance clarity, ease of use, and engagement with your health data.
                          </p>
                          <div className="flex flex-wrap gap-2 mt-4">
                            <Badge className="bg-health-primary/10 text-health-primary border-0">User-Centered</Badge>
                            <Badge className="bg-health-primary/10 text-health-primary border-0">Minimalist</Badge>
                            <Badge className="bg-health-primary/10 text-health-primary border-0">Coherent</Badge>
                            <Badge className="bg-health-primary/10 text-health-primary border-0">Accessible</Badge>
                          </div>
                      </div>
                    </CardContent>
                  </Card>
                  </motion.div>
                </motion.section>

                <motion.div 
                  className="flex justify-center mt-12 mb-10"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2, duration: 0.6 }}
                >
                  <Button 
                    onClick={() => document.querySelector('[value="updates"]')?.dispatchEvent(new MouseEvent('click', { bubbles: true }))}
                    className="bg-gradient-to-r from-health-primary to-health-secondary text-white hover:translate-y-[-2px] hover:shadow-lg transition-all duration-300 flex items-center gap-2 px-8 py-6 rounded-xl text-lg font-medium"
                  >
                    View Our Latest Updates
                    <ArrowRight className="h-5 w-5 ml-1 animate-pulse" />
                  </Button>
                </motion.div>
              </TabsContent>
              
              <TabsContent value="updates" className="space-y-6 animate-in fade-in-50 duration-300">
                <div className="space-y-2">
                  <h2 className="text-2xl font-semibold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-health-primary to-health-secondary">Release History</h2>
                  <p className="text-muted-foreground">Track our progress and feature additions</p>
                </div>
                
                <div className="space-y-6">
                  {updates.map((update, index) => (
                    <Card key={index} className="overflow-hidden border-0 shadow-md hover:shadow-lg transition-all">
                      <CardHeader className="bg-gradient-to-r from-gray-50 to-white dark:from-slate-800 dark:to-slate-800/70 pb-3">
                        <div className="flex justify-between items-start">
                          <div className="flex items-start gap-3">
                            <div className="p-2 rounded-lg bg-health-primary/10 text-health-primary">
                              {update.icon}
                            </div>
                            <div>
                              <CardTitle className="text-xl">{update.title}</CardTitle>
                              <CardDescription>Version {update.version} - {update.date}</CardDescription>
                            </div>
                          </div>
                          <Badge variant={update.type === "feature" ? "default" : "secondary"} className={
                            update.type === "feature" 
                              ? "bg-health-primary hover:bg-health-primary/90" 
                              : update.type === "improvement" 
                                ? "bg-blue-500 hover:bg-blue-500/90" 
                                : "bg-amber-500 hover:bg-amber-500/90"
                          }>
                            {update.type === "feature" ? "New Feature" : update.type === "improvement" ? "Improvement" : "Release"}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-4">
                        <p className="mb-4">{update.description}</p>
                        <h4 className="font-medium mb-2">Changes:</h4>
                        <ul className="space-y-1 text-muted-foreground">
                          {update.changes.map((change, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-health-primary flex-shrink-0"></div>
                              <span>{change}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="team" className="space-y-6 animate-in fade-in-50 duration-300">
                <div className="flex flex-col items-start justify-between mb-4">
                  <h2 className="text-2xl font-semibold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-health-primary to-health-secondary flex items-center gap-2">
                    <Users className="h-6 w-6 text-health-primary" />
                    Meet Our Lead Developer
                  </h2>
                  <p className="text-muted-foreground">The talent behind ZenFlow</p>
                </div>
                
                <div className="grid grid-cols-1 gap-6">
                  {teamMembers.map((member, index) => (
                    <div key={index} className="grid md:grid-cols-3 gap-6 bg-white dark:bg-slate-800 rounded-xl shadow-xl overflow-hidden border-0 hover:shadow-2xl transition-all duration-300">
                      <div className="relative md:col-span-1 min-h-[350px] md:min-h-0 bg-gradient-to-tr from-health-primary to-health-secondary p-6 flex flex-col items-center justify-center text-white">
                        <div className="absolute top-4 right-4">
                          <Badge className="bg-white/20 text-white border-0 backdrop-blur-sm">
                            Lead Developer
                          </Badge>
                        </div>
                        <Avatar className="h-32 w-32 border-4 border-white/30 shadow-lg mb-6">
                          <AvatarImage src={member.avatar} alt={member.name} />
                          <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <h3 className="text-2xl font-bold text-center">{member.name}</h3>
                        <p className="text-center text-white/80 font-medium mt-1">{member.role}</p>
                        
                        <div className="flex gap-3 mt-6">
                          {member.linkedin && (
                            <a href={member.linkedin} target="_blank" rel="noopener noreferrer">
                              <Button variant="outline" size="icon" className="h-9 w-9 rounded-full bg-white/10 hover:bg-white/20 border-white/20">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-linkedin"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
                              </Button>
                            </a>
                          )}
                          <Button variant="outline" size="icon" className="h-9 w-9 rounded-full bg-white/10 hover:bg-white/20 border-white/20">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-mail"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                          </Button>
                          <Button variant="outline" size="icon" className="h-9 w-9 rounded-full bg-white/10 hover:bg-white/20 border-white/20">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-github"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>
                          </Button>
                        </div>
                      </div>
                      
                      <div className="md:col-span-2 p-6">
                        <div className="mb-6">
                          <h4 className="text-xl font-semibold text-health-dark dark:text-white mb-2">About</h4>
                          <p className="text-gray-600 dark:text-gray-300">{member.bio}</p>
                        </div>
                        
                        <div className="grid md:grid-cols-2 gap-6">
                          <div>
                            {member.experience && (
                              <div className="mb-6">
                                <h4 className="text-lg font-semibold text-health-primary mb-3">Experience</h4>
                                <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                                  {member.experience.map((exp, i) => (
                                    <li key={i} className="flex items-start gap-2">
                                      <div className="mt-1.5 h-2 w-2 rounded-full bg-health-primary flex-shrink-0"></div>
                                      <span>{exp}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                            
                            {member.certifications && (
                              <div>
                                <h4 className="text-lg font-semibold text-health-primary mb-3">Certifications</h4>
                                <div className="flex flex-wrap gap-2">
                                  {member.certifications.map((cert, i) => (
                                    <Badge key={i} variant="outline" className="bg-health-primary/5 text-health-primary">
                                      {cert}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                          
                          {member.skills && (
                            <div>
                              <h4 className="text-lg font-semibold text-health-primary mb-3">Technical Skills</h4>
                              <div className="space-y-3">
                                <div>
                                  <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Advanced</h5>
                                  <div className="flex flex-wrap gap-2">
                                    {member.skills.filter(s => s.level === 'Advanced').map((skill, i) => (
                                      <Badge key={i} variant="outline" className="bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 border-green-200 dark:border-green-800">
                                        {skill.name}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                                <div>
                                  <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Intermediate</h5>
                                  <div className="flex flex-wrap gap-2">
                                    {member.skills.filter(s => s.level === 'Intermediate').map((skill, i) => (
                                      <Badge key={i} variant="outline" className="bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800">
                                        {skill.name}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                                <div>
                                  <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Beginner</h5>
                                  <div className="flex flex-wrap gap-2">
                                    {member.skills.filter(s => s.level === 'Beginner').map((skill, i) => (
                                      <Badge key={i} variant="outline" className="bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800">
                                        {skill.name}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-12 p-6 rounded-xl bg-gradient-to-r from-gray-50 to-white dark:from-slate-800/60 dark:to-slate-800/30 border border-gray-100 dark:border-slate-700 text-center shadow-sm">
                  <h3 className="text-xl font-semibold mb-3 text-health-primary">Interested in joining our team?</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">We're always looking for talented individuals passionate about health and technology</p>
                  <Button className="bg-health-primary hover:bg-health-primary/90 text-white">
                    View Careers
                  </Button>
                </div>
                
                <div className="text-center mt-8">
                  <p className="text-center text-gray-500 dark:text-gray-400 flex items-center justify-center gap-2">
                    <Coffee className="h-4 w-4" />
                    Built with care for health-conscious individuals
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default About;
