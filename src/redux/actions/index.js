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
});
