const Kernel = require("./kernel/Kernel")

const kernel = new Kernel()

module.exports.loop = () => {
    kernel.deconstruct()
}