import React,{useEffect,useState} from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'


const Edit_Employee = () => {

    const {id}= useParams()
    const [employee, setEmployee] = useState({
        first_name: "",
        last_name: "",
        email: "",
        password: "",
        phone: "",
        join_date: "",
        dob: "",
        salary: "",
        address: "",
        department_id: "",
        image: "",
      });

      const [department, setDepartment] = useState([]);
      const navigate=useNavigate()

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

          axios.get('http://localhost:3000/auth/employee/'+id)
          .then(result => {
            if (result.data.Status) {
              const empData = result.data.Result[0];
              setEmployee({
                ...employee,
                first_name: empData.first_name,
                last_name: empData.last_name,
                email: empData.email,
                password: '', // Do not prefill the password for security
                phone: empData.phone,
                join_date: empData.join_date,
                dob: empData.dob,
                salary: empData.salary,
                address: empData.address,
                department_id: empData.department_id,
                image: empData.image,
              });
            } else {
              alert(result.data.Error);
            }
          }).catch(err => console.log(err))
      }, []);

      const handleSubmit = (e) => {
        e.preventDefault()
        axios.put('http://localhost:3000/auth/edit_employee/'+id, employee)
        .then(result => {
            if(result.data.Status) {
                navigate('/dashboard/employee')
            } else {
                alert(result.data.Error)
            }
        }).catch(err => console.log(err))
    }

  return (
    <div className="d-flex justify-content-center align-items-center h-100">
      <div className="p-4 rounded w-50 form-container">
        <h2 className="text-center text-white mb-4">Edit Employee</h2>
        <form className="row g-3" onSubmit={handleSubmit}>
          {/* First Name */}
          <div className="col-6">
            <label htmlFor="inputFirstName" className="form-label text-white">
              First Name
            </label>
            <input
              type="text"
              className="form-control rounded-0"
              id="inputFirstName"
              placeholder="Enter First Name"
              value={employee.first_name}
              onChange={(e) =>
                setEmployee({ ...employee, first_name: e.target.value })
              }
            />
          </div>
          {/* Last Name */}
          <div className="col-6">
            <label htmlFor="inputLastName" className="form-label text-white">
              Last Name
            </label>
            <input
              type="text"
              className="form-control rounded-0"
              id="inputLastName"
              placeholder="Enter Last Name"
              value={employee.last_name}
              onChange={(e) =>
                setEmployee({ ...employee, last_name: e.target.value })
              }
            />
          </div>
          {/* Email */}
          <div className="col-12">
            <label htmlFor="inputEmail" className="form-label text-white">
              Email
            </label>
            <input
              type="email"
              className="form-control rounded-0"
              id="inputEmail"
              placeholder="Enter Email"
              value={employee.email}
              onChange={(e) =>
                setEmployee({ ...employee, email: e.target.value })
              }
            />
          </div>
          {/* Password */}
          {/* <div className="col-12">
            <label htmlFor="inputPassword" className="form-label text-white">
              Password
            </label>
            <input
              type="password"
              className="form-control rounded-0"
              id="inputPassword"
              placeholder="Enter Password"
              onChange={(e) =>
                setEmployee({ ...employee, password: e.target.value })
              }
            />
          </div> */}
          {/* Phone */}
          <div className="col-12">
            <label htmlFor="inputPhone" className="form-label text-white">
              Phone Number
            </label>
            <input
              type="text"
              className="form-control rounded-0"
              id="inputPhone"
              placeholder="Enter Phone Number"
              value={employee.phone}
              onChange={(e) =>
                setEmployee({ ...employee, phone: e.target.value })
              }
            />
          </div>
          {/* Join Date */}
          {/* <div className="col-6">
            <label htmlFor="inputJoinDate" className="form-label text-white">
              Join Date
            </label>
            <input
              type="date"
              className="form-control rounded-0"
              id="inputJoinDate"
              onChange={(e) =>
                setEmployee({ ...employee, join_date: e.target.value })
              }
            />
          </div> */}
          {/* DOB */}
          {/* <div className="col-6">
            <label htmlFor="inputDOB" className="form-label text-white">
              Date of Birth
            </label>
            <input
              type="date"
              className="form-control rounded-0"
              id="inputDOB"
              onChange={(e) =>
                setEmployee({ ...employee, dob: e.target.value })
              }
            />
          </div> */}
          {/* Salary */}
          <div className="col-12">
            <label htmlFor="inputSalary" className="form-label text-white">
              Salary
            </label>
            <input
              type="text"
              className="form-control rounded-0"
              id="inputSalary"
              placeholder="Enter Salary"
              value={employee.salary}
              onChange={(e) =>
                setEmployee({ ...employee, salary: e.target.value })
              }
            />
          </div>
          {/* Address */}
          <div className="col-12">
            <label htmlFor="inputAddress" className="form-label text-white">
              Address
            </label>
            <input
              type="text"
              className="form-control rounded-0"
              id="inputAddress"
              placeholder="Enter Address"
              value={employee.address}
              onChange={(e) =>
                setEmployee({ ...employee, address: e.target.value })
              }
            />
          </div>
          {/* Department */}
          <div className="col-12">
            <label htmlFor="category" className="form-label text-white">
              Department
            </label>
            <select
              name="category"
              id="category"
              className="form-select rounded-0"
              value={employee.department_id}
              onChange={(e) =>
                setEmployee({ ...employee, department_id: e.target.value })
              }
            >
              <option value="">Select Department</option>
              {department.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          {/* Image */}
          {/* <div className="col-12">
            <label htmlFor="inputGroupFile01" className="form-label text-white">
              Select Image
            </label>
            <input
              type="file"
              className="form-control rounded-0"
              id="inputGroupFile01"
              onChange={(e) =>
                setEmployee({ ...employee, image: e.target.files[0] })
              }
            />
          </div> */}
          {/* Submit Button */}
          <div className="col-12">
            <button type="submit" className="btn btn-purple w-100 rounded-0">
              Edit Employee
            </button>
          </div>
        </form>
      </div>
    </div>

  )
}

export default Edit_Employee
