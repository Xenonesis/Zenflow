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
  Star
} from "lucide-react";
import { cn } from "@/lib/utils";

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
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial(prev => (prev + 1) % testimonials.length);
    }, 8000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-slate-900 dark:to-slate-800">
      {/* Hero Section */}
      <header className="relative overflow-hidden min-h-[90vh] flex items-center">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-health-primary/20 to-transparent opacity-70 dark:from-health-primary/10"></div>
        <div className="absolute -top-40 right-0 h-96 w-96 bg-health-secondary/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-20 h-96 w-96 bg-health-primary/20 rounded-full blur-3xl animate-pulse"></div>
        
        <div className="container mx-auto px-6 py-24 relative z-10">
          <motion.div 
            className="max-w-4xl mx-auto text-center space-y-8"
            initial="hidden"
            animate="visible"
            variants={fadeIn}
          >
            <motion.div variants={slideUp}>
              <Badge className="mb-6 px-6 py-2 text-lg font-medium bg-health-primary/10 text-health-primary border-0 backdrop-blur-sm">
                <Sparkles className="w-5 h-5 inline-block mr-2" />
                Meet ZenFlow
              </Badge>
            </motion.div>
            
            <motion.h1 
              variants={slideUp}
              className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-health-primary via-health-secondary to-health-primary bg-300% animate-gradient leading-tight"
            >
              Balance Your Mind <br/> 
              <span className="text-health-dark dark:text-white">Optimize Your Health</span>
            </motion.h1>
            
            <motion.p 
              variants={slideUp}
              className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mt-6 max-w-3xl mx-auto font-light leading-relaxed"
            >
              Your all-in-one dashboard for achieving peak mental and physical wellbeing, 
              powered by evidence-based techniques and cutting-edge AI
            </motion.p>
            
            <motion.div
              variants={slideUp}
              className="flex flex-col sm:flex-row gap-6 justify-center mt-12 items-center"
            >
              <Link to="/signup">
                <Button size="lg" className="bg-gradient-to-r from-health-primary to-health-secondary text-white hover:translate-y-[-2px] hover:shadow-lg transition-all duration-300 py-7 px-10 rounded-xl text-lg group">
                  Start Your Journey
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/signin" className="group">
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="border-gray-300 dark:border-gray-600 py-7 px-10 rounded-xl text-lg hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  <Users className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                  Login
                </Button>
              </Link>
            </motion.div>

            <motion.div
              variants={slideUp}
              className="mt-12 flex items-center justify-center gap-8 text-sm text-gray-500 dark:text-gray-400"
            >
              <div className="flex items-center">
                <CheckCircle2 className="h-5 w-5 text-green-500 mr-2" />
                Free 14-day trial
              </div>
              <div className="flex items-center">
                <Shield className="h-5 w-5 text-blue-500 mr-2" />
                No credit card required
              </div>
              <div className="flex items-center">
                <Star className="h-5 w-5 text-yellow-500 mr-2" />
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
            <div className="relative bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-gray-100 dark:border-slate-700 overflow-hidden transform hover:scale-[1.02] transition-transform duration-300">
              <div className="absolute top-0 right-0 h-40 w-40 bg-health-primary/5 rounded-full blur-2xl"></div>
              <div className="absolute bottom-0 left-0 h-40 w-40 bg-health-secondary/5 rounded-full blur-2xl"></div>
              <div className="h-2 w-full bg-gradient-to-r from-health-primary via-health-primary/80 to-health-secondary"></div>
              <div className="relative">
                <img 
                  src="/dashboard-preview.png" 
                  alt="ZenFlow Dashboard Preview" 
                  className="w-full h-auto border-t border-gray-100 dark:border-slate-700 shadow-lg"
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
                  className="w-full min-h-[300px] flex flex-col items-center justify-center p-10 border-t border-gray-100 dark:border-slate-700 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900"
                >
                  <h3 className="text-xl font-bold text-health-primary mb-2">ZenFlow Dashboard Preview</h3>
                  <p className="text-center text-gray-600 dark:text-gray-300 mb-4">Experience a holistic view of your physical and mental wellbeing in one intuitive dashboard</p>
                  <div className="grid grid-cols-2 gap-3 text-sm max-w-md mx-auto w-full">
                    <div className="bg-white dark:bg-slate-700 p-3 rounded-lg shadow-sm flex items-center">
                      <div className="w-4 h-4 rounded-full bg-health-primary mr-2"></div>
                      Activity Tracking
                    </div>
                    <div className="bg-white dark:bg-slate-700 p-3 rounded-lg shadow-sm flex items-center">
                      <div className="w-4 h-4 rounded-full bg-green-500 mr-2"></div>
                      Mood Analysis
                    </div>
                    <div className="bg-white dark:bg-slate-700 p-3 rounded-lg shadow-sm flex items-center">
                      <div className="w-4 h-4 rounded-full bg-blue-500 mr-2"></div>
                      Sleep Insights
                    </div>
                    <div className="bg-white dark:bg-slate-700 p-3 rounded-lg shadow-sm flex items-center">
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
        className="py-32 bg-gray-50/50 dark:bg-slate-900/50 relative overflow-hidden"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={staggerContainer}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-health-primary/5 via-transparent to-transparent opacity-70"></div>
        <div className="container mx-auto px-6 relative z-10">
          <motion.div 
            className="text-center max-w-3xl mx-auto mb-20"
            variants={slideUp}
          >
            <Badge className="mb-4 px-4 py-1.5 bg-health-primary/10 text-health-primary border-0">
              <Activity className="w-4 h-4 inline-block mr-2" />
              Features
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-health-dark dark:text-white mb-6 bg-clip-text text-transparent bg-gradient-to-r from-health-primary to-health-secondary">
              The Complete Wellbeing Platform
            </h2>
            <p className="text-gray-600 dark:text-gray-300 text-lg md:text-xl">
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
                <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm group">
                  <div className="h-1.5 w-full bg-gradient-to-r from-health-primary/30 to-health-secondary/30 group-hover:from-health-primary group-hover:to-health-secondary transition-all duration-300"></div>
                  <CardContent className="p-8">
                    <div className="rounded-xl w-14 h-14 flex items-center justify-center bg-health-primary/10 text-health-primary mb-6 group-hover:scale-110 transition-transform duration-300">
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-semibold mb-4 text-health-dark dark:text-white group-hover:text-health-primary transition-colors duration-300">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
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
                className="group hover:bg-health-primary hover:text-white transition-all duration-300"
              >
                Explore All Features
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
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
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-health-primary/5 to-transparent dark:from-health-primary/10 opacity-70"></div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div variants={slideUp}>
              <Badge className="mb-4 px-3 py-1 bg-health-primary/10 text-health-primary border-0">
                Our Approach
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-health-dark dark:text-white mb-6">
                Science-Backed Methodology
              </h2>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="rounded-full p-2 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 flex-shrink-0 h-10 w-10 flex items-center justify-center">
                    <BrainCircuit className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-1 text-amber-600 dark:text-amber-400">Flow Psychology</h3>
                    <p className="text-gray-600 dark:text-gray-300">Based on Mihaly Csikszentmihalyi's research on optimal states of consciousness where focus and enjoyment meet.</p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="rounded-full p-2 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 flex-shrink-0 h-10 w-10 flex items-center justify-center">
                    <Lightbulb className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-1 text-purple-600 dark:text-purple-400">Mindfulness Research</h3>
                    <p className="text-gray-600 dark:text-gray-300">Integrates evidence-based mindfulness practices shown to reduce stress and improve cognitive performance.</p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="rounded-full p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex-shrink-0 h-10 w-10 flex items-center justify-center">
                    <LineChart className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-1 text-blue-600 dark:text-blue-400">Data-Driven Insights</h3>
                    <p className="text-gray-600 dark:text-gray-300">Advanced pattern recognition identifies connections between physical activity, sleep, mood, and cognitive performance.</p>
                  </div>
                </div>
              </div>
              
              <Link to="/about" className="inline-flex items-center text-health-primary mt-8 hover:underline">
                Learn more about our methodology
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </motion.div>
            
            <motion.div 
              variants={slideUp} 
              className="relative"
            >
              <div className="absolute -top-10 -right-10 h-40 w-40 bg-health-secondary/10 rounded-full blur-2xl"></div>
              <div className="absolute -bottom-10 -left-10 h-40 w-40 bg-health-primary/10 rounded-full blur-2xl"></div>
              <Card className="border-0 shadow-xl overflow-hidden bg-gradient-to-br from-white to-gray-50 dark:from-slate-800 dark:to-slate-900">
                <CardContent className="p-8 relative z-10">
                  <div className="space-y-6">
                    <div className="flex items-center gap-4">
                      <CheckCircle2 className="h-6 w-6 text-green-500" />
                      <div>
                        <h4 className="font-semibold text-lg">500% Productivity Increase</h4>
                        <p className="text-gray-600 dark:text-gray-300 text-sm">Potential productivity boost in flow state</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <CheckCircle2 className="h-6 w-6 text-green-500" />
                      <div>
                        <h4 className="font-semibold text-lg">38% Stress Reduction</h4>
                        <p className="text-gray-600 dark:text-gray-300 text-sm">Average stress reduction with regular mindfulness practice</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <CheckCircle2 className="h-6 w-6 text-green-500" />
                      <div>
                        <h4 className="font-semibold text-lg">72% Improved Sleep Quality</h4>
                        <p className="text-gray-600 dark:text-gray-300 text-sm">Users report better sleep after 3 weeks</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <CheckCircle2 className="h-6 w-6 text-green-500" />
                      <div>
                        <h4 className="font-semibold text-lg">85% Better Work-Life Balance</h4>
                        <p className="text-gray-600 dark:text-gray-300 text-sm">Users report improved balance after 2 months</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-8 pt-6 border-t border-gray-100 dark:border-slate-700">
                    <div className="flex items-center gap-2">
                      <Star className="h-5 w-5 text-amber-400" fill="#F59E0B" />
                      <Star className="h-5 w-5 text-amber-400" fill="#F59E0B" />
                      <Star className="h-5 w-5 text-amber-400" fill="#F59E0B" />
                      <Star className="h-5 w-5 text-amber-400" fill="#F59E0B" />
                      <Star className="h-5 w-5 text-amber-400" fill="#F59E0B" />
                      <span className="text-gray-600 dark:text-gray-300 ml-2">4.9/5 average rating</span>
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
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-health-secondary/5 to-transparent dark:from-health-secondary/10"></div>
        <div className="container mx-auto px-6 relative z-10">
          <motion.div 
            className="text-center max-w-3xl mx-auto mb-20"
            variants={slideUp}
          >
            <Badge className="mb-4 px-4 py-1.5 bg-health-primary/10 text-health-primary border-0">
              <Users className="w-4 h-4 inline-block mr-2" />
              Testimonials
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-health-dark dark:text-white mb-6">
              What Our Users Say
            </h2>
            <p className="text-gray-600 dark:text-gray-300 text-lg md:text-xl">
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
                <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
                  <CardContent className="p-8">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="rounded-full w-12 h-12 bg-gradient-to-br from-health-primary to-health-secondary flex items-center justify-center text-white font-bold text-xl">
                        {testimonial.author.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-semibold text-lg text-health-dark dark:text-white">{testimonial.author}</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{testimonial.role}</p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                        ))}
                      </div>
                      <p className="text-gray-600 dark:text-gray-300 italic">"{testimonial.quote}"</p>
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
        className="py-32 bg-gradient-to-br from-health-primary/90 to-health-secondary/90 text-white relative overflow-hidden"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={staggerContainer}
      >
        <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.8))]"></div>
        <div className="absolute -top-40 -right-40 h-96 w-96 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 h-96 w-96 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div 
              variants={slideUp}
              className="space-y-8"
            >
              <Badge className="mb-4 px-6 py-2 text-lg bg-white/20 text-white border-white/30 backdrop-blur-sm">
                <Sparkles className="w-5 h-5 inline-block mr-2" />
                Get Started Today
              </Badge>
              <h2 className="text-4xl md:text-6xl font-bold mb-8">
                Transform Your Wellbeing With ZenFlow
              </h2>
              <p className="text-xl md:text-2xl opacity-90 font-light mb-12 max-w-3xl mx-auto">
                Join thousands of users optimizing their physical and mental health in one integrated platform
              </p>
              
              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                <Link to="/signup">
                  <Button size="lg" className="bg-white text-health-primary hover:bg-white/90 hover:translate-y-[-2px] hover:shadow-lg transition-all duration-300 py-7 px-10 rounded-xl text-lg group">
                    Start Your Free Trial
                    <Trophy className="ml-2 h-5 w-5 group-hover:rotate-12 transition-transform" />
                  </Button>
                </Link>
                <Link to="/dashboard">
                  <Button 
                    variant="outline" 
                    size="lg"
                    className="border-white/30 bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 py-7 px-10 rounded-xl text-lg group"
                  >
                    View Demo Dashboard
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
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
      <footer className="bg-white dark:bg-slate-800 py-16 border-t border-gray-100 dark:border-slate-700">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-8 md:mb-0">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 bg-gradient-to-br from-health-primary to-health-secondary rounded-lg flex items-center justify-center text-white font-bold">Z</div>
                <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-health-primary to-health-secondary">ZenFlow</span>
              </div>
              <p className="text-gray-500 dark:text-gray-400 mt-2">Balance your mind. Optimize your health.</p>
            </div>
            
            <div className="flex gap-8">
              <Link to="/about" className="text-gray-600 dark:text-gray-300 hover:text-health-primary dark:hover:text-health-primary transition-colors">About</Link>
              <a href="#" className="text-gray-600 dark:text-gray-300 hover:text-health-primary dark:hover:text-health-primary transition-colors">Features</a>
              <a href="#" className="text-gray-600 dark:text-gray-300 hover:text-health-primary dark:hover:text-health-primary transition-colors">Privacy</a>
              <a href="#" className="text-gray-600 dark:text-gray-300 hover:text-health-primary dark:hover:text-health-primary transition-colors">Contact</a>
            </div>
          </div>
          
          <div className="border-t border-gray-100 dark:border-slate-700 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 dark:text-gray-400 text-sm">© 2024 ZenFlow. All rights reserved.</p>
            <div className="flex gap-4 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-health-primary dark:hover:text-health-primary transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951z"/>
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-health-primary dark:hover:text-health-primary transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M5.026 15c6.038 0 9.341-5.003 9.341-9.334 0-.14 0-.282-.006-.422A6.685 6.685 0 0 0 16 3.542a6.658 6.658 0 0 1-1.889.518 3.301 3.301 0 0 0 1.447-1.817 6.533 6.533 0 0 1-2.087.793A3.286 3.286 0 0 0 7.875 6.03a9.325 9.325 0 0 1-6.767-3.429 3.289 3.289 0 0 0 1.018 4.382A3.323 3.323 0 0 1 .64 6.575v.045a3.288 3.288 0 0 0 2.632 3.218 3.203 3.203 0 0 1-.865.115 3.23 3.23 0 0 1-.614-.057 3.283 3.283 0 0 0 3.067 2.277A6.588 6.588 0 0 1 .78 13.58a6.32 6.32 0 0 1-.78-.045A9.344 9.344 0 0 0 5.026 15z"/>
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-health-primary dark:hover:text-health-primary transition-colors">
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