import { YOUPAYDATA } from "./types";

//for save
export const YoupayAction = (item) => ({
  type: YOUPAYDATA,
  data: item,
});