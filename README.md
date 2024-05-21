# nmap-scan
Simple application that runs nmap in a docker container

# Setup

## Frontend
### Prerequisites:
- Nodejs > 20 (Use nvm https://github.com/nvm-sh/nvm)

### Serve webpage
1. cd into nmap-frontend
2. Run command: `npm run start`

## Backend
Prerequisites:
- Install Docker

### Start backend server
1. cd into nmap-backend folder
2. Build docker image: `docker build . -t test1`
3. Run docker container: `docker run -p 3000:3000 test1`

# Usage

- Run nmap command in the input box and click Scan!
