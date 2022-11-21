class MemoryManager {
    constructor() {
        this.memory = JSON.parse(RawMemory.get())

        //FIRST RUN
        if("creeps" in this.memory || Object.keys(this.memory).length==0){
            this.memory = {
                username: firstSpawn.owner.username,
                processes: [],
                ram: {}
            }
        }
        
    }

    save(){
        RawMemory._parsed = this.memory;
    }
}


/*let m = {
    processes: [
        {id: "minerador1-mainMineProcess", data: {}, priority: 0, parent: "", status: 0},
    ],
    rooms: {
        sim: {
            claimed: true
            miningSpots: [{x:0,y:0,taken:"minerador-1"}],
            walls: [{x:0,y:0,built:false}]
        }
    }

    //RAM HOLDS RESOURCES THAT PROCESSES CAN TAKE OVER
    ram: {
        mineableSpots: [{pos, takenBy: null/name}],
    }
}*/

module.exports = MemoryManager