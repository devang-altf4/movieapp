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

                const showtimesRes = await api.get(`/showtimes/movie/${id}`);
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

    if (loading) return <div className="p-8 text-center text-white">Loading...</div>;
    if (!movie) return <div className="p-8 text-center text-white">Movie not found</div>;

    return (
        <div className="container mx-auto px-4 mt-8 pb-20">
            <div className="flex flex-col md:flex-row gap-8 items-start">
                {/* Movie Poster & Info */}
                <div className="w-full md:w-1/3 lg:w-1/4">
                    <div className="bg-slate-800 rounded-2xl p-2 border border-slate-700 shadow-2xl">
                        <img
                            src={movie.posterUrl || 'https://via.placeholder.com/300x450?text=No+Poster'}
                            alt={movie.title}
                            className="w-full h-auto rounded-xl object-cover"
                        />
                    </div>
                    <div className="mt-6 hidden md:block">
                        <h1 className="text-3xl font-bold text-white mb-2">{movie.title}</h1>
                        <p className="text-slate-400 font-medium mb-4">{movie.genre} • {movie.duration} min</p>
                        <p className="text-slate-300 leading-relaxed">{movie.description}</p>
                    </div>
                </div>

                {/* Booking Section */}
                <div className="flex-1 w-full">
                    {/* Mobile Title (visible only on small screens) */}
                    <div className="md:hidden mb-6">
                        <h1 className="text-2xl font-bold text-white mb-1">{movie.title}</h1>
                        <p className="text-slate-400 text-sm">{movie.genre} • {movie.duration} min</p>
                    </div>

                    <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700 backdrop-blur-sm">
                        <h3 className="text-xl font-semibold text-white mb-4">Select Showtime</h3>
                        <div className="flex flex-wrap gap-3 mb-8">
                            {showtimes.length === 0 && <p className="text-slate-400">No showtimes available.</p>}
                            {showtimes.map(st => (
                                <button
                                    key={st._id}
                                    className={`px-4 py-3 rounded-xl border transition-all duration-200 flex flex-col items-center min-w-[100px] ${selectedShowtime?._id === st._id
                                        ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20 scale-105'
                                        : 'bg-slate-800 border-slate-600 text-slate-300 hover:border-slate-400 hover:bg-slate-700'
                                        }`}
                                    onClick={() => {
                                        setSelectedShowtime(st);
                                        setSelectedSeats([]);
                                    }}
                                >
                                    <span className="text-sm font-bold">{new Date(st.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                    <span className="text-xs opacity-80">{new Date(st.startTime).toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' })}</span>
                                    <span className="mt-1 text-xs font-semibold bg-black/20 px-2 py-0.5 rounded">${st.price}</span>
                                </button>
                            ))}
                        </div>

                        {selectedShowtime && (
                            <div className="animate-fade-in">
                                <h3 className="text-xl font-semibold text-white mb-6 text-center">Select Seats</h3>

                                <div className="relative mb-8 perspective-[1000px]">
                                    <div className="screen mx-auto w-3/4 h-1 bg-white/50 shadow-[0_0_30px_rgba(255,255,255,0.3)] mb-8 rounded-full"></div>
                                    <p className="text-xs text-center text-slate-500 mt-2 mb-6">SCREEN</p>

                                    {selectedShowtime.seats.length === 0 ? (
                                        <p className="text-center text-slate-400">No seat layout available for this showtime.</p>
                                    ) : (
                                        <div className="grid grid-cols-10 gap-2 justify-center max-w-lg mx-auto">
                                            {selectedShowtime.seats.map(seat => (
                                                <div
                                                    key={seat.seatNumber}
                                                    className={`
                                                        w-8 h-8 rounded-t-lg rounded-b-md flex items-center justify-center text-[10px] font-bold cursor-pointer transition-all duration-200 border-b-2 shadow-sm
                                                        ${seat.isBooked
                                                            ? 'bg-slate-800 text-slate-600 border-slate-800 cursor-not-allowed'
                                                            : selectedSeats.includes(seat.seatNumber)
                                                                ? 'bg-primary text-white border-primary-hover shadow-[0_0_10px_rgba(248,68,100,0.5)] transform scale-110'
                                                                : 'bg-slate-700 text-slate-300 border-slate-600 hover:bg-slate-600 hover:border-slate-500 hover:scale-105'
                                                        }
                                                    `}
                                                    onClick={() => handleSeatClick(seat)}
                                                    title={`Seat ${seat.seatNumber}`}
                                                >
                                                    {seat.seatNumber}
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    <div className="flex justify-center gap-6 mt-8 text-xs text-slate-400">
                                        <div className="flex items-center gap-2"><div className="w-4 h-4 rounded bg-slate-700 border-b-2 border-slate-600"></div> Available</div>
                                        <div className="flex items-center gap-2"><div className="w-4 h-4 rounded bg-primary border-b-2 border-primary-hover"></div> Selected</div>
                                        <div className="flex items-center gap-2"><div className="w-4 h-4 rounded bg-slate-800 border-b-2 border-slate-800 opacity-50"></div> Booked</div>
                                    </div>
                                </div>

                                <div className="bg-slate-900 rounded-xl p-4 border border-slate-700 flex flex-col sm:flex-row justify-between items-center gap-4">
                                    <div>
                                        <p className="text-slate-400 text-sm">Selected Seats: <span className="text-white font-mono">{selectedSeats.length > 0 ? selectedSeats.join(', ') : '-'}</span></p>
                                        <h3 className="text-2xl font-bold text-primary mt-1">${selectedSeats.length * selectedShowtime.price}</h3>
                                    </div>
                                    <button
                                        className={`px-8 py-3 rounded-xl font-bold text-lg transition-all shadow-lg ${selectedSeats.length === 0
                                            ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                                            : 'bg-primary text-white hover:bg-primary-hover hover:-translate-y-1 shadow-primary/30'
                                            }`}
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
        </div>
    );
};

export default MovieDetail;
