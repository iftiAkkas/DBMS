import express from 'express'
import con from '../utils/db.js'
import jwt from "jsonwebtoken"
import bcrypt from 'bcrypt'
import multer from 'multer'
import path  from 'path'

const router= express.Router()

router.post('/adminLogin',(req,res) => {
    
    const sql = "SELECT * from admin Where email = ? and password = ?";
  con.query(sql, [req.body.email, req.body.password], (err, result) => {
    if (err) return res.json({ loginStatus: false, Error: "Query error" });
    if (result.length > 0) {
      const email = result[0].email;
      const token = jwt.sign(
        { role: "admin", email: email, id: result[0].id },
        "jwt_secret_key",
        { expiresIn: "1d" }
      );
      res.cookie('token', token)
      return res.json({ loginStatus: true });
    } else {
        return res.json({ loginStatus: false, Error:"wrong email or password" });
    }
  });

});


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
      cb(null, 'Public/Images')
  },
  filename: (req, file, cb) => {
      cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname))
  }
})
const upload = multer({
  storage: storage
})


router.get('/department',(req,res) => {
  const sql="SELECT * FROM department";
  con.query(sql,(err,result)=>{
    if (err) return res.json({ Status: false, Error: "Query Error" });
    return res.json({ Status: true, Result: result })
  })
})

router.post('/add_department', (req, res) => {
  const { department } = req.body;

  // Check if the department already exists (case-insensitive)
  const checkSql = "SELECT * FROM department WHERE LOWER(name) = LOWER(?)";
  con.query(checkSql, [department], (err, result) => {
    if (err) return res.json({ Status: false, Error: "Query Error" });

    if (result.length > 0) {
      // Department already exists
      return res.json({ Status: false, Error: "Department already exists" });
    }

    // Insert the new department
    const insertSql = "INSERT INTO department (`name`) VALUES (?)";
    con.query(insertSql, [department], (err, result) => {
      if (err) return res.json({ Status: false, Error: "Insert Error" });
      return res.json({ Status: true, Message: "Department added successfully" });
    });
  });
});

router.post('/add_employee',upload.single('image'),(req, res) => {
  const sql = `INSERT INTO employee 
  (first_name,last_name,email,password,phone,join_date,dob,salary, address,image, department_id) 
  VALUES (?)`;
  bcrypt.hash(req.body.password, 10, (err, hash) => {
      if(err) return res.json({Status: false, Error: "Query Error"})
      const values = [
          req.body.first_name,
          req.body.last_name,
          req.body.email,
          hash,
          req.body.phone,
          req.body.join_date,
          req.body.dob,
          req.body.salary, 
          req.body.address,
          req.file.filename,
          req.body.department_id
      ]
      con.query(sql, [values], (err, result) => {
          if(err) return res.json({Status: false, Error: err})
          return res.json({Status: true})
      })
  })
})

router.get('/employee', (req, res) => {
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
  `;
  con.query(sql, (err, result) => {
    if (err) return res.json({ Status: false, Error: "Query Error" });
    return res.json({ Status: true, Result: result });
  });
});

router.get('/employee/:id',(req,res)=>{
  const id=req.params.id;
  const sql="SELECT *FROM employee where id = ?";
  con.query(sql,[id],(err,result)=>{
      if(err) return res.json({Status: false, Error: "Query Error"})
      return res.json({Status: true, Result: result})
  })
})

router.put('/edit_employee/:id', upload.single('image'), (req, res) => {
  const id = req.params.id;

  const sql = `
        UPDATE employee
        SET 
            first_name = ?, 
            last_name = ?, 
            email = ?, 
            password = ?, 
            phone = ?, 
            join_date = ?, 
            salary = ?, 
            address = ?, 
            department_id = ?
        WHERE id = ?`;

  const values = [
    req.body.first_name,
    req.body.last_name,
    req.body.email,
    req.body.password, // Ensure proper hashing if storing plain passwords
    req.body.phone,
    req.body.join_date,
    req.body.salary,
    req.body.address,
    req.body.department_id,
    id, // Add the ID as the last parameter
  ];

  con.query(sql, values, (err, result) => {
    if (err) {
      return res.json({ Status: false, Error: 'Query Error: ' + err });
    }
    return res.json({ Status: true, Result: result });
  });
});

router.delete('/delete_employee/:id', (req, res) => {
  const id = req.params.id;
  const sql = "delete from employee where id = ?"
  con.query(sql,[id], (err, result) => {
      if(err) return res.json({Status: false, Error: "Query Error"+err})
      return res.json({Status: true, Result: result})
  })
})

router.get('/admin_count', (req, res) => {
  const sql = "select count(id) as admin from admin";
  con.query(sql, (err, result) => {
      if(err) return res.json({Status: false, Error: "Query Error"+err})
      return res.json({Status: true, Result: result})
  })
})

router.get('/employee_count', (req, res) => {
  const sql = "select count(id) as employee from employee";
  con.query(sql, (err, result) => {
      if(err) return res.json({Status: false, Error: "Query Error"+err})
      return res.json({Status: true, Result: result})
  })
})

router.get('/admin_records', (req, res) => {
  const sql = "select * from admin"
  con.query(sql, (err, result) => {
      if(err) return res.json({Status: false, Error: "Query Error"+err})
      return res.json({Status: true, Result: result})
  })
})


router.get('/logout', (req, res) => {
  res.clearCookie('token')
  return res.json({Status: true})
})


// Approve or Reject Leave Request
  router.post('/approve-reject-leave', (req, res) => {
    const { leave_request_id, status } = req.body; // status can be 'Approved' or 'Rejected'
    
    // Ensure status is either 'Approved' or 'Rejected'
    if (status !== 'Approved' && status !== 'Rejected') {
      return res.status(400).json({ Status: false, Error: 'Invalid status value' });
    }
  
    const sql = "UPDATE leave_requests SET status = ?, updated_at = NOW() WHERE id = ?";
    
    con.query(sql, [status, leave_request_id], (err, result) => {
      if (err) {
        console.error("Error in SQL query: ", err);
        return res.status(500).json({ Status: false, Error: "Failed to update leave request status" });
      }
  
      if (result.affectedRows === 0) {
        return res.status(404).json({ Status: false, Error: "Leave request not found" });
      }
  
      return res.json({ Status: true, Message: `Leave request ${status} successfully` });
    });
  });
  
  
  // Get all pending leave requests
  router.get('/leave-requests/pending', (req, res) => {
    const sql = `
      SELECT 
        leave_requests.id,
        leave_requests.employee_id,
        leave_requests.start_date,
        leave_requests.end_date,
        leave_requests.reason,
        leave_requests.status,
        employee.first_name,
        employee.last_name,
        department.name
      FROM 
        leave_requests
      JOIN 
        employee
      ON 
        leave_requests.employee_id = employee.id
      JOIN 
        department
      ON 
        employee.department_id = department.id
      WHERE 
        leave_requests.status = 'Pending'
      ORDER BY 
        leave_requests.created_at DESC
    `;
    
    con.query(sql, (err, result) => {
        if (err) {
            console.error("Error in SQL query: ", err);
            return res.status(500).json({ Status: false, Error: "Failed to fetch pending leave requests" });
        }
        return res.json({ Status: true, Result: result });
    });
});


router.get('/search_employee', (req, res) => {
  const { query, department_name } = req.query;

  let sql = `
    SELECT 
      e.id, e.first_name, e.last_name, e.salary, e.email, e.phone, e.join_date, e.DOB, e.address, e.image, d.name AS department_name 
    FROM 
      employee e
    LEFT JOIN 
      department d 
    ON 
      e.department_id = d.id
    WHERE 
      (e.first_name LIKE ? OR e.last_name LIKE ? OR e.id LIKE ?)
  `;

  const params = [`%${query}%`, `%${query}%`, `%${query}%`];
  if (department_name) {
    sql += ` AND d.name LIKE ?`;
    params.push(`%${department_name}%`);
  }

  con.query(sql, params, (err, result) => {
    if (err) {
      return res.json({ Status: false, Error: "Query Error" });
    }
    return res.json({ Status: true, Result: result });
  });
});

router.post('/update_payroll', (req, res) => {
  const { employee_id, basic_salary, bonus, deductions, total_salary } = req.body;

  // Ensure no NULL values are passed to the database
  const safeBasicSalary = basic_salary || 0;
  const safeBonus = bonus || 0;
  const safeDeductions = deductions || 0;
  const safeTotalSalary = total_salary || 0;

  const sql = `
    UPDATE payroll 
    SET basic_salary = ?, bonus = ?, deductions = ?, total_salary = ?
    WHERE employee_id = ?
  `;

  con.query(
    sql,
    [safeBasicSalary, safeBonus, safeDeductions, safeTotalSalary, employee_id],
    (err, result) => {
      if (err) return res.json({ Status: false, Error: "Update Error" });
      return res.json({ Status: true, Message: "Payroll updated successfully!" });
    }
  );
});

router.post('/apply_bonus_deductions', (req, res) => {
  const { bonus, deductions, department_id } = req.body;

  let sql;
  let params;

  if (department_id) {
    // Apply to a specific department
    sql = `
      UPDATE payroll 
      INNER JOIN employee ON payroll.employee_id = employee.id
      SET payroll.bonus = ?, 
          payroll.deductions = ?, 
          payroll.total_salary = IFNULL(payroll.basic_salary, 0) + IFNULL(?, 0) - IFNULL(?, 0)
      WHERE employee.department_id = ?
    `;
    params = [bonus || 0, deductions || 0, bonus || 0, deductions || 0, department_id];
  } else {
    // Apply to all employees
    sql = `
      UPDATE payroll 
      SET bonus = ?, 
          deductions = ?, 
          total_salary = IFNULL(basic_salary, 0) + IFNULL(?, 0) - IFNULL(?, 0)
    `;
    params = [bonus || 0, deductions || 0, bonus || 0, deductions || 0];
  }

  con.query(sql, params, (err, result) => {
    if (err) return res.json({ Status: false, Error: "Query Error" });
    return res.json({ Status: true, Message: "Bonus and deductions applied successfully and total salary recalculated!" });
  });
});

export {router as adminRouter}