import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./components/home/Home";
import Login from "./components/login/Login";
import Appheader from "./components/navbar/Navbar";
import CustomTable from "./components/customTable/CustomTable";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Appheader />
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/login" element={<Login />}></Route>
          <Route path="/table" element={<CustomTable />}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
