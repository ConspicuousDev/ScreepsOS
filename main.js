const Kernel = require("./kernel/Kernel")

let kernel = new Kernel()
global.listProcesses = () => kernel.processes.forEach(priority => priority ? priority.forEach(process => console.log(`- ${process.id} (Priority = ${process.priority}) [${process.type}]`)) : null)
global.killProcess = (id, priority = -1) => kernel.killProcess(id, priority)

module.exports.loop = () => {

    kernel.deconstruct()
}