const Process = require("../../util/Process")
const OSConstants = require("../../util/OSConstants")

class SourceManagerProcess extends Process{
    constructor({id, parent, priority, status, kernel, data}) {
        super(id, parent, priority, status, kernel, data);
    }

    run(){
        if(!("minerProcesses" in this.data)){
            this.data.minerProcesses = []
            this.data.minerSlots = []
            this.loadMinerSlots()
        }
    }


    loadMinerSlots(){
        let source = Game.getObjectById(this.data.id)
        let pos = source.pos
        let room = Game.rooms[pos.roomName]

        for(let xOffset = -1; xOffset < 2; xOffset++) {
            for(let yOffset = -1; yOffset < 2; yOffset++) {
                this.kernel.drawer.highlightSquare({x: pos.x + xOffset, y: pos.y, roomName: room.name})
                if(room.getTerrain().get(pos.x + xOffset, pos.y + yOffset)!==TERRAIN_MASK_WALL){
                    this.data.minerSlots.push({x: pos.x + xOffset, y: pos.y + yOffset, roomName: room.name})
                    let newProc = new this.kernel.ProcessTable.BasicMinerProcess({id: `BasicMiner-${this.data.id}${pos.x}:${pos.y}`, parent: this.id, priority: this.priority, status: OSConstants.STATUS_CODES.OK, kernel: this.kernel, data: {id: this.data.id}})
                    this.spawnChild(newProc, OSConstants.STATUS_CODES.OK)
                    this.data.minerProcesses.push(newProc.id)
                }
            }
        }
    }


}





module.exports = SourceManagerProcess