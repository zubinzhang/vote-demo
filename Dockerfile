# Install Stage
FROM registry.cn-hangzhou.aliyuncs.com/aliyun-node/alinode:4-alpine AS installer

# Install base packages, set timezone
RUN apk update && apk add curl bash tree tzdata \
&& npm config set registry http://registry.npm.taobao.org \
&& npm config set unsafe-perm true \
&& mkdir -p /var/app

WORKDIR /var/app

ENV NODE_ENV production

COPY package.json package-lock.json ./
RUN npm install --production \
  && rm -rf /tmp/* \
  && rm -rf /root/.npm/ \
  && apk del make gcc g++ python

COPY . .

# Run stage

FROM registry.cn-hangzhou.aliyuncs.com/aliyun-node/alinode:4-alpine
WORKDIR /var/app
COPY --from=installer /var/app/ .

ENV TZ=Asia/Shanghai \
    NODE_ENV=production

CMD npm run start
