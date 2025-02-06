import { create } from 'zustand';
import axios from 'axios';

const useStore = create((set) => ({
    connectionState: false,
    setConnectionState: (status) => set({ connectionState: status }),
    readings: [],
    setReadings: (newReading) => set((state) => ({
        readings: [newReading, ...state.readings.slice(0, 4)],
    })),
    updateReadingStatus: (id, status, processedAt) => set((state) => ({
        readings: state.readings.map(item =>
            item.id === id ? { ...item, status, processedAt } : item
        ),
    })),
}));

export const fetchReadings = async (setReadings) => {
    try {
        const response = await axios.get('http://localhost:5000/api/readings');
        setReadings(response.data.slice(-5));
    } catch (error) {
        console.error('Error fetching readings:', error);
    }
};

export default useStore;