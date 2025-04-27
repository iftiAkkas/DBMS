import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Payroll.css'; // Import custom CSS file

const Payroll = () => {
  const [departments, setDepartments] = useState([]); // List of departments
  const [selectedDepartment, setSelectedDepartment] = useState(''); // Selected department
  const [query, setQuery] = useState(''); // Search query for employee name or ID
  const [suggestions, setSuggestions] = useState([]); // Employee suggestions
  const [selectedEmployee, setSelectedEmployee] = useState(null); // Selected employee
  const [payroll, setPayroll] = useState({
    base_salary: '',
    bonus: 0,
    deductions: 0,
    total_payment: 0,
  });
  const [globalBonusDeduction, setGlobalBonusDeduction] = useState({
    type: 'bonus', // 'bonus' or 'deductions'
    amount: 0,
    department_id: '', // Empty for all employees
  });

  // Fetch departments on component load
  useEffect(() => {
    axios
      .get('http://localhost:3000/auth/department')
      .then((result) => {
        if (result.data.Status) {
          setDepartments(result.data.Result);
        } else {
          alert(result.data.Error);
        }
      })
      .catch((err) => console.log(err));
  }, []);

  // Fetch employee suggestions based on query and selected department
  const handleSearch = () => {
    if (query.length > 0) {
      setSelectedEmployee(null); // Reset selected employee and hide the form

      axios
        .get(
          `http://localhost:3000/auth/search_employee?query=${query}&department_id=${selectedDepartment}`
        )
        .then((result) => {
          if (result.data.Status) {
            setSuggestions(result.data.Result);
          } else {
            setSuggestions([]);
          }
        })
        .catch((err) => console.log(err));
    } else {
      setSuggestions([]);
    }
  };

  // Select an employee and load their payroll details
  const handleSelectEmployee = (employee) => {
    setSelectedEmployee(employee);
    setPayroll({
      base_salary: employee.salary,
      bonus: employee.bonus || 0,
      deductions: employee.deductions || 0,
      total_payment: employee.salary + (employee.bonus || 0) - (employee.deductions || 0),
    });
    setSuggestions([]); // Clear suggestions
    setQuery(`${employee.first_name} ${employee.last_name}`); // Set query to selected employee's name
  };

  // Update payroll details
  const handlePayrollChange = (field, value) => {
    const updatedPayroll = { ...payroll, [field]: value };
    updatedPayroll.total_payment =
      parseFloat(updatedPayroll.base_salary || 0) +
      parseFloat(updatedPayroll.bonus || 0) -
      parseFloat(updatedPayroll.deductions || 0);
    setPayroll(updatedPayroll);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payrollData = {
      employee_id: selectedEmployee.id,
      basic_salary: payroll.base_salary, // Overwrite basic salary
      bonus: payroll.bonus, // Overwrite bonus
      deductions: payroll.deductions, // Overwrite deductions
      total_salary: payroll.total_payment, // Recalculate total salary
    };
  
    axios
      .post('http://localhost:3000/auth/update_payroll', payrollData) // Use an update-specific endpoint
      .then((result) => {
        if (result.data.Status) {
          alert(result.data.Message);
        } else {
          alert(result.data.Error);
        }
      })
      .catch((err) => console.log(err));
  };

  const handleGlobalBonusDeduction = (type) => {
    const payload = {
      type: type, // 'bonus' or 'deductions'
      amount: type === 'bonus' ? globalBonusDeduction.bonusAmount : globalBonusDeduction.deductionAmount,
      department_id: globalBonusDeduction.department_id, // Optional department filter
    };
  
    axios
      .post('http://localhost:3000/auth/apply_bonus_deductions', payload)
      .then((result) => {
        if (result.data.Status) {
          alert(result.data.Message);
        } else {
          alert(result.data.Error);
        }
      })
      .catch((err) => console.log(err));
  };

  const handleApplyBonusAndDeductions = () => {
    const payload = {
      bonus: globalBonusDeduction.bonusAmount || 0,
      deductions: globalBonusDeduction.deductionAmount || 0,
      department_id: globalBonusDeduction.department_id, // Optional department filter
    };
  
    axios
      .post('http://localhost:3000/auth/apply_bonus_deductions', payload)
      .then((result) => {
        if (result.data.Status) {
          alert(result.data.Message);
        } else {
          alert(result.data.Error);
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="container mt-4 payroll-container">
      <h3 className="text-center mb-4 payroll-title">Payroll Management</h3>

      <div className="mb-4">
  <h5>Apply Bonus and Deductions</h5>
  <div className="row">
    <div className="col-md-6">
      <label htmlFor="bonus_amount" className="form-label">
        Bonus Amount
      </label>
      <input
        type="number"
        id="bonus_amount"
        className="form-control"
        value={globalBonusDeduction.bonusAmount || 0}
        onChange={(e) =>
          setGlobalBonusDeduction({
            ...globalBonusDeduction,
            bonusAmount: parseFloat(e.target.value),
          })
        }
      />
    </div>
    <div className="col-md-6">
      <label htmlFor="deduction_amount" className="form-label">
        Deduction Amount
      </label>
      <input
        type="number"
        id="deduction_amount"
        className="form-control"
        value={globalBonusDeduction.deductionAmount || 0}
        onChange={(e) =>
          setGlobalBonusDeduction({
            ...globalBonusDeduction,
            deductionAmount: parseFloat(e.target.value),
          })
        }
      />
    </div>
  </div>
  <div className="mt-3">
    <label htmlFor="department_id" className="form-label">
      Department (Optional)
    </label>
    <select
      id="department_id"
      className="form-select"
      value={globalBonusDeduction.department_id}
      onChange={(e) =>
        setGlobalBonusDeduction({ ...globalBonusDeduction, department_id: e.target.value })
      }
    >
      <option value="">All Departments</option>
      {departments.map((department) => (
        <option key={department.id} value={department.id}>
          {department.name}
        </option>
      ))}
    </select>
  </div>
  <button
    className="btn btn-primary mt-3"
    onClick={handleApplyBonusAndDeductions}
  >
    Apply
  </button>
</div>


      {/* Search Employee */}
      <div className="mb-4">
        <label htmlFor="employee_search" className="form-label">
          Search Employee by Name or ID
        </label>
        <div className="input-group shadow-sm">
          <input
            type="text"
            id="employee_search"
            className="form-control"
            placeholder="Enter name or ID"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button className="btn btn-primary" onClick={handleSearch}>
            Search
          </button>
        </div>
        {/* Suggestions */}
        {suggestions.length > 0 && (
          <ul className="list-group mt-2 shadow-sm">
            {suggestions.map((employee) => (
              <li
                key={employee.id}
                className="list-group-item suggestion-item"
                onClick={() => handleSelectEmployee(employee)}
                style={{ cursor: 'pointer' }}
              >
                {employee.id} - {employee.first_name} {employee.last_name} - {employee.department_name}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Payroll Form */}
      {selectedEmployee && (
        <div className="mt-4 payroll-form">
          <h4 className="mb-4">
            Payroll for {selectedEmployee.first_name} {selectedEmployee.last_name}
          </h4>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="base_salary" className="form-label">
                Base Salary
              </label>
              <input
                type="number"
                className="form-control shadow-sm"
                id="base_salary"
                value={payroll.base_salary}
                readOnly
              />
            </div>
            <div className="mb-3">
              <label htmlFor="bonus" className="form-label">
                Bonus
              </label>
              <input
                type="number"
                className="form-control shadow-sm"
                id="bonus"
                value={payroll.bonus}
                onChange={(e) => handlePayrollChange('bonus', e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="deductions" className="form-label">
                Deductions
              </label>
              <input
                type="number"
                className="form-control shadow-sm"
                id="deductions"
                value={payroll.deductions}
                onChange={(e) => handlePayrollChange('deductions', e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="total_payment" className="form-label">
                Total Payment
              </label>
              <input
                type="number"
                className="form-control shadow-sm"
                id="total_payment"
                value={payroll.total_payment}
                readOnly
              />
            </div>
            <button type="submit" className="btn btn-success shadow-sm">
              Update Payroll
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Payroll;