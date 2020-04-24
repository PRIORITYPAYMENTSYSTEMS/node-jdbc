const sandbox = require('sinon').createSandbox();
const ResultSetMetadata = require('../../lib/resultSetMetaData');

const { assert } = require('chai');

describe('ResultSet Metadata', function() {

    let testRSMD, stubs;

    before(function() {
        stubs = {
            rsmd: {
                getColumnCountSync: sandbox.stub().returns(1),
                getColumnNameSync: sandbox.stub().returns('fake-column-name'),
            }
        };

        testRSMD = new ResultSetMetadata(stubs.rsmd);
    });

    after(function() {
        sandbox.restore();
    });

    it('getColumnCount', async function() {
        await assert.equal(testRSMD.getColumnCount(), 1);
    });

    it('getColumnName', async function() {
        await assert.equal(testRSMD.getColumnName(1), 'fake-column-name');
    });

    it('getColumnName should fail if passed bad parameters', async function() {
        await assert.throws(() => testRSMD.getColumnName(), 'INVALID ARGUMENTS');
        await assert.throws(() => testRSMD.getColumnName('bad-param'), 'INVALID ARGUMENTS');
    });
});