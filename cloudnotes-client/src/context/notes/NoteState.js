import { useState } from "react";
import noteContext from "./noteContext";

const NoteState = (props) => {
  const host = process.env.REACT_APP_API_URL;
  
  const notesInitial = [];
  const [notes, setNotes] = useState(notesInitial);

  // Fetch all notes
  const getNotes = async () => {

    // API call
    const response = await fetch(`${host}/api/notes/fetchallnotes`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem('token')
      },
    });
    const json = await response.json()
    setNotes(json);
  }


  // Add Note
  const addNote = async (title, description, tag) => {

    // API call
    const response = await fetch(`${host}/api/notes/addnote`, {
      method: "POST",
      body: JSON.stringify({title, description, tag}),
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem('token')
      },
    });
    const json = await response.json()
    setNotes(notes.concat(json.savedNote));
    if(json.success) {
      props.showAlert("Added Successfully", "success");
    }
  }


  // Delete Note
  const deleteNote = async (id) => {

    //API call
    const response = await fetch(`${host}/api/notes/deletenote/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem('token')
      },
    });
    const json = await response.json();
    if(json.Success) {
      props.showAlert("Deleted Successfully", "success");
    }
    const newNotes = notes.filter((note) => { return note._id !== id })
    setNotes(newNotes);
  }


  // Update Note
  const editNote = async (id, title, description, tag) => {

    //API Call
    const response = await fetch(`${host}/api/notes/updatenote/${id}`, {
      method: "PUT", 
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem('token')
      },
      body: JSON.stringify({title, description, tag}),
    });
    const json = await response.json();
    if(json.success) {
      props.showAlert("Updated Successfully", "success");
    }

    let newNotes = JSON.parse(JSON.stringify(notes))
    for (let index = 0; index < newNotes.length; index++) {
      const element = newNotes[index];
      if (element._id === id) {
        newNotes[index].title = title;
        newNotes[index].description = description;
        newNotes[index].tag = tag;
      }
    }
    setNotes(newNotes);
  }

  return (
    <noteContext.Provider value={{ notes, addNote, deleteNote, editNote, getNotes }}>
      {props.children}
    </noteContext.Provider>
  )
}

export default NoteState;