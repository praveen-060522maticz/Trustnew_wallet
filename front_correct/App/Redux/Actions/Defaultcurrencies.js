import { Currencies, SelectCurrency } from "./types";

//for save
export const defaultCurrencies = (item) => ({
  type: Currencies,
  data: item,
});

export const selectCurrencyForTransaction = (item) => ({
  type: SelectCurrency,
  data: item,
});
