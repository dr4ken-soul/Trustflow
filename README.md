# trustflow

an ai agent that automates client onboarding and payment reconciliation for businesses

built for the global ai hackathon with qwen cloud on track 4 autopilot agent

## what it does

trustflow uses qwen vision language models to read uploaded ids and business records extracting structured data instantly a reasoning model then verifies this data scores its confidence and either auto approves the client or escalates it to a human reviewer

once a client is active the agent monitors incoming payments matching them against outstanding invoices if a payment matches it generates a receipt automatically if there is a mismatch it flags the transaction and holds it for review

this removes the need for manual data entry and fragmented compliance tools humans only interact with the edge cases while the agent handles the clean pipelines

## how the qwen integration works

qwen vl handles document image reading and field extraction it takes an image url from alibaba oss and returns structured json with name dob document number and business details

qwen max handles the reasoning layer it takes the extracted json applies verification rules scores confidence generates the onboarding report and decides whether to approve or escalate in payment reconciliation it reads transaction data compares it to invoice records and writes the flag reason

api endpoint https://dashscope-intl.aliyuncs.com/compatible-mode/v1

the backend uses the openai compatible client so the same code works with qwen cloud without any vendor specific sdk

## tech stack

| layer | technology |
|---|---|
| backend | node js express |
| frontend | react 18 vite typescript |
| ai | qwen vl qwen max via qwen cloud api |
| cloud | alibaba cloud ecs oss rds |
| database | postgres on alibaba rds |
| state | zustand |
| routing | react router v6 |
| icons | lucide react |
| animations | framer motion |
| styling | tailwind css v4 |

## project structure

```
trustflow/
  src/
    components/
      ui/
        FadeIn.tsx
        BlurText.tsx
      layout/
        EditorialNav.tsx
        AppSidebar.tsx
        AppLayout.tsx
      sections/
        Hero.tsx
        TrustFlowDiagram.tsx
        Features.tsx
        HumanLoop.tsx
        FinalCta.tsx
    pages/
      Landing.tsx
      Dashboard.tsx
      Onboarding.tsx
      ReviewQueue.tsx
      Payments.tsx
    hooks/
    lib/
      api.ts
      utils.ts
    store/
      useAppStore.ts
    types/
      index.ts
    styles/
      globals.css
    App.tsx
    main.tsx
  server/
    index.js
    db.js
    routes.js
    services/
      qwenService.js
      ossService.js
      dbService.js
      reconcileService.js
    .env.example
  index.html
  vite.config.ts
  package.json
```

## running locally

### prerequisites

- node js 18 or higher
- npm or yarn
- a qwen cloud api key from https://dashscope.console.aliyun.com
- optional alibaba cloud oss and rds credentials for production mode

### frontend setup

```bash
cd trustflow
npm install
npm run dev
```

the frontend runs on http://localhost:5173

### backend setup

```bash
cd trustflow/server
npm install
cp .env.example .env
# fill in your qwen api key and alibaba cloud credentials
npm run dev
```

the backend runs on http://localhost:3001

the frontend dev server proxies all /api requests to the backend so both must be running for the full flow

### mock mode

if you do not have a qwen api key or alibaba cloud credentials the backend still runs and returns mock data for every endpoint this lets you explore the full ui without any external dependencies

the frontend also ships with mock data in the zustand store so you can see the dashboard review queue and payments pages populated even without the backend running

## building for production

```bash
cd trustflow
npm run build
```

this outputs static assets to the dist folder which can be deployed to vercel netlify or any static host

## deployment

### deploy backend to alibaba cloud ecs

1. create an ecs instance with node js 18 installed
2. clone the repo to the ecs instance
3. cd into the server folder and run npm install
4. copy your .env file with real qwen and alibaba credentials
5. start the server with pm2

```bash
ssh root@your-ecs-ip
cd /opt/trustflow/server
npm install --production
pm2 start index.js --name trustflow-api
pm2 save
pm2 startup
```

configure nginx on the ecs instance to proxy api requests to port 3001

### deploy frontend to vercel

1. push the trustflow folder to a github repo
2. connect the repo to vercel
3. set the root directory to trustflow
4. set the build command to npm run build
5. set the output directory to dist
6. add an environment variable for the api url pointing to your ecs instance
7. deploy

### alibaba cloud oss setup

1. create an oss bucket in your preferred region
2. create a ram user with write permissions to the bucket
3. add the access key id and secret to the server .env file

### alibaba cloud rds setup

1. create an rds for postgresql instance
2. create a database and user
3. whitelist your ecs instance ip in the rds security group
4. add the database url to the server .env file

## api endpoints

| method | path | description |
|---|---|---|
| post | /api/clients | create a new client |
| get | /api/clients | list all clients |
| post | /api/clients/:id/upload | upload a document and run extraction plus verification |
| post | /api/payments/webhook | receive a payment and reconcile against an invoice |
| get | /api/payments | list all payments |
| get | /api/escalations | list all pending escalations |
| post | /api/escalations/:id/review | submit a reviewer decision |
| post | /api/seed | seed the database with demo data |
| get | /health | health check for deployment probes |

## demo video flow

1. open the trustflow landing page
2. enter the dashboard
3. go to onboarding and upload a mock id
4. show the qwen vl extraction and qwen max verification score
5. switch to the payments page
6. show a matched payment auto settling
7. show a mismatched payment getting flagged with agent reasoning
8. go to the review queue and show a human approving the flagged item

## submission

- project title trustflow
- tagline verify identity reconcile payments automate trust
- track 4 autopilot agent
- built with qwen vl qwen max alibaba cloud ecs oss rds react 18 typescript vite framer motion tailwind css

## license

mit
