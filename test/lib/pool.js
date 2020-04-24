const sinon = require('sinon');
const proxyquire = require('proxyquire');
const java = require('../../lib/jinst').getInstance();

const { assert } = require('chai');

const Connection = require('../../lib/connection');

const {
    merge
} = require('lodash');

const sandbox = sinon.createSandbox();

const config = {
  url: 'fake-url',
  user : 'fake-user',
  password: 'fake-password',
  minPoolSize: 2,
  maxPoolSize: 3
};

describe('Pool', function() {

    let stubs = {}, testPool = null, Pool, connectionStubs;

    beforeEach(async function() {
        const stmt = {
            executeSync: sandbox.stub(),
            getUpdateCountSync: sandbox.stub(),
        };
        connectionStubs = {
            createStatementSync: sandbox.stub().returns(stmt),
            closeSync: sandbox.stub().returns(),
            executeSync: sandbox.stub(),
        };

        stubs = {
            dm: {
                getConnection: sandbox.stub().returns(connectionStubs),
                registerDriver: sandbox.stub(),
            },
            jinst: {
                events: {
                    once: sandbox.stub(),
                    emit: sandbox.stub(),
                },
                getInstance: sandbox.stub().returns({
                    newInstanceSync: sandbox.stub(),
                    import: sandbox.stub().withArgs('java.util.Properties').returns(java.import('java.util.Properties')),
                    getStaticFieldValue: sandbox.stub().returns(),
                })
            }
        };

        Pool = proxyquire('../../lib/pool', {
            './driverManager': stubs.dm,
            './jinst': stubs.jinst,
        });

        // Stubbing some methods
        sandbox.stub(Connection.prototype, 'isClosed').returns(false);
        sandbox.stub(Connection.prototype, 'isReadOnly').returns(false);
        sandbox.stub(Connection.prototype, 'isValid').returns(true);

        testPool = new Pool(config);
        await testPool.initialize();
    });
    afterEach(async function() {
        sandbox.restore();
        await testPool.purge();
        testPool = null;
    });

    it('should initialize with default values for pool sizes', async function() {
        const configWithProps = {
            url: 'fake-url',
            password: 'fake-password',
            user: 'fake-user',
        };
        testPool = new Pool(configWithProps);
        await testPool.initialize();
        await assert.equal(testPool.minPoolSize, 1);
        await assert.equal(testPool.maxPoolSize, 1);
    });
    it('should initialize with a driver name', async function() {
        const configWithDriverName = merge(config, {
            driverName: 'fake-driver'
        });
        testPool = new Pool(configWithDriverName);
        await testPool.initialize();

        await assert.equal(testPool.driverName, 'fake-driver');
    });
    it('should fail to initialize with an unrecognized driver name', async function() {
        const err = new Error('Bad Driver');
        stubs.dm.registerDriver.throws(err);
        const configWithDriverName = merge(config, {
            driverName: 'fake-driver'
        });
        testPool = new Pool(configWithDriverName);
        await assert.isRejected(testPool.initialize(), 'Bad Driver', err);
    });
    it('should initialize with configs using properties', async function() {
        const configWithProps = {
            url: 'fake-url',
            minPoolSize: 2,
            maxPoolSize: 3,
            properties: {
                user : 'fake-user',
                password: 'fake-password',
            }
        };
        testPool = new Pool(configWithProps);
        await testPool.initialize();
        await assert.equal(testPool.props.getPropertySync('user'), 'fake-user');
        await assert.equal(testPool.props.getPropertySync('password'), 'fake-password');
    });
    it('should initialize with configs using properties but username is outside properties', async function() {
        const configWithProps = {
            url: 'fake-url',
            minPoolSize: 2,
            maxPoolSize: 3,
            user : 'fake-user',
            properties: {
                password: 'fake-password',
            }
        };
        testPool = new Pool(configWithProps);
        await testPool.initialize();
        await assert.equal(testPool.props.getPropertySync('user'), 'fake-user');
        await assert.equal(testPool.props.getPropertySync('password'), 'fake-password');
    });
    it('should initialize with configs using properties but password is outside properties', async function() {
        const configWithProps = {
            url: 'fake-url',
            minPoolSize: 2,
            maxPoolSize: 3,
            password: 'fake-password',
            properties: {
                user: 'fake-user',
            }
        };
        testPool = new Pool(configWithProps);
        await testPool.initialize();
        await assert.equal(testPool.props.getPropertySync('user'), 'fake-user');
        await assert.equal(testPool.props.getPropertySync('password'), 'fake-password');
    });

    describe('After initialize', function() {
        it('status', async function() {
            await testPool.reserve();
            const status = await testPool.status();
            await assert.isNotNull(status);
            await assert.equal(status.available, 1);
            await assert.equal(status.reserved, 1);
        });
        it('reserve', async function() {
            const connection = await testPool.reserve();
            await assert.isNotNull(connection.uuid);
            await assert.instanceOf(connection.conn, Connection, 'connection.conn is not an instance of Connection');
            await assert.equal(testPool.pool.length, 1);
            await assert.equal(testPool.reserved.length, 1);
        });
        it('reserve minimum pool', async function() {
            for (let i = 0; i < config.minPoolSize; i++) {
                const connection = await testPool.reserve();
                await assert.isNotNull(connection.uuid);
                await assert.instanceOf(connection.conn, Connection, 'connection.conn is not an instance of Connection');
            }
            await assert.equal(testPool.pool.length, 0);
            await assert.equal(testPool.reserved.length, 2);
        });
        it('reserve maximum pool', async function() {
            for (let i = 0; i < config.maxPoolSize; i++) {
                const connection = await testPool.reserve();
                await assert.isNotNull(connection.uuid);
                await assert.instanceOf(connection.conn, Connection, 'connection.conn is not an instance of Connection');
            }
            await assert.equal(testPool.pool.length, 0);
            await assert.equal(testPool.reserved.length, 3);
        });
        it('reserve should fail if trying to reserve more than max pool size connections', async function() {
            for (let i = 0; i < config.maxPoolSize; i++) {
                const connection = await testPool.reserve();
                await assert.isNotNull(connection.uuid);
                await assert.instanceOf(connection.conn, Connection, 'connection.conn is not an instance of Connection');
            }
            await assert.equal(testPool.pool.length, 0);
            await assert.equal(testPool.reserved.length, 3);

            await assert.isRejected(testPool.reserve(), 'No more pool connections available.');
        });
        it('reserve should fail if getConnection throws an error', async function() {
            const err = new Error('Something bad happened');
            stubs.dm.getConnection.throws(err);
            sandbox.stub(console, 'error');
            await testPool.purge();
            await assert.isRejected(testPool.reserve(), 'Something bad happened', err);
        });
        it('release', async function() {
            const connection = await testPool.reserve();
            await assert.isFulfilled(testPool.release(connection));
        });
        it('release should fail if no connection is specified', async function() {
            await assert.isRejected(testPool.release(), 'INVALID CONNECTION');
        });
        it('release should fail if connection is not an object', async function() {
            await assert.isRejected(testPool.release('fake-connection'), 'INVALID CONNECTION');
        });
        it('purge', async function() {
            await assert.isFulfilled(testPool.purge());
            await assert.equal(testPool.pool.length, 0);
            await assert.equal(testPool.reserved.length, 0);
        });
        it('purge with bad connection object', async function() {
            testPool.pool[1] = 'bad-connection';
            await assert.isFulfilled(testPool.purge());
            await assert.equal(testPool.pool.length, 0);
            await assert.equal(testPool.reserved.length, 0);
        });
    });
    describe('No Max Idle', function() {

        let clock, connectionId;
        beforeEach(async function() {
            clock = sandbox.useFakeTimers();
            const connection = await testPool.reserve();
            connectionId = connection.uuid;
            await testPool.release(connection);
        });

        it('should return the same connection when reserving again', async function() {
            clock.tick("20:00");
            const connection = await testPool.reserve();
            await assert.equal(connection.uuid, connectionId);
            await assert.equal(testPool.pool.length, 1);
            await assert.equal(testPool.reserved.length, 1);
        });
    });
    describe('With Max Idle', function() {

        let clock, connectionId;
        beforeEach(async function() {
            clock = sandbox.useFakeTimers();

            const configWithMaxIdle = merge(config, {
                maxIdle: 20*60*1000 //20 minutes
            });
            await testPool.purge();
            testPool = new Pool(configWithMaxIdle);
            await testPool.initialize();

            const connection = await testPool.reserve();
            connectionId = connection.uuid;
            await testPool.release(connection);
        });

        it('should return the same connection when reserving again within the max idle window', async function() {
            clock.tick(19 * 60 * 1000);
            const connection = await testPool.reserve();
            await assert.equal(connection.uuid, connectionId);
            await assert.equal(testPool.pool.length, 1);
            await assert.equal(testPool.reserved.length, 1);
        });
        it('should return a new connection when reserving again past the max idle window', async function() {
            clock.tick(21 * 60 * 1000);
            const connection = await testPool.reserve();
            await assert.notEqual(connection.uuid, connectionId);
            await assert.equal(testPool.pool.length, 0);
            await assert.equal(testPool.reserved.length, 1);
        });
        it('should remove connections that were wrongly modified', async function() {
            testPool.pool[1] = 'bad-connection';
            const connection = await testPool.reserve();
            await assert.isNotNull(connection.uuid);
            await assert.instanceOf(connection.conn, Connection, 'connection.conn is not an instance of Connection');
            await assert.equal(testPool.pool.length, 0);
            await assert.equal(testPool.reserved.length, 1);

        });
    });
    describe('With Max Idle and Keep Alive', function() {

        let clock, connectionId;
        beforeEach(async function() {
            clock = sandbox.useFakeTimers();

            const configWithMaxIdle = {
                url: 'fake-url',
                user : 'fake-user',
                password: 'fake-password',
                maxIdle: 20*60*1000, //20 minutes
                keepAlive: {
                    interval: 60*1000, // 1 minute
                    query: 'select 1',
                    enabled: true
                },
            };
            await testPool.purge();
            testPool = new Pool(configWithMaxIdle);
            await testPool.initialize();
        });

        afterEach(async function() {
            await testPool.purge();
        });

        it('should call the keepalive function', async function() {
            sandbox.stub(console, 'log');
            const connection = await testPool.reserve();
            clock.tick(60 * 1000); // 1 minute
            sandbox.assert.calledOnce(connection.conn.conn.createStatementSync);
        });

        it('should log an error if the keepalive function fails', async function() {
            const err = new Error('Something bad happened');
            connectionStubs.createStatementSync.throws(err);
            sandbox.stub(console, 'error');
            const connection = await testPool.reserve();
            clock.tick(60 * 1000);
            sandbox.assert.called(connection.conn.conn.closeSync);
        });
    });
});