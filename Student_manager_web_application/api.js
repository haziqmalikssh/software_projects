// src/api.js
const BASE = "http://localhost:8080/api/students";

export async function fetchStudents(){ 
  const res = await fetch(BASE);
  return res.json();
}
export async function createStudent(student){
  const res = await fetch(BASE, {method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(student)});
  return res.json();
}
export async function updateStudent(id, student){
  const res = await fetch(`${BASE}/${id}`, {method:'PUT', headers:{'Content-Type':'application/json'}, body:JSON.stringify(student)});
  return res.json();
}
export async function deleteStudent(id){
  await fetch(`${BASE}/${id}`, {method:'DELETE'});
}
export function exportCsv(){
  // initiate download by navigating to the export endpoint
  window.open(`${BASE}/export`, "_blank");
}
