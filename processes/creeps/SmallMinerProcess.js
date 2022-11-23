const Process = require("../../kernel/Process")
const OSConstants = require("../../util/OSConstants")

class SmallMinerProcess extends Process {
    constructor({kernel, parent, data, priority = 0}){
        super(`SmallMinerProcess-${data.creepName}`, parent, priority, OSConstants.STATUS_CODES.OK, kernel, data)
    }

    run(){
        if(this.data.startTick===Game.time+3) return;
        if(!(this.data.creepName in Game.creeps)){
            this.kill()
            return
        }

        this.kernel.logger.log(this.id, "WORKING", "#00FF00")
    }
}

module.exports = SmallMinerProcess