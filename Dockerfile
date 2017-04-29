FROM node:latest

RUN apt-get update

RUN mkdir /shortlr
ADD . /shortlr
WORKDIR /shortlr

RUN chmod +x ./wait-for-it.sh

# install dependencies
RUN npm install

# Expose port where node server running
EXPOSE 4000