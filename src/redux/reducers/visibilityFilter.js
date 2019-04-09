const initialState = {
  text: "",
  startDate: null,
  endDate: null,
  incidentTypes: {
    fatalCrash: true,
    pedestrianCrash: true,
    cyclistCrash: true,
    truckCrash: true,
    busCrash: true,
    transitCrash: true,
    transSuicide: true,
    pipeline: true,
    hazmat: true,
    rail: true,
    road: true,
    unsafe: true,
    drone: true,
  },
};

const visibilityFilter = (state = initialState, action) => {
  switch (action.type) {
    case "SET_FILTER": {
      return action.filter;
    }
    default:
      return state;
  }
};

export default visibilityFilter;
