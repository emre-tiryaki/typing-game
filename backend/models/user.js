import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    //doldurulacak
});

const User = mongoose.model('User', userSchema);

export default User;