import express from 'express';
import { PORT } from './config.js';
import cors from 'cors';


const app = express();

app.use(cors());

app.get('/',(req,res) => {
    console.log('req');
    return res.status(234).send('welcome')
})

app.listen(PORT,() => {
    console.log(`running in port: ${PORT}`)
})