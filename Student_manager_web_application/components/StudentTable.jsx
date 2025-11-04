// src/components/StudentTable.jsx
import React from "react";

export default function StudentTable({students = [], onEdit, onDelete}){
  return (
    <table className="w-full border-collapse">
      <thead>
        <tr>
          <th className="border p-1">ID</th>
          <th className="border p-1">Name</th>
          <th className="border p-1">Email</th>
          <th className="border p-1">Enroll</th>
          <th className="border p-1">GPA</th>
          <th className="border p-1">Actions</th>
        </tr>
      </thead>
      <tbody>
        {students.map(s => (
          <tr key={s.id}>
            <td className="border p-1">{s.id}</td>
            <td className="border p-1">{s.firstName} {s.lastName}</td>
            <td className="border p-1">{s.email}</td>
            <td className="border p-1">{s.enrollmentDate || ''}</td>
            <td className="border p-1">{s.gpa ?? ''}</td>
            <td className="border p-1">
              <button onClick={()=>onEdit(s)} className="mr-2 px-2 py-1 border rounded">Edit</button>
              <button onClick={()=>onDelete(s.id)} className="px-2 py-1 border rounded">Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
