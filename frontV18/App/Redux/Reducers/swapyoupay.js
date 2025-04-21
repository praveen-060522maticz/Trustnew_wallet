import { YOUPAYDATA } from "../Actions/types";

const initialState = {
  youpay: [],
};

const Youpay = (state = initialState, action) => {
  switch (action?.type) {
    case YOUPAYDATA:
      return {
        ...state,
        youpay: action.data,
      };

    default:
      return state;
  }
};


export default Youpay;