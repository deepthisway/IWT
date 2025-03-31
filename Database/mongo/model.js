import mongoose, {Schema} from 'mongoose'

const userSchema = Schema({
    name: String,
    email: String,
    college: String
})

export const User = await mongoose.model('User', userSchema);




