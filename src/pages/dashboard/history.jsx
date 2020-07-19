import React, { useState, useEffect, useContext } from "react";
import DateRangePicker from "react-bootstrap-daterangepicker";
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
    <div className="container">
      <div className="row">
        <div className="col-sm">
          <h1>Order History</h1>
        </div>
        <div className="col-sm">
          <DateRangePicker
            onApply={(_, picker) =>
              setFilter((s) => {
                return {
                  ...s,
                  from: dayjs(picker.startDate).format("YYYY-MM-DD"),
                  to: dayjs(picker.endDate).add(1, "day").format("YYYY-MM-DD"),
                };
              })
            }
          >
            <div className="btn btn-link float-right">Date Range</div>
          </DateRangePicker>
        </div>
      </div>
      <div className="filters">
        <div class="btn-group" role="group">
          {[1, 2, 3, 4, 5, 6].reverse().map((i) => {
            const from = dayjs().subtract(i, "day").format("YYYY-MM-DD");
            const to = dayjs()
              .subtract(i - 1, "day")
              .format("YYYY-MM-DD");

            return (
              <button
                key={i}
                className={`btn btn-secondary ${
                  from === filter.from && "active"
                }`}
                onClick={() =>
                  setFilter((s) => {
                    return { ...s, from, to };
                  })
                }
              >
                {from}
              </button>
            );
          })}

          <button className="btn btn-secondary">Today</button>
        </div>
      </div>
      <div className="d-flex justify-content-between align-items-center my-3">
        <p>
          {orders.length} Items Showing
          {Object.keys(filter).some((i) => filter[i]) && (
            <button
              className="btn btn-link"
              onClick={() =>
                setFilter({ orderID: "", name: "", from: "", to: "" })
              }
            >
              Reset filters
            </button>
          )}
        </p>
        <div className="form-group">
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
        </div>
      </div>
      <table className="table">
        <thead>
          <tr>
            <th>Order #</th>
            <th>Name</th>
            <th>Time Ordered</th>
            <th>Time Completed</th>
            <th>Table #</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order._id}>
              <td>{order.orderID}</td>
              <td>{order.customer.name}</td>
              <td>{dayjs(order.createdAt).format("DD/MM/YY HH:mm")}</td>
              <td>{dayjs(order.updatedAt).format("DD/MM/YY HH:mm")}</td>
              <td>{10}</td>
              <td>£{order.totalPrice}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
