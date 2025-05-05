export interface Profile {
  id: string;
  user_id: string;
  full_name?: string;
  avatar_url?: string;
  age?: number;
  blood_group?: string;
  height?: number;
  weight?: number;
  gender?: string;
  preferences?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface Workout {
  id: string;
  user_id: string;
  name: string;
  workout_type: string;
  duration?: number;
  calories_burned?: number;
  recorded_at: string;
  created_at: string;
  updated_at: string;
}

export interface WorkoutPlan {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  duration?: number;
  level: string;
  workout_type: string;
  exercises?: string; // JSON string containing exercise details
  is_public: boolean;
  created_at: string;
  updated_at: string;
}

export interface HealthMetric {
  id: string;
  user_id: string;
  metric_type: string;
  value: number;
  date: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export type MetricType = 
  | 'weight'
  | 'height'
  | 'blood_pressure'
  | 'heart_rate'
  | 'blood_sugar'
  | 'steps'
  | 'sleep'
  | 'water_intake'
  | 'calories';

export interface DatabaseExport {
  profile: Profile;
  workouts: Workout[];
  healthMetrics: HealthMetric[];
  exportDate: string;
}

export interface DatabaseResult<T> {
  success: boolean;
  data?: T;
  error?: any;
  message?: string;
  warning?: boolean;
} 