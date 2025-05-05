import { supabase } from '../lib/supabase';

export interface AISettings {
  ai_model: string;
  ai_api_key: string;
  temperature: number;
  max_tokens: number;
  model_provider: string;
  last_updated: string;
}

export interface AIResponse {
  success: boolean;
  content?: string;
  error?: string;
}

// Main AI service class to handle AI-related operations
export class AIService {
  // Get the user's AI settings from their profile
  async getUserAISettings(userId: string): Promise<AISettings | null> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('preferences')
        .eq('user_id', userId)
        .single();
        
      if (error) {
        console.error('Error fetching AI settings:', error);
        return null;
      }
      
      if (data?.preferences?.ai_settings) {
        return data.preferences.ai_settings as AISettings;
      }
      
      return null;
    } catch (err) {
      console.error('Failed to get AI settings:', err);
      return null;
    }
  }
  
  // Process a prompt with the AI model
  async processPrompt(userId: string, prompt: string): Promise<AIResponse> {
    try {
      // Get user's AI settings
      const settings = await this.getUserAISettings(userId);
      
      if (!settings) {
        return {
          success: false,
          error: 'AI settings not found. Please configure your AI settings in the Settings page.'
        };
      }
      
      // For development and testing, return mock responses
      // In production, this would connect to the actual AI API based on user's settings
      return await this.getMockResponse(prompt, settings);
      
      // Uncomment to use actual AI provider API when ready:
      // return await this.callAIProvider(prompt, settings);
    } catch (err) {
      console.error('Error processing AI prompt:', err);
      return {
        success: false,
        error: err instanceof Error ? err.message : 'Unknown error processing your request'
      };
    }
  }
  
  // Mock AI response for development and testing
  private async getMockResponse(prompt: string, settings: AISettings): Promise<AIResponse> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Extract keywords from prompt for context-aware responses
    const promptLower = prompt.toLowerCase();
    
    // Custom responses based on keywords in the prompt
    if (promptLower.includes('sleep') || promptLower.includes('rest')) {
      return {
        success: true,
        content: `Based on your sleep data, you've been averaging 6.8 hours of sleep per night. For optimal health, aim for 7-8 hours. Your deep sleep percentage has improved since last month, which is excellent progress!`
      };
    } else if (promptLower.includes('workout') || promptLower.includes('exercise') || promptLower.includes('training')) {
      return {
        success: true,
        content: `I've analyzed your workout patterns using ${settings.ai_model}. You've completed 8 workouts in the last 14 days, with strength training making up only 25%. For balanced fitness, try adding 2 more strength sessions per week.`
      };
    } else if (promptLower.includes('mood') || promptLower.includes('mental') || promptLower.includes('stress')) {
      return {
        success: true,
        content: `Your mood tracking shows fluctuations that correlate with your sleep quality. On days with 7+ hours of sleep, your mood scores averaged 8.2/10, compared to 6.5/10 on days with less sleep. Consider prioritizing consistent sleep for mental wellbeing.`
      };
    } else if (promptLower.includes('nutrition') || promptLower.includes('diet') || promptLower.includes('food') || promptLower.includes('eat')) {
      return {
        success: true,
        content: `Based on your nutrition logs, you're averaging 1800 calories daily with a good protein intake. However, your fiber intake is below recommended levels. Consider adding more whole grains, fruits, and vegetables to your diet.`
      };
    } else if (promptLower.includes('progress') || promptLower.includes('improve') || promptLower.includes('goal')) {
      return {
        success: true,
        content: `You're making excellent progress toward your fitness goals! Your consistency has improved by 35% compared to last month. Your current trajectory suggests you'll reach your target weight within the next 6-8 weeks if you maintain this pace.`
      };
    } else {
      // Default response for other queries
      return {
        success: true,
        content: `I've analyzed your health data using ${settings.ai_model} (set to temperature ${settings.temperature}). Your overall wellness score has improved by 12% in the last month. Your strongest area is consistency in logging activities, while nutrition tracking could use more attention.`
      };
    }
  }
  
  // Call the actual AI provider API (for future implementation)
  private async callAIProvider(prompt: string, settings: AISettings): Promise<AIResponse> {
    try {
      // This is just a placeholder for the actual implementation
      // In a real app, you would switch between different AI providers based on settings.model_provider
      
      switch (settings.model_provider) {
        case 'openai':
          // Call OpenAI API
          break;
        case 'anthropic':
          // Call Anthropic API
          break;
        case 'google':
          // Call Google API
          break;
        case 'mistral':
          // Call Mistral API
          break;
        default:
          // Default provider
          break;
      }
      
      // Placeholder return
      return {
        success: true,
        content: 'This would be a real AI response in production'
      };
    } catch (err) {
      console.error('Error calling AI provider:', err);
      return {
        success: false,
        error: err instanceof Error ? err.message : 'Failed to get response from AI provider'
      };
    }
  }
}

// Create and export a singleton instance
export const aiService = new AIService(); 