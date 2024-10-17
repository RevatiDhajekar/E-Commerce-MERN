import "./App.css";
import Header from "./component/layout/Header/Header.js";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import webFont from "webfontloader";
import React, { useEffect } from "react";
import Footer from "./component/layout/Footer/Footer.js";
import Home from "./component/Home/Home.js";

function App() {
  useEffect(() => {
    webFont.load({
      google: {
        families: ["Roboto", "Droid Sans", "Chilanka"],
      },
    });
  }, []); //called at first rendering

  return (
    <Router>
      <Header />
      <Routes>
        <Route exact path="/" Component={Home} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
