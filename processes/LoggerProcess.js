const Process = require("../kernel/Process")
const Constants = require("../util/Constants")

class LoggerProcess extends Process{
    lines = []

    constructor({id, kernel, data = {}}){
        super(id, null, Constants.PROCESS_PRIORITIES.KERNEL, Constants.STATUS_CODES.OK, kernel, data)
    }

    run(){
        if(this.lines.length == 0) return
        console.log(this.lines.reduce((a, b) => `${a}${a.length > 0 ? "\n" : ""}${b}`, ""))
        this.lines = []
    }

    log(tag, message, color = "#FFFFFF"){
        this.lines.push(`<font color="${color}">[${tag}] ${message}</font>`)
    }

    raw(message){
        this.lines.push(message)
    }
}

module.exports = LoggerProcess