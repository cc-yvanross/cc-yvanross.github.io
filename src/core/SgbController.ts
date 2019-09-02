
// classe contrôleur GRASP
export class SgbController {

    constructor() {
        console.log("Initialiser SbgController");      
    }

    /**
     *  opérations systèmes
     */

    public courses() {
        var data = require('../courses.json');
        return data;
    }

   public students() {
        var data = require('../students.json');
        return data;
    }

}