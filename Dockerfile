FROM node
WORKDIR /src
COPY package* ./
RUN npm install --quiet
EXPOSE 3000 27017
CMD ["npm", "run", "dev"];

#COPY . .
#RUN mkdir /data
#RUN npm run dev
#CMD mongod