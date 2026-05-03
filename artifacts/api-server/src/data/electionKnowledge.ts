export interface ElectionTopic {
  id: string;
  title: string;
  titleHindi: string;
  description: string;
  icon: string;
  tags: string[];
  content: string;
  steps: string[];
  officialLinks: { label: string; url: string }[];
}

export const electionTopics: ElectionTopic[] = [
  {
    id: "voter-registration",
    title: "Voter Registration",
    titleHindi: "मतदाता पंजीकरण",
    description: "Learn how to register yourself on the electoral rolls and get your Voter ID card.",
    icon: "UserCheck",
    tags: ["registration", "voter id", "form 6", "nvsp", "BLO"],
    content: `Complete step-by-step voter registration process in India:

ELIGIBILITY: Indian citizen, 18+ years old as of January 1st of the qualifying year, ordinarily resident at the address in the constituency.

METHOD 1 - ONLINE via Voter Portal:
1. Visit voterportal.eci.gov.in or nvsp.in
2. Click "New Registration (Form 6)"
3. Fill personal details: name, DOB, address, mobile
4. Upload documents: photo (recent passport size), age proof (Aadhaar/birth certificate), address proof
5. Submit and note your reference number
6. Track status using reference number

METHOD 2 - OFFLINE via BLO:
1. Collect Form 6 from nearest Electoral Registration Office or BLO (Booth Level Officer)
2. Fill form with BLACK ink
3. Attach self-attested copies of age proof and address proof + 1 passport photo
4. Submit to BLO or ERO office

DEADLINE: Must register 30 days before election date.

DOCUMENTS NEEDED: Any one age proof (Aadhaar, PAN, birth certificate, school leaving certificate, passport), any one address proof (Aadhaar, utility bill, bank passbook, ration card)

VOTER ID CARD: Physical card issued within 6-8 weeks. Can vote with digital copy on DigiLocker too.`,
    steps: [
      "Visit voterportal.eci.gov.in",
      "Click 'New Registration (Form 6)'",
      "Fill personal details: name, DOB, address, mobile number",
      "Upload required documents (photo, age proof, address proof)",
      "Submit form and note your reference number",
      "Track your application status online",
      "Receive Voter ID card within 6-8 weeks"
    ],
    officialLinks: [
      { label: "Voter Portal", url: "https://voterportal.eci.gov.in" },
      { label: "NVSP", url: "https://nvsp.in" },
      { label: "ECI Official Site", url: "https://eci.gov.in" }
    ]
  },
  {
    id: "election-timeline",
    title: "Election Timeline",
    titleHindi: "चुनाव समयरेखा",
    description: "Understand the complete election process from announcement to result declaration.",
    icon: "Calendar",
    tags: ["timeline", "phases", "MCC", "schedule", "announcement"],
    content: `Indian General Election Timeline - Complete Process:

PHASE 1 - ANNOUNCEMENT:
- Election Commission announces election schedule
- Model Code of Conduct (MCC) comes into effect immediately
- Dates for all phases announced

PHASE 2 - NOMINATION (usually 7-14 days after announcement):
- Candidates file nomination papers
- Nomination papers scrutinized by Returning Officer
- Candidates can withdraw nominations by a specific deadline

PHASE 3 - CAMPAIGN PERIOD:
- Political parties and candidates campaign
- Campaign ends 48 hours before polling (silence period)
- Cannot distribute money/gifts to voters

PHASE 4 - POLLING DAY:
- Polling typically 7 AM to 6 PM
- Voters cast votes using EVMs
- Re-polling ordered if irregularities found

PHASE 5 - COUNTING:
- Counting usually done 1-2 days after all phases complete
- Results declared constituency by constituency
- Winning candidates receive formal certificates

PHASE 6 - GOVERNMENT FORMATION:
- Party/alliance with majority forms government
- President invites leader to form government
- Swearing-in ceremony`,
    steps: [
      "Election Commission announces schedule and dates",
      "Model Code of Conduct comes into effect",
      "Candidates file nominations",
      "Nomination papers scrutinized and withdrawals allowed",
      "Campaign period begins",
      "48-hour silence period before polling",
      "Polling day - voters cast ballots",
      "Vote counting and result declaration",
      "Government formation"
    ],
    officialLinks: [
      { label: "ECI Election Schedule", url: "https://eci.gov.in" },
      { label: "Current Phase Information", url: "https://eci.gov.in/candidate-political-parties/elections/" }
    ]
  },
  {
    id: "voting-day-guide",
    title: "Voting Day Guide",
    titleHindi: "मतदान दिवस मार्गदर्शिका",
    description: "Everything you need to know about what to do on polling day — from finding your booth to casting your vote.",
    icon: "Vote",
    tags: ["voting", "polling booth", "EVM", "VVPAT", "documents", "polling day"],
    content: `Everything you need to know about voting day:

WHAT TO BRING: Your EPIC (Voter ID card) OR any ONE of: Aadhaar, passport, driving licence, PAN card, MNREGA job card, bank/post office passbook with photo, health insurance smart card, pension document with photo, NPR smart card.

POLLING BOOTH TIMINGS: Generally 7 AM to 6 PM (may vary by state/constituency).

FINDING YOUR BOOTH: Go to eci.gov.in → "Know Your Polling Booth" → Enter EPIC number or details.

AT THE BOOTH:
1. Join the correct queue (separate queues often for men/women/senior citizens)
2. Show your ID to the polling officer
3. Officer will verify your name in the electoral roll
4. Your left index finger will be marked with indelible ink
5. You'll receive a ballot slip — take it to the EVM
6. Press the button next to your chosen candidate's name and symbol
7. VVPAT will show a slip for 7 seconds confirming your vote
8. Vote is cast!

IMPORTANT RIGHTS:
- You CANNOT be turned away if your name is on the rolls
- Senior citizens (80+) and disabled voters get priority
- Secret ballot — no one can see who you voted for`,
    steps: [
      "Find your polling booth on eci.gov.in",
      "Carry valid photo ID (Voter ID or any of 12 alternative documents)",
      "Reach polling booth during 7 AM to 6 PM",
      "Join the queue and wait for your turn",
      "Show ID to polling officer for verification",
      "Get left index finger marked with indelible ink",
      "Receive ballot slip and proceed to EVM",
      "Press button next to your chosen candidate",
      "Verify vote on VVPAT screen (7 seconds display)"
    ],
    officialLinks: [
      { label: "Find Your Polling Booth", url: "https://eci.gov.in/voter-corner/desktop/know-your-polling-booth.html" },
      { label: "Voter Portal", url: "https://voterportal.eci.gov.in" }
    ]
  },
  {
    id: "evm-vvpat",
    title: "EVM & VVPAT",
    titleHindi: "ईवीएम और वीवीपीएटी",
    description: "How Electronic Voting Machines and the paper trail system work to ensure fair elections.",
    icon: "Monitor",
    tags: ["EVM", "VVPAT", "electronic voting", "ballot", "security"],
    content: `Electronic Voting Machine (EVM) and Voter Verifiable Paper Audit Trail (VVPAT):

WHAT IS AN EVM: A standalone battery-operated electronic device that records votes. Cannot be connected to internet or any network. Has two units: Control Unit (with polling officer) and Balloting Unit (where you vote).

HOW IT WORKS:
1. Balloting Unit shows candidate names + party symbols + button
2. You press button next to your choice
3. A beep confirms vote recorded
4. Control Unit shows total votes cast (not which way)

WHAT IS VVPAT: A printer attached to EVM that prints a paper slip showing:
- Serial number of candidate
- Candidate name
- Party symbol
You see this slip for 7 seconds through a glass window. It then falls into a sealed compartment.

IS IT SECURE:
- Manufactured only by BEL and ECIL (government companies)
- Standalone — no WiFi, no Bluetooth, no internet port
- Tested and sealed before elections
- Randomized allocation to constituencies
- VVPAT slips can be counted to verify EVM results

NOTA: None of the Above option — if you don't want to vote for any candidate, press NOTA button (last option on ballot).`,
    steps: [
      "Receive ballot slip from polling officer",
      "Proceed to Balloting Unit (EVM)",
      "Find your candidate's name and party symbol",
      "Press the blue button next to your choice",
      "Wait for confirmation beep",
      "View VVPAT screen — paper slip shows for 7 seconds",
      "Slip falls into sealed compartment after 7 seconds",
      "Vote successfully recorded!"
    ],
    officialLinks: [
      { label: "ECI EVM Information", url: "https://eci.gov.in/evm/" },
      { label: "EVM FAQs", url: "https://eci.gov.in/evm/desktop/evm-faqs.html" }
    ]
  },
  {
    id: "counting-results",
    title: "Counting & Results",
    titleHindi: "मतगणना और परिणाम",
    description: "How votes are counted, results declared, and winners certified after polling ends.",
    icon: "BarChart2",
    tags: ["counting", "results", "declaration", "certificate", "returning officer"],
    content: `How votes are counted and results declared in India:

WHEN COUNTING HAPPENS: Usually 1-2 days after all polling phases are complete. A single date is set for all constituencies.

WHERE COUNTING HAPPENS: At designated Counting Centers (usually district headquarters or prominent venues).

WHO CAN ATTEND:
- Counting staff (government officials)
- Returning Officer and assistants
- Observer appointed by Election Commission
- Candidates or their counting agents
- Media representatives (designated area)

HOW EVM COUNTING WORKS:
1. EVMs brought from storage to counting center under security
2. Seals verified in presence of candidates/agents
3. Results Unit connected to Control Unit
4. Votes for each candidate displayed on screen
5. Results recorded in Form 20
6. Winner announced by Returning Officer

VVPAT VERIFICATION:
- Random sample of 5 VVPAT machines per assembly segment counted manually
- Physical count must match EVM count
- If mismatch found, VVPAT count is final

RESULT DECLARATION:
- Returning Officer announces winner
- Certificate of Election issued to winning candidate
- Results uploaded to ECI website in real-time`,
    steps: [
      "Counting day announced in advance",
      "EVMs transported to counting center under security",
      "Seals on EVMs verified by candidates/agents",
      "Votes tallied round by round",
      "VVPAT verification done for random sample",
      "Results recorded in Form 20",
      "Returning Officer announces winner",
      "Certificate of Election issued"
    ],
    officialLinks: [
      { label: "ECI Results", url: "https://results.eci.gov.in" },
      { label: "Election Results Archive", url: "https://eci.gov.in/statistical-report/statistical-reports/" }
    ]
  },
  {
    id: "model-code-of-conduct",
    title: "Model Code of Conduct",
    titleHindi: "आदर्श आचार संहिता",
    description: "Rules and restrictions that apply to political parties and governments during election period.",
    icon: "BookOpen",
    tags: ["MCC", "model code", "conduct", "rules", "restrictions", "election period"],
    content: `Model Code of Conduct (MCC) — Rules During Election Period:

WHAT IS MCC: A set of guidelines issued by the Election Commission of India that governs political parties, candidates, and the government during elections.

WHEN IT APPLIES: From date of election announcement until completion of election process.

RULES FOR POLITICAL PARTIES AND CANDIDATES:
- Cannot use places of worship for campaign
- Cannot bribe voters (cash, gifts, liquor)
- Cannot appeal to religion, caste, community for votes
- Must get permission for rallies and meetings
- Cannot play music after 10 PM
- Cannot put up hoardings without permission
- Cannot use government resources for campaigning

RULES FOR GOVERNMENT:
- Cannot announce new schemes/projects (nothing that could influence voters)
- Cannot use government vehicles for party work
- Ministers cannot combine official visits with campaigning
- Cannot transfer officials without EC permission
- Cannot make appointments to government posts

CITIZENS' ROLE:
- Report MCC violations to local Election Commission office
- Can file complaints on cVIGIL app (with photo/video evidence)
- 100-minute response time guaranteed for complaints

VIOLATIONS: Violations can result in removal of hoardings, FIR against candidates, and in serious cases, disqualification.`,
    steps: [
      "MCC comes into effect on election announcement day",
      "All parties must follow campaign spending limits",
      "No new government schemes during election period",
      "Permission required for rallies and gatherings",
      "Strict rules on use of government resources",
      "Citizens can report violations on cVIGIL app",
      "EC response guaranteed within 100 minutes",
      "MCC ends after election process is complete"
    ],
    officialLinks: [
      { label: "MCC Guidelines", url: "https://eci.gov.in/candidate-political-parties/model-code-of-conduct/" },
      { label: "cVIGIL App", url: "https://cvigil.eci.gov.in" }
    ]
  }
];

export const electionPhases = [
  {
    phase: 1,
    title: "Announcement & MCC",
    description: "Election Commission announces the schedule. Model Code of Conduct comes into effect immediately.",
    durationDays: 1,
    keyActivities: [
      "Election schedule announced",
      "Model Code of Conduct activated",
      "Dates for all phases published",
      "Government cannot announce new schemes"
    ]
  },
  {
    phase: 2,
    title: "Nomination Filing",
    description: "Candidates file nomination papers with the Returning Officer within the specified window.",
    durationDays: 7,
    keyActivities: [
      "Candidates file Form 2B (nomination)",
      "Affidavit with assets/criminal record submitted",
      "Nomination scrutiny by Returning Officer",
      "Candidates can withdraw nominations"
    ]
  },
  {
    phase: 3,
    title: "Campaign Period",
    description: "Parties and candidates actively campaign — rallies, door-to-door, media. Campaign spending tracked.",
    durationDays: 21,
    keyActivities: [
      "Public rallies and meetings",
      "Door-to-door campaigning",
      "Media advertising (regulated)",
      "Expenditure tracked by EC observers"
    ]
  },
  {
    phase: 4,
    title: "Silence Period",
    description: "All campaigning stops 48 hours before polling begins. No public gatherings, no media ads.",
    durationDays: 2,
    keyActivities: [
      "No public rallies or meetings",
      "No political advertisements in media",
      "Polling stations set up and tested",
      "EVMs transported to booths"
    ]
  },
  {
    phase: 5,
    title: "Polling Day",
    description: "Citizens cast their votes at polling booths from 7 AM to 6 PM using Electronic Voting Machines.",
    durationDays: 1,
    keyActivities: [
      "Booths open 7 AM to 6 PM",
      "Voters verify identity and cast votes",
      "EVMs sealed after polling",
      "Strong room storage under guard"
    ]
  },
  {
    phase: 6,
    title: "Vote Counting",
    description: "EVMs opened, votes tallied round by round. Results declared constituency by constituency.",
    durationDays: 1,
    keyActivities: [
      "EVMs transported to counting centers",
      "Seals verified by candidates/agents",
      "Votes counted round by round",
      "VVPAT verification of random sample",
      "Results declared, certificates issued"
    ]
  }
];

export const electionQuickStats = {
  totalVoters: "96.9 crore (969 million)",
  pollingStations: "10.5 lakh+",
  electionStaff: "1.5 crore+",
  states: 28,
  constituencies: 543,
  languages: 22
};
