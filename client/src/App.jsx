import React from "react";
import { Routes, Route } from "react-router-dom";
import AdminPanel from "./components/AdminPanel";
import EditPost from "./components/EditPost";
import Home from "./pages/Home";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/admin" element={<AdminPanel />} />
      <Route path="/admin/edit/:id" element={<EditPost />} />
    </Routes>
  );
};

export default App;