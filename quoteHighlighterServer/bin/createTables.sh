#!/bin/bash

# Quotes depends on the accounts table
# so drop that first
psql -U postgres -d quotsy -c "
DROP table quotes;
"

psql -U postgres -d quotsy -c "
DROP table accounts;
"

psql -U postgres -d quotsy -c "
CREATE TABLE accounts(
  id serial primary key,
  username varchar(40) NOT NULL,
  passhash varchar(256) NOT NULL,
  salt varchar(256) NOT NULL
);
"

psql -U postgres -d quotsy -c "
CREATE TABLE quotes(
  id serial primary key,
  account_id integer references accounts(id),
  text varchar,
  url varchar,
  hash varchar
);
"