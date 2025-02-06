import React, { useEffect } from 'react';
import './App.css';
import Header from './components/Header';
import CurrentTemperature from './components/CurrentTemperature';
import RecentReadings from './components/RecentReadings';
import useStore from './store';
import { io } from 'socket.io-client';

const socket = io('http://localhost:5000/', {
  reconnection: true,
  reconnectionAttempts: 5
});

function App() {
  const { setReadings, updateReadingStatus, setConnectionState } = useStore();

  useEffect(() => {
    const handleInitialReading = (reading) => {
      setReadings({
        id: reading._id,
        temperature: reading.value,
        timestamp: reading.timestamp,
        status: 'processing'
      });
    };

    const handleProcessedUpdate = (processed) => {
      updateReadingStatus(processed[0].id, processed[0].status.toLowerCase(), processed[0].processedAt);
    };
 
    socket.on('connect', () => setConnectionState(true));
    socket .on('disconnect', () => setConnectionState(false));
    socket.on('error', () => setConnectionState(false));
    socket.on('reconnect_attempt', () => setConnectionState('reconnecting'));  

    socket.on('new_reading', handleInitialReading);
    socket.on('processed_reading', handleProcessedUpdate);

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('new_reading', handleInitialReading);
      socket.off('processed_reading', handleProcessedUpdate);
    };
  }, [setReadings, updateReadingStatus, setConnectionState]);

  return (
    <>
      <Header />
      <CurrentTemperature />
      <RecentReadings />
    </>
  );
}

export default App;