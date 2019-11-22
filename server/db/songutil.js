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

// Transaction with Update Song Record (MySQL) + Updating Logs (MongoDB)
function checkoutSong() {
    // This function is inside a Transaction (mkTransaction, mydbutil)
    return (status) => {
        const id = status.id;
        
        const conn = status.connection; // Connection from mkTransaction
        // Insert Record into MySQL using trQuery (mydbutil) Promise (does not open new connection)
        return lockSongForUpdate({params: [id], connection: conn})
        .then(s => {
            return new Promise((resolve, reject) => {
                const song = s.result[0];
                if (song.available_slots <= 0) {
                    return reject({error: 'No More Listening Slots Available!'});
                }
                updateListenCount({params: [id], connection: conn})
                .then(() => {
                    console.log('inside here', s.result[0].available_slots);
                    return resolve('hello');
                })
                .catch(() => {
                    return reject({error: 'Update problem'})
                })
            })
        });
    }
}

module.exports = { uploadSong, checkoutSong };