import app from './app';
import cors from 'cors';
import express from 'express';

app.use(express.json());

app.use(cors()); 

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
