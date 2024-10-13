import React, { useContext, useEffect, useState } from "react";
import noteContext from "../context/notes/noteContext";
import Noteitem from "./Noteitem";
import AddNote from "./AddNote";
import { useNavigate } from "react-router-dom";

const Notes = () => {
  const context = useContext(noteContext);
  const { notes, getNotes, editNote } = context;
  const navigate = useNavigate();
  useEffect(() => {
    if(localStorage.getItem('token')) {
      getNotes();
    }
    else {
      navigate("/login")
    }
    // eslint-disable-next-line
  }, [])

  // state for modal (showing title, desc, tag in modal)
  const [note, setNote] = useState({_id: "", title: "", description: "", tag: ""})
  const onChange = (event) => {
    const {name, value} = event.target;
    setNote({...note, [name] : value});
  }

  const handleClick = () => {
    editNote(note._id, note.title, note.description, note.tag);
  }

  return (
    <>
      <AddNote />

      <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">Edit Note</h1>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <form className="my-3">
                <div className="mb-3">
                  <label htmlFor="title" className="form-label"> Title </label>
                  <input type="text" className="form-control" id="title" name="title" aria-describedby="emailHelp" onChange={onChange} value={note.title} />
                </div>
                <div className="mb-3">
                  <label htmlFor="description" className="form-label"> Description </label>
                  <input type="text" className="form-control" id="description" name="description" onChange={onChange} value={note.description} />
                </div>
                <div className="mb-3">
                  <label htmlFor="tag" className="form-label"> Tag </label>
                  <input type="text" className="form-control" id="tag" name="tag" onChange={onChange} value={note.tag} />
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
              <button disabled={note.title.length < 3 || note.description.length < 5} type="button" className="btn btn-primary" data-bs-dismiss="modal" onClick={handleClick}>Update Note</button>
            </div>
          </div>
        </div>
      </div>

      <div className="row my-3">
        <h2>Your Notes</h2>
        <div className="container mx-2">
          {notes.length === 0 && "No Notes to display"}
        </div>
        {notes.map((note) => {
          return <Noteitem key={note._id} note={note} setNote={setNote} />;
        })}
      </div>
    </>
  )
}

export default Notes;