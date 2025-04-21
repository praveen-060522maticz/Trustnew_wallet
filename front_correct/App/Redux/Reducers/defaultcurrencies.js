import { Currencies, SelectCurrency } from "../Actions/types";

const initialState = {
  Currencies: [],
  selectedCurrency: {}
};

const defaultcurrencies = (state = initialState, action) => {
  switch (action.type) {
    case Currencies:
      return {
        ...state,
        ...{
          Currencies: action.data
        },
      };

    case SelectCurrency:
      return {
        ...state,
        ...{
          selectedCurrency: action.data
        },
      };

    default:
      return state;
  }
};

export default defaultcurrencies;