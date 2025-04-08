import { SWAPData } from "../Actions/types";

const initialState = {
  swapdatas: {},
};

const SWAPDATA = (state = initialState, action) => {
  switch (action.type) {
    case SWAPData:
      return {
        ...state,
        swapdatas: action.data,
      };

    default:
      return state;
  }
};

export default SWAPDATA;