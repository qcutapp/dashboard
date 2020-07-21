import React, { useState, useEffect, useContext } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import dayjs from "dayjs";

import { AppStore } from "store";

export default function History() {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState({
    name: "",
    orderID: "",
    from: "",
    to: "",
  });

  const {
    appState: { user },
  } = useContext(AppStore);

  // Get orders
  useEffect(() => {
    // Include filters in search
    const params = new URLSearchParams(filter);

    axios
      .get(
        `${process.env.REACT_APP_API_ENDPOINT}/venue/orders/history?${params}`,
        {
          headers: { authorization: `Bearer ${user.access_token}` },
        }
      )
      .then((response) => {
        setOrders(response.data);
      })
      .catch((err) => {
        toast.error(err.response?.data?.message || err.message);
      });
  }, [filter, user]);

  return (
    <div className="container container-history">
      <div className="row mt-3 mb-5">
        <div className="col-sm">
          <h1 className="text-light text-weight-bold">Order History</h1>
        </div>
        <div className="col-sm text-right">
          <div className="d-flex w-100 align-items-center">
            <input
              className="form-control rounded-pill"
              type="date"
              value={filter.from}
              onChange={(e) => {
                const value = e.target.value;
                setFilter((f) => {
                  return {
                    ...f,
                    from: value,
                  };
                });
              }}
            />
            <div className="text-light mx-4">TO</div>
            <input
              className="form-control rounded-pill"
              type="date"
              value={filter.to}
              onChange={(e) => {
                const value = e.target.value;
                setFilter((f) => {
                  return {
                    ...f,
                    to: value,
                  };
                });
              }}
            />
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-sm">
          <div className="btn-group btn-group-sm w-100" role="group">
            {[0, 1, 2, 3, 4, 5, 6].map((i) => {
              const from = dayjs().subtract(i, "day").format("YYYY-MM-DD");
              const to = dayjs()
                .subtract(i - 1, "day")
                .format("YYYY-MM-DD");

              return (
                <button
                  key={i}
                  className={`btn btn-primary btn-primary-hover-none btn-primary-focus-none btn-primary-active-none text-height-lg ${
                    from === filter.from && "font-weight-bold text-lg"
                  }`}
                  onClick={() =>
                    setFilter((s) => {
                      return { ...s, from, to };
                    })
                  }
                >
                  {i !== 0
                    ? i !== 1
                      ? dayjs(from).format("DD-MM-YYYY")
                      : "Yesterday"
                    : "Today"}
                </button>
              );
            })}
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-sm">
          <div className="table-responsive">
            <table className="table table-borderless rounded-pill cards ">
              <thead>
                <tr>
                  <td colSpan="3" style={{ verticalAlign: "bottom" }}>
                    {orders.length} Items Showing
                    <button
                      className="btn btn-link"
                      onClick={() =>
                        setFilter({ orderID: "", name: "", from: "", to: "" })
                      }
                      style={{
                        visibility: Object.keys(filter).some((i) => filter[i])
                          ? "visible"
                          : "hidden",
                      }}
                    >
                      Reset filters
                    </button>
                  </td>
                  <td colSpan="3">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Search Orders"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          const value = e.target.value;
                          setFilter((s) => {
                            return {
                              ...s,
                              name: !parseInt(value) ? value : "",
                              orderID: parseInt(value) ? value : "",
                            };
                          });
                        }
                      }}
                    />
                  </td>
                </tr>
                <tr>
                  <td className="text-muted">Order #</td>
                  <td className="text-muted">Name</td>
                  <td className="text-muted">Time Ordered</td>
                  <td className="text-muted">Time Completed</td>
                  <td className="text-muted">Table #</td>
                  <td className="text-muted">Price</td>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr
                    key={order._id}
                    className="shadow rounded-pill"
                    style={{ height: "85px" }}
                  >
                    <td>
                      <h2 className="m-0">{order.orderID}</h2>
                    </td>
                    <td>{order.customer.name}</td>
                    <td>{dayjs(order.createdAt).format("DD/MM/YY h:mm A")}</td>
                    <td>{dayjs(order.updatedAt).format("DD/MM/YY h:mm A")}</td>
                    <td>{10}</td>
                    <td>£{parseFloat(order.totalPrice).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
