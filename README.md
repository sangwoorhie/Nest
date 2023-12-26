# Video Project

<p align="center"><img src="https://github.com/fresh502/nestjs/assets/131964697/b7a0dcca-ed6f-4a8a-a0f2-f90021862240"></p>


## 🎯서비스 소개

Video Project는 사용자가 회원가입 및 로그인을 하고, 비디오를 업로드 한 다음 다운로드까지 받을 수 있는 서비스입니다.<br>
포트폴리오 : [Video_Project_Portfolio](https://lemon-coin-768.notion.site/Video_Project-Portfolio-8aeff45845354f59bf6e6b77f50dda99?pvs=4)
<br>
<br>

## 🔎주요 기능


- 회원가입, 로그인, 로그아웃 
- 회원정보 수정, 회원탈퇴, 유저목록조회, 유저E-mail 조회
- 비디오 생성(업로드), 비디오 목록조회, 비디오 ID조회, 비디오 다운로드
  <br>
  <br>


## ⚒️Project Architecture

<p align="center"><img src="https://github.com/sangwoorhie/Survey_Graphql/assets/131964697/f6e75d03-c59f-4f5b-8cec-c61087c137de"></p>
<br>
<br>

## 🖋️Tech Stack

- Typescript 5.2.2
- Node.js 18.17.0
- NestJS 10.3.0
- Postgres 14.6
- Docker
- Git, Github
<br>
<br>

## 📊ERD

<p align="center"><img src="https://github.com/sangwoorhie/Survey_Graphql/assets/131964697/a163285c-f930-40ff-8786-030afb599540"></p>
<br>
<br>

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## 도커

### 참고 자료

  - https://docs.docker.com/
  - https://aws.amazon.com/ko/docker/
-

### 설치 및 컨테이너 올리기

- https://www.docker.com/

```bash
# docker-compose
$ docker-compose down && docker-compose up

# 컨테이너 확인
$ docker ps --all

# 로컬호스트에서 Postgres에 psql로 바로 접속
$ psql -U nestjs -h localhost -p 5434

# 실행중인 도커 컨테이너에서 프로세스 실행. 셸을 실행해서 인터렉티브한 환경에서 컨테이너 환경을 탐색하는 것도 가능
# docker exec -it <CONTAINER_ID> <COMMAND>
$ docker exec -it <CONTAINER_ID> psql -U postgres

# 컨테이너 중지 및 삭제
$ docker stop <CONTAINER_ID>
$ docker rm <CONTAINER_ID>
```
