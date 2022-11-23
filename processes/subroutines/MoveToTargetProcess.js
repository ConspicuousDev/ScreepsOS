const Process = require("../../kernel/Process")
const OSConstants = require("../../util/OSConstants")

class MoveToTargetProcess extends Process {
    constructor({kernel, data, priority = 0}){
        super(`MoveToTargetProcess-${parent}`, null, priority, OSConstants.STATUS_CODES.OK, kernel, data)
    }

    run(){
        let creep = Game.creeps[data.creepName]
    }
}