FROM node
WORKDIR /src
#COPY . .
#RUN mkdir /data
COPY package* ./
#COPY . .
RUN npm install --quiet

EXPOSE 3000
#RUN npm run dev
CMD ["npm", "run", "dev"]; /mongod
#CMD mongod