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
        this.kernel.killProcess(this.id, this.priority)
        this.kernel.logger.log(this.id, "Killed", "#FF0000")
        if(this.parent == null) return
        this.kernel.findProcess(this.parent).notifyParent(this)
    }

    notifyParent(child){
        this.status = OSConstants.STATUS_CODES.OK
    }

    spawnChild(child, status = OSConstants.STATUS_CODES.WAITING_CHILD){
        this.status = status
        child.parent = this.id
        this.kernel.registerProcess(child)
    }
}

module.exports = Process