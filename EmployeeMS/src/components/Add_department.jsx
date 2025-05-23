import axios from 'axios'
import React, { useState } from 'react';
import './Add_department.css'
import { useNavigate } from 'react-router-dom';

const Add_department = () => {
  const [department, setDepartment] = useState()
    const navigate=useNavigate()

    const handleSubmit = (e) =>{
        e.preventDefault()
        axios.post('http://localhost:3000/auth/add_department',{department})
        .then(result => {
            if(result.data.Status)
            {
                navigate('/dashboard/department')
            }
            else
            {
                alert(result.data.Error)
            }
        })
        .catch(err => console.log(err))
    }


  return (
    <div className="d-flex justify-content-center align-items-center h-75">
      <div className="p-4 rounded w-50 form-container">
        <h2 className="text-center text-white mb-4">Add Department</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="department" className="form-label text-white">
              <strong>Department:</strong>
            </label>
            <input
              type="text"
              name="department"
              placeholder="Enter Department"
              onChange={(e) => setDepartment(e.target.value)}
              className="form-control rounded-0"
            />
          </div>
          <button className="btn btn-purple w-100 rounded-0">
            Add Department
          </button>
        </form>
      </div>
    </div>
  );
};

export default Add_department;
