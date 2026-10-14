# LinkLocker
This is a URL Shortner, users enter a long URL, generate a shorter link, and redirect visitors to the original URL.

## Milestones

**[View milestone A here:](MILESTONE%20A/README.md)**

**Other Milestones soon 👍**

## Live Site

https://linklocker.northcentralus.cloudapp.azure.com/

## Tech

HTML, CSS, JavaScript, Node.js, Express, MongoDB, Azure VM, PM2, Nginx. Cert by Let's Encrypt.

## Architecture

Visitor -> HTTPS (Nginx default port) -> Express (127.0.0.1:3000) -> MongoDB

Our app is hosted on Azure Ubuntu vm and Nginx handles public https reqs and forwards them to express (running as a background process managed by PM2)
