import * as chai from 'chai';
import chaiHttp = require('chai-http'); 
import app from '../src/App';
import * as md5 from 'md5';
import { Course } from '../src/core/Course';
import { Student } from '../src/core/Student';



chai.use(chaiHttp);
const expect = chai.expect;
const should = chai.should();

let courses = require('../src/data/courses.json');
let students = require('../src/data/students.json');

function loginTeacher(){
	chai.request(app).get('/api/v1/login?email=teacher%2B3%40gmail.com&password=1234')
	.then(res => {
		expect(res.body.token).to.eq(md5('teacher+3@gmail.com'))
	});
}

function loginStudent(){
	chai.request(app).get('/api/v1/login?email=student%2B3%40gmail.com&password=1234')
	.then(res => { 
		expect(res.status).to.equal(200);
		expect(res).to.be.json;
		expect(res.body.token).to.equal(md5('student+3@gmail.com'))
	});
}

function insertNote(course:number,type:string,type_id:number,note:number){
	chai.request(app).get('/api/v1/student/note?course='+course.toString()+'&type='+type+'&type_id='+type_id.toString()+'&note='+note.toString())
	.set('token',md5('student+3@gmail.com'))
	.then(res => {
		expect(res.status).to.equal(200);
		expect(res).to.be.json;
	});
}


describe('Login',()=>{

	it('Login teacher',()=>{
		return loginTeacher()
	})

	it('Login student ', () => {
		return loginStudent()
	});

	it('Login with invalid email',()=>{
		return chai.request(app).get('/api/v1/login?email=invalid%2B3%40gmail.com&password=1234')
		.then(res => {
			expect(res.status).to.equal(500);
			expect(res).to.be.json;
			expect(res.body.error).to.eq('Error: Email and password do not match a student or a teacher')
		});
	})

	it('Login teacher V2',()=>{
		// console.log("Login teacher V2")
		return chai.request(app).get('/api/v2/login?email=teacher%2B3%40gmail.com&password=1234')
		.then(res => {
			expect(res.status).to.equal(200);
			// console.log(res.body);
			expect(res).to.be.json;
			expect(res.body.token).to.eq(md5('teacher+3@gmail.com'))
			expect(res.body.user['email']).to.eq("teacher+3@gmail.com")
		});
	})

	it('Login student V2',()=>{
		return chai.request(app).get('/api/v2/login?email=student%2B3%40gmail.com&password=1234')
		.then(res => {
			expect(res.status).to.equal(200);
			expect(res).to.be.json;
			expect(res.body.token).to.eq(md5('student+3@gmail.com'))
			expect(res.body.user['email']).to.eq("student+3@gmail.com")
		});
	})

	it('LoginV2 with invalid email',()=>{
		return chai.request(app).get('/api/v2/login?email=invalid%2B3%40gmail.com&password=1234')
		.then(res => {
			expect(res.status).to.equal(500);
			expect(res).to.be.json;
			expect(res.body.error).to.eq('Error: Email and password do not match a student or a teacher')
		});
	})
});

describe('Teacher', ()=>{
	beforeEach(async()=>{
		loginTeacher()
	})

	describe('Get Courses', () => {

		it('responds with successful call for courses with valid teacher token ', () => {
			let result = JSON.stringify([ Course.fromId(3),Course.fromId(4)])
				return chai.request(app).get('/api/v1/courses')
				.set('token',md5('teacher+3@gmail.com'))
				.then(res => {
					expect(res.status).to.equal(200);
					expect(res).to.be.json;
					expect(res.body.data).to.equal(result)
				});
			});

		it('responds with error if call for courses with invalid teacher token ', () => {
			return chai.request(app).get('/api/v1/courses')
			//.set('token',)
			.then(res => {
				expect(res.status).to.equal(500);
				expect(res).to.be.json;
				expect(res.body.error).to.equal("Error: Teacher token not found")
			});
		});
	});

	describe('get Students', () => {
		it('responds with successful call for students with valid teacher token ', () => {
			let students_following_course_3_teached_by_teacher_3 = JSON.stringify([ Student.fromId(2),Student.fromId(6) ]);
					return chai.request(app).get('/api/v1/course/3/students')
					.set('token',md5('teacher+3@gmail.com'))
					.then(res => { 
						expect(res.status).to.equal(200);
						expect(res).to.be.json;
						expect(res.body.data).to.equal(students_following_course_3_teached_by_teacher_3)
					});
				});

		it('responds with error if call for students with invali teacher token ', () => {
			return chai.request(app).get('/api/v1/course/3/students')
			.set('token','invalid_token')
			.then(res => { 
				expect(res.status).to.equal(500);
				expect(res).to.be.json;
				expect(res.body.error).to.equal('Error: Teacher token not found')
			});
		});

		it('responds with error if teacher do not teach course', () => {
			return chai.request(app).get('/api/v1/course/3/students')
			.set('token',md5('teacher+1@gmail.com'))
			.then(res => { 
				expect(res.status).to.equal(500);
				expect(res).to.be.json;
				expect(res.body.error).to.equal('Error: This teacher do not give this course')
			});
		});
	});

});

describe('Student notes', () => {
	beforeEach(async()=>{
		loginStudent()
	})

	it('responds with error if call for note is done without authentification token', () => {
		return chai.request(app).get('/api/v1/student/note?course=12&type=devoir&type_id=13&note=65.02')
		.then(res => {
			expect(res.status).to.equal(500);
			expect(res).to.be.json;
			expect(res.body.error).to.equal('Error: Student token not found')

		});
	});

	it('responds with successful call for notes', () => {
		insertNote(1,"devoir",2,33.33);
		insertNote(4,"devoir",5,66.66);

		return chai.request(app).get('/api/v1/student/notes/')
		.set('token',md5('student+3@gmail.com'))
		.then(res => {
			expect(res.status).to.equal(200);
			expect(res).to.be.json;

			expect(res.body.data[0]).to.deep.equal({ course: 1, type: 'devoir', type_id: 2, note: 33.33 });
			expect(res.body.data[1]).to.deep.equal({ course: 4, type: 'devoir', type_id: 5, note: 66.66 });
		});

	});


	it('responds with error on call for notes with invalid authentification', () => {
		insertNote(1,'devoir',2,33.33)

		return chai.request(app).get('/api/v1/student/notes/')
		.set('token',md5('invalid@gmail.com'))
		.then(res => {
			expect(res.status).to.equal(500);
			expect(res).to.be.json;
			expect(res.body.data).to.equal(undefined)
		});

	});

});

describe('student courses',()=>{

	beforeEach(async()=>{
		loginStudent(),6
	});	

it('responds with all courses of a student', () => {
		let expected_results = JSON.stringify([Course.fromId(5),Course.fromId(6)])

		return chai.request(app).get('/api/v1/student/courses')
		.set('token',md5('student+3@gmail.com')) 
		.then(res => {
			expect(res.status).to.equal(200);
			expect(res).to.be.json;
			expect(res.body.data).to.deep.equal(expected_results)
		});		
	});
});	

it('responds fail if token is teacher', () => {
	return chai.request(app).get('/api/v1/student/courses')
	.set('token',md5('teacher+3@gmail.com')) 
	.then(res => {
		expect(res.status).to.equal(500);
			expect(res).to.be.json;
			expect(res.body.error).to.equal('Error: Student token not found')
	});		
});	

describe('course notes',()=>{
	beforeEach(async()=>{
		loginStudent()
		insertNote(1,'devoir',2,33.33)
		insertNote(2,'questionnaire',5,66.66)		
		insertNote(2,'questionnaire',7,88.88)			
		loginTeacher()
	});	

	it('responds with all notes for a course', () => {
		return chai.request(app).get('/api/v1/course/2/notes')
		.set('token',md5('teacher+3@gmail.com'))
		.then(res => {
			expect(res.status).to.equal(200);
			expect(res).to.be.json;
			expect(res.body.data[0]).to.deep.equal({"course": 2,"student": 3,"note": 66.66,"type": "questionnaire","type_id": 5})
			expect(res.body.data[1]).to.deep.equal({"course": 2,"student": 3,"note": 88.88,"type": "questionnaire","type_id": 7})
		});		
	});

	it('responds with and error when trying to get notes for a course without authentification', () => {
		return chai.request(app).get('/api/v1/course/2/notes')
		.set('token','')
		.then(res => {
			expect(res.status).to.equal(500);
			expect(res).to.be.json;
			expect(res.body.error).to.equal('Error: Teacher token not found')
		});		
	});


});

describe('test utility',()=>{

	beforeEach(async()=>{
		loginStudent()
		insertNote(1,'devoir',2,33.33)
	});	

	it('respond successfuly when changing server latency', () => {
		return chai.request(app).get('/api/v1/latency?value=1.1')
		.then(res => {
			expect(res.status).to.equal(200);
			expect(res).to.be.json;
			expect(res.body.data).to.equal(1.1)
		});	
	});

	it('respond with error if trying to clear notes without login', () => {
		return chai.request(app).get('/api/v1/notes/clear')
		.set('token','')
		.then(res => {
			expect(res.status).to.equal(500);
			expect(res).to.be.json;
			expect(res.body.error).to.equal('Error: Teacher token not found')
		});	
	});

	it('clear all notes', () => {
		loginTeacher()

		chai.request(app).get('/api/v1/notes/clear')
		.set('token',md5('teacher+3@gmail.com'))
		.then(res => {
			expect(res.status).to.equal(200);
			expect(res).to.be.json;
			expect(res.body.data).to.equal(undefined)
		});	

		return chai.request(app).get('/api/v1/course/1/notes')
		.set('token',md5('teacher+3@gmail.com'))
		.then(res => {
			expect(res.status).to.equal(200);
			expect(res).to.be.json;
			expect(res.body.data).to.deep.equal([])
		});	
	});

	it('fail to set student note when teacher do not give course', () => {
		loginTeacher()

		return chai.request(app).post('/api/v1/note?student_id=1&course_id=1&type=Question&type_id=1&note=99.99')
		.set('token',md5('teacher+3@gmail.com'))
		.then(res => {
			expect(res.status).to.equal(500);
			expect(res).to.be.json;

			expect(res.body.error).to.equal("Error: This teacher do not give this course")
		});	
	});


	it('fail to set student note when student do not follow course', () => {
		loginTeacher()

		return chai.request(app).post('/api/v1/note?student_id=3&course_id=1&type=Question&type_id=1&note=99.99')
		.set('token',md5('teacher+1@gmail.com'))
		.then(res => {
			expect(res.status).to.equal(500);
			expect(res).to.be.json;

			expect(res.body.error).to.equal("Error: This student to not follow this course")
		});	
	});

	it('set student note', () => {
		loginTeacher()

		return chai.request(app).post('/api/v1/note?student_id=1&course_id=1&type=Question&type_id=1&note=99.99')
		.set('token',md5('teacher+1@gmail.com'))
		.then(res => {
			expect(res.status).to.equal(200);
			expect(res).to.be.json;
		});	
	});
});

