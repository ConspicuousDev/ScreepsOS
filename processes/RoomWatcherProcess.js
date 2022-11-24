const Process = require("../util/Process")
const OSConstants = require("../util/OSConstants")
class RoomWatcherProcess extends Process{

    constructor({kernel, data, priority = 0, status = OSConstants.STATUS_CODES.OK}){
        super(`RoomWatcher-${data.roomName}`, null, priority, status, kernel, data)
    }

    run(){
        if(!(this.data.roomName in Game.rooms)) return
        let room = Game.rooms[this.data.roomName]
        this.checkOwnership(room)
        if(!("exits" in this.data)) this.loadExits(room)

        //Check for Energy Source processes if not, create them
        //SourceManagerProcess data : {id}

        if(!("sourceProcesses" in this.data)){
            this.data.sourceProcesses = []
            let sources = room.find(FIND_SOURCES)
            for (const source in sources) {
                console.log(sources[source].id)
                let newProc = new this.kernel.ProcessTable.SourceManagerProcess({id: `SourceManager-${sources[source].id}`, parent: this.id, priority: this.priority, status: OSConstants.STATUS_CODES.OK, kernel: this.kernel, data: {id: sources[source].id}})
                this.spawnChild(newProc, OSConstants.STATUS_CODES.OK)
            }
        }


        this.highlightExits(this.kernel)
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
    loadExits(room){
        let exits = room.find(FIND_EXIT)
        this.data.exits = []
        Object.keys(exits).forEach(key => {
            this.data.exits.push({
                pos: {
                    x: exits[key].x,
                    y: exits[key].y,
                    roomName: room.name
                }
            })
        })
    }
    
    highlightExits(){
        this.data.exits.forEach(exit => this.kernel.drawer.highlightSquare(exit.pos, OSConstants.COLORS.EXIT, .5));
    }
}


module.exports = RoomWatcherProcess