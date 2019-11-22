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

    const SELECT_SONGS = 'Select s.id, s.title, c.name, s.listen_slots, s.available_slots from songs s join countries c on s.country_code = c.code'
    const selectAllSongs = mydb.mkQuery(SELECT_SONGS, conns.mysql);

    // TODO - Task 3
    // Song Upload
    app.post('/api/upload', upload.single('musicFile'),
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
    app.get('/api/songs/available', (req, resp) => {
        selectAllSongs()
        .then(r => {
            const s = r.result;
            const availSongs = s.map(v => { 
                return {
                id: v.id,
                title: v.title,
                country: v.name,
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
    // Route called upon clicking "Listen"
    const listenSong = mydb.mkTransaction(song.checkoutSong(), conns.mysql);

    app.post('/api/song/checkout/:id', express.json(), 
    (req, resp) => {
        const id = req.params.id;
        listenSong({id, body: req.body, conns: conns}) 
        .then(r => {
            resp.status(200).json({ frogs: r.result })
        })
        .catch(err => {
            resp.status(500).json({error: err});
        });
    })    

    // Route called upon redirect
    const SELECT_SONG = `Select s.title, c.code, c.name, s.song_file, s.available_slots, s.listen_count
                    from songs s join countries c on s.country_code = c.code 
                    where s.id = ?`
    const selectSongById = mydb.mkQuery(SELECT_SONG, conns.mysql);
    
    app.get('/api/song/:id', (req, resp) => {
        const id = req.params.id;
        selectSongById([id])
        .then(r => {
            console.log(r);
            resp.status(200).json({ songs: r.result })
        })
        .catch(err => {
            resp.status(500).json({error: err});
        });
    })

}