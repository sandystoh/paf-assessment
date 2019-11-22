const mydb = require('../db/mydbutil');
const sql = require('../db/sqlutil');
const uuid = require('uuid');

const insertSong = mydb.trQuery('insert into songs(title, country_code, song_file, listen_slots, available_slots, lyrics) values(?,?,?,?,?,?)');
const uploadSongToS3 = mydb.s3Upload('sandy-paf-2019', 'songs');

// Transaction with Article (MySQL) + Music File (S3)
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

module.exports = { uploadSong };