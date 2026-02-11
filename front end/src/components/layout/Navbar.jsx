
import React from 'react';
import { Heart, Menu, User } from 'lucide-react';

const Navbar = () => {
    return (
        <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <Heart className="h-8 w-8 text-primary fill-current" />
                        <span className="ml-2 text-xl font-bold text-gray-900 tracking-tight">
                            MediCare
                        </span>
                    </div>

                </div>
            </div>
        </nav>
    );
};

export default Navbar;
