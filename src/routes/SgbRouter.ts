import { Router, Request, Response, NextFunction } from 'express';
import { SgbController } from '../core/SgbController';

export class SgbRouter {
	router: Router;
	controller: SgbController;  // contrôleur GRASP
	router_latency: number;

	/**
	* Initialize the Router
	*/
	constructor() {
		this.router_latency = 0;
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
			console.log("courses called with token", token)
			this.generate_latency();

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
			let course = req.params.course
			let data = this.controller.students(token,course);
			this.generate_latency();
			console.log(data)
			res.status(200)
			.send({
				message: 'Success',
				status: res.status,
				data: data
			});
		} catch (error) {
			//console.log(error)
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
			this.generate_latency();

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

			this.generate_latency();
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
			console.log("coursesNotes called with token", token, " and course ", course)
			let data = this.controller.courseNotes(token,course);
			this.generate_latency();
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
			console.log("login called with email: " + req.query.email + " and password")
			this.generate_latency();
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
			console.log("clearNotes called with token ", token)
			this.controller.clearNotes(token);
			this.generate_latency();
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

	public latency(req: Request, res: Response, next: NextFunction) { 
		try {		
			this.router_latency = req.query.value			// Invoquer l'opération système (du DSS) dans le contrôleur GRASP
			console.log("latency called with value of ", this.router_latency)
			this.generate_latency()
			res.status(200)
			.send({
				message: 'Success',
				status: res.status,
				data: this.router_latency
			});
		} catch(error) {
			console.log(error)
			let code = 500; // internal server error
			res.status(code).json({ error: error.toString() });
		}
	}

	public generate_latency() {
		var sleep = require('system-sleep');
		let latency:number = this.router_latency
		let random:number = Math.random()
		let delay:number  = +(random * latency * 1000).toFixed();
		console.log("Use a latency of", delay, ' milliseconds')
		sleep(delay)
	}

	//apidoc -i src/routes/ -o docs/

	/**
	* Take each handler, and attach to one of the Express.Router's
	* endpoints.
	*/
	init() {
	/**
	 * @api {get} /v1/latency?value=latence  Latence
	 * @apiDescription Ajuster la latence pour modifier la performance du serveur SGB. 
	 * @apiName GetUser
	 * @apiGroup Test
	 * @apiVersion 1.0.0
	 * 
	 * @apiParam {float} latence valeur de la latence en secondes..
	 *
	 */
		this.router.get('/latency', this.latency.bind(this)); // pour .bind voir https://stackoverflow.com/a/15605064/1168342
	/**
	 * @api {get} /v1/notes/clear Annuler la latence
	 * @apiGroup Test
	 * @apiDescription Effacter toutes les notes dans le serveur SGB.  Pour vous faciliter la tâche et ne pas avoir à redémarrer le serveur à chaque fois qu'on veut nettoyer les données.  Peut aussi être très utile pour la réalisation des tests automatisées.
	 * @apiVersion 1.0.0
	 */
	 this.router.get('/notes/clear', this.clearNotes.bind(this)); // pour .bind voir https://stackoverflow.com/a/15605064/1168342
	/**
	 * @api {get} /v1/login?email=email&password=password Login
	 * @apiGroup Application
	 * @apiDescription Authentification de l'usager et récupération du token d'authentification
	 * @apiVersion 1.0.0
	 *
	 * @apiParam {String} email courriel de l'usager.  A vérifier mais vous pouvez surement utiliser teacher3@gmail.com dans nécessairement encoder la valeur numérique et le @ commercial.
	 * @apiParam {String} password non vérifier. 
	 *
	 * @apiSuccess (200) {String}  authentification token à mettre dans le header pour faire les autres requêtes.
	 */
		this.router.get('/login', this.login.bind(this)); // pour .bind voir https://stackoverflow.com/a/15605064/1168342
	/**
	 * @api {get} /v1/student/note?course=course&type=type&type_id=type_id&note=note Ajouter note étudiant
	 * @apiGroup Etudiant
	 * @apiDescription Ajout d'une note dans le dossier de l'étudiant
	 * @apiVersion 1.0.0
	 *
	 * @apiParam {Integer} course id du cours.
	 * @apiParam {String} type, devoir ou Questionnaire
	 * @apiParam {Integer} type_id id du devoir ou du questionnaire
	 * @apiParam {Float}  note note de l'étudiant à enregistrerpassword non vérifier. 
	 *
	 * @apiSuccess (200) {String} json
	 */

	 this.router.get('/student/note', this.studentNote.bind(this)); // pour .bind voir https://stackoverflow.com/a/15605064/1168342
		
		/**
	 * @api {get} /v1/student/notes Notes de l'étudiant
	 * @apiGroup Etudiant
	 * @apiDescription Récupération de toutes les notes d'un étudiant
	 * @apiVersion 1.0.0
	 *
	 * @apiParam {String} token Authentification token dans le header.
	 *
	 *  @apiSuccess (200) {String} json
	 */

		this.router.get('/student/notes', this.studentNotes.bind(this)); // pour .bind voir https://stackoverflow.com/a/15605064/1168342
		

		/**
	 * @api {get} /v1/courses Cours de l'enseignant 
	 * @apiGroup Enseignant
	 * @apiDescription Récupération de tous les cours enseigner par un enseignant
	 * @apiVersion 1.0.0
	 *
	 * @apiParam {String} token Authentification token dans le header.
	 *
	 *  @apiSuccess (200) {String} json
	 */
	 this.router.get('/courses', this.courses.bind(this)); // pour .bind voir https://stackoverflow.com/a/15605064/1168342
		
/**
	 * @api {get} /v1/course/:course/notes Notes des étudiants 
	 * @apiGroup Enseignant
	 * @apiDescription Récupération de toutes les notes des étudiants d'un cours
	 * @apiVersion 1.0.0
	 *
	 * @apiParam {String} token Authentification token dans le header.
   * @apiParam {Integer} :course id du cours .
	 *
	 *  @apiSuccess (200) {String} json
	 */
		this.router.get('/course/:course/notes', this.courseNotes.bind(this)); // pour .bind voir https://stackoverflow.com/a/15605064/1168342
		
/**
	 * @api {get} /v1/course/:course/students Inscriptions
	 * @apiGroup Enseignant
	 * @apiDescription  Récupération de tous les étudiants inscrit a un cours
	 * @apiVersion 1.0.0
	 *
	 * @apiParam {String} token Token d'authentification de l'enseignant dans le header.
   * @apiParam {Integer} :course id du cours .
	 *
	 *  @apiSuccess (200) {String} json
	 */

		this.router.get('/course/:course/students', this.students.bind(this)); // pour .bind voir https://stackoverflow.com/a/15605064/1168342
	}
}

// exporter its configured Express.Router
export const sgbRoutes = new SgbRouter();
sgbRoutes.init();
