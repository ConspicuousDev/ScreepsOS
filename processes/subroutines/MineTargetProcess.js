const CreepProcess = require("../creeps/CreepProcess")
const OSConstants = require("../../util/OSConstants")
const Methods = require("../../util/Methods")

class MineTargetProcess extends CreepProcess {
    constructor({kernel, data, parent, priority = 0, status = OSConstants.STATUS_CODES.OK}){
        super(`MineTarget-${parent}`, parent, priority, status, kernel, data)
    }

    run(){
        super.run()
        if(super.run() !== OSConstants.STATUS_CODES.OK) return

        let creep = Game.creeps[this.data.creepName]

        if(creep.store.getFreeCapacity() === 0){
            this.kill()
        }

        if(!("sourceId" in this.data)){
            this.data.sourceId = creep.pos.findInRange(FIND_SOURCES, 1)[0].id
        }

        creep.harvest(Game.getObjectById(this.data.sourceId))
    }
}

module.exports = MineTargetProcess