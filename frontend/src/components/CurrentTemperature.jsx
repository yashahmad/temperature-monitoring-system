import React, { useEffect, useState, useMemo } from 'react';
import useStore from '../store';
import moment from 'moment';

const CurrentTemperature = () => {
    const readings = useStore((state) => state.readings);
    const firstReading = readings?.[0] || {};
    const { temperature = '--', status = 'processing', processedAt } = firstReading;
    
    const [since, setSince] = useState(() => 
        processedAt ? moment(processedAt).fromNow() : '--'
    );

    const statusStyles = useMemo(() => ({
        normal: 'text-green-500',
        high: 'text-yellow-500',
        processing: 'hidden'
    }), []);

    useEffect(() => {
        if (!processedAt) return;
        setSince(moment(processedAt).fromNow());
        
        const interval = setInterval(() => {
            setSince(moment(processedAt).fromNow());
        }, 60000); // 60 seconds

        return () => clearInterval(interval);
    }, [processedAt]);

    return (
        <main className='flex flex-col justify-center content-center border border-transparent rounded-xl shadow-lg p-8 mt-4'>
            <p className='text-gray-400 font-semibold'>Current Temperature</p>
            <p className='text-3xl font-bold'>{temperature} °C</p>
            <div className='flex justify-center gap-2'>
                <p className={`font-bold ${statusStyles[status]}`}>
                    {status.toUpperCase()}
                </p>
                <p>Last updated: {since}</p>
            </div>
        </main>
    );
};

export default React.memo(CurrentTemperature);