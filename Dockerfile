FROM node:20

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY prisma ./prisma
RUN npx prisma generate

COPY . .

RUN npm run build

COPY entrypoint.sh ./
RUN chmod +x ./entrypoint.sh

CMD ["sh", "./entrypoint.sh"]
