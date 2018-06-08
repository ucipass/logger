const appRoot = require('app-root-path').path;
const path = require("path")
const logRoot = path.join( appRoot, "log" )
var logFile = path.join( logRoot,"all-log.log" )
const caller = require("caller")
const fs = require("fs")
const winston = require("winston")
if (!fs.existsSync(logRoot)){  console.log("Creating log directory",logRoot) ; fs.mkdirSync(logRoot); }

function getNewLogger(name){
    let caller_name = path.relative(appRoot,caller())
    let label = caller_name.replace( new RegExp(path.sep,"g") , '_')
    let caller_file = path.join( logRoot, label+".log")
    let file = name ? path.join( logRoot,  name+".log") : caller_file
    var options = {
        console: {
            level: "info",
            handleExceptions: true,
            json: false,
            label: label,
            colorize: true,
            },
        file: {
            level: "error",
            filename: file,
            handleExceptions: true,
            json: true,
            maxsize: 5242880, // 5MB
            maxFiles: 5,
            colorize: false,
        }
    };
    var logger =  new winston.Logger({
        transports: [
            new winston.transports.File(options.file),
            new winston.transports.Console(options.console)
        ],
        exitOnError: false, // do not exit on handled exceptions
    });
    //log.transports.console.level = "debug"
    return logger
}
module.exports = getNewLogger

