#! /usr/bin/env node

class Student {
    private static idCounter = 0;
    public id: number;
    public name: string;
    public courses: string [];
    private balance: number;

    constructor(name:string){
        this.id = Student.idCounter++;
        this.name = name;
        this.courses = [];
        this.balance = 0;
    }

    enroll(course: string, fee: number): void {
        this.courses.push(course)
        this.balance += fee;
    }

    viewBalance(): number{
        return this.balance;
    }

    payTuition(amount: number): void {
        this.balance -= amount;
    }

    showStatus(): void {
        console.log(`Student ID: ${this.id}`);
        console.log(`Student Name: ${this.name}`);
        console.log(`Courses Enrolled: ${this.courses.join(", ")}`);
        console.log(`Balace: ${this.balance}`);
    }
}

import inquirer from "inquirer";

const students: Student[] = [];

async function mainMenu(){
    const choices = [
        'Add New Student',
        'Enroll in Course',
        'View Balance',
        'Pay Tuition',
        'Show Balance',
        'Exit'
    ];

    const answers = await inquirer.prompt([
        {
            type:'list',
            name:'choice',
            message:'What do you want to do?',
            choices: choices
        }
    ]);

    switch(answers.choice){
        case 'Add New Student':
            await addNewStudent();
            break;
        case 'Enroll in Course':
            await enrollInCourse();
            break;
        case 'View Balance':
            await viewBalance();
            break;
        case 'Pay Tuition':
            await payTuition();
            break;
        case 'Show Status':
            await showStatus();
            break;
        case 'Exit':
            console.log('Good Bye!');
            process.exit(0);
    }
    await mainMenu();
}

async function addNewStudent(){
    const answers = await inquirer.prompt([
        {
            type:'input',
            name:'name',
            message:'Enter Student Name: '
        }
    ]);

    const newStudent = new Student (answers.name);
        students.push(newStudent)
    console.log(`Student ${newStudent.name} added with ID ${newStudent.id}`);
}

async function enrollInCourse(){
    const student = await selectStudent();

    const answers = await inquirer.prompt([
        {
            type: 'input',
            name: 'course',
            message: 'Enter Course Name: ',
        },
        {
            type: 'number',
            name: 'fee',
            message: 'Enter Course Fee: ',
        }
    ]);

    student.enroll(answers.course, answers.fee);
    console.log(`Student ${student.name} enrolled in course ${answers.course} with fee ${answers.fee}`)
}

async function viewBalance(){
    const student = await selectStudent();
    console.log(`Student ${student.name} has a balance of ${student.viewBalance()}`);
}

async function payTuition(){
    const student = await selectStudent();

    const answers = await inquirer.prompt([
        {
            type: 'number',
            name: 'account',
            message: 'Enter amount to pay: '
        }
    ]);
    student.payTuition(answers.amount);
    console.log(`Student: ${student.name} paid $${answers.amount}`);
}

async function showStatus(){
    const student = await selectStudent();
    student.showStatus();
}

async function selectStudent(): Promise<Student> {
    const studentChoices = students.map(student => ({
        name: `${student.name} (ID: ${student.id})`,
        value:student.id
    }) );

    const answers = await inquirer.prompt([
        {
            type: 'list',
            name: 'studentId',
            message: 'Select a student', 
            choices: studentChoices
        }
    ]);
    return students.find(student => student.id === answers.studentid)!;
}

mainMenu()