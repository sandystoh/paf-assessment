drop database if exists music;

create database music;

use music;

create table users (
	user_id varchar(8) not null,
	username varchar(32) not null,
	primary key (user_id)
);

insert into users(user_id, username) values
	('4d0cae84', 'fred'),
	('26a85b1c', 'barney'),
	('675cee52', 'betty'),
	('27b965f6', 'wilma'),
	('820e8a4d', 'bambam'),
	('fc42a34d', 'pebbles');

create table countries (
    code char(2) not null,
    name varchar(256) not null,
    PRIMARY KEY(code)
);

create table songs (
    id int auto_increment not null,
    title varchar(128) not null,
    country_code char(2) not null,
    song_file varchar(128) not null,
    listen_slots int not null,
    available_slots int not null,
    listen_count int not null default 0,
    lyrics text,
    posted datetime default current_timestamp,
    PRIMARY KEY(id),
    CONSTRAINT FK_PersonOrder 
    FOREIGN KEY (country_code) REFERENCES countries(code),
    key(country_code)
);

INSERT INTO countries (code, name) VALUES
('JP', 'Japan'),
('MY', 'Malaysia'),
('RU', 'Russia'),
('SG', 'Singapore'),
('GB', 'United Kingdom'),
('US', 'United States');

INSERT INTO songs (title, country_code, song_file, listen_slots, available_slots, lyrics) VALUES 
('Majulah Singapora', 'SG', 'singapore.mp3', 5, 5 , 'Mari kita
Rakyat Singapura
Sama-sama
Menuju bahagia
Cita-cita kita
Yang mulia
Berjaya Singapura
Marilah kita bersatu
Dengan semangat yang baru
Semua kita berseru
Majulah Singapura
Majulah Singapura...
Marilah kita…' ),
('The Star Spangled Banner', 'US', 'unitedstates.mp3', 3, 3, 'Oh, say can you see,
by the dawn\'s early light,
What so proudly we hailed
at the twilight\'s last gleaming?
Whose broad stripes and bright stars,
through the perilous fight,
O\'er the ramparts we watched,
were so gallantly streaming?
And the rockets\' red glare,
the bombs bursting in air,
Gave proof through the night
that our flag was still there.
O say, does that star-spangled
banner yet wave
O\'er the land of the free
and the home of the brave?');
