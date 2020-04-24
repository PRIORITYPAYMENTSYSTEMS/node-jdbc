const sandbox = require('sinon').createSandbox();
const CallableStatement = require('../../lib/callableStatement');

const { assert } = require('chai');

describe('Callable Statement', function() {

    let stubs, testCS;
    const stubDate = new Date('1970-01-01');

    beforeEach(function() {

        stubs = {
            callableStatement: {
                getArraySync: sandbox.stub().returns(['fake-array']),
                getBigDecimalSync: sandbox.stub().returns(999999999999999),
                getBlobSync: sandbox.stub().returns('fake-blob'),
                getBooleanSync: sandbox.stub().returns(true),
                getByteSync: sandbox.stub().returns(1),
                getBytesSync: sandbox.stub().returns([1,2,3,4,5]),
                getClobSync: sandbox.stub().returns('fake-clob'),
                getDateSync: sandbox.stub().returns(stubDate),
                getDoubleSync: sandbox.stub().returns(123.4),
                getFloatSync: sandbox.stub().returns(234.5),
                getIntSync: sandbox.stub().returns(1),
                getLongSync: sandbox.stub().returns(2),
                getNClobSync: sandbox.stub().returns('fake-nclob'),
                getNStringSync: sandbox.stub().returns('fake-nstring'),
                getShortSync: sandbox.stub().returns(123),
                getStringSync: sandbox.stub().returns('fake-string'),
                registerOutParameterSync: sandbox.stub(),
            }
        };

        testCS = new CallableStatement(stubs.callableStatement);

    });

    afterEach(function() {
        sandbox.restore();
    });

    describe('Not Implemented', function() {

        it('getCharacterStream', async function() {
            await assert.throws(() => testCS.getCharacterStream('fake-param'), 'NOT IMPLEMENTED');
        });

        it('getNCharacterStream', async function() {
            await assert.throws(() => testCS.getNCharacterStream('fake-param'), 'NOT IMPLEMENTED');
        });

        it('getObject', async function() {
            await assert.throws(() => testCS.getObject('fake-param'), 'NOT IMPLEMENTED');
        });

        it('getRef', async function() {
            await assert.throws(() => testCS.getRef('fake-param'), 'NOT IMPLEMENTED');
        });

        it('getRowId', async function() {
            await assert.throws(() => testCS.getRowId('fake-param'), 'NOT IMPLEMENTED');
        });

        it('getSQLXML', async function() {
            await assert.throws(() => testCS.getSQLXML('fake-param'), 'NOT IMPLEMENTED');
        });

        it('getTime', async function() {
            await assert.throws(() => testCS.getTime('fake-param'), 'NOT IMPLEMENTED');
        });

        it('getTimestamp', async function() {
            await assert.throws(() => testCS.getTimestamp('fake-param'), 'NOT IMPLEMENTED');
        });

        it('getURL', async function() {
            await assert.throws(() => testCS.getURL('fake-param'), 'NOT IMPLEMENTED');
        });
    });

    it('getArray', async function() {
        await assert.isFulfilled(testCS.getArray('fake-key'));
        await assert.include(await testCS.getArray('fake-key'), 'fake-array');
    });

    it('getArray should fail if parameter is not integer or string', async function() {
        await assert.isRejected(testCS.getArray(), 'INVALID ARGUMENTS');
    });

    it('getBigDecimal', async function() {
        await assert.isFulfilled(testCS.getBigDecimal('fake-key'));
        await assert.equal(await testCS.getBigDecimal('fake-key'), 999999999999999);
    });

    it('getBigDecimal should fail if parameter is not integer or string', async function() {
        await assert.isRejected(testCS.getBigDecimal(), 'INVALID ARGUMENTS');
    });

    it('getBlob', async function() {
        await assert.isFulfilled(testCS.getBlob('fake-key'));
        await assert.equal(await testCS.getBlob('fake-key'), 'fake-blob');
    });

    it('getBlob should fail if parameter is not integer or string', async function() {
        await assert.isRejected(testCS.getBlob(), 'INVALID ARGUMENTS');
    });

    it('getBoolean', async function() {
        await assert.isFulfilled(testCS.getBoolean('fake-key'));
        await assert.equal(await testCS.getBoolean('fake-key'), true);
    });

    it('getBoolean should fail if parameter is not integer or string', async function() {
        await assert.isRejected(testCS.getBoolean(), 'INVALID ARGUMENTS');
    });

    it('getByte', async function() {
        await assert.isFulfilled(testCS.getByte('fake-key'));
        await assert.equal(await testCS.getByte('fake-key'), 1);
    });

    it('getByte should fail if parameter is not integer or string', async function() {
        await assert.isRejected(testCS.getByte(), 'INVALID ARGUMENTS');
    });

    it('getBytes', async function() {
        await assert.isFulfilled(testCS.getBytes('fake-key'));
        await assert.include(await testCS.getBytes('fake-key'), 1);
        await assert.include(await testCS.getBytes('fake-key'), 2);
        await assert.include(await testCS.getBytes('fake-key'), 3);
        await assert.include(await testCS.getBytes('fake-key'), 4);
        await assert.include(await testCS.getBytes('fake-key'), 5);
        await assert.notInclude(await testCS.getBytes('fake-key'), 6);
    });

    it('getBytes should fail if parameter is not integer or string', async function() {
        await assert.isRejected(testCS.getBytes(), 'INVALID ARGUMENTS');
    });

    it('getClob', async function() {
        await assert.isFulfilled(testCS.getClob('fake-key'));
        await assert.equal(await testCS.getClob('fake-key'), 'fake-clob');
    });

    it('getClob should fail if parameter is not integer or string', async function() {
        await assert.isRejected(testCS.getClob(), 'INVALID ARGUMENTS');
    });

    it('getDate', async function() {
        await assert.isFulfilled(testCS.getDate('fake-key'));
        await assert.equal(await testCS.getDate('fake-key'), stubDate);
    });

    it('getDate should fail if parameter is not integer or string', async function() {
        await assert.isRejected(testCS.getDate(), 'INVALID ARGUMENTS');
    });

    it('getDate should fail if parameter 2 is not an object or undefined', async function() {
        await assert.isRejected(testCS.getDate('fake-date-key', 123), 'INVALID ARGUMENTS');
    });

    it('getDouble', async function() {
        await assert.isFulfilled(testCS.getDouble('fake-key'));
        await assert.equal(await testCS.getDouble('fake-key'), 123.4);
    });

    it('getDouble should fail if parameter is not integer or string', async function() {
        await assert.isRejected(testCS.getDouble(), 'INVALID ARGUMENTS');
    });

    it('getFloat', async function() {
        await assert.isFulfilled(testCS.getFloat('fake-key'));
        await assert.equal(await testCS.getFloat('fake-key'), 234.5);
    });

    it('getFloat should fail if parameter is not integer or string', async function() {
        await assert.isRejected(testCS.getFloat(), 'INVALID ARGUMENTS');
    });

    it('getInt', async function() {
        await assert.isFulfilled(testCS.getInt('fake-key'));
        await assert.equal(await testCS.getInt('fake-key'), 1);
    });

    it('getInt should fail if parameter is not integer or string', async function() {
        await assert.isRejected(testCS.getInt(), 'INVALID ARGUMENTS');
    });

    it('getLong', async function() {
        await assert.isFulfilled(testCS.getLong('fake-key'));
        await assert.equal(await testCS.getLong('fake-key'), 2);
    });

    it('getLong should fail if parameter is not integer or string', async function() {
        await assert.isRejected(testCS.getLong(), 'INVALID ARGUMENTS');
    });

    it('getNClob', async function() {
        await assert.isFulfilled(testCS.getNClob('fake-key'));
        await assert.equal(await testCS.getNClob('fake-key'), 'fake-nclob');
    });

    it('getNClob should fail if parameter is not integer or string', async function() {
        await assert.isRejected(testCS.getNClob(), 'INVALID ARGUMENTS');
    });

    it('getNString', async function() {
        await assert.isFulfilled(testCS.getNString('fake-key'));
        await assert.equal(await testCS.getNString('fake-key'), 'fake-nstring');
    });

    it('getNString should fail if parameter is not integer or string', async function() {
        await assert.isRejected(testCS.getNString(), 'INVALID ARGUMENTS');
    });

    it('getShort', async function() {
        await assert.isFulfilled(testCS.getShort('fake-key'));
        await assert.equal(await testCS.getShort('fake-key'), 123);
    });

    it('getShort should fail if parameter is not integer or string', async function() {
        await assert.isRejected(testCS.getShort(), 'INVALID ARGUMENTS');
    });

    it('getString', async function() {
        await assert.isFulfilled(testCS.getString('fake-key'));
        await assert.equal(await testCS.getString('fake-key'), 'fake-string');
    });

    it('getString should fail if parameter is not integer or string', async function() {
        await assert.isRejected(testCS.getString(), 'INVALID ARGUMENTS');
    });

    describe('registerOutParameter', function() {
        it('should succeed', async function() {
            await assert.isFulfilled(testCS.registerOutParameter('fake-param1', 2));
            await assert.isFulfilled(testCS.registerOutParameter(1, 2));
        });

        it('should fail if the parameter 1 is not an integer or a string', async function() {
            await assert.isRejected(testCS.registerOutParameter(), 'INVALID ARGUMENTS');
        });

        it('should fail if the parameter 2 is not an integer or a string', async function() {
            await assert.isRejected(testCS.registerOutParameter('fake-param'), 'INVALID ARGUMENTS');
        });

        it('should fail if the parameter 3 is not an integer or a string', async function() {
            await assert.isRejected(testCS.registerOutParameter('fake-param1', 'fake-param2', 123.4), 'INVALID ARGUMENTS');
        });

        it('should fail if param1 is an integer and param2 is a string', async function() {
            await assert.isRejected(testCS.registerOutParameter(1, 'fake-param2'), 'INVALID ARGUMENTS');
        });

        it('should fail if param1 is a string, param2 is an integer and param3 is not a string or integer', async function() {
            await assert.isRejected(testCS.registerOutParameter('fake-param1', 2, 3.4), 'INVALID ARGUMENTS');
        });

        it('should fail if param1 is an integer, param2 is an integer and param3 is not a string or integer', async function() {
            await assert.isRejected(testCS.registerOutParameter(1, 2, 3.4), 'INVALID ARGUMENTS');
        });
    });
});