import React from 'react';
import useStore from '../store';

const Header = () => {
    const isConnected = useStore(state => state.connectionState);
    
    return (
        <header className='flex justify-between content-center px-1'>
            <h2 className='font-extrabold text-2xl'>Temperature Monitor</h2>
            <div className="flex items-center gap-2 text-sm">
                <div className={`w-3 h-3 rounded-full ${
                    isConnected 
                        ? 'bg-green-500 animate-pulse' 
                        : 'bg-red-500 animate-pulse'
                }`} />
                <span className={`font-medium ${
                    isConnected ? 'text-green-600' : 'text-red-600'
                }`}>
                    {isConnected ? 'Connected' : 'Disconnected'}
                </span>
            </div>
        </header>
    );
};

export default React.memo(Header);