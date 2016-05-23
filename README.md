#ExpressJs Boilerplate with essential plugins

## Purpose of this repo
- to serve as a personal cheatsheet for setting up a boilerplate that uses ExpressJs as application server, Strongloop as process manager and Nginx as cache & reverse proxy server

## Plugins
- compression
- helmet
- express-session
- connect-flash
- connect-mongo

## Starting up
- <code>npm start</code>
  - fires up a single Express server process
- <code>npm start:cluster</code>
  - fires up the server in "cluster mode" using [Strongloop](https://docs.strongloop.com)

## Strongloop PM
- <code>slc ctl status {svc id}</code>
  - shows default status for {svc id}
- <code>slc start</code>
  - starts service based on package.json
- <code>slc ctl stop / soft-stop</code>
  - stops service
- <code>slc ctl set-size {svc id} {number}</code>
  - updates # of worker processes
- <code>slc ctl env-get {svc id} [env...]</code>
  - gets environment variables
- <code>slc ctl env-set {svc id} {key=value}</code>
  - sets environment variable
  - e.g. <code>slc ctl env-set 1 PORT=3000</code>
- <code>slc ctl log-dump {svg id} --follow</code>
  - dumps STDOUT and keeps watching it

For setting up Strongloop in production environment, click [here](​https://docs.strongloop.com/display/SLC/Setting+up+a+production+host)

## Nginx configuration (Ubuntu 14.04)
### Boilerplate
<p>Edit /etc/nginx/sites-available/{name} file and make a symlink under /etc/nginx/sites-enabled/</p>
<p>Following configuration will redirect http connection to https which will then be handed off to the Express server</p>

<pre><code>proxy_cache_path /tmp/nginx levels=1:2 keys_zone=my_zone:10m inactive=60m;
proxy_cache_key "$scheme$request_method$host$request_uri";

server {
    listen 80;
    server_name localhost;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443;
    server_name localhost;
    ssl on;
    ssl_certificate {path to certificate file}
    ssl_certificate_key {path to certificate key file}
    ssl_prefer_server_ciphers on;
    charset utf-8;
    gzip on;
    (optional) access_log {path}
    (optional) error_log {path}

    location / {
        proxy_cache my_zone (or arbitrary name, but make sure this matches the "keys_zone" attribute in line 1)
        proxy_cache_bypass $http_cache_control;
        add_header X-Proxy-Cache $upstream_cache_status;
        include proxy_params;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header Host $http_host;
        proxy_set_header X-NginX-Proxy true;
        proxy_pass https://localhost:3000; (or another port on which node app starts. if running through slc, make sure environment variable PORT is set to 3000)
        proxy_redirect off;
    }
}
</code></pre>

Once done, restart the service through <code>sudo /etc/init.d/nginx restart|reload</code>