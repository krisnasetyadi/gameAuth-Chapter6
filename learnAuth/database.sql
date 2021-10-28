
CREATE DATABASE data_base;

CREATE TABLE payments (
    id BIGSERIAL NOT NULL PRIMARY KEY,
    firstname VARCHAR (50) NOT NULL,
    lastname VARCHAR (50) NOT NULL,
    cardnumber VARCHAR (200) NOT NULL,
    cvvnumber INTEGER NOT NULL,
    UNIQUE (cardnumber)
);

CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY NOT NULL,
    name VARCHAR (50) NOT NULL,
    email VARCHAR (50) NOT NULL,
    password VARCHAR (200) NOT NULL,
    payment_id BIGINT REFERENCES payments (id),
    UNIQUE(payment_id),
    UNIQUE (email)
);

CREATE TABLE games (
    id BIGSERIAL NOT NULL PRIMARY KEY,
    gamename VARCHAR (50) NOT NULL,
    price NUMERIC (50) NOT NULL,
    UNIQUE (gamename)
);
-- testing table
INSERT INTO users (name,email,password)
VALUES ('krisna','krisna@ymail.com','password');

INSERT INTO payments (firstname,lastname,cardnumber,cvvnumber)
VALUES ('krisna','setyadi','12345678909987654','312');
