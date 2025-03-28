const mysql=require('mysql');
const db=mysql.createPool({
    host: '127.0.0.1',
    user:'root',
    password:'$ENTH!LKUM@R_13a',
    port:'3306',
    database:'herbalproducts',
    connectionLimit:'10',
});

module.exports.db=db;