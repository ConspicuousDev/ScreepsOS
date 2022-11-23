const Process = require("../kernel/Process")
const OSConstants = require("../util/OSConstants")

class SmallMinerProcess extends Process {
    constructor({kernel, parent, data, priority = 0}){
        super(`SmallMinerProcess-${parent}`, null, priority, OSConstants.STATUS_CODES.OK, kernel, data)
    }

    run(){
        this.kernel.logger.log(this.id, "WORKS", "#00FF00")
    }
}