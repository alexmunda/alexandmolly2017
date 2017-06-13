#!/bin/bash
set -x
set -e

psql -c "DROP DATABASE alexandmolly2017;"
psql -c "CREATE DATABASE alexandmolly2017;"
psql -d "alexandmolly2017" -f "$PWD/scripts/create_tables.sql"
