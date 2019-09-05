import { Router, Request, Response, NextFunction } from 'express';
import { SgbController } from '../core/SgbController';

export class SgbRouter {
	router: Router;
	controller: SgbController;  // contrôleur GRASP

	/**
	* Initialize the Router
	*/
	constructor() {
		this.controller = new SgbController();  // init contrôleur GRASP
		this.router = Router();
		this.init();
	}

	/**
	* lister les cours
	*/
	public courses(req: Request, res: Response, next: NextFunction) {
		try {
			// Invoquer l'opération système (du DSS) dans le contrôleur GRASP
			let token = req.headers.token as string
			let courses = this.controller.courses(token);

			res.status(200)
			.send({
				message: 'Success',
				status: res.status,
				data: courses
			});
		} catch (error) {
			let code = 500; // internal server error
			res.status(code).json({ error: error.toString() });
		}
	}

	public students(req: Request, res: Response, next: NextFunction) {
		try {
			// Invoquer l'opération système (du DSS) dans le contrôleur GRASP
			let token = req.headers.token as string
			let data = this.controller.students(token);
			res.status(200)
			.send({
				message: 'Success',
				status: res.status,
				data: data
			});
		} catch (error) {
			let code = 500; // internal server error
			res.status(code).json({ error: error.toString() });
		}
	}

	public studentNote(req: Request, res: Response, next: NextFunction) { 
		try {
			// Invoquer l'opération système (du DSS) dans le contrôleur GRASP
			let token = req.headers.token as string
			let data = this.controller.studentNote(
				token,
				req.query.course,
				req.query.type,
				req.query.type_id,
				req.query.note);

			res.status(200)
			.send({
				message: 'Success',
				status: res.status,
				data: data
			});
		} catch (error) {
			let code = 500; // internal server error
			res.status(code).json({ error: error.toString() });
		}
	}


	public studentNotes(req: Request, res: Response, next: NextFunction) { 
		try {
			// Invoquer l'opération système (du DSS) dans le contrôleur GRASP
			let token = req.headers.token as string
			let data = this.controller.studentNotes(token);

			res.status(200)
			.send({
				message: 'Success',
				status: res.status,
				data: data
			});
		} catch (error) {
			let code = 500; // internal server error
			res.status(code).json({ error: error.toString() });
		}
	}

	public courseNotes(req: Request, res: Response, next: NextFunction) { 
		try {
			// Invoquer l'opération système (du DSS) dans le contrôleur GRASP
			let token = req.headers.token as string
			let course = req.params.course
			let data = this.controller.courseNotes(token,course);

			res.status(200)
			.send({
				message: 'Success',
				status: res.status,
				data: data
			});
		} catch (error) {
			let code = 500; // internal server error
			res.status(code).json({ error: error.toString() });
		}
	}
	public login(req: Request, res: Response, next: NextFunction) { 
		try {
			// Invoquer l'opération système (du DSS) dans le contrôleur GRASP
			let token = this.controller.login(req.query.email,req.query.password);

			res.status(200)
			.send({
				message: 'Success',
				status: res.status,
				token: token
			});
		} catch (error) {
			let code = 500; // internal server error
			res.status(code).json({ error: error.toString() });
		}
	}


	public clearNotes(req: Request, res: Response, next: NextFunction) { 
		try {		
			// Invoquer l'opération système (du DSS) dans le contrôleur GRASP
			let token = req.headers.token as string
			this.controller.clearNotes(token);

			res.status(200)
			.send({
				message: 'Success',
				status: res.status
			});
		} catch(error) {
			let code = 500; // internal server error
			res.status(code).json({ error: error.toString() });
		}
	}



	/**
	* Take each handler, and attach to one of the Express.Router's
	* endpoints.
	*/
	init() {
		this.router.get('/notes/clear', this.clearNotes.bind(this)); // pour .bind voir https://stackoverflow.com/a/15605064/1168342
		this.router.get('/login', this.login.bind(this)); // pour .bind voir https://stackoverflow.com/a/15605064/1168342
		this.router.get('/student/note', this.studentNote.bind(this)); // pour .bind voir https://stackoverflow.com/a/15605064/1168342
		this.router.get('/student/notes', this.studentNotes.bind(this)); // pour .bind voir https://stackoverflow.com/a/15605064/1168342
		this.router.get('/courses', this.courses.bind(this)); // pour .bind voir https://stackoverflow.com/a/15605064/1168342
		this.router.get('/course/:course/notes', this.courseNotes.bind(this)); // pour .bind voir https://stackoverflow.com/a/15605064/1168342
		this.router.get('/students', this.students.bind(this)); // pour .bind voir https://stackoverflow.com/a/15605064/1168342
	}

}

// exporter its configured Express.Router
export const sgbRoutes = new SgbRouter();
sgbRoutes.init();
