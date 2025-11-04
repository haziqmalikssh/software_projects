import { useState } from 'react'
import './App.css'

function App() {
  const [students, setStudents] = useState([])
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    grade: '',
    course: ''
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch('http://localhost:5000/api/students', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      })
      const newStudent = await response.json()
      setStudents([...students, newStudent])
      setFormData({ name: '', email: '', grade: '', course: '' })
    } catch (error) {
      console.error('Error adding student:', error)
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div className="app">
      <h1>Student Manager</h1>
      
      <div className="container">
        <form onSubmit={handleSubmit} className="student-form">
          <h2>Add New Student</h2>
          
          <input
            type="text"
            name="name"
            placeholder="Student Name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          
          <input
            type="text"
            name="grade"
            placeholder="Grade"
            value={formData.grade}
            onChange={handleChange}
            required
          />
          
          <input
            type="text"
            name="course"
            placeholder="Course"
            value={formData.course}
            onChange={handleChange}
            required
          />
          
          <button type="submit">Add Student</button>
        </form>

        <div className="student-list">
          <h2>Students ({students.length})</h2>
          {students.length === 0 ? (
            <p>No students added yet.</p>
          ) : (
            <ul>
              {students.map((student, index) => (
                <li key={index} className="student-card">
                  <h3>{student.name}</h3>
                  <p>Email: {student.email}</p>
                  <p>Grade: {student.grade}</p>
                  <p>Course: {student.course}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}

export default App