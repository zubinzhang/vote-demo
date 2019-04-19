FROM registry.cn-hangzhou.aliyuncs.com/aliyun-node/alinode:4-alpine

# Install base packages, set timezone
RUN apk update && apk add curl bash tree tzdata \
&& npm config set registry http://registry.npm.taobao.org \
&& npm config set unsafe-perm true \
&& mkdir -p /var/app

WORKDIR /var/app

ENV NODE_ENV production
ENV TZ Asia/Shanghai

COPY package.json package-lock.json /var/app/
RUN npm install --production \
  && rm -rf /tmp/* \
  && rm -rf /root/.npm/ \
  && apk del make gcc g++ python

COPY . /var/app/

CMD npm run start
