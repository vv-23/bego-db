import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import NavHeader from "./components/navbar/NavHeader";
import SpeciesPage from "./pages/SpeciesPage";
import HybridsPage from "./pages/HybridsPage.jsx";
import TraitsPage from "./pages/TraitsPage";
import HybridizationsPage from "./pages/HybridizationsPage";
import SpeciesTraitsPage from "./pages/SpeciesTraits.jsx";

function App() {
  return (
    <>
      <NavHeader />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/species" element={<SpeciesPage />} />
        <Route path="/hybrids" element={<HybridsPage />} />
        <Route path="/traits" element={<TraitsPage />} />
        <Route path="/hybridizations" element={<HybridizationsPage />} />
        <Route path="/speciesTraits" element={<SpeciesTraitsPage />} />
      </Routes>
    </>
  );
}

export default App;
