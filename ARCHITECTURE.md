# trustflow architecture

## system overview

trustflow is an ai agent that automates client onboarding and payment reconciliation for businesses

it uses qwen vision language models to read uploaded ids and business records, extracting structured data instantly, a reasoning model then verifies this data scores its confidence and either auto approves the client or escalates it to a human reviewer

once a client is active the agent monitors incoming payments matching them against outstanding invoices if a payment matches it generates a receipt automatically if there is a mismatch it flags the transaction and holds it for review

## architecture diagram

```
                    +-----------------------+
                    |    frontend react     |
                    |  vite typescript      |
                    |  tailwind zustand     |
                    +-----------+-----------+
                                |
                                | https
                                v
                    +-----------+-----------+
                    |    backend node js    |
                    |    express server     |
                    |    running on ecs     |
                    +-----+---------+-------+
                          |         |
             +------------+         +------------+
             |                                    |
             v                                    v
  +----------+----------+              +----------+----------+
  |   alibaba cloud oss |              |   qwen cloud api    |
  |   document storage  |              |   dashscope intl    |
  |   trustflow-docs    |              |   qwen-vl-max       |
  |   singapore region  |              |   qwen-max          |
  +---------------------+              +---------------------+
             |
             | signed url
             v
  +----------+----------+
  |   qwen vl reads     |
  |   document via      |
  |   signed oss url    |
  +---------------------+

             +------------+
             |            |
             v            |
  +----------+----------+ |
  |   sqlite database   | |
  |   on ecs instance   | |
  |   clients docs      | |
  |   invoices payments | |
  |   escalations       | |
  +---------------------+ |
```

## data flow

### onboarding flow

1 user uploads a document on the frontend
2 frontend posts the file to the backend at post /api/clients/:id/upload
3 backend uploads the file to alibaba cloud oss bucket trustflow-docs
4 backend generates a signed url for the uploaded object
5 backend calls qwen-vl-max with the signed url and a field extraction prompt
6 qwen vl returns structured json with name dob document number etc
7 backend calls qwen-max with the extracted data and verification rules
8 qwen max returns a confidence score and an approve or escalate decision
9 if approved the client status is set to active
10 if escalated the client status is set to escalated and an escalation record is created
11 the frontend displays the extracted data and the agent decision

### payment reconciliation flow

1 a payment webhook hits post /api/payments/webhook with amount source client_id invoice_id
2 backend looks up the invoice from the database
3 backend calls qwen-max with the payment and invoice data
4 qwen max returns matched or flagged with a reason
5 if matched the invoice is marked settled
6 if flagged an escalation record is created for human review
7 the frontend payments page shows the result with agent reasoning for flagged items

### human review flow

1 reviewer opens the review queue page
2 frontend fetches all escalations from get /api/escalations
3 reviewer clicks approve or reject on an escalation
4 frontend posts to post /api/escalations/:id/review
5 if approved the client status is updated to active
6 the escalation is marked as reviewed

## alibaba cloud services used

### elastic compute service ecs
- region singapore ap-southeast-1
- instance type ecs.c9i.large 2 vcpu 4gb
- image alibaba cloud linux 3 pro
- runs the node js express backend with pm2
- security group allows port 22 for ssh and port 3001 for the api

### object storage service oss
- bucket name trustflow-docs
- region singapore ap-southeast-1
- storage class standard
- redundancy lrs
- access private with block public access enabled
- stores all uploaded client documents
- signed urls generated for qwen vl to read private objects
- access managed via ram user with aliyunossefullaccess policy

## qwen cloud models used

### qwen-vl-max
- endpoint https://dashscope-intl.aliyuncs.com/compatible-mode/v1
- used for document image reading and field extraction
- takes a signed oss url and returns structured json
- handles id cards utility bills and bank statements

### qwen-max
- endpoint https://dashscope-intl.aliyuncs.com/compatible-mode/v1
- used for the reasoning layer
- verifies extracted data and scores confidence
- reconciles payments against invoices
- decides whether to approve or escalate

## tech stack

| layer | technology |
|---|---|
| frontend | react 19 vite typescript tailwind css v4 |
| state | zustand |
| routing | react router v7 |
| animations | framer motion |
| icons | lucide react |
| backend | node js express |
| database | sqlite via better-sqlite3 |
| ai | qwen-vl-max qwen-max via qwen cloud api |
| cloud | alibaba cloud ecs oss |
| process manager | pm2 |
