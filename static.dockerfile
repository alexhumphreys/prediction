FROM ghcr.io/stefan-hoeck/idris2-pack:nightly-220729 as build

RUN pack update-db
RUN pack switch nightly-220729

WORKDIR /opt/prediction

RUN mkdir -p ./src/Frontend/

COPY ./pack.toml .
COPY ./src/Frontend/config.ipkg ./src/Frontend/config.ipkg
COPY ./src/Shared ./src/Shared

RUN pack install-deps ./src/Frontend/config.ipkg

RUN rm ./src/Frontend/config.ipkg
COPY src src

RUN pack --cg javascript build ./src/Frontend/config.ipkg

FROM nginx

COPY static /usr/share/nginx/html
COPY ./nginx/docker-compose.conf /etc/nginx/nginx.conf
COPY ./nginx/.htpasswd /etc/nginx/

COPY --from=build /opt/prediction/src/Frontend/build/exec/spa.js /usr/share/nginx/html/js/spa.js
