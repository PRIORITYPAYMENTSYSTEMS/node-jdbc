const {
    isInteger,
} = require('lodash');

class ResultSetMetaData {

    constructor(rsmd) {
        this.rsmd = rsmd;
    }

    getColumnCount() {
        return this.rsmd.getColumnCountSync();
    }

    getColumnName(column) {
        if (!isInteger(column))
            throw new Error('INVALID ARGUMENTS');

        return this.rsmd.getColumnNameSync(column);
    }
}

module.exports = ResultSetMetaData;