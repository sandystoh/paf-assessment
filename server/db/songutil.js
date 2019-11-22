const mydb = require('../db/mydbutil');
const sql = require('../db/sqlutil');
const uuid = require('uuid');

const insertSong = mydb.trQuery('insert into songs(title, country_code, song_file, listen_slots, available_slots, lyrics) values(?,?,?,?,?,?)');
const uploadSongToS3 = mydb.s3Upload('sandy-paf-2019', 'songs');

// Transaction with Insert Song Record (MySQL) + Music File (S3)
    function uploadSong() {
        // This function is inside a Transaction (mkTransaction, mydbutil)
        return (status) => {
            const b = status.body;
            const f = status.file;
            const conn = status.connection; // Connection from mkTransaction
            // Insert Record into MySQL using trQuery (mydbutil) Promise (does not open new connection)
            return insertSong({params: [ b.title, b.country_code, f.filename, b.listen_slots, b.listen_slots, b.lyrics, new Date() ], connection: conn})
            .then(s => {
                s.file = f;
                s.s3 = status.conns.s3;
                return uploadSongToS3(s);
            });
        }
    }

const lockSongForUpdate = mydb.trQuery('SELECT * FROM songs WHERE id = ? FOR UPDATE');
const updateListenCount = mydb.trQuery('UPDATE songs SET available_slots = available_slots-1, listen_count = listen_count+1 WHERE id = ?');

// CheckOut Transaction with Update Song Record (MySQL) + Updating Logs (MongoDB)
function checkoutSong() {
    // This function is inside a Transaction (mkTransaction, mydbutil)
    return (status) => {
        return new Promise((resolve, reject) => {
            const id = status.id;
            const conns = status.conns;
            const conn = status.connection; // Connection from mkTransaction
            const transId = uuid().substring(0,8);
            return lockSongForUpdate({params: [id], connection: conn})
            .then(s => {
                const song = s.result[0];
                if (song.available_slots <= 0) {
                    console.log('NO SLOTS AVAILABLE');
                    return reject({error: 'No More Listening Slots Available!'});
                }
                return updateListenCount({params: [id], connection: conn})
                .then(() => { return song });
            })
            .then((song) => {
                //console.log('SONG', song)
                const mongo = {db: 'music', collection: 'listens'};
                mongo.client = conns.mongodb;
                mongo.document = {listen_id: transId, username: status.user, song_id: song.id, song_title: song.title, 
                    country_code: song.country_code, checkedout: new Date()};
                //console.log(mongo.document);
                return mydb.mongoWrite(mongo)
            })
            .then(() => { return resolve({transId, id})}); ; 
        })
    }
}

const restoreListenCount = mydb.trQuery('UPDATE songs SET available_slots = available_slots+1 WHERE id = ?');
// 82089fbc
// Checkin Transaction with Update Song Record (MySQL) + Updating Logs (MongoDB)
function checkinSong() {
        return (status) => {
            const transId = status.transId;
            const id = status.id;
            const conns = status.conns;
            const conn = status.connection; // Connection from mkTransaction
            return lockSongForUpdate({params: [id], connection: conn})
            .then(s => {
                return restoreListenCount({params: [id], connection: conn})
            })
            .then((s) => {
                console.log('statusss', status.id, status.transId)
                const m = {db: 'music', collection: 'listens'};
                m.client = conns.mongodb;
                const collection = m.client.db(m.db).collection(m.collection);
                return collection.update({listen_id: transId}, { $set: {checkedin: new Date()}})
                .then(() => { return `Successfully Updated ${transId}`})
            }); 
        }
    }

// Middleware that authenticates User from MySQL
const authenticateUser = (conn) => {
    return (req,resp,next)=>{
        const auth = req.params.user;
        if (!auth)
            return resp.status(400).type('text/html')
                .send('<h2>Missing username</h2>');
        
        authUser = mydb.mkQuery('select * from users where username = ?', conn);
        authUser([auth])
            .then(r => {
                if (r.result.length)
                    return next();
                resp.status(403).type('text/html')
                    .send(`<h2><code>${auth}</code> is not Authorized!</h2>`);
            })
            .catch(error => {
                resp.status(500).type('text/html')
                    .send(`<h2>Error: ${error}</h2>`);
            }); 
    };
}

module.exports = { uploadSong, checkoutSong, checkinSong, authenticateUser };