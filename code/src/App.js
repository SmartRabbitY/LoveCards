import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Pool from "./pages/Pool"
import back from './images/back.png'
import Settings from "./pages/Settings";
import "./App.css";
import Sidebar from "./components/Sidebar";
import Rightbar from "./components/Rightbar";
import {useMoralis} from "react-moralis";
import {Icon, ConnectButton} from"web3uikit"
// import Moralis from "moralis/types";

const App = () => {
  const {isAuthenticated, Moralis} = useMoralis();
  return (
    <>
    {isAuthenticated ? (
      <div className="page">
          <div className="sideBar">
            <Sidebar />
          </div>
        
        <div className="mainWindow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/settings" element={<Settings />} />
           
            <Route path="/pool" element={<Pool/>} />
          </Routes>
        </div>
        <div className="rightBar">
          <Rightbar/>
        </div>
      </div>
    ):(
      <div className="loginPage" >
        <ConnectButton />
        <div style={{'fontSize':'80px', 'fontWeight':'80px', 'color':'pink'}}>LoveCards</div>
        <img src={back} style={{'maxWidth':'1000px', 'border-radius': '100px'}}></img>
        
      </div>
      
    )}
     
    </>
  );
};

export default App;
