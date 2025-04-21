// import PushNotificationIOS from "@react-native-community/push-notification-ios";
import PushNotification from "react-native-push-notification";


export const localnotification = (params) => {

  

    PushNotification.createChannel(
      {
        channelId: "specialid", // (required)
        channelName: "Special messasge", // (required)
        channelDescription: "Notification for special message", // (optional) default: undefined.
        importance: 4, // (optional) default: 4. Int value of the Android notification importance
        vibrate: true, // (optional) default: true. Creates the default vibration patten if true.
      },
      (created) => console.log(`createChannel returned '${created}'`) // (optional) callback returns whether the channel was created, false means it already existed.
    );
  
    PushNotification.localNotification({
      importance: 'high',
      channelId: 'specialid', //his must be same with channelid in createchannel
      title: params.title,
      message: params.message
    })
  
  }