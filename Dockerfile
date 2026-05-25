FROM node:24-slim AS build

WORKDIR /workspace

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

ARG VITE_BERNOULLI_API_URL=http://localhost:8080
ARG VITE_BERNOULLI_GATEWAY_ID=gateway-simulator
ENV VITE_BERNOULLI_API_URL=${VITE_BERNOULLI_API_URL}
ENV VITE_BERNOULLI_GATEWAY_ID=${VITE_BERNOULLI_GATEWAY_ID}

RUN npm run build

FROM nginx:1.29-alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /workspace/dist /usr/share/nginx/html

EXPOSE 80
