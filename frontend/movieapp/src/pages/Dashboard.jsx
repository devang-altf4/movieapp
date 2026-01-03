import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const Dashboard = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [reservations, setReservations] = useState([]);
    const [movies, setMovies] = useState([]);
    const [activeTab, setActiveTab] = useState('reservations');

    // Forms
    const [movieForm, setMovieForm] = useState({ title: '', description: '', genre: '', posterUrl: '', duration: '' });

    // Staged Showtimes for the new movie
    const [stagedShowtimes, setStagedShowtimes] = useState([]);
    const [showtimeInputs, setShowtimeInputs] = useState({ date: '', time: '', price: '' });

    useEffect(() => {
        const fetchUserData = async () => {
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            if (userInfo) {
                setUser(userInfo);
                if (userInfo.role === 'admin') {
                    fetchAdminData();
                } else {
                    fetchUserReservations();
                }
            } else {
                navigate('/login');
            }
        };
        fetchUserData();
    }, [navigate]);

    const fetchUserReservations = async () => {
        try {
            const { data } = await api.get('/reservations/my');
            setReservations(data);
        } catch (error) {
            console.error(error);
            if (error.response?.status === 401) {
                handleLogout();
            }
        }
    };

    const fetchAdminData = async () => {
        try {
            const resReservations = await api.get('/reservations');
            setReservations(resReservations.data);
            const resMovies = await api.get('/movies');
            setMovies(resMovies.data);
        } catch (error) {
            console.error(error);
            if (error.response?.status === 401) {
                handleLogout();
            }
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('userInfo');
        navigate('/login');
    };

    const handleAddShowtimeToStage = (e) => {
        e.preventDefault();
        const { date, time, price } = showtimeInputs;
        if (!date || !time || !price) return;

        // Combine date and time
        const start = new Date(`${date}T${time}`);

        setStagedShowtimes([...stagedShowtimes, { startTime: start, price }]);
        setShowtimeInputs({ date: '', time: '', price: '' });
    };

    const handleRemoveStagedShowtime = (index) => {
        const updated = [...stagedShowtimes];
        updated.splice(index, 1);
        setStagedShowtimes(updated);
    };

    const handleCreateMovie = async (e) => {
        e.preventDefault();
        try {
            const payload = { ...movieForm, showtimes: stagedShowtimes };
            await api.post('/movies', payload);
            alert('Movie & Showtimes Created');
            setMovieForm({ title: '', description: '', genre: '', posterUrl: '', duration: '' });
            setStagedShowtimes([]);
            fetchAdminData();
        } catch (error) {
            console.error(error);
            if (error.response?.status === 401) {
                alert('Session expired. Please login again.');
                handleLogout();
            } else {
                alert('Failed to create movie: ' + (error.response?.data?.message || 'Unknown error'));
            }
        }
    };

    if (!user) return <div className="p-8 text-center text-white">Loading...</div>;

    return (
        <div className="container mx-auto px-4 mt-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-white">Welcome, {user.name}</h1>
                <button onClick={handleLogout} className="px-4 py-2 border border-red-500 text-red-500 rounded hover:bg-red-500 hover:text-white transition-colors">
                    Logout
                </button>
            </div>

            {user.role === 'admin' && (
                <div className="flex gap-4 mb-8">
                    <button
                        className={`px-6 py-2 rounded-lg font-semibold transition-all ${activeTab === 'reservations' ? 'bg-primary text-white' : 'bg-transparent border border-slate-600 text-slate-400 hover:text-white'}`}
                        onClick={() => setActiveTab('reservations')}
                    >
                        Reservations
                    </button>
                    <button
                        className={`px-6 py-2 rounded-lg font-semibold transition-all ${activeTab === 'add-movie' ? 'bg-primary text-white' : 'bg-transparent border border-slate-600 text-slate-400 hover:text-white'}`}
                        onClick={() => setActiveTab('add-movie')}
                    >
                        Add Movie
                    </button>
                </div>
            )}

            {activeTab === 'reservations' && (
                <div>
                    <h2 className="text-2xl font-semibold text-white mb-6">{user.role === 'admin' ? 'All Reservations' : 'My Reservations'}</h2>
                    {reservations.length === 0 ? <p className="text-slate-400">No reservations found.</p> : (
                        <div className="grid grid-cols-1 gap-4">
                            {reservations.map(res => (
                                <div key={res._id} className="bg-slate-800 p-6 rounded-xl border border-slate-700 flex justify-between items-center shadow-lg hover:border-primary transition-colors">
                                    <div>
                                        <h3 className="text-xl font-bold text-white mb-1">{res.showtime?.movie?.title || 'Unknown Movie'}</h3>
                                        <p className="text-slate-400 text-sm mb-1">{new Date(res.showtime?.startTime).toLocaleString()}</p>
                                        <p className="text-slate-300">Seats: <span className="font-mono bg-slate-700 px-2 py-0.5 rounded text-xs">{res.seats.join(', ')}</span></p>
                                        {user.role === 'admin' && <p className="text-xs text-slate-500 mt-1">User: {res.user?.email}</p>}
                                    </div>
                                    <div className="text-right">
                                        <span className="block text-2xl font-bold text-primary">${res.totalPrice}</span>
                                        <span className="text-xs text-slate-500 uppercase tracking-wider">{res.status}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {activeTab === 'add-movie' && user.role === 'admin' && (
                <div className="max-w-4xl mx-auto bg-slate-800 p-8 rounded-2xl border border-slate-700 shadow-2xl">
                    <h2 className="text-2xl font-bold text-white mb-6">Add Movie</h2>
                    <form onSubmit={handleCreateMovie}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-slate-400 mb-2">Title</label>
                                <input
                                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:border-primary transition-colors"
                                    placeholder="Movie Title"
                                    value={movieForm.title}
                                    onChange={e => setMovieForm({ ...movieForm, title: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-slate-400 mb-2">Description</label>
                                <textarea
                                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:border-primary transition-colors"
                                    placeholder="Movie Plot..."
                                    rows="3"
                                    value={movieForm.description}
                                    onChange={e => setMovieForm({ ...movieForm, description: e.target.value })}
                                    required
                                ></textarea>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-2">Genre</label>
                                <input
                                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:border-primary transition-colors"
                                    placeholder="Action, Drama..."
                                    value={movieForm.genre}
                                    onChange={e => setMovieForm({ ...movieForm, genre: e.target.value })}
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-2">Duration (min)</label>
                                <input
                                    type="number"
                                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:border-primary transition-colors"
                                    placeholder="120"
                                    value={movieForm.duration}
                                    onChange={e => setMovieForm({ ...movieForm, duration: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-slate-400 mb-2">Poster URL</label>
                                <input
                                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:border-primary transition-colors"
                                    placeholder="https://..."
                                    value={movieForm.posterUrl}
                                    onChange={e => setMovieForm({ ...movieForm, posterUrl: e.target.value })}
                                />
                            </div>
                        </div>

                        {/* Showtimes Section */}
                        <div className="mt-8 pt-6 border-t border-slate-700">
                            <h3 className="text-xl font-semibold text-white mb-4">Add Showtimes</h3>
                            <div className="flex flex-wrap gap-4 items-end mb-4 bg-slate-900/50 p-4 rounded-xl border border-slate-700 border-dashed">
                                <div className="flex-1 min-w-[150px]">
                                    <label className="block text-xs font-medium text-slate-400 mb-1">Date</label>
                                    <input
                                        type="date"
                                        className="w-full bg-slate-800 border border-slate-600 rounded p-2 text-white text-sm"
                                        value={showtimeInputs.date}
                                        onChange={e => setShowtimeInputs({ ...showtimeInputs, date: e.target.value })}
                                    />
                                </div>
                                <div className="flex-1 min-w-[100px]">
                                    <label className="block text-xs font-medium text-slate-400 mb-1">Time</label>
                                    <input
                                        type="time"
                                        className="w-full bg-slate-800 border border-slate-600 rounded p-2 text-white text-sm"
                                        value={showtimeInputs.time}
                                        onChange={e => setShowtimeInputs({ ...showtimeInputs, time: e.target.value })}
                                    />
                                </div>
                                <div className="w-[100px]">
                                    <label className="block text-xs font-medium text-slate-400 mb-1">Price ($)</label>
                                    <input
                                        type="number"
                                        className="w-full bg-slate-800 border border-slate-600 rounded p-2 text-white text-sm"
                                        value={showtimeInputs.price}
                                        onChange={e => setShowtimeInputs({ ...showtimeInputs, price: e.target.value })}
                                    />
                                </div>
                                <button type="button" className="px-4 py-2 bg-slate-700 text-white rounded hover:bg-white hover:text-slate-900 transition-colors text-sm font-semibold h-[38px]" onClick={handleAddShowtimeToStage}>Add</button>
                            </div>

                            {stagedShowtimes.length > 0 && (
                                <ul className="space-y-2">
                                    {stagedShowtimes.map((st, index) => (
                                        <li key={index} className="bg-slate-900 p-3 rounded-lg flex justify-between items-center border border-slate-700">
                                            <span className="text-sm font-mono text-slate-300">
                                                {st.startTime.toLocaleString(undefined, {
                                                    weekday: 'short',
                                                    year: 'numeric',
                                                    month: 'short',
                                                    day: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                                {' '} - <span className="text-primary font-bold">${st.price}</span>
                                            </span>
                                            <button type="button" onClick={() => handleRemoveStagedShowtime(index)} className="text-red-500 hover:text-red-400 text-sm">Remove</button>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>

                        <button type="submit" className="mt-8 w-full bg-primary text-white font-bold py-3.5 rounded-xl shadow-lg shadow-primary/25 hover:bg-primary-hover hover:-translate-y-1 transition-all">Create Movie & Showtimes</button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
