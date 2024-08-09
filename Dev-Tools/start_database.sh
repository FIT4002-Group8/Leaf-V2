#!/bin/bash
docker volume create leafdb
docker build -t leaf-etl-postgres ../Leaf-ETL/postgres
docker-compose -f ./docker/docker-compose-postgres.yml up -d
