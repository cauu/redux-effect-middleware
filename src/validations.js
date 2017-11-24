import _ from 'lodash';

import {
  CALL_API,
  PARALLEL_API,
  CHAIN_API,

  DISPATCH_ONCE,
  DISPATCH_EVERY
} from './constants';
import {
  InvalidActionError,
  UnknownError
} from './errors';

const _everyElemIs = (func) => (obj) => {
  return _.isArray(obj) && obj.every(func);
}

const _everyElemIsFunc = _everyElemIs((i) => _.isFunction(i));

const _everyElemIsString = _everyElemIs((i) => _.isString(i));

/**
 * @desc 
 * 判断action是否合法；
 * 首先判断action的字段，
 * 接着判断各个属性是否满足要求
 */
function validateAction(action) {
  const errors = [];

  const validActionKeys = [
    CALL_API,
    PARALLEL_API,
    CHAIN_API,
    
    'hooker',
    'mode',
    'actionType',
    'formatter',
    'callback'
  ];

  for(let key in action) {
    if(action.hasOwnProperty(key)) {
      if(!!action[key] && !validActionKeys.includes(key)) {
        errors.push(`${key}: ${action[key]} is not a valid action property.`);
      }
    }
  }

  const { hooker, mode, actionType, formatter, callback } = action;

  if(hooker && !_everyElemIsFunc(hooker)) {
    errors.push(`defination of hooker is wrong, is should only contain functions.`);
  }

  if(formatter && !_everyElemIsFunc(formatter)) {
    errors.push(`defination of formatter is wrong, is should only contain functions.`);
  }

  if(callback && !_everyElemIsFunc(callback)) {
    errors.push(`defination of callback is wrong, is should only contain functions.`);
  }

  if(mode && (!_.isString(mode) || !(mode in [DISPATCH_EVERY, DISPATCH_ONCE]))) {
    errors.push(`defination of mode is wrong, it should be ${DISPATCH_EVERY} or ${DISPATCH_ONCE}`);
  }

  if(actionType && !_everyElemIsString(actionType)) {
    errors.push(`defination of actionType is wrong, is should only contain string elements.`);
  } 

  return errors;
}

/**
 * @desc
 * 判断请求参数是否合法
 */
function validateRequest(request) {
  const errors = [];

  const validRequestKeys = [
    'url',
    'method',
    'query',
    'data',
    'meta',
    'successType',
    'errorType',
    'afterSuccess',
    'afterError',
    'config',
    'isErrorResp'
  ];

  for(let key in request) {
    if(request.hasOwnProperty(key)) {
      if(!!request[key] && !validRequestKeys.includes(key)) {
        errors.push(`${key}: ${request[key]} is not a valid request property.`);
      }
    }
  }

  return errors;
}

export {
  validateAction,
  validateRequest
};