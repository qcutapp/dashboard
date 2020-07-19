import React, { useState, useContext, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import { toast } from "react-toastify";
import PropTypes from "prop-types";
import axios from "axios";

import { AppStore } from "store";

export default function Menu() {
  const [drinks, setDrinks] = useState([]);
  const [isAddDrinkVisible, setAddDrinkVisible] = useState(false);
  const [filter, setFilter] = useState({
    category: [],
    search: "",
  });

  // App state
  const {
    appState: { venue, user },
  } = useContext(AppStore);

  // Get drinks
  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_ENDPOINT}/venue/${venue._id}/menu`, {
        headers: { authorization: `Bearer ${user.access_token}` },
      })
      .then((response) => {
        setDrinks(response.data);
      })
      .catch((err) => {
        toast.error(err.response?.data?.message || err.message);
      });
  }, [venue, user]);

  // Filter drinks
  let filteredDrinks = drinks.filter((drink) => {
    // Empty filter
    if (!filter.category.length && !filter.search) return true;

    // Category filter
    if (filter.category.length && filter.category.includes(drink.category)) {
      return true;
    }

    // Search filter
    if (
      filter.search &&
      drink.name.toLowerCase().includes(filter.search.toLowerCase())
    ) {
      return true;
    }

    return false;
  });

  // Sort drinks
  filteredDrinks.sort((a, b) => (a.updatedAt > b.updatedAt ? -1 : 1));

  return (
    <div className="container">
      <div className="row">
        <div className="col-sm">
          <h1>Your Menu</h1>
        </div>
        <div className="col-sm">
          <div
            className="btn btn-link float-right"
            onClick={() => setAddDrinkVisible(true)}
          >
            Add Item
          </div>
        </div>
      </div>
      <div className="filters">
        <div className="btn-group" role="group">
          <button
            type="button"
            className={`btn btn-secondary ${
              !filter.category.length && "active"
            }`}
            onClick={() => setFilter({ search: "", category: [] })}
          >
            All
          </button>
          <button
            type="button"
            className={`btn btn-secondary ${
              filter.category.includes("Soft Drinks") && "active"
            }`}
            onClick={() => setFilter({ search: "", category: ["Soft Drinks"] })}
          >
            Soft Drinks
          </button>
          <button
            type="button"
            className={`btn btn-secondary ${
              filter.category.includes("Spirits") && "active"
            }`}
            onClick={() => setFilter({ search: "", category: ["Spirits"] })}
          >
            Spirits
          </button>
          <button
            type="button"
            className={`btn btn-secondary ${
              filter.category.includes("Shots") && "active"
            }`}
            onClick={() => setFilter({ search: "", category: ["Shots"] })}
          >
            Shots
          </button>
          <button
            type="button"
            className={`btn btn-secondary ${
              (filter.category.includes("Beers") ||
                filter.category.includes("Lagers")) &&
              "active"
            }`}
            onClick={() =>
              setFilter({ search: "", category: ["Beers", "Lagers"] })
            }
          >
            Beers & Lagers
          </button>
          <button
            type="button"
            className={`btn btn-secondary ${
              filter.category.includes("Cocktails") && "active"
            }`}
            onClick={() => setFilter({ search: "", category: ["Cocktails"] })}
          >
            Cocktails
          </button>
          <button
            type="button"
            className={`btn btn-secondary ${
              filter.category.includes("Wines") && "active"
            }`}
            onClick={() => setFilter({ search: "", category: ["Wines"] })}
          >
            Wines
          </button>
        </div>
      </div>
      <div className="d-flex justify-content-between align-items-center my-3">
        <p>
          {drinks.length} Items Showing
          {Object.keys(filter).some((i) => filter[i].length) && (
            <button
              type="button"
              className="btn btn-link"
              onClick={() => setFilter({ search: "", category: [] })}
            >
              Reset filters
            </button>
          )}
        </p>
        <div className="form-group">
          <input
            className="form-control"
            type="text"
            placeholder="Search Drinks"
            value={filter.search}
            onChange={(e) => {
              const search = e.target.value;
              setFilter({ search, category: [] });
            }}
          />
        </div>
      </div>
      <table className="table">
        <thead>
          <tr>
            <th>Category</th>
            <th>Name</th>
            <th>Is Popular</th>
            <th>ABV %</th>
            <th>Size</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>
          {filteredDrinks.map((drink) => (
            <DrinkCard drink={drink} key={drink._id} />
          ))}
        </tbody>
      </table>

      <AddDrink
        show={isAddDrinkVisible}
        onSuccess={(drinks) => {
          setDrinks(drinks);
          setAddDrinkVisible(false);
        }}
        onHide={() => setAddDrinkVisible(false)}
      />
    </div>
  );
}

function DrinkCard({ drink }) {
  return (
    <tr key={drink._id} onClick={() => console.log("clicked")}>
      <td>{drink.category}</td>
      <td>{drink.name}</td>
      <td>{drink.ispopular}</td>
      <td>{drink.abv}</td>
      <td>100ml</td>
      <td>£4.45</td>
    </tr>
  );
}

DrinkCard.defaultProps = {
  drink: PropTypes.shape({
    _id: 1,
    search: "",
    category: "Shots",
    name: "Default Name",
    ispopular: false,
    abv: 0,
    // TODO: Add size and price
  }),
};

DrinkCard.propTypes = {
  drink: PropTypes.shape({
    _id: PropTypes.string,
    search: "",
    category: PropTypes.string,
    name: PropTypes.string,
    ispopular: PropTypes.string, // * API : Make this true/false from API
    abv: PropTypes.string, // * API : Make this true/false from API
    // TODO: Add size and price
  }),
};

function AddDrink({ show, onHide, onSuccess }) {
  const [category, setCategory] = useState("Shots");
  const [name, setName] = useState("Vodka");
  const [abv, setAbv] = useState(8);
  const [size, setSize] = useState(100); // TODO: What is size for?
  const [price, setPrice] = useState(4.49);
  const [ispopular, setIspopular] = useState(true);
  const [instock, setInstock] = useState(true);

  // App State
  const { appState } = useContext(AppStore);

  const addDrink = () => {
    // Request
    axios
      .post(
        `${process.env.REACT_APP_API_ENDPOINT}/venue/drink`,
        { category, name, abv, price, ispopular, instock },
        {
          headers: { authorization: `Bearer ${appState.user.access_token}` },
        }
      )
      .then(
        (response) => {
          onSuccess(response.data);

          toast.success("Added drink!");
        },
        (err) => {
          const message = Array.isArray(err.response?.data?.message)
            ? err.response?.data?.message.map((i) => i.message).join("<br/>")
            : err.response?.data?.message || err.message;

          toast.error(message, { autoClose: 10000 });
        }
      );
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Add Drink</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <form>
          <select
            className="form-control my-2"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">Category</option>
            <option value="Cocktails">Cocktails</option>
            <option value="Spirits">Spirits</option>
            <option value="Soft Drinks">Soft Drinks</option>
            <option value="Beers">Beers</option>
            <option value="Wines">Wines</option>
            <option value="Shots">Shots</option>
          </select>
          <input
            type="text"
            className="form-control my-2"
            placeholder="Drink Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="text"
            className="form-control my-2"
            placeholder="ABV"
            value={abv}
            onChange={(e) => setAbv(e.target.value)}
          ></input>
          <input
            type="text"
            className="form-control my-2"
            placeholder="Size"
            value={size}
            onChange={(e) => setSize(e.target.value)}
          ></input>
          <input
            type="text"
            className="form-control my-2"
            placeholder="Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          ></input>
          <select
            className="form-control my-2"
            value={ispopular}
            onChange={(e) => setIspopular(e.target.value)}
          >
            <option value="">Is Popular</option>
            <option value="true">Yes</option>
            <option value="false">No</option>
          </select>
          <select
            className="form-control my-2"
            value={instock}
            onChange={(e) => setInstock(e.target.value)}
          >
            <option value="">In Stock</option>
            <option value="true">Yes</option>
            <option value="false">No</option>
          </select>
        </form>
      </Modal.Body>

      <Modal.Footer>
        <button type="button" className="btn btn-secondary" onClick={onHide}>
          Close
        </button>
        <button type="button" className="btn btn-primary" onClick={addDrink}>
          Save
        </button>
      </Modal.Footer>
    </Modal>
  );
}

AddDrink.defaultProps = {
  show: false,
  onSuccess: (i) => i,
  onHide: (i) => i,
};

AddDrink.propTypes = {
  show: PropTypes.bool.isRequired,
  onSuccess: PropTypes.func,
  onHide: PropTypes.func,
};
