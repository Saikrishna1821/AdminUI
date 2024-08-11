import { useEffect, useRef, useState } from "react";
import "./App.css";
import Pagination from "./Pagination";
import saveIcon from "./assets/image.png";
import editIcon from "./assets/pencil.png";
import trash from "./assets/trash.png";

function App() {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [editingRow, setEditingRow] = useState(null);
  const selectedRows = useRef([]);
  const originalData = useRef([]);
  const [allRows, setAllRows] = useState(false);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    name: "",
    email: "",
  });

  let rowsPerPage = 10;
  let length = Math.ceil(data.length / 10);
  let currentRows = data.slice(
    rowsPerPage * currentPage - rowsPerPage,
    currentPage * 10
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        let response = await fetch(
          "https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json"
        );

        let json = await response.json();
        setData(json);
        originalData.current = json;
        setLoading(false);
      } catch (e) {
        console.log(e);
      }
    };
    fetchData();
  }, []);

  const handlePage = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleEdit = (e, item, index) => {
    if (e.target.className === "edit") {
      setEditingRow(item.id);
      setForm({ name: item.name, email: item.email });
    } else {
      data[index] = { ...currentRows[index], ...form };
      originalData.current = data;
      setEditingRow(null);
      setForm({ name: "", email: "" });
    }
  };

  const handleValue = (e) => {
    const { name, value } = e.target;

    setForm({
      ...form,
      [name]: value,
    });
  };

  const handleDelete = (index) => {
    data.splice(index, 1);
    setData([...data]);
  };

  const handleSelect = (id) => {
    if (id === "allRows") {
      if (allRows === true) setAllRows(false);
      else {
        setAllRows(true);
        selectedRows.current = [];
        let id = [];
        currentRows.map((item, index) => {
          id.push(item.id);
        });

        id.map((item) => selectedRows.current.push(item));
      }
    } else {
      selectedRows.current.push(id);
    }
  };

  const handleMultipleRows = () => {
    let newData = data.filter(
      (item) => !selectedRows.current.includes(item.id)
    );
    setData([...newData]);
    selectedRows.current = [];
    setAllRows(false);
  };
  const filterOut = (e) => {
    let filter = e.target.value;
    if (filter.length > 0) {
      let filteredData = originalData.current.filter((item) => {
        if (
          item.id == filter ||
          item.name.includes(filter) ||
          item.email.includes(filter) ||
          item.role.includes(filter)
        )
          return item;
      });
      setData([...filteredData]);
      filter = "";
    } else {
      setData([...originalData.current]);
    }
  };
  return (
    <div className="App">
      <div className="main">
        <input
          type="text"
          placeholder="Search by name , email or role"
          onChange={filterOut}
        />
        <table>
          <thead>
            <th>
              <input
                type="checkbox"
                id="allRows"
                {...(allRows ? { checked: true } : null)}
                onClick={(e) => handleSelect(e.target.id)}
              />
            </th>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
            <th></th>
          </thead>
          <tbody>
            {loading ? (
              <div id="data-btn">....Loading</div>
            ) :(
              currentRows.map((item, index) => {
                return (
                  <tr key={item.id} >
                    <td >
                      <input
                        type="checkbox"
                        {...(allRows ? { checked: true } : null)} 
                        onChange={() => handleSelect(item.id)}
                      />{" "}
                    </td>
                    <td>
                      {editingRow === item.id ? (
                        <input
                          type="text"
                          value={form.name}
                          onChange={handleValue}
                          name="name"
                        />
                      ) : (
                        item.name
                      )}
                    </td>
                    <td>
                      {editingRow === item.id ? (
                        <input
                          type="text"
                          value={form.email}
                          name="email"
                          onChange={handleValue}
                        />
                      ) : (
                        item.email
                      )}
                    </td>
                    <td>{item.role}</td>
                    <td>
                      <button id="icon-btn">
                        <img
                          onClick={(e) => handleEdit(e, item, index)}
                          className={editingRow === item.id ? "save" : "edit"}
                          src={editingRow === item.id ? saveIcon : editIcon}
                          alt={editingRow === item.id ? "No edit" : "no save"}
                          width="20px"
                          height="20px"
                        />
                      </button>
                    </td>
                    <td>
                      <button id="icon-btn" >
                        <img
                          onClick={() => handleDelete(index)}
                          src={trash}
                          alt="delete"
                          width="20px"
                          height="20px"
                        />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
        {currentRows.length===0?<div id="data-btn">No data Found</div>:null}
      </div>
      <div>
        {allRows?<button className="delete" onClick={() => handleMultipleRows()}>
          Delete All rows
        </button>:null}
        <Pagination length={length} handlePage={handlePage} />
      </div>
    </div>
  );
}

export default App;
