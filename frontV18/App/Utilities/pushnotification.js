// import PushNotificationIOS from "@react-native-community/push-notification-ios";
// import PushNotification from "react-native-push-notification";
import notifee from '@notifee/react-native';


export const localnotification = async (params) => {



  // PushNotification.createChannel(
  //   {
  //     channelId: "specialid", // (required)
  //     channelName: "Special messasge", // (required)
  //     channelDescription: "Notification for special message", // (optional) default: undefined.
  //     importance: 4, // (optional) default: 4. Int value of the Android notification importance
  //     vibrate: true, // (optional) default: true. Creates the default vibration patten if true.
  //   },
  //   (created) => console.log(`createChannel returned '${created}'`) // (optional) callback returns whether the channel was created, false means it already existed.
  // );

  // PushNotification.localNotification({
  //   importance: 'high',
  //   channelId: 'specialid', //his must be same with channelid in createchannel
  //   title: params.title,
  //   message: params.message
  // })


  // Request permissions (required for iOS)
  await notifee.requestPermission()

  // Create a channel (required for Android)
  const channelId = await notifee.createChannel({
    id: 'specialid',
    name: 'special Channel',
  });

  // Display a notification
  await notifee.displayNotification({
    title: params.title,
    body: params.message,
    android: {
      channelId,
      // smallIcon: 'name-of-a-small-icon', // optional, defaults to 'ic_launcher'.
      // pressAction is needed if you want the notification to open the app when pressed
      pressAction: {
        id: 'default',
      },
    },
  });

}