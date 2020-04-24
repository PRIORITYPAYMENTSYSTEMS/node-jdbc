const Connection = require('../../lib/connection');
const ResultSet = require('../../lib/resultSet');
const Statement = require('../../lib/statement');
const DatabaseMetaData = require('../../lib/databaseMetadata');
const sinon = require('sinon');
const { assert } = require('chai');

const sandbox = sinon.createSandbox();

describe('Connection', function() {

    let testConn = null, stubs = {};

    beforeEach(function() {
        stubs = {
            getConnection: {
                clearWarningsSync: sandbox.stub().returns(null),
                closeSync: sandbox.stub().returns(null),
                commitSync: sandbox.stub().returns(null),
                createStatementSync: sandbox.stub().returns('fake-statement'),
                getAutoCommitSync: sandbox.stub().returns(true),
                getCatalogSync: sandbox.stub().returns('fake-catalog'),
                getClientInfoSync: sandbox.stub().returns('fake-client-info'),
                getHoldabilitySync: sandbox.stub().returns('fake-holdability'),
                getMetaDataSync: sandbox.stub().returns('fake-metadata'),
                getNetworkTimeoutSync: sandbox.stub().returns(0),
                getSchemaSync: sandbox.stub().returns('fake-schema'),
                getTransactionIsolationSync: sandbox.stub().returns(2),
                getTypeMapSync: sandbox.stub().returns('fake-type-map'),
                getWarningsSync: sandbox.stub().returns('fake-warning'),
                isClosedSync: sandbox.stub().returns(false),
                isReadOnlySync: sandbox.stub().returns(false),
                isValidSync: sandbox.stub().returns(true),
                prepareCallSync: sandbox.stub().returns(),
                prepareStatementSync: sandbox.stub().returns(),
                releaseSavepointSync: sandbox.stub().returns('fake-savepoint'),
                rollbackSync: sandbox.stub().returns(),
                setAutoCommitSync: sandbox.stub().returns(),
                setCatalogSync: sandbox.stub().returns(),
                setClientInfoSync: sandbox.stub().returns(),
                setHoldabilitySync: sandbox.stub().returns(),
                setSavepointSync: sandbox.stub().returns('fake-savepoint'),
                setReadOnlySync: sandbox.stub().returns(),
                setSchemaSync: sandbox.stub().returns(),
                setTransactionIsolationSync: sandbox.stub().returns(),
            }
        };

        testConn = new Connection(stubs.getConnection);
    });

    afterEach(function() {
        sandbox.restore();
    });

    describe('Not Implemented', function() {
        it('abort', async function() {
            await assert.throws(() => testConn.abort(), 'NOT IMPLEMENTED');
        });
        it('createArrayOf', async function() {
            await assert.throws(() => testConn.createArrayOf(null, null), 'NOT IMPLEMENTED');
        });
        it('createBlob', async function() {
            await assert.throws(() => testConn.createBlob(), 'NOT IMPLEMENTED');
        });
        it('createClob', async function() {
            await assert.throws(() => testConn.createClob(), 'NOT IMPLEMENTED');
        });
        it('createNClob', async function() {
            await assert.throws(() => testConn.createNClob(), 'NOT IMPLEMENTED');
        });
        it('createSQLXML', async function() {
            await assert.throws(() => testConn.createSQLXML(), 'NOT IMPLEMENTED');
        });
        it('createStruct', async function() {
            await assert.throws(() => testConn.createStruct(null, null), 'NOT IMPLEMENTED');
        });
        it('nativeSQL', async function() {
            await assert.throws(() => testConn.nativeSQL(null), 'NOT IMPLEMENTED');
        });
        it('setNetworkTimeout', async function() {
            await assert.throws(() => testConn.setNetworkTimeout(null, null), 'NOT IMPLEMENTED');
        });
        it('setTypeMap', async function() {
            await assert.throws(() => testConn.setTypeMap(null), 'NOT IMPLEMENTED');
        });
    });
    it('clearWarnings', async function() {
        assert.isNull(await testConn.clearWarnings());
        assert.isFulfilled(testConn.clearWarnings());
    });
    it('close', async function() {
        assert.isNull(await testConn.close());
        assert.isFulfilled(testConn.close());
    });
    it('close already closed', async function() {
        testConn.conn = null;
        assert.isNull(await testConn.close());
        assert.isFulfilled(testConn.close());
    });
    it('commit', async function() {
        assert.isNull(await testConn.commit());
        assert.isFulfilled(testConn.commit());
    });
    it('createStatement', async function() {
        const statement = await testConn.createStatement();
        await assert.instanceOf(statement, Statement, 'statement is not an instance of Statement');
        await assert.isFulfilled(testConn.createStatement());
    });
    it('createStatement with 2 parameters', async function() {
        const statement = await testConn.createStatement(0, 0);
        await assert.instanceOf(statement, Statement, 'statement is not an instance of Statement');
        await assert.isFulfilled(testConn.createStatement(0, 0));
    });
    it('createStatement with 3 parameters', async function() {
        const statement = await testConn.createStatement(0, 0, 0);
        await assert.instanceOf(statement, Statement, 'statement is not an instance of Statement');
        await assert.isFulfilled(testConn.createStatement(0, 0, 0));
    });
    it('should fail if createStatement is called with 1 parameter', async function() {
        assert.isRejected(testConn.createStatement(0), 'INVALID ARGUMENT COUNT');
    });
    it('should fail if createStatement parameter are not numbers', async function() {
        assert.isRejected(testConn.createStatement('fake-param'), 'INVALID ARGUMENTS');
    });
    it('getAutoCommit', async function() {
        await assert.isTrue(await testConn.getAutoCommit());
        await assert.isFulfilled(testConn.getAutoCommit());
    });
    it('getCatalog', async function() {
        await assert.isNotNull(await testConn.getCatalog());
        await assert.isFulfilled(testConn.getCatalog());
    });
    it('getClientInfo', async function() {
        await assert.isNotNull(await testConn.getClientInfo());
        await assert.isFulfilled(testConn.getClientInfo());
    });
    it('getHoldability', async function() {
        await assert.isNotNull(await testConn.getHoldability());
        await assert.isFulfilled(testConn.getHoldability());
    });
    it('getMetaData', async function() {
        await assert.isNotNull(await testConn.getMetaData());
        await assert.instanceOf(await testConn.getMetaData(), DatabaseMetaData, 'getMetaData is not an instance of DatabaseMetaData');
        await assert.isFulfilled(testConn.getMetaData());
    });
    it('getNetworkTimeout', async function() {
        await assert.equal(await testConn.getNetworkTimeout(), 0);
        await assert.isFulfilled(testConn.getNetworkTimeout());
    });
    it('getSchema', async function() {
        await assert.isNotNull(await testConn.getSchema());
        await assert.isFulfilled(testConn.getSchema());
    });
    it('getTransactionIsolation', async function() {
        await assert.equal(await testConn.getTransactionIsolation(), 'TRANSACTION_READ_COMMITTED');
        await assert.isFulfilled(testConn.getTransactionIsolation());
    });
    it('getTypeMap', async function() {
        await assert.isNotNull(await testConn.getTypeMap());
        await assert.isFulfilled(testConn.getTypeMap());
    });
    it('getWarnings', async function() {
        await assert.isNotNull(await testConn.getWarnings());
        await assert.isFulfilled(testConn.getWarnings());
    });
    it('isClosed', async function() {
        await assert.isFalse(await testConn.isClosed());
    });
    it('isReadOnly', async function() {
        await assert.isFalse(await testConn.isReadOnly());
    });
    it('isValid', async function() {
        await assert.isTrue(await testConn.isValid(0));
    });
    it('prepareCall with SQL', async function() {
        await assert.isNotNull(await testConn.prepareCall('{ call database() }'));
        await assert.isFulfilled(testConn.prepareCall('{ call database() }'));
    });
    it('prepareCall with SQL, type and concurrency', async function() {
        await assert.isNotNull(await testConn.prepareCall('{ call database() }', 0, 0));
        await assert.isFulfilled(testConn.prepareCall('{ call database() }', 0, 0));
    });
    it('prepareCall with SQL, type, concurrency and holdability', async function() {
        await assert.isNotNull(await testConn.prepareCall('{ call database() }', 0, 0, 0));
        await assert.isFulfilled(testConn.prepareCall('{ call database() }', 0, 0, 0));
    });
    it('prepareCall should fail if parameters are the wrong type', async function() {
        await assert.isRejected(testConn.prepareCall(123), 'INVALID ARGUMENT TYPE');
    });
    it('prepareCall should fail if type is a string', async function() {
        await assert.isRejected(testConn.prepareCall('fake-sql', 'bad-value', 1, 1), 'INVALID ARGUMENT TYPE');
    });
    it('prepareCall should fail if type is a double', async function() {
        await assert.isRejected(testConn.prepareCall('fake-sql', 1.1, 1, 1), 'INVALID ARGUMENT TYPE');
    });
    it('prepareCall should fail if concurrency is a string', async function() {
        await assert.isRejected(testConn.prepareCall('fake-sql', 1, 'bad-value', 1), 'INVALID ARGUMENT TYPE');
    });
    it('prepareCall should fail if concurrency is a double', async function() {
        await assert.isRejected(testConn.prepareCall('fake-sql', 1, 1.1, 1), 'INVALID ARGUMENT TYPE');
    });
    it('prepareCall should fail if holdability is a string', async function() {
        await assert.isRejected(testConn.prepareCall('fake-sql', 1, 1, 'bad-value'), 'INVALID ARGUMENT TYPE');
    });
    it('prepareCall should fail if holdability is a double', async function() {
        await assert.isRejected(testConn.prepareCall('fake-sql', 1, 1, 1.1), 'INVALID ARGUMENT TYPE');
    });
    it('prepareCall should fail if no SQL', async function() {
        await assert.isRejected(testConn.prepareCall(), 'INVALID ARGUMENTS');
    });
    it('prepareCall should fail if resultSet type is set but no concurrency is set.', async function() {
        await assert.isRejected(testConn.prepareCall('{ call database() }', 'fake-type'), 'INVALID ARGUMENTS');
    });
    it('prepareStatement', async function() {
        await assert.isNotNull(await testConn.prepareStatement('SELECT 1 FROM INFORMATION_SCHEMA.SYSTEM_USERS;'));
        await assert.isFulfilled(testConn.prepareStatement('SELECT 1 FROM INFORMATION_SCHEMA.SYSTEM_USERS;'));
    });
    it('prepareStatement with SQL, type and concurrency', async function() {
        await assert.isNotNull(await testConn.prepareStatement('SELECT 1 FROM INFORMATION_SCHEMA.SYSTEM_USERS;', 0, 0));
        await assert.isFulfilled(testConn.prepareStatement('SELECT 1 FROM INFORMATION_SCHEMA.SYSTEM_USERS;', 0, 0));
    });
    it('prepareStatement with SQL, type, concurrency and holdability', async function() {
        await assert.isNotNull(await testConn.prepareStatement('SELECT 1 FROM INFORMATION_SCHEMA.SYSTEM_USERS;', 0, 0, 0));
        await assert.isFulfilled(testConn.prepareStatement('SELECT 1 FROM INFORMATION_SCHEMA.SYSTEM_USERS;', 0, 0, 0));
    });
    it('prepareStatement with SQL and props as integers', async function() {
        await assert.isNotNull(await testConn.prepareStatement('SELECT 1 FROM INFORMATION_SCHEMA.SYSTEM_USERS;', [0, 0]));
        await assert.isFulfilled(testConn.prepareStatement('SELECT 1 FROM INFORMATION_SCHEMA.SYSTEM_USERS;', [0, 0]));
    });
    it('prepareStatement with SQL and props as strings', async function() {
        await assert.isNotNull(await testConn.prepareStatement('SELECT 1 FROM INFORMATION_SCHEMA.SYSTEM_USERS;', ['fake-type', 'fake-concurrency']));
        await assert.isFulfilled(testConn.prepareStatement('SELECT 1 FROM INFORMATION_SCHEMA.SYSTEM_USERS;', ['fake-type', 'fake-concurrency']));
    });
    it('prepareStatement should fail if props are not either all strings or integers', async function() {
        await assert.isRejected(testConn.prepareStatement('SELECT 1 FROM INFORMATION_SCHEMA.SYSTEM_USERS;', [0, 'fake-concurrency']));
    });
    it('prepareStatement should fail if parameters are the wrong type', async function() {
        await assert.isRejected(testConn.prepareStatement(123), 'INVALID ARGUMENTS');
    });
    it('prepareStatement should fail if type is a string', async function() {
        await assert.isRejected(testConn.prepareStatement('fake-sql', 'bad-value', 1, 1), 'INVALID ARGUMENTS');
    });
    it('prepareStatement should fail if type is a double', async function() {
        await assert.isRejected(testConn.prepareStatement('fake-sql', 1.1, 1, 1), 'INVALID ARGUMENTS');
    });
    it('prepareStatement should fail if concurrency is a string', async function() {
        await assert.isRejected(testConn.prepareStatement('fake-sql', 1, 'bad-value', 1), 'INVALID ARGUMENTS');
    });
    it('prepareStatement should fail if concurrency is a double', async function() {
        await assert.isRejected(testConn.prepareStatement('fake-sql', 1, 1.1, 1), 'INVALID ARGUMENTS');
    });
    it('prepareStatement should fail if holdability is a string', async function() {
        await assert.isRejected(testConn.prepareStatement('fake-sql', 1, 1, 'bad-value'), 'INVALID ARGUMENTS');
    });
    it('prepareStatement should fail if holdability is a double ', async function() {
        await assert.isRejected(testConn.prepareStatement('fake-sql', 1, 1, 1.1), 'INVALID ARGUMENTS');
    });
    it('prepareStatement should fail if no SQL', async function() {
        await assert.isRejected(testConn.prepareStatement(), 'INVALID ARGUMENTS');
    });
    it('prepareStatement should fail if resultSet type is set but no concurrency is set.', async function() {
        await assert.isRejected(testConn.prepareStatement('{ call database() }', 'fake-type'), 'INVALID ARGUMENTS');
    });
    it('releaseSavepoint', async function() {
        await assert.isNotNull(await testConn.releaseSavepoint('fake-savepoint'));
        await assert.isFulfilled(testConn.releaseSavepoint('fake-savepoint'));
    });
    it('releaseSavepoint should fail if save point is not provided', async function() {
        await assert.isRejected(testConn.releaseSavepoint(), 'INVALID ARGUMENTS');
    });
    it('releaseSavepoint should fail if save point is not a string', async function() {
        await assert.isRejected(testConn.releaseSavepoint(1234), 'INVALID ARGUMENTS');
    });
    it('rollback', async function() {
        stubs.getConnection.getAutoCommitSync.returns(false);
        await assert.isNotNull(await testConn.rollback());
        await assert.isFulfilled(testConn.rollback());
    });
    it('rollback should fail if autocommit is true', async function() {
        await assert.isRejected(testConn.rollback(), 'Need to set autoCommit to false');
    });
    it('rollback a savepoint', async function() {
        stubs.getConnection.getAutoCommitSync.returns(false);
        await assert.isNotNull(await testConn.rollback('fake-savepoint'));
        await assert.isFulfilled(testConn.rollback('fake-savepoint'));
    });
    it('rollback with a savepoint should throw if autocommit is true', async function() {
        await assert.isRejected(testConn.rollback('fake-savepoint'), 'Need to set autoCommit to false');
    });
    it('setAutoCommit', async function() {
        await assert.isNotNull(await testConn.setAutoCommit(true));
        await assert.isFulfilled(testConn.setAutoCommit(true));
    });
    it('setAutoCommit should fail if value specified is null', async function() {
        await assert.isRejected(testConn.setAutoCommit(), 'Invalid autoCommit value - must be boolean');
    });
    it('setAutoCommit should fail if value specified is not a boolean', async function() {
        await assert.isRejected(testConn.setAutoCommit('fake-value'), 'Invalid autoCommit value - must be boolean');
    });
    it('setCatalog', async function() {
        await assert.isNotNull(await testConn.setCatalog('fake-catalog'));
        await assert.isFulfilled(testConn.setCatalog('fake-catalog'));
    });
    it('setCatalog should fail if catalog name is missing', async function() {
        await assert.isRejected(testConn.setCatalog(), 'Invalid catalog name');
    });
    it('setCatalog should fail if catalog name is not a string', async function() {
        await assert.isRejected(testConn.setCatalog(1234), 'Invalid catalog name');
    });
    it('setClientInfo with props', async function() {
        await assert.isNotNull(await testConn.setClientInfo({name: 'fake-name', value: 'fake-value'}));
        await assert.isFulfilled(testConn.setClientInfo({name: 'fake-name', value: 'fake-value'}));
    });
    it('setClientInfo with name and value', async function() {
        await assert.isNotNull(await testConn.setClientInfo(null, 'fake-name', 'fake-value'));
        await assert.isFulfilled(testConn.setClientInfo(null, 'fake-name', 'fake-value'));
    });
    it('setClientInfo should fail if no props or name/value specified', async function() {
        await assert.isRejected(testConn.setClientInfo(), 'INVALID ARGUMENTS');
    });
    it('setClientInfo should fail if no name is specified when value is specified', async function() {
        await assert.isRejected(testConn.setClientInfo(null, null, 'fake-value'), 'INVALID ARGUMENTS');
    });
    it('setClientInfo should fail if no value is specified when name is specified', async function() {
        await assert.isRejected(testConn.setClientInfo(null, 'fake-value'), 'INVALID ARGUMENTS');
    });
    it('setHoldability', async function() {
        const hold = (new ResultSet(null)).holdability.indexOf('HOLD_CURSORS_OVER_COMMIT');
        await assert.isNotNull(await testConn.setHoldability(hold));
        await assert.isFulfilled(testConn.setHoldability(hold));
    });
    it('setHoldability should fail if no holdability setting is specified', async function() {
        await assert.isRejected(testConn.setHoldability(), 'Invalid holdability');
    });
    it('setHoldability should fail if parameter is not an integer', async function() {
        await assert.isRejected(testConn.setHoldability('fake-holdability'), 'Invalid holdability');
    });
    it('setReadOnly', async function() {
        await assert.isNotNull(await testConn.setReadOnly(true));
        await assert.isFulfilled(testConn.setReadOnly(true));
    });
    it('setReadOnly should fail if value passed is null', async function() {
        await assert.isRejected(testConn.setReadOnly(), 'Invalid readonly value - must be boolean');
    });
    it('setReadOnly should fail if value passed is not a boolean', async function() {
        await assert.isRejected(testConn.setReadOnly('fake-value'), 'Invalid readonly value - must be boolean');
    });
    it('setSavePoint', async function() {
        await assert.isNotNull(await testConn.setSavepoint());
        await assert.isFulfilled(testConn.setSavepoint());
    });
    it('setSavePoint with name', async function() {
        await assert.isNotNull(await testConn.setSavepoint('fake-savepoint'));
        await assert.isFulfilled(testConn.setSavepoint('fake-savepoint'));
    });
    it('setSavePoint should fail if the name is not a string', async function() {
        await assert.isRejected(testConn.setSavepoint(1234), 'INVALID ARGUMENTS');
    });
    it('setSchema', async function() {
        await assert.isNotNull(await testConn.setSchema('fake-schema'));
        await assert.isFulfilled(testConn.setSchema('fake-schema'));
    });
    it('setSchema should fail if parameter is null', async function() {
        await assert.isRejected(testConn.setSchema(), 'Invalid schema - must be a string');
    });
    it('setSchema should fail if parameter is not a string', async function() {
        await assert.isRejected(testConn.setSchema(1234), 'Invalid schema - must be a string');
    });
    it('setTransactionIsolation', async function() {
        const txniso = await testConn.txniso.indexOf('TRANSACTION_SERIALIZABLE');
        await assert.isNotNull(await testConn.setTransactionIsolation(txniso));
        await assert.isFulfilled(testConn.setTransactionIsolation(txniso));
    });
    it('setTransactionIsolation should fail if parameter is null', async function() {
        await assert.isRejected(testConn.setTransactionIsolation(), 'Invalid isolation value - must be an integer');
    });
    it('setTransactionIsolation should fail if parameter is not an integer', async function() {
        await assert.isRejected(testConn.setTransactionIsolation('fake-txniso'), 'Invalid isolation value - must be an integer');
    });
});