const sandbox = require('sinon').createSandbox();
const { assert } = require('chai');
const proxyquire = require('proxyquire');
const jinst = require('../../lib/jinst');
const java = jinst.getInstance();

const ResultSet = require('../../lib/resultSet');

describe('Database Metadata', function() {

    let testDM, stubs, javaInst, DatabaseMetadata;

    before(function() {

        javaInst = {
            newInstanceSync: sandbox.stub(),
            import: sandbox.stub().withArgs('java.util.Properties').returns(java.import('java.util.Properties')),
            getStaticFieldValue: sandbox.stub(),
        };

        stubs = {
            dm: {
                getSchemasSync: sandbox.stub(),
                getTablesSync: sandbox.stub(),
                allProceduresAreCallableSync: sandbox.stub(),
                allTablesAreSelectableSync: sandbox.stub(),
                autoCommitFailureClosesAllResultSetsSync: sandbox.stub(),
                dataDefinitionCausesTransactionCommitSync: sandbox.stub(),
                dataDefinitionIgnoredInTransactionsSync: sandbox.stub(),
                deletesAreDetectedSync: sandbox.stub(),
                doesMaxRowSizeIncludeBlobsSync: sandbox.stub(),
                generatedKeyAlwaysReturnedSync: sandbox.stub(),
                getAttributesSync: sandbox.stub(),
                getBestRowIdentifierSync: sandbox.stub(),
                getCatalogsSync: sandbox.stub(),
                getCatalogSeparatorSync: sandbox.stub(),
                getCatalogTermSync: sandbox.stub(),
                getClientInfoPropertiesSync: sandbox.stub(),
                getColumnPrivilegesSync: sandbox.stub(),
                getColumnsSync: sandbox.stub(),
                getCrossReferenceSync: sandbox.stub(),
                getConnectionSync: sandbox.stub(),
                getDatabaseMajorVersionSync: sandbox.stub(),
                getDatabaseMinorVersionSync: sandbox.stub(),
                getDatabaseProductNameSync: sandbox.stub(),
                getDatabaseProductVersionSync: sandbox.stub(),
                getDefaultTransactionIsolationSync: sandbox.stub(),
                getDriverMajorVersionSync: sandbox.stub(),
                getDriverMinorVersionSync: sandbox.stub(),
                getDriverNameSync: sandbox.stub(),
                getDriverVersionSync: sandbox.stub(),
                getJDBCMajorVersionSync: sandbox.stub(),
                getJDBCMinorVersionSync: sandbox.stub(),
                getExportedKeysSync: sandbox.stub(),
                getExtraNameCharactersSync: sandbox.stub(),
                getFunctionColumnsSync: sandbox.stub(),
                getFunctionsSync: sandbox.stub(),
                getIdentifierQuoteStringSync: sandbox.stub(),
                getImportedKeysSync: sandbox.stub(),
                getIndexInfoSync: sandbox.stub(),
                getMaxBinaryLiteralLengthSync: sandbox.stub(),
                getMaxCatalogNameLengthSync: sandbox.stub(),
                getMaxCharLiteralLengthSync: sandbox.stub(),
                getMaxColumnNameLengthSync: sandbox.stub(),
                getMaxColumnsInGroupBySync: sandbox.stub(),
                getMaxColumnsInIndexSync: sandbox.stub(),
                getMaxColumnsInOrderBySync: sandbox.stub(),
                getMaxColumnsInSelectSync: sandbox.stub(),
                getMaxColumnsInTableSync: sandbox.stub(),
                getMaxConnectionsSync: sandbox.stub(),
                getMaxCursorNameLengthSync: sandbox.stub(),
                getMaxIndexLengthSync: sandbox.stub(),
                getMaxProcedureNameLengthSync: sandbox.stub(),
                getMaxRowSizeSync: sandbox.stub(),
                getMaxSchemaNameLengthSync: sandbox.stub(),
                getMaxStatementLengthSync: sandbox.stub(),
                getMaxStatementsSync: sandbox.stub(),
                getMaxTableNameLengthSync: sandbox.stub(),
                getMaxTablesInSelectSync: sandbox.stub(),
                getMaxUserNameLengthSync: sandbox.stub(),
                getNumericFunctionsSync: sandbox.stub(),
                getPrimaryKeysSync: sandbox.stub(),
                procedureColumnsSync: sandbox.stub(),
                getProceduresSync: sandbox.stub(),
                getProcedureTermSync: sandbox.stub(),
                getPseudoColumnsSync: sandbox.stub(),
                getResultSetHoldabilitySync: sandbox.stub(),
                getRowIdLifetimeSync: sandbox.stub(),
                getSchemaTermSync: sandbox.stub(),
                getSearchStringEscapeSync: sandbox.stub(),
                getSQLKeywordsSync: sandbox.stub(),
                getSQLStateTypeSync: sandbox.stub(),
                getStringFunctionsSync: sandbox.stub(),
                getSuperTablesSync: sandbox.stub(),
                getSuperTypesSync: sandbox.stub(),
                getSystemFunctionsSync: sandbox.stub(),
                getTablePrivilegesSync: sandbox.stub(),
                getTableTypesSync: sandbox.stub(),
                getTimeDateFunctionsSync: sandbox.stub(),
                getTypeInfoSync: sandbox.stub(),
                getUDTsSync: sandbox.stub(),
                getURLSync: sandbox.stub(),
                getUserNameSync: sandbox.stub(),
                getVersionColumnsSync: sandbox.stub(),
                insertsAreDetectedSync: sandbox.stub(),
                isCatalogAtStartSync: sandbox.stub(),
                isReadOnlySync: sandbox.stub(),
                locatorsUpdateCopySync: sandbox.stub(),
                nullPlusNonNullIsNullSync: sandbox.stub(),
                nullsAreSortedAtEndSync: sandbox.stub(),
                nullsAreSortedAtStartSync: sandbox.stub(),
                nullsAreSortedHighSync: sandbox.stub(),
                nullsAreSortedLowSync: sandbox.stub(),
                othersDeletesAreVisibleSync: sandbox.stub(),
                othersInsertsAreVisibleSync: sandbox.stub(),
                othersUpdatesAreVisibleSync: sandbox.stub(),
                ownDeletesAreVisibleSync: sandbox.stub(),
                ownInsertsAreVisibleSync: sandbox.stub(),
                ownUpdatesAreVisibleSync: sandbox.stub(),
                storesLowerCaseIdentifiersSync: sandbox.stub(),
                storesLowerCaseQuotedIdentifiersSync: sandbox.stub(),
                storesMixedCaseIdentifiersSync: sandbox.stub(),
                storesMixedCaseQuotedIdentifiersSync: sandbox.stub(),
                storesUpperCaseIdentifiersSync: sandbox.stub(),
                storesUpperCaseQuotedIdentifiersSync: sandbox.stub(),
                supportsAlterTableWithAddColumnSync: sandbox.stub(),
                supportsAlterTableWithDropColumnSync: sandbox.stub(),
                supportsANSI92EntryLevelSQLSync: sandbox.stub(),
                supportsANSI92FullSQLSync: sandbox.stub(),
                supportsANSI92IntermediateSQLSync: sandbox.stub(),
                supportsBatchUpdatesSync: sandbox.stub(),
                supportsCatalogsInDataManipulationSync: sandbox.stub(),
                supportsCatalogsInIndexDefinitionsSync: sandbox.stub(),
                supportsCatalogsInPrivilegeDefinitionsSync: sandbox.stub(),
                supportsCatalogsInProcedureCallsSync: sandbox.stub(),
                supportsCatalogsInTableDefinitionsSync: sandbox.stub(),
                supportsColumnAliasingSync: sandbox.stub(),
                supportsConvertSync: sandbox.stub(),
                supportsCoreSQLGrammarSync: sandbox.stub(),
                supportsCorrelatedSubqueriesSync: sandbox.stub(),
                supportsDataDefinitionAndDataManipulationTransactionsSync: sandbox.stub(),
                supportsDataManipulationTransactionsOnlySync: sandbox.stub(),
                supportsDifferentTableCorrelationNamesSync: sandbox.stub(),
                supportsExpressionsInOrderBySync: sandbox.stub(),
                supportsExtendedSQLGrammarSync: sandbox.stub(),
                supportsFullOuterJoinsSync: sandbox.stub(),
                supportsGetGeneratedKeysSync: sandbox.stub(),
                supportsGroupBySync: sandbox.stub(),
                supportsGroupByBeyondSelectSync: sandbox.stub(),
                supportsGroupByUnrelatedSync: sandbox.stub(),
                supportsIntegrityEnhancementFacilitySync: sandbox.stub(),
                supportsLikeEscapeClauseSync: sandbox.stub(),
                supportsLimitedOuterJoinsSync: sandbox.stub(),
                supportsMinimumSQLGrammarSync: sandbox.stub(),
                supportsMixedCaseIdentifiersSync: sandbox.stub(),
                supportsMixedCaseQuotedIdentifiersSync: sandbox.stub(),
                supportsMultipleOpenResultsSync: sandbox.stub(),
                supportsMultipleResultSetsSync: sandbox.stub(),
                supportsMultipleTransactionsSync: sandbox.stub(),
                supportsNamedParametersSync: sandbox.stub(),
                supportsNonNullableColumnsSync: sandbox.stub(),
                supportsOpenCursorsAcrossCommitSync: sandbox.stub(),
                supportsOpenCursorsAcrossRollbackSync: sandbox.stub(),
                supportsOpenStatementsAcrossCommitSync: sandbox.stub(),
                supportsOpenStatementsAcrossRollbackSync: sandbox.stub(),
                supportsOrderByUnrelatedSync: sandbox.stub(),
                supportsOuterJoinsSync: sandbox.stub(),
                supportsPositionedDeleteSync: sandbox.stub(),
                supportsPositionedUpdateSync: sandbox.stub(),
                supportsResultSetConcurrency: sandbox.stub(),
                supportsResultSetHoldabilitySync: sandbox.stub(),
                supportsResultSetTypeSync: sandbox.stub(),
                supportsSavepointsSync: sandbox.stub(),
                supportsSchemasInIndexDefinitionsSync: sandbox.stub(),
                supportsSchemasInDataManipulationSync: sandbox.stub(),
                supportsSchemasInPrivilegeDefinitionsSync: sandbox.stub(),
                supportsSchemasInProcedureCallsSync: sandbox.stub(),
                supportsSchemasInTableDefinitionsSync: sandbox.stub(),
                supportsSelectForUpdateSync: sandbox.stub(),
                supportsStatementPoolingSync: sandbox.stub(),
                supportsStoredFunctionsUsingCallSyntaxSync: sandbox.stub(),
                supportsStoredProceduresSync: sandbox.stub(),
                supportsSubqueriesInComparisonsSync: sandbox.stub(),
                supportsSubqueriesInExistsSync: sandbox.stub(),
                supportsSubqueriesInInsSync: sandbox.stub(),
                supportsSubqueriesInQuantifiedsSync: sandbox.stub(),
                supportsTableCorrelationNamesSync: sandbox.stub(),
                supportsTransactionIsolationLevelSync: sandbox.stub(),
                supportsTransactionsSync: sandbox.stub(),
                supportsUnionSync: sandbox.stub(),
                supportsUnionAllSync: sandbox.stub(),
                updatesAreDetectedSync: sandbox.stub(),
                usesLocalFilePerTableSync: sandbox.stub(),
                usesLocalFilesSync: sandbox.stub(),
            },
            jinst: {
                getInstance: sandbox.stub().returns(javaInst),
            },
        };

        DatabaseMetadata = proxyquire('../../lib/databaseMetadata', {
            './jinst': stubs.jinst,
        });

        testDM = new DatabaseMetadata(stubs.dm);
    });

    after(function() {
        sandbox.restore();
    });

    it('getSchema', async function() {
        await assert.isFulfilled(testDM.getSchema());
    });

    it('getSchema should fail if passed bad parameters', async function() {
        await assert.isRejected(testDM.getSchema(1), 'INVALID ARGUMENTS');
        await assert.isRejected(testDM.getSchema('fake-catalog', 1), 'INVALID ARGUMENTS');
    });

    it('getTables', async function() {
        await assert.isFulfilled(testDM.getTables());
    });

    it('getTables should fail if passed bad parameters', async function() {
        await assert.isRejected(testDM.getTables(1), 'INVALID ARGUMENTS');
        await assert.isRejected(testDM.getTables('fake-table', 1), 'INVALID ARGUMENTS');
        await assert.isRejected(testDM.getTables('fake-table', 'fake-schema', 1), 'INVALID ARGUMENTS');
        await assert.isRejected(testDM.getTables('fake-table', 'fake-schema-pattern', 'fake-name-pattern', 'bad-types-param'), 'INVALID ARGUMENTS');
        await assert.isRejected(testDM.getTables('fake-table', 'fake-schema-pattern', 'fake-name-pattern', [1,2,3]), 'INVALID ARGUMENTS');
    });

    it('allProceduresAreCallable', async function() {
        await assert.isFulfilled(testDM.allProceduresAreCallable());
    });

    it('allTablesAreSelectable', async function() {
        await assert.isFulfilled(testDM.allTablesAreSelectable());
    });

    it('autoCommitFailureClosesAllResultSets', async function() {
        await assert.isFulfilled(testDM.autoCommitFailureClosesAllResultSets());
    });

    it('dataDefinitionCausesTransactionCommit', async function() {
        await assert.isFulfilled(testDM.dataDefinitionCausesTransactionCommit());
    });

    it('dataDefinitionIgnoredInTransactions', async function() {
        await assert.isFulfilled(testDM.dataDefinitionIgnoredInTransactions());
    });

    it('deletesAreDetected', async function() {
        await assert.isFulfilled(testDM.deletesAreDetected(1));
    });

    it('deletesAreDetected should fail if passed bad parameters', async function() {
        await assert.isRejected(testDM.deletesAreDetected('fake-param'), 'INVALID ARGUMENTS');
    });

    it('doesMaxRowSizeIncludeBlobs', async function() {
        await assert.isFulfilled(testDM.doesMaxRowSizeIncludeBlobs());
    });

    it('generatedKeyAlwaysReturned', async function() {
        await assert.isFulfilled(testDM.generatedKeyAlwaysReturned());
    });

    it('getAttributes', async function() {
        await assert.isFulfilled(testDM.getAttributes());
    });

    it('getAttributes should fail if passed bad parameters', async function() {
        await assert.isRejected(testDM.getAttributes(1), 'INVALID ARGUMENTS');
        await assert.isRejected(testDM.getAttributes('fake-table', 1), 'INVALID ARGUMENTS');
        await assert.isRejected(testDM.getAttributes('fake-table', 'fake-schema', 1), 'INVALID ARGUMENTS');
        await assert.isRejected(testDM.getAttributes('fake-table', 'fake-schema-pattern', 'fake-name-pattern', 1), 'INVALID ARGUMENTS');
    });

    it('getBestRowIdentifier', async function() {
        await assert.isFulfilled(testDM.getBestRowIdentifier('fake-catalog', 'fake-schema', 'fake-table', 1, true));
    });

    it('getBestRowIdentifier should fail if passed bad parameters', async function() {
        await assert.isRejected(testDM.getBestRowIdentifier(1), 'INVALID ARGUMENTS');
        await assert.isRejected(testDM.getBestRowIdentifier('fake-catalog', 1), 'INVALID ARGUMENTS');
        await assert.isRejected(testDM.getBestRowIdentifier('fake-catalog', 'fake-schema', 1), 'INVALID ARGUMENTS');
        await assert.isRejected(testDM.getBestRowIdentifier('fake-catalog', 'fake-schema', 'fake-table', 'bad-scope'), 'INVALID ARGUMENTS');
        await assert.isRejected(testDM.getBestRowIdentifier('fake-catalog', 'fake-schema', 'fake-table', 1, 'bad-nullable'), 'INVALID ARGUMENTS');
    });

    it('getCatalogs', async function() {
        await assert.isFulfilled(testDM.getCatalogs());
    });

    it('getCatalogSeparator', async function() {
        await assert.isFulfilled(testDM.getCatalogSeparator());
    });

    it('getCatalogTerm', async function() {
        await assert.isFulfilled(testDM.getCatalogTerm());
    });

    it('getClientInfoProperties', async function() {
        await assert.isFulfilled(testDM.getClientInfoProperties());
        await assert.instanceOf(await testDM.getClientInfoProperties(), ResultSet, 'getClientInfoProperties is not a ResultSet');
    });

    it('getColumnPrivileges', async function() {
        await assert.isFulfilled(testDM.getColumnPrivileges(null,null,'fake-table'));
        await assert.instanceOf(await testDM.getColumnPrivileges(null,null,'fake-table'), ResultSet, 'getColumnPrivileges is not a ResultSet');
    });

    it('getColumnPrivileges should fail if passed bad parameters', async function() {
        await assert.isRejected(testDM.getColumnPrivileges(1), 'INVALID ARGUMENTS');
        await assert.isRejected(testDM.getColumnPrivileges('fake-catalog', 1), 'INVALID ARGUMENTS');
        await assert.isRejected(testDM.getColumnPrivileges('fake-catalog', 'fake-schema', 1), 'INVALID ARGUMENTS');
        await assert.isRejected(testDM.getColumnPrivileges('fake-catalog', 'fake-schema', ''), 'INVALID ARGUMENTS');
        await assert.isRejected(testDM.getColumnPrivileges('fake-catalog', 'fake-schema', 'fake-table', 1), 'INVALID ARGUMENTS');
    });

    it('getColumns', async function() {
        await assert.isFulfilled(testDM.getColumns());
        await assert.instanceOf(await testDM.getColumns(), ResultSet, 'getColumns is not a ResultSet');
    });

    it('getColumns should fail if passed bad parameters', async function() {
        await assert.isRejected(testDM.getColumns(1), 'INVALID ARGUMENTS');
        await assert.isRejected(testDM.getColumns('fake-catalog', 1), 'INVALID ARGUMENTS');
        await assert.isRejected(testDM.getColumns('fake-catalog', 'fake-schema', 1), 'INVALID ARGUMENTS');
        await assert.isRejected(testDM.getColumns('fake-catalog', 'fake-schema', 'fake-table', 1), 'INVALID ARGUMENTS');
    });

    it('getConnection', async function() {
        await assert.isFulfilled(testDM.getConnection());
    });

    it('getCrossReference', async function() {
        await assert.isFulfilled(testDM.getCrossReference(null, null, 'fake-parent-table', null, null, 'fake-foreign-table'));
        await assert.instanceOf(await testDM.getCrossReference(null, null, 'fake-parent-table', null, null, 'fake-foreign-table'),
            ResultSet, 'getColumns is not a ResultSet');
    });

    it('getCrossReference should fail if passed bad parameters', async function() {
        await assert.isRejected(testDM.getCrossReference(1), 'INVALID ARGUMENTS');
        await assert.isRejected(testDM.getCrossReference('fake-parent-catalog', 1), 'INVALID ARGUMENTS');
        await assert.isRejected(testDM.getCrossReference('fake-parent-catalog', 'fake-parent-schema', 1), 'INVALID ARGUMENTS');
        await assert.isRejected(testDM.getCrossReference('fake-parent-catalog', 'fake-parent-schema', ''), 'INVALID ARGUMENTS');
        await assert.isRejected(testDM.getCrossReference('fake-parent-catalog', 'fake-parent-schema', 'fake-parent-table', 1), 'INVALID ARGUMENTS');
        await assert.isRejected(testDM.getCrossReference(
            'fake-parent-catalog', 'fake-parent-schema', 'fake-parent-table', 'fake-foreign-cataglog', 1), 'INVALID ARGUMENTS');
        await assert.isRejected(testDM.getCrossReference(
            'fake-parent-catalog', 'fake-parent-schema', 'fake-parent-table', 'fake-foreign-catalog', 'fake-foreign-schema', 1), 'INVALID ARGUMENTS');
        await assert.isRejected(testDM.getCrossReference(
            'fake-parent-catalog', 'fake-parent-schema', 'fake-parent-table',
            'fake-foreign-catalog', 'fake-foreign-schema', ''),
        'INVALID ARGUMENTS');
    });

    it('getDatabaseMajorVersion', async function() {
        await assert.isFulfilled(testDM.getDatabaseMajorVersion());
    });

    it('getDatabaseMinorVersion', async function() {
        await assert.isFulfilled(testDM.getDatabaseMinorVersion());
    });

    it('getDatabaseProductName', async function() {
        await assert.isFulfilled(testDM.getDatabaseProductName());
    });

    it('getDatabaseProductVersion', async function() {
        await assert.isFulfilled(testDM.getDatabaseProductVersion());
    });

    it('getDefaultTransactionIsolation', async function() {
        await assert.isFulfilled(testDM.getDefaultTransactionIsolation());
    });

    it('getDriverMajorVersion', async function() {
        await assert.isFulfilled(testDM.getDriverMajorVersion());
    });

    it('getDriverMinorVersion', async function() {
        await assert.isFulfilled(testDM.getDriverMinorVersion());
    });

    it('getDriverName', async function() {
        await assert.isFulfilled(testDM.getDriverName());
    });

    it('getDriverVersion', async function() {
        await assert.isFulfilled(testDM.getDriverVersion());
    });

    it('getJDBCMajorVersion', async function() {
        await assert.isFulfilled(testDM.getJDBCMajorVersion());
    });

    it('getJDBCMinorVersion', async function() {
        await assert.isFulfilled(testDM.getJDBCMinorVersion());
    });

    it('getExportedKeys', async function() {
        await assert.isFulfilled(testDM.getExportedKeys(null, null, 'fake-table'));
    });

    it('getExportedKeys should fail if passed bad parameters', async function() {
        await assert.isRejected(testDM.getExportedKeys(1), 'INVALID ARGUMENTS');
        await assert.isRejected(testDM.getExportedKeys('fake-catalog', 1), 'INVALID ARGUMENTS');
        await assert.isRejected(testDM.getExportedKeys('fake-catalog', 'fake-schema', 1), 'INVALID ARGUMENTS');
        await assert.isRejected(testDM.getExportedKeys('fake-catalog', 'fake-schema', ''), 'INVALID ARGUMENTS');
    });

    it('getExtraNameCharacters', async function() {
        await assert.isFulfilled(testDM.getExtraNameCharacters());
    });

    it('getFunctionColumns', async function() {
        await assert.isFulfilled(testDM.getFunctionColumns());
    });

    it('getFunctionColumns should fail if passed bad parameters', async function() {
        await assert.isRejected(testDM.getFunctionColumns(1), 'INVALID ARGUMENTS');
        await assert.isRejected(testDM.getFunctionColumns('fake-catalog', 1), 'INVALID ARGUMENTS');
        await assert.isRejected(testDM.getFunctionColumns('fake-catalog', 'fake-schema-pattern', 1), 'INVALID ARGUMENTS');
        await assert.isRejected(testDM.getFunctionColumns('fake-catalog', 'fake-schema-pattern', 'fake-function-pattern', 1), 'INVALID ARGUMENTS');
    });

    it('getFunctions', async function() {
        await assert.isFulfilled(testDM.getFunctions());
    });

    it('getFunctions should fail if passed bad parameters', async function() {
        await assert.isRejected(testDM.getFunctions(1), 'INVALID ARGUMENTS');
        await assert.isRejected(testDM.getFunctions('fake-catalog', 1), 'INVALID ARGUMENTS');
        await assert.isRejected(testDM.getFunctions('fake-catalog', 'fake-schema-pattern', 1), 'INVALID ARGUMENTS');
    });

    it('getIdentifierQuoteString', async function() {
        await assert.isFulfilled(testDM.getIdentifierQuoteString());
    });

    it('getImportedKeys', async function() {
        await assert.isFulfilled(testDM.getImportedKeys(null, null, 'fake-table'));
    });

    it('getImportedKeys should fail if passed bad parameters', async function() {
        await assert.isRejected(testDM.getImportedKeys(1), 'INVALID ARGUMENTS');
        await assert.isRejected(testDM.getImportedKeys('fake-catalog', 1), 'INVALID ARGUMENTS');
        await assert.isRejected(testDM.getImportedKeys('fake-catalog', 'fake-schema', 1), 'INVALID ARGUMENTS');
        await assert.isRejected(testDM.getImportedKeys('fake-catalog', 'fake-schema', ''), 'INVALID ARGUMENTS');
    });

    it('getIndexInfo', async function() {
        await assert.isFulfilled(testDM.getIndexInfo(null, null, 'fake-table', false, false));
    });

    it('getIndexInfo should fail if passed bad parameters', async function() {
        await assert.isRejected(testDM.getIndexInfo(1), 'INVALID ARGUMENTS');
        await assert.isRejected(testDM.getIndexInfo('fake-catalog', 1), 'INVALID ARGUMENTS');
        await assert.isRejected(testDM.getIndexInfo('fake-catalog', 'fake-schema', 1), 'INVALID ARGUMENTS');
        await assert.isRejected(testDM.getIndexInfo('fake-catalog', 'fake-schema', ''), 'INVALID ARGUMENTS');
        await assert.isRejected(testDM.getIndexInfo('fake-catalog', 'fake-schema', 'fake-table', 'bad-param'), 'INVALID ARGUMENTS');
        await assert.isRejected(testDM.getIndexInfo('fake-catalog', 'fake-schema', 'fake-table', false, 'bad-param'), 'INVALID ARGUMENTS');
    });

    it('getMaxBinaryLiteralLength', async function() {
        await assert.isFulfilled(testDM.getMaxBinaryLiteralLength());
    });

    it('getMaxCatalogNameLength', async function() {
        await assert.isFulfilled(testDM.getMaxCatalogNameLength());
    });

    it('getMaxCharLiteralLength', async function() {
        await assert.isFulfilled(testDM.getMaxCharLiteralLength());
    });

    it('getMaxColumnNameLength', async function() {
        await assert.isFulfilled(testDM.getMaxColumnNameLength());
    });

    it('getMaxColumnsInGroupBy', async function() {
        await assert.isFulfilled(testDM.getMaxColumnsInGroupBy());
    });

    it('getMaxColumnsInIndex', async function() {
        await assert.isFulfilled(testDM.getMaxColumnsInIndex());
    });

    it('getMaxColumnsInOrderBy', async function() {
        await assert.isFulfilled(testDM.getMaxColumnsInOrderBy());
    });

    it('getMaxColumnsInSelect', async function() {
        await assert.isFulfilled(testDM.getMaxColumnsInSelect());
    });

    it('getMaxColumnsInTable', async function() {
        await assert.isFulfilled(testDM.getMaxColumnsInTable());
    });

    it('getMaxConnections', async function() {
        await assert.isFulfilled(testDM.getMaxConnections());
    });

    it('getMaxCursorNameLength', async function() {
        await assert.isFulfilled(testDM.getMaxCursorNameLength());
    });

    it('getMaxIndexLength', async function() {
        await assert.isFulfilled(testDM.getMaxIndexLength());
    });

    it('getMaxProcedureNameLength', async function() {
        await assert.isFulfilled(testDM.getMaxProcedureNameLength());
    });

    it('getMaxRowSize', async function() {
        await assert.isFulfilled(testDM.getMaxRowSize());
    });

    it('getMaxSchemaNameLength', async function() {
        await assert.isFulfilled(testDM.getMaxSchemaNameLength());
    });

    it('getMaxStatementLength', async function() {
        await assert.isFulfilled(testDM.getMaxStatementLength());
    });

    it('getMaxStatements', async function() {
        await assert.isFulfilled(testDM.getMaxStatements());
    });

    it('getMaxTableNameLength', async function() {
        await assert.isFulfilled(testDM.getMaxTableNameLength());
    });

    it('getMaxTablesInSelect', async function() {
        await assert.isFulfilled(testDM.getMaxTablesInSelect());
    });

    it('getMaxUserNameLength', async function() {
        await assert.isFulfilled(testDM.getMaxUserNameLength());
    });

    it('getNumericFunctions', async function() {
        await assert.isFulfilled(testDM.getNumericFunctions());
    });

    it('getPrimaryKeys', async function() {
        await assert.isFulfilled(testDM.getPrimaryKeys(null, null, 'fake-table'));
        await assert.instanceOf(await testDM.getPrimaryKeys(null, null, 'fake-table'), ResultSet, 'getPrimaryKeys is not a ResultSet');
    });

    it('getPrimaryKeys should fail if passed bad parameters', async function() {
        await assert.isRejected(testDM.getPrimaryKeys(1), 'INVALID ARGUMENTS');
        await assert.isRejected(testDM.getPrimaryKeys('fake-catalog', 1), 'INVALID ARGUMENTS');
        await assert.isRejected(testDM.getPrimaryKeys('fake-catalog', 'fake-schema', 1), 'INVALID ARGUMENTS');
        await assert.isRejected(testDM.getPrimaryKeys('fake-catalog', 'fake-schema', ''), 'INVALID ARGUMENTS');
    });

    it('getProcedureColumns', async function() {
        await assert.isFulfilled(testDM.getProcedureColumns());
        await assert.instanceOf(await testDM.getProcedureColumns(), ResultSet, 'getProcedureColumns is not a ResultSet');
    });

    it('getProcedureColumns should fail if passed bad parameters', async function() {
        await assert.isRejected(testDM.getProcedureColumns(1), 'INVALID ARGUMENTS');
        await assert.isRejected(testDM.getProcedureColumns('fake-catalog', 1), 'INVALID ARGUMENTS');
        await assert.isRejected(testDM.getProcedureColumns('fake-catalog', 'fake-schema-pattern', 1), 'INVALID ARGUMENTS');
        await assert.isRejected(testDM.getProcedureColumns('fake-catalog', 'fake-schema-pattern', 'fake-procedure-pattern', 1), 'INVALID ARGUMENTS');
    });

    it('getProcedures', async function() {
        await assert.isFulfilled(testDM.getProcedures());
        await assert.instanceOf(await testDM.getProcedures(), ResultSet, 'getProcedures is not a ResultSet');
    });

    it('getProcedures should fail if passed bad parameters', async function() {
        await assert.isRejected(testDM.getProcedures(1), 'INVALID ARGUMENTS');
        await assert.isRejected(testDM.getProcedures('fake-catalog', 1), 'INVALID ARGUMENTS');
        await assert.isRejected(testDM.getProcedures('fake-catalog', 'fake-schema-pattern', 1), 'INVALID ARGUMENTS');
    });

    it('getProcedureTerm', async function() {
        await assert.isFulfilled(testDM.getProcedureTerm());
    });

    it('getPseudoColumns', async function() {
        await assert.isFulfilled(testDM.getPseudoColumns());
        await assert.instanceOf(await testDM.getPseudoColumns(), ResultSet, 'getPseudoColumns is not a ResultSet');
    });

    it('getPseudoColumns should fail if passed bad parameters', async function() {
        await assert.isRejected(testDM.getPseudoColumns(1), 'INVALID ARGUMENTS');
        await assert.isRejected(testDM.getPseudoColumns('fake-catalog', 1), 'INVALID ARGUMENTS');
        await assert.isRejected(testDM.getPseudoColumns('fake-catalog', 'fake-schema-pattern', 1), 'INVALID ARGUMENTS');
        await assert.isRejected(testDM.getPseudoColumns('fake-catalog', 'fake-schema-pattern', 'fake-procedure-pattern', 1), 'INVALID ARGUMENTS');
    });

    it('getResultSetHoldability', async function() {
        await assert.isFulfilled(testDM.getResultSetHoldability());
    });

    it('getRowIdLifetime', async function() {
        await assert.isFulfilled(testDM.getRowIdLifetime());
    });

    it('getSchemaTerm', async function() {
        await assert.isFulfilled(testDM.getSchemaTerm());
    });

    it('getSearchStringEscape', async function() {
        await assert.isFulfilled(testDM.getSearchStringEscape());
    });

    it('getSQLKeywords', async function() {
        await assert.isFulfilled(testDM.getSQLKeywords());
    });

    it('getSQLStateType', async function() {
        await assert.isFulfilled(testDM.getSQLStateType());
    });

    it('getStringFunctions', async function() {
        await assert.isFulfilled(testDM.getStringFunctions());
    });

    it('getSuperTables', async function() {
        await assert.isFulfilled(testDM.getSuperTables());
        await assert.instanceOf(await testDM.getSuperTables(), ResultSet, 'getSuperTables is not a ResultSet');
    });

    it('getSuperTables should fail if passed bad parameters', async function() {
        await assert.isRejected(testDM.getSuperTables(1), 'INVALID ARGUMENTS');
        await assert.isRejected(testDM.getSuperTables('fake-catalog', 1), 'INVALID ARGUMENTS');
        await assert.isRejected(testDM.getSuperTables('fake-catalog', 'fake-schema-pattern', 1), 'INVALID ARGUMENTS');
    });

    it('getSuperTypes', async function() {
        await assert.isFulfilled(testDM.getSuperTypes());
        await assert.instanceOf(await testDM.getSuperTypes(), ResultSet, 'getSuperTypes is not a ResultSet');
    });

    it('getSuperTypes should fail if passed bad parameters', async function() {
        await assert.isRejected(testDM.getSuperTypes(1), 'INVALID ARGUMENTS');
        await assert.isRejected(testDM.getSuperTypes('fake-catalog', 1), 'INVALID ARGUMENTS');
        await assert.isRejected(testDM.getSuperTypes('fake-catalog', 'fake-schema-pattern', 1), 'INVALID ARGUMENTS');
    });

    it('getSystemFunctions', async function() {
        await assert.isFulfilled(testDM.getSystemFunctions());
    });

    it('getTablePrivileges', async function() {
        await assert.isFulfilled(testDM.getTablePrivileges());
        await assert.instanceOf(await testDM.getTablePrivileges(), ResultSet, 'getTablePrivileges is not a ResultSet');
    });

    it('getTablePrivileges should fail if passed bad parameters', async function() {
        await assert.isRejected(testDM.getTablePrivileges(1), 'INVALID ARGUMENTS');
        await assert.isRejected(testDM.getTablePrivileges('fake-catalog', 1), 'INVALID ARGUMENTS');
        await assert.isRejected(testDM.getTablePrivileges('fake-catalog', 'fake-schema-pattern', 1), 'INVALID ARGUMENTS');
    });

    it('getTableTypes', async function() {
        await assert.isFulfilled(testDM.getTableTypes());
    });

    it('getTimeDateFunctions', async function() {
        await assert.isFulfilled(testDM.getTimeDateFunctions());
    });

    it('getTypeInfo', async function() {
        await assert.isFulfilled(testDM.getTypeInfo());
    });

    it('getUDTs', async function() {
        await assert.isFulfilled(testDM.getUDTs());
        await assert.instanceOf(await testDM.getUDTs(), ResultSet, 'getUDTs is not a ResultSet');
    });

    it('getUDTs should fail if passed bad parameters', async function() {
        await assert.isRejected(testDM.getUDTs(1), 'INVALID ARGUMENTS');
        await assert.isRejected(testDM.getUDTs('fake-catalog', 1), 'INVALID ARGUMENTS');
        await assert.isRejected(testDM.getUDTs('fake-catalog', 'fake-schema-pattern', 1), 'INVALID ARGUMENTS');
        await assert.isRejected(testDM.getUDTs('fake-catalog', 'fake-schema-pattern', 'fake-typename-pattern', 1), 'INVALID ARGUMENTS');
        await assert.isRejected(testDM.getUDTs('fake-catalog', 'fake-schema-pattern', 'fake-typename-pattern', ['bad-param']), 'INVALID ARGUMENTS');
    });

    it('getURL', async function() {
        await assert.isFulfilled(testDM.getURL());
    });

    it('getUserName', async function() {
        await assert.isFulfilled(testDM.getUserName());
    });

    it('getVersionColumns', async function() {
        await assert.isFulfilled(testDM.getVersionColumns(null, null, 'fake-table'));
        await assert.instanceOf(await testDM.getVersionColumns(null, null, 'fake-table'), ResultSet, 'getVersionColumns is not a ResultSet');
    });

    it('getVersionColumns should fail if passed bad parameters', async function() {
        await assert.isRejected(testDM.getVersionColumns(1), 'INVALID ARGUMENTS');
        await assert.isRejected(testDM.getVersionColumns('fake-catalog', 1), 'INVALID ARGUMENTS');
        await assert.isRejected(testDM.getVersionColumns('fake-catalog', 'fake-schema', 1), 'INVALID ARGUMENTS');
        await assert.isRejected(testDM.getVersionColumns('fake-catalog', 'fake-schema', ''), 'INVALID ARGUMENTS');
    });

    it('insertsAreDetected', async function() {
        await assert.isFulfilled(testDM.insertsAreDetected(1));
    });

    it('insertsAreDetected should fail if passed bad parameters', async function() {
        await assert.isRejected(testDM.insertsAreDetected('bad-param', 'INVALID ARGUMENTS'));
    });

    it('isCatalogAtStart', async function() {
        await assert.isFulfilled(testDM.isCatalogAtStart());
    });

    it('isReadOnly', async function() {
        await assert.isFulfilled(testDM.isReadOnly());
    });

    it('locatorsUpdateCopy', async function() {
        await assert.isFulfilled(testDM.locatorsUpdateCopy());
    });

    it('nullPlusNonNullIsNull', async function() {
        await assert.isFulfilled(testDM.nullPlusNonNullIsNull());
    });

    it('nullsAreSortedAtEnd', async function() {
        await assert.isFulfilled(testDM.nullsAreSortedAtEnd());
    });

    it('nullsAreSortedAtStart', async function() {
        await assert.isFulfilled(testDM.nullsAreSortedAtStart());
    });

    it('nullsAreSortedHigh', async function() {
        await assert.isFulfilled(testDM.nullsAreSortedHigh());
    });

    it('nullsAreSortedLow', async function() {
        await assert.isFulfilled(testDM.nullsAreSortedLow());
    });

    it('othersDeletesAreVisible', async function() {
        await assert.isFulfilled(testDM.othersDeletesAreVisible(1));
    });

    it('othersDeletesAreVisible should fail if passed bad parameters', async function() {
        await assert.isRejected(testDM.othersDeletesAreVisible('bad-param', 'INVALID ARGUMENTS'));
    });

    it('othersInsertsAreVisible', async function() {
        await assert.isFulfilled(testDM.othersInsertsAreVisible(1));
    });

    it('othersInsertsAreVisible should fail if passed bad parameters', async function() {
        await assert.isRejected(testDM.othersInsertsAreVisible('bad-param', 'INVALID ARGUMENTS'));
    });

    it('othersUpdatesAreVisible', async function() {
        await assert.isFulfilled(testDM.othersUpdatesAreVisible(1));
    });

    it('othersUpdatesAreVisible should fail if passed bad parameters', async function() {
        await assert.isRejected(testDM.othersUpdatesAreVisible('bad-param', 'INVALID ARGUMENTS'));
    });

    it('ownDeletesAreVisible', async function() {
        await assert.isFulfilled(testDM.ownDeletesAreVisible(1));
    });

    it('ownDeletesAreVisible should fail if passed bad parameters', async function() {
        await assert.isRejected(testDM.ownDeletesAreVisible('bad-param', 'INVALID ARGUMENTS'));
    });

    it('ownInsertsAreVisible', async function() {
        await assert.isFulfilled(testDM.ownInsertsAreVisible(1));
    });

    it('ownInsertsAreVisible should fail if passed bad parameters', async function() {
        await assert.isRejected(testDM.ownInsertsAreVisible('bad-param', 'INVALID ARGUMENTS'));
    });

    it('ownUpdatesAreVisible', async function() {
        await assert.isFulfilled(testDM.ownUpdatesAreVisible(1));
    });

    it('ownUpdatesAreVisible should fail if passed bad parameters', async function() {
        await assert.isRejected(testDM.ownUpdatesAreVisible('bad-param', 'INVALID ARGUMENTS'));
    });

    it('storesLowerCaseIdentifiers', async function() {
        await assert.isFulfilled(testDM.storesLowerCaseIdentifiers());
    });

    it('storesLowerCaseQuotedIdentifiers', async function() {
        await assert.isFulfilled(testDM.storesLowerCaseQuotedIdentifiers());
    });

    it('storesMixedCaseIdentifiers', async function() {
        await assert.isFulfilled(testDM.storesMixedCaseIdentifiers());
    });

    it('storesMixedCaseQuotedIdentifiers', async function() {
        await assert.isFulfilled(testDM.storesMixedCaseQuotedIdentifiers());
    });

    it('storesUpperCaseIdentifiers', async function() {
        await assert.isFulfilled(testDM.storesUpperCaseIdentifiers());
    });

    it('storesUpperCaseQuotedIdentifiers', async function() {
        await assert.isFulfilled(testDM.storesUpperCaseQuotedIdentifiers());
    });

    it('supportsAlterTableWithAddColumn', async function() {
        await assert.isFulfilled(testDM.supportsAlterTableWithAddColumn());
    });

    it('supportsAlterTableWithDropColumn', async function() {
        await assert.isFulfilled(testDM.supportsAlterTableWithDropColumn());
    });

    it('supportsANSI92EntryLevelSQL', async function() {
        await assert.isFulfilled(testDM.supportsANSI92EntryLevelSQL());
    });

    it('supportsANSI92FullSQL', async function() {
        await assert.isFulfilled(testDM.supportsANSI92FullSQL());
    });

    it('supportsANSI92IntermediateSQL', async function() {
        await assert.isFulfilled(testDM.supportsANSI92IntermediateSQL());
    });

    it('supportsBatchUpdates', async function() {
        await assert.isFulfilled(testDM.supportsBatchUpdates());
    });

    it('supportsCatalogsInDataManipulation', async function() {
        await assert.isFulfilled(testDM.supportsCatalogsInDataManipulation());
    });

    it('supportsCatalogsInIndexDefinitions', async function() {
        await assert.isFulfilled(testDM.supportsCatalogsInIndexDefinitions());
    });

    it('supportsCatalogsInPrivilegeDefinitions', async function() {
        await assert.isFulfilled(testDM.supportsCatalogsInPrivilegeDefinitions());
    });

    it('supportsCatalogsInProcedureCalls', async function() {
        await assert.isFulfilled(testDM.supportsCatalogsInProcedureCalls());
    });

    it('supportsCatalogsInTableDefinitions', async function() {
        await assert.isFulfilled(testDM.supportsCatalogsInTableDefinitions());
    });

    it('supportsColumnAliasing', async function() {
        await assert.isFulfilled(testDM.supportsColumnAliasing());
    });

    it('supportsConvert', async function() {
        await assert.isFulfilled(testDM.supportsConvert(1, 2));
    });

    it('supportsConvert should fail if passed bad parameters', async function() {
        await assert.isRejected(testDM.supportsConvert('bad-param', 2), 'INVALID ARGUMENTS');
        await assert.isRejected(testDM.supportsConvert(1, 'bad-param'), 'INVALID ARGUMENTS');
    });

    it('supportsCoreSQLGrammar', async function() {
        await assert.isFulfilled(testDM.supportsCoreSQLGrammar());
    });

    it('supportsCorrelatedSubqueries', async function() {
        await assert.isFulfilled(testDM.supportsCorrelatedSubqueries());
    });

    it('supportsDataDefinitionAndDataManipulationTransactions', async function() {
        await assert.isFulfilled(testDM.supportsDataDefinitionAndDataManipulationTransactions());
    });

    it('supportsDataManipulationTransactionsOnly', async function() {
        await assert.isFulfilled(testDM.supportsDataManipulationTransactionsOnly());
    });

    it('supportsDifferentTableCorrelationNames', async function() {
        await assert.isFulfilled(testDM.supportsDifferentTableCorrelationNames());
    });

    it('supportsExpressionsInOrderBy', async function() {
        await assert.isFulfilled(testDM.supportsExpressionsInOrderBy());
    });

    it('supportsExtendedSQLGrammar', async function() {
        await assert.isFulfilled(testDM.supportsExtendedSQLGrammar());
    });

    it('supportsFullOuterJoins', async function() {
        await assert.isFulfilled(testDM.supportsFullOuterJoins());
    });

    it('supportsGetGeneratedKeys', async function() {
        await assert.isFulfilled(testDM.supportsGetGeneratedKeys());
    });

    it('supportsGroupBy', async function() {
        await assert.isFulfilled(testDM.supportsGroupBy());
    });

    it('supportsGroupByBeyondSelect', async function() {
        await assert.isFulfilled(testDM.supportsGroupByBeyondSelect());
    });

    it('supportsGroupByUnrelated', async function() {
        await assert.isFulfilled(testDM.supportsGroupByUnrelated());
    });

    it('supportsIntegrityEnhancementFacility', async function() {
        await assert.isFulfilled(testDM.supportsIntegrityEnhancementFacility());
    });

    it('supportsLikeEscapeClause', async function() {
        await assert.isFulfilled(testDM.supportsLikeEscapeClause());
    });

    it('supportsLimitedOuterJoins', async function() {
        await assert.isFulfilled(testDM.supportsLimitedOuterJoins());
    });

    it('supportsMinimumSQLGrammar', async function() {
        await assert.isFulfilled(testDM.supportsMinimumSQLGrammar());
    });

    it('supportsMixedCaseIdentifiers', async function() {
        await assert.isFulfilled(testDM.supportsMixedCaseIdentifiers());
    });

    it('supportsMixedCaseQuotedIdentifiers', async function() {
        await assert.isFulfilled(testDM.supportsMixedCaseQuotedIdentifiers());
    });

    it('supportsMultipleOpenResults', async function() {
        await assert.isFulfilled(testDM.supportsMultipleOpenResults());
    });

    it('supportsMultipleResultSets', async function() {
        await assert.isFulfilled(testDM.supportsMultipleResultSets());
    });

    it('supportsMultipleTransactions', async function() {
        await assert.isFulfilled(testDM.supportsMultipleTransactions());
    });

    it('supportsNamedParameters', async function() {
        await assert.isFulfilled(testDM.supportsNamedParameters());
    });

    it('supportsNonNullableColumns', async function() {
        await assert.isFulfilled(testDM.supportsNonNullableColumns());
    });

    it('supportsOpenCursorsAcrossCommit', async function() {
        await assert.isFulfilled(testDM.supportsOpenCursorsAcrossCommit());
    });

    it('supportsOpenCursorsAcrossRollback', async function() {
        await assert.isFulfilled(testDM.supportsOpenCursorsAcrossRollback());
    });

    it('supportsOpenStatementsAcrossCommit', async function() {
        await assert.isFulfilled(testDM.supportsOpenStatementsAcrossCommit());
    });

    it('supportsOpenStatementsAcrossRollback', async function() {
        await assert.isFulfilled(testDM.supportsOpenStatementsAcrossRollback());
    });

    it('supportsOrderByUnrelated', async function() {
        await assert.isFulfilled(testDM.supportsOrderByUnrelated());
    });

    it('supportsOuterJoins', async function() {
        await assert.isFulfilled(testDM.supportsOuterJoins());
    });

    it('supportsPositionedDelete', async function() {
        await assert.isFulfilled(testDM.supportsPositionedDelete());
    });

    it('supportsPositionedUpdate', async function() {
        await assert.isFulfilled(testDM.supportsPositionedUpdate());
    });

    it('supportsResultSetConcurrency', async function() {
        await assert.isFulfilled(testDM.supportsResultSetConcurrency(1, 2));
    });

    it('supportsResultSetConcurrency should fail if passed bad parameters', async function() {
        await assert.isRejected(testDM.supportsResultSetConcurrency('bad-param', 2), 'INVALID ARGUMENTS');
        await assert.isRejected(testDM.supportsResultSetConcurrency(1, 'bad-param'), 'INVALID ARGUMENTS');
    });

    it('supportsResultSetHoldability', async function() {
        await assert.isFulfilled(testDM.supportsResultSetHoldability(1));
    });

    it('supportsResultSetHoldability should fail if passed bad parameters', async function() {
        await assert.isRejected(testDM.supportsResultSetHoldability('bad-param'), 'INVALID ARGUMENTS');
        await assert.isRejected(testDM.supportsResultSetHoldability(), 'INVALID ARGUMENTS');
    });

    it('supportsResultSetType', async function() {
        await assert.isFulfilled(testDM.supportsResultSetType(1));
    });

    it('supportsResultSetType should fail if passed bad parameters', async function() {
        await assert.isRejected(testDM.supportsResultSetType('bad-param'), 'INVALID ARGUMENTS');
        await assert.isRejected(testDM.supportsResultSetType(), 'INVALID ARGUMENTS');
    });

    it('supportsSavepoints', async function() {
        await assert.isFulfilled(testDM.supportsSavepoints());
    });

    it('supportsSchemasInDataManipulation', async function() {
        await assert.isFulfilled(testDM.supportsSchemasInDataManipulation());
    });

    it('supportsSchemasInIndexDefinitions', async function() {
        await assert.isFulfilled(testDM.supportsSchemasInIndexDefinitions());
    });

    it('supportsSchemasInPrivilegeDefinitions', async function() {
        await assert.isFulfilled(testDM.supportsSchemasInPrivilegeDefinitions());
    });

    it('supportsSchemasInProcedureCalls', async function() {
        await assert.isFulfilled(testDM.supportsSchemasInProcedureCalls());
    });

    it('supportsSchemasInTableDefinitions', async function() {
        await assert.isFulfilled(testDM.supportsSchemasInTableDefinitions());
    });

    it('supportsSelectForUpdate', async function() {
        await assert.isFulfilled(testDM.supportsSelectForUpdate());
    });

    it('supportsStatementPooling', async function() {
        await assert.isFulfilled(testDM.supportsStatementPooling());
    });

    it('supportsStoredFunctionsUsingCallSyntax', async function() {
        await assert.isFulfilled(testDM.supportsStoredFunctionsUsingCallSyntax());
    });

    it('supportsStoredProcedures', async function() {
        await assert.isFulfilled(testDM.supportsStoredProcedures());
    });

    it('supportsSubqueriesInComparisons', async function() {
        await assert.isFulfilled(testDM.supportsSubqueriesInComparisons());
    });

    it('supportsSubqueriesInExists', async function() {
        await assert.isFulfilled(testDM.supportsSubqueriesInExists());
    });

    it('supportsSubqueriesInIns', async function() {
        await assert.isFulfilled(testDM.supportsSubqueriesInIns());
    });

    it('supportsSubqueriesInQuantifieds', async function() {
        await assert.isFulfilled(testDM.supportsSubqueriesInQuantifieds());
    });

    it('supportsTableCorrelationNames', async function() {
        await assert.isFulfilled(testDM.supportsTableCorrelationNames());
    });

    it('supportsTransactionIsolationLevel', async function() {
        await assert.isFulfilled(testDM.supportsTransactionIsolationLevel(1));
    });

    it('supportsTransactionIsolationLevel should fail if passed bad parameters', async function() {
        await assert.isRejected(testDM.supportsTransactionIsolationLevel('bad-param'), 'INVALID ARGUMENTS');
        await assert.isRejected(testDM.supportsTransactionIsolationLevel(), 'INVALID ARGUMENTS');
    });

    it('supportsTransactions', async function() {
        await assert.isFulfilled(testDM.supportsTransactions());
    });

    it('supportsUnion', async function() {
        await assert.isFulfilled(testDM.supportsUnion());
    });

    it('supportsUnionAll', async function() {
        await assert.isFulfilled(testDM.supportsUnionAll());
    });

    it('updatesAreDetected', async function() {
        await assert.isFulfilled(testDM.updatesAreDetected(1));
    });

    it('updatesAreDetected should fail if passed bad parameters', async function() {
        await assert.isRejected(testDM.updatesAreDetected('bad-param'), 'INVALID ARGUMENTS');
        await assert.isRejected(testDM.updatesAreDetected(), 'INVALID ARGUMENTS');
    });

    it('usesLocalFilePerTable', async function() {
        await assert.isFulfilled(testDM.usesLocalFilePerTable());
    });

    it('usesLocalFiles', async function() {
        await assert.isFulfilled(testDM.usesLocalFiles());
    });

    it('should initialize attributes when jinst gets initialized', async function() {
        DatabaseMetadata.onInitialized();
        sandbox.assert.called(javaInst.getStaticFieldValue);
    });
});