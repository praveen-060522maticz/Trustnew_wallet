import { createStore, combineReducers, applyMiddleware } from "redux";
import seedDataReducer from "../Redux/Reducers/seeddatareducer";
import swapyoupay from "../Redux/Reducers/swapyoupay";
import swapyouget from "../Redux/Reducers/swapyouget";
import swapdata from "../Redux/Reducers/swapdatareducer";
import  wcreducer from "../Redux/Reducers/wcreducer";
import  dappreducers from "../Redux/Reducers/dappreducers";
import  defaultcurrencies from "../Redux/Reducers/defaultcurrencies";
import  scandetails from "../Redux/Reducers/scandetailsreducers";
import modalreducers from "./Reducers/modalreducers";
import walletconnectReducer from "./Reducers/walletconnectReducer";




const rootReducer = combineReducers({
  seedDataReducer: seedDataReducer, 
  swapyoupay:swapyoupay,
  swapyouget:swapyouget,
  swapdata:swapdata,
  dappreducers:dappreducers,
  defaultcurrencies:defaultcurrencies,
  scandetails:scandetails,
  wcreducer,
  modalreducers,
  walletconnectReducer
});

const configureStore = () => createStore(rootReducer);

export default configureStore;