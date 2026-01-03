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
            <div className="container mx-auto px-4 flex justify-between items-center max-w-full">
                <Link to="/" className="text-primary text-xl md:text-2xl font-extrabold tracking-tighter uppercase shrink-0">
                    MovieX
                </Link>
                <div className="flex gap-2 md:gap-4">
                    {userInfo ? (
                        <>
                            <Link to="/dashboard" className="btn btn-sm md:btn-md btn-outline border-none text-xs md:text-sm">Dashboard</Link>
                            <button onClick={logoutHandler} className="btn btn-sm md:btn-md btn-primary text-xs md:text-sm">Sign Out</button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="btn btn-sm md:btn-md btn-outline border-none text-xs md:text-sm">Login</Link>
                            <Link to="/register" className="btn btn-sm md:btn-md btn-primary text-xs md:text-sm">Sign Up</Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
