"use strict";

export class Student {
    constructor(lastName, firstName, id) {
        this.lastName = lastName;
        this.firstName = firstName;
        this.id = id;
    }

    toString() {
        return `student: ${this.lastName}, ${this.firstName}, ${this.id}`;
    }
}

export class FrStdt extends Student{
    constructor(lastName, firstName, id, nationality) {
        super(lastName, firstName, id);
        this.nationality = nationality;
    }

    toString() {
        return `student: ${this.lastName}, ${this.firstName}, ${this.id}, ${this.nationality}`;
    }
}

// let student = new Student("Dupond", "Jean", 1835);
// console.log(student.toString());
// 
// let frStudent = new FrStdt("Doe", "John", 432, "American");
// console.log(frStudent.toString());