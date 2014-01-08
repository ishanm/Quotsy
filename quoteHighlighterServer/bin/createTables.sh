#!/bin/bash

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