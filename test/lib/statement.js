const sandbox = require('sinon').createSandbox();
const proxyquire = require('proxyquire');
const ResultSet = require('../../lib/resultSet');
const { assert } = require('chai');
const java = require('../../lib/jinst').getInstance();

describe('Statement', function() {

    let testStmt, stubs, Statement, javaInst;

    before(function() {
        javaInst = {
            newInstanceSync: sandbox.stub(),
            import: sandbox.stub().withArgs('java.util.Properties').returns(java.import('java.util.Properties')),
            getStaticFieldValue: sandbox.stub(),
        };

        stubs = {
            stmt: {
                cancelSync: sandbox.stub(),
                clearBatchSync: sandbox.stub(),
                closeSync: sandbox.stub(),
                executeUpdateSync: sandbox.stub(),
                executeQuerySync: sandbox.stub(),
                executeSync: sandbox.stub().returns(1),
                getResultSetSync: sandbox.stub(),
                getUpdateCountSync: sandbox.stub().returns(10),
                getFetchSizeSync: sandbox.stub(),
                setFetchSizeSync: sandbox.stub(),
                getMaxRowsSync: sandbox.stub(),
                setMaxRowsSync: sandbox.stub(),
                getQueryTimeoutSync: sandbox.stub(),
                setQueryTimeoutSync: sandbox.stub(),
                getGeneratedKeysSync: sandbox.stub(),
            },
        };

        Statement = proxyquire('../../lib/statement', {
            './jinst': {
                getInstance: sandbox.stub().returns(javaInst)
            }
        });

        testStmt = new Statement(stubs.stmt);
    });

    after(function() {
        sandbox.restore();
    });

    describe('Not implemented', function() {

        it('addBatch', async function() {
            await assert.throws(() => testStmt.addBatch(), 'NOT IMPLEMENTED');
        });
    });

    it('cancel', async function() {
        await assert.isFulfilled(testStmt.cancel());
    });

    it('clearBatch', async function() {
        await assert.isFulfilled(testStmt.clearBatch());
    });

    it('close', async function() {
        await assert.isFulfilled(testStmt.close());
    });

    it('executeUpdate', async function() {
        await assert.isFulfilled(testStmt.executeUpdate('fake-query'));
        await assert.isFulfilled(testStmt.executeUpdate('fake-query', 1));
        await assert.isFulfilled(testStmt.executeUpdate('fake-query', [1,2,3]));
    });

    it('executeUpdate should fail if passed bad parameters', async function() {
        await assert.isRejected(testStmt.executeUpdate(), 'INVALID ARGUMENTS');
        await assert.isRejected(testStmt.executeUpdate(123), 'INVALID ARGUMENTS');
        await assert.isRejected(testStmt.executeUpdate('fake-query', 'bad-param'), 'INVALID ARGUMENTS');
        await assert.isRejected(testStmt.executeUpdate('fake-query', ['bad-param']), 'INVALID ARGUMENTS');
    });

    it('executeQuery', async function() {
        await assert.isFulfilled(testStmt.executeQuery('fake-query'));
        await assert.instanceOf(await testStmt.executeQuery('fake-query'), ResultSet, 'result is not an instance of ResultSet');
    });

    it('executeQuery should fail if passed bad parameters', async function() {
        await assert.isRejected(testStmt.executeQuery(), 'INVALID ARGUMENTS');
        await assert.isRejected(testStmt.executeQuery(123), 'INVALID ARGUMENTS');
    });

    it('execute returning ResultSet', async function() {
        await assert.isFulfilled(testStmt.execute('fake-query'));
        await assert.instanceOf(await testStmt.execute('fake-query'), ResultSet, 'result is not an instance of ResultSet');
    });

    it('execute returning count', async function() {
        stubs.stmt.executeSync.returns(0);
        await assert.isFulfilled(testStmt.execute('fake-query'));
        await assert.equal(await testStmt.execute('fake-query'), 10);
    });

    it('execute should fail if passed bad parameters', async function() {
        await assert.isRejected(testStmt.execute(), 'INVALID ARGUMENTS');
        await assert.isRejected(testStmt.execute(123), 'INVALID ARGUMENTS');
    });

    it('getFetchSize', async function() {
        await assert.isFulfilled(testStmt.getFetchSize());
    });

    it('setFetchSize', async function() {
        await assert.isFulfilled(testStmt.setFetchSize(1));
    });

    it('setFetchSize should fail if passed bad parameters', async function() {
        await assert.isRejected(testStmt.setFetchSize(), 'INVALID ARGUMENTS');
        await assert.isRejected(testStmt.setFetchSize('bad-param'), 'INVALID ARGUMENTS');
        await assert.isRejected(testStmt.setFetchSize(1.1), 'INVALID ARGUMENTS');
    });

    it('getMaxRows', async function() {
        await assert.isFulfilled(testStmt.getMaxRows());
    });

    it('setMaxRows', async function() {
        await assert.isFulfilled(testStmt.setMaxRows(1));
    });

    it('setMaxRows should fail if passed bad parameters', async function() {
        await assert.isRejected(testStmt.setMaxRows(), 'INVALID ARGUMENTS');
        await assert.isRejected(testStmt.setMaxRows('bad-param'), 'INVALID ARGUMENTS');
        await assert.isRejected(testStmt.setMaxRows(1.1), 'INVALID ARGUMENTS');
    });

    it('getQueryTimeout', async function() {
        await assert.isFulfilled(testStmt.getQueryTimeout());
    });

    it('setQueryTimeout', async function() {
        await assert.isFulfilled(testStmt.setQueryTimeout(1));
    });

    it('setQueryTimeout should fail if passed bad parameters', async function() {
        await assert.isRejected(testStmt.setQueryTimeout(), 'INVALID ARGUMENTS');
        await assert.isRejected(testStmt.setQueryTimeout('bad-param'), 'INVALID ARGUMENTS');
        await assert.isRejected(testStmt.setQueryTimeout(1.1), 'INVALID ARGUMENTS');
    });

    it('getGeneratedKeys', async function() {
        await assert.isFulfilled(testStmt.getGeneratedKeys());
    });

    it('onInitialized', async function() {
        Statement.onInitialized();
        sandbox.assert.called(javaInst.getStaticFieldValue);
    });
});