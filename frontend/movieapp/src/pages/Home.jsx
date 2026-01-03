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
        <div className="container mx-auto px-4 mt-8">
            <h1 className="text-3xl font-bold mb-6 text-white">Now Showing</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {movies.map((movie) => (
                    <Link to={`/movie/${movie._id}`} key={movie._id} className="block group h-full">
                        <div className="bg-slate-800 rounded-2xl overflow-hidden border border-slate-700 shadow-xl transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:border-primary flex flex-col h-full">
                            <div className="aspect-video w-full relative overflow-hidden">
                                <img
                                    src={movie.posterUrl || 'https://via.placeholder.com/600x400?text=No+Poster'}
                                    alt={movie.title}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-300"></div>
                            </div>
                            <div className="p-5 flex-1 flex flex-col justify-start">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="text-xl font-bold text-white truncate w-3/4 group-hover:text-primary transition-colors">
                                        {movie.title}
                                    </h3>
                                    <span className="bg-slate-700/50 border border-slate-600 px-2 py-1 rounded text-xs text-slate-300 font-mono">
                                        {movie.duration}m
                                    </span>
                                </div>
                                <p className="text-slate-400 text-sm font-medium mb-4">{movie.genre}</p>
                                <div className="mt-auto pt-4 border-t border-slate-700/50 flex justify-between items-center">
                                    <span className="text-xs text-slate-500 uppercase tracking-widest font-semibold">Now Showing</span>
                                    <span className="text-primary text-sm font-bold flex items-center gap-1">
                                        Book Now <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                                    </span>
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default Home;
