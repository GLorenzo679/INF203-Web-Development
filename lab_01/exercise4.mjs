"use strict";

import {Student, FrStdt} from "./exercise3.mjs";
import {readFileSync, writeFileSync} from "fs";

export class Promo {
    constructor() {
        this.students = [];
    }

    addStudent(student) {
        this.students.push(student);
    }

    size() {
        return this.students.length;
    }

    get(index) {
        return this.students[index];
    }

    print() {
        this.students.forEach(s => console.log(s.toString()));
    }

    write() {
        return JSON.stringify(this.students);
    }

    read(str) {
        JSON.parse(str).forEach(s => {
            if ("nationality" in s)
                this.addStudent(new FrStdt(s.lastname, s.firstname, s.id, s.nationality));
            else
                this.addStudent(new Student(s.lastname, s.firstname, s.id));
        });
    }

    saveF(fileName) {
        writeFileSync(fileName, this.write());
    }

    readF(fileName) {
        let str = readFileSync(fileName, "utf8");
        this.read(str);
    }
}

// let student1 = new Student("Dupond", "Jean", 1835);
// let student2 = new Student("Doe", "John", 432);
// let student3 = new Student("Dupond", "Alfred", 237);
// let student4 = new Student("Doe", "Jane", 156);
// 
// let promo = new Promo();
// promo.addStudent(student1);
// promo.addStudent(student2);
// promo.addStudent(student3);
// promo.addStudent(student4);
// 
// console.log(promo.size());
// console.log(promo.get(2).toString() + "\n");
// promo.print();
// console.log("\n" + promo.write());
