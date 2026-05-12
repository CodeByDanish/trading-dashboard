FROM node:23-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

RUN npm install -g serve

# Expose Vite preview/server port
EXPOSE 5173

# Start production server
CMD ["serve", "-s", "dist", "-l", "5173"]