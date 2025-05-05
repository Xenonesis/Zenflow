import { useState, useEffect, useRef } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Bot, 
  Send, 
  User, 
  LineChart, 
  BarChart3, 
  PieChart, 
  Settings, 
  Zap, 
  Coffee, 
  Moon, 
  Brain, 
  BookHeart, 
  Dumbbell,
  Sparkles
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { aiService, AISettings } from "@/services/ai-service";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Suggested questions by category
const suggestedQuestions = {
  sleep: [
    "How has my sleep quality been this month?",
    "What's the relationship between my sleep and mood?",
    "When is my optimal bedtime based on my data?",
  ],
  workouts: [
    "Am I balancing cardio and strength training well?",
    "What workout should I focus on next?",
    "How consistent have I been with my exercise routine?",
  ],
  mood: [
    "What factors affect my mood the most?",
    "How can I improve my mental wellbeing?",
    "What patterns do you see in my mood data?",
  ],
  nutrition: [
    "Am I getting enough protein in my diet?",
    "What nutrition changes would improve my energy levels?",
    "How does my diet affect my workout performance?",
  ]
};

const AIInsights = () => {
  const [healthMode, setHealthMode] = useState<"physical" | "mental">("physical");
  const [messages, setMessages] = useState<Array<{role: "user" | "assistant"; content: string}>>([
    {role: "assistant", content: "Hello! I'm your AI health assistant. How can I help you analyze your health data today?"}
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [aiSettings, setAiSettings] = useState<AISettings | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [selectedTab, setSelectedTab] = useState<string>("chat");

  // Scroll to bottom of messages when new message is added
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Load user's AI settings
  useEffect(() => {
    const loadAISettings = async () => {
      if (!user) return;
      
      try {
        const settings = await aiService.getUserAISettings(user.id);
        setAiSettings(settings);
      } catch (err) {
        console.error("Failed to load AI settings:", err);
      }
    };
    
    loadAISettings();
  }, [user]);

  const handleSendMessage = async (messageText = input) => {
    if (!messageText.trim() || !user) return;
    
    // Add user message
    const userMessage = {role: "user" as const, content: messageText};
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    
    try {
      // Process the message with the AI service
      const response = await aiService.processPrompt(user.id, messageText);
      
      if (response.success && response.content) {
        const aiResponse = {
          role: "assistant" as const, 
          content: response.content
        };
        setMessages(prev => [...prev, aiResponse]);
      } else {
        // Handle error
        const errorMessage = response.error || "Sorry, I couldn't process your request. Please try again.";
        const aiResponse = {
          role: "assistant" as const, 
          content: errorMessage
        };
        setMessages(prev => [...prev, aiResponse]);
        
        // Show toast for configuration issues
        if (errorMessage.includes("AI settings not found")) {
          toast({
            title: "AI Configuration Required",
            description: "Please configure your AI settings in the Settings page.",
            variant: "destructive",
          });
        }
      }
    } catch (err) {
      console.error("Error processing message:", err);
      const aiResponse = {
        role: "assistant" as const, 
        content: "Sorry, an error occurred while processing your request. Please try again later."
      };
      setMessages(prev => [...prev, aiResponse]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Handle clicking a suggested question
  const handleSuggestedQuestion = (question: string) => {
    setInput(question);
    handleSendMessage(question);
  };

  const renderInsightCard = (icon: React.ReactNode, title: string, description: string, value?: string, change?: string) => (
    <Card className="overflow-hidden border-none shadow-md transition-all hover:shadow-lg">
      <CardHeader className="pb-2 bg-gradient-to-r from-health-primary/10 to-health-secondary/5">
        <CardTitle className="text-lg flex items-center">
          {icon}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <p className="text-sm text-muted-foreground mb-2">{description}</p>
        {value && (
          <div className="mt-2 flex items-baseline">
            <span className="text-2xl font-bold text-health-primary">{value}</span>
            {change && (
              <Badge className="ml-2" variant={change.startsWith('+') ? "default" : "destructive"}>
                {change}
              </Badge>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-slate-900">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header mode={healthMode} onModeChange={setHealthMode} />
        <main className="flex-1 overflow-auto p-6">
          <div className="mx-auto max-w-6xl animate-fade-in">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
              <div>
                <h1 className="text-2xl font-bold text-health-dark dark:text-white">AI Health Insights</h1>
                <p className="text-muted-foreground">Get personalized insights and answers about your health data</p>
              </div>
              
              {aiSettings ? (
                <div className="flex items-center text-sm bg-muted px-3 py-2 rounded-md shadow-sm">
                  <Sparkles className="h-4 w-4 mr-2 text-health-primary" />
                  <span className="mr-1">Powered by</span>
                  <span className="font-semibold text-health-primary">{aiSettings.ai_model}</span>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-7 w-7 ml-1" 
                    onClick={() => window.location.href = '/settings?tab=ai'}
                  >
                    <Settings className="h-3.5 w-3.5" />
                    <span className="sr-only">Change AI settings</span>
                  </Button>
                </div>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.location.href = '/settings?tab=ai'}
                  className="text-xs"
                >
                  <Settings className="h-3.5 w-3.5 mr-1" />
                  Configure AI
                </Button>
              )}
            </div>
            
            <div className="grid gap-6 md:grid-cols-3 mb-6">
              {renderInsightCard(
                <LineChart className="h-5 w-5 mr-2 text-health-primary" />, 
                "Trend Analysis", 
                "AI-powered analysis of your health over time",
                "12% ↑",
                "+2.5% this week"
              )}
              
              {renderInsightCard(
                <BarChart3 className="h-5 w-5 mr-2 text-health-primary" />, 
                "Workout Balance", 
                "Balance between different workout types",
                "8/10",
                "+1 from last month"
              )}
              
              {renderInsightCard(
                <PieChart className="h-5 w-5 mr-2 text-health-primary" />, 
                "Sleep Quality", 
                "Sleep quality based on your sleep logs",
                "7.2/10",
                "+0.8 points"
              )}
            </div>
            
            <Tabs defaultValue="chat" value={selectedTab} onValueChange={setSelectedTab} className="w-full">
              <TabsList className="grid grid-cols-2 md:grid-cols-4 mb-6 max-w-lg mx-auto">
                <TabsTrigger value="chat" className="flex items-center gap-1">
                  <Brain className="h-4 w-4" />
                  <span className="hidden md:inline">Chat with AI</span>
                  <span className="inline md:hidden">Chat</span>
                </TabsTrigger>
                <TabsTrigger value="questions" className="flex items-center gap-1">
                  <BookHeart className="h-4 w-4" />
                  <span className="hidden md:inline">Suggested Questions</span>
                  <span className="inline md:hidden">Questions</span>
                </TabsTrigger>
                <TabsTrigger value="insights" className="flex items-center gap-1">
                  <Zap className="h-4 w-4" />
                  <span className="hidden md:inline">Health Insights</span>
                  <span className="inline md:hidden">Insights</span>
                </TabsTrigger>
                <TabsTrigger value="history" className="flex items-center gap-1">
                  <LineChart className="h-4 w-4" />
                  <span className="hidden md:inline">Conversation History</span>
                  <span className="inline md:hidden">History</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="chat">
                <Card className="shadow-lg border-none bg-white dark:bg-slate-800">
                  <CardHeader className="bg-gradient-to-r from-health-primary/10 to-health-secondary/5 border-b">
                    <CardTitle className="flex items-center">
                      <Bot className="h-5 w-5 mr-2 text-health-primary" />
                      Chat with Your Health Data
                    </CardTitle>
                    <CardDescription>
                      Ask questions about your health data, workouts, or get personalized advice 
                      {aiSettings && ` using ${aiSettings.ai_model}`}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-0">
                    <ScrollArea className="h-[400px] p-4">
                      <div className="space-y-4 pb-2">
                        {messages.map((msg, index) => (
                          <div 
                            key={index}
                            className={`flex ${msg.role === 'assistant' ? 'justify-start' : 'justify-end'}`}
                          >
                            <div className={`flex gap-3 ${msg.role === 'assistant' ? 'flex-row' : 'flex-row-reverse'} max-w-[85%]`}>
                              <Avatar className={`${msg.role === 'assistant' ? 'bg-health-primary' : 'bg-gray-500'} h-9 w-9`}>
                                {msg.role === 'assistant' ? 
                                  <Bot className="h-5 w-5 text-white" /> : 
                                  <User className="h-5 w-5 text-white" />
                                }
                                <AvatarFallback>{msg.role === 'assistant' ? 'AI' : 'You'}</AvatarFallback>
                              </Avatar>
                              <div 
                                className={`rounded-xl px-4 py-3 shadow-sm ${
                                  msg.role === 'assistant' 
                                    ? 'bg-white dark:bg-slate-700 text-foreground dark:text-slate-100 border border-slate-200 dark:border-slate-600' 
                                    : 'bg-health-primary text-white'
                                }`}
                              >
                                {msg.content}
                              </div>
                            </div>
                          </div>
                        ))}
                        {isLoading && (
                          <div className="flex justify-start">
                            <div className="flex gap-3 max-w-[85%]">
                              <Avatar className="bg-health-primary h-9 w-9">
                                <Bot className="h-5 w-5 text-white" />
                                <AvatarFallback>AI</AvatarFallback>
                              </Avatar>
                              <div className="rounded-xl px-4 py-4 bg-white dark:bg-slate-700 shadow-sm border border-slate-200 dark:border-slate-600">
                                <div className="flex space-x-2 items-center h-6">
                                  <div className="h-2.5 w-2.5 rounded-full bg-health-primary/30 animate-bounce"></div>
                                  <div className="h-2.5 w-2.5 rounded-full bg-health-primary/40 animate-bounce" style={{animationDelay: "0.2s"}}></div>
                                  <div className="h-2.5 w-2.5 rounded-full bg-health-primary/50 animate-bounce" style={{animationDelay: "0.4s"}}></div>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                        <div ref={messagesEndRef} />
                      </div>
                    </ScrollArea>
                  </CardContent>
                  <CardFooter className="p-4 border-t bg-gradient-to-r from-health-primary/5 to-health-secondary/5">
                    <div className="flex w-full flex-col">
                      <div className="flex w-full items-center space-x-2">
                        <Input 
                          placeholder={user ? "Ask about your health data..." : "Sign in to use AI features"}
                          value={input}
                          onChange={(e) => setInput(e.target.value)}
                          onKeyDown={handleKeyPress}
                          className="flex-1 border-slate-300 dark:border-slate-600 py-5"
                          disabled={!user}
                        />
                        <Button 
                          onClick={() => handleSendMessage()}
                          disabled={!input.trim() || isLoading || !user}
                          className="bg-health-primary hover:bg-health-secondary"
                        >
                          <Send className="h-4 w-4" />
                          <span className="sr-only">Send</span>
                        </Button>
                      </div>
                      {!user && (
                        <p className="text-xs text-amber-500 mt-2 w-full text-center">
                          Please sign in to use the AI insights feature
                        </p>
                      )}
                      {user && (
                        <div className="flex gap-2 mt-3 flex-wrap">
                          <span className="text-xs text-muted-foreground">Try asking:</span>
                          {["How's my sleep quality?", "Exercise recommendations", "Nutrition tips"].map((q) => (
                            <Button 
                              key={q} 
                              variant="outline" 
                              size="sm" 
                              className="text-xs h-7 px-2"
                              onClick={() => handleSuggestedQuestion(q)}
                              disabled={isLoading}
                            >
                              {q}
                            </Button>
                          ))}
                        </div>
                      )}
                    </div>
                  </CardFooter>
                </Card>
              </TabsContent>

              <TabsContent value="questions">
                <div className="grid gap-6 md:grid-cols-2">
                  <Card className="shadow-md">
                    <CardHeader className="bg-blue-50 dark:bg-blue-900/20 border-b">
                      <CardTitle className="flex items-center">
                        <Moon className="h-5 w-5 mr-2 text-blue-500" />
                        Sleep Questions
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4">
                      <div className="space-y-2">
                        {suggestedQuestions.sleep.map((question) => (
                          <Button
                            key={question}
                            variant="ghost"
                            className="w-full justify-start text-left h-auto py-2 px-3 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                            onClick={() => handleSuggestedQuestion(question)}
                            disabled={isLoading || !user}
                          >
                            {question}
                          </Button>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="shadow-md">
                    <CardHeader className="bg-green-50 dark:bg-green-900/20 border-b">
                      <CardTitle className="flex items-center">
                        <Dumbbell className="h-5 w-5 mr-2 text-green-500" />
                        Workout Questions
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4">
                      <div className="space-y-2">
                        {suggestedQuestions.workouts.map((question) => (
                          <Button
                            key={question}
                            variant="ghost"
                            className="w-full justify-start text-left h-auto py-2 px-3 hover:bg-green-50 dark:hover:bg-green-900/20"
                            onClick={() => handleSuggestedQuestion(question)}
                            disabled={isLoading || !user}
                          >
                            {question}
                          </Button>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="shadow-md">
                    <CardHeader className="bg-purple-50 dark:bg-purple-900/20 border-b">
                      <CardTitle className="flex items-center">
                        <Brain className="h-5 w-5 mr-2 text-purple-500" />
                        Mood & Mental Wellbeing
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4">
                      <div className="space-y-2">
                        {suggestedQuestions.mood.map((question) => (
                          <Button
                            key={question}
                            variant="ghost"
                            className="w-full justify-start text-left h-auto py-2 px-3 hover:bg-purple-50 dark:hover:bg-purple-900/20"
                            onClick={() => handleSuggestedQuestion(question)}
                            disabled={isLoading || !user}
                          >
                            {question}
                          </Button>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="shadow-md">
                    <CardHeader className="bg-amber-50 dark:bg-amber-900/20 border-b">
                      <CardTitle className="flex items-center">
                        <Coffee className="h-5 w-5 mr-2 text-amber-500" />
                        Nutrition Questions
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4">
                      <div className="space-y-2">
                        {suggestedQuestions.nutrition.map((question) => (
                          <Button
                            key={question}
                            variant="ghost"
                            className="w-full justify-start text-left h-auto py-2 px-3 hover:bg-amber-50 dark:hover:bg-amber-900/20"
                            onClick={() => handleSuggestedQuestion(question)}
                            disabled={isLoading || !user}
                          >
                            {question}
                          </Button>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="insights">
                <div className="text-center py-12">
                  <div className="mx-auto w-16 h-16 mb-4 rounded-full bg-health-primary/10 flex items-center justify-center">
                    <Zap className="h-8 w-8 text-health-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Health Insights Coming Soon</h3>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    We're working on generating personalized health insights based on your data. 
                    Check back soon for detailed analysis and recommendations.
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="history">
                <div className="text-center py-12">
                  <div className="mx-auto w-16 h-16 mb-4 rounded-full bg-health-primary/10 flex items-center justify-center">
                    <LineChart className="h-8 w-8 text-health-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Conversation History Coming Soon</h3>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    We're building a feature to save and reference your previous AI conversations.
                    This will help you track insights and advice over time.
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

export default AIInsights;
