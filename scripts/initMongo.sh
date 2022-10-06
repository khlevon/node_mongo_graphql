#!/bin/bash
set -e

mongo <<EOF
db.auth('$MONGO_INITDB_ROOT_USERNAME', '$MONGO_INITDB_ROOT_PASSWORD');

const target = db.getSiblingDB('$MONGO_DB_NAME');

target.createUser({
  user: '$MONGO_DB_USERNAME',
  pwd: '$MONGO_DB_PASSWORD',
  roles: [
    {
      role: 'dbOwner',
      db: '$MONGO_DB_NAME',
    },
  ],
});
EOF


