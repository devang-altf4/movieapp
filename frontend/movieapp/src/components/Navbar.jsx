import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
    const navigate = useNavigate();
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));

    const logoutHandler = () => {
        localStorage.removeItem('userInfo');
        navigate('/login');
    };

    return (
        <nav className="bg-slate-900/85 backdrop-blur-md sticky top-0 z-50 border-b border-slate-700 py-4">
            <div className="container mx-auto px-4 flex justify-between items-center">
                <Link to="/" className="text-primary text-2xl font-extrabold tracking-tighter uppercase">
                    MovieX
                </Link>
                <div className="flex gap-4">
                    {userInfo ? (
                        <>
                            <Link to="/dashboard" className="btn btn-outline" style={{ border: 'none' }}>Dashboard</Link>
                            <button onClick={logoutHandler} className="btn btn-primary">Sign Out</button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="btn btn-outline" style={{ border: 'none' }}>Login</Link>
                            <Link to="/register" className="btn btn-primary">Sign Up</Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
