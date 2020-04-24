const chai = require('chai');
const sinonChai = require('sinon-chai');
const chaiAsPromised = require('chai-as-promised');
const chaiGenerator = require('chai-generator');

chai.use(chaiAsPromised);
chai.use(sinonChai);
chai.use(chaiGenerator);

global.should = chai.should();
global.expect = chai.expect;
global.AssertionError = chai.AssertionError;
global.Assertion = chai.Assertion;
global.assert = chai.assert;

