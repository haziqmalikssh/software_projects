// src/App.jsx
import React, {useEffect, useState} from "react";
import { fetchStudents, createStudent, updateStudent, deleteStudent, exportCsv } from "./api";
import StudentTable from "./components/StudentTable";
import StudentForm from "./components/StudentForm";

export default function App(){
  const [students, setStudents] = useState([]);
  const [editing, setEditing] = useState(null);

  async function load(){ const data = await fetchStudents(); setStudents(data); }

  useEffect(()=>{ load(); }, []);

  async function handleCreate(student){
    await createStudent(student);
    load();
  }
  async function handleUpdate(id, student){
    await updateStudent(id, student);
    setEditing(null);
    load();
  }
  async function handleDelete(id){
    if(!confirm("Delete student?")) return;
    await deleteStudent(id);
    load();
  }

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Student Manager</h1>
      <div className="mb-4">
        <StudentForm onSave={handleCreate} editing={editing} onUpdate={handleUpdate} onCancel={()=>setEditing(null)} />
      </div>

      <div className="mb-2 flex gap-2">
        <button onClick={() => exportCsv()} className="px-3 py-1 border rounded">Export CSV</button>
        <button onClick={()=>load()} className="px-3 py-1 border rounded">Refresh</button>
      </div>

      <StudentTable students={students} onEdit={(s)=>setEditing(s)} onDelete={handleDelete} />
    </div>
  );
}
