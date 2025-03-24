FROM node:18-alpine

WORKDIR /app

RUN npm install -g nx

COPY package*.json nx.json workspace.json tsconfig*.json jest.config.js ./
COPY decorate-angular-cli.js ./

RUN npm install

COPY . .

EXPOSE 3000

CMD ["npx", "nx", "serve", "backend"]
