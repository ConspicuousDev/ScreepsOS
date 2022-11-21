const Process = require("../kernel/Process")
const OSConstants = require("../util/OSConstants")

class DrawProcess extends Process{
    highlightSquares = {}

    constructor({id, kernel, data = {}}){
        super(id, null, OSConstants.PROCESS_PRIORITIES.KERNEL, OSConstants.STATUS_CODES.OK, kernel, data)
    }

    run(){
        Object.keys(this.highlightSquares).forEach(key => {
            let square = this.highlightSquares[key]
            Game.rooms[square.pos.roomName].visual.rect(square.pos.x-.5, square.pos.y-.5, 1, 1, {fill: square.color, opacity: square.opacity})
        })
    }

    setHighlightSquare({ x, y, roomName }, color, opacity = 1){
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
}

module.exports = DrawProcess