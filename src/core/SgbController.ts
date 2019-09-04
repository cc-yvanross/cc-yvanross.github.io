
// classe contrôleur GRASP
export class SgbController {

    constructor() {
        console.log("Initialiser SbgController");      
    }

    /**
     *  opérations systèmes
     */

    public courses(filename: string) {
        let data
        if(filename == undefined)
            data = require('../courses.json');
        else
            data = require(filename);
            
        return data;
    }

   public students(filename: string) {
        let data;
        if(filename == undefined)
            data = require('../students.json');
        else
            data = require(filename);

        return data;
    }

}