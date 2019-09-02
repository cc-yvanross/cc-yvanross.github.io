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

describe('GET /api/v1/sgb/students', () => {



  it('responds with successful call for students ', () => {
    return chai.request(app).get('/api/v1/sgb/students')
      .then(res => { 
        expect(res.status).to.equal(200);
        expect(res.status).to.equal(200);
        expect(res).to.be.json;
        expect(res.body.data).to.deep.include.members(students)
      });
  });
});

