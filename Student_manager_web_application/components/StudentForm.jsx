// src/components/StudentForm.jsx
import React, {useEffect, useState} from "react";

export default function StudentForm({onSave, editing, onUpdate, onCancel}){
  const empty = {firstName:'', lastName:'', email:'', enrollmentDate:'', gpa:''};
  const [form, setForm] = useState(empty);

  useEffect(()=>{ if(editing) {
    setForm({
      firstName: editing.firstName || '',
      lastName: editing.lastName || '',
      email: editing.email || '',
      enrollmentDate: editing.enrollmentDate ? editing.enrollmentDate : '',
      gpa: editing.gpa !== null && editing.gpa !== undefined ? editing.gpa : ''
    });
  } else setForm(empty); }, [editing]);

  function change(e){ setForm({...form, [e.target.name]: e.target.value}); }

  function submit(e){
    e.preventDefault();
    const payload = {
      ...form,
      gpa: form.gpa === "" ? null : parseFloat(form.gpa),
      enrollmentDate: form.enrollmentDate === "" ? null : form.enrollmentDate
    };
    if(editing && editing.id) onUpdate(editing.id, payload);
    else onSave(payload);
    setForm(empty);
  }

  return (
    <form onSubmit={submit} className="grid grid-cols-2 gap-2 border p-3 rounded">
      <input name="firstName" value={form.firstName} onChange={change} placeholder="First name" required />
      <input name="lastName" value={form.lastName} onChange={change} placeholder="Last name" required />
      <input name="email" value={form.email} onChange={change} placeholder="Email" type="email" required />
      <input name="enrollmentDate" value={form.enrollmentDate || ''} onChange={change} placeholder="YYYY-MM-DD" />
      <input name="gpa" value={form.gpa || ''} onChange={change} placeholder="GPA (0.00-4.00)" />
      <div className="col-span-2 flex gap-2">
        <button type="submit" className="px-3 py-1 border rounded">{editing ? "Update" : "Add"}</button>
        {editing && <button type="button" onClick={onCancel} className="px-3 py-1 border rounded">Cancel</button>}
      </div>
    </form>
  );
}
