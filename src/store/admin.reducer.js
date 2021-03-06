const initialState = {
  token: "",
  uuidLookup: "",
};

const admin = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case "LOGIN":
      return {
        ...state,
        token: payload,
      };
    case "LOGOUT":
      return {};
    case "RECONNECT":
      return {
        ...state,
        token: payload,
      };
    case "UUIDLOOKUP":
      return {
        ...state,
        uuidLookup: payload,
      };
    default:
      return state;
  }
};

export default admin;
