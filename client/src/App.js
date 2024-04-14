import "./App.css";
import Signin from "../src/page/Signin";
import Dashboard from "./page/Dashboard.js";
import Navbar from "./page/Navbar";
import Signup from "./page/Signup";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import PrivateRoute from "./Utils/PrivateRoute.js";
import DnsManager from "./page/DnsManager.js";
import SingleDns from "./components/dns/SingleDns.js";
import MultipleDns from "./components/dns/MultipleDns.js";
import SingleDomain from "./components/Domain/SingleDomain.js";
import MultipleDomain from "./components/Domain/MultipleDomain.js";
import Chart from "./page/Chart.js";

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>

        <Route element={<PrivateRoute />}>

          <Route path="/" element={<Dashboard />} />
          <Route path="/SingleDomain" element={<SingleDomain/>} />
          <Route path="/MultipleDomain" element={<MultipleDomain/>} />
          <Route path="/chart" element={<Chart/>} />


          <Route path="/dns/:name/:hostid" element={<DnsManager />} />
          <Route path="/SingleDns/:name/:hostid" element={<SingleDns />} />
          <Route path="/MultipleDns/:name/:hostid" element={<MultipleDns/>} />


          </Route>
          

          <Route path="/login" element={<Signin />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
