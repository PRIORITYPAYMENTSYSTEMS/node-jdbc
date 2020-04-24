const EventEmitter = require('events').EventEmitter;
const java = require('java');

const {
    isArray,
    isNil,
} = require('lodash');

function isJvmCreated() {
    return typeof java.onJvmCreated !== 'function';
}

module.exports = {
    isJvmCreated: function() {
        return isJvmCreated();
    },
    addOption: function(option) {
        if (!isJvmCreated() && option) {
            java.options.push(option);
            return true;
        }
        else if (isJvmCreated()) {
            console.error('You\'ve tried to add an option to an already running JVM!');
            console.error('This isn\'t currently supported.  Please add all option entries before calling any java methods');
            console.error('You can test for a running JVM with the isJvmCreated function.');
        }
        return false;
    },
    setupClasspath: function(dependencyArr) {
        if (!isJvmCreated() && (!isNil(dependencyArr) && isArray(dependencyArr))) {
            java.classpath.push.apply(java.classpath, dependencyArr);
            return true;
        }
        else if (isJvmCreated()) {
            console.error('You\'ve tried to add an option to an already running JVM!');
            console.error('This isn\'t currently supported.  Please add all option entries before calling any java methods');
            console.error('You can test for a running JVM with the isJvmCreated function.');
        }
        return false;
    },
    getInstance: function() {
        return java;
    },
    events: new EventEmitter(),
};
