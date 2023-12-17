import "./App.css";

import { useEffect, useState } from "react";
import { getLocations, isNameValid } from "./mock-api/apis";

export function App() {
  const [items, setItems] = useState([]);
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [options, setOptions] = useState([]);
  const [nameValid, setNameValid] = useState(false);

  useEffect(() => {
    let nameSpan = document.querySelector(".nameSpan");
    nameSpan.style.display = "none";
    if (name !== "") {
      const timeoutId = setTimeout(() => {
        console.log("REQUEST");
        console.log(name);
        validateName(name).then((i) => {
          setNameValid(i);
          if (!nameValid) {
            nameSpan.style.display = "block";
          }
        });
      }, 500);
      return () => clearTimeout(timeoutId);
    }

    if (name?.trim() === "") {
      setNameValid(false);
    }
  }, [name, nameValid]);

  useEffect(() => {
    async function requestLocations() {
      const data = getLocations();
      const results = [];
      (await data).forEach((element) => {
        results.push(element);
      });
      setOptions([...results]);
    }
    console.log("options set");
    //Request Options
    requestLocations();
  }, []);

  const handleOnChange = (e) => {
    setName(e.target.value);
  };
  const handleSelectChange = (event) => {
    setLocation(event.target.value);
    console.log(location);
  };
  async function validateName(nameVal) {
    return await isNameValid(nameVal);
  }

  function handleSubmit(e) {
    e.preventDefault();
    addItem({ name: name, location: location });
    setName("");
    setLocation("");
    let defaultOption = document.querySelector(".defaultOption");
    defaultOption.selected = "true";
  }
  function addItem({ name, location }) {
    setItems((currentItems) => {
      return [...currentItems, { name, location }];
    });
  }

  function resetItems() {
    setItems((currentItems) => {
      return [];
    });
  }

  return (
    <div className="App">
      <div className="top">
        <form onSubmit={handleSubmit}>
          <ul>
            <li>
              <label>Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => {
                  handleOnChange(e);
                }}
              />
              <span className="nameSpan">this name has already been taken</span>
            </li>
            <li>
              <label>Location</label>
              <select onChange={handleSelectChange}>
                <option className="defaultOption" selected value="">
                  select
                </option>
                {options.map((option, index) => {
                  return (
                    <option key={index} value={option}>
                      {option}
                    </option>
                  );
                })}
              </select>
            </li>
            <li>
              <button onClick={resetItems}>Clear</button>
              <button disabled={!nameValid || location === ""} className="add">
                Add
              </button>
            </li>
          </ul>
        </form>
      </div>
      <div className="bottom">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Location</th>
            </tr>
          </thead>
          <tbody>
            {items.map(({ name, location }) => {
              return (
                <tr className="bodyRow">
                  <td>{name}</td>
                  <td>{location}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;
