FROM node:10
WORKDIR /src
COPY . .
#RUN mkdir /src
#RUN mkdir /data
#COPY package* ./
#COPY . .
RUN npm install --quiet

EXPOSE 3000
CMD ["npm", "run", "dev"]; /mongod