import { YOUGETDATA } from "../Actions/types";

const initialState = {
  youget: [],
};

const Youget = (state = initialState, action) => {
  switch (action.type) {
    case YOUGETDATA:
      return {
        ...state,
        youget: action.data,
      };

    default:
      return state;
  }
};

export default Youget;