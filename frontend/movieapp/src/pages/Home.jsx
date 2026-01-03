import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';

const Home = () => {
    const [movies, setMovies] = useState([]);

    useEffect(() => {
        const fetchMovies = async () => {
            try {
                const { data } = await api.get('/movies');
                setMovies(data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchMovies();
    }, []);

    return (
        <div className="container" style={{ marginTop: '2rem' }}>
            <h1 className="mb-4">Now Showing</h1>
            <div className="grid grid-cols-1 grid-cols-2 grid-cols-3 grid-cols-4">
                {movies.map((movie) => (
                    <Link to={`/movie/${movie._id}`} key={movie._id}>
                        <div className="card" style={{ padding: 0, overflow: 'hidden', height: '100%' }}>
                            <img
                                src={movie.posterUrl || 'https://via.placeholder.com/300x450?text=No+Poster'}
                                alt={movie.title}
                                style={{ width: '100%', height: '300px', objectFit: 'cover' }}
                            />
                            <div style={{ padding: '1rem' }}>
                                <h3 style={{ margin: '0 0 0.5rem 0' }}>{movie.title}</h3>
                                <p style={{ color: '#aaa', fontSize: '0.9rem' }}>{movie.genre} • {movie.duration} min</p>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default Home;
