# trustflow build guide

step by step prompts for a coding ai like claude code or cursor complete each phase in order do not move to the next phase until the current one runs without errors

## environment setup

```bash
npm create vite@latest trustflow -- --template react-ts
cd trustflow
npm install
npm install tailwindcss @tailwindcss/vite
npm install framer-motion
npm install zustand
npm install react-router-dom
npm install lucide-react
npm install axios
npx tailwindcss init -p
```

backend setup in a separate folder called server
```bash
mkdir server
cd server
npm init -y
npm install express cors dotenv @alicloud/oss-nodejs-sdk pg openai
```

create a .env file in the server folder based on .env.example before starting phase 2

## phase 1 backend infrastructure and database

prompt to paste into coding ai

```
create a node js express server in the server directory

setup the following files
server/index.js basic express server with cors and json body parsing
server/db.js postgres connection pool using the pg library reading the database url from environment variables
server/routes.js empty router for now
server/services/ossService.js using @alicloud/oss-nodejs-sdk to handle file uploads return the public url of the uploaded file
server/services/dbService.js empty service file for future database queries

ensure all environment variables are read from process.env and never hardcoded
```

## phase 2 qwen cloud integration

prompt to paste into coding ai

```
create server/services/qwenService.js

this service integrates with the qwen cloud api using the openai compatible endpoint
api endpoint https://dashscope-intl.aliyuncs.com/compatible-mode/v1
api key is read from process.env.QWEN_API_KEY

create two async functions

1 extractDocument(imageUrl)
calls the qwen-vl-max model
passes the image url and a system prompt asking it to extract name date of birth document number and business name from the uploaded id or utility bill
returns a structured json object

2 verifyIdentity(extractedData)
calls the qwen-max model
passes the extracted json
system prompt tells it to verify the data check for missing fields name mismatches and assign a confidence score from 0 to 100
if confidence is above 85 return status approved
if below 85 return status escalated with a written reason
return an object with confidence score status and reason
```

## phase 3 payment reconciliation logic

prompt to paste into coding ai

```
create server/services/reconcileService.js and add a new route to server/routes.js at post api/payments/webhook

the webhook receives a mock transaction payload containing amount source crypto or bank client_id and invoice_id

the reconcile service must
1 query the database for the invoice_id matching the payload
2 compare the paid amount to the invoice amount
3 if amounts match exactly update the invoice status to settled and the payment status to matched
4 if amounts do not match update payment status to flagged and insert a new row into the escalations table with the reason amount mismatch
5 use qwen max to generate a human readable summary of the reconciliation result

ensure all database updates are atomic using transactions
```

## phase 4 frontend scaffold and design system

prompt to paste into coding ai

```
setup the frontend design system in the trustflow directory

read the FRONTEND_SPEC.md file and apply these rules strictly
1 update tailwind.config.ts with the carbon and copper colour palette and the newsreader manrope and space mono fonts
2 update src/styles/globals.css with the exact css variables liquid glass classes and noise grain overlay defined in the spec
3 create src/components/ui/FadeIn.tsx and BlurText.tsx using the exact framer motion blur in patterns from the spec
4 create src/components/layout/EditorialNav.tsx for the landing page and AppSidebar.tsx for the app interior following the layout rules in the spec
5 build src/pages/Landing.tsx importing the Hero TrustFlowDiagram Features HumanLoop and FinalCta sections as empty placeholders for now
setup react router v6 in App.tsx with routes for / /dashboard /onboarding /review-queue /payments
```

## phase 5 core app pages

prompt to paste into coding ai

```
build the app interior pages in the trustflow directory following the FRONTEND_SPEC.md exactly

1 src/pages/Dashboard.tsx
three stat cards at the top using liquid-glass-strong for pending reviews active clients and settled payments
mock the data for now
recent activity list below using border-t and divide-y

2 src/pages/Onboarding.tsx
a drag and drop file upload area
when a file is selected show a skeleton shimmer for 2 seconds to simulate extraction
then display mock extracted data in font-mono inside a liquid-glass-dark container
show the verification score and agent decision below

3 src/pages/ReviewQueue.tsx
a list of 3 mock escalated items
each item is a liquid-glass card showing client name reason and an expandable agent context section
approve and reject buttons at the bottom of each card

4 src/pages/Payments.tsx
a list of mock payments using border-t and divide-y
matched payments get a green status badge
flagged payments get a red status badge and expand to show the agent reasoning in a dark container
```

## phase 6 deployment and demo prep

prompt to paste into coding ai

```
prepare the project for submission

1 write a comprehensive readme.md explaining what trustflow is how the qwen integration works and how to run it locally
2 add a .env.example file to the root of the server folder with all required environment variables
3 ensure the frontend builds without errors using npm run build
4 provide the exact commands to deploy the server folder to alibaba cloud ecs and the frontend to vercel
```

## common issues

qwen api returns 401 unauthorized
ensure the api key in the .env file is correct and has permissions for qwen-vl and qwen max models

file upload to oss fails
check that the alibaba cloud access key and secret key have write permissions to the specified bucket

database connection timeout
ensure the alibaba cloud rds instance allows inbound connections from your ecs server ip address
