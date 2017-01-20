#!/bin/bash

rm -rf certs 2>/dev/null
mkdir certs
openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout key.pem -out cert.pem -subj "/C=US/ST=Texas/L=Austin/O=none/OU=none/CN=nobody@nobody.net"
mv *.pem ./certs

