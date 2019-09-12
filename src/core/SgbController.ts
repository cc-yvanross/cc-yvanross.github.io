import Multimap = require('multimap');
import md5 = require('md5');

interface Mailable {
	email: string,
	id: number,
}

// classe contrôleur GRASP
export class SgbController {
	multimap:Multimap;
	current_user: Mailable

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
				this.current_user = students[student]
				return md5(email)
			}
		}

		let  teachers = require('../data/teachers.json');
		for( var teacher in teachers){
			if(teachers[teacher].email == email){
				this.current_user = teachers[teacher]
				return md5(email)
			}
		}
		throw new Error("Email and password do not match a student or a teacher")
	}

	public courses(token: string) {
		if(md5(this.current_user.email) != token)
			throw new Error("Authentification error, token do not match current logged in teacher");

		let   data = require('../data/courses.json');
		return data;

	}

	public students(token: string) {
		if(md5(this.current_user.email) != token)
			throw new Error("Authentification error, token do not match current logged in teacher");

		let  data = require('../data/students.json');
		return data;
	}

	public studentNote(token:string, course:number, type:string, type_id:number, note:number) {
		if(md5(this.current_user.email) != token)
			throw new Error("Authentification error, token do not match current logged in student");

		this.multimap.set(this.current_user.id.toString(),{"course": course, "type":type, "type_id":type_id, "note":note});
	}

	public studentNotes(token:string){
		if(md5(this.current_user.email) != token)
			throw new Error("Authentification error, token do not match current logged in student");

		return this.multimap.get(this.current_user.id.toString());
	}

	public courseNotes(token:string,course_id:number){
		if(md5(this.current_user.email) != token)
			throw new Error("Authentification error, token do not match current logged in teacher");

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
		if(md5(this.current_user.email) != token)
			throw new Error("Authentification error, token do not match current logged in teacher");

		this.multimap = new Multimap();
	}


}