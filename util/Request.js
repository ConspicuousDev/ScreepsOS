class Request{
    constructor(process, data, kernel, priority = 0){
        this.type = this.constructor.name
        this.id = `${process.id}-${this.type}-${kernel.manager.memory.requests.length}`
        this.data = data
        this.priority = priority
    }
}

module.exports = Request