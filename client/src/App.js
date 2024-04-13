import "./App.css";
import Signin from "../src/page/Signin";
import Dashboard from "./page/Dashboard.js";
import Navbar from "./page/Navbar";
import Signup from "./page/Signup";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import PrivateRoute from "./Utils/PrivateRoute.js";
import DnsManager from "./page/DnsManager.js";
import SingleDns from "./components/dns/SingleDns.js";

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/dns/:name/:hostid" element={<DnsManager />} />
          <Route path="/login" element={<Signin />} />
          <Route path="/singleDns" element={<SingleDns />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
