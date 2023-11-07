FROM alpine:latest AS build
RUN apk add --no-cache npm nodejs git
WORKDIR /app
COPY package*.json ./
COPY icons ./icons
COPY public ./public
RUN npm install -g pnpm
RUN pnpm install
COPY . .
RUN pnpm build

FROM nginx:mainline-alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
