FROM node:11
COPY app app
ADD package.json .
ADD package-lock.json .
RUN npm i
CMD ["npm", "start"]
