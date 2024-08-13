import React from "react";
import { Route, Routes } from "react-router-dom";
import Login from "./pages/Login"; // Ensure correct path
import Zoom from "./pages/Zoom";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/zoom" element={<Zoom />} />
    </Routes>
  );
};

export default App;
