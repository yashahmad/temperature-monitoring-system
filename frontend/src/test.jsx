import { useEffect, useState } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:5000', {
//   withCredentials: true,
//   transport: ['websocket'],
  reconnection: true,
  reconnectionAttempts: 5
});

export default function TemperatureDashboard() {
  const [readings, setReadings] = useState([]);
  const [connectionState, setConnectionState] = useState('connecting');

  // WebSocket event handlers
  useEffect(() => {
    const handleInitialReading = (reading) => {
      setReadings(prev => [{
        id: reading._id,
        temperature: reading.value,
        timestamp: reading.timestamp,
        status: 'processing'
      }, ...prev.slice(0, 4)]);
    };

    const handleProcessedUpdate = (processed) => {
      console.log("Processed", processed);
      setReadings(prev => prev.map(item => 
        item.id === processed[0].id ? { 
          ...item, 
          status: processed[0].status.toLowerCase(),
          processedAt: processed[0].processedAt
        } : item
      ));
    };
    
    // Connection status handlers
    socket.on('connect', () => setConnectionState('connected'));
    socket.on('disconnect', () => setConnectionState('disconnected'));
    socket.on('reconnect_attempt', () => setConnectionState('reconnecting'));
    
    // Data handlers
    socket.on('new_reading', handleInitialReading);
    socket.on('processed_reading', handleProcessedUpdate);

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('new_reading', handleInitialReading);
      socket.off('processed_reading', handleProcessedUpdate);
    };
  }, []);

  // Status badge styling
  const statusStyles = {
    normal: 'bg-green-100 text-green-800',
    high: 'bg-red-100 text-red-800',
    processing: 'bg-gray-100 text-gray-800'
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Real-Time Temperature Monitor</h1>
        <div className={`px-4 py-2 rounded-lg ${statusStyles[connectionState]}`}>
          {connectionState.toUpperCase()}
        </div>
      </div>

      <div className="space-y-4">
        {readings.map((reading) => (
          <div key={reading.id} className="p-4 border rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-2xl font-semibold">
                  {reading.temperature}°C
                </span>
                <span className="ml-2 text-sm text-gray-500">
                  {new Date(reading.timestamp).toLocaleTimeString()}
                </span>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm ${statusStyles[reading.status]}`}>
                {reading.status.toUpperCase()}
              </span>
            </div>
            {reading.processedAt && (
              <div className="mt-2 text-xs text-gray-500">
                Processed at: {new Date(reading.processedAt).toLocaleTimeString()}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}