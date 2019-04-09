const initialState = {
  tweetIdList: [],
  tweetDict: {},
};

const tweetReducer = (state = initialState, action) => {
  switch (action.type) {
    case "UPDATE_TWEETS":
      const tweetDict = action.tweets;
      const tweetIdList = Object.keys(tweetDict);
      return { ...state, tweetIdList, tweetDict };
    default:
      return state;
  }
};

export default tweetReducer;
