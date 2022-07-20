FROM node:16 as build-node

WORKDIR /opt/prediction

COPY ./package.json .
COPY ./package-lock.json .

RUN npm install

FROM ghcr.io/stefan-hoeck/idris2-pack:nightly-220716 as build

RUN pack update-db
RUN pack switch nightly-220716

WORKDIR /opt/prediction

COPY ./pack.toml .
COPY ./src/Server/config.ipkg .
COPY ./src/Shared ./src/Shared

RUN pack install-deps ./config.ipkg

RUN rm ./config.ipkg
COPY src src

RUN pack --cg node build ./src/Server/config.ipkg

FROM node:16

WORKDIR /opt/prediction

COPY --from=build-node /opt/prediction/node_modules /opt/prediction/node_modules
COPY --from=build /opt/prediction/src/Server/build/exec/prediction /opt/prediction

CMD ["node", "./prediction"]
