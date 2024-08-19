import React from "react";
import { Route, Routes } from "react-router-dom";
import Login from "./pages/Login"; // Ensure correct path
import Zoom from "./pages/Zoom";
import SignUp from "./pages/SignUp";

const App = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/zoom" element={<Zoom />} />
      <Route path="/signup" element={<SignUp />} />
    </Routes>
  );
};

export default App;
