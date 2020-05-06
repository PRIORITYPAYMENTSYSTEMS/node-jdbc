const {
    isString,
    isInteger,
    isObject,
    isNil,
} = require('lodash');
const jinst = require("./jinst.js");
const java = jinst.getInstance();

const { promiseForMethod } = require('./utils');

const DriverManagerClass = 'java.sql.DriverManager';

module.exports = {
  getConnection: function(url, propsOrUser, password) {
      // Check arguments for validity, and return error if invalid
    const validArgs = url && (
      // propsOrUser and password can both be falsy
      !(propsOrUser || password) ||
      // propsOrUser and password can both be strings
      (isString(propsOrUser) && isString(password)) ||
      // propsOrUser can be an object if password is falsy
      (isObject(propsOrUser) && !password)
    );

    if (!validArgs) {
      throw new Error("INVALID ARGUMENTS");
    }

    // Forward modified arguments to java.callStaticMethod
    return java.callStaticMethodSync.apply(java, [DriverManagerClass, 'getConnection', ...arguments]);
  },
  getLoginTimeout: async () => promiseForMethod(() => java.callStaticMethodSync(DriverManagerClass, 'getLoginTimeout')),
  registerDriver: async driver => promiseForMethod(() => {
      if (isNil(driver) || !isObject(driver) || !driver.constructor.name.startsWith('nodeJava_'))
          throw new Error(`Invalid parameter - must be an instance of a JDBC class.`);
      return java.callStaticMethodSync(DriverManagerClass, 'registerDriver', driver);
  }),
  setLoginTimeout: async seconds => promiseForMethod(() => {
      if (isNil(seconds) || !isInteger(seconds))
          throw new Error('Invalid seconds - must be an integer');
      java.callStaticMethodSync(DriverManagerClass, 'setLoginTimeout', seconds);
      return true;
  }),
};
