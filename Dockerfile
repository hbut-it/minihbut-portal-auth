FROM node:18-slim

WORKDIR /app

COPY package*.json ./
RUN npm install --omit=dev && npm cache clean --force

COPY app ./app
COPY config ./config
COPY jsconfig.json ./

EXPOSE 7001
CMD ["npm", "start"]