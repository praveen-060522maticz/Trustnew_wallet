//  import packages
import express from "express";
import * as userCtrl from "../../controller/usercontroller";

import { verifyToken } from '../../commenfunction/commenfunction';



const router = express();
// User API

router.route("/getcmsdata").post(userCtrl.GetCMSdata);
router.route("/dappcategory").get(userCtrl.dappcategory);
router.route("/dapps").get(userCtrl.dapps)
router.route("/userdata").post(userCtrl.userdata)
router.route("/notification").post(userCtrl.Notification);
router.route("/receivenotification").post(userCtrl.ReceiveNotification);




export default router;
