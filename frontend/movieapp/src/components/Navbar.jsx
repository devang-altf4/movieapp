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
        <nav style={{ background: '#1e1e1e', padding: '1rem', borderBottom: '1px solid #333' }}>
            <div className="container flex justify-between items-center">
                <Link to="/" style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#646cff' }}>
                    MovieApp
                </Link>
                <div className="flex gap-4">
                    {userInfo ? (
                        <>
                            <Link to="/dashboard" className="btn btn-outline">Dashboard</Link>
                            <button onClick={logoutHandler} className="btn btn-primary">Logout</button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="btn btn-outline">Login</Link>
                            <Link to="/register" className="btn btn-primary">Sign Up</Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
