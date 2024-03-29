const OSConstants = require("../util/OSConstants")
const MemoryManager = require("./MemoryManager");

class Kernel{
    constructor() {
        this.ProcessTable = require("./ProcessTable")

        this.manager = new MemoryManager()

        this.processes = this.parseProcesses(this.manager.memory.processes)
                
        if(this.processes.length === 0){
            this.registerProcess(new this.ProcessTable.LoggerProcess({id: "Logger", kernel: this}))
            this.registerProcess(new this.ProcessTable.DrawProcess({id: "Drawer", kernel: this}))
            Object.values(Game.spawns).forEach(spawn => this.registerProcess(new this.ProcessTable.RoomWatcherProcess({kernel: this, data: {roomName: spawn.room.name}})))
        }

        this.logger = this.findProcess("Logger", OSConstants.PROCESS_PRIORITIES.KERNEL)
        this.drawer = this.findProcess("Drawer", OSConstants.PROCESS_PRIORITIES.KERNEL)

        this.logger.log("Kernel", "Started successfully.", "#FFAAAA")
    }

    registerProcess(process){
        if(this.processes[process.priority] == null) this.processes[process.priority] = []
        this.processes[process.priority].push(process)
    }
    findProcess(id, priority = -1){
        if(priority < 0){
            for(priority = 0; priority < this.processes.length; priority++){
                if(!this.processes[priority]) continue
                let process = this.processes[priority].find(process => process.id === id)
                if(process != null) return process
            }
            return undefined
        }
        return this.processes[priority] ? this.processes[priority].find(process => process.id === id) : undefined
    }
    killProcess(id, priority = -1){
        if(priority < 0)
            this.processes.forEach(priorityLevel => priorityLevel = priorityLevel ? priorityLevel.filter(process => process.id !== id) : undefined)
        else
            this.processes[priority] = this.processes[priority] ? this.processes[priority].filter(process => process.id !== id) : undefined
    }

    parseProcesses(processesJson){
        return processesJson.map(priorityLevel => priorityLevel ? priorityLevel.map(process => new this.ProcessTable[process.type]({...process, kernel: this})) : undefined)
    }
    serializeProcesses(processes){
        return processes.map(priorityLevel => priorityLevel ? priorityLevel.map(process => process.serialize()) : undefined)
    }

    canContinue(){
        return Game.cpu.limit === undefined || Game.cpu.getUsed() < Game.cpu.limit* .9
    }
    runProcesses(){
        //console.log("Running processes...")
        for(let priority = 0; priority < this.processes.length; priority++){
            if(!this.processes[priority]) continue
            //console.log(`  Priority level: ${priority}`)
            for(let i = 0; i < this.processes[priority].length; i++){
                if(this.canContinue() && this.processes[priority][i].status === OSConstants.STATUS_CODES.OK){
                    //console.log(`     Ran process ${this.processes[priority][i].id} [${Game.time}]`) 
                    this.processes[priority][i].run()
                }
            }
        }
    }
    deconstruct(){
        this.runProcesses()

        this.manager.memory.processes = this.serializeProcesses(this.processes) 
        this.manager.save()
    }
}

module.exports = Kernel