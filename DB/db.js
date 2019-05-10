var sql = require('mssql');
async function connectDB() {
    const pool = new sql.ConnectionPool(global.config.sqlConfig);
    try {
        await pool.connect();
        console.log('Connected to DATABASE');
        return pool;
    } catch (err) {
        console.log('conn failure');
        return err;
    }
}
module.exports.executeQuery = async function executeQuery(req) {
    const DB = await connectDB();
    try {
        const result = await DB.request()
            .query(req);
        return result;
    } catch (err) {
        console.log("ERROR QUERYing DATABASE");
        return err;
    }

}