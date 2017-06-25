#!/bin/bash
set -x
set -e

psql -c "DROP DATABASE alexandmolly2017;"
psql -c "CREATE DATABASE alexandmolly2017;"
psql -f create_tables.sql "alexandmolly2017"
