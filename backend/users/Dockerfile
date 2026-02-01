FROM node:18-alpine
WORKDIR /server

# copy package files first to leverage Docker cache for installs
COPY package*.json ./

# use npm ci for reproducible installs in CI/build contexts
RUN npm ci --silent

# copy rest of the app
COPY . .

# expose common app port (adjust if your app uses a different port)
EXPOSE 3000

CMD ["npm", "run", "dev"]