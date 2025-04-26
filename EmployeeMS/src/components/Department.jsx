import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const Department = () => {
  const [department, setDepartment] = useState([]);

  useEffect(() => {
    axios
      .get('http://localhost:3000/auth/department')
      .then((result) => {
        if (result.data.Status) {
          setDepartment(result.data.Result);
        } else {
          alert(result.data.Error);
        }
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <div className="container mt-4" style={{ backgroundColor: 'white', minHeight: '100vh' }}>
      <div className="d-flex flex-column align-items-center mb-4">
        <div
          className="text-center p-3 mb-4"
          style={{
            backgroundColor: '#8b004d', // Set background color to #8b004d for department list
            color: 'white',
            borderRadius: '10px',
            width: '80%', // Adjusted width for better centering
            fontSize: '1.5rem',
            fontWeight: 'bold',
          }}
        >
          Department List
        </div>
      </div>

      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <table
            className="table table-striped table-hover align-middle"
            style={{
              borderRadius: '10px',
              overflow: 'hidden',
              backgroundColor: 'white',
              transition: 'all 0.3s ease',
            }}
          >
            <thead
              style={{
                backgroundColor: '#8b004d', // Gradient color for the header
                color: 'white',
                fontWeight: 'bold',
                borderTopLeftRadius: '10px',
                borderTopRightRadius: '10px',
              }}
            >
              <tr>
                <th className="text-center">#</th>
                <th>Department Name</th>
              </tr>
            </thead>
            <tbody>
              {department.length > 0 ? (
                department.map((c, index) => (
                  <tr
                    key={index}
                    style={{
                      transition: 'background-color 0.3s ease',
                    }}
                    onMouseEnter={(e) => (e.target.style.backgroundColor = '#f2e6f5')}
                    onMouseLeave={(e) => (e.target.style.backgroundColor = '')}
                  >
                    <td className="text-center">{index + 1}</td>
                    <td>{c.name}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="2" className="text-center text-muted">
                    No departments found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="d-flex justify-content-center">
        <Link
          to="/dashboard/add_department"
          className="btn"
          style={{
            backgroundColor: '#8b004d',
            color: 'white',
            borderRadius: '25px',
            padding: '10px 20px',
            fontSize: '1rem',
          }}
        >
          <i className="bi bi-plus-circle me-2"></i>Add Department
        </Link>
      </div>
    </div>
  );
};

export default Department;
