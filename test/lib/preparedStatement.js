const sandbox = require('sinon').createSandbox();
const PreparedStatement = require('../../lib/preparedStatement');
const ResultSetMetaData = require('../../lib/resultSetMetaData');

describe('Prepared Statement', function() {

    let testPS, stubs;

    beforeEach(function() {
        stubs = {
            ps: {
                addBatchSync: sandbox.stub(),
                clearParametersSync: sandbox.stub(),
                getMetaDataSync: sandbox.stub(),
                setBigDecimalSync: sandbox.stub(),
                setBooleanSync: sandbox.stub(),
                setByteSync: sandbox.stub(),
                setBytesSync: sandbox.stub(),
                setDoubleSync: sandbox.stub(),
                setFloatSync: sandbox.stub(),
                setIntSync: sandbox.stub(),
                setLongSync: sandbox.stub(),
                setStringSync: sandbox.stub(),
                setDateSync: sandbox.stub(),
                setTimeSync: sandbox.stub(),
                setTimestampSync: sandbox.stub(),
            }
        };

        testPS = new PreparedStatement(stubs.ps);
    });

    afterEach(function() {
        sandbox.restore();
    });

    describe('Not Implemented', function() {

        it('getParameterMetaData', async function() {
            await assert.throws(() => testPS.getParameterMetaData(), 'NOT IMPLEMENTED');
        });
        it('setArray', async function() {
            await assert.throws(() => testPS.setArray(), 'NOT IMPLEMENTED');
        });
        it('setAsciiStream', async function() {
            await assert.throws(() => testPS.setAsciiStream(), 'NOT IMPLEMENTED');
        });
        it('setBinaryStream', async function() {
            await assert.throws(() => testPS.setBinaryStream(), 'NOT IMPLEMENTED');
        });
        it('setBlob', async function() {
            await assert.throws(() => testPS.setBlob(), 'NOT IMPLEMENTED');
        });
        it('setCharacterStream', async function() {
            await assert.throws(() => testPS.setCharacterStream(), 'NOT IMPLEMENTED');
        });
        it('setClob', async function() {
            await assert.throws(() => testPS.setClob(), 'NOT IMPLEMENTED');
        });
    });

    it('addBatch', async function() {
        testPS.addBatch();
        sandbox.assert.called(stubs.ps.addBatchSync);
    });

    it('clearParameters', async function() {
        testPS.clearParameters();
        sandbox.assert.called(stubs.ps.clearParametersSync);
    });

    it('getMetaData', async function() {
        await assert.isFulfilled(testPS.getMetaData());
        await assert.instanceOf(await testPS.getMetaData(), ResultSetMetaData, 'getMetaData is not an instance of ResultSetMetaData');
    });

    it('setBigDecimal', async function() {
        await assert.isFulfilled(testPS.setBigDecimal(1, 1.0));
    });

    it('setBigDecimal should fail it passed bad params', async function() {
        await assert.isRejected(testPS.setBigDecimal());
        await assert.isRejected(testPS.setBigDecimal('bad-param', 1.0));
        await assert.isRejected(testPS.setBigDecimal(undefined, 1.0));
        await assert.isRejected(testPS.setBigDecimal(1, 'bad-param'));
    });

    it('setBoolean', async function() {
        await assert.isFulfilled(testPS.setBoolean(1, true));
    });

    it('setBoolean should fail it passed bad params', async function() {
        await assert.isRejected(testPS.setBoolean());
        await assert.isRejected(testPS.setBoolean('bad-param', 1.1));
        await assert.isRejected(testPS.setBoolean(undefined, 1.1));
        await assert.isRejected(testPS.setBoolean(1, 'bad-param'));
    });

    it('setByte', async function() {
        await assert.isFulfilled(testPS.setByte(1, 1));
    });

    it('setByte should fail it passed bad params', async function() {
        await assert.isRejected(testPS.setByte());
        await assert.isRejected(testPS.setByte('bad-param', 1.0));
        await assert.isRejected(testPS.setByte(undefined, 1.0));
        await assert.isRejected(testPS.setByte(1, 1.1));
        await assert.isRejected(testPS.setByte(1, 'bad-param'));
    });

    it('setBytes', async function() {
        await assert.isFulfilled(testPS.setBytes(1, [1,2,3]));
    });

    it('setBytes should fail it passed bad params', async function() {
        await assert.isRejected(testPS.setBytes());
        await assert.isRejected(testPS.setBytes('bad-param', 1.0));
        await assert.isRejected(testPS.setBytes(undefined, 1.0));
        await assert.isRejected(testPS.setBytes(1, 'bad-param'));
        await assert.isRejected(testPS.setBytes(1, ['bad-param']));
    });

    it('setDouble', async function() {
        await assert.isFulfilled(testPS.setDouble(1, 1.1));
    });

    it('setDouble should fail it passed bad params', async function() {
        await assert.isRejected(testPS.setDouble());
        await assert.isRejected(testPS.setDouble('bad-param', 1.1));
        await assert.isRejected(testPS.setDouble(undefined, 1.1));
        await assert.isRejected(testPS.setDouble(1, 'bad-param'));
    });

    it('setFloat', async function() {
        await assert.isFulfilled(testPS.setFloat(1, 1.0));
    });

    it('setFloat should fail it passed bad params', async function() {
        await assert.isRejected(testPS.setFloat());
        await assert.isRejected(testPS.setFloat('bad-param', 1.0));
        await assert.isRejected(testPS.setFloat(undefined, 1.0));
        await assert.isRejected(testPS.setFloat(1, 'bad-param'));
    });

    it('setInt', async function() {
        await assert.isFulfilled(testPS.setInt(1, 1));
    });

    it('setInt should fail it passed bad params', async function() {
        await assert.isRejected(testPS.setInt());
        await assert.isRejected(testPS.setInt('bad-param', 1.1));
        await assert.isRejected(testPS.setInt(undefined, 1.1));
        await assert.isRejected(testPS.setInt(1, 'bad-param'));
    });

    it('setLong', async function() {
        await assert.isFulfilled(testPS.setLong(1, 1));
    });

    it('setLong should fail it passed bad params', async function() {
        await assert.isRejected(testPS.setLong());
        await assert.isRejected(testPS.setLong('bad-param', 1.1));
        await assert.isRejected(testPS.setLong(undefined, 1.1));
        await assert.isRejected(testPS.setLong(1, 'bad-param'));
    });

    it('setString', async function() {
        await assert.isFulfilled(testPS.setString(1, 'fake-param'));
    });

    it('setString should fail it passed bad params', async function() {
        await assert.isRejected(testPS.setString());
        await assert.isRejected(testPS.setString('bad-param', ['bad-param']));
        await assert.isRejected(testPS.setString(undefined, 1));
        await assert.isRejected(testPS.setString(1, 1));
    });

    it('setDate', async function() {
        await assert.isFulfilled(testPS.setDate(1, '1970-01-01'));
        await assert.isFulfilled(testPS.setDate(1, '1970-01-01', 'fake-calendar'));
    });

    it('setDate should fail it passed bad params', async function() {
        await assert.isRejected(testPS.setDate());
        await assert.isRejected(testPS.setDate('bad-param', 1.0));
        await assert.isRejected(testPS.setDate(undefined, 1.0));
        await assert.isRejected(testPS.setDate(1, 1));
        await assert.isRejected(testPS.setDate(null, null, 1));
    });

    it('setTime', async function() {
        await assert.isFulfilled(testPS.setTime(1, '1970-01-01'));
        await assert.isFulfilled(testPS.setTime(1, '1970-01-01', 'fake-calendar'));
    });

    it('setTime should fail it passed bad params', async function() {
        await assert.isRejected(testPS.setTime());
        await assert.isRejected(testPS.setTime('bad-param', 1.0));
        await assert.isRejected(testPS.setTime(undefined, 1.0));
        await assert.isRejected(testPS.setTime(1, 1));
        await assert.isRejected(testPS.setTime(null, null, 1));
    });

    it('setTimestamp', async function() {
        await assert.isFulfilled(testPS.setTimestamp(1, 123));
        await assert.isFulfilled(testPS.setTimestamp(1, 123, 'fake-calendar'));
    });

    it('setTimestamp should fail it passed bad params', async function() {
        await assert.isRejected(testPS.setTimestamp());
        await assert.isRejected(testPS.setTimestamp('bad-param', 1.0));
        await assert.isRejected(testPS.setTimestamp(undefined, 1.0));
        await assert.isRejected(testPS.setTimestamp(1, 'bad-param'));
        await assert.isRejected(testPS.setTimestamp(null, null, 1));
    });
});