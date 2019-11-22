const mydb = require('./mydbutil');

function select (pool, table, limit = 50, offset = 0, columns = '*') {
    const f = mydb.mkQuery(`select ${columns} from ${table} limit ? offset ?`, pool);
    return f([limit, offset]);
}

function selectWhere (pool, table, where, params, limit = 50, offset = 0, columns = '*') {
    // console.log(params, 'params');
    const f = mydb.mkQuery(`select ${columns} from ${table} where ${where} limit ? offset ?`, pool);
    return f(params);
}

function countWhere (pool, table, where, params) {
    // console.log(params, 'params');
    const f = mydb.mkQuery(`select count(*) as count from ${table} where ${where}`, pool);
    return f(params);
}

function insert (pool, table, columns, params) {
    const numParams = Array(columns.split(',').length).fill('?').join(',');
    console.log('query: ', `insert into ${table} (${columns}) values (${numParams})`, params);
    const f = mydb.mkQuery(`insert into ${table} (${columns}) values (${numParams})`, pool);
    return f(params);
}

function update (table, columns, params) {
    // const columns = columns.split(',');
    const setParams = '';
    for (let c of columns) {
        // setParams +=
    }
    const f = mkQuery(`update ${table} set`)
}

module.exports = { select, selectWhere, countWhere, insert };