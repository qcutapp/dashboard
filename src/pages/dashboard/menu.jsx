import React, { useState, useContext, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import { toast } from "react-toastify";
import PropTypes from "prop-types";
import axios from "axios";

import { AppStore } from "store";

export default function Menu() {
  const [drinks, setDrinks] = useState([]);
  const [addDrink, setAddDrink] = useState(false);
  const [modifyDrink, setModifyDrink] = useState(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const [filter, setFilter] = useState({
    category: [],
    search: "",
  });

  // App state
  const {
    appState: { venue, user },
  } = useContext(AppStore);

  // Show Modal
  useEffect(() => {
    if (addDrink || modifyDrink) {
      setModalVisible(true);
    }
  }, [addDrink, modifyDrink]);

  // Hide Modal
  useEffect(() => {
    if (!isModalVisible) {
      if (addDrink) setAddDrink(false);
      if (modifyDrink) setModifyDrink(null);
    }
  }, [isModalVisible]); // !BUG: Adding addDrink, modifyDrink in dependencies breaks the Update modal.

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
  let filteredDrinks = drinks
    .filter((drink) => !drink.deleted)
    .filter((drink) => {
      if (!filter.category.length && !filter.search) return true;

      if (filter.category.length && filter.category.includes(drink.category)) {
        return true;
      }

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

  // Category icons
  const categoryIcons = {
    Spirits: process.env.PUBLIC_URL + "/drinks/Grey-Spirit-Icon.png",
    Cocktails: process.env.PUBLIC_URL + "/drinks/Grey-Cocktail-Icon.png",
    Wines: process.env.PUBLIC_URL + "/drinks/Grey-Wine-Icon.png",
    "Soft Drinks": process.env.PUBLIC_URL + "/drinks/Grey-SoftDrink-Icon.png",
    "Beers & Bottles": process.env.PUBLIC_URL + "/drinks/Grey-Bottle-Icon.png",
    Shots: process.env.PUBLIC_URL + "/drinks/Grey-Shots-Icon.png",
    default: process.env.PUBLIC_URL + "/drinks/Grey-Shots-Icon.png",
  };

  return (
    <div className="container container-menu">
      <div className="row mt-3 mb-5">
        <div className="col-sm">
          <h1 className="text-light text-weight-bold">Your Menu</h1>
        </div>
        <div className="col-sm text-right">
          <div
            className="btn btn-primary btn-primary-hover-none btn-lg"
            onClick={() => setAddDrink(true)}
          >
            Add Item
            <img
              src={process.env.PUBLIC_URL + "/add-icon.png"}
              alt="Add Item"
              style={{ marginLeft: "1rem", width: "24px" }}
            />
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-sm">
          <div className="btn-group btn-group-sm w-100" role="group">
            <button
              type="button"
              className={`btn btn-primary btn-primary-hover-none btn-primary-focus-none btn-primary-active-none text-height-lg ${
                !filter.category.length && "font-weight-bold text-lg"
              }`}
              onClick={() => setFilter({ search: "", category: [] })}
            >
              All
            </button>
            <button
              type="button"
              className={`btn btn-primary btn-primary-hover-none btn-primary-focus-none btn-primary-active-none text-height-lg ${
                filter.category.includes("Soft Drinks") &&
                "font-weight-bold text-lg"
              }`}
              onClick={() =>
                setFilter({ search: "", category: ["Soft Drinks"] })
              }
            >
              Soft Drinks
            </button>
            <button
              type="button"
              className={`btn btn-primary btn-primary-hover-none btn-primary-focus-none btn-primary-active-none text-height-lg ${
                filter.category.includes("Spirits") &&
                "font-weight-bold text-lg"
              }`}
              onClick={() => setFilter({ search: "", category: ["Spirits"] })}
            >
              Spirits
            </button>
            <button
              type="button"
              className={`btn btn-primary btn-primary-hover-none btn-primary-focus-none btn-primary-active-none text-height-lg ${
                filter.category.includes("Shots") && "font-weight-bold text-lg"
              }`}
              onClick={() => setFilter({ search: "", category: ["Shots"] })}
            >
              Shots
            </button>
            <button
              type="button"
              className={`btn btn-primary btn-primary-hover-none btn-primary-focus-none btn-primary-active-none text-height-lg ${
                (filter.category.includes("Beers") ||
                  filter.category.includes("Bottles")) &&
                "font-weight-bold text-lg"
              }`}
              onClick={() =>
                setFilter({ search: "", category: ["Beers", "Bottles"] })
              }
            >
              Beers & Bottles
            </button>
            <button
              type="button"
              className={`btn btn-primary btn-primary-hover-none btn-primary-focus-none btn-primary-active-none text-height-lg ${
                filter.category.includes("Cocktails") &&
                "font-weight-bold text-lg"
              }`}
              onClick={() => setFilter({ search: "", category: ["Cocktails"] })}
            >
              Cocktails
            </button>
            <button
              type="button"
              className={`btn btn-primary btn-primary-hover-none btn-primary-focus-none btn-primary-active-none text-height-lg ${
                filter.category.includes("Wines") && "font-weight-bold text-lg"
              }`}
              onClick={() => setFilter({ search: "", category: ["Wines"] })}
            >
              Wines
            </button>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-sm">
          <div className="table-responsive">
            <table className="table table-borderless rounded-pill cards">
              <thead>
                <tr>
                  <td colSpan="3" style={{ verticalAlign: "bottom" }}>
                    {filteredDrinks.length} Items Showing
                    {Object.keys(filter).some((i) => filter[i].length) && (
                      <button
                        type="button"
                        className="btn btn-link"
                        onClick={() => setFilter({ search: "", category: [] })}
                      >
                        Reset filters
                      </button>
                    )}
                  </td>
                  <td colSpan="3">
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
                  </td>
                </tr>
                <tr>
                  <td className="text-muted">Category</td>
                  <td className="text-muted">Name</td>
                  <td className="text-muted">Is Popular</td>
                  <td className="text-muted">ABV %</td>
                  <td className="text-muted">Size</td>
                  <td className="text-muted">Price</td>
                </tr>
              </thead>
              <tbody>
                {filteredDrinks.map((drink) => (
                  <tr
                    className="shadow rounded-pill"
                    key={drink._id}
                    style={{ cursor: "pointer" }}
                    onClick={() => setModifyDrink(drink)}
                  >
                    <td className="p-4" style={{ width: "125px" }}>
                      <img
                        src={
                          drink.category in categoryIcons
                            ? categoryIcons[drink.category]
                            : categoryIcons["default"]
                        }
                        alt="Drink Icon"
                        style={{ height: "36px", width: "auto" }}
                      />
                    </td>
                    <td style={{ width: "150px" }}>{drink.name}</td>
                    <td>{drink.ispopular}</td>
                    <td>{drink.abv}</td>
                    <td>{drink.sizes?.length ? drink.sizes[0].size : 0}</td>
                    <td>
                      £
                      {drink.sizes?.length
                        ? parseFloat(drink.sizes[0].price).toFixed(2)
                        : 0}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <AddOrUpdateDrinkModal
        show={isModalVisible}
        onSuccess={(drinks) => {
          setDrinks(drinks);
          setModalVisible(false);
        }}
        drink={modifyDrink}
        onHide={() => setModalVisible(false)}
      />
    </div>
  );
}

/**
 * Add a drink if props.drink exists else Update.
 */
function AddOrUpdateDrinkModal({ drink, show, onHide, onSuccess }) {
  console.log(drink, show);
  const [category, setCategory] = useState(drink?.category || "");
  const [name, setName] = useState(drink?.name || "");
  const [abv, setAbv] = useState(drink?.abv || "");
  const [sizes, setSizes] = useState(drink?.sizes || []);
  const [ispopular, setIspopular] = useState(drink?.ispopular || "yes");
  const [instock, setInstock] = useState(drink?.instock || "yes");

  // App State
  const { appState } = useContext(AppStore);

  // Update state on Props changes
  useEffect(() => {
    setCategory(drink?.category || "");
    setName(drink?.name || "");
    setAbv(drink?.abv || "");
    setSizes(drink?.sizes || []);
    setIspopular(drink?.ispopular || "yes");
    setInstock(drink?.instock || "yes");
  }, [drink]);

  // Submit Drink
  const submitDrink = (type) => {
    let request;

    switch (type) {
      case "add":
        // Add Request
        request = axios.post(
          `${process.env.REACT_APP_API_ENDPOINT}/venue/drink`,
          { category, name, abv, ispopular, sizes, instock },
          {
            headers: { authorization: `Bearer ${appState.user.access_token}` },
          }
        );
        break;
      case "update":
        // Patch Request
        request = axios.patch(
          `${process.env.REACT_APP_API_ENDPOINT}/venue/drink/${drink._id}`,
          { category, name, abv, ispopular, sizes, instock },
          {
            headers: { authorization: `Bearer ${appState.user.access_token}` },
          }
        );
        break;
      case "delete":
        // Delete Request
        request = axios.delete(
          `${process.env.REACT_APP_API_ENDPOINT}/venue/drink/${drink._id}`,
          {
            headers: { authorization: `Bearer ${appState.user.access_token}` },
          }
        );
        break;
      default:
        break;
    }

    // Send Request
    request.then(
      (response) => {
        onSuccess(response.data);

        if (type === "add") toast.success("Added Drink!");
        if (type === "update") toast.success("Updated Drink!");
        if (type === "delete") toast.success("Deleted Drink!");
      },
      (err) => {
        const message = Array.isArray(err.response?.data?.message)
          ? err.response?.data?.message
              .map((i) => <li>{i.message}</li>)
              .reduce((prev, curr) => [prev, "", curr])
          : err.response?.data?.message || err.message;

        toast.error(<ul className="list-unstyled">{message}</ul>, {
          autoClose: 10000,
        });
      }
    );
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>{drink ? "Update Item" : "Add Item"}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <form>
          <select
            className="form-control my-4"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">Category</option>
            <option value="Cocktails">Cocktails</option>
            <option value="Spirits">Spirits</option>
            <option value="Soft Drinks">Soft Drinks</option>
            <option value="Beers & Bottles">Beers & Bottles</option>
            <option value="Wines">Wines</option>
            <option value="Shots">Shots</option>
          </select>
          <input
            type="text"
            className="form-control my-4"
            placeholder="Drink Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="text"
            className="form-control my-4"
            placeholder="ABV"
            value={abv}
            onChange={(e) => setAbv(e.target.value)}
          ></input>
          <SizeSelector
            sizes={sizes}
            category={category}
            onChange={(sizes) => setSizes(sizes)}
          />
          <div className="my-4">
            <label className="form-label font-weight-bold">Is popular</label>
            <select
              className="form-control"
              value={ispopular}
              onChange={(e) => setIspopular(e.target.value)}
            >
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
          </div>
          <div className="my-4">
            <label className="form-label font-weight-bold">In Stock</label>
            <select
              className="form-control"
              value={instock}
              onChange={(e) => setInstock(e.target.value)}
            >
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
          </div>
        </form>
      </Modal.Body>

      <Modal.Footer>
        {drink && (
          <>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => submitDrink("delete")}
            >
              Delete Drink
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => submitDrink("update")}
            >
              Update Drink
            </button>
          </>
        )}
        {!drink && (
          <button
            type="button"
            className="btn btn-primary btn-block"
            onClick={() => submitDrink("add")}
          >
            Save Drink
          </button>
        )}
      </Modal.Footer>
    </Modal>
  );
}

AddOrUpdateDrinkModal.defaultProps = {
  drink: PropTypes.shape({
    _id: 1,
    category: "Shots",
    name: "Default Name",
    ispopular: false,
    instock: false,
    abv: 0,
    sizes: [],
  }),
  show: false,
  onSuccess: (i) => i,
  onHide: (i) => i,
};

AddOrUpdateDrinkModal.propTypes = {
  drink: PropTypes.shape({
    _id: PropTypes.string,
    search: "",
    category: PropTypes.string,
    name: PropTypes.string,
    ispopular: PropTypes.string,
    instock: PropTypes.string,
    abv: PropTypes.string,
    sizes: PropTypes.arrayOf(
      PropTypes.shape({
        size: PropTypes.string,
        price: PropTypes.string,
      })
    ),
  }),
  show: PropTypes.bool.isRequired,
  onSuccess: PropTypes.func,
  onHide: PropTypes.func,
};

function SizeSelector(props) {
  const [sizes, setSizes] = useState(props.sizes || []);

  // Size Options
  const sizeOptions = {
    Spirits: ["Single", "Double", "Triple", "Bottle"],
    Cocktails: ["Standard", "Large", "Pitcher", "Jug"],
    Wines: [
      "Bottle",
      "125ml Glass",
      "175ml Glass",
      "250ml Glass",
      "500ml Bottle",
      "750ml Bottle",
      "1L Bottle",
    ],
    "Soft Drinks": ["Can", "Standard", "Large", "Bottle"],
    "Beers & Bottles": [
      "Pint",
      "Half-Pint",
      "330ml Bottle",
      "500ml Bottle",
      "275ml Bottle",
      "470ml Bottle",
      "550ml Bottle",
      "640ml Bottle",
      "355ml Bottle",
    ],
    Shots: ["Single", "Double", "Triple", "Bomb"],
  };

  // emit onChange
  useEffect(() => {
    props.onChange(sizes);
  }, [sizes, props]);

  console.log("sizes:", sizes);

  return (
    <div className="my-5">
      <label className="form-label font-weight-bold">Sizes</label>
      {Array(sizes.filter((s) => s.size && s.price).length + 1)
        .fill()
        .map((_, i) => (
          <div className="d-flex align-items-bottom" key={i}>
            <select
              className="form-control mr-2"
              value={sizes[i]?.size || ""}
              onChange={(e) => {
                const value = e.target.value;
                setSizes((s) => {
                  const newS = [...s];
                  newS[i] = { ...newS[i], size: value };
                  return newS;
                });
              }}
            >
              <option value="">Size</option>
              {props.category in sizeOptions &&
                sizeOptions[props.category].map((s) => (
                  <option value={s} key={s}>
                    {s}
                  </option>
                ))}
            </select>
            <input
              type="text"
              className="form-control mx-2"
              placeholder="Price"
              value={sizes[i]?.price || ""}
              onChange={(e) => {
                const value = e.target.value;
                setSizes((s) => {
                  const newS = [...s];
                  newS[i] = { ...newS[i], price: value };
                  return newS;
                });
              }}
            ></input>

            <button
              type="button"
              className="btn btn-link btn-sm"
              style={{
                visibility:
                  sizes[i]?.size && sizes[i]?.price ? "visible" : "hidden",
              }}
              onClick={() => {
                setSizes((s) => {
                  const newS = [...s];
                  newS.splice(i, 1);
                  return newS;
                });
              }}
            >
              Remove
            </button>
          </div>
        ))}
    </div>
  );
}

SizeSelector.defaultProps = {
  sizes: [],
  category: "",
  onChange: (i) => i,
};

SizeSelector.propTypes = {
  sizes: PropTypes.arrayOf(
    PropTypes.shape({
      size: PropTypes.string,
      price: PropTypes.string,
    })
  ),
  category: PropTypes.string,
  onChange: PropTypes.func,
};
