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

    if (!user) return <div>Loading...</div>;

    return (
        <div className="container" style={{ marginTop: '2rem' }}>
            <div className="flex justify-between items-center mb-4">
                <h1>Welcome, {user.name}</h1>
                <button onClick={handleLogout} className="btn btn-outline" style={{ borderColor: 'red', color: 'red' }}>Logout</button>
            </div>

            {user.role === 'admin' && (
                <div style={{ marginBottom: '2rem' }}>
                    <button className={`btn ${activeTab === 'reservations' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setActiveTab('reservations')} style={{ marginRight: '1rem' }}>Reservations</button>
                    <button className={`btn ${activeTab === 'add-movie' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setActiveTab('add-movie')}>Add Movie</button>
                </div>
            )}

            {activeTab === 'reservations' && (
                <div>
                    <h2>{user.role === 'admin' ? 'All Reservations' : 'My Reservations'}</h2>
                    {reservations.length === 0 ? <p>No reservations found.</p> : (
                        <div className="grid grid-cols-1">
                            {reservations.map(res => (
                                <div key={res._id} className="card flex justify-between items-center">
                                    <div>
                                        <h3>{res.showtime?.movie?.title || 'Unknown Movie'}</h3>
                                        <p>{new Date(res.showtime?.startTime).toLocaleString()}</p>
                                        <p>Seats: {res.seats.join(', ')}</p>
                                        {user.role === 'admin' && <p>User: {res.user?.email}</p>}
                                    </div>
                                    <div>
                                        <span style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>${res.totalPrice}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {activeTab === 'add-movie' && user.role === 'admin' && (
                <div className="card" style={{ maxWidth: '800px' }}>
                    <h2>Add Movie</h2>
                    <form onSubmit={handleCreateMovie}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div style={{ gridColumn: '1 / -1' }}>
                                <label>Title</label>
                                <input placeholder="Title" value={movieForm.title} onChange={e => setMovieForm({ ...movieForm, title: e.target.value })} required />
                            </div>

                            <div style={{ gridColumn: '1 / -1' }}>
                                <label>Description</label>
                                <textarea placeholder="Description" rows="3" value={movieForm.description} onChange={e => setMovieForm({ ...movieForm, description: e.target.value })} required style={{ width: '100%', background: '#1e1e1e', border: '1px solid #333', color: 'white', padding: '0.75rem', marginBottom: '1rem', borderRadius: '4px' }}></textarea>
                            </div>

                            <div>
                                <label>Genre</label>
                                <input placeholder="Genre" value={movieForm.genre} onChange={e => setMovieForm({ ...movieForm, genre: e.target.value })} required />
                            </div>

                            <div>
                                <label>Duration (min)</label>
                                <input type="number" placeholder="120" value={movieForm.duration} onChange={e => setMovieForm({ ...movieForm, duration: e.target.value })} required />
                            </div>

                            <div style={{ gridColumn: '1 / -1' }}>
                                <label>Poster URL</label>
                                <input placeholder="http://..." value={movieForm.posterUrl} onChange={e => setMovieForm({ ...movieForm, posterUrl: e.target.value })} />
                            </div>
                        </div>

                        {/* Showtimes Section */}
                        <div style={{ marginTop: '2rem', padding: '1rem', border: '1px solid #333', borderRadius: '8px' }}>
                            <h3>Add Showtimes</h3>
                            <div className="flex gap-2 items-end" style={{ marginBottom: '1rem', flexWrap: 'wrap' }}>
                                <div>
                                    <label>Date</label>
                                    <input
                                        type="date"
                                        value={showtimeInputs.date}
                                        onChange={e => setShowtimeInputs({ ...showtimeInputs, date: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label>Time</label>
                                    <input
                                        type="time"
                                        value={showtimeInputs.time}
                                        onChange={e => setShowtimeInputs({ ...showtimeInputs, time: e.target.value })}
                                    />
                                </div>
                                <div style={{ width: '100px' }}>
                                    <label>Price ($)</label>
                                    <input
                                        type="number"
                                        value={showtimeInputs.price}
                                        onChange={e => setShowtimeInputs({ ...showtimeInputs, price: e.target.value })}
                                    />
                                </div>
                                <button type="button" className="btn btn-outline" onClick={handleAddShowtimeToStage}>Add</button>
                            </div>

                            {stagedShowtimes.length > 0 && (
                                <ul style={{ listStyle: 'none', padding: 0 }}>
                                    {stagedShowtimes.map((st, index) => (
                                        <li key={index} style={{ background: '#333', padding: '0.5rem', marginBottom: '0.5rem', borderRadius: '4px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <span>
                                                {st.startTime.toLocaleString(undefined, {
                                                    weekday: 'short',
                                                    year: 'numeric',
                                                    month: 'short',
                                                    day: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                                {' '} - ${st.price}
                                            </span>
                                            <button type="button" onClick={() => handleRemoveStagedShowtime(index)} style={{ color: 'red', background: 'transparent', border: 'none', cursor: 'pointer' }}>Remove</button>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>

                        <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem', width: '100%' }}>Create Movie & Showtimes</button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
