(() => {
"use strict";

const API="https://brightbyte-kids-api.tanweerstudy25.workers.dev";
const TOKEN_KEY="brightbyte_student_token";
const $=id=>document.getElementById(id);
const qa=s=>[...document.querySelectorAll(s)];
const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));

let token=localStorage.getItem(TOKEN_KEY)||"";
let profile=null;
let state=null;
let activeWorld=null;
let globalMode="learn";
let workMode="learn";
let voiceOn=true;
let challenge={questions:[],index:0,score:0,answered:false};
let toastTimer=null;

const today=()=>new Date().toISOString().slice(0,10);
const nowLabel=()=>new Date().toLocaleDateString(undefined,{year:"numeric",month:"short",day:"numeric"});

const worlds=[
  {
    id:"hardware",icon:"🖥️",title:"Hardware Engineer Lab",accent:"#5ee0db",minClass:4,lab:"hardware",
    desc:"Explore ports, internal parts, storage, RAM, motherboard, power and safe computer assembly.",
    lessons:[
      ["Monitor Front & Back","Understand screen controls and identify Power, HDMI, VGA and DisplayPort.",4,"🔌","Ports"],
      ["System Unit Front & Back","Find USB, audio, network, display and power connections.",4,"🧰","Ports"],
      ["Keyboard & Mouse Anatomy","Learn important keys, clicks, scrolling and practical shortcuts.",4,"⌨️","Input"],
      ["UPS & Safe Power","Understand UPS input/output, battery backup and safe shutdown.",4,"🔋","Safety"],
      ["Storage: HDD, SATA SSD & M.2","Compare speed, shape, purpose and common connections.",5,"💾","Storage"],
      ["RAM Generations","Understand RAM purpose and DDR2, DDR3, DDR4 and DDR5 at a basic level.",5,"🧠","Memory"],
      ["Motherboard Map","Explore CPU socket, RAM slots, PCIe, SATA, M.2 and power connectors.",5,"🧩","Core"],
      ["CPU, Cooler & Thermal Concept","Learn what the processor does and why cooling matters.",5,"⚙️","Core"],
      ["SMPS / PSU Basics","Learn how the power supply feeds computer parts. Never open a PSU yourself.",5,"⚡","Safety"],
      ["Assemble & Disassemble Order","Practise a safe virtual build sequence and cable matching.",6,"🛠️","Practical"],
      ["Basic Hardware Troubleshooting","No power, no display, missing keyboard and missing storage checks.",6,"🔧","Solve"]
    ],
    questions:[
      [4,"Which port commonly carries digital video and audio to a monitor?",["HDMI","PS/2","RJ11","SATA power"],0,"HDMI commonly carries digital video and audio."],
      [4,"What should a UPS mainly provide during a short power cut?",["Battery backup","More RAM","Faster internet","More storage"],0,"A UPS gives temporary battery power so work can be saved and the PC can shut down safely."],
      [5,"Which component stores active working data temporarily?",["RAM","Monitor","Printer","Mouse"],0,"RAM holds data programs are actively using."],
      [5,"Where is an M.2 SSD commonly installed?",["On the motherboard","Inside the monitor glass","Inside the keyboard","In the mouse"],0,"An M.2 SSD fits into a compatible M.2 slot on the motherboard."],
      [6,"A PC powers on but the monitor says No Signal. What is a sensible first check?",["Display cable and input source","Delete Windows","Open the PSU","Format the drive"],0,"Check the display cable, monitor input and related connections first."],
      [6,"Which action is unsafe for a child learning PC hardware?",["Opening the PSU casing","Identifying RAM","Matching HDMI ports","Using a powered-off training PC"],0,"A PSU can retain dangerous electrical charge. It should not be opened by children."]
    ],
    projects:{4:["My Port Identification Guide","Create a simple guide showing at least six computer ports and what each connects to.",["Name the port","Explain its job","Give one device example","Add one safety note"]],5:["Inside My Computer Map","Create a labelled plan of a computer showing motherboard, RAM, CPU, storage, PSU and cooling.",["Label six parts","Explain each job","Compare SSD and HDD","Add a safe-handling rule"]],6:["Virtual PC Build & Fault Report","Plan a safe computer build, then write how you would check a No Power or No Display fault.",["Build order","Cable checklist","First-boot checks","Two troubleshooting paths"]]}
  },
  {
    id:"windows",icon:"🪟",title:"Windows & Software Lab",accent:"#5b8cff",minClass:4,lab:"windows",
    desc:"Master the desktop, files, folders, recycle bin, settings, sign out, restart, shutdown and safe software habits.",
    lessons:[
      ["Desktop, Start & Taskbar","Know the main parts of a Windows-style desktop.",4,"🪟","Desktop"],
      ["This PC & File Explorer","Understand drives, folders and file navigation.",4,"📁","Files"],
      ["Create, Rename, Copy & Move","Practise organising school files cleanly.",4,"🗂️","Files"],
      ["Recycle Bin & Restore","Learn delete versus permanent delete and how restore works.",4,"♻️","Files"],
      ["Wallpaper & Basic Settings","Change appearance and understand display, sound and Wi-Fi controls.",4,"🎨","Settings"],
      ["Lock, Sign Out, Restart & Shutdown","Use the correct action for different situations.",5,"⏻","System"],
      ["Task Manager Introduction","Understand apps, not responding and safe closing basics.",6,"📊","System"],
      ["Updates & Safe Installation","Why updates matter and why unknown software should not be installed.",6,"🛡️","Safety"]
    ],
    questions:[
      [4,"Where do deleted files usually go first in a normal Windows setup?",["Recycle Bin","BIOS","RAM slot","Router"],0,"The Recycle Bin temporarily holds many deleted files."],
      [4,"Which tool is mainly used to browse files and folders?",["File Explorer","Calculator","Paint brush","Volume slider"],0,"File Explorer is used to browse and organise files and folders."],
      [5,"You want another person to use the same PC without closing Windows completely. Which action is appropriate?",["Sign out","Break the power cable","Format the drive","Open the PSU"],0,"Sign out ends your session while leaving the PC ready for another user."],
      [6,"An app is frozen. What is a reasonable step before forcing a hard power-off?",["Wait briefly and try Task Manager","Delete System32","Remove the SSD while powered on","Hit random keys"],0,"Waiting and using Task Manager is a safer troubleshooting step."]
    ],
    projects:{4:["My Clean Desktop Plan","Design a simple folder structure for School, Photos and Projects.",["Create folder names","Choose where files belong","Explain Recycle Bin","Pick a wallpaper theme"]],5:["Windows Daily Skills Checklist","Write a checklist for starting work, organising files, locking the PC and shutting down correctly.",["Start-up","File organisation","Lock or sign out","Shutdown"]],6:["Help Desk Mini Guide","Create a beginner guide for a frozen app, missing file, wrong wallpaper and low sound problem.",["Four problems","Safe first check","Correct tool","Clear explanation"]]}
  },
  {
    id:"productivity",icon:"📄",title:"Productivity Studio",accent:"#48c9a9",minClass:4,
    desc:"Create documents, presentations and spreadsheets that look organised, useful and professional.",
    lessons:[
      ["Document Basics","Headings, paragraphs, bold, italic, alignment and bullets.",4,"📝","Document"],
      ["Tables & Images","Insert simple tables and images for clearer work.",4,"🖼️","Document"],
      ["Presentation Basics","Create a title slide and clear bullet-point slides.",4,"📽️","Slides"],
      ["Good Slide Design","Use readable text, spacing and relevant visuals.",5,"✨","Slides"],
      ["Spreadsheet Cells","Understand rows, columns, cells and simple data entry.",5,"📊","Sheet"],
      ["SUM & Average Concept","Use simple totals and understand average at an age-appropriate level.",5,"➕","Sheet"],
      ["Charts from Data","Turn a small table into a useful chart.",6,"📈","Data"],
      ["Combine Tools","Use document + spreadsheet + presentation for one school project.",6,"🗃️","Project"]
    ],
    questions:[
      [4,"Which is best for showing a talk to a class with slides?",["Presentation software","Recycle Bin","BIOS","Device Manager only"],0,"Presentation software is designed for slide-based talks."],
      [5,"In a spreadsheet, where a row and column meet is called a...",["Cell","Folder","Pixel cable","Shortcut key"],0,"A spreadsheet box is called a cell."],
      [6,"Why might a chart be useful?",["It helps patterns in data become easier to see","It increases RAM","It charges a UPS","It replaces passwords"],0,"Charts help people see patterns and comparisons in data."]
    ],
    projects:{4:["My One-Page School Poster","Create a structured page with title, short text, bullets and one image idea.",["Title","Short paragraph","3 bullets","Image idea"]],5:["Five-Slide Learning Presentation","Plan five slides about a topic you know well.",["Title","Three content slides","Final summary","Readable design"]],6:["School Technology Report","Plan a document, a spreadsheet table, one chart and a short presentation.",["Document section","Data table","Chart","Presentation summary"]]}
  },
  {
    id:"typing",icon:"⌨️",title:"Typing & Shortcut Arena",accent:"#f2b84b",minClass:4,lab:"keyboard",
    desc:"Build accurate typing habits and understand the keyboard keys and shortcuts used in real work.",
    lessons:[
      ["Keyboard Zones","Letters, numbers, function keys, arrows and control keys.",4,"⌨️","Keys"],
      ["Shift & Caps Lock","Understand temporary and continuous capital letters.",4,"⬆️","Keys"],
      ["Enter, Backspace & Delete","Learn exactly how editing keys behave.",4,"↩️","Keys"],
      ["Ctrl, Alt & Windows Key","Understand modifier keys and why combinations matter.",5,"🎛️","Keys"],
      ["Copy, Cut, Paste & Undo","Ctrl+C, Ctrl+X, Ctrl+V and Ctrl+Z.",5,"📋","Shortcut"],
      ["Switch, Lock & Task Manager","Alt+Tab, Windows+L and Ctrl+Shift+Esc concepts.",6,"⚡","Shortcut"],
      ["Accuracy Before Speed","Build clean typing habits before racing for WPM.",4,"🎯","Habit"]
    ],
    questions:[
      [4,"Which key usually starts a new line or confirms an entry?",["Enter","Caps Lock","Alt","Esc only"],0,"Enter is commonly used to start a new line or confirm an action."],
      [5,"What does Ctrl+V usually do?",["Paste","Copy","Cut","Lock"],0,"Ctrl+V usually pastes copied or cut content."],
      [6,"Which shortcut commonly opens Task Manager directly on Windows?",["Ctrl+Shift+Esc","Ctrl+C","Alt+F1","Shift+Space"],0,"Ctrl+Shift+Esc commonly opens Task Manager directly."]
    ],
    projects:{4:["Keyboard Key Guide","Explain ten important keys in your own words.",["10 keys","One example each","Capital-letter example","Editing-key example"]],5:["Shortcut Cheat Sheet","Make a useful list of at least eight shortcuts.",["Copy/paste","Undo","Select all","Window switching"]],6:["Productivity Shortcut Mission","Write a mini workflow that uses shortcuts to organise and edit a school document.",["At least 6 shortcuts","Correct order","Explain why","Include lock or app switching"]]}
  },
  {
    id:"coding",icon:"👨‍💻",title:"Coding & Computational Thinking",accent:"#8e6cff",minClass:4,lab:"coding",
    desc:"Think in steps, spot patterns, use loops and conditions, debug mistakes and create simple digital logic.",
    lessons:[
      ["Sequence & Instructions","Put actions in the correct order so a computer can follow them.",4,"➡️","Logic"],
      ["Patterns & Repetition","Recognise when repeated actions can become a loop.",4,"🔁","Logic"],
      ["Events & Conditions","Use ideas like when clicked and if this happens.",5,"🔀","Logic"],
      ["Variables","Store a score, name or changing number.",5,"📦","Logic"],
      ["Debugging","Find the wrong step and fix it instead of starting over.",5,"🐞","Solve"],
      ["Build a Mini Game Logic","Combine sequence, loop, condition and score ideas.",6,"🎮","Create"],
      ["Text Code Preview","See how simple block ideas can look in beginner-friendly text code.",6,"</>","Preview"]
    ],
    questions:[
      [4,"What is an ordered set of steps for solving a task called?",["Algorithm","Wallpaper","Port","Password"],0,"An algorithm is a set of ordered steps."],
      [5,"What is a loop useful for?",["Repeating actions","Changing monitor colour only","Charging a mouse","Deleting all files"],0,"A loop repeats instructions efficiently."],
      [6,"What does debugging mean?",["Finding and fixing errors","Adding more bugs","Printing a document","Changing a password only"],0,"Debugging means finding and fixing errors in a program or process."]
    ],
    projects:{4:["Robot Path Algorithm","Write step-by-step instructions to guide a robot through a simple room.",["Clear start","Ordered steps","No missing action","Test the route"]],5:["Score Game Logic","Plan a game using an event, condition, variable and loop.",["Event","Condition","Score variable","Loop"]],6:["Mini Quiz Game Design","Plan a simple quiz game with questions, score and feedback.",["Question flow","Score logic","Correct/wrong feedback","End screen"]]}
  },
  {
    id:"ai",icon:"🤖",title:"AI & Smart Technology",accent:"#ff69b6",minClass:4,
    desc:"Use AI as a learning tool while protecting privacy, checking answers and understanding that AI can be wrong.",
    lessons:[
      ["What AI Is and Is Not","Understand AI as a tool that finds patterns and generates outputs.",4,"🤖","AI"],
      ["Better Prompts","Give clear role, task, context and format instructions.",4,"✨","Prompt"],
      ["Protect Personal Information","Never put passwords, OTPs, home address or private data into unknown tools.",4,"🔐","Safety"],
      ["AI Can Make Mistakes","Learn why an answer should be checked instead of blindly trusted.",5,"⚠️","Verify"],
      ["Image & Deepfake Awareness","Understand that realistic media can be generated or changed.",5,"🖼️","Media"],
      ["Bias & Fairness Basics","Learn that data and examples can influence AI outputs.",6,"⚖️","Ethics"],
      ["Human Judgment Matters","Use AI to support thinking, not replace responsibility.",6,"🧠","Ethics"]
    ],
    questions:[
      [4,"Which information should you NOT paste into an AI tool?",["Your password or OTP","A public science question","A made-up story idea","A spelling exercise"],0,"Passwords and OTPs are private and should never be shared."],
      [5,"An AI gives a surprising historical fact. What should you do?",["Check reliable sources","Believe it immediately","Share it everywhere","Hide the source"],0,"Important claims should be checked with reliable sources."],
      [6,"Why is human judgment still important when using AI?",["AI can be wrong or incomplete","Humans cannot read","AI always knows private facts","Computers never make errors"],0,"AI outputs can be wrong, biased or incomplete, so people must think and verify."]
    ],
    projects:{4:["My Safe AI Prompt","Write a clear prompt for learning a school topic without sharing private data.",["Clear task","Useful context","Output format","No private information"]],5:["AI Fact-Check Plan","Create a checklist for checking an AI answer.",["Identify claim","Check 2 sources","Compare evidence","Write conclusion"]],6:["Responsible AI Project","Plan how AI could help with a school project while keeping human checking and privacy.",["Purpose","Privacy rule","Verification step","Human final decision"]]}
  },
  {
    id:"research",icon:"🔎",title:"Research & Media Detective",accent:"#4fc3ff",minClass:4,lab:"research",
    desc:"Search smarter, compare sources, spot ads and clickbait, separate fact from opinion and build evidence-based answers.",
    lessons:[
      ["Smart Search Keywords","Use short, specific search terms instead of full confusing sentences.",4,"🔍","Search"],
      ["Source, Author & Date","Check who published information and when.",4,"🗓️","Source"],
      ["Fact vs Opinion","Separate checkable claims from personal views.",4,"💬","Media"],
      ["Ads & Sponsored Results","Understand that paid placement is not the same as best evidence.",5,"📢","Media"],
      ["Compare Multiple Sources","Do not depend on one page for an important claim.",5,"🧭","Verify"],
      ["Clickbait & Misleading Media","Recognise emotional headlines and edited or incomplete content.",6,"🕵️","Verify"],
      ["Basic Citation Habit","Record the source of information, images and ideas.",6,"🔗","Research"]
    ],
    questions:[
      [4,"Which search is more useful for a school project?",["water cycle stages for class 5","tell me everything","stuff","website"],0,"Specific keywords usually produce more focused results."],
      [5,"A result says Sponsored. What does that mean?",["Someone paid for placement","It must be the most accurate","It is always government information","It cannot contain ads"],0,"Sponsored results are paid placements and still need evaluation."],
      [6,"Two reliable sources disagree. What should you do?",["Read the evidence and look for more reliable context","Pick the prettier website","Choose the first result","Stop checking"],0,"Compare evidence, dates and additional reliable sources before concluding."]
    ],
    projects:{4:["Search Like a Detective","Plan good keywords for three school questions and explain why they are specific.",["3 questions","Search keywords","Source check","Fact vs opinion"]],5:["Two-Source Comparison","Compare two sources on one topic using author, date, evidence and purpose.",["Source A","Source B","Evidence","Conclusion"]],6:["Mini Research Report","Write a short evidence-based answer and list the sources you would use.",["Question","Key evidence","Source list","Own conclusion"]]}
  },
  {
    id:"cyber",icon:"🛡️",title:"Cyber Hero Academy",accent:"#46df99",minClass:4,lab:"cyber",
    desc:"Learn strong passwords, phishing awareness, privacy, app permissions, online behaviour and scam-resistant thinking.",
    lessons:[
      ["Passwords & Passphrases","Use long, unique secrets and keep them private.",4,"🔑","Safety"],
      ["OTP & Verification Codes","Never share one-time codes with strangers.",4,"📲","Safety"],
      ["Phishing & Fake Login Pages","Pause before entering passwords through links.",5,"🎣","Scam"],
      ["Unknown Downloads & QR Codes","Ask a trusted adult before opening suspicious files or codes.",5,"📥","Scam"],
      ["App Permissions","Understand camera, microphone, contacts and location permissions.",5,"⚙️","Privacy"],
      ["Digital Footprint","Online actions can be copied, saved and shared.",6,"👣","Privacy"],
      ["Cyberbullying & Reporting","Do not fight alone; block, save evidence and tell a trusted adult.",6,"🤝","Wellbeing"]
    ],
    questions:[
      [4,"A caller asks for an OTP to 'verify' your account. What should you do?",["Do not share it and tell a trusted adult","Read it aloud","Post it in chat","Send a screenshot"],0,"OTPs are private security codes."],
      [5,"A message says 'You won a phone! Click NOW!' What is a safe response?",["Pause, do not click, and verify with a trusted adult","Click quickly","Enter your password","Forward to everyone"],0,"Urgent prize messages are common scam patterns."],
      [6,"Someone is bullying you in an online game. What is a good action?",["Block/report and tell a trusted adult","Share your address","Meet them alone","Reply with threats"],0,"Blocking, reporting and asking a trusted adult for help are safer actions."]
    ],
    projects:{4:["Cyber Safety Poster","Create five simple rules for passwords, OTPs and strangers online.",["5 rules","Password rule","OTP rule","Trusted adult rule"]],5:["Phishing Detective Guide","Design a checklist for suspicious messages and fake login pages.",["Urgency clue","Link check","Password rule","Report step"]],6:["My Digital Safety Plan","Create a personal plan for privacy, permissions, cyberbullying and digital footprint.",["Privacy","Permissions","Reporting","Footprint"]]}
  },
  {
    id:"data",icon:"📊",title:"Data Detective Lab",accent:"#f58b52",minClass:4,lab:"data",
    desc:"Read tables, run small surveys, make charts and explain what data shows without exaggerating.",
    lessons:[
      ["Read a Table","Find values using rows and columns.",4,"📋","Data"],
      ["Bar Charts","Compare categories visually.",4,"📊","Chart"],
      ["Plan a Survey","Ask one clear question and collect answers consistently.",5,"📝","Survey"],
      ["Pie Chart Concept","Understand parts of a whole.",5,"🥧","Chart"],
      ["Average Concept","Understand a simple mean as total divided by count.",6,"➗","Math"],
      ["Explain a Result","Write what data shows and what it does not prove.",6,"🧠","Reasoning"]
    ],
    questions:[
      [4,"Which chart is often useful for comparing categories?",["Bar chart","Password box","Folder tree","Power cable"],0,"Bar charts are useful for category comparisons."],
      [5,"A good survey question should be...",["Clear and focused","Confusing and leading","Secretly change each time","Impossible to answer"],0,"Clear, consistent questions improve survey quality."],
      [6,"A class survey has 10 answers. Can it automatically prove what every child in the world likes?",["No","Yes, always","Only if the chart is colourful","Only on Friday"],0,"A small survey describes its sample, not everyone in the world."]
    ],
    projects:{4:["My Favourite Fruit Chart","Plan a five-category bar chart from a small sample table.",["5 categories","Values","Chart title","One observation"]],5:["Class Survey Project","Create one fair question, collect example results and choose a chart.",["Question","Data table","Chart choice","Conclusion"]],6:["Data Story","Use a small dataset to calculate a total, simple average and write two careful conclusions.",["Total","Average","Chart","Two conclusions"]]}
  },
  {
    id:"science",icon:"🔬",title:"Science & Maker Lab",accent:"#7ed957",minClass:4,
    desc:"Connect technology with circuits, magnets, energy, simple machines and the design-test-improve cycle.",
    lessons:[
      ["Simple Circuits","Battery, wire, switch and lamp concepts.",4,"💡","Science"],
      ["Magnets","Poles, attraction, repulsion and common uses.",4,"🧲","Science"],
      ["Simple Machines","Levers, pulleys and gears make work easier in different ways.",5,"⚙️","Engineering"],
      ["Energy & Electricity Safety","Understand energy use and basic electrical safety.",5,"⚡","Safety"],
      ["Design → Test → Improve","Engineering improves through testing and revision.",5,"🛠️","Design"],
      ["Build a Prototype Plan","Create a simple model, test criteria and improvement note.",6,"🏗️","Create"]
    ],
    questions:[
      [4,"What is needed for a simple closed circuit?",["A complete path for current","A wallpaper","A password","A mouse pad"],0,"A closed circuit needs a complete conducting path."],
      [5,"Why do engineers test prototypes?",["To find problems and improve the design","To make it heavier only","To avoid learning","To erase all plans"],0,"Testing helps identify what works and what needs improvement."],
      [6,"A bridge model bends too much. What should you do next?",["Study the weak point and improve the design","Pretend it worked","Delete the test result","Add random decorations only"],0,"Engineering uses evidence from tests to improve designs."]
    ],
    projects:{4:["Safe Circuit Diagram","Draw or describe a battery-switch-lamp circuit and explain open vs closed.",["Battery","Switch","Lamp","Open/closed explanation"]],5:["Simple Machine Hunt","Find examples of lever, pulley or gear systems in daily life.",["3 examples","Machine type","Job","Why useful"]],6:["Prototype Improvement Report","Plan a model, test it against criteria and describe one improvement.",["Goal","Criteria","Test","Improvement"]]}
  },
  {
    id:"gk",icon:"🌍",title:"GK & Global Explorer",accent:"#3bc1e8",minClass:4,
    desc:"Explore India, the world, geography, space, science, inventions, cultures and age-appropriate current knowledge.",
    lessons:[
      ["India Explorer","States, capitals, rivers, monuments, cultures and geography.",4,"🇮🇳","India"],
      ["Continents & Oceans","Build a clear mental map of the world.",4,"🗺️","World"],
      ["Countries, Capitals & Currencies","Connect places with basic civic and economic facts.",4,"🌐","World"],
      ["Space Explorer","Planets, Moon, Sun, satellites and rockets.",5,"🚀","Space"],
      ["Great Inventions","Match inventions with problems they helped solve.",5,"💡","History"],
      ["Culture & Intercultural Respect","Learn differences without stereotypes.",5,"🤝","Culture"],
      ["Current Knowledge Habit","Read age-appropriate news and identify date, place and main fact.",6,"📰","Current"]
    ],
    questions:[
      [4,"How many continents are commonly taught in the seven-continent model?",["7","3","11","20"],0,"The common school model uses seven continents."],
      [5,"Why do satellites orbit Earth?",["They move under gravity while travelling forward","They sit on clouds","They use roads","They are attached to towers"],0,"Orbit results from forward motion together with gravity."],
      [6,"When reading current affairs, why should you check the date?",["Information can change over time","Dates are decorative","Old information is always wrong","It makes the page faster"],0,"Dates help you understand whether information is current and relevant."]
    ],
    projects:{4:["Country of the Week","Create a profile of one country with map location, capital, currency, language and landmark.",["Map","Capital","Currency","Culture fact"]],5:["Space Fact File","Create a fact file comparing three Solar System objects.",["3 objects","Size/position idea","Interesting fact","Source plan"]],6:["Weekly Knowledge Brief","Write a short factual brief about three age-appropriate developments and note their dates and places.",["3 items","Dates","Places","Main facts"]]}
  },
  {
    id:"english",icon:"🗣️",title:"English & Communication Studio",accent:"#ff8a70",minClass:4,
    desc:"Speak clearly, listen well, explain ideas, write useful messages and build presentation confidence.",
    lessons:[
      ["Clear Self Introduction","Name, class, interests and one goal.",4,"🙋","Speaking"],
      ["Picture & Object Description","Use complete sentences and useful adjectives.",4,"🖼️","Speaking"],
      ["Ask & Answer Questions","Use polite question forms and active listening.",4,"❓","Conversation"],
      ["Telephone Etiquette","Introduce yourself, speak clearly and end politely.",5,"☎️","Communication"],
      ["Email Basics","Subject, greeting, clear message and closing.",5,"📧","Writing"],
      ["Explain How Something Works","Give steps in a logical order.",5,"🧩","Explain"],
      ["2–3 Minute Presentation","Open, explain, use examples and close confidently.",6,"🎤","Present"],
      ["Respectful Disagreement","Give reasons without insulting other people.",6,"🤝","Social"]
    ],
    questions:[
      [4,"Which is a polite way to ask for clarification?",["Could you please explain that again?","You are wrong!","Whatever.","Be quiet."],0,"Polite clarification keeps communication respectful."],
      [5,"What should an email subject do?",["Briefly show what the message is about","Contain your password","Be completely unrelated","Always be blank"],0,"A clear subject helps the reader understand the purpose."],
      [6,"A good short presentation usually has...",["A clear opening, main points and closing","Only one very long sentence","No purpose","Only copied text"],0,"A simple structure helps the audience follow your ideas."]
    ],
    projects:{4:["60-Second Introduction","Write a short self-introduction you could speak clearly.",["Greeting","About me","Interest","Goal"]],5:["Helpful Email","Draft a polite email asking a teacher for clarification about an assignment.",["Subject","Greeting","Clear question","Closing"]],6:["Three-Minute Tech Talk","Plan a short talk explaining one computer part or digital safety topic.",["Opening","3 main points","Example","Closing"]]}
  },
  {
    id:"money",icon:"💰",title:"Money & Entrepreneurship Lab",accent:"#ffd05c",minClass:4,
    desc:"Understand needs, wants, saving, budgets, price comparison, digital-payment safety and simple business thinking.",
    lessons:[
      ["Needs vs Wants","Separate essentials from optional choices.",4,"🛒","Money"],
      ["Saving for a Goal","Plan how small amounts can build toward a goal.",4,"🐷","Saving"],
      ["Simple Budget","Money in, planned spending and money left.",5,"🧾","Budget"],
      ["Compare Prices","Look at price, quantity, quality and need before buying.",5,"🏷️","Decision"],
      ["Digital Payment Safety","Protect PINs, OTPs and payment confirmations.",5,"📱","Safety"],
      ["Cost & Simple Profit Concept","Understand that selling price and costs affect what remains.",6,"🏪","Business"],
      ["Mini Business Idea","Problem, customer, product/service, cost and communication.",6,"💡","Create"]
    ],
    questions:[
      [4,"Which is usually a need rather than a want?",["Basic food","A fifth game skin","A decorative gadget","Extra stickers"],0,"Basic food is a need; optional entertainment items are wants."],
      [5,"What is a budget?",["A plan for money","A password","A computer port","A type of keyboard"],0,"A budget is a plan for income, saving and spending."],
      [6,"A shop sells something for 100 and it cost 70 to make. Before other expenses, what is the simple difference?",["30","170","70","0"],0,"100 minus 70 gives a simple difference of 30 before other costs."]
    ],
    projects:{4:["My Saving Goal","Choose an imaginary goal and make a simple weekly saving plan.",["Goal","Cost","Weekly saving","Time needed"]],5:["Pocket Money Budget","Plan an imaginary monthly budget using needs, saving and optional spending.",["Total money","Saving","Needs","Wants"]],6:["Mini Business Challenge","Plan a small imaginary school-friendly business or service.",["Problem solved","Customer","Cost","Price and communication"]]}
  },
  {
    id:"logic",icon:"🧠",title:"Brain & Logic Arena",accent:"#b782ff",minClass:4,
    desc:"Strengthen patterns, sequences, classification, memory, planning and step-by-step troubleshooting.",
    lessons:[
      ["Patterns & Sequences","Spot what changes and predict the next step.",4,"🔢","Reasoning"],
      ["Classification","Group items using a clear rule.",4,"🗃️","Reasoning"],
      ["Cause & Effect","Connect an action with likely results.",5,"➡️","Reasoning"],
      ["Elimination Strategy","Remove impossible options to narrow a problem.",5,"🎯","Strategy"],
      ["Troubleshooting Order","Start with simple, safe checks before complex ones.",5,"🔧","Solve"],
      ["Multi-Step Planning","Break a larger task into smaller goals.",6,"🗺️","Plan"]
    ],
    questions:[
      [4,"What comes next: 2, 4, 6, 8, ?",["10","9","12","20"],0,"The pattern adds 2 each time."],
      [5,"A lamp will not turn on. Which is a sensible first check?",["Power and switch","Break the lamp","Change the wallpaper","Reset a router"],0,"Simple, safe checks come first."],
      [6,"A big project feels difficult. What is a strong strategy?",["Break it into smaller tasks","Ignore all instructions","Do everything randomly","Skip testing"],0,"Breaking a large task into smaller tasks makes planning easier."]
    ],
    projects:{4:["Pattern Puzzle Pack","Create three number or shape patterns and provide answers.",["3 patterns","Clear rule","Answers","One tricky pattern"]],5:["Troubleshooting Flowchart","Create a simple if/then flow for a device that will not work.",["Symptom","First check","Second check","Safe stop point"]],6:["Project Planner","Break one larger school project into milestones, tasks and checks.",["Goal","Milestones","Tasks","Review step"]]}
  },
  {
    id:"creator",icon:"🎨",title:"Creator Studio",accent:"#ff70d2",minClass:4,
    desc:"Turn ideas into posters, infographics, stories, presentations, simple animations and digital designs.",
    lessons:[
      ["Visual Hierarchy","Make the most important information easiest to notice.",4,"👀","Design"],
      ["Colour & Contrast","Use readable colour combinations and avoid clutter.",4,"🎨","Design"],
      ["Poster & Card Design","Combine title, image, short text and spacing.",4,"🖼️","Create"],
      ["Infographic Basics","Turn facts into organised visual sections.",5,"📊","Create"],
      ["Storyboarding","Plan scenes before making a video or animation.",5,"🎬","Plan"],
      ["Simple Animation Thinking","Use frames, timing and sequence.",6,"✨","Create"],
      ["Copyright & Credit Basics","Respect other creators and note sources.",6,"©️","Ethics"]
    ],
    questions:[
      [4,"Why is contrast important in a poster?",["It can make text easier to read","It adds RAM","It changes Wi-Fi speed","It stores files"],0,"Good contrast improves readability."],
      [5,"What is a storyboard?",["A plan of scenes before creating media","A password list","A motherboard","A spreadsheet formula"],0,"A storyboard helps plan scenes and sequence."],
      [6,"If you use someone else's image in a school project, a good habit is to...",["Follow permission rules and credit the source","Claim you made it","Remove the creator name to hide it","Share it as your password"],0,"Respecting permissions and crediting sources is a good digital-creation habit."]
    ],
    projects:{4:["Digital Safety Poster","Plan a clean, colourful poster with one main message and five short tips.",["Headline","5 tips","Visual idea","Readable layout"]],5:["Mini Infographic","Turn five facts into a one-page infographic plan.",["Title","5 facts","Icons/visuals","Source note"]],6:["Storyboard a 60-Second Video","Create six scenes for a short educational video.",["6 scenes","Voice/message","Visual plan","Credits"]]}
  },
  {
    id:"career",icon:"🧑‍🚀",title:"Career Discovery City",accent:"#42d8c8",minClass:4,
    desc:"Explore what different professionals do, what tools they use and which skills they practise — without forcing an early career choice.",
    lessons:[
      ["Technology Careers","Software, IT support, network, cybersecurity, data and design roles.",4,"💻","Career"],
      ["Science & Health Careers","Scientists, doctors, lab professionals and researchers.",4,"🔬","Career"],
      ["Design & Creative Careers","Graphic, product, architecture and media roles.",5,"🎨","Career"],
      ["Business & Entrepreneurship","How people identify needs and create useful services.",5,"🏪","Career"],
      ["Strengths & Interests","Notice activities you enjoy and skills you want to practise.",5,"🌟","Self"],
      ["Career Mini Mission","Try a small task from a profession and reflect on what you learned.",6,"🎯","Explore"]
    ],
    questions:[
      [4,"What does an IT support technician often do?",["Help users solve technology problems","Only paint walls","Fly every airplane","Grow every crop"],0,"IT support helps people use and troubleshoot technology."],
      [5,"Why explore many careers before choosing one?",["To learn about different skills and possibilities","Because one job is always perfect","To avoid learning","To copy a friend's choice"],0,"Exploration helps students understand interests and options over time."],
      [6,"What is a useful career habit at this age?",["Build broad skills and curiosity","Lock into one job forever","Ignore school subjects","Choose only by salary"],0,"Class 4–6 is a good time to build broad skills and explore interests."]
    ],
    projects:{4:["A Day in a Career","Choose one profession and describe three tasks and three tools.",["Career","3 tasks","3 tools","One skill"]],5:["My Skills Explorer","List skills you enjoy practising and match them to several career areas.",["5 skills","3 career areas","Why they connect","One skill to improve"]],6:["Career Mini Mission Reflection","Complete an imaginary professional task and reflect on what was easy, hard and interesting.",["Task","Tools","Challenge","Reflection"]]}
  },
  {
    id:"leadership",icon:"🤝",title:"Life, Leadership & Wellbeing",accent:"#70d98f",minClass:4,
    desc:"Build teamwork, time management, healthy digital habits, respectful communication and responsible decision-making.",
    lessons:[
      ["Plan My Time","Balance school, play, rest and screen activities.",4,"⏰","Life"],
      ["Teamwork","Share roles, listen and help a group finish a task.",4,"👥","Social"],
      ["Healthy Screen Habits","Posture, eye breaks, movement and sleep routines.",4,"🌱","Health"],
      ["Goal Setting","Choose a realistic goal and break it into steps.",5,"🎯","Life"],
      ["Respectful Disagreement","Focus on ideas, reasons and listening.",5,"💬","Social"],
      ["Leadership Means Responsibility","Leaders organise, listen, support and take responsibility.",6,"🧭","Leadership"],
      ["Ask for Help","Know when a trusted adult, teacher or specialist should help.",4,"🙋","Safety"]
    ],
    questions:[
      [4,"A healthy computer habit is to...",["Take regular breaks and use good posture","Use screens all night","Sit in one position for hours","Ignore eye strain"],0,"Breaks, posture and movement support healthier screen use."],
      [5,"A teammate has a different idea. What is a good response?",["Listen and discuss reasons","Insult them","Delete their work","Refuse to speak"],0,"Respectful discussion helps teams make better decisions."],
      [6,"A good leader mainly...",["Helps the team organise and succeed","Controls everyone without listening","Takes all credit","Avoids responsibility"],0,"Leadership includes responsibility, organisation, listening and support."]
    ],
    projects:{4:["My Balanced Day","Plan a realistic school day with learning, play, breaks and sleep.",["Study","Movement","Screen breaks","Sleep"]],5:["Team Project Roles","Plan how four team members could share a project fairly.",["4 roles","Responsibilities","Communication","Review"]],6:["Leadership Scenario","Write how you would lead a small group when two members disagree.",["Listen","Clarify goal","Fair decision process","Follow-up"]]}
  }
];

function worldById(id){return worlds.find(w=>w.id===id)}
function accessibleLessons(w){return w.lessons.filter(x=>Number(x[2])<=Number(profile?.class_number||4))}
function accessibleQuestions(w){return w.questions.filter(x=>Number(x[0])<=Number(profile?.class_number||4))}
function projectFor(w){const c=Number(profile?.class_number||4);return w.projects[c]||w.projects[6]||Object.values(w.projects)[0]}
function keyForStudent(){return `tannu_advanced_v22_${profile?.user_id||profile?.username||"student"}`}
function freshState(){return {xp:0,completedLessons:[],challengeWins:{},projects:[],streak:1,lastVisit:today(),daily:{},mode:"learn"}}
function normalizeState(x){const b=freshState();if(!x||typeof x!=="object")return b;return {...b,...x,completedLessons:Array.isArray(x.completedLessons)?x.completedLessons:[],challengeWins:x.challengeWins&&typeof x.challengeWins==="object"?x.challengeWins:{},projects:Array.isArray(x.projects)?x.projects:[],daily:x.daily&&typeof x.daily==="object"?x.daily:{}}}
function loadState(){try{state=normalizeState(JSON.parse(localStorage.getItem(keyForStudent())||"null"))}catch{state=freshState()}updateStreak();globalMode=state.mode||"learn"}
function saveState(){if(!state)return;state.mode=globalMode;localStorage.setItem(keyForStudent(),JSON.stringify(state));renderStats();renderDailyMissions()}
function updateStreak(){const t=today();if(state.lastVisit===t)return;const prev=new Date();prev.setDate(prev.getDate()-1);const prevKey=prev.toISOString().slice(0,10);state.streak=state.lastVisit===prevKey?Math.max(1,Number(state.streak||1)+1):1;state.lastVisit=t}
function dailyState(){const t=today();state.daily[t]=state.daily[t]||{learn:false,challenge:false,create:false};return state.daily[t]}
function addXP(n,msg){state.xp=Math.max(0,Number(state.xp||0)+n);saveState();if(msg)toast(`⭐ +${n} XP • ${msg}`)}
function toast(t){const el=$("toast");el.textContent=t;el.classList.add("show");clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove("show"),1800)}

function speak(text){if(!voiceOn||!("speechSynthesis" in window))return;speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(String(text));u.lang="en-US";u.rate=.88;u.pitch=1.03;const vs=speechSynthesis.getVoices();u.voice=vs.find(v=>/en-(US|GB)/i.test(v.lang))||vs.find(v=>/en/i.test(v.lang))||null;speechSynthesis.speak(u)}

async function api(path,opt={}){const h={...(opt.headers||{}),Authorization:`Bearer ${token}`};if(opt.body&&!h["Content-Type"])h["Content-Type"]="application/json";return fetch(API+path,{...opt,headers:h,cache:"no-store"})}
async function loadProfile(){if(!token){location.href="student-login.html";return false}try{const r=await api("/api/auth/me"),d=await r.json();if(!r.ok||d.role!=="student"||!d.profile)throw new Error("Invalid student session");profile=d.profile;const c=Number(profile.class_number||1);if(c<4||c>6){location.href="student-profile.html";return false}$("studentChip").textContent=`👤 ${profile.display_name||profile.username||"Student"}`;$("classChip").textContent=`🎓 Class ${c}`;$("heroTitle").textContent=c===4?"Explore. Understand. Build.":c===5?"Apply. Compare. Create.":"Create. Solve. Explain.";loadState();return true}catch{localStorage.removeItem(TOKEN_KEY);location.href="student-login.html";return false}}

function renderStats(){if(!state)return;$("xpCount").textContent=Number(state.xp||0);$("skillCount").textContent=state.completedLessons.length;$("streakCount").textContent=Math.max(1,Number(state.streak||1));$("projectCount").textContent=state.projects.length}
function renderModes(){qa(".mode-btn").forEach(b=>b.classList.toggle("active",b.dataset.mode===globalMode))}
function renderDailyMissions(){if(!state)return;const d=dailyState();const missions=[
  ["📘","Learn","Complete one lesson",d.learn,"learn"],
  ["🎯","Challenge","Finish one world challenge",d.challenge,"challenge"],
  ["🛠️","Create","Save one project to portfolio",d.create,"create"]
];$("dailyMissions").innerHTML=missions.map(m=>`<button class="daily-mission ${m[3]?"done":""}" data-daily-mode="${m[4]}" type="button"><span>${m[0]}</span><b>${m[3]?"✅ ":""}${m[1]}</b><small>${m[2]}</small></button>`).join("");qa("[data-daily-mode]").forEach(b=>b.onclick=()=>{globalMode=b.dataset.dailyMode;renderModes();const first=worlds.find(w=>Number(w.minClass)<=Number(profile.class_number));openWorld(first.id,globalMode)})}
function worldProgress(w){const ls=accessibleLessons(w);if(!ls.length)return 0;const done=ls.filter((_,i)=>state.completedLessons.includes(`${w.id}:${i}`)).length;return Math.round(done/ls.length*100)}
function renderWorlds(){const c=Number(profile.class_number);$("worldGrid").innerHTML=worlds.map(w=>{const locked=c<Number(w.minClass);return `<article class="world-card ${locked?"locked":""}" data-world="${w.id}" style="--accent:${w.accent}"><div class="world-icon">${w.icon}</div><h3>${esc(w.title)}</h3><p>${esc(w.desc)}</p><div class="world-meta"><span class="world-level">${locked?`🔒 CLASS ${w.minClass}+`:`CLASS ${c}`}</span><span class="world-progress">${locked?"Locked":worldProgress(w)+"%"}</span></div></article>`}).join("");qa("[data-world]").forEach(card=>card.onclick=()=>{const w=worldById(card.dataset.world);if(Number(profile.class_number)<Number(w.minClass))return toast(`Unlocks in Class ${w.minClass}`);openWorld(w.id,globalMode)})}

function openWorld(id,mode=globalMode){activeWorld=worldById(id);if(!activeWorld)return;$("worldGrid").classList.add("hidden");$("workspace").classList.remove("hidden");$("workspaceEyebrow").textContent=`${activeWorld.icon} ${activeWorld.id.toUpperCase()} WORLD`;$("workspaceTitle").textContent=activeWorld.title;$("workspaceDesc").textContent=activeWorld.desc;$("workspaceBadge").textContent=`CLASS ${profile.class_number}`;renderLessons();renderSpecialLab();startChallenge();renderProject();setWorkMode(mode);$("workspace").scrollIntoView({behavior:"smooth",block:"start"})}
function closeWorld(){activeWorld=null;$("workspace").classList.add("hidden");$("worldGrid").classList.remove("hidden");renderWorlds();document.querySelector(".section-head")?.scrollIntoView({behavior:"smooth",block:"start"})}
function setWorkMode(mode){workMode=mode;qa(".workspace-tab").forEach(b=>b.classList.toggle("active",b.dataset.workMode===mode));$("learnView").classList.toggle("show",mode==="learn");$("challengeView").classList.toggle("show",mode==="challenge");$("createView").classList.toggle("show",mode==="create")}

function renderLessons(){if(!activeWorld)return;const ls=accessibleLessons(activeWorld);$("lessonGrid").innerHTML=ls.map((l,i)=>{const k=`${activeWorld.id}:${i}`,done=state.completedLessons.includes(k);return `<article class="lesson-card ${done?"done":""}"><div class="lesson-icon">${l[3]}</div><div class="lesson-tags"><span class="lesson-tag">CLASS ${l[2]}+</span><span class="lesson-tag">${esc(l[4])}</span></div><h3>${esc(l[0])}</h3><p>${esc(l[1])}</p><div class="lesson-actions"><button data-hear-lesson="${i}" type="button">🔊 Hear</button><button class="complete-btn" data-complete-lesson="${i}" type="button">${done?"✅ Learned":"✓ Mark Learned"}</button></div></article>`}).join("");qa("[data-hear-lesson]").forEach(b=>b.onclick=()=>{const l=ls[+b.dataset.hearLesson];speak(`${l[0]}. ${l[1]}`)});qa("[data-complete-lesson]").forEach(b=>b.onclick=()=>completeLesson(+b.dataset.completeLesson))}
function completeLesson(i){const k=`${activeWorld.id}:${i}`;if(state.completedLessons.includes(k))return toast("Already completed ✅");state.completedLessons.push(k);dailyState().learn=true;addXP(5,"Lesson completed");renderLessons();renderWorlds()}

function shuffle(a){return [...a].sort(()=>Math.random()-.5)}
function startChallenge(){if(!activeWorld)return;challenge={questions:shuffle(accessibleQuestions(activeWorld)),index:0,score:0,answered:false};renderChallenge()}
function renderChallenge(){const qs=challenge.questions;if(!qs.length){$("challengeQuestion").textContent="No challenge is available for your class yet.";$("challengeOptions").innerHTML="";$("challengeFeedback").textContent="";$("nextChallenge").disabled=true;return}if(challenge.index>=qs.length){const pct=Math.round(challenge.score/qs.length*100);$("challengeLabel").textContent="COMPLETE";$("challengeScore").textContent=`Score ${challenge.score}/${qs.length}`;$("challengeQuestion").textContent=`Challenge complete — ${pct}%`;$("challengeOptions").innerHTML="";$("challengeFeedback").textContent=pct>=60?"Great work. You completed this challenge!":"Good try. Review the lessons and try again.";$("nextChallenge").disabled=false;$("nextChallenge").textContent="Try Again ↻";if(!state.challengeWins[activeWorld.id]||state.challengeWins[activeWorld.id]<pct){state.challengeWins[activeWorld.id]=pct;if(pct>=60){dailyState().challenge=true;addXP(10,"Challenge completed")}else saveState()}return}
 const q=qs[challenge.index];$("challengeLabel").textContent=`QUESTION ${challenge.index+1} OF ${qs.length}`;$("challengeScore").textContent=`Score ${challenge.score}`;$("challengeQuestion").textContent=q[1];$("challengeFeedback").textContent="Choose the best answer.";$("challengeOptions").innerHTML=q[2].map((o,i)=>`<button class="challenge-option" data-answer="${i}" type="button">${esc(o)}</button>`).join("");$("nextChallenge").disabled=true;$("nextChallenge").textContent="Next Question →";challenge.answered=false;qa("[data-answer]").forEach(b=>b.onclick=()=>answerChallenge(+b.dataset.answer))}
function answerChallenge(i){if(challenge.answered)return;challenge.answered=true;const q=challenge.questions[challenge.index],correct=Number(q[3]);qa("[data-answer]").forEach((b,idx)=>{if(idx===correct)b.classList.add("correct");else if(idx===i)b.classList.add("wrong");b.disabled=true});if(i===correct){challenge.score++;$("challengeFeedback").textContent=`✅ Correct! ${q[4]}`;speak("Correct. "+q[4])}else{$("challengeFeedback").textContent=`❌ Good try. ${q[4]}`;speak("Good try. "+q[4])}$("challengeScore").textContent=`Score ${challenge.score}`;$("nextChallenge").disabled=false}
function nextChallenge(){if(challenge.index>=challenge.questions.length){startChallenge();return}challenge.index++;renderChallenge()}

function renderProject(){if(!activeWorld)return;const p=projectFor(activeWorld);$("projectTitle").textContent=p[0];$("projectPrompt").textContent=p[1];$("projectChecklist").innerHTML=p[2].map((x,i)=>`<div class="project-step"><span>${i+1}</span><div>${esc(x)}</div></div>`).join("");$("projectWork").value=""}
function saveProject(){if(!activeWorld)return;const text=$("projectWork").value.trim();if(text.length<15)return toast("Write a little more before saving 😊");const p=projectFor(activeWorld);state.projects.unshift({id:Date.now(),world:activeWorld.id,worldTitle:activeWorld.title,title:p[0],text:text.slice(0,5000),date:nowLabel(),classNumber:Number(profile.class_number)});dailyState().create=true;addXP(15,"Project saved to portfolio");$("projectWork").value="";renderWorlds()}

function renderSpecialLab(){const el=$("specialLab");if(!activeWorld?.lab){el.innerHTML="";return}if(activeWorld.lab==="hardware")return renderHardwareLab();if(activeWorld.lab==="keyboard")return renderKeyboardLab();if(activeWorld.lab==="windows")return renderWindowsLab();if(activeWorld.lab==="coding")return renderCodingLab();if(activeWorld.lab==="data")return renderDataLab();if(activeWorld.lab==="research")return renderResearchLab();if(activeWorld.lab==="cyber")return renderCyberLab();el.innerHTML=""}

const hardwareViews={
 monitorFront:{label:"Monitor Front",intro:"The front is where you see the display. Buttons may control power, brightness, menu and input source.",html:`<div class="monitor-shape"><div class="port-dot port-power" data-hot="Monitor Power Button">POWER</div></div>`,spots:{"Monitor Power Button":"Turns the monitor on or off. The monitor still needs its power cable connected."}},
 monitorBack:{label:"Monitor Back",intro:"The back contains display inputs and power connections. Exact ports vary by model.",html:`<div class="monitor-shape monitor-back"><div class="port-dot port-power" data-hot="Power Input">POWER</div><div class="port-dot port-hdmi" data-hot="HDMI">HDMI</div><div class="port-dot port-vga" data-hot="VGA">VGA</div><div class="port-dot port-dp" data-hot="DisplayPort">DP</div></div>`,spots:{"Power Input":"Connects the monitor to its power adapter or mains cable, depending on model.","HDMI":"Digital video and usually audio. Common on modern computers and displays.","VGA":"Older analog video connector. Still found on some older equipment.","DisplayPort":"Digital display connector commonly found on business computers and monitors."}},
 towerFront:{label:"System Unit Front",intro:"The front panel usually gives quick access to power, USB and audio connections.",html:`<div class="tower-shape front"><div class="port-dot port-usb" data-hot="Front USB">USB</div><div class="port-dot port-audio" data-hot="Headset / Audio">AUDIO</div><div class="port-dot port-power" data-hot="Power Button">⏻</div></div>`,spots:{"Front USB":"Easy-access port for flash drives and other USB devices.","Headset / Audio":"May connect headphones, headset or microphone depending on the PC.","Power Button":"Starts the computer or sends a power command. Avoid forcing power-off unless necessary."}},
 towerBack:{label:"System Unit Back",intro:"The back is the main connection area for display, network, USB, audio and power.",html:`<div class="tower-shape back"><div class="port-dot port-power" data-hot="PSU Power">POWER</div><div class="port-dot port-hdmi" data-hot="HDMI / Display">HDMI</div><div class="port-dot port-vga" data-hot="VGA">VGA</div><div class="port-dot port-usb" data-hot="USB">USB</div><div class="port-dot port-lanx" data-hot="LAN / Ethernet">LAN</div><div class="port-dot port-audio" data-hot="Audio">AUDIO</div></div>`,spots:{"PSU Power":"Connects the system unit power supply to mains or UPS output.","HDMI / Display":"Connects a monitor when the computer supports this display output.","VGA":"Older analog display output.","USB":"Connects keyboard, mouse, storage and many peripherals.","LAN / Ethernet":"RJ45 network port used for wired Ethernet.","Audio":"Connects speakers, headphones or microphone depending on colour/label."}},
 motherboard:{label:"Motherboard",intro:"The motherboard connects major internal components and lets them communicate.",html:`<div class="motherboard"><div class="part cpu" data-hot="CPU Socket">CPU SOCKET</div><div class="part ram" data-hot="RAM Slots">RAM</div><div class="part pcie" data-hot="PCIe Slot">PCIe</div><div class="part sata" data-hot="SATA Ports">SATA</div><div class="part m2" data-hot="M.2 Slot">M.2</div><div class="part power24" data-hot="24-pin Power">POWER</div></div>`,spots:{"CPU Socket":"Holds the processor. CPU installation requires correct orientation and careful handling.","RAM Slots":"Hold compatible memory modules. RAM generations are not freely interchangeable.","PCIe Slot":"Used for expansion cards such as graphics, network or other add-in cards.","SATA Ports":"Connect SATA storage devices using data cables.","M.2 Slot":"Can hold compatible M.2 SSDs or other M.2 devices depending on the motherboard.","24-pin Power":"Main motherboard power connector from the PSU."}},
 parts:{label:"Storage, RAM & CPU",intro:"These parts have different jobs: storage keeps data, RAM holds active working data, and the CPU processes instructions.",html:`<div class="parts-showcase"><div class="part-tile" data-hot="HDD"><div><span>💽</span><b>HDD</b><small>Magnetic storage</small></div></div><div class="part-tile" data-hot="SATA SSD"><div><span>▰</span><b>SATA SSD</b><small>Solid-state storage</small></div></div><div class="part-tile" data-hot="M.2 SSD"><div><span>▬</span><b>M.2 SSD</b><small>Compact solid-state module</small></div></div><div class="part-tile" data-hot="RAM"><div><span>🧠</span><b>RAM</b><small>Working memory</small></div></div><div class="part-tile" data-hot="CPU"><div><span>⚙️</span><b>CPU</b><small>Processes instructions</small></div></div><div class="part-tile" data-hot="Cooler"><div><span>🌀</span><b>Cooler</b><small>Moves heat away</small></div></div></div>`,spots:{"HDD":"Stores files on spinning magnetic disks. Usually slower than SSDs but can offer large capacity.","SATA SSD":"Solid-state storage using the SATA interface. Faster and quieter than traditional HDDs.","M.2 SSD":"Compact SSD form factor that installs directly on a compatible motherboard slot.","RAM":"Temporary working memory. DDR2, DDR3, DDR4 and DDR5 are generations with different designs and compatibility.","CPU":"Processor that executes instructions and coordinates computing tasks.","Cooler":"Heatsink and fan or another cooling system helps move heat away from the CPU."}},
 ups:{label:"UPS & Power",intro:"A UPS can provide short battery backup. A safe learner connects equipment only under adult guidance and never opens mains-powered equipment.",html:`<div class="parts-showcase"><div class="part-tile" data-hot="UPS Input"><div><span>🔌</span><b>UPS INPUT</b><small>Power from wall</small></div></div><div class="part-tile" data-hot="UPS Output"><div><span>⚡</span><b>UPS OUTPUT</b><small>Backup power to PC/monitor</small></div></div><div class="part-tile" data-hot="Safe Shutdown"><div><span>⏻</span><b>SAFE SHUTDOWN</b><small>Save work before battery ends</small></div></div><div class="part-tile" data-hot="PSU Safety"><div><span>🛡️</span><b>PSU SAFETY</b><small>Never open PSU casing</small></div></div></div>`,spots:{"UPS Input":"The UPS receives mains power through its input connection.","UPS Output":"Supported outlets can power equipment for a short time during an outage.","Safe Shutdown":"Save work and shut down before the UPS battery is exhausted.","PSU Safety":"Never open a PSU/SMPS. Internal components can retain dangerous electrical charge."}}
};
function renderHardwareLab(view="monitorFront"){const v=hardwareViews[view]||hardwareViews.monitorFront;$("specialLab").innerHTML=`<section class="lab-card"><h3>🧪 Interactive Hardware Explorer</h3><p>Tap a view, then tap labelled ports or parts to learn what they do.</p><div class="lab-toolbar">${Object.entries(hardwareViews).map(([k,x])=>`<button class="${k===view?"active":""}" data-hview="${k}" type="button">${x.label}</button>`).join("")}</div><div class="hardware-stage"><div class="device-visual">${v.html}</div><div class="device-info"><h4 id="hwInfoTitle">${esc(v.label)}</h4><p id="hwInfoText">${esc(v.intro)}</p><div class="hotspot-list">${Object.entries(v.spots).map(([k,d])=>`<button class="hotspot-btn" data-hot-list="${esc(k)}" type="button"><b>${esc(k)}</b>${esc(d)}</button>`).join("")}</div></div></div></section>`;qa("[data-hview]").forEach(b=>b.onclick=()=>renderHardwareLab(b.dataset.hview));const select=(name)=>{const txt=v.spots[name]||"Explore this part.";$("hwInfoTitle").textContent=name;$("hwInfoText").textContent=txt;qa("[data-hot-list]").forEach(x=>x.classList.toggle("active",x.dataset.hotList===name));qa("[data-hot]").forEach(x=>x.classList.toggle("active",x.dataset.hot===name));speak(`${name}. ${txt}`)};qa("[data-hot]").forEach(x=>x.onclick=()=>select(x.dataset.hot));qa("[data-hot-list]").forEach(x=>x.onclick=()=>select(x.dataset.hotList))}

const keyHelp={"Esc":"Escape can close or cancel some menus and dialogs.","F1":"Function keys can perform special actions depending on the program.","1":"Number keys type numbers and symbols with Shift.","Tab":"Tab moves to the next field or creates indentation in some programs.","Caps":"Caps Lock keeps letters uppercase until turned off.","Shift":"Shift can create one capital letter or the upper symbol on a key.","Ctrl":"Control is a modifier used in shortcuts such as Ctrl+C.","Alt":"Alt is a modifier used in shortcuts such as Alt+Tab.","Win":"Windows key opens Start and is used in shortcuts such as Windows+L.","Space":"Spacebar inserts a space between words.","Enter":"Enter usually starts a new line or confirms an action.","Backspace":"Backspace normally deletes the character before the cursor.","Delete":"Delete often removes the selected item or the character after the cursor.","↑":"Arrow keys move the cursor or selection in many programs."};
function renderKeyboardLab(){const keys=["Esc","F1","F2","F3","F4","1","2","3","4","5","6","Backspace","Tab","Q","W","E","R","T","Y","U","I","O","P","Enter","Caps","A","S","D","F","G","H","J","K","L","Shift","Z","X","C","V","B","N","M","Delete","Ctrl","Win","Alt","Space","↑","←","↓","→"];$("specialLab").innerHTML=`<section class="lab-card"><h3>⌨️ Interactive Keyboard Explorer</h3><p>Tap a key to hear what it commonly does. Shortcut behaviour can vary by app and operating system.</p><div class="keyboard-lab"><div class="keyboard-board">${keys.map(k=>`<button class="key ${k==="Space"?"w4":(["Backspace","Enter","Shift"].includes(k)?"w2":"")}" data-keyname="${esc(k)}" type="button">${esc(k)}</button>`).join("")}</div><div class="key-info"><h4 id="keyTitle">Choose a key</h4><p id="keyText">Tap any key on the keyboard to learn its common purpose.</p><div class="hotspot-list"><button class="hotspot-btn" data-short="Ctrl+C"><b>Ctrl + C</b>Copy selected content.</button><button class="hotspot-btn" data-short="Ctrl+V"><b>Ctrl + V</b>Paste copied or cut content.</button><button class="hotspot-btn" data-short="Ctrl+Z"><b>Ctrl + Z</b>Undo the previous action in many apps.</button><button class="hotspot-btn" data-short="Alt+Tab"><b>Alt + Tab</b>Switch between open apps.</button><button class="hotspot-btn" data-short="Windows+L"><b>Windows + L</b>Lock the computer.</button><button class="hotspot-btn" data-short="Ctrl+Shift+Esc"><b>Ctrl + Shift + Esc</b>Open Task Manager directly in Windows.</button><button class="hotspot-btn" data-short="Ctrl+Alt+Delete"><b>Ctrl + Alt + Delete</b>Open the Windows security options screen.</button></div></div></div></section>`;qa("[data-keyname]").forEach(b=>b.onclick=()=>{const k=b.dataset.keyname,txt=keyHelp[k]||`${k} is a keyboard key whose action can depend on the current app.`;$("keyTitle").textContent=k;$("keyText").textContent=txt;qa("[data-keyname]").forEach(x=>x.classList.toggle("active",x===b));speak(`${k}. ${txt}`)});const sh={"Ctrl+C":"Copy selected content.","Ctrl+V":"Paste copied or cut content.","Ctrl+Z":"Undo the previous action in many programs.","Alt+Tab":"Switch between open applications.","Windows+L":"Lock the current Windows session.","Ctrl+Shift+Esc":"Open Task Manager directly.","Ctrl+Alt+Delete":"Open the Windows security options screen."};qa("[data-short]").forEach(b=>b.onclick=()=>{const t=sh[b.dataset.short];$("keyTitle").textContent=b.dataset.short;$("keyText").textContent=t;speak(`${b.dataset.short}. ${t}`)})}

function renderWindowsLab(){$("specialLab").innerHTML=`<section class="lab-card"><h3>🪟 Mini Windows Practice Desktop</h3><p>This is a safe simulation for learning desktop actions. It does not change your real device.</p><div class="windows-lab"><div class="fake-desktop" id="fakeDesktop"><div class="desktop-icons"><button class="desktop-icon" data-win="This PC" type="button"><span>🖥️</span>This PC</button><button class="desktop-icon" data-win="Recycle Bin" type="button"><span>♻️</span>Recycle Bin</button><button class="desktop-icon" data-win="School Folder" type="button"><span>📁</span>School Folder</button><button class="desktop-icon" data-win="Browser" type="button"><span>🌐</span>Browser</button></div><div class="taskbar"><button class="start-btn" data-win="Start Menu" type="button">⊞</button><span style="font-size:9px">🔎 Search</span><span style="margin-left:auto;font-size:9px">🔊 📶 🔋</span></div></div><div class="desktop-panel"><h4>Try a safe action</h4><div class="desktop-actions"><button data-action="folder">📁 Create Folder</button><button data-action="rename">✏️ Rename File</button><button data-action="delete">🗑️ Delete</button><button data-action="restore">♻️ Restore</button><button data-action="wallpaper">🎨 Wallpaper</button><button data-action="lock">🔒 Lock</button><button data-action="signout">👤 Sign Out</button><button data-action="restart">↻ Restart</button><button data-action="shutdown">⏻ Shutdown</button><button data-action="task">📊 Task Manager</button></div><div id="desktopLog" class="desktop-log">Choose an icon or action.</div></div></div></section>`;let bg=0;const logs={folder:"✅ New folder created in this simulation. In real Windows, use File Explorer or right-click → New → Folder.",rename:"✏️ Rename changes a file or folder name without changing its contents.",delete:"🗑️ Delete usually sends the selected item to Recycle Bin first.",restore:"♻️ Restore returns a selected Recycle Bin item to its previous location.",lock:"🔒 Lock keeps your session signed in but protects it until you unlock it.",signout:"👤 Sign Out closes your user session and apps, so save work first.",restart:"↻ Restart closes Windows and starts it again. Useful after some updates or troubleshooting.",shutdown:"⏻ Shut down closes Windows and powers off the computer safely.",task:"📊 Task Manager can show running apps and help close an unresponsive app.",wallpaper:"🎨 Wallpaper changes the desktop background only."};qa("[data-win]").forEach(b=>b.onclick=()=>{$("desktopLog").textContent=`Opened ${b.dataset.win} in the simulation.`;speak(`Opened ${b.dataset.win}`)});qa("[data-action]").forEach(b=>b.onclick=()=>{const a=b.dataset.action;if(a==="wallpaper"){bg=(bg+1)%4;const colors=["linear-gradient(145deg,#3189cf,#7e5ad8)","linear-gradient(145deg,#12a4a6,#1b4d92)","linear-gradient(145deg,#e86d9a,#6848ba)","linear-gradient(145deg,#2c7a62,#65a84b)"];$("fakeDesktop").style.background=colors[bg]}$("desktopLog").textContent=logs[a];speak(logs[a])})}

function renderCodingLab(){$("specialLab").innerHTML=`<section class="lab-card"><h3>👨‍💻 Mini Algorithm Builder</h3><p>Build a short robot instruction sequence. The goal is to think in clear steps, not to memorise code.</p><div class="lab-toolbar"><button data-block="MOVE" type="button">⬆️ Move</button><button data-block="TURN" type="button">↪️ Turn</button><button data-block="REPEAT" type="button">🔁 Repeat</button><button data-block="IF" type="button">🔀 If</button><button id="clearBlocks" type="button">🗑️ Clear</button></div><div class="device-info"><h4>My Algorithm</h4><p id="blockLine">No blocks yet.</p><button id="runBlocks" class="primary-btn" type="button">▶ Run Logic</button><div id="codeResult" class="desktop-log">Add 3 or more blocks, then run.</div></div></section>`;let blocks=[];const draw=()=>$("blockLine").textContent=blocks.length?blocks.join(" → "):"No blocks yet.";qa("[data-block]").forEach(b=>b.onclick=()=>{blocks.push(b.dataset.block);draw()});$("clearBlocks").onclick=()=>{blocks=[];draw();$("codeResult").textContent="Add 3 or more blocks, then run."};$("runBlocks").onclick=()=>{if(blocks.length<3)return $("codeResult").textContent="Try at least three steps.";const hasLogic=blocks.includes("REPEAT")||blocks.includes("IF");$("codeResult").textContent=hasLogic?"✅ Nice! You included control logic as well as sequence.":"✅ Good sequence. Can you improve it with Repeat or If?"}}

function renderDataLab(){const data=[5,8,3,7,6];const labels=["Apple","Mango","Banana","Orange","Grapes"];const max=Math.max(...data);$("specialLab").innerHTML=`<section class="lab-card"><h3>📊 Mini Data Lab</h3><p>Example survey: favourite fruit among a small group. A small sample does not represent every child everywhere.</p><div style="display:grid;gap:8px;margin-top:12px">${data.map((n,i)=>`<div style="display:grid;grid-template-columns:70px 1fr 30px;gap:8px;align-items:center;font-size:9px"><b>${labels[i]}</b><div style="height:19px;border-radius:99px;background:#e7ebf5;overflow:hidden"><i style="display:block;height:100%;width:${n/max*100}%;background:linear-gradient(90deg,#6d5cff,#22cfc2);border-radius:99px"></i></div><b>${n}</b></div>`).join("")}</div><div class="desktop-log" style="margin-top:12px">Observation: Mango has the highest count in this example group. That does not prove mango is the favourite fruit of every student.</div></section>`}

function renderResearchLab(){const sources=[{title:"National science museum article",meta:"Named organisation • Updated recently • Sources listed",good:true},{title:"SHOCKING!!! Secret fact nobody tells you",meta:"Unknown author • No evidence • Heavy clickbait",good:false},{title:"School textbook chapter",meta:"Publisher named • Curriculum context • Edition date shown",good:true}];$("specialLab").innerHTML=`<section class="lab-card"><h3>🔎 Source Detective</h3><p>Tap each source and decide whether it looks stronger or needs more checking. This is about evidence, not about website appearance.</p><div class="hotspot-list">${sources.map((s,i)=>`<button class="hotspot-btn" data-source="${i}" type="button"><b>${esc(s.title)}</b>${esc(s.meta)}</button>`).join("")}</div><div id="sourceResult" class="desktop-log">Choose a source.</div></section>`;qa("[data-source]").forEach(b=>b.onclick=()=>{const s=sources[+b.dataset.source];$("sourceResult").textContent=s.good?"✅ This source has useful trust signals, but important claims should still be checked in context.":"⚠️ This source has warning signs. Look for author, evidence, date and confirmation from reliable sources."})}

function renderCyberLab(){const scenarios=[["A game friend asks for your home address so they can send a gift.","Do not share it. Tell a trusted adult."],["A login page opened from a strange message asks for your password.","Close it and use the official app/site instead. Ask a trusted adult if unsure."],["An app wants camera, microphone, contacts and location for a simple calculator.","Question unnecessary permissions and ask a trusted adult before allowing them."]];$("specialLab").innerHTML=`<section class="lab-card"><h3>🛡️ Cyber Decision Simulator</h3><p>Read a situation and choose the safest thinking habit.</p><div class="hotspot-list">${scenarios.map((s,i)=>`<button class="hotspot-btn" data-cyber="${i}" type="button"><b>Scenario ${i+1}</b>${esc(s[0])}</button>`).join("")}</div><div id="cyberResult" class="desktop-log">Choose a scenario to reveal a safe response.</div></section>`;qa("[data-cyber]").forEach(b=>b.onclick=()=>{const s=scenarios[+b.dataset.cyber];$("cyberResult").textContent=`✅ Safer response: ${s[1]}`;speak(s[1])})}

function openModal(html){$("modalBody").innerHTML=html;$("modal").classList.add("open");$("modal").setAttribute("aria-hidden","false")}
function closeModal(){$("modal").classList.remove("open");$("modal").setAttribute("aria-hidden","true")}
function showPassport(){const c=Number(profile.class_number);const items=worlds.filter(w=>c>=w.minClass).map(w=>{const ls=accessibleLessons(w),done=ls.filter((_,i)=>state.completedLessons.includes(`${w.id}:${i}`)).length,p=Math.round((done/(ls.length||1))*100);return `<article class="passport-item"><b>${w.icon} ${esc(w.title)}</b><small class="${p>=70?"skill-ok":"skill-wait"}">${p>=70?"✅ Demonstrating progress":"⏳ In progress"} • ${done}/${ls.length} lessons</small><div class="progress-mini"><i style="width:${p}%"></i></div></article>`}).join("");openModal(`<h2 class="modal-title">🪪 ${esc(profile.display_name||"Student")}'s Skill Passport</h2><p class="modal-sub">A skill passport shows completed learning evidence, not just time spent on the site.</p><div class="passport-grid">${items}</div>`)}
function showPortfolio(){const items=state.projects.length?state.projects.map(p=>`<article class="portfolio-item"><b>🛠️ ${esc(p.title)}</b><small>${esc(p.worldTitle)} • Class ${p.classNumber} • ${esc(p.date)}</small><small style="margin-top:8px;color:#3f496d">${esc(p.text.slice(0,260))}${p.text.length>260?"…":""}</small></article>`).join(""):`<article class="portfolio-item"><b>No projects yet</b><small>Open a world → Create Mode → save your work.</small></article>`;openModal(`<h2 class="modal-title">🎒 My Digital Portfolio</h2><p class="modal-sub">Saved project notes stay on this device in V22. They can later be synced to the academy database.</p><div class="portfolio-grid">${items}</div>`)}
function showReport(){const c=Number(profile.class_number),wins=Object.values(state.challengeWins),avg=wins.length?Math.round(wins.reduce((a,b)=>a+Number(b||0),0)/wins.length):0;const strong=worlds.filter(w=>c>=w.minClass&&worldProgress(w)>=60).map(w=>w.title).slice(0,4);const practice=worlds.filter(w=>c>=w.minClass&&worldProgress(w)<60).map(w=>w.title).slice(0,4);openModal(`<h2 class="modal-title">📊 Parent Progress Snapshot</h2><p class="modal-sub">A simple skills-first view for parents. This is not a school grade or psychological assessment.</p><div class="report-grid"><article class="report-item"><b>⭐ ${state.xp} XP</b><small>Practice and project activity</small></article><article class="report-item"><b>✅ ${state.completedLessons.length} Skills Completed</b><small>Marked learning units</small></article><article class="report-item"><b>🎯 ${avg}% Avg Challenge Best</b><small>Across attempted worlds</small></article><article class="report-item"><b>🛠️ ${state.projects.length} Projects</b><small>Saved portfolio work</small></article><article class="report-item"><b>🌟 Strong Progress</b><small>${strong.length?esc(strong.join(", ")):"Keep learning to build evidence."}</small></article><article class="report-item"><b>📘 Keep Practising</b><small>${practice.length?esc(practice.join(", ")):"Excellent coverage so far."}</small></article></div>`)}

function bindStatic(){qa(".mode-btn").forEach(b=>b.onclick=()=>{globalMode=b.dataset.mode;saveState();renderModes();if(activeWorld)setWorkMode(globalMode)});qa(".workspace-tab").forEach(b=>b.onclick=()=>setWorkMode(b.dataset.workMode));$("backWorlds").onclick=closeWorld;$("nextChallenge").onclick=nextChallenge;$("saveProject").onclick=saveProject;$("speakProject").onclick=()=>{if(activeWorld){const p=projectFor(activeWorld);speak(`${p[0]}. ${p[1]}. Steps: ${p[2].join(". ")}`)}};$("passportBtn").onclick=showPassport;$("portfolioBtn").onclick=showPortfolio;$("reportBtn").onclick=showReport;$("voiceBtn").onclick=()=>{voiceOn=!voiceOn;$("voiceBtn").textContent=voiceOn?"🔊 Voice On":"🔇 Voice Off";if(voiceOn)speak("Voice guide is on");else if("speechSynthesis" in window)speechSynthesis.cancel()};$("logoutBtn").onclick=async()=>{try{await api("/api/auth/logout",{method:"POST"})}catch{}localStorage.removeItem(TOKEN_KEY);location.href="student-login.html"};$("modalClose").onclick=closeModal;$("modal").onclick=e=>{if(e.target===$("modal"))closeModal()};document.addEventListener("keydown",e=>{if(e.key==="Escape")closeModal()})}

async function init(){const ok=await loadProfile();if(!ok)return;bindStatic();renderStats();renderModes();renderDailyMissions();renderWorlds();toast(`Welcome to Class ${profile.class_number} Future Skills Universe 🚀`)}
init();
})();
