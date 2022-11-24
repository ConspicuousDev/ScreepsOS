const CreepProcess = require("./CreepProcess")
const OSConstants = require("../../util/OSConstants")
const Methods = require("../../util/Methods")

class SmallMinerProcess extends CreepProcess {
    constructor({kernel, parent, data, priority = 0, status = OSConstants.STATUS_CODES.OK}){
        super(`SmallMiner-${data.creepName}`, parent, priority, status, kernel, data)
    }

    run(){
        if(super.run() !== OSConstants.STATUS_CODES.OK) return

        let creep = Game.creeps[this.data.creepName]

        //Check if should go to mining spot
        if(creep.store.getFreeCapacity(RESOURCE_ENERGY) > 0 && !Methods.compareRoomPosition(creep.pos, this.data.miningSpot.pos)){
            this.kernel.logger.log(this.id, "Starting Move Process")
            this.spawnChild(new this.kernel.ProcessTable.MoveToTargetProcess({
                kernel: this.kernel,
                parent: this.id,
                data: {
                    creepName: this.data.creepName,
                    goalPos: this.data.miningSpot.pos
                }
            }))
        }else if(creep.store.getFreeCapacity(RESOURCE_ENERGY) > 0 && Methods.compareRoomPosition(creep.pos, this.data.miningSpot.pos)){
            this.spawnChild(new this.kernel.ProcessTable.MineTargetProcess({
                kernel: this.kernel,
                parent: this.id,
                data: {
                    creepName: this.data.creepName
                }
            }))
            this.kernel.logger.log(this.id, "Starting Mining Process")
        }else if(creep.store.getFreeCapacity(RESOURCE_ENERGY) === 0 && Methods.compareRoomPosition(creep.pos, this.data.miningSpot.pos)){
            //Data has to have a goal inventory/structure to place resource in later on.
            //Send to spawn
            this.kernel.logger.log(this.id, "Starting Move To Storage Process")
        }

        //State Checks



        //Goal Check and run subProcesses:
        //TODO: Make roomwatcher assign mining spot to stand on through data on proccess creation.
    }

}

module.exports = SmallMinerProcess