const CreepProcess = require("../creeps/CreepProcess")
const OSConstants = require("../../util/OSConstants")
const Methods = require("../../util/Methods")

class MoveToTargetProcess extends CreepProcess {
    constructor({kernel, data, parent, priority = 0, status = OSConstants.STATUS_CODES.OK}){
        super(`MoveToTarget-${parent}`, parent, priority, status, kernel, data)
    }

    run(){
        if(super.run() !== OSConstants.STATUS_CODES.OK) return

        let creep = Game.creeps[this.data.creepName]

        if(Methods.compareRoomPosition(creep.pos, this.data.goalPos))
            this.kill()

        if(!("pathToGoal" in this.data)){
            console.log(JSON.stringify(creep.pos), JSON.stringify(this.data.goalPos))
            this.data.pathToGoal = Methods.findPath(creep.pos, this.data.goalPos)
        }

        this.kernel.drawer.drawPath(this.data.pathToGoal, creep.room.name)
        console.log(creep.moveByPath(this.data.pathToGoal), Game.time)
    }
}

module.exports = MoveToTargetProcess