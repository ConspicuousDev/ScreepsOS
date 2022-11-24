const Process = require("../util/Process")
const OSConstants = require("../util/OSConstants")

class DrawProcess extends Process{
    highlightSquares = {}
    lines = []

    constructor({id, kernel, data = {}, status = OSConstants.STATUS_CODES.OK}){
        super(id, null, OSConstants.PROCESS_PRIORITIES.KERNEL, status, kernel, data)
    }

    run(){
        Object.keys(this.highlightSquares).forEach(key => {
            let square = this.highlightSquares[key]
            Game.rooms[square.pos.roomName].visual.rect(square.pos.x-.5, square.pos.y-.5, 1, 1, {fill: square.color, opacity: square.opacity})
        })
        this.lines.forEach(line => Game.rooms[line.pos1.roomName].visual.line(line.pos1, line.pos2, {opacity: line.opacity, color: line.color}))

        this.highlightSquares = {}
        this.lines = []
    }

    highlightSquare({ x, y, roomName }, color = "#FFFFFF", opacity = .5){
        this.highlightSquares[`${x}-${y}-${roomName}`] = {...{
            pos: {
                x: x,
                y: y,
                roomName: roomName
            },
            color: color,
            opacity: opacity
        }}
    }
    drawLine(pos1, pos2, color = "#FFFFFF", opacity = .5){
        this.lines.push({
            pos1: pos1,
            pos2: pos2,
            color: color,
            opacity: color
        })
    }

    drawPath(path, roomName, color = "#00FF00", opacity = .5){
        for(let i = 0; i < path.length-1; i++){
            let node1 = path[i]
            let node2 = path[i+1]
            this.drawLine(
                    {
                        x: node1.x,
                        y: node1.y,
                        roomName: roomName
                    },
                    {
                        x: node2.x,
                        y: node2.y,
                        roomName: roomName
                    },
                    color,
                    opacity
            )
        }
    }
}

module.exports = DrawProcess