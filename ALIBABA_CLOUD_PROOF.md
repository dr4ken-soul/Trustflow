# alibaba cloud deployment proof

this file documents the use of alibaba cloud services and apis in trustflow

the primary code file that demonstrates alibaba cloud usage is

server/services/ossService.js

this file uses the ali-oss sdk to interact with alibaba cloud object storage service

## alibaba cloud services used

### 1 elastic compute service ecs

the backend runs on an alibaba cloud ecs instance

- region singapore ap-southeast-1
- instance type ecs.c9i.large 2 vcpu 4gb
- image alibaba cloud linux 3 pro
- public ip 47.245.124.91
- security group allows port 22 for ssh and port 3001 for the api
- the node js express server is managed by pm2

to verify the backend is running on ecs you can

```bash
ssh into the ecs instance
curl http://47.245.124.91:3001/health
```

the health endpoint returns
```json
{"status":"ok","timestamp":"2026-07-07T..."}
```

### 2 object storage service oss

the backend uses oss to store uploaded client documents

- bucket name trustflow-docs
- region singapore ap-southeast-1
- storage class standard
- redundancy lrs
- block public access enabled
- access via ram user with aliyunossefullaccess policy

the code that interacts with oss is in server/services/ossService.js

it uses the ali-oss npm package which is the official alibaba cloud oss sdk for node js

key operations

uploadfile uploads a document buffer to oss under the documents prefix
getsignedurl generates a time limited signed url so qwen vl can read the private object

### 3 ram resource access management

a ram user named trustflow-backend was created with programmatic access only

the ram user has the aliyunossefullaccess system policy attached

the access key id and secret are stored in the server .env file and loaded as environment variables

the backend uses these credentials to authenticate with oss

## environment variables

the following alibaba cloud related environment variables are used by the backend

```
oss region the oss bucket region
oss bucket the oss bucket name
oss access key id the ram user access key id
oss access key secret the ram user access key secret
```

these are loaded from server/.env which is gitignored

see server/.env.example for the template

## how to verify

1 clone the repo
2 cd into server
3 cp .env.example .env and fill in real credentials
4 npm install
5 npm run dev
6 the server starts on port 3001
7 upload a document via the onboarding page
8 check the oss console at oss.console.aliyun.com and you will see the uploaded file in the trustflow-docs bucket under the documents prefix
9 the backend logs will show the oss upload and the qwen vl extraction call
