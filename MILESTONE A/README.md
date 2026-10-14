# Milestone A

1. Working Frontend & Node.js/Express Backend

- [Frontend HTML](../public/index.html)
- [Frontend JavaScript](../public/mainApp.js)
- [Express Backend](../src/app.js)
- [Live Website](https://linklocker.northcentralus.cloudapp.azure.com/)
- [Website SS](screenshots/live-website.png)

2. Application Deployed to a Real Host

- [Azure VM Screenshot](screenshots/azure-vm.png)
- [Live Website](https://linklocker.northcentralus.cloudapp.azure.com/)

3. PM2 Process Management

- [PM2 Screenshot](screenshots/server-verification.png)

4. Nginx Reverse Proxy & Localhost Binding

- [Annotated Nginx Config](nginx.conf)
- [Nginx Config SS](screenshots/server-verification.png)
- [Express Localhost Binding](../src/app.js)

express binds to 127.0.0.1:3000 and nginx receives public web requests and forwards them to express

5. TLS / HTTPS Enabled

**Evidence:**
- [HTTPS Security SS](screenshots/https-certificate.png)
- [Cert Details SS](screenshots/https-certificate.png)
- [HTTPS Website](https://linklocker.northcentralus.cloudapp.azure.com/)

6. HTTP Redirects to HTTPS

- [HTTP 301 Terminal Screenshot](screenshots/server-verification.png)
- [Nginx Redirect Config](nginx.conf)

HTTP requests auto redirect to the HTTPS ver of site

7. Application Functionality

- [LinkLocker Website](https://linklocker.northcentralus.cloudapp.azure.com/)
- [Example Shortened Link](https://linklocker.northcentralus.cloudapp.azure.com/l/H3T2oR2D)
- [URL Shortening Backend](../src/app.js)

app generates shortened urls, stores in mongo db, and redirects visitors to the original urls

Documentation & Troubleshooting

- [Milestone A Write-up (1–2 pages)](writeup.md)
- [Annotated Nginx config](nginx.conf)
