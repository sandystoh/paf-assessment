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
