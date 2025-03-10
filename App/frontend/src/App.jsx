import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import NavHeader from "./components/navbar/NavHeader";
import SpeciesPage from "./pages/SpeciesPage";
import TraitsPage from "./pages/TraitsPage";

function App() {
  return (
    <>
      <NavHeader />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/species" element={<SpeciesPage />} />
        <Route path="/Traits" element={<TraitsPage />} />
      </Routes>
    </>
  );
}

export default App;
