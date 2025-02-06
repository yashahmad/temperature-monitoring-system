import Temperature from '../models/Temperature.js';
import axios from 'axios';

class TemperatureService {
    constructor(io) {
        this.io = io;
    }

    startGeneration() {
        setInterval(() => this.generateAndProcessTemp(), 2000);
    }

    async generateAndProcessTemp() {
        try {
            const temp = Math.floor(Math.random() * 16) + 15;
            const newTemp = await new Temperature({ value: temp }).save();

            this.io.emit('new_reading', newTemp);

            const response = await axios.post(
                `${process.env.N8N_WEBHOOK}/temp-processing`,
                {
                    id: newTemp._id,
                    temperature: temp,
                    timestamp: newTemp.timestamp
                }
            );

            const updated = await Temperature.findByIdAndUpdate(
                newTemp._id,
                {
                    status: response.data.status,
                    processedAt: response.data.processedAt
                },
                { new: true }
            );
            this.io.emit('processed_reading', response.data);
        } catch (err) {
            console.error('Temperature processing error:', err);
        }
    }
}

export default TemperatureService;