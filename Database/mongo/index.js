import mongoose from 'mongoose'
import express  from "express"
import { connectDB } from './connectDB.js';
import { User } from './model.js';

const app = express();
app.use(express.json());
const PORT = 3999;

await connectDB();

app.post('/create', async (req, res)=>    {
    const {name, email, college}  = req.body;

    try {
        const user = await User.create({
            name,
            email,
            college
        })

        console.log("user creted:", user.name)
        return res.json ({
            msg: "User created",
            user
        })
    } catch (error) {
        console.error("error creating user", error)
    }
})

app.get('/get-users', async (req, res)=>  {
    try {
        const users = await User.find();
        return res.json({
            users
        })
    } catch (error) {
        
    }
})

app.listen(PORT, ()=>  {
    console.log(`App is running on ${PORT}`);
})