const Process = require("../kernel/Process")
const OSConstants = require("../util/OSConstants")
class RoomWatcherProcess extends Process{

    constructor({kernel, data, priority = 0, status = OSConstants.STATUS_CODES.OK}){
        super(`RoomWatcher-${data.roomName}`, null, priority, status, kernel, data)
    }

    run(){
        let room = Game.rooms[this.data.roomName]

        if(!(this.data.roomName in Game.rooms)) return; /* TODO send scout if needed */

        this.checkOwnership(room)

        if(!("energySources" in this.data)) this.loadEnergySources(room)
        if(!("energyExtractionSpots" in this.data)) this.loadEnergyExtractionSpots(room)
        if(!("exits" in this.data)) this.loadExits(room)
        if(!("workerProcesses" in this.data)) this.data.workerProcesses = []


        //TODO: Change this check for a [Do we have enough workers to extract max energy check]

        //vamos aq colocar q se tiver algum spot not in use, e tivermos energia pra criar um small (vou pegar a constant) pra criar um worker novo em vez de so se tiver 0 dps
        //mas antes vamos fazer achar um spot vazio
        if(this.data.workerProcesses.length < 1){
            let spot = this.data.energyExtractionSpots.find(spot => !spot.takenBy)

            if(!spot) return;

            let creep = this.tryCreateSmallWorker()
            if(creep != null){
                let process = new this.kernel.ProcessTable.SmallMinerProcess({kernel: this.kernel, parent: this.id, priority: this.priority, status: OSConstants.STATUS_CODES.OK, data: {creepName : creep, startTick: Game.time + 9, miningSpot: spot}})
                spot.takenBy = process.id
                this.kernel.registerProcess(process)
                this.data.workerProcesses.push(process.id)
            }
        }



        this.highlightExits(this.kernel)
        this.highlightSources(this.kernel)
        this.highlightExtractionSpots()
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
    /** @param {Room} room */
    loadEnergySources(room){
        let energySources = room.find(FIND_SOURCES)
        this.data.energySources = {}
        Object.keys(energySources).forEach(key => {
            this.data.energySources[energySources[key].id] = {
                pos: energySources[key].pos,
                energy: energySources[key].energy,
                energyCapacity: energySources[key].energyCapacity
            }
        })
    }
    /* @param {Room} room */
    loadEnergyExtractionSpots(room){
        this.data.energyExtractionSpots = []
        let keys = Object.keys(this.data.energySources)
        let positions = keys.map(key => this.data.energySources[key].pos)
        positions.forEach(pos => {
            for(let xOffset = -1; xOffset <= 1; xOffset++){
                for(let yOffset = -1; yOffset <= 1; yOffset++){
                    if(xOffset === 0 && yOffset === 0)
                        continue
                    let terrain = room.getTerrain().get(pos.x + xOffset, pos.y + yOffset)
                    if(terrain !== TERRAIN_MASK_WALL){
                        this.data.energyExtractionSpots.push({
                            pos: {
                                x: pos.x+xOffset,
                                y: pos.y+yOffset,
                                roomName: room.name,
                            },
                            takenBy: null
                        })
                    }
                }
            }
        })
    }

    highlightExits(){
        this.data.exits.forEach(exit => this.kernel.drawer.highlightSquare(exit.pos, OSConstants.COLORS.EXIT, .5));
    }
    highlightSources(){
        Object.keys(this.data.energySources).forEach(element => this.kernel.drawer.highlightSquare({x: this.data.energySources[element].pos.x, y: this.data.energySources[element].pos.y, roomName: this.data.roomName}, OSConstants.COLORS.ENERGY_SOURCE, .5));
    }
    highlightExtractionSpots(){
        this.data.energyExtractionSpots.forEach(spot => {
            this.kernel.drawer.highlightSquare(spot.pos, (spot.takenBy ? OSConstants.COLORS.OCCUPIED : OSConstants.COLORS.FREE))
        })
    }


    tryCreateSmallWorker(){
        let spawners = Game.rooms[this.data.roomName].find(FIND_MY_SPAWNS)

        let chosenSpawner = null
        for(let i = 0; i < spawners.length; i++) {
            let spawn = Game.spawns[spawners[i].name]
            let testResult = spawn.spawnCreep(OSConstants.CREEP_BODIES.SMALL_MINER, `SmallWorker-${Game.time}`, {dryRun: true})
            if(testResult === 0){
                chosenSpawner=spawn
                break
            }
            if(testResult === -6){
                chosenSpawner=testResult
                break
            }
        }

        if(chosenSpawner === -6) return null;
        if(chosenSpawner == null) return null;

        let creepName = `SmallWorker-${Game.time}`
        chosenSpawner.spawnCreep(OSConstants.CREEP_BODIES.SMALL_MINER, creepName)
        return creepName
    }

    notifyParent(child){
        if(child instanceof this.kernel.ProcessTable.SmallMinerProcess){
            console.log(child.id)
            this.data.energyExtractionSpots.find(spot => spot.takenBy === child.id).takenBy = null

            this.data.workerProcesses = this.data.workerProcesses.filter(process => process !== child.id)
        }
    }
}


module.exports = RoomWatcherProcess