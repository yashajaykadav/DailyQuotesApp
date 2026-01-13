import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// 1. Configure how notifications appear when the app is open
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export async function scheduleDailyQuote() {
  // 2. Request Permissions
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    alert('Failed to get push token for push notification!');
    return false;
  }

  // 3. Cancel existing ones (so we don't have duplicates)
  await Notifications.cancelAllScheduledNotificationsAsync();

  // 4. Schedule the "Real" Notification
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "☀️ Quote of the Day",
      body: "Tap to see today's inspiration!",
      sound: true,
    },
    trigger: {
      hour: 9, // 9:00 AM
      minute: 0,
      repeats: true,
    },
  });

  return true;
}