const sandbox = require('sinon').createSandbox();
const proxyquire = require('proxyquire');
const { assert } = require('chai');
const java = require('../../lib/jinst').getInstance();
const ResultSetMetaData = require('../../lib/resultSetMetaData');

const {
    forEach
} = require('lodash');

const javaSqlTypes = require('./data/javaSqlTypes');

describe('ResultSet', function() {

    let testRS, stubs, ResultSet, javaInst, metadata;

    beforeEach(function() {

        javaInst = {
            newInstanceSync: sandbox.stub(),
            import: sandbox.stub().withArgs('java.util.Properties').returns(java.import('java.util.Properties')),
            getStaticFieldValue: sandbox.stub(),
        };

        metadata = {
            getColumnLabelSync: sandbox.stub().returns('fake-column-label'),
            getColumnTypeSync: sandbox.stub().returns('String'),
        };

        stubs = {
            rs: {
                getMetaDataSync: sandbox.stub().returns(metadata),
                closeSync: sandbox.stub(),
                nextSync: sandbox.stub(),
                getStringSync: sandbox.stub().returns('fake-string'),
                getIntSync: sandbox.stub().returns(1),
                getDateSync: sandbox.stub().onFirstCall().returns('fake-date').onSecondCall().returns(null),
                getTimeSync: sandbox.stub().returns('fake-time'),
                getTimestampSync: sandbox.stub().returns('fake-timestamp'),
                getObjectSync: sandbox.stub().onFirstCall().returns({fakeProp: 'fake-value'}).onSecondCall().returns(null)
            },
            jinst: {
                getInstance: sandbox.stub().returns(javaInst),
            },
        };

        ResultSet = proxyquire('../../lib/resultSet', {
            './jinst': stubs.jinst
        });

        sandbox.stub(ResultSetMetaData.prototype, 'getColumnCount').returns(8);

        forEach(javaSqlTypes, (val, key) => {
            javaInst.getStaticFieldValue.withArgs('java.sql.Types', key).returns(val);
        });

        testRS = new ResultSet(stubs.rs);
    });

    afterEach(function() {
        sandbox.restore();
    });

    function setupStubs() {
        metadata.getColumnLabelSync.onCall(0).returns('fake-column-label-1');
        metadata.getColumnLabelSync.onCall(1).returns('fake-column-label-2');
        metadata.getColumnLabelSync.onCall(2).returns('fake-column-label-3');
        metadata.getColumnLabelSync.onCall(3).returns('fake-column-label-4');
        metadata.getColumnLabelSync.onCall(4).returns('fake-column-label-5');
        metadata.getColumnLabelSync.onCall(5).returns('fake-column-label-6');
        metadata.getColumnLabelSync.onCall(6).returns('fake-column-label-7');
        metadata.getColumnLabelSync.onCall(7).returns('fake-column-label-8');

        metadata.getColumnTypeSync.onCall(0).returns(javaSqlTypes.VARCHAR);
        metadata.getColumnTypeSync.onCall(1).returns(javaSqlTypes.INTEGER);
        metadata.getColumnTypeSync.onCall(2).returns(javaSqlTypes.DATE);
        metadata.getColumnTypeSync.onCall(3).returns(javaSqlTypes.TIME);
        metadata.getColumnTypeSync.onCall(4).returns(javaSqlTypes.TIMESTAMP);
        metadata.getColumnTypeSync.onCall(5).returns(javaSqlTypes.INTEGER);
        metadata.getColumnTypeSync.onCall(6).returns(javaSqlTypes.DATE);
        metadata.getColumnTypeSync.onCall(7).returns(99999);

        stubs.rs.nextSync.onFirstCall().returns(true).onSecondCall().returns(false);
    }

    it('getMetaData', async function() {
        await assert.isFulfilled(testRS.getMetaData());
        await assert.instanceOf(await testRS.getMetaData(), ResultSetMetaData, 'return is not an instance of ResultSetMetaData');
    });

    it('close', async function() {
        await assert.doesNotThrow(() => testRS.close());
    });

    it('toObjectIter', async function() {
        setupStubs();
        await assert.deepYield((await testRS.toObjectIter()).rows(), {
            'fake-column-label-1': 'fake-string',
            'fake-column-label-2': 1,
            'fake-column-label-3': 'fake-date',
            'fake-column-label-4': 'fake-time',
            'fake-column-label-5': 'fake-timestamp',
            'fake-column-label-6': null,
            'fake-column-label-7': null,
            'fake-column-label-8': 'fake-string',
        });
    });

    it('toObject', async function() {
        setupStubs();

        const rows = [{
            'fake-column-label-1': 'fake-string',
            'fake-column-label-2': 1,
            'fake-column-label-3': 'fake-date',
            'fake-column-label-4': 'fake-time',
            'fake-column-label-5': 'fake-timestamp',
            'fake-column-label-6': null,
            'fake-column-label-7': null,
            'fake-column-label-8': 'fake-string',
        }];

        const labels = [
            'fake-column-label-1',
            'fake-column-label-2',
            'fake-column-label-3',
            'fake-column-label-4',
            'fake-column-label-5',
            'fake-column-label-6',
            'fake-column-label-7',
            'fake-column-label-8',
        ];

        const types = [
            javaSqlTypes.VARCHAR,
            javaSqlTypes.INTEGER,
            javaSqlTypes.DATE,
            javaSqlTypes.TIME,
            javaSqlTypes.TIMESTAMP,
            javaSqlTypes.INTEGER,
            javaSqlTypes.DATE,
            99999,
        ];

        await assert.deepEqual(await testRS.toObject(), {
            labels,
            types,
            rows
        });
    });

    it('toObjArray', async function() {
        setupStubs();

        const rows = [{
            'fake-column-label-1': 'fake-string',
            'fake-column-label-2': 1,
            'fake-column-label-3': 'fake-date',
            'fake-column-label-4': 'fake-time',
            'fake-column-label-5': 'fake-timestamp',
            'fake-column-label-6': null,
            'fake-column-label-7': null,
            'fake-column-label-8': 'fake-string',
        }];

        await assert.deepEqual(await testRS.toObjArray(), rows);
    });
});