import React, { useState, useContext } from "react";
import { toast } from "react-toastify";
import axios from "axios";

import { AppStore } from "store";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { appDispatch } = useContext(AppStore);

  // Submit
  const handleSubmit = () => {
    axios
      .post(`${process.env.REACT_APP_API_ENDPOINT}/user/login`, {
        email,
        password,
      })
      .then((response) => {
        appDispatch({ type: "USER:SET", payload: response.data });
      })
      .catch((err) => {
        toast.error(err.response?.data?.message || err.message);
      });
  };

  return (
    <div className="login min-vh-100 d-flex justify-content-center align-items-center">
      <div className="card rounded-pill shadow">
        <div className="card-body px-5 pt-3">
          <div className="login-brand text-center">
            <img
              className="img-fluid mx-auto rounded-circle mb-4"
              src={process.env.PUBLIC_URL + "/logo.png"}
              style={{ maxWidth: "15%", minWidth: "64px" }}
              alt="QCut Logo"
            />
            <h4 className="card-title font-weight-bold">Venue Sign-In</h4>
          </div>
          <form className="mt-5">
            <div className="form-group mb-3">
              <input
                type="email"
                className="form-control"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="form-group mt-3 mb-4">
              <input
                type="password"
                className="form-control"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="form-group mt-4">
              <button
                type="button"
                className="btn btn-primary btn-block"
                onClick={handleSubmit}
              >
                Login
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
