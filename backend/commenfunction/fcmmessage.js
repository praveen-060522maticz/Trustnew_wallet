import FCM from "fcm-node"
/** put the generated private key path here. */
var serverKey = require('../config/firebasekeyfile.json')
var fcm = new FCM(serverKey);
 
 /* Method for Send notification for the Particular user using FCM
  **/
  export const fcmNotification = (value) => {
 
    try {
        var type = value.datas.type
        var data = value.datas.data
        var to = value.datas.to

        const { title, body } = fcmMessage(type, data)

        /** this may vary according to the message type.
         * (single recipient, multicast, topic, et cetera).
         **/
        var message = {
            to: to,

            notification: {
                title: title,
                body: body
            },

            data: {
                title: title,
                body: body
            }
        };

        /** Send message to the user using fcm. */
        fcm.send(message, async function (err, response) {
            if (response) {
                // console.log("Successfully sent with response:", JSON.stringify(response,null,2));
                return response;
            }
            else {
                // console.log("Something has gone wrong!", err);
                return false;

            }

        });
    }
    catch (error) {
        console.log("fcm Notification err", error)
    }
};

/**
 * Receiver Status,
 */
export const fcmMessage = (type, data) => {
    try{
        if (type == 'receive') {
            return {
                title: "Received",
                body:
                    ` ${data.amount}${data.symbol} credited to your wallet`
                ,
            };
        }
    }catch(err){
        console.log("fcmMessage err",err);
    }

 
};