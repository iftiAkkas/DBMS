import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import Login from './components/login'
import {BrowserRouter , Routes, Route, useNavigate} from 'react-router-dom'
import Dashboard from './components/Dashboard'
import Home from './components/Home'
import Employee from './components/Employee'
import Department from './components/Department'
import Profile from './components/Profile'
import Add_department from './components/Add_department'
import Add_Employee from './components/Add_Employee'
import Edit_Employee from './components/Edit_Employee'
import Start from './components/start'
import Employee_Login from './components/Employee_Login'
import EmployeeDetails from './components/EmployeeDetails'
import PrivateRoute from './components/PrivateRoute'
import Leave_Request from './components/Leave_Request'
import Admin_leave_request from './components/Admin_leave_request'
import Employee_Panel from './components/Employee_Panel'

function App() {
  
  return (
    <BrowserRouter>

    <Routes>
        <Route path='/' element={<Start/>}></Route>
        <Route path='/employee_login' element={<Employee_Login/>}></Route>
        <Route path='/adminlogin' element={<Login/>}></Route>

        <Route path="/employee/:id" element={<Employee_Panel />}>
          <Route path='' element={<EmployeeDetails/>}/>
          <Route path="details/:id" element={<EmployeeDetails />} />
          <Route path="leave-requests/:id" element={<Leave_Request />} />
        </Route>


          <Route path='/dashboard' element={
            
            <PrivateRoute>
              <Dashboard/>
            </PrivateRoute>
            
            }>
          <Route path='' element={<Home/>}></Route>
          <Route path='/dashboard/employee' element={<Employee/>}></Route>
          <Route path='/dashboard/leave-requests' element={<Admin_leave_request/>}></Route>
          <Route path='/dashboard/department' element={<Department/>}></Route>
          <Route path='/dashboard/profile' element={<Profile/>}></Route>
          <Route path='/dashboard/add_department' element={<Add_department/>}></Route>
          <Route path='/dashboard/add_employee' element={<Add_Employee/>}></Route>
          <Route path='/dashboard/edit_employee/:id'element={<Edit_Employee/>}></Route>
      </Route>
    </Routes>

    </BrowserRouter>
  )
}

export default App
