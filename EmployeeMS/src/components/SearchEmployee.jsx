import React, { useState } from "react";
import axios from "axios";

const SearchEmployee = ({ onSelectEmployee }) => {
  const [query, setQuery] = useState("");
  const [employees, setEmployees] = useState([]);

  const handleSearch = () => {
    axios
      .get(`http://localhost:3000/auth/search_employee?query=${query}`)
      .then((result) => {
        if (result.data.Status) {
          setEmployees(result.data.Result);
        } else {
          alert(result.data.Error);
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="container mt-4">
      <h3 className="text-center">Search Employee</h3>
      <div className="input-group mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Search by name, department ID, or department name"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button className="btn btn-primary" onClick={handleSearch}>
          Search
        </button>
      </div>
      <ul className="list-group">
        {employees.map((employee) => (
          <li
            key={employee.id}
            className="list-group-item d-flex justify-content-between align-items-center"
            onClick={() => onSelectEmployee(employee)}
            style={{ cursor: "pointer" }}
          >
            {employee.first_name} {employee.last_name} - {employee.department_name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SearchEmployee;