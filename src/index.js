import 'dotenv/config';
import express from 'express';
import cors from 'cors';

import authRoutes from './routes/auth.routes.js';

// Sebelumnya menggunakan BigInt
// BigInt.prototype.tojson = function () {
//     return this.toString();
// };

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/api/v1/auth', authRoutes);

app.get('/', (req, res) => {
    res.json({
        status: 'success',
        message: 'Server BeinBout Be is running perfectly'
    });
});

app.listen(PORT, () => {
    console.log(`Server is running in http://localhost:${PORT}`);
});