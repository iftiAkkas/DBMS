import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './EmployeePanel.css'; // Assuming you will create this CSS file

const EmployeePanel = () => {
  const [employee, setEmployee] = useState({});
  const { id } = useParams();

  // Fetch employee details on page load
  useEffect(() => {
    axios
      .get(`http://localhost:3000/employee/details/${id}`)
      .then((result) => {
        setEmployee(result.data[0] || {});
      })
      .catch((err) => console.log(err));
  }, [id]);

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
    <div className="container mt-5">
      <div className="text-center my-4">
        <img
          src={`http://localhost:3000/Images/${employee.image}`}
          alt="Employee"
          className="img-fluid rounded-circle"
          style={{
            width: '150px',
            height: '150px',
            objectFit: 'cover',
          }}
        />
        <h3 className="mt-3">{`${employee.first_name || ''} ${employee.last_name || ''}`}</h3>
      </div>

      {/* Employee Details Table */}
      <div className="table-responsive">
        <table className="table table-bordered table-striped table-hover employee-details-table">
          <thead>
            <tr>
              <th>Details</th>
              <th>Information</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Email</td>
              <td>{employee.email || 'Not Available'}</td>
            </tr>
            <tr>
              <td>Phone</td>
              <td>{employee.phone || 'Not Available'}</td>
            </tr>
            <tr>
              <td>Join Date</td>
              <td>{formatDate(employee.join_date)}</td>
            </tr>
            <tr>
              <td>Date of Birth</td>
              <td>{formatDate(employee.DOB)}</td>
            </tr>
            <tr>
              <td>Address</td>
              <td>{employee.address || 'Not Available'}</td>
            </tr>
            <tr>
              <td>Salary</td>
              <td>{employee.salary || 'Not Available'}</td>
            </tr>
            <tr>
              <td>Department </td>
              <td>{employee.department_name || 'Not Available'}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EmployeePanel;
