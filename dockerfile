FROM node:20-alpine
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn --frozen-lockfile
COPY . .
EXPOSE 4000
CMD ["yarn", "dev"]
