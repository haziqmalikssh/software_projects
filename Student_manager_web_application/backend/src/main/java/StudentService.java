// src/main/java/com/example/studentmanager/service/StudentService.java
package com.example.studentmanager.service;
import com.example.studentmanager.model.Student;
import com.example.studentmanager.repo.StudentRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class StudentService {
  private final StudentRepository repo;
  public StudentService(StudentRepository repo){this.repo = repo;}
  public List<Student> listAll(){ return repo.findAll(); }
  public Student save(Student s){ return repo.save(s); }
  public Optional<Student> get(Long id){return repo.findById(id);}
  public void delete(Long id){ repo.deleteById(id); }
}
