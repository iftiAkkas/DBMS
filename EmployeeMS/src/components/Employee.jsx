import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Employee = () => {
  const [employee, setEmployee] = useState([]); // Employee data state
  const navigate = useNavigate();

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
    axios.delete('http://localhost:3000/auth/delete_employee/'+id)
    .then(result => {
        if(result.data.Status) {
            window.location.reload()
        } else {
            alert(result.data.Error)
        }
    })
  } 

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>Employee List</h3>
        <Link to="/dashboard/add_employee" className="btn btn-success">
          Add Employee
        </Link>
      </div>

      {/* Render employee table directly */}
      <div className="table-responsive">
        <table className="table table-striped table-hover">
          <thead className="table-dark">
            <tr>
              <th>Name</th>
              <th>Image</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Join Date</th>
              <th>DOB</th>
              <th>Address</th>
              <th>Salary</th>
              <th>Department ID</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {employee.map((e) => (
              <tr key={e.id}>
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
                <td>{e.department_id}</td>
                <td>
                  <div className="d-flex">
                    {/* Edit and Delete buttons */}
                    <Link to={`/dashboard/edit_employee/` + e.id} className="btn btn-primary btn-sm me-2">Edit</Link>
                    <button className="btn btn-danger btn-sm" onClick={()=> handleDelete(e.id)}>Delete</button>
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
