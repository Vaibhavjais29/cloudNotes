import mongoose from "mongoose";
import env from 'dotenv'

env.config();

const connectToMongoose = async () => {
   await mongoose.connect(process.env.MONGO_URI).then(() => console.log("connected")).catch(err => console.log(err));
   
}

export default connectToMongoose;