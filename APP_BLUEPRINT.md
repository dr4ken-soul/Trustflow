# TrustFlow — App Blueprint

## Product Summary

TrustFlow is an ai agent that automates client onboarding and payment reconciliation for businesses it verifies client identities from uploaded documents using qwen vision language models and reconciles incoming crypto and fiat payments against outstanding invoices the system handles ambiguous inputs invokes external tools and incorporates human in the loop checkpoints at critical decision points

built for the global ai hackathon with qwen cloud on track 4 autopilot agent

## Market Context

who this is for compliance teams finance operations and accounts receivable departments in fintech web3 companies and traditional enterprises

what they currently pay for manual review teams third party kyc vendors and fragmented reconciliation software

why they switch current options are slow error prone and require manual intervention for every edge case trustflow automates the trust lifecycle from identity to payout

## MVP Feature Set

### feature 1 document intake and extraction
user story as a business admin i want to upload client id and business records so the agent can extract structured data automatically
how it works files are uploaded to alibaba cloud oss the backend passes the files to qwen vl which extracts fields like name document number and business registration details into structured json
acceptance criteria file uploads to oss successfully qwen vl returns structured json matching the document fields and the system handles at least three document types id utility bill bank statement
complexity high

### feature 2 verification and escalation
user story as a compliance officer i want the agent to flag suspicious documents so i only review what needs human attention
how it works qwen max takes the extracted json applies verification rules and scores confidence if confidence is high it approves the client if low it generates a report and routes it to a human reviewer queue
acceptance criteria qwen max scores confidence accurately on test data high confidence applications move to active status automatically low confidence applications move to escalated status with an agent reasoning report attached
complexity high

### feature 3 payment reconciliation
user story as a finance ops lead i want incoming payments matched to invoices automatically so i do not do it manually
how it works a webhook receives incoming crypto or bank transactions the agent queries the database for outstanding invoices matches the payment to an invoice and either generates a receipt or flags the mismatch
acceptance criteria webhook accepts mock transaction payloads matched payments generate a receipt file in oss and update invoice status to settled mismatched payments are flagged and routed to the review queue
complexity high

### feature 4 reviewer dashboard
user story as a reviewer i want to see all flagged items in one place so i can approve or reject them quickly
how it works a react dashboard displays escalated documents and flagged payments with the agents reasoning attached the reviewer can approve or reject which updates the database
acceptance criteria dashboard fetches all pending escalations reviewer can approve or reject items approving an escalated onboarding moves the client to active status approving a flagged payment settles the invoice
complexity medium

## Tech Stack

| layer | technology | reason |
|---|---|---|
| backend | node js with express | handles api routes agent logic and qwen api calls efficiently |
| ai models | qwen vl qwen max | qwen vl for document image extraction qwen max for reasoning via qwen cloud api |
| cloud infrastructure | alibaba cloud | ecs for backend oss for document storage rds for postgres database |
| frontend | react 18 with vite typescript | fast build strong typing standard for modern web apps |
| styling | tailwind css v3 | utility first no runtime overhead pairs with framer motion |
| animations | framer motion | production grade entrance animations and stagger support |
| state management | zustand | lightweight global state with no boilerplate |
| icons | lucide react | clean outline icons tree shakeable |

## Database Schema

table clients
id uuid primary key
name varchar
status varchar pending active escalated
created at timestamp

table documents
id uuid primary key
client id uuid foreign key
file url varchar
type varchar id utility bill
extracted data jsonb

table invoices
id uuid primary key
client id uuid foreign key
amount decimal
status varchar outstanding settled
due date timestamp

table payments
id uuid primary key
client id uuid foreign key
invoice id uuid foreign key
amount decimal
source varchar crypto bank
status varchar matched flagged

table escalations
id uuid primary key
client id uuid foreign key
reason text
agent context jsonb
status varchar pending reviewed
reviewer decision varchar

## API Architecture

post api clients
create a new client
request body name
response client id and status

post api clients id upload
upload document to oss and trigger qwen vl
request body file multipart form data
response document id and extraction status

post api payments webhook
receive incoming payment notifications
request body amount source client id invoice id
response payment status and match result

get api escalations
fetch flagged items for reviewer dashboard
response array of escalation objects with agent context

post api escalations id review
submit human decision
request body decision approve reject
response updated escalation status

## User Flow and Screens

landing page user reads the pitch and enters the app
dashboard user sees stats on active clients pending reviews and settled payments
onboarding user uploads documents and watches the agent extract and verify
review queue compliance officer reviews escalated documents and flagged payments
payments finance ops views matched transactions and generated receipts

## Build Sequence

### week 1 infrastructure and ai core
setup alibaba cloud ecs oss and rds postgres
initialize node js backend with express
integrate qwen vl for document image extraction
integrate qwen max for verification reasoning logic

### week 2 reconciliation and human in the loop
build payment webhook listener
implement invoice matching logic with qwen max
build escalation queue logic and database schema
connect reviewer approval endpoints

### week 3 frontend implementation
setup react 18 vite and tailwind
build carbon and copper design system
implement dashboard onboarding review queue and payments pages
connect frontend to backend apis

### week 4 demo preparation and deployment
deploy backend to alibaba ecs
deploy frontend to vercel
record 3 minute demo video showing the full flow
write readme and prepare submission
