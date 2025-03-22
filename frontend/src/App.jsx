import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Projects from "./pages/Projects";
import NotFound from "./pages/NotFound";
import Header from "./components/Header";
import Footer from "./components/Footer";


function App() {


  return (
    <Router>
      
      <Header/>

      <Routes>
        <Route path="/" element={<Home  />} />
        <Route path="/about" element={<About/>} />
        <Route path="/projects" element={<Projects  />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </Router>
    
  );
}

export default App;