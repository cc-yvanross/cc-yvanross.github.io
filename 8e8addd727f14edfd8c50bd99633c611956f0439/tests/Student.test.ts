import * as chai from 'chai';
import chaiHttp = require('chai-http');
// import { exception } from 'console';

import app from '../src/App';
import { Student } from '../src/core/Student';
// import md5 = require('md5');
import * as md5 from 'md5';

chai.use(chaiHttp);
const expect = chai.expect;

describe('StudentTest', () => {

  it('fail to get student by id', () => {
   expect(() => {Student.fromId(0);}).to.throw('Student id not found');
    // expect(new Student(1)).to.throw(ex);
  });

  it('fail to get student by token', () => {
    expect(() => {Student.fromToken(md5("invalidemail"));}).to.throw('Student token not found');
     // expect(new Student(1)).to.throw(ex);
   });
  
   
  it('get student by Id', () => {
    let student =  Student.fromId(1);
    expect(student.id()).to.equal(1);
    expect(student.name()).to.equal("firstname1 last_name1");
    expect(student.email()).to.equal("student+1@gmail.com");
    expect(student.permanent_code()).to.equal("lastf1")
	});


  it('get student by Token', () => {
    let student =  Student.fromToken(md5("student+1@gmail.com"));
    expect(student.id()).to.equal(1);
    expect(student.name()).to.equal("firstname1 last_name1");
    expect(student.email()).to.equal("student+1@gmail.com");
	});

  it('get student courses', () => {
    let student =  Student.fromId(1);
    expect(student.courses().length).to.equal(2);
	});
  
  it('get student courses', () => {
    let student =  Student.fromId(3);
    expect(student.courses().length).to.equal(2);
	});


});
