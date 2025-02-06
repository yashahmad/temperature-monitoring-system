import mongoose from 'mongoose';

const tempSchema = new mongoose.Schema({
    value: Number,
    status: {
        type: String,
        enum: ['PROCESSING', 'NORMAL', 'HIGH'],
        default: 'PROCESSING'
    },
    timestamp: { type: Date, default: Date.now }
});

export default mongoose.model('Temperature', tempSchema);