const Process = require("../../util/Process")
const OSConstants = require("../../util/OSConstants")

class BasicMinerProcess extends Process{
    constructor({id, kernel, parent, data, priority = 0, status = OSConstants.STATUS_CODES.OK}){
        super(id, parent, priority, status, kernel, data)
    }

    run(){

    }
}

module.exports = BasicMinerProcess