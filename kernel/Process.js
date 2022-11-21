const Constants = require("../util/Constants")

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
        this.status = Constants.STATUS_CODES.DEAD
        this.kernel.killProcess(this.id, this.priority)
    }
}

module.exports = Process