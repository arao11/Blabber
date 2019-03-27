FROM node
WORKDIR /src
COPY package* ./
RUN npm install -g nodemon
RUN npm install
COPY app.js .
EXPOSE 3000

CMD npm run dev