// App.js
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './Components/Nav';
import Home from './Components/Home';
import EmployeeTable from './Components/EmployeeTable';
import Login from './Components/Login';
import PrivateRoute from './DataBaseConfig/PrivateRoute';

const MasterHome = () => {
  return (
    <>
      <Navbar />
      <Home />
    </>
  );
};


const MasterEmployee = () => {
  return (
    <>
      <Navbar />
      <EmployeeTable />
    </>
  );
};
const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/home"
          element={
            <PrivateRoute>
              <MasterHome />
            </PrivateRoute>
          }
        />
        <Route
          path="/employee"
          element={
            <PrivateRoute>
              <MasterEmployee />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
