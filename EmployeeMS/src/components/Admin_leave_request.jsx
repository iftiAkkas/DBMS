import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Admin_leave_request = () => {

    const [leaveRequests, setLeaveRequests] = useState([]);

  useEffect(() => {
    // Fetch all leave requests (or filter them based on pending status)
    axios
      .get('http://localhost:3000/auth/leave-requests/pending')  // You could create an endpoint to get only pending requests
      .then((res) => {
        setLeaveRequests(res.data.Result);
      })
      .catch((err) => {
        console.error("Error fetching leave requests: ", err);
      });
  }, []);

  // Handle approving or rejecting a leave request
  const handleApproval = (leaveRequestId, status) => {
    const data = { leave_request_id: leaveRequestId, status };

    axios
      .post('http://localhost:3000/auth/approve-reject-leave', data)
      .then((res) => {
        if (res.data.Status) {
          // Update the local state to reflect the approval/rejection
          setLeaveRequests((prevRequests) =>
            prevRequests.filter((request) => request.id !== leaveRequestId)
          );
          alert(res.data.Message);
        } else {
          alert(res.data.Error);
        }
      })
      .catch((err) => {
        console.error("Error updating leave request status: ", err);
      });
  };

  return (
   
    <div className="container">
      <h3>Pending Leave Requests</h3>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Employee Name</th>
            <th>Employee ID</th>
            <th>Department</th>
            <th>Start Date</th>
            <th>End Date</th>
            <th>Reason</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {leaveRequests.map((request) => (
            <tr key={request.id}>
              <td>{`${request.first_name} ${request.last_name}`}</td>
              <td>{request.employee_id}</td>
              <td>{request.name}</td>
                <td>{new Date(request.start_date).toLocaleDateString()}</td>
                <td>{new Date(request.end_date).toLocaleDateString()}</td>
                <td>{request.reason}</td>
                <td>{request.status}</td>
              <td>
                <button
                  className="btn btn-success"
                  onClick={() => handleApproval(request.id, 'Approved')}
                >
                  Approve
                </button>
                <button
                  className="btn btn-danger"
                  onClick={() => handleApproval(request.id, 'Rejected')}
                >
                  Reject
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

}

export default Admin_leave_request