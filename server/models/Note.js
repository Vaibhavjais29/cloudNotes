import mongoose from "mongoose";

const NotesSchema = new mongoose.Schema({
  user: {type: mongoose.Schema.Types.ObjectId, ref: 'user'},
  title: { type: String, required: true },
  description: { type: String, required: true },
  tag: { type: String, default: "General"},
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('notes', NotesSchema);