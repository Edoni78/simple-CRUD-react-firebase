import { useEffect, useState } from "react";
import {
  collection,
  onSnapshot,
  query,
  orderBy,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase";

const NotesList = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  const [editingNote, setEditingNote] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");

  useEffect(() => {
    const q = query(
      collection(db, "notes"),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setNotes(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // DELETE
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this note?"
    );

    if (!confirmDelete) return;

    try {
      await deleteDoc(doc(db, "notes", id));
    } catch (err) {
      console.error(err);
      alert("Delete failed ❌");
    }
  };

  // OPEN EDIT
  const openEdit = (note) => {
    setEditingNote(note.id);
    setEditTitle(note.title);
    setEditContent(note.content);
  };

  // SAVE EDIT
  const handleUpdate = async () => {
    try {
      await updateDoc(doc(db, "notes", editingNote), {
        title: editTitle,
        content: editContent,
      });

      setEditingNote(null);
    } catch (err) {
      console.error(err);
      alert("Update failed ❌");
    }
  };

  if (loading) {
    return (
      <p className="text-center text-gray-500 mt-8">
        Loading notes...
      </p>
    );
  }

  if (notes.length === 0) {
    return (
      <p className="text-center text-gray-500 mt-8">
        No notes yet.
      </p>
    );
  }

  return (
    <section className="max-w-5xl mx-auto px-4 pb-16">
      <h3 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
        Your Notes
      </h3>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {notes.map((note) => (
          <div
            key={note.id}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5"
          >
            {editingNote === note.id ? (
              <>
                <input
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full border rounded-lg px-3 py-2 mb-2 focus:ring-2 focus:ring-blue-500"
                />

                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  rows={3}
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                />

                <div className="flex gap-2 mt-3">
                  <button
                    onClick={handleUpdate}
                    className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
                  >
                    Save
                  </button>

                  <button
                    onClick={() => setEditingNote(null)}
                    className="flex-1 bg-gray-200 py-2 rounded-lg"
                  >
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <>
                <h4 className="text-lg font-semibold text-gray-800 truncate">
                  {note.title}
                </h4>

                <p className="text-gray-600 mt-2 text-sm line-clamp-4">
                  {note.content}
                </p>

                <div className="flex justify-between items-center mt-4">
                  <button
                    onClick={() => openEdit(note)}
                    className="text-blue-600 text-sm hover:underline"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(note.id)}
                    className="text-red-500 text-sm hover:underline"
                  >
                    Delete
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default NotesList;
