const {
    isNil,
    isNumber,
    isInteger,
    tail,
    isArray,
    isObject,
    isBoolean,
    isString,
} = require('lodash');
const CallableStatement = require('./callableStatement');
const PreparedStatement = require('./preparedStatement');
const DatabaseMetaData = require('./databaseMetadata');
const Statement = require('./statement');
const SQLWarning = require('./sqlwarning');
const java = require("./jinst").getInstance();

const { promiseForMethod } = require('./utils');

class Connection {

    constructor(conn) {
        this.conn = conn;
        this.txniso = (function() {
            const txniso = [];

            txniso[java.getStaticFieldValue("java.sql.Connection", "TRANSACTION_NONE")] = "TRANSACTION_NONE";
            txniso[java.getStaticFieldValue("java.sql.Connection", "TRANSACTION_READ_COMMITTED")] = "TRANSACTION_READ_COMMITTED";
            txniso[java.getStaticFieldValue("java.sql.Connection", "TRANSACTION_READ_UNCOMMITTED")] = "TRANSACTION_READ_UNCOMMITTED";
            txniso[java.getStaticFieldValue("java.sql.Connection", "TRANSACTION_REPEATABLE_READ")] = "TRANSACTION_REPEATABLE_READ";
            txniso[java.getStaticFieldValue("java.sql.Connection", "TRANSACTION_SERIALIZABLE")] = "TRANSACTION_SERIALIZABLE";

            return txniso;
        })();
    }

    abort(executor) {
        throw new Error('NOT IMPLEMENTED');
    }
    clearWarnings() {
        return promiseForMethod(() => this.conn.clearWarningsSync());
    }
    close() {
        return promiseForMethod(() => !isNil(this.conn) ? this.conn.closeSync() : null);
    }
    commit() {
        return promiseForMethod(() => this.conn.commitSync());
    }

    createArrayOf(typeName, objArr) {
        throw new Error('NOT IMPLEMENTED');
    }
    createBlob() {
        throw new Error('NOT IMPLEMENTED');
    }
    createClob() {
        throw new Error('NOT IMPLEMENTED');
    }
    createNClob() {
        throw new Error('NOT IMPLEMENTED');
    }
    createSQLXML() {
        throw new Error('NOT IMPLEMENTED');
    }
    createStruct(typeName, attrArr) {
        throw new Error('NOT IMPLEMENTED');
    }
    nativeSQL(sql) {
        throw new Error('NOT IMPLEMENTED');
    }
    setNetworkTimeout(executor, ms) {
        throw new Error('NOT IMPLEMENTED');
    }
    setTypeMap(map) {
        throw new Error('NOT IMPLEMENTED');
    }

    createStatement() {
        return promiseForMethod(() => {
            if (!Object.values(arguments).every(isNumber)) throw new Error('INVALID ARGUMENTS');
            if (Object.values(arguments).length > 0 && (Object.values(arguments).length < 2 || Object.values(arguments).length > 3))
                throw new Error('INVALID ARGUMENT COUNT');
            return new Statement(this.conn.createStatementSync.apply(this.conn, Object.values(arguments)));
        });
    }
    getAutoCommit() {
        return promiseForMethod(() => this.conn.getAutoCommitSync());
    }
    getCatalog() {
        return promiseForMethod(() => this.conn.getCatalogSync());
    }
    getClientInfo(name) {
        return promiseForMethod(() => new Statement(this.conn.getClientInfoSync(name)));
    }
    getHoldability() {
        return promiseForMethod(() => this.conn.getHoldabilitySync());
    }
    getMetaData() {
        return promiseForMethod(() => new DatabaseMetaData(this.conn.getMetaDataSync()));
    }
    getNetworkTimeout() {
        return promiseForMethod(() => this.conn.getNetworkTimeoutSync());
    }
    getSchema() {
        return promiseForMethod(() => this.conn.getSchemaSync());
    }
    getTransactionIsolation() {
        return promiseForMethod(() => this.txniso[this.conn.getTransactionIsolationSync()]);
    }
    getTypeMap() {
        return promiseForMethod(() => this.conn.getTypeMapSync());
    }
    getWarnings() {
        return promiseForMethod(() => new SQLWarning(this.conn.getWarningsSync()));
    }
    isClosed() {
        return this.conn.isClosedSync();
    }
    isReadOnly() {
        return this.conn.isReadOnlySync();
    }
    isValid(connection) {
        return this.conn.isValidSync(connection);
    }

    prepareCall(sql, rsType, rsConcurrency, rsHoldability) {
        const args = Array.prototype.slice.call(arguments);
        return promiseForMethod(() => {
            if (!sql || (rsType && !rsConcurrency)) {
                throw new Error('INVALID ARGUMENTS');
            }
            if (!isString(sql) ||
                (!isNil(rsType) && !isInteger(rsType)) ||
                (!isNil(rsConcurrency) && !isInteger(rsConcurrency)) ||
                (!isNil(rsHoldability) && !isInteger(rsHoldability))) {
                throw new Error('INVALID ARGUMENT TYPE');
            }
            return new CallableStatement(this.conn.prepareCallSync.apply(this.conn, args));
        });
    }

    /**
     * Creates a prepared statement and returns it via callback.
     *
     * @param {string} sql - SQL query
     * @param {(number | number[] | string[])} [arg1] - autoGeneratedKeys, resultSetType, or an array of numbers or strings
     * @param {number} [arg2] - resultSetConcurrency
     * @param {number} [arg3] - resultSetHoldability
     */
    prepareStatement(sql, arg1, arg2, arg3) {
        const args = Array.prototype.slice.call(arguments);
        return promiseForMethod(() => {
            // The first arg (sql) must be present
            if (! args[0]) {
                throw new Error('INVALID ARGUMENTS');
            }

            // Check arg1, arg2, and arg3 for validity.  These arguments must
            // be numbers if given, except for the special case when the first
            // of these arguments is an array and no other arguments are given.
            // In this special case, the array must be a string or number array.
            //
            // NOTE: _.tail returns all but the first argument, so we are only
            // processing arg1, arg2, and arg3; and not sql (or callback, which
            // was already removed from the args array).
            let invalidArgs = false;
            tail(args).forEach((arg, idx) => {
                // Check for the special case where arg1 can be an array of strings or numbers
                // if arg2 and arg3 are not given
                if (idx === 0 && isArray(arg) && isNil(args[2]) && isNil(args[3])) {
                    if (!(arg.every(isString) || arg.every(isInteger))) {
                        invalidArgs = true;
                        return false;
                    }
                    return;
                }

                // Other than the special case above, these args must be numbers
                if (!isInteger(arg)) {
                    invalidArgs = true;
                    return false;
                }
            });

            if (invalidArgs || !isString(sql)) {
                throw new Error('INVALID ARGUMENTS');
            }

            // Forward modified arguments to _conn.prepareStatement
            return new PreparedStatement(this.conn.prepareStatementSync.apply(this.conn, args));
        });
    }
    releaseSavepoint(savePoint) {
        return promiseForMethod(() => {
            if (!isString(savePoint) || isNil(savePoint)) {
                throw new Error('INVALID ARGUMENTS');
            }
            return this.conn.releaseSavepointSync(savePoint);
        });
    }
    rollback(savePoint) {
        const args = Array.prototype.slice.call(arguments);
        return promiseForMethod(async () => {
            if (await this.getAutoCommit()) {
                throw new Error('Need to set autoCommit to false');
            }
            this.conn.rollbackSync.apply(this.conn, args);
        });
    }

    setAutoCommit(autoCommit) {
        return promiseForMethod(() => {
            if (isNil(autoCommit) || !isBoolean(autoCommit))
                throw new Error('Invalid autoCommit value - must be boolean');
            return this.conn.setAutoCommitSync(autoCommit);
        });
    }
    setCatalog(catalogName) {
        return promiseForMethod(() => {
            if (isNil(catalogName) || !isString(catalogName))
                throw new Error('Invalid catalog name');
            return this.conn.setCatalogSync(catalogName);
        });
    }
    setClientInfo(props, name, value) {
        return promiseForMethod(() => {
            if (isObject(props) && isNil(name) && isNil(value)) {
                return this.conn.setClientInfoSync(props);
            } else if (isNil(props) && isString(name) && isString(value)) {
                return this.conn.setClientInfoSync(name, value);
            } else {
                throw new Error('INVALID ARGUMENTS');
            }
        });
    }

    setHoldability(holdability) {
        return promiseForMethod(() => {
            if (isNil(holdability) || !isInteger(holdability))
                throw new Error('Invalid holdability');
            this.conn.setHoldabilitySync(holdability);
        });
    }
    setReadOnly(readonly) {
        return promiseForMethod(() => {
            if (isNil(readonly) || !isBoolean(readonly))
                throw new Error('Invalid readonly value - must be boolean');
            this.conn.setReadOnlySync(readonly);
        });
    }
    setSavepoint(name) {
        const args = Array.prototype.slice.call(arguments);
        return promiseForMethod(() => {
            if (!(isNil(name) || isString(name))) {
                throw new Error('INVALID ARGUMENTS');
            }
            return this.conn.setSavepointSync.apply(this.conn, args);
        });
    }
    setSchema(schema) {
        return promiseForMethod(() => {
            if (isNil(schema) || !isString(schema))
                throw new Error('Invalid schema - must be a string');
            return this.conn.setSchemaSync(schema);
        });
    }
    setTransactionIsolation(txniso) {
        return promiseForMethod(() => {
            if (isNil(txniso) || !isInteger(txniso))
                throw new Error('Invalid isolation value - must be an integer');
            return this.conn.setTransactionIsolationSync(txniso);
        });
    }
}

module.exports = Connection;
