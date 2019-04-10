import { initialState } from "../reducers/filterReducer";

export const actionTypes = {
  UPDATE_TWEETS: "UPDATE_TWEETS",
  SET_FILTER: "SET_FILTER",
  RESET_FILTER: "RESET_FILTER",
};

export const updateTweets = ({ tweets }) => ({
  type: "UPDATE_TWEETS",
  tweets,
});

export const setFilter = filter => ({
  type: "SET_FILTER",
  filter,
});

export const resetFilter = () => ({
  type: "RESET_FILTER",
  filter: initialState,
});
