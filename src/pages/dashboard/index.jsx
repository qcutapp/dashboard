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
      <div className="row vh-100">
        <div className="col-sm col-md-3 col-lg-2 d-flex flex-column h-100">
          <div className="venue-brand d-flex justify-content-center align-items-center border-bottom my-3 pb-3">
            <div
              className="venue-logo"
              style={{ backgroundImage: `url(${venue.image})` }}
            ></div>
            <div className="ml-2">
              <h5 className="m-0">{venue.name}</h5>
              <small className="font-weight-light text-muted m-0">
                {user.name}
              </small>
            </div>
          </div>
          <ul className="nav flex-column flex-grow-1">
            <li className="nav-link p-0 my-2">
              <NavLink
                className="btn btn-block text-left rounded-pill"
                activeClassName="btn-primary"
                to={`${match.url}/history`}
              >
                <FontAwesomeIcon icon={faHistory} />
                Order History
              </NavLink>
            </li>
            <li className="nav-link p-0 my-2">
              <NavLink
                className="btn btn-block text-left rounded-pill"
                activeClassName="btn-primary"
                to={`${match.url}/menu`}
              >
                <FontAwesomeIcon icon={faList} />
                Menu
              </NavLink>
            </li>
            <li className="nav-link p-0 my-2">
              <a
                className="btn btn-block text-left rounded-pill"
                href="https://connect.stripe.com/login"
                target="new"
              >
                <FontAwesomeIcon icon={faChartBar} />
                Stripe
              </a>
            </li>
          </ul>
          <div
            className="btn btn-link"
            onClick={() => appDispatch({ type: "USER:UNSET" })}
          >
            Logout
          </div>
        </div>
        <div className="col-main col-sm col-md-9 col-lg-10 h-100 px-4">
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
