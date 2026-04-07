import 'dotenv/config';
import express from 'express';
import cors from 'cors';

import swaggerUi from 'swagger-ui-express';
import { swaggerDocument } from './docs/swagger.js';

import authRoutes from './routes/auth.routes.js';
import showingQuestionRoutes from './routes/showing-question.routes.js';
import profileAndInpeRoutes from './routes/profile-and-inpe.routes.js';
import dashboardRoutes from './routes/dashboard.routes.js';
import dailyJournalRoutes from './routes/daily-journal.routes.js';
import weeklyCheckupRoutes from './routes/weekly-checkup.routes.js';
import adminRoutes from './routes/admin.routes.js';

// Sebelumnya menggunakan BigInt
// BigInt.prototype.tojson = function () {
//     return this.toString();
// };

const app = express();
const PORT = process.env.PORT || 3000;
const apiVersion = process.env.API_VERSION || '/api/v1';

app.use(cors());
app.use(express.json());

const swaggerOptions = {
    customCssUrl: 'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.18.3/swagger-ui.min.css',
    customJs: [
        'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.18.3/swagger-ui-bundle.min.js',
        'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.18.3/swagger-ui-standalone-preset.min.js'
    ],
    customSiteTitle: 'BeinBout API Documentation'
};

app.use(apiVersion + '/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, swaggerOptions));
app.use(apiVersion + '/auth', authRoutes);
app.use(apiVersion + '/showing-questions', showingQuestionRoutes);
app.use(apiVersion + '/profile-and-inpe', profileAndInpeRoutes);
app.use(apiVersion + '/dashboard', dashboardRoutes);
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

if (process.env.NODE_ENV === 'production') {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Server is running in http://localhost:${PORT}`);
    });
}

app.listen(PORT, () => {
    console.log(`Server is running in http://localhost:${PORT}`);
});

export default app;