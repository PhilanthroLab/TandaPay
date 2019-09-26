import { combineReducers } from "redux";
import authReducer from "./authReducer";
import claimsReducer from "./claimsReducer";
import groupReducer from "./groupReducer";
import web3Reducer from "./web3Reducers";
import errorReducer from "./errorReducer";
export default combineReducers({
  user: authReducer,
  claims: claimsReducer,
  group: groupReducer,
  ethereum: web3Reducer,
  error: errorReducer
});
