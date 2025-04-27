import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Employee = () => {
  const [employee, setEmployee] = useState([]); // Employee data state
  const [departments, setDepartments] = useState([]); // Department data state
  const [query, setQuery] = useState(""); // Search query
  const [selectedDepartment, setSelectedDepartment] = useState(""); // Selected department

  useEffect(() => {
    // Fetch employee data from the API
    axios
      .get("http://localhost:3000/auth/employee")
      .then((result) => {
        if (result.data.Status) {
          setEmployee(result.data.Result); // Set employee data
        } else {
          alert(result.data.Error); // Handle errors if any
        }
      })
      .catch((err) => console.log(err)); // Log any errors

    // Fetch department data from the API
    axios
      .get("http://localhost:3000/auth/department")
      .then((result) => {
        if (result.data.Status) {
          setDepartments(result.data.Result); // Set department data
        } else {
          alert(result.data.Error); // Handle errors if any
        }
      })
      .catch((err) => console.log(err)); // Log any errors
  }, []); // Empty dependency array means this runs only once when the component mounts

  // Helper function to format ISO date
  const formatDate = (isoDate) => {
    if (!isoDate) return "Not Available"; // Handle missing dates
    const date = new Date(isoDate);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleDelete = (id) => {
    axios
      .delete("http://localhost:3000/auth/delete_employee/" + id)
      .then((result) => {
        if (result.data.Status) {
          window.location.reload();
        } else {
          alert(result.data.Error);
        }
      });
  };

  const handleSearch = () => {
    axios
      .get(
        `http://localhost:3000/auth/search_employee?query=${query}&department_name=${selectedDepartment}`
      )
      .then((result) => {
        if (result.data.Status) {
          setEmployee(result.data.Result); // Update employee list with search results
        } else {
          setEmployee([]); // Clear employee list if no results
        }
      })
      .catch((err) => console.log(err)); // Log any errors
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>Employee List</h3>
        <Link to="/dashboard/add_employee" className="btn btn-success">
          Add Employee
        </Link>
      </div>

      {/* Search Section */}
      <div className="row mb-4">
        <div className="col-md-4">
          <label htmlFor="department" className="form-label">
            Select Department
          </label>
          <select
            id="department"
            className="form-select"
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
          >
            <option value="">All Departments</option>
            {departments.map((department) => (
              <option key={department.id} value={department.name}>
                {department.name}
              </option>
            ))}
          </select>
        </div>
        <div className="col-md-4">
          <label htmlFor="search" className="form-label">
            Search by Name or ID
          </label>
          <input
            type="text"
            id="search"
            className="form-control"
            placeholder="Enter name or ID"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <div className="col-md-4 d-flex align-items-end">
          <button className="btn btn-primary w-100" onClick={handleSearch}>
            Search
          </button>
        </div>
      </div>

      {/* Render employee table directly */}
      <div className="table-responsive">
        <table className="table table-striped table-hover">
          <thead className="table-dark">
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Image</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Join Date</th>
              <th>DOB</th>
              <th>Address</th>
              <th>Salary</th>
              <th>Department</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {employee.map((e) => (
              <tr key={e.id}>
                <td>{e.id}</td>
                <td>{e.first_name + " " + e.last_name}</td>
                <td>
                  <img
                    src={`http://localhost:3000/Images/` + e.image}
                    className="employee_image"
                    alt="Employee"
                    style={{
                      width: "50px",
                      height: "50px",
                      objectFit: "cover",
                      borderRadius: "50%",
                    }}
                  />
                </td>
                <td>{e.email}</td>
                <td>{e.phone}</td>
                <td>{formatDate(e.join_date)}</td>
                <td>{formatDate(e.DOB)}</td>
                <td>{e.address}</td>
                <td>{e.salary}</td>
                <td>{e.department_name}</td>
                <td>
                  <div className="d-flex">
                    {/* Edit and Delete buttons */}
                    <Link
                      to={`/dashboard/edit_employee/` + e.id}
                      className="btn btn-primary btn-sm me-2"
                    >
                      Edit
                    </Link>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(e.id)}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Employee;