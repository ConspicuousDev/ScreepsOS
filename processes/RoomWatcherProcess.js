const Process = require("../kernel/Process")
const OSConstants = require("../util/OSConstants")

class RoomWatcherProcess extends Process{
    
    constructor({kernel, data, priority = 0}){
        super(`RoomWatcher-${data.roomName}`, null, priority, OSConstants.STATUS_CODES.OK, kernel, data)
    }

    run(){
        let room = Game.rooms[this.data.roomName]

        if(!(this.data.roomName in Game.rooms)) return; /* TODO send scout if needed */
        
        this.checkOwnership(room)
        
        if(!("energySources" in this.data)) this.loadEnergySources(room)
        if(!("roomExits" in this.data)) this.loadExits(room)
        if(!("workers" in this.data)) this.data.workerProcesses = []

        //TODO: Change this check for a [Do we have enough workers to extract max energy check]
        if(this.data.workerProcesses.length < 1){
            tryCreateWorker()
        }

        this.highlightExits(this.kernel)
        this.highlightSources(this.kernel)
    }

    /** @param {Room} room */
    checkOwnership(room){
        if(room.controller.my){
            this.data.roomOwnership = OSConstants.ROOM_OWNERSHIP.OWNED
            return
        }
        this.data.roomOwnership = room.controller.owner ? OSConstants.ROOM_OWNERSHIP.ENEMY : OSConstants.ROOM_OWNERSHIP.UNCLAIMED 
    }

    /** @param {Room} room */
    loadEnergySources(room){
        let sources = room.find(FIND_SOURCES)

        //this.data.energySources = {}
        /*sources.forEach(entry => {
            let entryId = entry.id
            delete entry.room
            delete entry.roomName
            delete entry.id

            console.log(entryId)
            this.data.energySources[entryId] = entry
        })*/

        this.data.energySources = {}
        for (const entry in sources) {
            this.data.energySources[sources[entry].id] = { pos: sources[entry].pos, energy: sources[entry].energy, energyCapacity: sources[entry].energyCapacity }
        }

        
        //this.data.energySources = sources
        //this.kernel.logger.log(this.id, JSON.stringify(room.find(FIND_SOURCES)))
    }

    /** @param {Room} room */
    loadExits(room){
        let foundExits = room.find(FIND_EXIT)

        //roomExits.map(entry => {delete entry.roomName; return entry})
        //console.log(JSON.stringify( roomExits.map(entry => {delete entry.roomName; return entry})))

        this.data.roomExits = []
        for (const entry in foundExits) {
            this.data.roomExits[entry] = {x: foundExits[entry].x, y: foundExits[entry].y}
        }
    }

    /** @param {Kernel} kernel */
    highlightExits(){
        this.data.roomExits.forEach(element => this.kernel.drawer.setHighlightSquare({x: element.x, y: element.y, roomName: this.data.roomName}, "#00FF00", .5));
    }

    /** @param {Kernel} kernel */
    highlightSources(){
        Object.keys(this.data.energySources).forEach(element => this.kernel.drawer.setHighlightSquare({x: this.data.energySources[element].pos.x, y: this.data.energySources[element].pos.y, roomName: this.data.roomName}, "#FFFF00", .5));
    }

    tryCreateWorker(){

    }
}


module.exports = RoomWatcherProcess