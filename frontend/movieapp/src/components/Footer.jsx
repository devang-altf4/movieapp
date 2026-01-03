import React from 'react';

const Footer = () => {
    return (
        <footer className="bg-slate-900 border-t border-slate-800 mt-20">
            <div className="container mx-auto px-4 py-8">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
                    <div>
                        <h3 className="text-2xl font-bold text-primary mb-1">MovieX</h3>
                        <p className="text-slate-400 text-sm">Experience movies like never before.</p>
                    </div>

                    <div className="flex flex-col items-center md:items-end gap-1">
                        <p className="text-slate-300 font-medium">Created by <span className="text-white">Devang</span></p>
                        <p className="text-slate-500 text-xs text-center">© {new Date().getFullYear()} All Rights Reserved.</p>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
