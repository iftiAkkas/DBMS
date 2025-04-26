import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const Leave_Request = () => {
  const { id } = useParams(); // Get the employee ID from the route parameter
  const [leaveRequests, setLeaveRequests] = useState([]); // State for storing leave requests
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');

  // Fetch all leave requests from the database for the employee
  useEffect(() => {
    axios
      .get(`http://localhost:3000/employee/leave-requests/${id}`)
      .then((res) => {
        if (res.data.Status) {
          setLeaveRequests(res.data.Result); // Update state with all leave requests
        } else {
          alert(res.data.Error); // Handle errors
        }
      })
      .catch((err) => console.error(err));
  }, [id]);

  // Format date to a readable format
  const formatDate = (isoDate) => {
    if (!isoDate) return 'Not Available';
    const date = new Date(isoDate);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Handle leave request form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    const newLeaveRequest = {
      employee_id: id,
      start_date: startDate,
      end_date: endDate,
      reason,
    };

    axios
      .post('http://localhost:3000/employee/leave-request', newLeaveRequest)
      .then((res) => {
        if (res.data.Status) {
          alert(res.data.Message);
          // Re-fetch the leave requests after submission
          axios
            .get(`http://localhost:3000/employee/leave-requests/${id}`)
            .then((res) => {
              if (res.data.Status) {
                setLeaveRequests(res.data.Result); // Update state with all leave requests
              } else {
                alert(res.data.Error);
              }
            })
            .catch((err) => console.error(err));
          setStartDate('');
          setEndDate('');
          setReason('');
        } else {
          alert(res.data.Error);
        }
      })
      .catch((err) => console.error(err));
  };

  return (
    <div className="container-fluid">
      <div className="row flex-nowrap">

        {/* Sidebar */}
        

        {/* Main Content */}
        <div className="col p-4">
          <div className="row">

            {/* Leave Request Form */}
            <div className="col-md-6">
              <div className="p-4 rounded form-container">
                <h2 className="text-center text-white mb-4">Leave Request Form</h2>
                <form onSubmit={handleSubmit}>
                  {/* Start Date */}
                  <div className="col-12 mb-3">
                    <label htmlFor="startDate" className="form-label text-white">
                      Start Date
                    </label>
                    <input
                      type="date"
                      id="startDate"
                      className="form-control rounded-0"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      required
                    />
                  </div>
                  {/* End Date */}
                  <div className="col-12 mb-3">
                    <label htmlFor="endDate" className="form-label text-white">
                      End Date
                    </label>
                    <input
                      type="date"
                      id="endDate"
                      className="form-control rounded-0"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      required
                    />
                  </div>
                  {/* Reason */}
                  <div className="col-12 mb-3">
                    <label htmlFor="reason" className="form-label text-white">
                      Reason
                    </label>
                    <textarea
                      id="reason"
                      className="form-control rounded-0"
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      rows="3"
                      required
                    />
                  </div>
                  {/* Submit Button */}
                  <div className="col-12">
                    <button type="submit" className="btn btn-purple w-100 rounded-0">
                      Submit Leave Request
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* Leave Request History */}
            <div className="col-md-6 mt-4 mt-md-0">
              <div className="p-4 rounded form-container">
                <h2 className="text-center text-white mb-4">Leave Request History</h2>
                <table className="table table-bordered text-white">
                  <thead>
                    <tr>
                      <th>Start Date</th>
                      <th>End Date</th>
                      <th>Reason</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leaveRequests.length > 0 ? (
                      leaveRequests.map((request, index) => (
                        <tr key={index}>
                          <td>{formatDate(request.start_date)}</td>
                          <td>{formatDate(request.end_date)}</td>
                          <td>{request.reason}</td>
                          <td>{request.status}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" className="text-center">
                          No leave requests found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default Leave_Request;
