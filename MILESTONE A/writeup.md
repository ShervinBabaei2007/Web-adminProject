# Write up

## 1. Project Overview

LinkLocker is the name of our project
Its a url shortner built with:
- html
- css
- js
- node.js
- express
- mongo db
And users can submit long urls and receive a shortened version that redirect them to the original website when using the shortened version
We deployed the app with Microsoft Azure vm running ubuntu 24.04

https://linklocker.northcentralus.cloudapp.azure.com/

## 2. Deployment + PM2

For running express, we run it on port 3000 with PM2 and PM2 manages the app process instead of having to leave the terminal open with node app.js. So like we have our SSH terminal (SSH into azure vm with our terminal) and then we could have it run node app.js but then it attaches to the terminal so if we close it then it closes that too so we use PM2 and then PM2 makes it a sepreate background process so it staays on when we close the terminal

Our express app listens on 127.0.0.1 w/ port 3000 so external users cant just go to the backend with the VMs public ip

So the requests go through nginx instead

We also verify PM2 is working with pm2 ls which showed LinkLocker with the status "online"

## 3. Reverse Proxy

We configured nginx as a reverse proxy between visitors and express.

People who visit the site has their req first go to nginx on port 443 (so just the default) and then nginx forwards their req to our express background with proxy_pass for 127.0.0.1:3000

Also we have headers configured including:
- Host. preserve original hostname
- X Real Ip and X Forwarded For. Pass info of the visitor's ip to express, for example we have rate limiting
- X-Forwarded-Proto. We might need this later for doing auth logins and stuff but it's not currently being used. check if http or https.

Full config with annotations: [here](nginx.conf).

## 4. HTTPS and TLS

We did HTTPS with certbot and our cert is issued by Let's Encrypt

nginx listens on default port for https traffic and uses the cert and private key for the tls handshake

nginx also redirects http traffic on port 80 to https using http 301 permanent redirect

Tested with:
`curl -I http://linklocker.northcentralus.cloudapp.azure.com/`

We get "301 Moved Permanently" and a location header to the HTTPS version of our site.

We can also see/verify the certification in the browser too 

## 5. Troubleshooting

We lost our SSH access, like the  .pem to our Azure VM like 3 times because computer storage sense keeps deleting it.

We just generated a new SSH key pair and used Azure's run cmd feature to add the key to the vms authorized keys file.

## 6. Verificationn

Evidence is available here: [Milestone A README](README.md)
