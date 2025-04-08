import { Addscandetails } from "../Actions/types";

const initialState = {
  Scandetails: [],
};

const ScanDetails = (state = initialState, action) => {
  switch (action.type) {
    case Addscandetails:
      return {
        ...state,
        ...{
            Scandetails: action.data
        },
      };

    default:
      return state;
  }
};

export default ScanDetails;