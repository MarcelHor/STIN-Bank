import {BrowserRouter, Routes, Route} from "react-router-dom";
import {Login} from "./components/Login";
import {Dashboard} from "./components/Dashboard";
import {NoPage} from "./components/NoPage";
import {Logout} from "./components/Logout";
import {ProtectedRoute} from "./components/ProtectedRoute";
import './css/app.css';

function App() {
    return (
        <div className="App">
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Login/>}/>
                    <Route path="/dashboard" element={<ProtectedRoute component={Dashboard} requiresAuth={true}/>}/>
                    <Route path="/logout" element={<ProtectedRoute component={Logout} requiresAuth={true}/>}/>
                    <Route path="*" element={<NoPage/>}/>
                </Routes>
            </BrowserRouter>
        </div>
    );
}

export default App

