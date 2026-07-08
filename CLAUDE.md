# TrustFlow — Agent Context

## What This Is

TrustFlow is an ai agent that automates client onboarding kyc and payment reconciliation it uses qwen models on qwen cloud infrastructure to read documents verify identities and match payments to invoices deployed on alibaba cloud

built for the global ai hackathon with qwen cloud track 4 autopilot agent

## One Line Pitch

an autopilot agent that verifies client identities and reconciles incoming payments end to end with human in the loop checkpoints

## MVP Features

1 client onboarding admin uploads id and business records qwen vl extracts structured data
2 verification qwen max scores confidence and either auto approves or escalates to a human
3 payment reconciliation webhook receives payments qwen max matches them to invoices or flags mismatches
4 reviewer dashboard humans review escalated documents and flagged payments with agent reasoning attached

## Stack

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

## Qwen Integration

qwen vl handles document image reading and field extraction it takes an image url from alibaba oss and returns structured json with name dob document number and business details

qwen max handles the reasoning layer it takes the extracted json applies verification rules scores confidence generates the onboarding report and decides whether to approve or escalate in payment reconciliation it reads transaction data compares it to invoice records and writes the flag reason

api endpoint https dashscope-intl.aliyuncs.com compatible-mode v1

## Alibaba Cloud Deployment

backend runs on alibaba cloud ecs
documents and receipts are stored in alibaba cloud oss
postgres database runs on alibaba cloud rds
proof of deployment will be a screen recording showing the ecs instance running and oss buckets receiving files

## Project Structure

trustflow/
public/
src/
components/
ui/
FadeIn.tsx
BlurText.tsx
layout/
EditorialNav.tsx
AppSidebar.tsx
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
useQwenVl.ts
useQwenMax.ts
lib/
qwen.ts
alibaba.ts
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
routes.js
services/
qwenService.js
ossService.js
dbService.js

## Design System

aesthetic dark editorial grounded and premium
fonts newsreader for display manrope for body space mono for data
colour palette carbon and copper
background static atmospheric deep carbon with copper radial glow and noise grain

## Code Rules

typescript react camelcase for all variables and functions
jsdoc comments on every function
no inline styles unless a css variable or dynamic value requires it
css variables from the design system used directly never hardcoded hex values in components
no hardcoded placeholder logos or favicons ask the user to provide them
no em dashes anywhere in code comments or ui copy
writing rules british english no filler phrases short direct sentences
