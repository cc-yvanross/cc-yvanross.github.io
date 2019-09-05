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


describe('Login',()=>{

	it('Login teacher',()=>{
		return chai.request(app).get('/api/v1/sgb/login?email=teacher%2B3%40gmail.com&password=1234')
		.then(res => {
			expect(res.status).to.equal(200);
			expect(res).to.be.json;
			expect(res.body.token).to.eq(md5('teacher+3@gmail.com'))
		});
	})

	it('Login student ', () => {
		return chai.request(app).get('/api/v1/sgb/login?email=student%2B3%40gmail.com&password=1234')
		.then(res => { 
			expect(res.status).to.equal(200);
			expect(res).to.be.json;
			expect(res.body.token).to.equal(md5('student+3@gmail.com'))
		});
	});

	it('Login with invalid email',()=>{
		return chai.request(app).get('/api/v1/sgb/login?email=invalid%2B3%40gmail.com&password=1234')
		.then(res => {
			expect(res.status).to.equal(500);
			expect(res).to.be.json;
			expect(res.body.error).to.eq('Error: Email and password do not match a student or a teacher')
		});
	})
});

describe('Teacher', ()=>{
	beforeEach(async()=>{
		chai.request(app).get('/api/v1/sgb/login?email=teacher%2B3%40gmail.com&password=1234')
		.then(res => {
			expect(res.body.token).to.eq(md5('teacher+3@gmail.com'))
		});
	})

	describe('Get Courses', () => {
		it('responds with successful call for courses with valid teacher token ', () => {
			return chai.request(app).get('/api/v1/sgb/courses')
			.set('token',md5('teacher+3@gmail.com'))
			.then(res => {
				expect(res.status).to.equal(200);
				expect(res).to.be.json;
				expect(res.body.data).to.deep.include.members(courses)

			});
		});

		it('responds with error if call for courses with invalid teacher token ', () => {
			return chai.request(app).get('/api/v1/sgb/courses')
			//.set('token',)
			.then(res => {
				expect(res.status).to.equal(500);
				expect(res).to.be.json;
				expect(res.body.error).to.equal("Error: Authentification error, token do not match current logged in teacher")
			});
		});
	});

	describe('get Students', () => {
		it('responds with successful call for students with valid teacher token ', () => {
			return chai.request(app).get('/api/v1/sgb/students')
			.set('token',md5('teacher+3@gmail.com'))
			.then(res => { 
				expect(res.status).to.equal(200);
				expect(res).to.be.json;
				expect(res.body.data).to.deep.include.members(students)
			});
		});

		it('responds with error if call for students with invali teacher token ', () => {
			return chai.request(app).get('/api/v1/sgb/students')
			.set('token','invalid_token')
			.then(res => { 
				expect(res.status).to.equal(500);
				expect(res).to.be.json;
				expect(res.body.error).to.equal('Error: Authentification error, token do not match current logged in teacher')
			});
		});
	});

});

describe('Student notes', () => {
	beforeEach(async()=>{
		chai.request(app).get('/api/v1/sgb/login?email=student%2B3%40gmail.com&password=1234')
		.then(res => {
			expect(res.body.token).to.eq(md5('student+3@gmail.com'))
		});
	})

	it('responds with error if call for note is done without authentification token', () => {
		return chai.request(app).get('/api/v1/sgb/student/note?course=12&type=devoir&type_id=13&note=65.02')
		.then(res => {
			expect(res.status).to.equal(500);
			expect(res).to.be.json;
			expect(res.body.error).to.equal('Error: Authentification error, token do not match current logged in student')

		});
	});

	it('responds with successful call for notes', () => {
		chai.request(app).get('/api/v1/sgb/student/note?course=1&type=devoir&type_id=2&note=33.33')
		.set('token',md5('student+3@gmail.com'))
		.then(res => {
			expect(res.status).to.equal(200);
			expect(res).to.be.json;
		});
		chai.request(app).get('/api/v1/sgb/student/note?course=4&type=devoir&type_id=5&note=66.66')
		.set('token',md5('student+3@gmail.com'))
		.then(res => {
			expect(res.status).to.equal(200);
			expect(res).to.be.json;
		});
		return chai.request(app).get('/api/v1/sgb/student/notes/')
		.set('token',md5('student+3@gmail.com'))
		.then(res => {
			expect(res.status).to.equal(200);
			expect(res).to.be.json;

			expect(res.body.data[0]).to.deep.equal({ course: '1', type: 'devoir', type_id: '2', note: '33.33' });
			expect(res.body.data[1]).to.deep.equal({ course: '4', type: 'devoir', type_id: '5', note: '66.66' });
		});

	});


	it('responds with error on call for notes with invalid authentification', () => {
		chai.request(app).get('/api/v1/sgb/student/note?course=1&type=devoir&type_id=2&note=33.33')
		.set('token',md5('student+3@gmail.com'))
		.then(res => {
			expect(res.status).to.equal(200);
			expect(res).to.be.json;
		});
		
		return chai.request(app).get('/api/v1/sgb/student/notes/')
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
		chai.request(app).get('/api/v1/sgb/login?email=student%2B3%40gmail.com&password=1234')
		.then(res => {
			expect(res.body.token).to.eq(md5('student+3@gmail.com'))
		});
		
		chai.request(app).get('/api/v1/sgb/student/note?course=1&type=devoir&type_id=2&note=33.33')
		.set('token',md5('student+3@gmail.com'))
		.then(res => {
			expect(res.status).to.equal(200);
			expect(res).to.be.json;
		});
		
		chai.request(app).get('/api/v1/sgb/student/note?course=2&type=questionnaire&type_id=5&note=66.66')
		.set('token',md5('student+3@gmail.com'))
		.then(res => {
			expect(res.status).to.equal(200);
			expect(res).to.be.json;
		});
			
			chai.request(app).get('/api/v1/sgb/student/note?course=2&type=questionnaire&type_id=7&note=88.88')
		.set('token',md5('student+3@gmail.com'))
		.then(res => {
			expect(res.status).to.equal(200);
			expect(res).to.be.json;
		});
		
		chai.request(app).get('/api/v1/sgb/login?email=teacher%2B3%40gmail.com&password=1234')
		.then(res => {
			expect(res.body.token).to.eq(md5('teacher+3@gmail.com'))
		});
	});	

	it('responds with all notes for a course', () => {
		return chai.request(app).get('/api/v1/sgb/course/2/notes')
		.set('token',md5('teacher+3@gmail.com'))
		.then(res => {
			expect(res.status).to.equal(200);
			expect(res).to.be.json;
			expect(res.body.data[0]).to.deep.equal({"course": "2","student": "3","note": "66.66","type": "questionnaire","type_id": "5"})
			expect(res.body.data[1]).to.deep.equal({"course": "2","student": "3","note": "88.88","type": "questionnaire","type_id": "7"})
		});		
	});

	it('responds with and error when trying to get notes for a course without authentification', () => {
		return chai.request(app).get('/api/v1/sgb/course/2/notes')
		.set('token','')
		.then(res => {
			expect(res.status).to.equal(500);
			expect(res).to.be.json;
			expect(res.body.error).to.equal('allo')
		});		
	});


});

describe('test utility',()=>{
	beforeEach(async()=>{
		chai.request(app).get('/api/v1/sgb/login?email=student%2B3%40gmail.com&password=1234')
		.then(res => {
			expect(res.body.token).to.eq(md5('student+3@gmail.com'))
		});
		
		chai.request(app).get('/api/v1/sgb/student/note?course=1&type=devoir&type_id=2&note=33.33')
		.set('token',md5('student+3@gmail.com'))
		.then(res => {
			expect(res.status).to.equal(200);
			expect(res).to.be.json;
		});
		
		
	});	

it('respond with error if trying to clear notes without login', () => {
		 return chai.request(app).get('/api/v1/sgb/notes/clear')
		.set('token','')
		.then(res => {
			expect(res.status).to.equal(500);
			expect(res).to.be.json;
			expect(res.body.error).to.equal(undefined)
		});	
	});

	it('clear all notes', () => {
		chai.request(app).get('/api/v1/sgb/login?email=teacher%2B3%40gmail.com&password=1234')
		.then(res => {
			expect(res.body.token).to.eq(md5('teacher+3@gmail.com'))
		});

		 chai.request(app).get('/api/v1/sgb/notes/clear')
		.set('token',md5('teacher+3@gmail.com'))
		.then(res => {
			expect(res.status).to.equal(200);
			expect(res).to.be.json;
			expect(res.body.data).to.equal(undefined)
		});	

		return chai.request(app).get('/api/v1/sgb/course/1/notes')
		.set('token',md5('teacher+3@gmail.com'))
		.then(res => {
			expect(res.status).to.equal(200);
			expect(res).to.be.json;
			expect(res.body.data).to.deep.equal([])
		});			
	});
});


