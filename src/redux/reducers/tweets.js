const initialState = {
  allIds: [],
  byIds: {},
};

const tweets = (state = initialState, action) => {
  switch (action.type) {
    case "UPDATE_TWEETS":
      const allIds = action.tweets;
      const byIds = Object.keys(allIds);
      return { ...state, allIds, byIds };
    default:
      return state;
  }
};

export default tweets;
