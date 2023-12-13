import KwikNote from "./components/KwikNote";
import "./App.css";
import { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";

function App() {
  const [notes, setNotes] = useState([]);
  useEffect(() => {
    fetchNotes();
  }, []);
  const fetchNotes = async () => {
    try {
      let { data, error } = await supabase.from("notes").select("*");
      if (error) throw error;
      setNotes(data || []);
    } catch (error) {
      console.error(error.message);
    }
  };
  const addNote = async () => {
    try {
      const { data, error } = await supabase
        .from("notes")
        .insert([
          {
            text: "Click edit to write your note...",
          },
        ])
        .select();
      if (error) throw error;
      setNotes([...notes, ...data]);
    } catch (error) {
      console.error(error.message);
    }

    console.log(notes);
  };

  const updateNote = async (id, newText) => {
    try {
      const { data, error } = await supabase
        .from("notes")
        .update({ text: newText })
        .eq("id", id)
        .select();
      if (error) throw error;

      setNotes((preNote) =>
        preNote.map((note) =>
          note.id === id ? { ...note, text: newText } : note
        )
      );
    } catch (error) {
      console.error(error.message);
    }
  };
  const deleteNote = async (id) => {
try{
  const { error } = await supabase.from("notes").delete().eq("id", id);
  if (error) throw error;

  setNotes(notes.filter((note) => note.id !== id));
}catch(error){
  console.error(error.message)
}
  };
  return (
    <>
      <div className=" px-5 py-5">
        <h1 className=" text-white font-bold text-5xl">Kwik Note</h1>
        <div className="text-center">
          <button
            onClick={addNote}
            className=" text-white px-5 py-5 rounded-full bg-red-500 hover:bg-red-600 transition-all ease-in"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4.5v15m7.5-7.5h-15"
              />
            </svg>
          </button>
        </div>
        <div className="flex flex-wrap justify-center gap-3 mt-8">
          {notes.map((note) => (
            <KwikNote
              key={note.id}
              id={note.id}
              text={note.text}
              onUpdate={updateNote}
              onDelete={() => deleteNote(note.id)}
            ></KwikNote>
          ))}
        </div>
      </div>
    </>
  );
}

export default App;
