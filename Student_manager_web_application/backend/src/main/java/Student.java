// src/main/java/com/example/studentmanager/model/Student.java
package com.example.studentmanager.model;
import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "students")
public class Student {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(nullable=false)
  private String firstName;

  @Column(nullable=false)
  private String lastName;

  @Column(nullable=false, unique=true)
  private String email;

  private LocalDate enrollmentDate;
  private Double gpa;

  // constructors, getters, setters
  public Student() {}
  public Student(String firstName, String lastName, String email, LocalDate enrollmentDate, Double gpa) {
    this.firstName = firstName; this.lastName = lastName; this.email = email;
    this.enrollmentDate = enrollmentDate; this.gpa = gpa;
  }
  // getters + setters omitted for brevity — include them in real code (IDE can generate)
  // (or use Lombok if you prefer)
  public Long getId(){return id;}
  public void setId(Long id){this.id=id;}
  public String getFirstName(){return firstName;}
  public void setFirstName(String s){this.firstName=s;}
  public String getLastName(){return lastName;}
  public void setLastName(String s){this.lastName=s;}
  public String getEmail(){return email;}
  public void setEmail(String s){this.email=s;}
  public LocalDate getEnrollmentDate(){return enrollmentDate;}
  public void setEnrollmentDate(LocalDate d){this.enrollmentDate=d;}
  public Double getGpa(){return gpa;}
  public void setGpa(Double g){this.gpa=g;}
}
