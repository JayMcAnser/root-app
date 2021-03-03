

import {stringify} from 'flatted'

const _makeMsg = function(message, where) {
  if (typeof message === 'string') {
    return `${where ? '[' + where + '] ': ''}${message}`
  } else {
    // return `${where ? '[' + where + '] ': ''}${ JSON.stringify(message)}`
    return `${where ? '[' + where + '] ': ''}${ stringify(message)}`
  }
}
const log = function(message, where = false) {
  console.log(_makeMsg(message, where))
  }
const info = function(message, where = false) {
  console.log(_makeMsg(message, where))
}
const warn = function(message, where) {
  console.warn(_makeMsg(message, where))
}
const error = function(message, where) {
  try {
    switch (typeof message) {
      case 'string':
        console.error(_makeMsg(message, where));
        break;
      case 'array': // could be an array because it came from the API
        break;
      default:
        console.error(`[logger] type of message is unknown (${typeof message}): ${stringify(message)})`);
    }
  } catch(e) {
    console.error(`[logging.error].internal: ${e.message}`)
  }
}

const debug = function(message, where) {
  console.info(`[debug]: ${(_makeMsg(message, where))}`)
}

class LocationError extends Error {
  constructor(message, where) {
    super(message);
    if (where) {
      this.where = where;
    }
  }
}

class ValidationError extends LocationError {
  constructor(message, errors, where) {
    super(message, where);
    this.errors = errors;
  }
}


/**
 * generate a new action object
 * @param {} message
 * @param {*} where
 */
const newError = function(message, where) {
  let err = new LocationError(typeof message === 'object' ? message.message : message, where);
  return err;
}


export {
  info,
  log,
  warn,
  error,
  debug,
  LocationError,
  ValidationError,
  newError
}
