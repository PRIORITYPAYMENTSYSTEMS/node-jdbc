const ResultSetMetaData = require('./resultSetMetaData');
const Statement = require('./statement');
const {
    isNil,
    isInteger,
    isNumber,
    isBoolean,
    isString,
    isArray,
    every,
} = require('lodash');
const { promiseForMethod } = require('./utils');

class PreparedStatement extends Statement {

    constructor(ps) {
        super(ps);
        this.ps = ps;
    }

    addBatch() {
        this.ps.addBatchSync();
    }
    clearParameters() {
        this.ps.clearParametersSync();
    }
    getMetaData() {
        return promiseForMethod(() => new ResultSetMetaData(this.ps.getMetaDataSync()));
    }

    // val must be a java.math.BigDecimal
    setBigDecimal(index, val) {
        return promiseForMethod(() => {
            if (!isInteger(index) || !isNumber(val))
                throw new Error('INVALID ARGUMENTS');
            this.ps.setBigDecimalSync(index, val);
        });
    }
    setBoolean(index, val) {
        return promiseForMethod(() => {
            if (!isInteger(index) || !isBoolean(val))
                throw new Error('INVALID ARGUMENTS');
            this.ps.setBooleanSync(index, val);
        });
    }
    setByte(index, val) {
        return promiseForMethod(() => {
            if (!isInteger(index) || !isInteger(val))
                throw new Error('INVALID ARGUMENTS');
            this.ps.setByteSync(index, val);
        });
    }
    setBytes(index, val) {
        return promiseForMethod(() => {
            if (!isInteger(index) || (!isArray(val) || !every(val, isInteger)))
                throw new Error('INVALID ARGUMENTS');
            this.ps.setBytesSync(index, val);
        });
    }
    setDouble(index, val) {
        return promiseForMethod(() => {
            if (!isInteger(index) || !isNumber(val))
                throw new Error('INVALID ARGUMENTS');
            this.ps.setDoubleSync(index, val);
        });
    }
    setFloat(index, val) {
        return promiseForMethod(() => {
            if (!isInteger(index) || !isNumber(val))
                throw new Error('INVALID ARGUMENTS');
            this.ps.setFloatSync(index, val);
        });
    }
    setInt(index, val) {
        return promiseForMethod(() => {
            if (!isInteger(index) || !isInteger(val))
                throw new Error('INVALID ARGUMENTS');
            this.ps.setIntSync(index, val);
        });
    }
    setLong(index, val) {
        return promiseForMethod(() => {
            if (!isInteger(index) || !isInteger(val))
                throw new Error('INVALID ARGUMENTS');
            this.ps.setLongSync(index, val);
        });
    }
    setString(index, val) {
        return promiseForMethod(() => {
            if (!isInteger(index) || !isString(val))
                throw new Error('INVALID ARGUMENTS');
            this.ps.setStringSync(index, val);
        });
    }

    setDate(index, val, calendar) {
        return promiseForMethod(() => {
            if (!isInteger(index) || !isString(val))
                throw new Error('INVALID ARGUMENTS');
            if (isNil(calendar))
                this.ps.setDateSync(index, val);
            else
                this.ps.setDateSync(index, val, calendar);
        });
    }
    setTime(index, val, calendar) {
        return promiseForMethod(() => {
            if (!isInteger(index) || !isString(val))
                throw new Error('INVALID ARGUMENTS');
            if (isNil(calendar))
                this.ps.setTimeSync(index, val);
            else
                this.ps.setTimeSync(index, val, calendar);
        });
    }
    setTimestamp(index, val, calendar) {
        return promiseForMethod(() => {
            if (!isInteger(index) || !isNumber(val))
                throw new Error('INVALID ARGUMENTS');
            if (isNil(calendar))
                this.ps.setTimestampSync(index, val);
            else
                this.ps.setTimestampSync(index, val, calendar);
        });
    }
    // Not implemented.
    getParameterMetaData() {
        throw new Error("NOT IMPLEMENTED");
    }
    setArray(index, val) {
        throw new Error("NOT IMPLEMENTED");
    }
    setAsciiStream(index, val, length) {
        throw new Error("NOT IMPLEMENTED");
    }
    // length is optional, or can be int or long.
    setBinaryStream(index, val, length) {
        throw new Error("NOT IMPLEMENTED");
    }
    // length is optional.  Must be java.lang.Long if supplied, only valid with
    // InputStream.
    // val can be java.sql.Blob or java.io.InputStream
    setBlob(index, val, length) {
        throw new Error("NOT IMPLEMENTED");
    }
    setCharacterStream(index, val, length) {
        throw new Error("NOT IMPLEMENTED");
    }
    setClob(index, val, length) {
        throw new Error("NOT IMPLEMENTED");
    }
}

module.exports = PreparedStatement;
