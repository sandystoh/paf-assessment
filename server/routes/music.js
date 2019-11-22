const path = require('path');
const express = require('express');
const multer = require('multer');
const upload = multer({ dest: path.join(__dirname, '..', '/uploads') });
const uuid = require('uuid');
const fs = require('fs');
const { join } = require('path');

const db = require('../db/dbutil');
const mydb = require('../db/mydbutil');
const sql = require('../db/sqlutil');
const song = require('../db/songutil');

module.exports = function(app, conns) {
    const ROUTE_URL = '/api/music';

    // Get Countries
    app.get('/api/countries', (req, resp) => {
        sql.select(conns.mysql, 'countries')
        .then(r => {
            this.songs = r.songs
            resp.status(200).json({countries: r.result});
        })
        .catch(err => {
            console.log(err);
            resp.status(500).json({error: err.error});
        });
    });

    // Task 1 (c, d, e) >> Please see bottom of file, a and b are covered by other tasks

    // TODO - Task 3
    // Song Upload
    app.post('/api/upload', upload.single('musicFile'), mydb.unlinkFileOnResponse(), 
    (req, resp) => {
        // Puts uploadSong = Transaction Steps (songutil) into a Transaction (mkTransaction, mydbutil)
        // Returns resolve if whole transaction succeeded, reject if rollback
        const insertSong = mydb.mkTransaction(song.uploadSong(), conns.mysql);
        insertSong({body: req.body, file: req.file, conns: conns}) 
        .then(() => {
            resp.status(200).json({b: req.body, f: req.file});
        })
        .catch(err => {
            console.log(err);
            resp.status(500).json({error: err.error});
        });
    } );

    // TODO - Task 4
    // List all songs
    const SELECT_SONGS = 'Select s.id, s.title, c.name, c.code, s.listen_slots, s.available_slots from songs s join countries c on s.country_code = c.code'
    const selectAllSongs = mydb.mkQuery(SELECT_SONGS, conns.mysql);

    app.get('/api/songs', (req, resp) => {
        selectAllSongs()
        .then(r => {
            console.log(r);
            resp.status(200).json({ songs: r.result })
        })
        .catch(err => {
            resp.status(500).json({error: err});
        });
    })

    // TODO - Task 5
    // List available songs for listening
    app.get('/api/songs/available', 
        (req, resp) => {
        selectAllSongs()
        .then(r => {
            const s = r.result;
            const availSongs = s.map(v => { 
                return {
                id: v.id,
                title: v.title,
                country: v.name,
                code: v.code,
                available: (v.available_slots > 0) ? true : false }
            });
            resp.status(200).json(availSongs)
        })
        .catch(err => {
            resp.status(500).json({error: err});
        });
    })

    // TODO - Task 6
    // Listening a song
    // Route called upon clicking "Listen" - Check Out Song and Redirect to next Route
    const listenSong = mydb.mkTransaction(song.checkoutSong(), conns.mysql);

    app.get('/api/song/checkout/:user/:id', express.json(), 
    song.authenticateUser(conns.mysql), // Authenticates User
    (req, resp) => {
        const id = req.params.id;
        const user = req.params.user;
        listenSong({id, user, conns: conns}) 
        .then(r => {
            console.log(r.status);
            resp.status(200).json({id: r.status.id, transId: r.status.transId}); // redirect(`/song/${r.status.id}/${r.status.transId}`)
        })
        .catch(err => {
            resp.status(500).json({error: err});
        });
    })

    // Route called upon redirect to show song page
    const SELECT_SONG = `Select s.title, c.code, c.name, s.song_file, s.lyrics, s.available_slots, s.listen_count
                    from songs s join countries c on s.country_code = c.code 
                    where s.id = ?`
    const selectSongById = mydb.mkQuery(SELECT_SONG, conns.mysql);
    
    app.get('/api/song/:id/:transId', (req, resp) => {
        const id = req.params.id;
        const transId = req.params.transId;
        selectSongById([id])
        .then(r => {
            console.log(r);
            resp.status(200).json({id, transId, song: r.result[0]});
        })
        .catch(err => {
            resp.status(500).json({error: err});
        });
    })

    // Route called upon clicking "Back" - Check In Song
    const releaseSong = mydb.mkTransaction(song.checkinSong(), conns.mysql);

    app.get('/api/song/checkin/:id/:transid', express.json(),
    (req, resp, next) => {
        // Middleware to Check if Already Checked in
        const id = req.params.id;
        const transId = req.params.transid;
        return mydb.mongoFind({client: conns.mongodb, db: 'music', collection: 'listens',find: {listen_id: transId}})
        .then(r => {
            if (r[0].checkedin === undefined) {
                console.log('Not checked in');
                return next();
            }
            console.log('Checked in');
            return resp.status(500).json({error: 'Already Checked in'});
        });
    },
    (req, resp) => {
        const id = req.params.id;
        const transId = req.params.transid;
        releaseSong({id, transId, conns: conns}) 
        .then(r => {
            resp.status(200).json({status: r.status})
        })
        .catch(err => {
            resp.status(500).json({error: err});
        });
    })

    // Task 1 - All Songs Checked out By User
    app.get('/api/user/:username', (req, resp) => {
        const username = req.params.username;
        // m = mongo object = {client, db, collection, find, skip, limit, sort, project, count}
        mydb.mongoFind({client: conns.mongodb, db: 'music', collection: 'listens',
                find: {username: username, checkedin:{ $exists: false}}})
        .then(result => {
            console.log(result);
            this.songs = []
            for(r of result) {
                this.songs.push({title: r.song_title, check_out_date: r.checkedout});
            }
            resp.status(200).json({songs_listening: songs});
        })
        .catch(err => {
            resp.status(500).json({error: err});
        });
    });

        // Task 1 - All Songs Checked out By User (History)
        app.get('/api/user/history/:username', (req, resp) => {
            const username = req.params.username;
            // m = mongo object = {client, db, collection, find, skip, limit, sort, project, count}
            mydb.mongoFind({client: conns.mongodb, db: 'music', collection: 'listens',
                    find: {username: username}})
            .then(result => {
                console.log(result);
                this.songs = []
                for(r of result) {
                    this.songs.push({title: r.song_title, check_out_date: r.checkedout});
                }
                resp.status(200).json({songs_listened_to: songs});
            })
            .catch(err => {
                resp.status(500).json({error: err});
            });
        });
    

    // Task 1 - All Users Listening to Song
    app.get('/api/listening/:id', (req, resp) => {
        const id = parseInt(req.params.id);
        // m = mongo object = {client, db, collection, find, skip, limit, sort, project, count}
        mydb.mongoFind({client: conns.mongodb, db: 'music', collection: 'listens',
                find: {song_id: id, checkedin:{ $exists: false}}})
        .then(result => {
            console.log(result);
            this.users = []
            for(r of result) {
                this.users.push(r.username);
            }
            resp.status(200).json({users_listening: users});
        })
        .catch(err => {
            resp.status(500).json({error: err});
        });
    });
}