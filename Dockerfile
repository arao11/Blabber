FROM node
WORKDIR /src
COPY package* ./
RUN npm install
COPY app.js .

CMD ["node", "app.js"]
