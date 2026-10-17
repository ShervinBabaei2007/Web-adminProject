# LinkLocker
This is a URL Shortner, users enter a long URL, generate a shorter link, and redirect visitors to the original URL.

https://linklocker.northcentralus.cloudapp.azure.com/

## Milestones

- **[Milestone A COMPLETED](MILESTONE%20A/README.md)**
- **[Milestone B COMPLETED](MILESTONE%20B/writeup.md)**
---
- **[Milestone C not reached yet](MILESTONE%20C/writeup.md)**



## Tech

HTML, CSS, JavaScript, Node.js, Express, MongoDB, Azure VM, PM2, Nginx. Cert by Let's Encrypt.

## Architecture

Visitor -> HTTPS (Nginx default port) -> Express (127.0.0.1:3000) -> MongoDB

Our app is hosted on Azure Ubuntu vm and Nginx handles public https reqs and forwards them to express (running as a background process managed by PM2)

## Team Contributions

### Milestone A

**@ShervinBabaei2007 Application Development**
- Built the LinkLocker app, its frontend and Express backend
- URL shortening and MongoDB

**@fa-nebusoku Infrastructure + Deployment**
- Connected the app to an external MongoDB
- Set up and config azure vm
- Configure nginx as a reverse proxy + enabled HTTPS
- PM2
- Milestone A writeup and evidence

### Milestone B

**@ShervinBabaei2007 Authentication Development**
- implement google OAuth w/ passport.js.
- Added auth related backend routes, user sessions, and login protected link creation.
- link auth with the Express app
- Registration of the prod OAuth callback
- Milestone B writeup

**@fa-nebusoku**
- Registration of the prod OAuth callback
- Configure the prod .env variables for Google OAuth
- Fix frontend bugs and what it displays
