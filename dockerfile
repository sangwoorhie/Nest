# 환경변수 (app을 워크디렉토리로 지정, video-storage에 저장)
FROM node:18.17.0 AS builder
RUN mkdir -p /app
WORKDIR /app
ADD . .
RUN mkdir -p video-storage

# ubuntu 환경에서 bcrypt가 문제가 될수있으므로 지우고 재 설치, 의존성 설치
RUN npm uninstall bcrypt
RUN npm install bcrypt
RUN npm install
RUN npm run build

# 환경변수
ARG STAGE
ENV STAGE ${STAGE}
ARG POSTGRES_HOST
ENV POSTGRES_HOST ${POSTGRES_HOST}
ARG SENTRY_DSN
ENV SENTRY_DSN ${SENTRY_DSN}
ARG SLACK_WEBHOOK
ENV SLACK_WEBHOOK ${SLACK_WEBHOOK}
ARG EMAIL_USER
ENV EMAIL_USER ${EMAIL_USER}
ARG EMAIL_PASSWORD
ENV EMAIL_PASSWORD ${EMAIL_PASSWORD}
ARG JWT_SECRET
ENV JWT_SECRET ${JWT_SECRET}
ARG SWAGGER_USER
ENV SWAGGER_USER ${SWAGGER_USER}
ARG SWAGGER_PASSWORD
ENV SWAGGER_PASSWORD ${SWAGGER_PASSWORD}

CMD npm run typeorm migration:run;npm run start:prod

#  docker build -t nestjs .
#  docker run -e STAGE=dev -e POSTGRES_HOST=host.docker.internal --name nestjs -d -p 3000:3000 nestjs