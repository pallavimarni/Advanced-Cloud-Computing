import React from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Login from "./components/Login";
import {BrowserRouter, Routes, Route } from "react-router-dom";
import FeedPage from "./components/FeedPage";
import PostStory from "./components/PostStory";
import ViewStoryEdits from "./components/ViewStoryEdits";

function App() {
  return (
    <BrowserRouter>
    <Header/>
    <div className="App">
    <Routes>
    <Route exact path="/" element= {<Login />}> </Route>
    <Route exact path="/login" element={<Login />}> </Route>
    <Route exact path="/post" element={<PostStory />}> </Route>
    <Route exact path="/feed" element={<FeedPage />}> </Route>
    <Route exact path="/edits" element={<ViewStoryEdits />}> </Route>
    </Routes>
    </div>
    <Footer/>
    </BrowserRouter>
  );
}

export default App;
