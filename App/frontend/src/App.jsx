import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import NavHeader from "./components/navbar/NavHeader";
import SpeciesPage from "./pages/SpeciesPage";
import HybridsPage from "./pages/--HybridsPage.jsx";

function App() {
  return (
    <>
      <NavHeader />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/species" element={<SpeciesPage />} />
        <Route path="/hybrids" element={<HybridsPage />} />
      </Routes>
    </>
  );
}

export default App;
