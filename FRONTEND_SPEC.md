# TrustFlow — Frontend Specification

all design decisions are locked do not deviate from any value without explicit instruction

## Design Gates Confirmed

gate 1 aesthetic dark editorial
gate 2 navigation landing top editorial strip with ticker app interior fixed left sidebar
gate 3 background static atmospheric deep carbon copper radial glow noise grain subtle mesh
gate 4 typography newsreader manrope space mono
gate 5 colour palette carbon and copper
gate 6 hero split layout copy left abstract object right
gate 7 sections hero trust flow diagram features human in the loop final cta

## Colour System

define in root in globals css never hardcode hex in components

:root {
  --bg-primary:     #0a0b0f;
  --bg-secondary:   #11131a;
  --bg-surface:     #181a23;
  --bg-elevated:    #20222d;
  --accent:         #c8895f;
  --accent-hover:   #d9a07a;
  --accent-glow:    rgba(200, 137, 95, 0.12);
  --accent-dim:     #8a5d3e;
  --text-primary:   #f2f0ed;
  --text-secondary: #a8a59e;
  --text-muted:     #5c5a54;
  --border-subtle:  rgba(255, 255, 255, 0.05);
  --border-default: rgba(255, 255, 255, 0.09);
  --success:        #7fb069;
  --error:          #e57373;
}

## Typography

load in index html

link rel preconnect href https fonts googleapis com
link rel preconnect href https fonts gstatic com crossorigin
link href https fonts googleapis com css2 family newsreader ital opsz wght 0 6 72 300 0 6 72 400 0 6 72 600 1 6 72 300 family manrope wght 300 400 500 600 700 family space mono wght 400 700 display swap rel stylesheet

apply in globals css

font-display font-family newsreader georgia serif
font-body font-family manrope system ui sans serif
font-mono font-family space mono courier new monospace

tailwind config

fontFamily display newsreader georgia serif
fontFamily body manrope system ui sans serif
fontFamily mono space mono courier new monospace

## Liquid Glass Classes

defined once in globals css used directly as class names in components

liquid-glass
background rgba 255 255 255 0.02
background-blend-mode luminosity
backdrop-filter blur 4px
webkit backdrop-filter blur 4px
border none
box-shadow inset 0 1px 1px rgba 255 255 255 0.1
position relative
overflow hidden

liquid-glass before
content 
position absolute
inset 0
border-radius inherit
padding 1.4px
background linear-gradient 180deg rgba 255 255 255 0.4 0 rgba 255 255 255 0.12 20 rgba 255 255 255 0 40 rgba 255 255 255 0 60 rgba 255 255 255 0.12 80 rgba 255 255 255 0.4 100
webkit mask linear-gradient fff 0 0 content-box linear-gradient fff 0 0
webkit mask-composite xor
mask-composite exclude
pointer-events none

liquid-glass-strong
background rgba 255 255 255 0.02
background-blend-mode luminosity
backdrop-filter blur 50px
webkit backdrop-filter blur 50px
border none
box-shadow 4px 4px 4px rgba 0 0 0 0.05 inset 0 1px 1px rgba 255 255 255 0.15
position relative
overflow hidden

liquid-glass-dark
background rgba 10 11 15 0.6
background-blend-mode luminosity
backdrop-filter blur 4px
webkit backdrop-filter blur 4px
border none
box-shadow inset 0 1px 1px rgba 255 255 255 0.1
position relative
overflow hidden

## Global Base Styles

html scroll-behavior smooth
body background-color var bg-primary color var text-primary font-family manrope system ui sans serif

noise grain overlay applied globally via body after
svg fractal noise base frequency 0.9 opacity 0.035 background-size 128px 128px

app interior radial glow behind main content area
app-bg background radial-gradient ellipse 80% 40% at 50% 0% var accent-glow 0% transparent 70% var bg-primary

## Framer Motion Entrance Components

FadeIn tsx
initial opacity 0 filter blur 8px y 20
whileinview opacity 1 filter blur 0px y 0
viewport once true margin 50px amount 0
transition duration 0.7 delay 0 ease 0.25 0.1 0.25 1

BlurText tsx
splits text into words
initial filter blur 10px opacity 0 y 50
animate filter blur 5px opacity 0.5 y -5 then filter blur 0px opacity 1 y 0
transition duration 0.7 times 0 1 ease easeout delay delay i 100 1000

## Landing Page Nav

EditorialNav tsx
fixed top 0 inset-x 0 z-50
row 1 bg var bg-secondary 80 backdrop-blur-md border-b border var border-subtle
inner max-w-7xl mx-auto px-6 lg px-8 h-9 flex items-center justify-between
left trustflow wordmark font-display text-lg
center rotating ticker showing system status font-mono text-xs text var accent-dim
right enter dashboard button liquid-glass rounded-full px-5 py-2.5 font-body text-sm text var accent

## App Interior Nav

AppSidebar tsx
fixed left 0 top 0 bottom 0 w-64 hidden on mobile replaced by bottom tab bar
background var bg-secondary border-r border var border-subtle
logo at top
nav links dashboard onboarding review queue payments
active link text var accent border-l-2 border var accent pl-4
inactive text var text-secondary hover text var text-primary transition-colors

## Landing Sections

### section 1 hero
min-h 100dvh grid lg grid-cols-2
left column flex flex-col justify-center px-6 lg px-16 py-16
background var bg-primary
badge chip liquid-glass rounded-full px-4 py-2 w-fit flex items-center gap-2 delay 0.4s
headline BlurText delay 0.5s font-display font-bold text clamp 2.8rem 6vw 5rem leading 0.98 tracking -0.02em text var text-primary mt-5
sub headline FadeIn delay 0.8s font-body text-base lg text-lg leading-relaxed text var text-secondary max-w-lg mt-5
cta button FadeIn delay 1.1s liquid-glass-strong rounded-full px-6 py-3 font-body text-sm text var accent mt-8
right column relative overflow-hidden hidden lg block
abstract geometric object floating centred with copper ambient glow behind it
object entrance motion div initial opacity 0 filter blur 12px x 20 animate opacity 1 filter blur 0px x 0 transition duration 1 delay 0.6

### section 2 trust flow diagram
visual representation of the kyc to payment pipeline
py-24 max-w-6xl mx-auto px-6 lg px-8
shows document upload qwen extraction verification human checkpoint payment matching and receipt
use liquid-glass cards connected by svg lines
scroll triggered stagger reveal using FadeIn with 0.15s stagger between cards

### section 3 features
grid md grid-cols-3 gap-4 py-24 max-w-6xl mx-auto px-6 lg px-8
cards showing document extraction autonomous reasoning external tool calls human in the loop
liquid-glass rounded-2xl p-8
card label font-mono text-xs tracking-widest uppercase text var accent-dim mb-4
card headline font-display text-xl text var text-primary mb-3
card body font-body text-sm leading-relaxed text var text-secondary

### section 4 human in the loop
two panel layout showing agent autonomy vs human checkpoint
grid lg grid-cols-2 gap-6 py-24 max-w-5xl mx-auto px-6 lg px-8
left panel agent auto approves a clean document liquid-glass-dark rounded-2xl p-8
right panel agent escalates a mismatched payment with reasoning attached liquid-glass-dark rounded-2xl p-8 border-l-2 border var accent

### section 5 final cta
centered headline and button
py-32 max-w-3xl mx-auto px-6 text-center flex flex-col items-center gap-8
headline font-display text clamp 2rem 5vw 3.5rem leading-tight text var text-primary
button liquid-glass-strong rounded-full px-8 py-4 font-body text-sm text var accent hover text var accent-hover transition-colors

## App Interior Pages

### dashboard
layout pt-24 pb-16 px-6 lg px-8 max-w-7xl mx-auto
page title dashboard font-display font-semibold text-3xl tracking-tight text var text-primary mb-2
sub font-body text-sm text var text-secondary mb-10 your compliance and finance ops overview
top row grid md grid-cols-3 gap-4 mb-10
stat cards liquid-glass-strong rounded-2xl p-6
label font-mono text-xs tracking-widest uppercase text var text-muted mb-2
value font-display font-bold text-4xl text var text-primary tracking-tight leading-none mb-1
sub font-body text-xs text var text-secondary
cards pending reviews active clients settled payments
recent activity list mt-12
heading font-mono text-xs uppercase tracking-widest text var text-muted mb-4
each row flex items-center justify-between py-4 border-b border var border-subtle
left date font-mono text-xs text var text-muted summary font-body text-sm text var text-primary mt-1
right status badge approved bg success 10 text success border success 20 rounded-full px-3 py-1 font-body text-xs

### onboarding
layout pt-24 pb-16 px-6 lg px-8 max-w-3xl mx-auto
page title onboarding font-display font-semibold text-3xl tracking-tight text var text-primary mb-2
file upload drag and drop area border border-dashed border var border-default rounded-2xl p-16 text-center mb-8
once uploaded show extraction progress using skeleton shimmer w-full h-4 bg var bg-elevated rounded animate-pulse
display extracted data in font-mono text-sm text var text-primary inside a liquid-glass-dark rounded-2xl p-6
show verification score and agent decision below data

### review queue
layout pt-24 pb-16 px-6 lg px-8 max-w-5xl mx-auto
page title review queue font-display font-semibold text-3xl tracking-tight text var text-primary mb-2
list of escalated items
each item liquid-glass rounded-2xl p-6 mb-4
top row flex items-center justify-between
left client name font-display text-lg text var text-primary reason font-body text-sm text var text-secondary mt-1
right status badge escalated bg accent-dim 10 text accent-dim border accent-dim 20 rounded-full px-3 py-1 font-body text-xs
agent context expandable section font-mono text-xs text var text-muted mt-4 bg var bg-surface rounded-xl p-4
approve reject buttons flex gap-3 mt-4
approve bg success text bg-primary rounded-lg px-4 py-2 font-body text-sm font-medium
reject bg error text bg-primary rounded-lg px-4 py-2 font-body text-sm font-medium

### payments
layout pt-24 pb-16 px-6 lg px-8 max-w-5xl mx-auto
page title payments font-display font-semibold text-3xl tracking-tight text var text-primary mb-2
table of recent payments
heading font-mono text-xs uppercase tracking-widest text var text-muted mb-4
each row flex items-center justify-between py-4 border-b border var border-subtle
left date font-mono text-xs text var text-muted amount font-body text-sm text var text-primary mt-1
right status badge
matched payments show green status bg success 10 text success border success 20 rounded-full px-3 py-1 font-body text-xs
flagged payments show red status bg error 10 text error border error 20 rounded-full px-3 py-1 font-body text-xs and expand to show agent reasoning in a liquid-glass-dark rounded-xl p-4 mt-4

## Component Rules

css class based hover states only no inline js mouse handlers
all entrance animations use blur-in pattern initial opacity 0 filter blur 8px y 20
skeleton shimmer for all loading states no spinners
every empty state has a heading a body sentence and a primary action button
every error state names what failed and what the user should do next
no logo mark or favicon is defined in this spec the user provides those assets
data values wallet addresses and hashes always use font-mono
all copy follows the writing rules british english no em dashes periods only when necessary

## Responsive Behaviour

all layouts collapse to a single column below the lg breakpoint 1024px
hero split stacks on mobile the right image column is hidden copy runs full width
features grid collapses to a single column on mobile
human in the loop two panel layout stacks vertically on mobile
app interior sidebar is hidden on mobile replaced by a fixed bottom tab bar grid grid-cols-4 h-16 bg var bg-secondary border-t border var border-subtle
all touch targets are at minimum 44x44px
hero headline uses clamp so it never overflows on a 375px screen

## Accessibility Requirements Priority 1

colour contrast minimum 4.5 1 for normal text 3 1 for large text
focus states visible focus ring on every interactive element using focus-visible outline 2px solid var accent outline-offset 2px
alt text meaningful images have descriptive alt decorative images use alt empty
aria labels every icon only button has an aria label the mobile bottom tab icons each carry an aria label matching their tab name
keyboard navigation tab order matches visual reading order every interactive element reachable by keyboard
form labels the onboarding file upload and any input has an associated label visually hidden if needed via sr-only class never placeholder as the sole label
skip link a skip to main content link as the first focusable element on every page
heading hierarchy h1 through h6 sequential no skipped levels
colour not the only signal review states pair colour with a text label never colour alone
reduced motion all entrance animations respect prefers-reduced-motion content stays fully readable with motion off
