module.exports = {
    compareRoomPosition(pos1, pos2){
        return pos1.x === pos2.x && pos1.y === pos2.y && pos1.roomName === pos2.roomName
    },
    findPath(pos1, pos2){
        return Game.rooms[pos1.roomName].findPath(new RoomPosition(pos1.x, pos1.y, pos1.roomName), new RoomPosition(pos2.x, pos2.y, pos2.roomName))
    }
}