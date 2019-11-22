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
const article = require('../db/articleutil');

module.exports = function(app, conns) {
    const ROUTE_URL = '/api/music';

    SELECT_SONGS = 'Select s.id, s.title, c.name, s.listen_slots, s.available_slots from songs s join countries c on s.country_code = c.code'
    selectAllSongs = mydb.mkQuery(SELECT_SONGS, conns.mysql);

    // TODO - Task 3
    // Song Upload


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
    app.get('/api/song/:id', (req, resp) => {
        const id = req.params.id;
        selectAllSongs()
        .then(r => {
            console.log(r);
            resp.status(200).json({ songs: r.result })
        })
        .catch(err => {
            resp.status(500).json({error: err});
        });
    })
}