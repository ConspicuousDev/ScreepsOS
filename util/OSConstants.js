module.exports = {
    STATUS_CODES: {
        DEAD: "DEAD",
        OK: "OK",
        WAITING_CHILD: "WAITING_CHILD"
    },
    PROCESS_PRIORITIES: {
        KERNEL: 100,
        USER: 0
    },
    ROOM_OWNERSHIP: {
        UNCLAIMED: "UNCLAIMED",
        OWNED: "OWNED",
        ENEMY: "ENEMY"
    },
    CREEP_BODIES: {
        SMALL_MINER: [WORK, CARRY, MOVE],
    },
    COLORS: {
        FREE: "#2B59C3",
        OCCUPIED: "#FF9F1C",
        QUEUED: "#2EC4B6",
        EXIT: "#00FF00",
        ENERGY_SOURCE: "#FFFF00"
    }
}