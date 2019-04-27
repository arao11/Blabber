FROM node
WORKDIR /src
COPY package* ./
RUN npm install --quiet
EXPOSE 3000 27017
HEALTHCHECK --interval=15s --timeout=5s --retries=10 \
    CMD curl -f http://localhost:3000/blabs || exit 1
CMD ["npm", "run", "dev"];


#/mongod --dbpath ./data/db

#COPY . .
#RUN mkdir /data
#RUN npm run dev
#CMD mongod