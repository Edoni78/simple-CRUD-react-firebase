import CreateNote from "./components/CreateNote";
import NotesList from "./components/NotesList";

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200">
      {/* Header */}
      <header className="py-6 text-center">
        <h1 className="text-3xl font-bold text-gray-800">
          Firebase Notes
        </h1>
        <p className="text-gray-500 mt-1">
          Simple CRUD with React & Firebase
        </p>
      </header>

      {/* Main content */}
      <main className="space-y-12">
        <CreateNote />
        <NotesList />
      </main>

      {/* Footer */}
      <footer className="mt-16 pb-6 text-center text-sm text-gray-400">
        Built with React • Firebase • Tailwind
      </footer>
    </div>
  );
}

export default App;
