import React from "react";
import Header from "./components/Header";
import Home from "./components/Home";
import Footer from "./components/Footer";
import Login from "./components/Login";
import {BrowserRouter, Routes, Route } from "react-router-dom";
import FeedPage from "./components/FeedPage";

function App() {
  return (
    <BrowserRouter>
    <Header/>
    <div className="App">
    <Routes>
    <Route exact path="/" element= {<Home />}> </Route>
    <Route exact path="/login" element={<Login />}> </Route>
    <Route exact path="/feed" element={<FeedPage />}> </Route>
    </Routes>
    </div>
    <Footer/>
    </BrowserRouter>
  );
}

export default App;
