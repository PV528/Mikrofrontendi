import React, { lazy } from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import "./app.css";

const Home = lazy(() => import("./home"));
const Car = lazy(() => import("CarMicroFrontend/carLogic"));
const Rental = lazy(() => import("RentalMicroFrontend/rentalLogic"));
const User = lazy(() => import("UserMicroFrontend/userLogic"));

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <nav>
          <ul>
            <li>
              <Link to="/">Domov</Link>
            </li>
            <li>
              <Link to="/Avtomobili">Avtomobili</Link>
            </li>
            <li>
              <Link to="/Najemi">Najemi</Link>
            </li>
            <li>
              <Link to="/Uporabniki">Uporabniki</Link>
            </li>
          </ul>
        </nav>
        <React.Suspense fallback={<div>Loading</div>}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/Avtomobili" element={<Car />} />
            <Route path="/Najemi" element={<Rental />} />
            <Route path="/Uporabniki" element={<User />} />
          </Routes>
        </React.Suspense>
      </BrowserRouter>
    </div>
  );
}

export default App;
