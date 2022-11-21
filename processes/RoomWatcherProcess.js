const Process = require("../kernel/Process")
const Constants = require("../util/Constants");

class RoomWatcherProcess extends Process{
    
    constructor({kernel, data, priority = 0}){
        super(`RoomWatcher-${data.roomName}`, null, priority, Constants.STATUS_CODES.OK, kernel, data)
    }

    run(){
        let room = Game.rooms[this.data.roomName]

        if(!(this.data.roomName in Game.rooms)) return; /* TODO send scout if needed */
        
        this.checkOwnership(room)
        
        if(!("energySources" in this.data)) this.loadEnergySources(room)
        if(!("roomExits" in this.data)) this.loadExits(room)
        
        //Create function to check max energy for collection.
        //Calculate how many creeps of current size will take to use up all energy
        //Upgrade RC when not needing more creeps, when needing more creeps put energy on spawner to spawn
        //Build expansion to have bigger creeps
        //When enough expansions switch to hauler + miner model (recycle creeps when necessary)
    
        //When huge haulers / miners do remote mining

        //When RCL 8 build final defenses and scout out adjecent rooms and claim one/two and carry it
    
        this.highlightExits(this.kernel)
        this.highlightSources(this.kernel)
    }

    /** @param {Room} room */
    checkOwnership(room){
        if(room.controller.my){
            this.data.roomOwnership = Constants.ROOM_OWNERSHIP.OWNED
            return
        }
        this.data.roomOwnership = room.controller.owner ? Constants.ROOM_OWNERSHIP.ENEMY : Constants.ROOM_OWNERSHIP.UNCLAIMED 
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
    highlightExits(kernel){
        this.data.roomExits.forEach(element => kernel.drawer.setHighlightSquare({x: element.x, y: element.y, roomName: this.data.roomName}, "#00FF00", .5));
    }

    /** @param {Kernel} kernel */
    highlightSources(kernel){
        Object.keys(this.data.energySources).forEach(element => kernel.drawer.setHighlightSquare({x: this.data.energySources[element].pos.x, y: this.data.energySources[element].pos.y, roomName: this.data.roomName}, "#FFFF00", .5));
    }
}


module.exports = RoomWatcherProcess