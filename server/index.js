import express from 'express'
import bodyParser from 'body-parser'
import connectToMongoose from "./db.js"
import authRoute from "./routes/auth.js";
import notesRoute from "./routes/notes.js"
import cors from 'cors'
import env from "dotenv"

connectToMongoose();
const app = express();
env.config();
const port = process.env.PORT;

app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

// Available Routes
app.use("/api/auth", authRoute);
app.use("/api/notes", notesRoute);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})
