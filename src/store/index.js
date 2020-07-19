import React, { createContext, useReducer } from "react";
import { toast } from "react-toastify";
import Cookies from "js-cookie";

// Define context
const AppStore = createContext();

const reducer = (state, action) => {
  const newState = { ...state };

  // Actions
  switch (action.type) {
    case "USER:SET":
      // Set cookie
      Cookies.set("token", action.payload.access_token);

      newState.user = action.payload;

      // Welcome
      toast.success(`Welcome ${newState.user.name}!`);
      break;

    case "USER:UNSET":
      // Remove cookie
      Cookies.remove("token");

      newState.user = {};

      // Bye
      toast.success(`You've been logged out!`);
      break;
    case "VENUE:SET":
      newState.venue = action.payload;
      break;
    default:
      break;
  }

  return newState;
};

// Define provider
const AppProvider = ({ children }) => {
  const [appState, appDispatch] = useReducer(reducer, { user: {}, venue: {} });

  return (
    <AppStore.Provider value={{ appState, appDispatch }}>
      {children}
    </AppStore.Provider>
  );
};

export { AppStore, AppProvider };
