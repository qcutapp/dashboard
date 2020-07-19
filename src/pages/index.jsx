import React, { useEffect, useContext, useState } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import axios from "axios";
import Cookies from "js-cookie";

import { AppStore } from "store";

import Login from "pages/login";
import Dashboard from "pages/dashboard";
import ProtectedRoute from "components/ProtectedRoute";

// Styles
import "pages/index.scss";

// Application entry
export default function Index() {
  const [isFetching, setIsFetching] = useState(true);

  const { appState, appDispatch } = useContext(AppStore);

  console.log("appState:", appState);

  // Authenticate
  useEffect(() => {
    const token = Cookies.get("token");

    if (!token) {
      setIsFetching(false);
      return;
    }

    axios
      .get(`${process.env.REACT_APP_API_ENDPOINT}/user/me`, {
        headers: { authorization: `Bearer ${token}` },
      })
      .then((response) => {
        // Update appState
        appDispatch({ type: "USER:SET", payload: response.data });
      })
      .catch(console.log)
      .finally(() => {
        // Done
        setIsFetching(false);
      });
  }, [appDispatch]);

  // Loading
  if (isFetching) return null;

  return (
    <>
      <Router>
        <Switch>
          {/* Login */}
          <ProtectedRoute
            path="/login"
            requiredRole="public"
            redirect="/dashboard"
            component={Login}
          />
          {/* Dashboard */}
          <ProtectedRoute
            path="/dashboard"
            requiredRole="user"
            redirect="/login"
            component={Dashboard}
          />
          {/* Default */}
          <Route path="/" render={() => <Redirect to="/login" />} />
        </Switch>
      </Router>
      <ToastContainer
        position="top-center"
        hideProgressBar={true}
        newestOnTop={true}
        autoClose={2000}
      />
    </>
  );
}
