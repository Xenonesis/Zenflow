import { getUpcomingActivitiesForReminders, markReminderAsSent } from './health-activities';

/**
 * Check for notifications that need to be sent and display them
 * This should be called regularly, e.g., every minute
 */
export async function checkForNotifications(): Promise<void> {
  try {
    // Get activities with reminders due in the next 15 minutes
    const activities = await getUpcomingActivitiesForReminders();
    
    for (const activity of activities) {
      // Display notification
      showNotification({
        title: `Reminder: ${activity.title}`,
        body: activity.description || `Your scheduled ${activity.activity_type} activity is coming up.`,
        icon: getActivityTypeIcon(activity.activity_type),
        onClick: () => {
          // Navigate to the calendar page when clicked
          window.location.href = '/calendar';
        }
      });
      
      // Mark as sent in the database
      await markReminderAsSent(activity.id);
    }
  } catch (error) {
    console.error('Error checking for notifications:', error);
  }
}

/**
 * Display a browser notification
 */
interface NotificationOptions {
  title: string;
  body: string;
  icon?: string;
  onClick?: () => void;
}

export async function showNotification({ title, body, icon, onClick }: NotificationOptions): Promise<void> {
  // Check if the browser supports notifications
  if (!('Notification' in window)) {
    console.warn('This browser does not support notifications');
    return;
  }

  // Check if permission is already granted
  if (Notification.permission === 'granted') {
    createNotification();
  } 
  // Request permission if not already requested
  else if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      createNotification();
    }
  }

  function createNotification() {
    const notification = new Notification(title, {
      body,
      icon
    });

    if (onClick) {
      notification.onclick = onClick;
    }
  }
}

/**
 * Get the appropriate icon for an activity type
 */
function getActivityTypeIcon(activityType: string): string {
  switch (activityType) {
    case 'workout':
      return '/icons/workout.png';
    case 'meditation':
      return '/icons/meditation.png';
    case 'medication':
      return '/icons/medication.png';
    case 'doctor_appointment':
      return '/icons/doctor.png';
    case 'therapy_session':
      return '/icons/therapy.png';
    case 'water_intake':
      return '/icons/water.png';
    case 'sleep':
      return '/icons/sleep.png';
    default:
      return '/icons/activity.png';
  }
}

/**
 * Initialize the notification system
 * This should be called when the app starts
 */
export function initNotifications(checkInterval = 60000): void {
  // Request notification permission early
  if ('Notification' in window && Notification.permission !== 'denied') {
    Notification.requestPermission();
  }
  
  // Check for notifications immediately
  checkForNotifications();
  
  // Then set up interval to check regularly
  setInterval(checkForNotifications, checkInterval);
} 