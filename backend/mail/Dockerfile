FROM node:18-alpine

WORKDIR /usr/src/app

# Install dependencies (including dev deps for build)
COPY package*.json ./
RUN npm install

# Copy source and build
COPY . .
RUN npm run build

EXPOSE 3001

CMD ["npm", "run", "start"]
