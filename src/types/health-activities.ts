export type ActivityType = 
  | 'workout'
  | 'meditation'
  | 'medication'
  | 'doctor_appointment'
  | 'therapy_session'
  | 'water_intake'
  | 'sleep'
  | 'custom';

export interface HealthActivity {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  activity_type: ActivityType;
  start_time: string; // ISO date string
  end_time?: string; // ISO date string
  all_day: boolean;
  recurring: boolean;
  recurrence_pattern?: string; // JSON string with recurrence details
  reminder_time?: string; // ISO date string
  reminder_sent: boolean;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateHealthActivityParams {
  title: string;
  description?: string;
  activity_type: ActivityType;
  start_time: string; // ISO date string
  end_time?: string; // ISO date string
  all_day?: boolean;
  recurring?: boolean;
  recurrence_pattern?: string; // JSON string with recurrence details
  reminder_time?: string; // ISO date string
  notes?: string;
}

export interface UpdateHealthActivityParams extends Partial<CreateHealthActivityParams> {
  id: string;
}

export interface HealthActivityFilters {
  from_date?: string;
  to_date?: string;
  activity_type?: ActivityType;
}

export interface RecurrencePattern {
  frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
  interval: number; // Every X days/weeks/months/years
  days_of_week?: number[]; // 0-6 (Sunday to Saturday)
  day_of_month?: number; // 1-31
  month_of_year?: number; // 1-12
  end_date?: string; // ISO date string
  occurrences?: number; // Number of occurrences
} 