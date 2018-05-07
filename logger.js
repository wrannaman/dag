"use strict";
const { createLogger, format, transports } = require('winston');
const { combine, timestamp, label, prettyPrint } = format;
const fs = require('fs')
require('winston-daily-rotate-file');
const { log_level, log_path, env } = require('./config.json');

const levels = {
  error: 0,
  warn: 1,
  info: 2,
  verbose: 3,
  debug: 4,
  silly: 5
}

// Create the log path if it doesn't exist. winston wont create the folder for you.
const exists = fs.existsSync(`${log_path}`)
if (!exists) fs.mkdirSync(`${log_path}`);

// file rotation
const rotationTransport = new (transports.DailyRotateFile)({
  filename: `${log_path}/ap_dag-%DATE%.log`,
  datePattern: 'YYYY-MM-DD',
  zippedArchive: true,
  maxSize: '20m',
  maxFiles: '7d',
});

let date = new Date().toISOString();
const logFormat = format.printf(function(info) {
  return `${date}-${info.level}: ${JSON.stringify(info.message, null, 4)}\n`;
});

const logger = createLogger({
  level: log_level,
  // format: combine(
  //   prettyPrint()
  // ),
  transports: [
    //
    // - Write to all logs with level `info` and below to `combined.log`
    // - Write all logs error (and below) to `error.log`.
    //
    // new transports.File({ filename: `${log_path}/error.log`, level: 'error' }),
    // new transports.File({ filename: `${log_path}/combined.log` }),
    rotationTransport,
    new transports.Console({
     level: log_level,
     format: format.combine(format.colorize(), logFormat)
   })
  ]
});

module.exports = logger;
