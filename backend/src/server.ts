import express from 'express';
import cors from 'cors';
import { env } from './config/env';
import invoicesRouter from './routes/invoices.routes';
import healthRouter from './routes/health.routes';

const app = express();
app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json({ limit: '10mb' }));

app.use('/api/health', healthRouter);
app.use('/api/invoices', invoicesRouter);

app.listen(env.port, () => {
  console.log(`Servidor SolarInvest Invoice Engine rodando na porta ${env.port}`);
});
