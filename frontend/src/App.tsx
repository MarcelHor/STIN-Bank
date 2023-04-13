import {useEffect, useState} from "react";
import {Login} from "./components/Login";
import {Dashboard} from "./components/Dashboard";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import axios from "axios";

function App() {

    return (
        <div className="App">
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Login/>}/>
                    <Route path="/dashboard" element={<Dashboard/>}/>
                </Routes>
            </BrowserRouter>
        </div>
    );
}

export default App

