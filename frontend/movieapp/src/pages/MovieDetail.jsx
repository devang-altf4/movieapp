import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';

const MovieDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [movie, setMovie] = useState(null);
    const [showtimes, setShowtimes] = useState([]);
    const [selectedShowtime, setSelectedShowtime] = useState(null);
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [loading, setLoading] = useState(true);

    const userInfo = JSON.parse(localStorage.getItem('userInfo'));

    useEffect(() => {
        const fetchMovieData = async () => {
            try {
                const movieRes = await api.get(`/movies/${id}`);
                setMovie(movieRes.data);

                const showtimesRes = await api.get(`/showtimes/${id}`);
                setShowtimes(showtimesRes.data);

                setLoading(false);
            } catch (error) {
                console.error(error);
                setLoading(false);
            }
        };
        fetchMovieData();
    }, [id]);

    const handleSeatClick = (seat) => {
        if (!userInfo) {
            alert('Please login to book seats');
            navigate('/login');
            return;
        }
        if (seat.isBooked || seat.reservedBy) return;

        if (selectedSeats.includes(seat.seatNumber)) {
            setSelectedSeats(selectedSeats.filter(s => s !== seat.seatNumber));
        } else {
            setSelectedSeats([...selectedSeats, seat.seatNumber]);
        }
    };

    const handleBook = async () => {
        try {
            await api.post('/reservations', {
                showtimeId: selectedShowtime._id,
                seats: selectedSeats
            });
            alert('Reservation Successful!');
            navigate('/dashboard');
        } catch (error) {
            alert(error.response?.data?.message || 'Booking failed');
        }
    };

    if (loading) return <div>Loading...</div>;
    if (!movie) return <div>Movie not found</div>;

    return (
        <div className="container" style={{ marginTop: '2rem' }}>
            <div className="flex gap-4" style={{ alignItems: 'flex-start', flexWrap: 'wrap' }}>
                <img
                    src={movie.posterUrl || 'https://via.placeholder.com/300x450?text=No+Poster'}
                    alt={movie.title}
                    style={{ width: '300px', borderRadius: '12px' }}
                />
                <div style={{ flex: 1 }}>
                    <h1>{movie.title}</h1>
                    <p style={{ color: '#aaa' }}>{movie.genre} • {movie.duration} min</p>
                    <p>{movie.description}</p>

                    <h3 className="mt-4">Select Showtime</h3>
                    <div className="flex gap-2" style={{ flexWrap: 'wrap' }}>
                        {showtimes.length === 0 && <p>No showtimes available.</p>}
                        {showtimes.map(st => (
                            <button
                                key={st._id}
                                className={`btn ${selectedShowtime?._id === st._id ? 'btn-primary' : 'btn-outline'}`}
                                onClick={() => {
                                    setSelectedShowtime(st);
                                    setSelectedSeats([]);
                                }}
                            >
                                {new Date(st.startTime).toLocaleString()} - ${st.price}
                            </button>
                        ))}
                    </div>

                    {selectedShowtime && (
                        <div className="mt-4">
                            <h3>Select Seats</h3>
                            <div className="screen"></div>
                            {selectedShowtime.seats.length === 0 ? (
                                <p>No seat layout available for this showtime.</p>
                            ) : (
                                <div className="seat-grid">
                                    {selectedShowtime.seats.map(seat => (
                                        <div
                                            key={seat.seatNumber}
                                            className={`seat ${seat.isBooked ? 'booked' : ''} ${selectedSeats.includes(seat.seatNumber) ? 'selected' : ''}`}
                                            onClick={() => handleSeatClick(seat)}
                                        >
                                            {seat.seatNumber}
                                        </div>
                                    ))}
                                </div>
                            )}

                            <div className="mt-4 flex justify-between items-center">
                                <div>
                                    <p>Selected: {selectedSeats.join(', ')}</p>
                                    <h3>Total: ${selectedSeats.length * selectedShowtime.price}</h3>
                                </div>
                                <button
                                    className="btn btn-primary"
                                    disabled={selectedSeats.length === 0}
                                    onClick={handleBook}
                                >
                                    Confirm Booking
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MovieDetail;
