#!/bin/bash -l
docker login docker.tele2.kz -u ldapadreader -p M1dQcMui3dp_sXZEMGsA
docker-compose pull
docker-compose down
docker-compose up -d