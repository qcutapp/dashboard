import React, { useState, useContext } from "react";
import { toast } from "react-toastify";
import axios from "axios";

import { AppStore } from "store";

export default function Login() {
  const [email, setEmail] = useState("test@gmail.com");
  const [password, setPassword] = useState("pass");

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
    <div className="h-100 d-flex justify-content-center align-items-center">
      <div className="card">
        <div className="card-body p-5">
          <h5 className="card-title text-center">Venue Sign-In</h5>
          <form>
            <div className="form-group mb-3">
              <input
                type="email"
                className="form-control"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="form-group mb-3">
              <input
                type="password"
                className="form-control"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="form-group mb-3">
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
