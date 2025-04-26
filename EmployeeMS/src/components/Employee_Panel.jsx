import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams, Link, Outlet } from 'react-router-dom';
import 'bootstrap-icons/font/bootstrap-icons.css';

const Employee_Panel = () => {
  const [employee, setEmployee] = useState({});
  const { id } = useParams(); // Getting the employee id from the URL params
  //const navigate = useNavigate();
  const anvigate = useNavigate()

  // Fetch employee details on page load
  useEffect(() => {
    axios
      .get(`http://localhost:3000/employee/details/${id}`)
      .then((result) => {
        setEmployee(result.data[0] || {});
      })
      .catch((err) => console.log(err));
  }, [id]);

  // Handle employee logout
  const handleLogout = () => {
    axios
      .get('http://localhost:3000/employee/logout')
      .then((result) => {
        if (result.data.Status) {
          localStorage.removeItem('valid');
          anvigate('/');
        }
      })
      .catch((err) => console.log(err));
  };

  // Format the date
  const formatDate = (isoDate) => {
    if (!isoDate) return 'Not Available';
    const date = new Date(isoDate);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="container-fluid">
      <div className="row flex-nowrap">

        {/* Sidebar */}
        <div className="col-auto col-md-3 col-xl-2 px-sm-2 px-0 bg-purple">
          <div className="d-flex flex-column align-items-center align-items-sm-start px-3 pt-2 text-white min-vh-100">
            {/* Dynamic employee link */}
            <Link
              to={`/employee/${id}`}  // Dynamically pass the actual employee id here
              className="d-flex align-items-center pb-3 mb-md-1 mt-md-3 me-md-auto text-white text-decoration-none"
            >
              <span className="fs-5 fw-bolder d-none d-sm-inline">EMPLOYEE PANEL</span>
            </Link>
            <ul
              className="nav nav-pills flex-column mb-sm-auto mb-0 align-items-center align-items-sm-start"
              id="menu"
            >
              <li className="w-100">
                <Link
                  to={`/employee/${id}`}  // Dynamically pass the actual employee id here
                  className="nav-link text-white px-0 align-middle"
                >
                  <i className="bi bi-person-circle fs-4 ms-2"></i>
                  <span className="ms-2 d-none d-sm-inline">Profile</span>
                </Link>
              </li>
              <li className="w-100">
                <Link
                  to={`/employee/${id}/leave-requests/${id}`}  // Dynamically pass the actual employee id here
                  className="nav-link text-white px-0 align-middle"
                >
                  <i className="bi bi-calendar-check fs-4 ms-2"></i>
                  <span className="ms-2 d-none d-sm-inline">Request Leave</span>
                </Link>
              </li>
              <li className="w-100" onClick={handleLogout}>
                <Link className="nav-link text-white px-0 align-middle">
                  <i className="bi bi-box-arrow-right fs-4 ms-2"></i>
                  <span className="ms-2 d-none d-sm-inline">Logout</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Main Content */}
        <div className="col p-0 m-0">
          <div className="p-2 d-flex justify-content-center header-purple">
            <h4>Employee Management System</h4>
          </div>

          <Outlet />
          
        </div>
      </div>
    </div>
  );
};

export default Employee_Panel;
