import { Database } from '@supabase/supabase-js'

export type Tables = {
  profiles: {
    Row: {
      id: string
      user_id: string
      full_name: string | null
      avatar_url: string | null
      email: string | null
      age: number | null
      blood_group: string | null
      height: number | null
      weight: number | null
      gender: string | null
      preferences: Record<string, any> | null
      streak_count: number
      last_streak_date: string | null
      created_at: string
      updated_at: string
    }
    Insert: {
      id?: string
      user_id: string
      full_name?: string | null
      avatar_url?: string | null
      email?: string | null
      age?: number | null
      blood_group?: string | null
      height?: number | null
      weight?: number | null
      gender?: string | null
      preferences?: Record<string, any> | null
      streak_count?: number
      last_streak_date?: string | null
      created_at?: string
      updated_at?: string
    }
    Update: {
      id?: string
      user_id?: string
      full_name?: string | null
      avatar_url?: string | null
      email?: string | null
      age?: number | null
      blood_group?: string | null
      height?: number | null
      weight?: number | null
      gender?: string | null
      preferences?: Record<string, any> | null
      streak_count?: number
      last_streak_date?: string | null
      created_at?: string
      updated_at?: string
    }
  }
  mood_entries: {
    Row: {
      id: string
      user_id: string
      mood_score: number
      mood_label: 'terrible' | 'bad' | 'poor' | 'neutral' | 'good' | 'great' | 'excellent' | null
      factors: string[] | null
      notes: string | null
      recorded_at: string
      created_at: string
    }
    Insert: {
      id?: string
      user_id: string
      mood_score: number
      mood_label?: 'terrible' | 'bad' | 'poor' | 'neutral' | 'good' | 'great' | 'excellent' | null
      factors?: string[] | null
      notes?: string | null
      recorded_at: string
      created_at?: string
    }
    Update: {
      id?: string
      user_id?: string
      mood_score?: number
      mood_label?: 'terrible' | 'bad' | 'poor' | 'neutral' | 'good' | 'great' | 'excellent' | null
      factors?: string[] | null
      notes?: string | null
      recorded_at?: string
      created_at?: string
    }
  }
  self_care_activities: {
    Row: {
      id: string
      user_id: string
      title: string
      activity_type: 'meditation' | 'sleep' | 'reflection' | 'exercise' | 'reading' | 'custom'
      description: string | null
      duration: number | null
      start_time: string
      end_time: string | null
      notes: string | null
      created_at: string
      updated_at: string
    }
    Insert: {
      id?: string
      user_id: string
      title: string
      activity_type: 'meditation' | 'sleep' | 'reflection' | 'exercise' | 'reading' | 'custom'
      description?: string | null
      duration?: number | null
      start_time: string
      end_time?: string | null
      notes?: string | null
      created_at?: string
      updated_at?: string
    }
    Update: {
      id?: string
      user_id?: string
      title?: string
      activity_type?: 'meditation' | 'sleep' | 'reflection' | 'exercise' | 'reading' | 'custom'
      description?: string | null
      duration?: number | null
      start_time?: string
      end_time?: string | null
      notes?: string | null
      created_at?: string
      updated_at?: string
    }
  }
  meditation_sessions: {
    Row: {
      id: string
      user_id: string
      name: string
      duration: number
      guided: boolean
      audio_url: string | null
      completed: boolean
      start_time: string | null
      end_time: string | null
      notes: string | null
      created_at: string
      updated_at: string
    }
    Insert: {
      id?: string
      user_id: string
      name: string
      duration: number
      guided?: boolean
      audio_url?: string | null
      completed?: boolean
      start_time?: string | null
      end_time?: string | null
      notes?: string | null
      created_at?: string
      updated_at?: string
    }
    Update: {
      id?: string
      user_id?: string
      name?: string
      duration?: number
      guided?: boolean
      audio_url?: string | null
      completed?: boolean
      start_time?: string | null
      end_time?: string | null
      notes?: string | null
      created_at?: string
      updated_at?: string
    }
  }
  journal_entries: {
    Row: {
      id: string
      user_id: string
      title: string
      content: string
      tags: string[] | null
      mood_id: string | null
      created_at: string
      updated_at: string
    }
    Insert: {
      id?: string
      user_id: string
      title: string
      content: string
      tags?: string[] | null
      mood_id?: string | null
      created_at?: string
      updated_at?: string
    }
    Update: {
      id?: string
      user_id?: string
      title?: string
      content?: string
      tags?: string[] | null
      mood_id?: string | null
      created_at?: string
      updated_at?: string
    }
  }
  exercise_sessions: {
    Row: {
      id: string
      user_id: string
      name: string
      exercise_type: string
      duration: number
      calories_burned: number | null
      intensity: 'low' | 'medium' | 'high' | null
      start_time: string
      end_time: string | null
      notes: string | null
      created_at: string
      updated_at: string
    }
    Insert: {
      id?: string
      user_id: string
      name: string
      exercise_type: string
      duration: number
      calories_burned?: number | null
      intensity?: 'low' | 'medium' | 'high' | null
      start_time: string
      end_time?: string | null
      notes?: string | null
      created_at?: string
      updated_at?: string
    }
    Update: {
      id?: string
      user_id?: string
      name?: string
      exercise_type?: string
      duration?: number
      calories_burned?: number | null
      intensity?: 'low' | 'medium' | 'high' | null
      start_time?: string
      end_time?: string | null
      notes?: string | null
      created_at?: string
      updated_at?: string
    }
  }
  sleep_logs: {
    Row: {
      id: string
      user_id: string
      start_time: string
      end_time: string
      duration: number
      quality: number | null
      sleep_interruptions: number
      dream_notes: string | null
      factors_affecting_sleep: string[] | null
      created_at: string
      updated_at: string
    }
    Insert: {
      id?: string
      user_id: string
      start_time: string
      end_time: string
      duration: number
      quality?: number | null
      sleep_interruptions?: number
      dream_notes?: string | null
      factors_affecting_sleep?: string[] | null
      created_at?: string
      updated_at?: string
    }
    Update: {
      id?: string
      user_id?: string
      start_time?: string
      end_time?: string
      duration?: number
      quality?: number | null
      sleep_interruptions?: number
      dream_notes?: string | null
      factors_affecting_sleep?: string[] | null
      created_at?: string
      updated_at?: string
    }
  }
  daily_tasks: {
    Row: {
      id: string
      user_id: string
      title: string
      description: string | null
      due_date: string | null
      is_completed: boolean
      priority: 'low' | 'medium' | 'high' | null
      created_at: string
      updated_at: string
    }
    Insert: {
      id?: string
      user_id: string
      title: string
      description?: string | null
      due_date?: string | null
      is_completed?: boolean
      priority?: 'low' | 'medium' | 'high' | null
      created_at?: string
      updated_at?: string
    }
    Update: {
      id?: string
      user_id?: string
      title?: string
      description?: string | null
      due_date?: string | null
      is_completed?: boolean
      priority?: 'low' | 'medium' | 'high' | null
      created_at?: string
      updated_at?: string
    }
  }
  wellness_trends: {
    Row: {
      id: string
      user_id: string
      date: string
      mood_average: number | null
      meditation_minutes: number
      exercise_minutes: number
      sleep_hours: number
      journal_entries_count: number
      self_care_minutes: number
      created_at: string
      updated_at: string
    }
    Insert: {
      id?: string
      user_id: string
      date: string
      mood_average?: number | null
      meditation_minutes?: number
      exercise_minutes?: number
      sleep_hours?: number
      journal_entries_count?: number
      self_care_minutes?: number
      created_at?: string
      updated_at?: string
    }
    Update: {
      id?: string
      user_id?: string
      date?: string
      mood_average?: number | null
      meditation_minutes?: number
      exercise_minutes?: number
      sleep_hours?: number
      journal_entries_count?: number
      self_care_minutes?: number
      created_at?: string
      updated_at?: string
    }
  }
}

export type Database = {
  public: {
    Tables: Tables
    Views: {}
    Functions: {}
    Enums: {}
  }
} 