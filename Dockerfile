FROM node

#RUN mkdir /src
#RUN mkdir /data
WORKDIR /src

COPY package* ./
RUN npm install --quiet

EXPOSE 3000
CMD npm run dev