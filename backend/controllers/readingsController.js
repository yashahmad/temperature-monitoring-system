import Temperature from '../models/Temperature.js';

export const updateReading = async (req, res) => {
    try {
        const updated = await Temperature.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        res.json(updated);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const healthCheck = (req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString()
    });
};