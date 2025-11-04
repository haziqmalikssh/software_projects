// src/main/java/com/example/studentmanager/controller/StudentController.java
package com.example.studentmanager.controller;

import com.example.studentmanager.model.Student;
import com.example.studentmanager.service.StudentService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/students")
@CrossOrigin(origins = "http://localhost:5173") // allow Vite dev server; change for prod
public class StudentController {
  private final StudentService service;
  public StudentController(StudentService service){ this.service = service; }

  @GetMapping
  public List<Student> list() { return service.listAll(); }

  @GetMapping("/{id}")
  public ResponseEntity<Student> get(@PathVariable Long id){
    Optional<Student> s = service.get(id);
    return s.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
  }

  @PostMapping
  public ResponseEntity<Student> create(@RequestBody Student student){
    Student saved = service.save(student);
    return ResponseEntity.ok(saved);
  }

  @PutMapping("/{id}")
  public ResponseEntity<Student> update(@PathVariable Long id, @RequestBody Student student){
    return service.get(id).map(existing -> {
      existing.setFirstName(student.getFirstName());
      existing.setLastName(student.getLastName());
      existing.setEmail(student.getEmail());
      existing.setEnrollmentDate(student.getEnrollmentDate());
      existing.setGpa(student.getGpa());
      Student saved = service.save(existing);
      return ResponseEntity.ok(saved);
    }).orElseGet(() -> ResponseEntity.notFound().build());
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<Void> delete(@PathVariable Long id){
    service.delete(id);
    return ResponseEntity.noContent().build();
  }

  // CSV export endpoint
  @GetMapping("/export")
  public ResponseEntity<String> exportCsv(){
    List<Student> students = service.listAll();
    DateTimeFormatter dtf = DateTimeFormatter.ISO_DATE;
    String header = "id,firstName,lastName,email,enrollmentDate,gpa\n";
    String body = students.stream().map(s ->
        String.format("%d,%s,%s,%s,%s,%s",
          s.getId() == null ? 0 : s.getId(),
          escapeCsv(s.getFirstName()),
          escapeCsv(s.getLastName()),
          escapeCsv(s.getEmail()),
          s.getEnrollmentDate() == null ? "" : dtf.format(s.getEnrollmentDate()),
          s.getGpa() == null ? "" : s.getGpa().toString()
        )
    ).collect(Collectors.joining("\n"));
    String csv = header + body;
    String filename = URLEncoder.encode("students.csv", StandardCharsets.UTF_8);
    return ResponseEntity.ok()
            .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"")
            .contentType(MediaType.parseMediaType("text/csv"))
            .body(csv);
  }

  private String escapeCsv(String s){
    if(s==null) return "";
    String out = s.replace("\"", "\"\"");
    if(out.contains(",") || out.contains("\"") || out.contains("\n")) return "\"" + out + "\"";
    return out;
  }
}
