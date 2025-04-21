import { Dapp_URl } from "../Actions/types";

const initialState = {
  dappurl: [],
};

const dappreducers = (state = initialState, action) => {
  switch (action.type) {
    case Dapp_URl:
      return {
        ...state,
        dappurl: action.data,
      };

    default:
      return state;
  }
};

export default dappreducers;