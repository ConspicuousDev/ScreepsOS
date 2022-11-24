const Request = require("../util/Request")

class EnergyRequest extends Request{
    constructor(sender, amount, kernel, priority = 0) {
        super(sender, amount, kernel, priority)
    }
}

module.exports = CreepRequest