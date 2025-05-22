import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Activity,
  BrainCircuit, 
  ArrowRight, 
  Sparkles, 
  HeartPulse,
  LineChart,
  Shield,
  Lightbulb,
  CheckCircle2,
  Trophy,
  Users,
  Star,
  Sun,
  Moon,
  Monitor
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTheme } from "@/components/theme/ThemeProvider";

// Animation variants
const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.6 } }
};

const slideUp = {
  hidden: { y: 30, opacity: 0 },
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

const float = {
  animate: {
    y: [-10, 10, -10],
    transition: { duration: 3, repeat: Infinity, ease: "easeInOut" }
  }
};

const features = [
  {
    icon: <Activity className="h-5 w-5" />,
    title: "Physical Health Tracking",
    description: "Track workouts, personal records, and physical progress with intuitive visualization tools"
  },
  {
    icon: <HeartPulse className="h-5 w-5" />,
    title: "Mental Wellbeing",
    description: "Monitor mood, journal entries, meditation sessions, and other mental health indicators"
  },
  {
    icon: <BrainCircuit className="h-5 w-5" />,
    title: "Flow State Optimization",
    description: "Identify your optimal flow state triggers and track your peak performance moments"
  },
  {
    icon: <LineChart className="h-5 w-5" />,
    title: "Data-Driven Insights",
    description: "Get personalized recommendations based on your unique health patterns"
  },
  {
    icon: <Shield className="h-5 w-5" />,
    title: "Privacy-First Approach",
    description: "Your health data belongs to you with our secure, encrypted storage"
  },
  {
    icon: <Sparkles className="h-5 w-5" />,
    title: "AI-Powered Analysis",
    description: "Advanced algorithms identify patterns and offer personalized health recommendations"
  }
];

const testimonials = [
  {
    quote: "ZenFlow has completely changed how I approach my mental health. The mood tracking and meditation features have become essential parts of my daily routine.",
    author: "Sarah J.",
    role: "Software Engineer"
  },
  {
    quote: "As someone who tracks both fitness and mental wellbeing, having everything in one place is incredible. The flow state tracking has improved my productivity by at least 30%.",
    author: "Michael T.",
    role: "Marketing Executive"
  },
  {
    quote: "The data visualization in ZenFlow makes it easy to spot patterns in my health that I never noticed before. It's like having a personal health coach.",
    author: "Priya K.",
    role: "Healthcare Professional"
  }
];

const Landing = () => {
  const { theme, setTheme } = useTheme();
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial(prev => (prev + 1) % testimonials.length);
    }, 8000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white dark:from-slate-900 dark:to-slate-800">
      {/* Hero Section */}
      <header className="relative overflow-hidden min-h-[90vh] flex items-center">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-600/40 via-teal-500/20 to-transparent opacity-90 dark:from-indigo-700/30 dark:via-teal-600/15"></div>
        <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.7))]"></div>
        <div className="absolute -top-80 right-0 h-[700px] w-[700px] bg-gradient-to-br from-indigo-500/50 to-teal-400/50 rounded-full blur-3xl animate-pulse opacity-70"></div>
        <div className="absolute -bottom-80 left-0 h-[700px] w-[700px] bg-gradient-to-br from-purple-500/50 to-pink-400/50 rounded-full blur-3xl animate-pulse opacity-70"></div>
        
        {/* Particle Animation Background */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute h-2 w-2 bg-white/30 rounded-full"
              initial={{
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
                scale: Math.random() * 0.5 + 0.5
              }}
              animate={{
                y: [0, -window.innerHeight],
                opacity: [0, 1, 0],
                transition: {
                  duration: Math.random() * 10 + 5,
                  repeat: Infinity,
                  delay: Math.random() * 5,
                  ease: "linear"
                }
              }}
            />
          ))}
        </div>
        
        {/* Floating Decorative Elements */}
        <motion.div
          className="absolute top-20 left-10 h-16 w-16 bg-gradient-to-br from-indigo-400/50 to-teal-300/50 rounded-full blur-xl"
          variants={float}
          animate="animate"
        />
        <motion.div
          className="absolute bottom-20 right-10 h-20 w-20 bg-gradient-to-br from-purple-400/50 to-pink-300/50 rounded-full blur-xl"
          variants={float}
          animate="animate"
        />
        
        {/* Theme Toggle */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          className="absolute top-6 right-6 z-20"
        >
          <Select
            value={theme}
            onValueChange={(value) => setTheme(value as 'light' | 'dark' | 'system')}
          >
            <SelectTrigger className="relative bg-white/20 dark:bg-indigo-900/50 border-white/30 dark:border-indigo-700/50 text-slate-800 dark:text-white font-semibold rounded-xl shadow-md backdrop-blur-md hover:bg-white/30 dark:hover:bg-indigo-800/60 transition-all duration-300 w-[160px]">
              <SelectValue placeholder="Select Theme" />
            </SelectTrigger>
            <SelectContent className="bg-white dark:bg-indigo-900 border-white/30 dark:border-indigo-700/50 backdrop-blur-md">
              <SelectItem value="light" className="text-slate-800 dark:text-white">
                <div className="flex items-center gap-2">
                  <Sun className="h-4 w-4" />
                  Light Mode
                </div>
              </SelectItem>
              <SelectItem value="dark" className="text-slate-800 dark:text-white">
                <div className="flex items-center gap-2">
                  <Moon className="h-4 w-4" />
                  Dark Mode
                </div>
              </SelectItem>
              <SelectItem value="system" className="text-slate-800 dark:text-white">
                <div className="flex items-center gap-2">
                  <Monitor className="h-4 w-4" />
                  System Mode
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </motion.div>
        
        <div className="container mx-auto px-6 py-24 relative z-10">
          <motion.div 
            className="max-w-4xl mx-auto text-center space-y-8"
            initial="hidden"
            animate="visible"
            variants={fadeIn}
          >
            <motion.div variants={slideUp}>
              <Badge className="mb-6 px-6 py-2 text-lg font-medium bg-white/20 text-white border-white/30 backdrop-blur-md hover:bg-white/30 dark:bg-indigo-900/50 dark:text-indigo-100 dark:hover:bg-indigo-800/60 transition-all duration-300 shadow-md">
                <Sparkles className="w-5 h-5 inline-block mr-2 animate-pulse" />
                Meet ZenFlow
              </Badge>
            </motion.div>
            
            <motion.h1 
              variants={slideUp}
              className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-teal-500 to-purple-600 bg-300% animate-gradient leading-tight tracking-tight"
            >
              Balance Your Mind <br/> 
              <span className="text-slate-800 dark:text-white">Optimize Your Health</span>
            </motion.h1>
            
            <motion.p 
              variants={slideUp}
              className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 mt-6 max-w-3xl mx-auto font-light leading-relaxed"
            >
              Your all-in-one dashboard for achieving peak mental and physical wellbeing, 
              powered by evidence-based techniques and cutting-edge AI
            </motion.p>
            
            <motion.div
              variants={slideUp}
              className="flex flex-col sm:flex-row gap-6 justify-center mt-12 items-center"
            >
              <Link to="/signup">
                <Button 
                  size="lg" 
                  className="relative bg-gradient-to-r from-indigo-600 to-teal-500 text-white py-7 px-12 rounded-xl text-lg font-semibold overflow-hidden group shadow-lg shadow-indigo-500/40 hover:shadow-2xl transition-all duration-300"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-indigo-700 via-teal-600 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                  <span className="relative flex items-center">
                    Start Your Journey
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-2 transition-transform" />
                  </span>
                </Button>
              </Link>
              <Link to="/signin" className="group">
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="relative border-white/40 bg-white/20 dark:bg-indigo-900/50 text-white dark:text-indigo-100 py-7 px-12 rounded-xl text-lg font-semibold overflow-hidden group shadow-md backdrop-blur-md hover:shadow-lg transition-all duration-300"
                >
                  <span className="absolute inset-0 bg-white/30 dark:bg-indigo-800/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                  <span className="relative flex items-center">
                    <Users className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                    Login
                  </span>
                </Button>
              </Link>
            </motion.div>

            <motion.div
              variants={slideUp}
              className="mt-12 flex flex-wrap justify-center gap-8 text-sm text-slate-500 dark:text-slate-400"
            >
              <div className="flex items-center bg-white/20 dark:bg-indigo-900/50 px-4 py-2 rounded-full shadow-md backdrop-blur-md hover:bg-white/30 dark:hover:bg-indigo-800/60 transition-all duration-300">
                <CheckCircle2 className="h-5 w-5 text-emerald-500 mr-2" />
                Free 14-day trial
              </div>
              <div className="flex items-center bg-white/20 dark:bg-indigo-900/50 px-4 py-2 rounded-full shadow-md backdrop-blur-md hover:bg-white/30 dark:hover:bg-indigo-800/60 transition-all duration-300">
                <Shield className="h-5 w-5 text-blue-500 mr-2" />
                No credit card required
              </div>
              <div className="flex items-center bg-white/20 dark:bg-indigo-900/50 px-4 py-2 rounded-full shadow-md backdrop-blur-md hover:bg-white/30 dark:hover:bg-indigo-800/60 transition-all duration-300">
                <Star className="h-5 w-5 text-amber-500 mr-2 fill-amber-500" />
                4.9/5 user rating
              </div>
            </motion.div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="mt-16 md:mt-24 max-w-6xl mx-auto"
          >
            <div className="relative bg-white/20 dark:bg-indigo-900/50 rounded-2xl shadow-2xl border border-white/30 dark:border-indigo-700/50 overflow-hidden backdrop-blur-md hover:scale-[1.02] transition-transform duration-300">
              <div className="absolute top-0 right-0 h-56 w-56 bg-gradient-to-br from-indigo-500/30 to-teal-400/30 rounded-full blur-3xl animate-pulse"></div>
              <div className="absolute bottom-0 left-0 h-56 w-56 bg-gradient-to-br from-purple-500/30 to-pink-400/30 rounded-full blur-3xl animate-pulse"></div>
              <div className="h-2 w-full bg-gradient-to-r from-indigo-600 via-teal-500 to-purple-600 bg-300% animate-gradient"></div>
              <div className="relative">
                <img 
                  src="/dashboard-preview.png" 
                  alt="ZenFlow Dashboard Preview" 
                  className="w-full h-auto border-t border-white/30 dark:border-indigo-700/50 shadow-inner"
                  onError={(e) => {
                    if (e && e.currentTarget) {
                      e.currentTarget.style.display = 'none';
                    }
                    const fallbackEl = document.getElementById('dashboard-preview-fallback');
                    if (fallbackEl) {
                      fallbackEl.style.display = 'flex';
                    }
                  }}
                />
                <div 
                  id="dashboard-preview-fallback"
                  style={{ display: 'none' }} 
                  className="w-full min-h-[300px] flex flex-col items-center justify-center p-10 border-t border-white/30 dark:border-indigo-700/50 bg-gradient-to-br from-white/20 to-slate-100/20 dark:from-indigo-900/50 dark:to-slate-900/50 backdrop-blur-md"
                >
                  <h3 className="text-xl font-bold text-indigo-600 dark:text-indigo-100 mb-2">ZenFlow Dashboard Preview</h3>
                  <p className="text-center text-slate-600 dark:text-slate-200 mb-4">Experience a holistic view of your physical and mental wellbeing in one intuitive dashboard</p>
                  <div className="grid grid-cols-2 gap-3 text-sm max-w-md mx-auto w-full">
                    <div className="bg-white/20 dark:bg-indigo-900/50 p-3 rounded-lg shadow-md flex items-center backdrop-blur-md hover:bg-white/30 dark:hover:bg-indigo-800/60 transition-all duration-300">
                      <div className="w-4 h-4 rounded-full bg-indigo-600 mr-2"></div>
                      Activity Tracking
                    </div>
                    <div className="bg-white/20 dark:bg-indigo-900/50 p-3 rounded-lg shadow-md flex items-center backdrop-blur-md hover:bg-white/30 dark:hover:bg-indigo-800/60 transition-all duration-300">
                      <div className="w-4 h-4 rounded-full bg-emerald-500 mr-2"></div>
                      Mood Analysis
                    </div>
                    <div className="bg-white/20 dark:bg-indigo-900/50 p-3 rounded-lg shadow-md flex items-center backdrop-blur-md hover:bg-white/30 dark:hover:bg-indigo-800/60 transition-all duration-300">
                      <div className="w-4 h-4 rounded-full bg-blue-500 mr-2"></div>
                      Sleep Insights
                    </div>
                    <div className="bg-white/20 dark:bg-indigo-900/50 p-3 rounded-lg shadow-md flex items-center backdrop-blur-md hover:bg-white/30 dark:hover:bg-indigo-800/60 transition-all duration-300">
                      <div className="w-4 h-4 rounded-full bg-amber-500 mr-2"></div>
                      Personal Records
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </header>
      
      {/* Features Section */}
      <motion.section 
        className="py-32 relative overflow-hidden"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={staggerContainer}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-teal-500/20 via-transparent to-transparent opacity-80 dark:from-teal-600/15"></div>
        <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.7))]"></div>
        <div className="absolute -top-60 left-0 h-[600px] w-[600px] bg-gradient-to-br from-indigo-500/40 to-teal-400/40 rounded-full blur-3xl animate-pulse opacity-70"></div>
        <div className="absolute -bottom-60 right-0 h-[600px] w-[600px] bg-gradient-to-br from-purple-500/40 to-pink-400/40 rounded-full blur-3xl animate-pulse opacity-70"></div>
        
        {/* Floating Decorative Elements */}
        <motion.div
          className="absolute top-20 right-20 h-16 w-16 bg-gradient-to-br from-teal-400/50 to-emerald-300/50 rounded-full blur-xl"
          variants={float}
          animate="animate"
        />
        <motion.div
          className="absolute bottom-20 left-20 h-20 w-20 bg-gradient-to-br from-purple-400/50 to-pink-300/50 rounded-full blur-xl"
          variants={float}
          animate="animate"
        />
        
        <div className="container mx-auto px-6 relative z-10">
          <motion.div 
            className="text-center max-w-3xl mx-auto mb-20"
            variants={slideUp}
          >
            <Badge className="mb-4 px-4 py-1.5 bg-white/20 text-white border-white/30 backdrop-blur-md hover:bg-white/30 dark:bg-indigo-900/50 dark:text-indigo-100 dark:hover:bg-indigo-800/60 transition-all duration-300 shadow-md">
              <Activity className="w-4 h-4 inline-block mr-2 animate-pulse" />
              Features
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-800 dark:text-white mb-6 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-teal-500 to-purple-600 bg-300% animate-gradient tracking-tight">
              The Complete Wellbeing Platform
            </h2>
            <p className="text-slate-600 dark:text-slate-300 text-lg md:text-xl leading-relaxed">
              Experience a revolutionary approach to health tracking that combines physical fitness and mental wellbeing in one seamless platform
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div 
                key={index}
                variants={slideUp}
                whileHover={{ y: -5 }}
                transition={{ duration: 0.2 }}
              >
                <Card className="h-full border-0 shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden bg-white/20 dark:bg-indigo-900/50 backdrop-blur-md group">
                  <div className="h-1.5 w-full bg-gradient-to-r from-indigo-600 via-teal-500 to-purple-600 bg-300% animate-gradient group-hover:bg-gradient-to-r group-hover:from-indigo-700 group-hover:via-teal-600 group-hover:to-purple-700"></div>
                  <CardContent className="p-8">
                    <div className="rounded-xl w-14 h-14 flex items-center justify-center bg-white/20 text-white mb-6 group-hover:scale-110 group-hover:bg-white/30 transition-all duration-300 dark:bg-indigo-900/50 dark:text-indigo-100 dark:group-hover:bg-indigo-800/60">
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-semibold mb-4 text-slate-800 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-100 transition-colors duration-300">
                      {feature.title}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-200 leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <motion.div 
            variants={slideUp}
            className="mt-16 text-center"
          >
            <Link to="/about">
              <Button 
                variant="outline" 
                size="lg"
                className="relative border-white/40 bg-white/20 dark:bg-indigo-900/50 text-white dark:text-indigo-100 py-7 px-12 rounded-xl text-lg font-semibold overflow-hidden group shadow-md backdrop-blur-md hover:shadow-lg transition-all duration-300"
              >
                <span className="absolute inset-0 bg-white/30 dark:bg-indigo-800/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                <span className="relative flex items-center">
                  Explore All Features
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-2 transition-transform" />
                </span>
              </Button>
            </Link>
          </motion.div>
        </div>
      </motion.section>
      
      {/* Science & Methodology Section */}
      <motion.section 
        className="py-24 relative overflow-hidden"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={staggerContainer}
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-purple-500/20 via-transparent to-transparent opacity-80 dark:from-purple-600/15"></div>
        <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.7))]"></div>
        <div className="absolute -top-60 right-0 h-[600px] w-[600px] bg-gradient-to-br from-indigo-500/40 to-teal-400/40 rounded-full blur-3xl animate-pulse opacity-70"></div>
        <div className="absolute -bottom-60 left-0 h-[600px] w-[600px] bg-gradient-to-br from-purple-500/40 to-pink-400/40 rounded-full blur-3xl animate-pulse opacity-70"></div>
        
        {/* Floating Decorative Elements */}
        <motion.div
          className="absolute top-20 left-20 h-16 w-16 bg-gradient-to-br from-purple-400/50 to-pink-300/50 rounded-full blur-xl"
          variants={float}
          animate="animate"
        />
        <motion.div
          className="absolute bottom-20 right-20 h-20 w-20 bg-gradient-to-br from-teal-400/50 to-emerald-300/50 rounded-full blur-xl"
          variants={float}
          animate="animate"
        />
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div variants={slideUp}>
              <Badge className="mb-4 px-3 py-1 bg-white/20 text-white border-white/30 backdrop-blur-md hover:bg-white/30 dark:bg-indigo-900/50 dark:text-indigo-100 dark:hover:bg-indigo-800/60 transition-all duration-300 shadow-md">
                Our Approach
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-800 dark:text-white mb-6 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-teal-500 to-purple-600 bg-300% animate-gradient tracking-tight">
                Science-Backed Methodology
              </h2>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="rounded-full p-2 bg-amber-100/80 dark:bg-amber-900/50 text-amber-600 dark:text-amber-400 flex-shrink-0 h-10 w-10 flex items-center justify-center backdrop-blur-md">
                    <BrainCircuit className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-1 text-amber-600 dark:text-amber-400">Flow Psychology</h3>
                    <p className="text-slate-600 dark:text-slate-200">Based on Mihaly Csikszentmihalyi's research on optimal states of consciousness where focus and enjoyment meet.</p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="rounded-full p-2 bg-purple-100/80 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400 flex-shrink-0 h-10 w-10 flex items-center justify-center backdrop-blur-md">
                    <Lightbulb className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-1 text-purple-600 dark:text-purple-400">Mindfulness Research</h3>
                    <p className="text-slate-600 dark:text-slate-200">Integrates evidence-based mindfulness practices shown to reduce stress and improve cognitive performance.</p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="rounded-full p-2 bg-blue-100/80 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 flex-shrink-0 h-10 w-10 flex items-center justify-center backdrop-blur-md">
                    <LineChart className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-1 text-blue-600 dark:text-blue-400">Data-Driven Insights</h3>
                    <p className="text-slate-600 dark:text-slate-200">Advanced pattern recognition identifies connections between physical activity, sleep, mood, and cognitive performance.</p>
                  </div>
                </div>
              </div>
              
              <Link to="/about" className="inline-flex items-center text-indigo-600 mt-8 hover:text-indigo-500 dark:text-indigo-100 dark:hover:text-indigo-200 transition-colors">
                Learn more about our methodology
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </motion.div>
            
            <motion.div 
              variants={slideUp} 
              className="relative"
            >
              <div className="absolute -top-12 -right-12 h-48 w-48 bg-gradient-to-br from-teal-400/30 to-emerald-300/30 rounded-full blur-3xl animate-pulse"></div>
              <div className="absolute -bottom-12 -left-12 h-48 w-48 bg-gradient-to-br from-purple-400/30 to-pink-300/30 rounded-full blur-3xl animate-pulse"></div>
              <Card className="border-0 shadow-2xl overflow-hidden bg-white/20 dark:bg-indigo-900/50 backdrop-blur-md hover:scale-[1.02] transition-transform duration-300">
                <div className="h-1.5 w-full bg-gradient-to-r from-indigo-600 via-teal-500 to-purple-600 bg-300% animate-gradient"></div>
                <CardContent className="p-8 relative z-10">
                  <div className="space-y-6">
                    <div className="flex items-center gap-4">
                      <CheckCircle2 className="h-6 w-6 text-emerald-500" />
                      <div>
                        <h4 className="font-semibold text-lg text-slate-800 dark:text-white">500% Productivity Increase</h4>
                        <p className="text-slate-600 dark:text-slate-200 text-sm">Potential productivity boost in flow state</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <CheckCircle2 className="h-6 w-6 text-emerald-500" />
                      <div>
                        <h4 className="font-semibold text-lg text-slate-800 dark:text-white">38% Stress Reduction</h4>
                        <p className="text-slate-600 dark:text-slate-200 text-sm">Average stress reduction with regular mindfulness practice</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <CheckCircle2 className="h-6 w-6 text-emerald-500" />
                      <div>
                        <h4 className="font-semibold text-lg text-slate-800 dark:text-white">72% Improved Sleep Quality</h4>
                        <p className="text-slate-600 dark:text-slate-200 text-sm">Users report better sleep after 3 weeks</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <CheckCircle2 className="h-6 w-6 text-emerald-500" />
                      <div>
                        <h4 className="font-semibold text-lg text-slate-800 dark:text-white">85% Better Work-Life Balance</h4>
                        <p className="text-slate-600 dark:text-slate-200 text-sm">Users report improved balance after 2 months</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-8 pt-6 border-t border-white/30 dark:border-indigo-700/50">
                    <div className="flex items-center gap-2">
                      <Star className="h-5 w-5 text-amber-400" fill="#F59E0B" />
                      <Star className="h-5 w-5 text-amber-400" fill="#F59E0B" />
                      <Star className="h-5 w-5 text-amber-400" fill="#F59E0B" />
                      <Star className="h-5 w-5 text-amber-400" fill="#F59E0B" />
                      <Star className="h-5 w-5 text-amber-400" fill="#F59E0B" />
                      <span className="text-slate-600 dark:text-slate-200 ml-2">4.9/5 average rating</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </motion.section>
      
      {/* Testimonials Section */}
      <motion.section 
        className="py-32 relative overflow-hidden"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={staggerContainer}
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-teal-500/20 via-transparent to-transparent opacity-80 dark:from-teal-600/15"></div>
        <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.7))]"></div>
        <div className="absolute -top-60 left-0 h-[600px] w-[600px] bg-gradient-to-br from-indigo-500/40 to-teal-400/40 rounded-full blur-3xl animate-pulse opacity-70"></div>
        <div className="absolute -bottom-60 right-0 h-[600px] w-[600px] bg-gradient-to-br from-purple-500/40 to-pink-400/40 rounded-full blur-3xl animate-pulse opacity-70"></div>
        
        {/* Floating Decorative Elements */}
        <motion.div
          className="absolute top-20 right-20 h-16 w-16 bg-gradient-to-br from-teal-400/50 to-emerald-300/50 rounded-full blur-xl"
          variants={float}
          animate="animate"
        />
        <motion.div
          className="absolute bottom-20 left-20 h-20 w-20 bg-gradient-to-br from-purple-400/50 to-pink-300/50 rounded-full blur-xl"
          variants={float}
          animate="animate"
        />
        
        <div className="container mx-auto px-6 relative z-10">
          <motion.div 
            className="text-center max-w-3xl mx-auto mb-20"
            variants={slideUp}
          >
            <Badge className="mb-4 px-4 py-1.5 bg-white/20 text-white border-white/30 backdrop-blur-md hover:bg-white/30 dark:bg-indigo-900/50 dark:text-indigo-100 dark:hover:bg-indigo-800/60 transition-all duration-300 shadow-md">
              <Users className="w-4 h-4 inline-block mr-2 animate-pulse" />
              Testimonials
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-800 dark:text-white mb-6 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-teal-500 to-purple-600 bg-300% animate-gradient tracking-tight">
              What Our Users Say
            </h2>
            <p className="text-slate-600 dark:text-slate-200 text-lg md:text-xl leading-relaxed">
              Join thousands of users who have transformed their wellbeing with ZenFlow
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                variants={slideUp}
                className={cn(
                  "relative",
                  index === 1 && "md:transform md:translate-y-12"
                )}
              >
                <Card className="h-full border-0 shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden bg-white/20 dark:bg-indigo-900/50 backdrop-blur-md">
                  <div className="h-1.5 w-full bg-gradient-to-r from-indigo-600 via-teal-500 to-purple-600 bg-300% animate-gradient"></div>
                  <CardContent className="p-8">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="rounded-full w-12 h-12 bg-gradient-to-br from-indigo-600 to-teal-500 flex items-center justify-center text-white font-bold text-xl shadow-inner">
                        {testimonial.author.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-semibold text-lg text-slate-800 dark:text-white">{testimonial.author}</h4>
                        <p className="text-sm text-slate-500 dark:text-slate-400">{testimonial.role}</p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-5 h-5 text-amber-400 fill-amber-400" />
                        ))}
                      </div>
                      <p className="text-slate-600 dark:text-slate-200 italic leading-relaxed">"{testimonial.quote}"</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>
      
      {/* CTA Section */}
      <motion.section 
        className="py-32 bg-gradient-to-br from-indigo-600 to-teal-500 text-white relative overflow-hidden"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={staggerContainer}
      >
        <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.8))]"></div>
        <div className="absolute -top-80 -right-40 h-[700px] w-[700px] bg-gradient-to-br from-white/20 to-teal-400/20 rounded-full blur-3xl animate-pulse opacity-70"></div>
        <div className="absolute -bottom-80 -left-40 h-[700px] w-[700px] bg-gradient-to-br from-white/20 to-purple-400/20 rounded-full blur-3xl animate-pulse opacity-70"></div>
        
        {/* Particle Animation Background */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute h-2 w-2 bg-white/30 rounded-full"
              initial={{
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
                scale: Math.random() * 0.5 + 0.5
              }}
              animate={{
                y: [0, -window.innerHeight],
                opacity: [0, 1, 0],
                transition: {
                  duration: Math.random() * 10 + 5,
                  repeat: Infinity,
                  delay: Math.random() * 5,
                  ease: "linear"
                }
              }}
            />
          ))}
        </div>
        
        {/* Floating Decorative Elements */}
        <motion.div
          className="absolute top-20 left-20 h-16 w-16 bg-gradient-to-br from-teal-400/50 to-emerald-300/50 rounded-full blur-xl"
          variants={float}
          animate="animate"
        />
        <motion.div
          className="absolute bottom-20 right-20 h-20 w-20 bg-gradient-to-br from-purple-400/50 to-pink-300/50 rounded-full blur-xl"
          variants={float}
          animate="animate"
        />
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div 
              variants={slideUp}
              className="space-y-8"
            >
              <Badge className="mb-4 px-6 py-2 text-lg bg-white/20 text-white border-white/30 backdrop-blur-md hover:bg-white/30 transition-all duration-300 shadow-md">
                <Sparkles className="w-5 h-5 inline-block mr-2 animate-pulse" />
                Get Started Today
              </Badge>
              <h2 className="text-4xl md:text-6xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-white via-teal-100 to-purple-100 bg-300% animate-gradient tracking-tight">
                Transform Your Wellbeing With ZenFlow
              </h2>
              <p className="text-xl md:text-2xl opacity-90 font-light mb-12 max-w-3xl mx-auto leading-relaxed">
                Join thousands of users optimizing their physical and mental health in one integrated platform
              </p>
              
              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                <Link to="/signup">
                  <Button 
                    size="lg" 
                    className="relative bg-gradient-to-r from-white to-teal-100 text-indigo-600 py-7 px-12 rounded-xl text-lg font-semibold overflow-hidden group shadow-lg shadow-indigo-500/40 hover:shadow-2xl transition-all duration-300"
                  >
                    <span className="absolute inset-0 bg-gradient-to-r from-white/90 via-teal-200/90 to-purple-200/90 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                    <span className="relative flex items-center">
                      Start Your Free Trial
                      <Trophy className="ml-2 h-5 w-5 group-hover:rotate-12 transition-transform" />
                    </span>
                  </Button>
                </Link>
                <Link to="/dashboard">
                  <Button 
                    variant="outline" 
                    size="lg"
                    className="relative border-white/30 bg-white/20 text-white py-7 px-12 rounded-xl text-lg font-semibold overflow-hidden group shadow-md backdrop-blur-md hover:shadow-lg transition-all duration-300"
                  >
                    <span className="absolute inset-0 bg-white/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                    <span className="relative flex items-center">
                      View Demo Dashboard
                      <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-2 transition-transform" />
                    </span>
                  </Button>
                </Link>
              </div>
              <p className="text-white/80 mt-8 flex items-center justify-center gap-2">
                <Shield className="h-5 w-5" />
                No credit card required • Free 14-day trial
              </p>
            </motion.div>
          </div>
        </div>
      </motion.section>
      
      {/* Footer */}
      <footer className="bg-white/20 dark:bg-indigo-900/50 py-16 border-t border-white/30 dark:border-indigo-700/50 backdrop-blur-md relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.7))]"></div>
        <div className="absolute -top-40 left-0 h-[500px] w-[500px] bg-gradient-to-br from-indigo-500/30 to-teal-400/30 rounded-full blur-3xl animate-pulse opacity-70"></div>
        <div className="absolute -bottom-40 right-0 h-[500px] w-[500px] bg-gradient-to-br from-purple-500/30 to-pink-400/30 rounded-full blur-3xl animate-pulse opacity-70"></div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-8 md:mb-0">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 bg-gradient-to-br from-indigo-600 to-teal-500 rounded-lg flex items-center justify-center text-white font-bold shadow-inner">
                  Z
                </div>
                <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-teal-500 to-purple-600 bg-300% animate-gradient">
                  ZenFlow
                </span>
              </div>
              <p className="text-slate-500 dark:text-slate-200 mt-2">Balance your mind. Optimize your health.</p>
            </div>
            
            <div className="flex gap-8">
              <Link to="/about" className="text-slate-600 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-100 transition-colors">About</Link>
              <a href="#" className="text-slate-600 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-100 transition-colors">Features</a>
              <a href="#" className="text-slate-600 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-100 transition-colors">Privacy</a>
              <a href="#" className="text-slate-600 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-100 transition-colors">Contact</a>
            </div>
          </div>
          
          <div className="border-t border-white/30 dark:border-indigo-700/50 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-slate-500 dark:text-slate-200 text-sm">© 2025 ZenFlow. All rights reserved.</p>
            <div className="flex gap-4 mt-4 md:mt-0">
              <a href="#" className="text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-100 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951z"/>
                </svg>
              </a>
              <a href="#" className="text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-100 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M5.026 15c6.038 0 9.341-5.003 9.341-9.334 0-.14 0-.282-.006-.422A6.685 6.685 0 0 0 16 3.542a6.658 6.658 0 0 1-1.889.518 3.301 3.301 0 0 0 1.447-1.817 6.533 6.533 0 0 1-2.087.793A3.286 3.286 0 0 0 7.875 6.03a9.325 9.325 0 0 1-6.767-3.429 3.289 3.289 0 0 0 1.018 4.382A3.323 3.323 0 0 1 .64 6.575v.045a3.288 3.288 0 0 0 2.632 3.218 3.203 3.203 0 0 1-.865.115 3.23 3.23 0 0 1-.614-.057 3.283 3.283 0 0 0 3.067 2.277A6.588 6.588 0 0 1 .78 13.58a6.32 6.32 0 0 1-.78-.045A9.344 9.344 0 0 0 5.026 15z"/>
                </svg>
              </a>
              <a href="#" className="text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-100 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;