FROM alpine:latest AS build
RUN apk add --no-cache npm nodejs git
WORKDIR /app
RUN git clone https://github.com/avoonix/material-e621 /app
RUN npm install && npm run build

FROM alpine:latest
WORKDIR /app
RUN apk add --no-cache npm nodejs git
COPY --from=build /app .
CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0", "--port", "8080"]