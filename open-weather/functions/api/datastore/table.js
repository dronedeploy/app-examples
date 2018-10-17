const TABLE_NAME = 'api-table';

const FIND_TABLE_QUERY = (tableName) => {
  return `{
    node(id: "Application:${global.APP_ID}") {
      ... on Application {
        table(name: "${tableName}") {
          id
          name
        }
      }
    }
  }`;
};

const getTableId = (ctx) => {
  return ctx.graphql.query(FIND_TABLE_QUERY(TABLE_NAME))
    .then((result) => {
      if (result.errors ? true : false) {
        if (result.data.node.table === null) {
          console.log('table does not exist');
          return Promise.reject('table does not exist');
        } else {
          return Promise.reject(result.errors[0]);
        }
      }
      return result.data.node.table.id;
    })
    .catch((err) => {
      return Promise.reject(err);
    });
}

const couldNotFindData = (errResponse) => {
  return errResponse.errors[0].message.indexOf('Could not find data') !== -1;
};

const getTableData = (ctx, id) => {
  return getTableId(ctx).then((tableId) => {
    const table = ctx.datastore.table(tableId);
    return table.getRowByExternalId(id)
    .then((result) => {
      if (!result.ok) {
        console.log('getTableData bad results');
        if (couldNotFindData(result)) {
          console.log('row does not exist');
          return null;
        }
        return Promise.reject(result.errors[0]);
      }
      return result.data;
    });
  });
}

const setTableData = (ctx, id, key) => {
  return getTableId(ctx).then((tableId) => {
    const table = ctx.datastore.table(tableId);
    return table.upsertRow(id, {
      key: key
    }).then((rowData) => {
      if (!rowData.ok) {
        console.log('error adding row');
        // Problem storing the access token which will
        // impact potential future api calls - send error
        return {ok: false, errors: rowData.errors};
      }
      console.log('success adding row');
      return {ok: true, data: rowData};
    });
  });
}

module.exports = {
  getTableData: getTableData,
  setTableData: setTableData
}