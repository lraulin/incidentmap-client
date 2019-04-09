import { combineReducers } from "redux";
import filterReducer from "./filterReducer";
import tweetReducer from "./tweetReducer";

export default combineReducers({
  tweetReducer,
  filterReducer,
});
