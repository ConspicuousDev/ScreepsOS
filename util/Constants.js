module.exports = {
    STATUS_CODES: {
        DEAD: -1,
        OK: 0,
        WAITING_CHILD: 1,
        DONE: 2,
    },
    PROCESS_PRIORITIES: {
        KERNEL: 100,
        USER: 0
    },
    ROOM_OWNERSHIP:{
        UNCLAIMED: 0,
        OWNED: 1,
        ENEMY: 2
    },
    COLORS: {
        FREE: "#2B59C3",
        OCCUPIED: "#FF9F1C",
        QUEUED: "#2EC4B6"
    }
}