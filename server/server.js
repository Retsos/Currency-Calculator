require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const currencyRoutes = require('./routes/currencies');
const ratesRoutes = require('./routes/rates');
const authroute = require('./routes/auth');
const convertRoutes = require('./routes/convert');


const app = express();
const db = mongoose.connection;

mongoose.connect(process.env.DATABASE_URL, {})
db.on('error', (error)=> console.error(error))
db.once('open', ()=> console.log("Connected to DB"))

//settaroume cors 
app.use(cors({
  origin: process.env.FRONTEND_PORT,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'], 
}))

app.use(express.json()); //dexomaste json

app.use('/api/currencies', currencyRoutes);// gia xrisi twn endpoint pou exoume sto routes/currencies
app.use('/api/rates', ratesRoutes);
app.use('/api/auth', authroute);
app.use('/api/convert', convertRoutes);


const PORT = process.env.BACKEND_PORT;
app.listen(PORT, () => {
});