import { combineReducers } from "redux";
import visibilityFilter from "./visibilityFilter";
import tweets from "./tweets";

export default combineReducers({ tweets, visibilityFilter });
