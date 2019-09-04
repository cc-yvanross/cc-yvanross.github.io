import * as chai from 'chai';
import chaiHttp = require('chai-http');
import app from '../src/App';

chai.use(chaiHttp);
const expect = chai.expect;

let testNom1 = 'Jean-Marc';
let testNom2 = 'Pierre';
let courses = require('../src/courses.json');
let students = require('../src/students.json');
  
describe('GET /api/v1/sgb/courses', () => {
  it('responds with successful call for courses ', () => {
    return chai.request(app).get('/api/v1/sgb/courses')
      .then(res => {
        expect(res.status).to.equal(200);
        expect(res).to.be.json;
        expect(res.body.data).to.deep.include.members(courses)
      });
  });

});

describe('GET /api/v1/sgb/courses/:filename', () => {
  it('responds with failing call for courses ', () => {
    return chai.request(app).get('/api/v1/sgb/courses/invalid')
      .then(res => {
        expect(res.status).to.equal(400);
        expect(res).to.be.json;
        expect(res.body.error).to.equal("Cannot read filename: invalid")
      });
  });

});

describe('GET /api/v1/sgb/students', () => {
  it('responds with successful call for students ', () => {
    return chai.request(app).get('/api/v1/sgb/students')
      .then(res => { 
        expect(res.status).to.equal(200);
        expect(res).to.be.json;
        expect(res.body.data).to.deep.include.members(students)
      });
  });
});

describe('GET /api/v1/sgb/students/:filename', () => {
  it('responds with failling call for students ', () => {
    return chai.request(app).get('/api/v1/sgb/students/invalid')
      .then(res => { 
        expect(res.status).to.equal(400);
        expect(res).to.be.json;
        expect(res.body.error).to.equal("Cannot read filename: invalid")
      });
  });
});
describe('GET /api/v1/sgb/invalid_route', () => {
  it('responds with successful call for invalid_route ', () => {
    return chai.request(app).get('/api/v1/sgb/invalid_route')
      .then(res => { 
        expect(res.status).to.equal(404);
      });
  });
});

