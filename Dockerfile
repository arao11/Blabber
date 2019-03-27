FROM node

RUN mkdir /src
WORKDIR /src

COPY package* ./
RUN npm install --quiet

EXPOSE 3000
CMD npm run dev