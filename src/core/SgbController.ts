import Multimap = require('multimap');
import md5 = require('md5');

interface Mailable {
	email: string,
	id: number,
}

// classe contrôleur GRASP
export class SgbController {
	multimap:Multimap;

	constructor() {
		this.multimap = new Multimap();
	}

	/**
	*  opérations systèmes
	*/

	public login(email:string, password:string){
		let  students = require('../data/students.json');
		for( var student in students){
			if(students[student].email == email) {
				return md5(email)
			}
		}

		let  teachers = require('../data/teachers.json');
		for( var teacher in teachers){
			if(teachers[teacher].email == email){
				return md5(email)
			}
		}
		throw new Error("Email and password do not match a student or a teacher")
	}

	public courses(token: string) {
		this.teacherFromToken(token); // will generate an error if token is invalid
		let   data = require('../data/courses.json');
		return data;

	}

	public students(token: string) {
		this.teacherFromToken(token); // will generate an error if token is invalid
		let  data = require('../data/students.json');
		return data;
	}

	public studentNote(token:string, course:number, type:string, type_id:number, note:number) {
		let student:Mailable = this.studentFromToken(token); // will generate an error if token is invalid
		this.multimap.set(student.id.toString(),{"course": course, "type":type, "type_id":type_id, "note":note});
	}

	public studentNotes(token:string){
		let student = this.studentFromToken(token); // will generate an error if token is invalid
		return this.multimap.get(student.id.toString());
	}

	public courseNotes(token:string,course_id:number){
		this.teacherFromToken(token); // will generate an error if token is invalid
		var results = new Array();
		this.multimap.forEach((entry,key)=> {
			if(entry.course == course_id.toString()){
				entry["student"]=key
				results.push(entry)
			}
		})
		return results
	}

	public clearNotes(token:string,){
		this.teacherFromToken(token); // will generate an error if token is invalid

		this.multimap = new Multimap();
	}

	//*********************************  privte *****************************



	private teacherFromToken(token){
		let  teachers = require('../data/teachers.json');

		for( var teacher in teachers){
			if(md5(teachers[teacher].email) == token){
				return teachers[teacher]
			}
		}
		throw new Error("Authentification error, token do not match any teacher");
	}

	private studentFromToken(token){
		let  students = require('../data/students.json');

		for( var student in students){
			if(md5(students[student].email) == token){
				return students[student]
			}
		}
		throw new Error("Authentification error, token do not match any student");
	}
}