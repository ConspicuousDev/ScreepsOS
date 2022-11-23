const OSConstants = require("../util/OSConstants")

class Process {
    constructor(id, parent, priority, status, kernel, data = {}){
        this.id = id
        this.parent = parent
        this.priority = priority
        this.status = status
        this.kernel = kernel
        this.type = this.constructor.name
        this.data = data
    }

    serialize(){
        return {
            id: this.id,
            parent: this.parent,
            priority: this.priority,
            status: this.status,
            type: this.type,
            data: this.data
        }
    }

    run(){
        throw new Error("Method not implemented.")
    }

    kill(){
        this.status = OSConstants.STATUS_CODES.DEAD
        this.kernel.logger.log(this.id, "Killed", "#FF0000")
        this.kernel.killProcess(this.id, this.priority)
    }

    spawnChild(process){
        this.status = OSConstants.STATUS_CODES.WAITING_CHILD
        this.kernel.registerProcess(process)
    }
}

module.exports = Process