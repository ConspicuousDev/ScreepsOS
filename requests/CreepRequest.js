const Request = require("../util/Request")

class CreepRequest extends Request{
    constructor(sender, parts, kernel, priority = 0) {
        super(sender, parts, kernel, priority)
    }
}

module.exports = CreepRequest