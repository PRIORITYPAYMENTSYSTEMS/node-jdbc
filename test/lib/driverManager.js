const sinon = require('sinon');
const proxyquire = require('proxyquire');
const { assert } = require('chai');

const sandbox = sinon.createSandbox();
const java = require('../../lib/jinst').getInstance();

describe('Driver Manager', function() {

    let stubs = {}, dm = null;

    beforeEach(function() {
        const callStaticMethodSync = sandbox.stub();

        callStaticMethodSync.withArgs('java.sql.DriverManager', 'getConnection').returns();
        callStaticMethodSync.withArgs('java.sql.DriverManager', 'getLoginTimeout').returns(60);
        callStaticMethodSync.withArgs('java.sql.DriverManager', 'setLoginTimeout').returns();
        callStaticMethodSync.withArgs('java.sql.DriverManager', 'registerDriver').returns();

        stubs = {
            './jinst': {
                getInstance: sandbox.stub().returns({ callStaticMethodSync }),
            }
        };
        dm = proxyquire('../../lib/driverManager', stubs);
    });

    afterEach(function() {
        sandbox.restore();
    });

    it('getConnection', async function() {
        await assert.isNotNull(dm.getConnection('fake-url;user=fake-user;password=fake-password'));
    });
    it('getConnection with props', async function() {
        const Properties = java.import('java.util.Properties');
        const props = new Properties();

        props.putSync('user', 'fake-user');
        props.putSync('password', 'fake-password');

        await assert.isNotNull(dm.getConnection('fake-url', props));
    });
    it('getConnection should fail if no url is specified', async function() {
        await assert.throws(() => dm.getConnection(), 'INVALID ARGUMENTS');
    });
    it('getConnection should fail if propsOrUser is specified as user but not password', async function() {
        await assert.throws(() => dm.getConnection('fake-url', 'fake-user'), 'INVALID ARGUMENTS');
    });
    it('getConnection should fail if propsOrUser is not specified but password is', async function() {
        await assert.throws(() => dm.getConnection('fake-url', null, 'fake-password'), 'INVALID ARGUMENTS');
    });
    it('getConnection should fail if propsOrUser is specified as props and password is also specified', async function() {
        const Properties = java.import('java.util.Properties');
        const props = new Properties();

        props.putSync('user', 'fake-user');
        props.putSync('password', 'fake-password');
        await assert.throws(() => dm.getConnection('fake-url', props, 'fake-password'), 'INVALID ARGUMENTS');
    });
    it('getLoginTimeout', async function() {
        await assert.equal(await dm.getLoginTimeout(), 60);
        await assert.isFulfilled(dm.getLoginTimeout());
    });
    it('setLoginTimeout', async function() {
        await assert.isTrue(await dm.setLoginTimeout(30));
        await assert.isFulfilled(dm.setLoginTimeout(30));
    });
    it('setLoginTimeout should fail if seconds specified is not an integer', async function() {
        await assert.isRejected(dm.setLoginTimeout('fake-value'), 'Invalid seconds - must be an integer');
    });
    it('setLoginTimeout should fail if seconds is not specified', async function() {
        await assert.isRejected(dm.setLoginTimeout(), 'Invalid seconds - must be an integer');
    });
    it('registerDriver', async function() {
        await assert.isNotNull(await dm.registerDriver('fake-driver'));
        await assert.isFulfilled(dm.registerDriver('fake-driver'));
    });
    it('registerDriver should fail if driver specified is not a string', async function() {
        await assert.isRejected(dm.registerDriver(1234), 'Invalid driver - must be an string with Java class name');
    });
    it('registerDriver should fail if driver is not specified', async function() {
        await assert.isRejected(dm.registerDriver(), 'Invalid driver - must be an string with Java class name');
    });
});