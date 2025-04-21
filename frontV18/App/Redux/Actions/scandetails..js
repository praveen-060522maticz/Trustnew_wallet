import { Addscandetails } from "./types";

//for save
export const AddScandetails = (item) => ({
  type: Addscandetails,
  data: item,
});