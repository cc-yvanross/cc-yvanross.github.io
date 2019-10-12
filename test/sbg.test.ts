import * as chai from 'chai';
import chaiHttp = require('chai-http');
import app from '../src/App';
//import {mock, when,verify, instance} from 'ts-mockito'
import md5 = require('md5');


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
		return chai.request(app).get('/api/v2/login?email=teacher%2B3%40gmail.com&password=1234')
		.then(res => {
			expect(res.status).to.equal(200);
			expect(res).to.be.json;
			console.log("TEST")
			console.log(res.body.token)
			console.log(res.body.user)
			expect(res.body.token).to.eq(md5('teacher+3@gmail.com'))
			expect(res.body.user['email']).to.eq("teacher+3@gmail.com")
		});
	})
});

describe('Teacher', ()=>{
	beforeEach(async()=>{
		loginTeacher()
	})

	describe('Get Courses', () => {

		it('responds with successful call for courses with valid teacher token ', () => {
			let result = [ { id: 3,
				sigle: 'LOG210',
				nb_max_student: 5,
				groupe: '03',
				titre: 'Analyse et conception de logiciels',
				date_debut: '2019-09-03',
				date_fin: '2019-11-03' } ]
				return chai.request(app).get('/api/v1/courses')
				.set('token',md5('teacher+3@gmail.com'))
				.then(res => {
					expect(res.status).to.equal(200);
					expect(res).to.be.json;
					expect(res.body.data).to.deep.include.members(result)
				});
			});

		it('responds with error if call for courses with invalid teacher token ', () => {
			return chai.request(app).get('/api/v1/courses')
			//.set('token',)
			.then(res => {
				expect(res.status).to.equal(500);
				expect(res).to.be.json;
				expect(res.body.error).to.equal("Error: Authentification error, token do not match any teacher")
			});
		});
	});

	describe('get Students', () => {
		it('responds with successful call for students with valid teacher token ', () => {
			let students_following_course_3_teached_by_teacher_3 = [ { id: 2,
				first_name: 'firstname2',
				last_name: 'last_name2',
				email: 'student+2@gmail.com',
				permanent_code: 'lastf2' },
				{ id: 6,
					first_name: 'firstname6',
					last_name: 'last_name6',
					email: 'student+6@gmail.com',
					permanent_code: 'lastf6' } ]
					return chai.request(app).get('/api/v1/course/3/students')
					.set('token',md5('teacher+3@gmail.com'))
					.then(res => { 
						expect(res.status).to.equal(200);
						expect(res).to.be.json;
						expect(res.body.data).to.deep.include.members(students_following_course_3_teached_by_teacher_3)
					});
				});

		it('responds with error if call for students with invali teacher token ', () => {
			return chai.request(app).get('/api/v1/course/3/students')
			.set('token','invalid_token')
			.then(res => { 
				expect(res.status).to.equal(500);
				expect(res).to.be.json;
				expect(res.body.error).to.equal('Error: Authentification error, token do not match any teacher')
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
			expect(res.body.error).to.equal('Error: Authentification error, token do not match any student')

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

			expect(res.body.data[0]).to.deep.equal({ course: '1', type: 'devoir', type_id: '2', note: '33.33' });
			expect(res.body.data[1]).to.deep.equal({ course: '4', type: 'devoir', type_id: '5', note: '66.66' });
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
			expect(res.body.data[0]).to.deep.equal({"course": "2","student": "3","note": "66.66","type": "questionnaire","type_id": "5"})
			expect(res.body.data[1]).to.deep.equal({"course": "2","student": "3","note": "88.88","type": "questionnaire","type_id": "7"})
		});		
	});

	it('responds with and error when trying to get notes for a course without authentification', () => {
		return chai.request(app).get('/api/v1/course/2/notes')
		.set('token','')
		.then(res => {
			expect(res.status).to.equal(500);
			expect(res).to.be.json;
			expect(res.body.error).to.equal('Error: Authentification error, token do not match any teacher')
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
			expect(res.body.data).to.equal('1.1')
		});	
	});

	it('respond with error if trying to clear notes without login', () => {
		return chai.request(app).get('/api/v1/notes/clear')
		.set('token','')
		.then(res => {
			expect(res.status).to.equal(500);
			expect(res).to.be.json;
			expect(res.body.error).to.equal('Error: Authentification error, token do not match any teacher')
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
});


