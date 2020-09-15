import Multimap = require('multimap');
import { Student } from './Student';
import { Teacher } from './Teacher';
import { Course } from './Course';

export class Notes {
 
	
// /** student will assigne note to a student work */
// 	public note(token:string, student_id:number, course_id:number, type:string, type_id:number, note:number) {
// 		let student:Mailable = this.studentFromToken(token); // will generate an error if token is invalid
// 		let student:Mailable = this.studentFromId(student_id)
// 		if (!student.giveCourse(course_id))
// 			throw new Error("This student do not give this course")

// 		if (!student.followCourse(course_id))
// 			throw new Error("This student to not follow this course")

// 			this.multimap.set(student_id.toString(),{"course": course_id, "type":type, "type_id":type_id, "note":note});
// 	}
	

// 	public studentNote(token:string, course:number, type:string, type_id:number, note:number) {
// 		let student:Mailable = this.studentFromToken(token); // will generate an error if token is invalid
// 		this.multimap.set(student.id.toString(),{"course": course, "type":type, "type_id":type_id, "note":note});
// 	}

// 	public studentNotes(token:string){
// 		let student = this.studentFromToken(token); // will generate an error if token is invalid
// 		return this.multimap.get(student.id.toString());
// 	}


// 	public courseNotes(token:string,course_id:number){
// 		this.studentFromToken(token); // will generate an error if token is invalid
// 		var results = new Array();
// 		this.multimap.forEach((entry,key)=> {
// 			if(entry.course == course_id.toString()){
// 				entry["student"]=key
// 				results.push(entry)
// 			}
// 		})
// 		return results
// 	}

// 	public clearNotes(token:string,){
// 		this.studentFromToken(token); // will generate an error if token is invalid

// 		this.multimap = new Multimap();
// 	}

// 	//*********************************  privte *****************************


}