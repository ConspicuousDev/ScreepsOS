const Process = require("../../kernel/Process")
const OSConstants = require("../../util/OSConstants")
const Methods = require("../../util/Methods")

class CreepProcess extends Process{
    constructor(id, parent, priority, status, kernel, data){
        super(id, parent, priority, status, kernel, data)
    }


    run(){
        if(this.data.startTick+5 > Game.time) return OSConstants.STATUS_CODES.WAITING_CHILD
        if(!(this.data.creepName in Game.creeps)) {
            this.kill()
            return OSConstants.STATUS_CODES.DEAD
        }
        return OSConstants.STATUS_CODES.OK
    }
}

module.exports = CreepProcess