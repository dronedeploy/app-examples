const TABLE_NAME = 'webhook-table';

const FIND_TABLE_QUERY = (tableName) => {
  return `{
    node(id: "Application:${global.APP_SLUG}") {
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
      console.log(result.data.node.table.id);
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
  return getTableId(ctx).then(tableId => {
    const table = ctx.datastore.table(tableId);
    table.getRowByExternalId(id)
    .then(result => {
      if (!result.ok) {
        console.log('getTableData bad results');
        if (couldNotFindData(result)) {
          console.log('row does not exist');
          return null;
        }
        return Promise.reject(result.errors[0]);
      }
      return result;
    });
  });
}


const setTableData = (ctx, id, endpoint) => {
  return getTableId(ctx).then(tableId => {
    const table = ctx.datastore.table(tableId);
    table.getRowByExternalId(id)
    .then(result => {
      console.log('hello');
      console.log(result);
      if (!result.ok) {
        console.log('results not okay');
        if (couldNotFindData(result)) {
          console.log('could not find results');
          return null;
        }
        return Promise.reject(result.errors[0]);
      }
      console.log('successfully returning result');
      return result;
    });
  });
}

module.exports = {
  getTableData: getTableData
}