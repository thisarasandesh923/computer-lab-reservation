
import './App.css';

import { Routes, Route } from 'react-router-dom';

import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';

import Home from './pages/home.jsx';
import Labs from './pages/labs.jsx';
import Login from './pages/login.jsx';
import Register from './pages/register.jsx';

function App() {
    return (
        <div>
            <Navbar />

            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/labs" element={<Labs />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
            </Routes>

            <Footer />
        </div>
    );
}

export default App;
