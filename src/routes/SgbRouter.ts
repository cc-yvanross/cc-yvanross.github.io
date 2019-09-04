import { Router, Request, Response, NextFunction } from 'express';
import { SgbController } from '../core/SgbController';

export class SgbRouter {
  router: Router;
  controller: SgbController;  // contrôleur GRASP

  /**
   * Initialize the Router
   */
  constructor() {
  console.log("Sgb Router initialized")
    this.controller = new SgbController();  // init contrôleur GRASP
    this.router = Router();
    this.init();
  }

  /**
   * lister les cours
   */
  public courses(req: Request, res: Response, next: NextFunction) {
    console.log("courses called")
    let filename = req.params.filename;

    try {
      // Invoquer l'opération système (du DSS) dans le contrôleur GRASP
      let courses = this.controller.courses(filename);

      res.status(200)
        .send({
          message: 'Success',
          status: res.status,
          data: courses
        });
    } catch (error) {
      let code = 500; // internal server error
      let message = "Cannot read filename: " + filename; // error.toString();
      if (error.message.indexOf("Cannot find module 'invalid'") == 0) {
        code = 400; // bad request }
      }
      res.status(code).json({ error: message });
    }
  }

 public students(req: Request, res: Response, next: NextFunction) {
    console.log("students called")
    let filename = req.params.filename;
    try {
      // Invoquer l'opération système (du DSS) dans le contrôleur GRASP
      let data = this.controller.students(filename);
      res.status(200)
        .send({
          message: 'Success',
          status: res.status,
          data: data
        });
    } catch (error) {
      let code = 500; // internal server error
      let message = "Cannot read filename: " + filename; // error.toString();
      if (error.message.indexOf("Cannot find module 'invalid'") == 0) {
        code = 400; // bad request }
      }
      res.status(code).json({ error: message });
    }
  }



  /**
     * Take each handler, and attach to one of the Express.Router's
     * endpoints.
     */
  init() {
    this.router.get('/courses/:filename', this.courses.bind(this)); // pour .bind voir https://stackoverflow.com/a/15605064/1168342
    this.router.get('/courses', this.courses.bind(this)); // pour .bind voir https://stackoverflow.com/a/15605064/1168342
    this.router.get('/students/:filename', this.students.bind(this)); // pour .bind voir https://stackoverflow.com/a/15605064/1168342
    this.router.get('/students', this.students.bind(this)); // pour .bind voir https://stackoverflow.com/a/15605064/1168342
  }

}

// exporter its configured Express.Router
export const sgbRoutes = new SgbRouter();
sgbRoutes.init();
