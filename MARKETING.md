# trustflow marketing plan

## goal

keep trustflow visible during the qwen hackathon window without sounding like a pitch deck

the story is simple businesses lose time manually verifying identities and matching payments to invoices trustflow uses qwen vision and reasoning models to do both end to end with human checkpoints only for edge cases

core proof to show in public a real document uploaded a real qwen extraction and a real reconciliation decision with the reasoning attached

## posting style

- all lowercase
- builder voice not company voice
- one clear idea per post
- short lines with space between thoughts
- show what works do not explain what you plan to build
- screenshots or screen recordings whenever possible

## post plan

### post 1 project announcement

```
building trustflow for the qwen cloud hackathon

the idea an ai agent should be able to verify a clients identity from their documents and reconcile their incoming payments without a human touching every step

qwen-vl reads the ids and extracts the data
qwen-max scores the confidence and decides to approve or escalate

if the id looks fake or the payment doesnt match the invoice it flags it for a human
```

attach a screenshot of the landing page hero once it is deployed

---

### post 2 first working pipeline

```
trustflow just verified its first identity and reconciled its first payment

uploaded a mock id card
qwen-vl extracted the name and document number in seconds
qwen-max checked the fields scored it 92 percent confidence and auto approved it

then a mock payment came in for the wrong amount
the agent caught the mismatch wrote a reason and held it for human review

no manual data entry no spreadsheet checking
```

attach a screen recording of the dashboard showing the approved client and the flagged payment

---

### post 3 final submission

```
submitted trustflow to the qwen cloud hackathon

an autopilot agent that handles kyc and payment reconciliation end to end

qwen-vl does the document extraction
qwen-max does the reasoning and escalation logic
alibaba cloud handles the backend storage and database

humans only step in when the agent flags an anomaly otherwise it runs the whole trust pipeline autonomously

repo and demo in the submission
```

attach the repo link and a 2 to 3 minute demo video showing the full flow end to end

---

## submission notes

project title trustflow

tagline verify identity reconcile payments automate trust

built with
- node js
- express
- qwen vl
- qwen max
- alibaba cloud ecs oss rds
- react 18
- typescript
- vite
- framer motion
- tailwind css

project description under 200 words

trustflow is an ai agent that automates client onboarding and payment reconciliation for businesses it uses qwen vision language models to read uploaded ids and business records extracting structured data instantly a reasoning model then verifies this data scores its confidence and either auto approves the client or escalates it to a human reviewer

once a client is active the agent monitors incoming payments matching them against outstanding invoices if a payment matches it generates a receipt automatically if there is a mismatch it flags the transaction and holds it for review

this removes the need for manual data entry and fragmented compliance tools humans only interact with the edge cases while the agent handles the clean pipelines built on alibaba cloud infrastructure trustflow demonstrates how multi model ai can automate real business workflows end to end with clear human in the loop checkpoints

demo video flow
1 open the trustflow landing page
2 enter the dashboard
3 go to onboarding and upload a mock id
4 show the qwen vl extraction and qwen max verification score
5 switch to the payments page
6 show a matched payment auto settling
7 show a mismatched payment getting flagged with agent reasoning
8 go to the review queue and show a human approving the flagged item

## checklist

- landing page live and screenshot ready before post 1
- qwen api connected and returning real extractions before post 2
- payment reconciliation logic catching mismatches before post 2
- post 1 goes out early in the build window
- post 2 goes out once the first real end to end flow succeeds
- post 3 goes out at submission
- repo is public before any post goes out
- demo video under three minutes
