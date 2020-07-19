import React, { useEffect, useContext, useState } from "react";
import {
  Switch,
  Route,
  useRouteMatch,
  NavLink,
  Redirect,
} from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHistory,
  faList,
  faChartBar,
} from "@fortawesome/free-solid-svg-icons";

import { AppStore } from "store";

import Menu from "pages/dashboard/menu";
import History from "pages/dashboard/history";

export default function Dashboard() {
  const match = useRouteMatch();
  const [isFetching, setIsFetching] = useState(true);

  const {
    appState: { user, venue },
    appDispatch,
  } = useContext(AppStore);

  // Venue details
  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_ENDPOINT}/venue/me`, {
        headers: { authorization: `Bearer ${user.access_token}` },
      })
      .then((response) => {
        // Update appState
        appDispatch({ type: "VENUE:SET", payload: response.data });
      })
      .catch((err) => {
        toast.error(err.response?.data?.message || err.message);
      })
      .finally(() => {
        setIsFetching(false);
      });
  }, [user, appDispatch]);

  // Loading
  if (isFetching) return null;

  // No Venues
  if (Object.keys(venue).length === 0) {
    return (
      <div>
        Your account does not belong to any venue. Please contact the
        administrator.
      </div>
    );
  }

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-3 col-lg-2 bg-light">
          <div className="d-flex flex-column justify-content-center align-items-center mt-3 mb-5">
            <img className="venue-brand" src={venue.image} alt="Venue Logo" />
            <div className="ml-2">
              <h5 className="m-0">{venue.name}</h5>
              <p className="m-0">{user.name}</p>
            </div>
          </div>
          <ul className="nav flex-column">
            <NavLink className="nav-link" to={`${match.url}/history`}>
              <FontAwesomeIcon icon={faHistory} />
              Order History
            </NavLink>
            <NavLink className="nav-link" to={`${match.url}/menu`}>
              <FontAwesomeIcon icon={faList} />
              Menu
            </NavLink>
            <NavLink className="nav-link" to={`${match.url}/stripe`}>
              <FontAwesomeIcon icon={faChartBar} />
              Stripe
            </NavLink>
          </ul>
          <div
            className="btn btn-link"
            onClick={() => appDispatch({ type: "USER:UNSET" })}
          >
            Logout
          </div>
        </div>
        <div className="col-md-9 col-lg-10">
          <Switch>
            {/* History */}
            <Route path={`${match.path}/history`} component={History}></Route>
            {/* Menu */}
            <Route path={`${match.path}/menu`} component={Menu}></Route>
            {/* Default */}
            <Route
              path="/"
              render={() => <Redirect to={`${match.path}/history`} />}
            />
          </Switch>
        </div>
      </div>
    </div>
  );
}
