FROM node:11
COPY app app
COPY test test
ADD package.json .
ADD package-lock.json .
RUN npm i
RUN echo "demo:x:1001:node,video,games" >> etc/group
CMD ["npm", "start"]
