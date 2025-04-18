import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import cookieParser from 'cookie-parser';
import dbConnect from './config/mongodb.js';
import authRouter from './routes/authRoutes.js';
import userRouter from './routes/userRoutes.js';
import morgan from 'morgan';

const app = express();
const port = process.env.PORT || 4000;
dbConnect();
app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms'),
);
const allowedOrigins = ['http://localhost:5173'];
app.use(express.json()); // all the request to the json fromat
app.use(cookieParser());
app.use(cors({ origin: allowedOrigins, credentials: true })); // we can send the cookies in the response from the express app

//Api Endpoints
app.get('/', (req, res) => {
  res.send('Api is working');
});
app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);

app.listen(port, () => {
  console.log(`server started on ${port}`);
});
