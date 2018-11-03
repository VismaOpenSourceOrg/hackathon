#!/bin/bash

set -eo

pushd client
webpack --optimize-minimize --mode=production
popd
mvn package -DskipTests=true
docker build -t 455710622635.dkr.ecr.eu-west-1.amazonaws.com/hackaton .
docker push 455710622635.dkr.ecr.eu-west-1.amazonaws.com/hackaton

