import 'dotenv/config';
import express from 'express';
import cors from 'cors';

import authRoutes from './routes/auth.routes.js';
import profileAndInpeRoutes from './routes/profile-and-inpe.routes.js';
import dailyJournalRoutes from './routes/daily-journal.routes.js';
import weeklyCheckupRoutes from './routes/weekly-checkup.routes.js';
import adminRoutes from './routes/admin.routes.js';

// Sebelumnya menggunakan BigInt
// BigInt.prototype.tojson = function () {
//     return this.toString();
// };

const app = express();
const PORT = process.env.PORT || 3000;
const apiVersion = '/api/v1';


app.use(cors());
app.use(express.json());

app.use(apiVersion + '/auth', authRoutes);
app.use(apiVersion + '/profile-and-inpe', profileAndInpeRoutes);
app.use(apiVersion + '/daily-journal', dailyJournalRoutes);
app.use(apiVersion + '/weekly-checkup', weeklyCheckupRoutes);
app.use(apiVersion + '/admin', adminRoutes);

// For testing only
app.get('/', (req, res) => {
    res.json({
        status: 'success',
        message: 'Server BeinBout Be is running perfectly'
    });
});

app.listen(PORT, () => {
    console.log(`Server is running in http://localhost:${PORT}`);
});