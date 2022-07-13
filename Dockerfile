FROM node:16 as build-node

WORKDIR /opt/prediction

COPY ./package.json .
COPY ./package-lock.json .

RUN npm install

FROM ghcr.io/stefan-hoeck/idris2-pack:nightly-220712 as build

WORKDIR /opt/prediction

COPY ./pack.toml .
COPY ./prediction.ipkg .

RUN pack install-deps ./prediction.ipkg

COPY src src

RUN pack --cg node build ./prediction.ipkg

FROM node:16

WORKDIR /opt/prediction

COPY --from=build-node /opt/prediction/node_modules /opt/prediction/node_modules
COPY --from=build /opt/prediction/build/exec/prediction /opt/prediction

CMD ["node", "./prediction"]
