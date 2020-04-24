const {
    isString,
    isInteger,
    isNil,
    isObject,
} = require('lodash');

const PreparedStatement = require('./preparedStatement');
const { promiseForMethod } = require('./utils');

class CallableStatement extends PreparedStatement {

    constructor(cs) {
        super(cs);
        this.cs = cs;
    }

    getArray(arg1) {
        return promiseForMethod(() => {
            if (!(isInteger(arg1) || isString(arg1))) throw new Error('INVALID ARGUMENTS');

            return this.cs.getArraySync(arg1);
        });
    }
    getBigDecimal(arg1) {
        return promiseForMethod(() => {
            if (!(isInteger(arg1) || isString(arg1))) throw new Error('INVALID ARGUMENTS');

            return this.cs.getBigDecimalSync(arg1);
        });
    }
    getBlob(arg1) {
        return promiseForMethod(() => {
            if (!(isInteger(arg1) || isString(arg1))) throw new Error('INVALID ARGUMENTS');

            return this.cs.getBlobSync(arg1);
        });
    }
    getBoolean(arg1) {
        return promiseForMethod(() => {
            if (!(isInteger(arg1) || isString(arg1))) throw new Error('INVALID ARGUMENTS');

            return this.cs.getBooleanSync(arg1);
        });
    }
    getByte(arg1) {
        return promiseForMethod(() => {
            if (!(isInteger(arg1) || isString(arg1))) throw new Error('INVALID ARGUMENTS');

            return this.cs.getByteSync(arg1);
        });
    }
    getBytes(arg1) {
        return promiseForMethod(() => {
            if (!(isInteger(arg1) || isString(arg1))) throw new Error('INVALID ARGUMENTS');

            return this.cs.getBytesSync(arg1);
        });
    }
    getClob(arg1) {
        return promiseForMethod(() => {
            if (!(isInteger(arg1) || isString(arg1))) throw new Error('INVALID ARGUMENTS');

            return this.cs.getClobSync(arg1);
        });
    }
    getDate(arg1, arg2) {
        return promiseForMethod(() => {
            if (!(
                (isInteger(arg1) || isString(arg1)) &&
                (isNil(arg2) || isObject(arg2))
            )) {
                throw new Error('INVALID ARGUMENTS');
            }
            return this.cs.getDateSync(arg1, arg2);
        });
    }
    getDouble(arg1) {
        return promiseForMethod(() => {
            if (!(isInteger(arg1) || isString(arg1))) throw new Error('INVALID ARGUMENTS');

            return this.cs.getDoubleSync(arg1);
        });
    }
    getFloat(arg1) {
        return promiseForMethod(() => {
            if (!(isInteger(arg1) || isString(arg1))) throw new Error('INVALID ARGUMENTS');

            return this.cs.getFloatSync(arg1);
        });
    }
    getInt(arg1) {
        return promiseForMethod(() => {
            if (!(isInteger(arg1) || isString(arg1))) throw new Error('INVALID ARGUMENTS');

            return this.cs.getIntSync(arg1);
        });
    }
    getLong(arg1) {
        return promiseForMethod(() => {
            if (!(isInteger(arg1) || isString(arg1))) throw new Error('INVALID ARGUMENTS');

            return this.cs.getLongSync(arg1);
        });
    }
    getNClob(arg1) {
        return promiseForMethod(() => {
            if (!(isInteger(arg1) || isString(arg1))) throw new Error('INVALID ARGUMENTS');

            return this.cs.getNClobSync(arg1);
        });
    }
    getNString(arg1) {
        return promiseForMethod(() => {
            if (!(isInteger(arg1) || isString(arg1))) throw new Error('INVALID ARGUMENTS');

            return this.cs.getNStringSync(arg1);
        });
    }

    getCharacterStream(arg1) {
        throw new Error("NOT IMPLEMENTED");
    }
    getNCharacterStream(arg1) {
        throw new Error("NOT IMPLEMENTED");
    }
    getObject(arg1, arg2) {
        throw new Error("NOT IMPLEMENTED");
    }
    getRef(arg1) {
        throw new Error("NOT IMPLEMENTED");
    }
    getRowId(arg1) {
        throw new Error("NOT IMPLEMENTED");
    }

    getShort(arg1) {
        return promiseForMethod(() => {
            if (!(isInteger(arg1) || isString(arg1))) throw new Error('INVALID ARGUMENTS');

            return this.cs.getShortSync(arg1);
        });
    }

    getSQLXML(arg1) {
        throw new Error("NOT IMPLEMENTED");
    }

    getString(arg1) {
        return promiseForMethod(() => {
            if (!(isInteger(arg1) || isString(arg1))) throw new Error('INVALID ARGUMENTS');

            return this.cs.getStringSync(arg1);
        });
    }

    getTime(arg1, arg2) {
        throw new Error("NOT IMPLEMENTED");
    }
    getTimestamp(arg1, arg2) {
        throw new Error("NOT IMPLEMENTED");
    }
    getURL(arg1) {
        throw new Error("NOT IMPLEMENTED");
    }

    registerOutParameter() {
        return promiseForMethod(() => {
            const args = Array.prototype.slice.call(arguments);
            if ((isInteger(args[0]) && isInteger(args[1]) && isNil(args[2])) ||
                (isInteger(args[0]) && isInteger(args[1]) && isInteger(args[2])) ||
                (isInteger(args[0]) && isInteger(args[1]) && isString(args[2])) ||
                (isString(args[0]) && isInteger(args[1]) && isNil(args[2])) ||
                (isString(args[0]) && isInteger(args[1]) && isInteger(args[2])) ||
                (isString(args[0]) && isInteger(args[1]) && isString(args[2]))) {
                return this.cs.registerOutParameterSync.apply(this.cs, args);
            } else {
                throw new Error("INVALID ARGUMENTS");
            }
        });
    }
}

module.exports = CallableStatement;
