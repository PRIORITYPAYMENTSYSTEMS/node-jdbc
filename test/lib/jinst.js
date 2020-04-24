const sandbox = require('sinon').createSandbox();
const proxyquire = require('proxyquire');

describe('Java Instance', function() {

    let stubs, jinst;

    beforeEach(function() {

        stubs = {
            java: {
                onJvmCreated: sandbox.stub(),
                options: [],
                classpath: {
                    push: sandbox.stub()
                },
            }
        };

        jinst = proxyquire('../../lib/jinst', {
            java: stubs.java
        });
    });

    afterEach(function() {
        sandbox.restore();
    });

    it('should return true if a JVM is created', async function() {
        await assert.equal(jinst.isJvmCreated(), false);
    });

    it('should be able to add options if JVM is not created', async function() {
        await assert.equal(jinst.addOption('fake-option'), true);
    });

    it('should fail to add options if JVM is already created', async function() {
        stubs.java.onJvmCreated = null;
        sandbox.stub(console, 'error');
        await assert.equal(jinst.addOption('fake-option'), false);
    });

    it('should fail to add options if option is not valid', async function() {
        await assert.equal(jinst.addOption(), false);
    });

    it('should be able to setup classpath if JVM is not created', async function() {
        await assert.equal(jinst.setupClasspath(['fake-classpath']), true);
    });

    it('should fail to setup classpath if JVM is already created', async function() {
        stubs.java.onJvmCreated = null;
        sandbox.stub(console, 'error');
        await assert.equal(jinst.setupClasspath('fake-classpath'), false);
    });

    it('should fail to setup classpath if classpath is not valid', async function() {
        await assert.equal(jinst.setupClasspath(), false);
        await assert.equal(jinst.setupClasspath('bad-classpath'), false);
    });
});