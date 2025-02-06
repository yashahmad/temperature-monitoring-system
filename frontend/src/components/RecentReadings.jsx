import React, { useEffect, useMemo, useState, memo } from 'react';
import useStore from '../store';
import moment from 'moment';

const ReadingItem = ({ temperature, time, status }) => {
  const statusStyles = useMemo(() => ({
    normal: 'bg-green-100 text-green-800',
    high: 'bg-yellow-100 text-yellow-800',
    processing: 'bg-gray-100 text-gray-800'
  }), []);

  const [since, setSince] = useState(() => moment(time).fromNow());

  useEffect(() => {
    const interval = setInterval(() => {
      setSince(moment(time).fromNow());
    }, 60000);
    return () => clearInterval(interval);
  }, [time]);

  return (
    <div className='flex justify-between w-full bg-gray-50 p-3 rounded-md'>
      <div>
        <p className='flex font-bold'>{temperature}°C</p>
        <p className='text-sm text-gray-500'>{since}</p>
      </div>
      {status !== 'processing' && (
        <div className={`content-center text-sm font-semibold ${statusStyles[status]} m-2 rounded-full px-4 py-2`}>
          {status.toUpperCase()}
        </div>
      )}
    </div>
  );
};

memo(ReadingItem);

const RecentReadings = () => {
  const readings = useStore((state) => state.readings);

  return (
    <div className='mt-4 shadow-lg'>
      <header className='flex border border-transparent shadow-x-lg shadow-y-md rounded-t-xl py-4 px-4'>
        <p className='font-bold text-lg'>Recent Readings</p>
      </header>
      <hr className='h-px bg-gray-200 border-0 dark:bg-gray-700' />
      <header className='flex flex-col gap-4 border border-transparent shadow-lg rounded-b-xl py-4 px-4 mt-1'>
        {readings && readings?.map((reading, index) => (
          <ReadingItem key={index} temperature={reading.temperature} time={reading.processedAt} status={reading.status} />
        ))}
      </header>
    </div>
  );
};

export default RecentReadings;