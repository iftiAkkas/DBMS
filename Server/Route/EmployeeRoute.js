import express from 'express'
import con from "../utils/db.js";
import jwt from "jsonwebtoken";
import bcrypt from 'bcrypt';

const router = express.Router();

router.post("/employee_login", (req, res) => {
    const sql = "SELECT * FROM employee WHERE email = ?";
    con.query(sql, [req.body.email], (err, result) => {
        if (err) return res.json({ loginStatus: false, Error: "Query error" });
        if (result.length > 0) {
            bcrypt.compare(req.body.password, result[0].password, (err, response) => {
                if (err) return res.json({ loginStatus: false, Error: "Password comparison error" });
                if (response) {
                    const email = result[0].email;
                    const token = jwt.sign(
                        { role: "employee", email: email, id: result[0].id },
                        "jwt_secret_key",
                        { expiresIn: "1d" }
                    );
                    res.cookie('token', token);
                    return res.json({ loginStatus: true, id: result[0].id });
                } else {
                    // Handle wrong password case
                    return res.json({ loginStatus: false, Error: "Wrong email or password" });
                }
            });
        } else {
            // Handle no matching email case
            return res.json({ loginStatus: false, Error: "Wrong email or password" });
        }
    });
});


router.get('/details/:id', (req, res) => {
    const id = req.params.id;
    const sql = `
        SELECT 
            e.*, 
            d.name AS department_name 
        FROM 
            employee e
        LEFT JOIN 
            department d 
        ON 
            e.department_id = d.id
        WHERE 
            e.id = ?
    `;
    con.query(sql, [id], (err, result) => {
        if (err) return res.json({ Status: false, Error: "Query Error" });
        return res.json(result);
    });
});

  router.get('/logout', (req, res) => {
    res.clearCookie('token')
    return res.json({Status: true})
  })


  router.post('/leave-request', (req, res) => {
    const { employee_id, start_date, end_date, reason } = req.body;
    const sql = `
        INSERT INTO leave_requests (employee_id, start_date, end_date, reason, status, created_at, updated_at) 
        VALUES (?, ?, ?, ?, 'Pending', NOW(), NOW())
    `;
    con.query(sql, [employee_id, start_date, end_date, reason], (err, result) => {
        if (err) return res.json({ Status: false, Error: "Failed to submit leave request" });
        return res.json({ Status: true, Message: "Leave request submitted successfully" });
    });
});

router.get('/leave-requests/:employee_id', (req, res) => {
    const employee_id = req.params.employee_id;
    console.log("Fetching leave requests for Employee ID: ", employee_id);
  
    const sql = "SELECT * FROM leave_requests WHERE employee_id = ? ORDER BY created_at DESC";
    con.query(sql, [employee_id], (err, result) => {
      if (err) {
        console.error("Error in SQL query: ", err);
        return res.status(500).json({ Status: false, Error: "Failed to fetch leave requests", Details: err });
      }
      if (result.length === 0) {
        return res.json({ Status: false, Error: "No leave requests found for this employee" });
      }
      return res.json({ Status: true, Result: result });
    });
  });
  


export { router as EmployeeRouter };
