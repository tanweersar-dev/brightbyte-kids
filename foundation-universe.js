/* ============================================================
   V40.14.1 — FOUNDATION SKILLS UNIVERSE • CLASS 1–3 • STABLE RETURN NAVIGATION
   Presentation + navigation only.
   Existing student-profile course/progress remains the source of truth.
   ============================================================ */
(() => {
"use strict";

const API = "https://api.tanweer.site";
const TOKEN_KEY = "brightbyte_student_token";
const VOICE_KEY = "foundation_voice_v4014";

const $ = id => document.getElementById(id);
const esc = value => String(value ?? "").replace(/[&<>"']/g, ch => ({
  "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"
}[ch]));

let token = localStorage.getItem(TOKEN_KEY) || "";
let profile = null;
let course = {
  day:1,
  stars:120,
  completed:[],
  skills:{}
};
let settings = {streak_days:0};
let voiceOn = localStorage.getItem(VOICE_KEY) !== "off";
let photoUrl = "";
let toastTimer = null;
let activeWorld = null;

const worlds = [
  {
    id:"computer", icon:"💻", title:"Computer Basics",
    colors:["#3f8efc","#25c6c1"], view:"lessons",
    desc:{
      1:"Meet a computer and name the monitor, mouse, keyboard and system unit.",
      2:"Practise using computers safely and understand what common parts do.",
      3:"Build confidence with desktop basics, files, folders and simple settings."
    },
    focus:{
      1:["Desktop or laptop","Monitor & system unit","What computers help us do","Gentle device care"],
      2:["Computer parts","Start and shutdown","Files and folders","Simple school tasks"],
      3:["Windows desktop","Organise files","Storage basics","Explain a computer part"]
    }
  },
  {
    id:"mousekeys", icon:"🖱️", title:"Mouse & Keyboard",
    colors:["#9b5be8","#ef4ca7"], view:"lessons",
    desc:{
      1:"Point, click, find letters and numbers, and learn the Spacebar.",
      2:"Practise double-click, drag, scroll, Enter, Backspace and Shift.",
      3:"Type more accurately and use a few simple shortcuts with confidence."
    },
    focus:{
      1:["Move the pointer","Left click","Letters & numbers","Spacebar"],
      2:["Double click","Drag & drop","Enter & Backspace","Shift & Caps Lock"],
      3:["Typing accuracy","Arrow keys","Copy & paste idea","Healthy typing posture"]
    }
  },
  {
    id:"itlab", icon:"🧪", title:"Safe IT Lab",
    colors:["#25b4d8","#47d7b4"], href:"virtual-it-lab.html",
    desc:{
      1:"Look at real-style computer devices and learn where each part belongs.",
      2:"Practise simple connections and safe computer-lab steps.",
      3:"Try guided beginner checks and explain what you tested."
    },
    focus:{
      1:["See devices","Match simple parts","Use safe hands","Ask before connecting"],
      2:["Cable matching","Monitor & mouse","Keyboard practice","Safe power habits"],
      3:["Check connections","Simple no-sound check","Simple no-display check","Tell what you tested"]
    }
  },
  {
    id:"english", icon:"🗣️", title:"English & Speaking",
    colors:["#f85a8b","#ff9a63"], view:"speaking",
    desc:{
      1:"Say hello, your name and a few simple classroom words.",
      2:"Talk about feelings, school, family and ask for help politely.",
      3:"Speak in short clear sentences and explain one thing you learned."
    },
    focus:{
      1:["Hello & goodbye","My name is…","Please & thank you","Listen and repeat"],
      2:["Feelings","Classroom English","Ask for help","Talk about school"],
      3:["Speak clearly","Describe a device","Mini presentation","Teach back"]
    }
  },
  {
    id:"gk", icon:"🌍", title:"GK & Curiosity",
    colors:["#3d9ae8","#5577f4"], view:"gk",
    desc:{
      1:"Explore simple facts about India, Bihar, nature, places and everyday life.",
      2:"Grow general knowledge with pictures, questions and world facts.",
      3:"Compare simple facts and practise explaining what you know."
    },
    focus:{
      1:["India & Bihar","Animals & nature","Places around us","Simple science facts"],
      2:["States & places","Earth & space basics","Plants & animals","Everyday GK"],
      3:["India & world","Science curiosity","Maps & flags","Explain a fact"]
    }
  },
  {
    id:"healthy", icon:"🥗", title:"Healthy Me",
    colors:["#31bd72","#58cc84"], view:"healthy",
    desc:{
      1:"Learn water, clean hands, good sleep and simple screen breaks.",
      2:"Build healthy food, hygiene, movement and routine habits.",
      3:"Plan a balanced day with study, play, movement, sleep and smart screen time."
    },
    focus:{
      1:["Drink water","Wash hands","Sleep well","Rest your eyes"],
      2:["Everyday foods","Brush teeth","Move your body","Screen breaks"],
      3:["Balanced routine","Healthy choices","Posture","Teach a healthy habit"]
    }
  },
  {
    id:"safety", icon:"🛡️", title:"Safety & Kindness",
    colors:["#4d7feb","#795fd8"], view:"citizen",
    desc:{
      1:"Know trusted adults, private information and kind online behaviour.",
      2:"Practise safe choices at home, on the road and online.",
      3:"Recognise risky messages, protect passwords and make respectful digital choices."
    },
    focus:{
      1:["Trusted adult","Keep secrets safe","Be kind","Ask before clicking"],
      2:["Road safety","Home safety","Online kindness","Private information"],
      3:["Password safety","Unknown links","Safe downloads","Respect online"]
    }
  },
  {
    id:"games", icon:"🎮", title:"Smart Games",
    colors:["#6959ef","#3e90f3"], view:"practice",
    desc:{
      1:"Play simple memory, matching and focus games.",
      2:"Practise logic, mouse, typing and observation through short games.",
      3:"Use games to strengthen thinking, accuracy and beginner problem solving."
    },
    focus:{
      1:["Memory","Matching","Focus","Mouse control"],
      2:["Patterns","Typing","Logic","Observation"],
      3:["Problem solving","Accuracy","Speed with care","Challenge yourself"]
    }
  },
  {
    id:"creative", icon:"🎨", title:"Create & Draw",
    colors:["#e957ba","#b55bd7"], view:"portfolio",
    desc:{
      1:"Draw with shapes and colours and save something you are proud of.",
      2:"Make a simple digital picture or mini school poster.",
      3:"Create small digital work and explain what you made."
    },
    focus:{
      1:["Shapes","Colours","Simple drawing","Show your work"],
      2:["Mini poster","Add a title","Choose pictures","Keep it neat"],
      3:["Plan a small project","Create","Review","Explain"]
    }
  },
  {
    id:"ai", icon:"🤖", title:"Friendly AI Basics",
    colors:["#f25cb7","#8e68f2"], view:"lessons",
    desc:{
      1:"Meet AI as a tool that can answer, create and sometimes make mistakes.",
      2:"Ask simple safe questions without sharing private information.",
      3:"Write a clear beginner prompt and remember to check important answers."
    },
    focus:{
      1:["What AI can do","AI is a tool","Never share passwords","Ask a trusted adult"],
      2:["Simple prompts","Private information","AI can be wrong","Use kind questions"],
      3:["Clear prompt","Check answers","Safe learning use","Human thinking matters"]
    }
  },
  {
    id:"internet", icon:"📶", title:"Internet & Wi-Fi",
    colors:["#26b9d0","#46a6ef"], view:"lessons",
    desc:{
      1:"Learn that websites can be opened using the internet and Wi-Fi.",
      2:"Meet browser, website, Wi-Fi and a router in simple words.",
      3:"Understand a small home or school network and practise safe first checks."
    },
    focus:{
      1:["Internet idea","Website","Wi-Fi symbol","Ask before going online"],
      2:["Browser","Wi-Fi","Router","Safe websites"],
      3:["Devices connect","Simple network","Check Wi-Fi first","Protect passwords"]
    }
  },
  {
    id:"tests", icon:"🏆", title:"Tests & Achievements",
    colors:["#f49b3f","#ff6f75"], view:"tests",
    desc:{
      1:"Take friendly checks after learning and celebrate what you remember.",
      2:"Use weekly and monthly tests to see what needs more practice.",
      3:"Read your results, learn from mistakes and build confidence step by step."
    },
    focus:{
      1:["Friendly questions","Try your best","See your score","Keep learning"],
      2:["Weekly checks","Monthly review","Practise again","Earn badges"],
      3:["Detailed result","Correct answers","Practice next","Celebrate progress"]
    }
  }
];


/* ============================================================
   V40.15 — BILINGUAL VISUAL MINI-LESSONS • CLASS 1–3
   Every Look / Listen / Try / Learn and every focus card opens
   a second large, child-friendly English + हिन्दी picture lesson.
   ============================================================ */
const FOUNDATION_FLOW_LESSONS = {"computer":{"look":["Look at the computer picture. Find the monitor, keyboard, mouse and system unit.","कंप्यूटर का चित्र देखो। मॉनिटर, कीबोर्ड, माउस और सिस्टम यूनिट पहचानो।"],"listen":["Listen to the names of the computer parts and say each name once.","कंप्यूटर के भागों के नाम सुनो और हर नाम एक बार बोलो।"],"try":["Point to one computer part and say what it helps us do.","किसी एक कंप्यूटर भाग की ओर इशारा करो और बताओ वह क्या काम करता है।"],"learn":["A computer has different parts, and every part has a job.","कंप्यूटर के अलग-अलग भाग होते हैं और हर भाग का अपना काम होता है।"]},"mousekeys":{"look":["Look at the mouse and keyboard. Find letters, numbers and the Spacebar.","माउस और कीबोर्ड देखो। अक्षर, नंबर और Spacebar पहचानो।"],"listen":["Listen to simple key names: Enter, Spacebar, Backspace and Shift.","आसान कुंजियों के नाम सुनो: Enter, Spacebar, Backspace और Shift।"],"try":["Move the mouse, click once and type one short word slowly.","माउस चलाओ, एक बार क्लिक करो और एक छोटा शब्द धीरे टाइप करो।"],"learn":["The mouse helps us point and click. The keyboard helps us type.","माउस पॉइंट और क्लिक में मदद करता है। कीबोर्ड टाइप करने में मदद करता है।"]},"itlab":{"look":["Look at the lab devices and cables. Notice that each part has a correct place.","लैब के उपकरण और केबल देखो। हर भाग की एक सही जगह होती है।"],"listen":["Listen to the safe steps before connecting anything.","कुछ जोड़ने से पहले सुरक्षित कदम सुनो।"],"try":["Match one device or cable with its correct place in the guided lab.","Guided Lab में एक डिवाइस या केबल को उसकी सही जगह से मिलाओ।"],"learn":["Safe technicians look first, connect carefully and check their work.","सुरक्षित technician पहले देखते हैं, ध्यान से जोड़ते हैं और फिर जाँचते हैं।"]},"english":{"look":["Look at the speaking words and the friendly face. Get ready to say a short sentence.","बोलने वाले शब्द और मुस्कुराता चेहरा देखो। एक छोटा वाक्य बोलने के लिए तैयार हो जाओ।"],"listen":["Listen to one short English sentence slowly.","एक छोटा English वाक्य धीरे-धीरे सुनो।"],"try":["Repeat the sentence in your own clear voice.","वाक्य को अपनी साफ़ आवाज़ में दोहराओ।"],"learn":["Speaking gets easier when we listen, repeat and practise a little every day.","जब हम सुनते, दोहराते और रोज़ थोड़ा अभ्यास करते हैं तो बोलना आसान होता है।"]},"gk":{"look":["Look at the picture, place or object and notice one important thing.","चित्र, जगह या वस्तु को देखो और एक ज़रूरी बात पहचानो।"],"listen":["Listen to one short fact about our world.","हमारी दुनिया के बारे में एक छोटा तथ्य सुनो।"],"try":["Answer one simple question using what you saw or heard.","जो देखा या सुना, उससे एक आसान सवाल का जवाब दो।"],"learn":["Curiosity grows when we look carefully and ask good questions.","ध्यान से देखने और अच्छे सवाल पूछने से जिज्ञासा बढ़ती है।"]},"healthy":{"look":["Look at the healthy habit picture and notice what the child is doing.","स्वस्थ आदत का चित्र देखो और बच्चा क्या कर रहा है पहचानो।"],"listen":["Listen to one simple healthy habit for today.","आज की एक आसान स्वस्थ आदत सुनो।"],"try":["Choose one healthy habit you can do today.","आज करने के लिए एक अच्छी सेहत की आदत चुनो।"],"learn":["Small healthy habits every day help our body and brain.","रोज़ की छोटी अच्छी आदतें शरीर और दिमाग की मदद करती हैं।"]},"safety":{"look":["Look at the situation and decide what looks safe and what does not.","स्थिति को देखो और सोचो क्या सुरक्षित है और क्या नहीं।"],"listen":["Listen to the safety rule and remember who your trusted adults are.","सुरक्षा नियम सुनो और याद रखो कि तुम्हारे भरोसेमंद बड़े कौन हैं।"],"try":["Choose the safe action. If unsure, stop and ask a trusted adult.","सुरक्षित काम चुनो। समझ न आए तो रुककर भरोसेमंद बड़े से पूछो।"],"learn":["Being safe means stopping, thinking and asking for help when needed.","सुरक्षित रहने का मतलब है रुकना, सोचना और ज़रूरत पर मदद माँगना।"]},"games":{"look":["Look carefully at the game board before you tap anything.","कुछ टैप करने से पहले गेम बोर्ड को ध्यान से देखो।"],"listen":["Listen to the game rule once before you start.","शुरू करने से पहले गेम का नियम एक बार सुनो।"],"try":["Play one short level slowly and carefully.","एक छोटा level धीरे और ध्यान से खेलो।"],"learn":["Smart games can practise memory, focus, logic and mouse control.","Smart games memory, focus, logic और mouse control का अभ्यास कराते हैं।"]},"creative":{"look":["Look at colours, shapes and simple examples before you create.","बनाने से पहले रंग, आकृतियाँ और आसान उदाहरण देखो।"],"listen":["Listen to the small task: what should you make today?","छोटा काम सुनो: आज तुम्हें क्या बनाना है?"],"try":["Make one simple picture, poster or small digital creation.","एक आसान चित्र, poster या छोटा digital काम बनाओ।"],"learn":["Good creating starts simple: plan, make, check and share.","अच्छा creation आसान तरीके से शुरू होता है: सोचो, बनाओ, जाँचो और दिखाओ।"]},"ai":{"look":["Look at the AI example and notice that AI is a tool, not a person.","AI का उदाहरण देखो और याद रखो कि AI एक tool है, इंसान नहीं।"],"listen":["Listen to one safe AI rule before asking a question.","AI से सवाल पूछने से पहले एक सुरक्षित नियम सुनो।"],"try":["Ask one simple learning question without sharing private information.","निजी जानकारी दिए बिना पढ़ाई का एक आसान सवाल पूछो।"],"learn":["AI can help us learn, but people should check important answers.","AI सीखने में मदद कर सकता है, लेकिन ज़रूरी जवाब इंसान को जाँचना चाहिए।"]},"internet":{"look":["Look at the Wi-Fi, router and website symbols.","Wi-Fi, router और website के चिन्ह देखो।"],"listen":["Listen to how a device uses a network to reach a website.","सुनो कि डिवाइस network के जरिए website तक कैसे पहुँचता है।"],"try":["Find the Wi-Fi symbol and say one safe online rule.","Wi-Fi का चिन्ह पहचानो और एक सुरक्षित online नियम बोलो।"],"learn":["The internet connects devices and services. We should use it safely.","इंटरनेट डिवाइस और सेवाओं को जोड़ता है। हमें इसे सुरक्षित तरीके से इस्तेमाल करना चाहिए।"]},"tests":{"look":["Look at the question, choices and score area before answering.","जवाब देने से पहले सवाल, विकल्प और score वाला भाग देखो।"],"listen":["Listen to the question slowly if voice help is available.","Voice help हो तो सवाल धीरे-धीरे सुनो।"],"try":["Choose your best answer and move to the next question calmly.","अपना सबसे अच्छा उत्तर चुनो और शांति से अगले सवाल पर जाओ।"],"learn":["Tests help us see what we know and what we should practise next.","Tests बताते हैं कि हमें क्या आता है और आगे किसका अभ्यास करना है।"]}};
const FOUNDATION_FOCUS_LESSONS = {"Desktop or laptop":["A desktop stays on a desk. A laptop can be carried from place to place.","डेस्कटॉप मेज़ पर रहता है। लैपटॉप को हम एक जगह से दूसरी जगह ले जा सकते हैं।"],"Monitor & system unit":["The monitor shows pictures and words. The system unit does the computer's main work.","मॉनिटर पर चित्र और शब्द दिखते हैं। सिस्टम यूनिट कंप्यूटर का मुख्य काम करती है।"],"What computers help us do":["Computers help us learn, draw, type, watch lessons and do school work.","कंप्यूटर हमें पढ़ने, चित्र बनाने, टाइप करने, पाठ देखने और स्कूल का काम करने में मदद करता है।"],"Gentle device care":["Use clean hands and touch computer parts gently. Keep food and water away.","साफ हाथों से कंप्यूटर को धीरे से छुओ। खाना और पानी कंप्यूटर से दूर रखो।"],"Computer parts":["A computer has parts such as a monitor, keyboard, mouse and system unit.","कंप्यूटर में मॉनिटर, कीबोर्ड, माउस और सिस्टम यूनिट जैसे भाग होते हैं।"],"Start and shutdown":["Use the power button to start. Use the proper Shut down option before turning a computer off.","कंप्यूटर चालू करने के लिए पावर बटन दबाओ। बंद करने से पहले सही Shut down विकल्प चुनो।"],"Files and folders":["A file keeps your work. A folder helps keep many files together and tidy.","फ़ाइल में हमारा काम रहता है। फ़ोल्डर कई फ़ाइलों को एक जगह व्यवस्थित रखता है।"],"Simple school tasks":["You can type homework, draw a picture and read a lesson on a computer.","कंप्यूटर पर होमवर्क टाइप कर सकते हैं, चित्र बना सकते हैं और पाठ पढ़ सकते हैं।"],"Windows desktop":["The desktop is the main screen where icons, apps and the taskbar can appear.","डेस्कटॉप मुख्य स्क्रीन है जहाँ आइकन, ऐप और टास्कबार दिख सकते हैं।"],"Organise files":["Give files clear names and keep similar work inside the same folder.","फ़ाइल को साफ नाम दो और एक जैसे काम को एक ही फ़ोल्डर में रखो।"],"Storage basics":["Storage keeps files even after the computer is turned off.","स्टोरेज हमारी फ़ाइलों को कंप्यूटर बंद होने के बाद भी सुरक्षित रखता है।"],"Explain a computer part":["Choose one part, say its name and tell one job it does.","किसी एक भाग को चुनो, उसका नाम बोलो और बताओ कि वह क्या काम करता है।"],"Move the pointer":["Move the mouse gently. The pointer moves on the screen with your hand.","माउस को धीरे चलाओ। तुम्हारे हाथ के साथ स्क्रीन पर पॉइंटर चलता है।"],"Left click":["Press the left mouse button once to choose an item.","किसी चीज़ को चुनने के लिए माउस का बायाँ बटन एक बार दबाओ।"],"Letters & numbers":["Keyboard keys have letters and numbers. Press one key gently at a time.","कीबोर्ड की कुंजियों पर अक्षर और नंबर होते हैं। एक समय में एक कुंजी धीरे दबाओ।"],"Spacebar":["The Spacebar makes a blank space between words.","Spacebar शब्दों के बीच खाली जगह देता है।"],"Double click":["Double-click means pressing the left mouse button two times quickly.","Double-click का मतलब बायाँ माउस बटन जल्दी से दो बार दबाना है।"],"Drag & drop":["Hold an item with the mouse, move it, then release it in the new place.","माउस से किसी चीज़ को पकड़ो, उसे दूसरी जगह ले जाओ और फिर छोड़ दो।"],"Enter & Backspace":["Enter can start a new line or confirm. Backspace removes the letter before the cursor.","Enter नई लाइन या पुष्टि के लिए काम आता है। Backspace कर्सर से पहले का अक्षर मिटाता है।"],"Shift & Caps Lock":["Shift can make one capital letter. Caps Lock can keep letters capital until you turn it off.","Shift से एक बड़ा अक्षर लिख सकते हैं। Caps Lock से कई बड़े अक्षर लिखे जा सकते हैं।"],"Typing accuracy":["Type slowly and press the correct keys. Correct typing is more important than fast typing.","धीरे टाइप करो और सही कुंजी दबाओ। तेज़ टाइप करने से पहले सही टाइप करना ज़रूरी है।"],"Arrow keys":["Arrow keys move the cursor up, down, left and right.","Arrow keys कर्सर को ऊपर, नीचे, बाएँ और दाएँ ले जाती हैं।"],"Copy & paste idea":["Copy makes another copy of selected work. Paste puts that copy in a new place.","Copy चुने हुए काम की एक और कॉपी बनाता है। Paste उस कॉपी को नई जगह रखता है।"],"Healthy typing posture":["Sit straight, keep your shoulders relaxed and keep the screen at a comfortable distance.","सीधे बैठो, कंधे आराम से रखो और स्क्रीन को सही दूरी पर रखो।"],"See devices":["Look at the monitor, system unit, keyboard and mouse and learn their names.","मॉनिटर, सिस्टम यूनिट, कीबोर्ड और माउस को देखो और उनके नाम सीखो।"],"Match simple parts":["Match each computer part with the place where it belongs.","हर कंप्यूटर भाग को उसकी सही जगह से मिलाओ।"],"Use safe hands":["Keep hands dry and handle devices gently. Do not touch damaged wires.","हाथ सूखे रखो और उपकरणों को धीरे पकड़ो। खराब तार को मत छुओ।"],"Ask before connecting":["Ask a teacher or trusted adult before connecting real cables or power.","असली केबल या बिजली जोड़ने से पहले शिक्षक या भरोसेमंद बड़े से पूछो।"],"Cable matching":["Different cables have different plugs. Match the plug with the correct port.","अलग केबल के अलग प्लग होते हैं। प्लग को सही पोर्ट से मिलाओ।"],"Monitor & mouse":["The monitor shows the screen. The mouse helps point, click and choose.","मॉनिटर स्क्रीन दिखाता है। माउस पॉइंट, क्लिक और चुनने में मदद करता है।"],"Keyboard practice":["Use the keyboard to type letters, numbers and simple words.","कीबोर्ड से अक्षर, नंबर और छोटे शब्द टाइप करो।"],"Safe power habits":["Never open a power supply. Ask an adult before touching real power plugs.","पावर सप्लाई कभी मत खोलो। असली बिजली के प्लग को छूने से पहले बड़े से पूछो।"],"Check connections":["If something does not work, first check whether the cable is in the correct port.","कुछ काम न करे तो पहले देखो कि केबल सही पोर्ट में लगी है या नहीं।"],"Simple no-sound check":["Check volume, speaker connection and mute before changing anything else.","आवाज़ न आए तो पहले वॉल्यूम, स्पीकर कनेक्शन और म्यूट जाँचो।"],"Simple no-display check":["Check monitor power and display cable before asking for more help.","स्क्रीन न दिखे तो पहले मॉनिटर की पावर और डिस्प्ले केबल जाँचो।"],"Tell what you tested":["After a check, say what you looked at and what happened.","जाँच के बाद बताओ कि तुमने क्या देखा और क्या हुआ।"],"Hello & goodbye":["Say “Hello” when you meet someone and “Goodbye” when you leave.","किसी से मिलते समय “Hello” और जाते समय “Goodbye” बोलो।"],"My name is…":["Say: “My name is Ashaaz.” Use your own name when you practise.","बोलो: “My name is Ashaaz.” अभ्यास में अपना नाम बोलो।"],"Please & thank you":["Use “Please” when asking politely and “Thank you” after someone helps you.","प्यार से माँगते समय “Please” और मदद मिलने पर “Thank you” बोलो।"],"Listen and repeat":["Listen to one short sentence, then repeat it slowly and clearly.","एक छोटा वाक्य सुनो, फिर उसे धीरे और साफ़ बोलो।"],"Feelings":["Use simple words such as happy, sad, tired or excited to say how you feel.","अपने मन की बात बताने के लिए happy, sad, tired या excited जैसे आसान शब्द बोलो।"],"Classroom English":["Use short classroom sentences like “May I come in?” or “Can you help me?”","कक्षा में “May I come in?” या “Can you help me?” जैसे छोटे वाक्य बोलो।"],"Ask for help":["Say “Please help me” or “Can you show me?” when you need help.","मदद चाहिए तो “Please help me” या “Can you show me?” बोलो।"],"Talk about school":["Say one or two simple sentences about your class, teacher or favourite subject.","अपनी कक्षा, शिक्षक या पसंदीदा विषय के बारे में एक-दो छोटे वाक्य बोलो।"],"Speak clearly":["Speak slowly, use a clear voice and finish one sentence before the next.","धीरे और साफ़ बोलो। एक वाक्य पूरा करके फिर दूसरा बोलो।"],"Describe a device":["Say the device name, its colour and one thing it does.","उपकरण का नाम, उसका रंग और उसका एक काम बताओ।"],"Mini presentation":["Stand calmly and say three short sentences about one topic.","शांत खड़े होकर किसी एक विषय पर तीन छोटे वाक्य बोलो।"],"Teach back":["After learning, explain one small idea in your own words.","सीखने के बाद किसी एक छोटी बात को अपने शब्दों में समझाओ।"],"India & Bihar":["India is our country. Bihar is one of the states of India.","भारत हमारा देश है। बिहार भारत का एक राज्य है।"],"Animals & nature":["Animals, plants, water, air and land are all parts of nature.","जानवर, पौधे, पानी, हवा और धरती प्रकृति के भाग हैं।"],"Places around us":["We see places such as home, school, park, hospital and market around us.","हमारे आसपास घर, स्कूल, पार्क, अस्पताल और बाज़ार जैसी जगहें होती हैं।"],"Simple science facts":["The Sun gives us light and heat. Plants need light, water and air to grow.","सूरज हमें रोशनी और गर्मी देता है। पौधों को बढ़ने के लिए रोशनी, पानी और हवा चाहिए।"],"States & places":["India has many states. Each state has cities, towns and villages.","भारत में कई राज्य हैं। हर राज्य में शहर, कस्बे और गाँव होते हैं।"],"Earth & space basics":["Earth is our planet. The Moon goes around Earth and Earth goes around the Sun.","पृथ्वी हमारा ग्रह है। चंद्रमा पृथ्वी के चारों ओर और पृथ्वी सूरज के चारों ओर घूमती है।"],"Plants & animals":["Plants make food using sunlight. Animals need food, water and a safe place to live.","पौधे सूरज की रोशनी से भोजन बनाते हैं। जानवरों को भोजन, पानी और सुरक्षित जगह चाहिए।"],"Everyday GK":["General Knowledge means useful facts about our world and everyday life.","General Knowledge यानी दुनिया और रोज़मर्रा की ज़िंदगी की उपयोगी बातें।"],"India & world":["India is one country in a world with many countries and cultures.","भारत दुनिया के कई देशों में से एक देश है। दुनिया में अलग-अलग संस्कृतियाँ हैं।"],"Science curiosity":["Ask simple questions like “Why?”, “How?” and “What happens?” to learn science.","विज्ञान सीखने के लिए “क्यों?”, “कैसे?” और “क्या होगा?” जैसे सवाल पूछो।"],"Maps & flags":["A map shows places. A flag is a symbol used to represent a country.","नक्शा जगहें दिखाता है। झंडा किसी देश की पहचान का एक चिन्ह होता है।"],"Explain a fact":["Choose one fact, say it clearly and tell one reason or example.","एक तथ्य चुनो, साफ़ बोलो और एक कारण या उदाहरण बताओ।"],"Drink water":["Drink clean water during the day so your body can work well.","दिन में साफ़ पानी पियो ताकि शरीर अच्छी तरह काम कर सके।"],"Wash hands":["Wash hands with soap before eating and after using the toilet.","खाने से पहले और शौचालय के बाद साबुन से हाथ धोओ।"],"Sleep well":["Good sleep helps your body grow and your brain learn.","अच्छी नींद शरीर को बढ़ने और दिमाग को सीखने में मदद करती है।"],"Rest your eyes":["Look away from the screen for a short break and blink your eyes.","स्क्रीन से थोड़ी देर नज़र हटाओ और आँखें झपकाओ।"],"Everyday foods":["Eat a mix of grains, vegetables, fruits and other healthy foods.","अनाज, सब्ज़ियाँ, फल और दूसरे पौष्टिक भोजन मिलाकर खाओ।"],"Brush teeth":["Brush your teeth gently in the morning and before bed.","सुबह और सोने से पहले दाँत धीरे-धीरे ब्रश करो।"],"Move your body":["Play, walk, stretch or exercise every day.","हर दिन खेलो, चलो, स्ट्रेच करो या व्यायाम करो।"],"Screen breaks":["Take small breaks from screens so your eyes and body can rest.","स्क्रीन से छोटे-छोटे ब्रेक लो ताकि आँखों और शरीर को आराम मिले।"],"Balanced routine":["Make time for study, play, meals, movement and sleep.","पढ़ाई, खेल, खाना, शरीर चलाना और नींद—सबके लिए समय रखो।"],"Healthy choices":["Choose habits that keep your body clean, active, rested and strong.","ऐसी आदतें चुनो जो शरीर को साफ़, सक्रिय, आराम वाला और मजबूत रखें।"],"Posture":["Sit with your back supported and keep the screen at a comfortable height.","पीठ को सहारा देकर बैठो और स्क्रीन को आरामदायक ऊँचाई पर रखो।"],"Teach a healthy habit":["Choose one healthy habit and explain it to a friend or family member.","एक अच्छी सेहत की आदत चुनो और दोस्त या परिवार को समझाओ।"],"Trusted adult":["A trusted adult is someone safe who helps you, such as a parent, guardian or teacher.","भरोसेमंद बड़ा वह है जो तुम्हारी सुरक्षा और मदद करता है, जैसे माता-पिता, अभिभावक या शिक्षक।"],"Keep secrets safe":["Passwords, OTPs and private details should not be shared with friends or strangers.","पासवर्ड, OTP और निजी जानकारी दोस्तों या अनजान लोगों से साझा मत करो।"],"Be kind":["Use kind words online and offline. Do not hurt or tease others.","ऑनलाइन और सामने दोनों जगह अच्छे शब्द बोलो। किसी को परेशान या चिढ़ाओ मत।"],"Ask before clicking":["If a link, button or message looks strange, stop and ask a trusted adult.","कोई लिंक, बटन या संदेश अजीब लगे तो रुक जाओ और भरोसेमंद बड़े से पूछो।"],"Road safety":["Use a safe crossing, look both ways and stay with an adult when needed.","सुरक्षित जगह से सड़क पार करो, दोनों तरफ देखो और ज़रूरत हो तो बड़े के साथ रहो।"],"Home safety":["Do not play with electricity, fire, medicines or sharp tools.","बिजली, आग, दवा या नुकीली चीज़ों से खेलो मत।"],"Online kindness":["Write messages that are polite, helpful and respectful.","ऑनलाइन संदेश विनम्र, मददगार और सम्मान वाले लिखो।"],"Private information":["Your home address, phone number, passwords and OTPs are private.","घर का पता, फोन नंबर, पासवर्ड और OTP निजी जानकारी हैं।"],"Password safety":["Use a strong password and keep it private from other children and strangers.","मजबूत पासवर्ड रखो और उसे दूसरे बच्चों या अनजान लोगों से निजी रखो।"],"Unknown links":["Do not open unknown links. Ask a trusted adult first.","अनजान लिंक मत खोलो। पहले भरोसेमंद बड़े से पूछो।"],"Safe downloads":["Download apps or files only with permission from a trusted adult.","ऐप या फ़ाइल केवल भरोसेमंद बड़े की अनुमति से डाउनलोड करो।"],"Respect online":["Treat people online with the same respect you use face to face.","ऑनलाइन भी लोगों से उसी सम्मान से बात करो जैसे सामने करते हो।"],"Memory":["Memory games help your brain remember pictures, places and patterns.","Memory games दिमाग को चित्र, जगह और पैटर्न याद रखने में मदद करते हैं।"],"Matching":["Look carefully and join two things that belong together.","ध्यान से देखो और जो दो चीज़ें एक साथ मिलती हैं उन्हें जोड़ो।"],"Focus":["Focus means giving your attention to one task for a short time.","Focus का मतलब थोड़ी देर एक काम पर पूरा ध्यान देना है।"],"Mouse control":["Move, click and drag carefully to control the mouse.","माउस को सही चलाने के लिए धीरे move, click और drag करो।"],"Patterns":["A pattern is something that repeats in an order. Find what comes next.","Pattern वह क्रम है जो बार-बार दोहरता है। देखो अगला क्या आएगा।"],"Typing":["Typing means using keyboard keys to write letters, words and numbers.","Typing यानी कीबोर्ड की कुंजियों से अक्षर, शब्द और नंबर लिखना।"],"Logic":["Logic means thinking step by step to find a sensible answer.","Logic यानी सही उत्तर पाने के लिए एक-एक कदम सोचकर आगे बढ़ना।"],"Observation":["Observation means looking carefully and noticing small details.","Observation यानी ध्यान से देखकर छोटी-छोटी बातें पहचानना।"],"Problem solving":["Understand the problem, try a safe step and check what happens.","समस्या को समझो, एक सुरक्षित कदम आज़माओ और देखो क्या होता है।"],"Accuracy":["Accuracy means doing the task correctly, even if you work slowly.","Accuracy का मतलब काम सही करना है, चाहे तुम धीरे करो।"],"Speed with care":["Work a little faster only after you can do the task correctly.","जब काम सही होने लगे तभी धीरे-धीरे गति बढ़ाओ।"],"Challenge yourself":["Try a slightly harder level and keep going even after a small mistake.","थोड़ा कठिन स्तर आज़माओ और छोटी गलती के बाद भी अभ्यास जारी रखो।"],"Shapes":["Use circles, squares, rectangles and triangles to make a simple picture.","Circle, square, rectangle और triangle जैसी आकृतियों से आसान चित्र बनाओ।"],"Colours":["Choose colours that make your picture clear and cheerful.","ऐसे रंग चुनो जिनसे चित्र साफ़ और सुंदर दिखे।"],"Simple drawing":["Start with big simple shapes, then add small details.","पहले बड़ी और आसान आकृतियाँ बनाओ, फिर छोटी जानकारी जोड़ो।"],"Show your work":["Save your work and proudly show what you created.","अपना काम सेव करो और जो बनाया है उसे खुशी से दिखाओ।"],"Mini poster":["A mini poster can have one title, one picture and one short message.","Mini poster में एक शीर्षक, एक चित्र और एक छोटा संदेश हो सकता है।"],"Add a title":["A title tells the reader what your picture or poster is about.","शीर्षक बताता है कि तुम्हारा चित्र या पोस्टर किस बारे में है।"],"Choose pictures":["Choose pictures that match your topic and are easy to understand.","ऐसे चित्र चुनो जो विषय से जुड़े हों और आसानी से समझ आएँ।"],"Keep it neat":["Leave some space, line things up and do not put too much on one page.","थोड़ी खाली जगह छोड़ो, चीज़ें सीधी रखो और एक पेज पर बहुत कुछ मत भरो।"],"Plan a small project":["First decide what you will make, what you need and what you will do first.","पहले तय करो क्या बनाना है, क्या चाहिए और सबसे पहले क्या करना है।"],"Create":["Create means using your ideas to make something new.","Create का मतलब अपने विचारों से कुछ नया बनाना है।"],"Review":["Look at your work again and fix one thing that can be better.","अपने काम को फिर देखो और एक चीज़ सुधारो जो बेहतर हो सकती है।"],"Explain":["Tell someone what you made and how you made it.","किसी को बताओ कि तुमने क्या बनाया और कैसे बनाया।"],"What AI can do":["AI can help answer questions, create ideas and explain things, but it can make mistakes.","AI सवालों का जवाब, नए विचार और समझाने में मदद कर सकता है, लेकिन उससे गलती भी हो सकती है।"],"AI is a tool":["AI is a tool made by people. People must still think and make choices.","AI लोगों द्वारा बनाया गया एक साधन है। सोचने और फैसला करने का काम इंसान का ही है।"],"Never share passwords":["Never type passwords or OTPs into a chat or unknown AI tool.","किसी चैट या अनजान AI टूल में पासवर्ड या OTP कभी मत लिखो।"],"Ask a trusted adult":["If an AI answer feels strange, scary or confusing, ask a trusted adult.","AI का जवाब अजीब, डरावना या उलझाने वाला लगे तो भरोसेमंद बड़े से पूछो।"],"Simple prompts":["A prompt is what you ask AI. Use short and clear words.","Prompt वह सवाल या निर्देश है जो हम AI को देते हैं। छोटे और साफ़ शब्द लिखो।"],"AI can be wrong":["AI sometimes gives a wrong answer, so important facts should be checked.","AI कभी-कभी गलत जवाब देता है, इसलिए ज़रूरी बातों को जाँचना चाहिए।"],"Use kind questions":["Ask useful, respectful and safe questions.","काम की, सम्मान वाली और सुरक्षित बातें पूछो।"],"Clear prompt":["Tell AI exactly what you want in one clear sentence.","AI को एक साफ़ वाक्य में बताओ कि तुम्हें क्या चाहिए।"],"Check answers":["Check important AI answers with a teacher, book or trusted source.","ज़रूरी AI जवाब को शिक्षक, किताब या भरोसेमंद स्रोत से जाँचो।"],"Safe learning use":["Use AI to learn and practise, not to share private information.","AI का उपयोग सीखने और अभ्यास के लिए करो, निजी जानकारी देने के लिए नहीं।"],"Human thinking matters":["Your own thinking, questions and choices are more important than copying an AI answer.","AI का जवाब कॉपी करने से ज़्यादा ज़रूरी तुम्हारी अपनी सोच, सवाल और फैसले हैं।"],"Internet idea":["The internet connects many computers and services so information can travel between them.","इंटरनेट बहुत से कंप्यूटर और सेवाओं को जोड़ता है ताकि जानकारी एक जगह से दूसरी जगह जा सके।"],"Website":["A website is a group of pages you can open in a web browser.","Website कई वेब पेजों का समूह है जिसे browser में खोला जाता है।"],"Wi-Fi symbol":["The Wi-Fi symbol shows a wireless network connection or signal.","Wi-Fi का चिन्ह बिना तार वाले नेटवर्क के कनेक्शन या सिग्नल को दिखाता है।"],"Ask before going online":["Ask a parent, guardian or teacher before opening a new site or app.","नई वेबसाइट या ऐप खोलने से पहले माता-पिता, अभिभावक या शिक्षक से पूछो।"],"Browser":["A browser is an app used to open websites, such as Chrome or Edge.","Browser एक ऐप है जिससे वेबसाइट खोली जाती है, जैसे Chrome या Edge।"],"Wi-Fi":["Wi-Fi connects a device to a network without a cable.","Wi-Fi बिना केबल के डिवाइस को नेटवर्क से जोड़ता है।"],"Router":["A router helps devices share a network and reach the internet.","Router डिवाइसों को नेटवर्क बाँटने और इंटरनेट तक पहुँचने में मदद करता है।"],"Safe websites":["Use websites chosen by a teacher or trusted adult and avoid strange pop-ups.","शिक्षक या भरोसेमंद बड़े द्वारा चुनी वेबसाइटें इस्तेमाल करो और अजीब pop-up से बचो।"],"Devices connect":["Phones, tablets and computers can connect to the same Wi-Fi network.","फोन, टैबलेट और कंप्यूटर एक ही Wi-Fi नेटवर्क से जुड़ सकते हैं।"],"Simple network":["A network is a group of connected devices that can share information.","Network जुड़े हुए डिवाइसों का समूह है जो जानकारी साझा कर सकते हैं।"],"Check Wi-Fi first":["If a site will not open, first check whether Wi-Fi is connected.","वेबसाइट न खुले तो पहले जाँचो कि Wi-Fi जुड़ा है या नहीं।"],"Protect passwords":["Keep Wi-Fi and account passwords private and share them only with a trusted adult when needed.","Wi-Fi और account के पासवर्ड निजी रखो और ज़रूरत पर केवल भरोसेमंद बड़े से साझा करो।"],"Friendly questions":["A test question is a chance to show what you remember. Read it slowly.","टेस्ट का सवाल यह दिखाने का मौका है कि तुम्हें क्या याद है। सवाल धीरे पढ़ो।"],"Try your best":["Choose the answer you think is right and do not worry about one mistake.","जो उत्तर सही लगे उसे चुनो और एक गलती से घबराओ मत।"],"See your score":["Your score shows how many points you earned in the test.","Score बताता है कि टेस्ट में तुम्हें कितने अंक मिले।"],"Keep learning":["A wrong answer tells you what to practise next.","गलत उत्तर बताता है कि अगली बार किस चीज़ का अभ्यास करना है।"],"Weekly checks":["A weekly check reviews the small things you learned that week.","Weekly check उस हफ्ते सीखी छोटी बातों को दोहराता है।"],"Monthly review":["A monthly review looks at learning from several weeks together.","Monthly review कई हफ्तों की सीख को एक साथ देखता है।"],"Practise again":["Read the correct answer and try a similar question again.","सही उत्तर पढ़ो और उसी तरह का सवाल फिर से आज़माओ।"],"Earn badges":["Badges celebrate learning milestones and good effort.","Badges सीखने की उपलब्धियों और अच्छे प्रयास की खुशी मनाते हैं।"],"Detailed result":["A detailed result shows your score and which questions were right or wrong.","Detailed result में score और कौन से सवाल सही या गलत थे, यह दिखता है।"],"Correct answers":["Compare your answer with the correct answer and learn the small difference.","अपने उत्तर को सही उत्तर से मिलाओ और छोटी-सी अंतर वाली बात सीखो।"],"Practice next":["Practise the topics where you made mistakes first.","जिन विषयों में गलती हुई, पहले उनका अभ्यास करो।"],"Celebrate progress":["Be proud of improvement, then choose one small goal for the next test.","अपनी प्रगति पर खुश हो और अगले टेस्ट के लिए एक छोटा लक्ष्य बनाओ।"]};
const FOUNDATION_VISUALS = {"computer":["🖥️","💻","⌨️","🖱️"],"mousekeys":["🖱️","⌨️","🔤","🔢"],"itlab":["🧪","🖥️","🔌","🧰"],"english":["🗣️","👂","💬","📖"],"gk":["🌍","🇮🇳","🌱","🌙"],"healthy":["🥗","💧","🧼","😴"],"safety":["🛡️","👨‍👩‍👧","🔒","✅"],"games":["🎮","🧩","🎯","🧠"],"creative":["🎨","🖍️","⭐","🖼️"],"ai":["🤖","💡","❓","✅"],"internet":["📶","🌐","📱","🛜"],"tests":["🏆","📝","✅","⭐"]};

function parseMaybe(v, fallback){
  try{
    if(v == null) return fallback;
    if(typeof v === "string") return JSON.parse(v);
    return v;
  }catch{
    return fallback;
  }
}

function completedSet(){
  return new Set(Array.isArray(course.completed) ? course.completed : []);
}

function skillPct(name){
  return Math.max(0,Math.min(100,Number(course.skills?.[name] || 0)));
}

function countBadges(){
  const set = completedSet();
  const lessonDone = id => set.has(id);
  const d = [...set].filter(x => /^L\d+$/.test(String(x))).length;
  const g = [...set].filter(x => String(x).startsWith("game:")).length;
  return [
    d>=1,
    d>=10,
    lessonDone("L5"),
    lessonDone("L7"),
    skillPct("English")>=30,
    skillPct("Safety")>=30,
    skillPct("AI")>=25,
    g>=3,
    g>=12,
    d>=30,
    d>=60
  ].filter(Boolean).length;
}

function classStage(c){
  if(c===1) return {
    eyebrow:"LEVEL 1A • DISCOVER WITH PICTURES & VOICE",
    title:"Look. Listen. Tap. Discover.",
    text:"Meet computers, mouse and keyboard, simple English, safety, healthy habits, GK and confidence through big pictures and friendly guided practice.",
    intro:"Big pictures, short words and guided practice. Every world follows Look → Listen → Try → Learn."
  };
  if(c===2) return {
    eyebrow:"LEVEL 1B • PRACTISE & GROW",
    title:"Try. Repeat. Practise. Grow.",
    text:"Strengthen computer control, typing, spoken English, healthy habits, safety, simple internet ideas and beginner problem solving through short practice.",
    intro:"Short practice, repetition and simple challenges. Every world follows Look → Listen → Try → Learn."
  };
  return {
    eyebrow:"LEVEL 1C • BUILD CONFIDENCE",
    title:"Learn. Practise. Explain. Shine.",
    text:"Build confidence with digital basics, files, safe internet and AI habits, spoken English, creativity, beginner troubleshooting and simple independent tasks.",
    intro:"Clear steps, small projects and teach-back. Every world follows Look → Listen → Try → Learn."
  };
}

function viewHref(view){
  return `student-profile.html?view=${encodeURIComponent(view)}&from=foundation`;
}

function withFoundationReturn(href){
  if(!href) return href;
  const join = href.includes("?") ? "&" : "?";
  return `${href}${join}from=foundation`;
}

function worldTarget(w){
  return w.href ? withFoundationReturn(w.href) : viewHref(w.view || "dashboard");
}

function speak(text){
  if(!voiceOn || !("speechSynthesis" in window)) return;
  speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(String(text));
  u.lang = "en-US";
  u.rate = .84;
  u.pitch = 1.06;
  const voices = speechSynthesis.getVoices();
  u.voice =
    voices.find(v => /female|zira|samantha|aria|jenny|hazel|sonia/i.test(v.name) && /en/i.test(v.lang)) ||
    voices.find(v => /en-(US|GB)/i.test(v.lang)) ||
    voices.find(v => /en/i.test(v.lang)) ||
    null;
  speechSynthesis.speak(u);
}

function updateVoiceButton(){
  const b = $("voiceBtn");
  if(!b) return;
  b.textContent = voiceOn ? "🔊 Voice On" : "🔇 Voice Off";
  b.setAttribute("aria-pressed",voiceOn ? "true" : "false");
}

function toast(text){
  const el = $("toast");
  if(!el) return;
  el.textContent = text;
  el.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(()=>el.classList.remove("show"),1800);
}

async function api(path,opt={}){
  const headers = {...(opt.headers||{}),Authorization:`Bearer ${token}`};
  if(opt.body && !(opt.body instanceof FormData) && !headers["Content-Type"]){
    headers["Content-Type"]="application/json";
  }
  return fetch(API+path,{...opt,headers,cache:"no-store"});
}

async function loadPhoto(){
  if(!profile?.has_photo) return;
  try{
    const r = await api("/api/student/photo");
    if(!r.ok) return;
    const blob = await r.blob();
    if(photoUrl) URL.revokeObjectURL(photoUrl);
    photoUrl = URL.createObjectURL(blob);
    $("studentPhoto").src = photoUrl;
    $("studentPhoto").hidden = false;
    $("photoFallback").hidden = true;
  }catch{}
}

function renderStats(){
  const set = completedSet();
  const lessons = [...set].filter(x => /^L\d+$/.test(String(x))).length;

  $("starsCount").textContent = Number(course.stars || 120);
  $("lessonCount").textContent = lessons;
  $("streakCount").textContent = Number(settings.streak_days || 0);
  $("badgeCount").textContent = countBadges();
}

function renderDailyMissions(){
  const day = Number(course.day || 1);
  const set = completedSet();

  const missions = [
    {
      icon:"📘",title:"Learn",
      text:"Complete or review one lesson",
      done:set.has(`mission:${day}:0`),
      href:viewHref("lessons")
    },
    {
      icon:"🗣️",title:"Speak",
      text:"Say one clear English sentence",
      done:set.has(`mission:${day}:1`),
      href:viewHref("speaking")
    },
    {
      icon:"🎮",title:"Play",
      text:"Finish one smart game level",
      done:set.has(`mission:${day}:2`),
      href:viewHref("practice")
    }
  ];

  $("dailyMissions").innerHTML = missions.map(m => `
    <button class="daily-mission ${m.done?"done":""}" data-mission-href="${esc(m.href)}" type="button">
      <span>${m.icon}</span>
      <b>${m.done?"✅ ":""}${esc(m.title)}</b>
      <small>${esc(m.text)}</small>
    </button>
  `).join("");

  document.querySelectorAll("[data-mission-href]").forEach(b=>{
    b.onclick=()=>location.href=b.dataset.missionHref;
  });
}

function renderWorlds(){
  const c = Number(profile?.class_number || 1);

  $("worldGrid").innerHTML = worlds.map(w => `
    <article
      class="world-card"
      data-world="${esc(w.id)}"
      tabindex="0"
      role="button"
      style="--c1:${w.colors[0]};--c2:${w.colors[1]}"
      aria-label="Open ${esc(w.title)}"
    >
      <div class="world-icon">${w.icon}</div>
      <h3>${esc(w.title)}</h3>
      <p>${esc(w.desc[c] || w.desc[1])}</p>
      <div class="world-meta">
        <span>CLASS ${c}</span>
        <span>OPEN ↗</span>
      </div>
    </article>
  `).join("");

  document.querySelectorAll("[data-world]").forEach(card=>{
    const open=()=>openWorld(card.dataset.world);
    card.onclick=open;
    card.onkeydown=e=>{
      if(e.key==="Enter" || e.key===" "){
        e.preventDefault();
        open();
      }
    };
  });
}


function miniLessonPicture(w,title){
  const icons = FOUNDATION_VISUALS[w.id] || [w.icon,"⭐","📘","✅"];
  return `
    <div class="mini-picture" style="--c1:${w.colors[0]};--c2:${w.colors[1]}">
      <div class="mini-picture-orb orb-a"></div>
      <div class="mini-picture-orb orb-b"></div>
      <div class="mini-picture-grid">
        <span class="mini-picture-main">${icons[0]}</span>
        <span>${icons[1]}</span>
        <span>${icons[2]}</span>
        <span>${icons[3]}</span>
      </div>
      <div class="mini-picture-caption">${esc(title)}</div>
    </div>
  `;
}

function speakMini(text,lang){
  if(!("speechSynthesis" in window)) return;
  speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(String(text || ""));
  u.lang = lang === "hi" ? "hi-IN" : "en-US";
  u.rate = lang === "hi" ? .78 : .82;
  u.pitch = 1.06;
  const voices = speechSynthesis.getVoices();
  if(lang === "hi"){
    u.voice =
      voices.find(v => /hi[-_]?IN/i.test(v.lang) && /female|swara|heera|kalpana/i.test(v.name)) ||
      voices.find(v => /hi/i.test(v.lang)) ||
      null;
  }else{
    u.voice =
      voices.find(v => /female|zira|samantha|aria|jenny|hazel|sonia/i.test(v.name) && /en/i.test(v.lang)) ||
      voices.find(v => /en-(US|GB)/i.test(v.lang)) ||
      voices.find(v => /en/i.test(v.lang)) ||
      null;
  }
  speechSynthesis.speak(u);
}

function openMiniLesson(kind,keyOrLabel){
  const w = activeWorld;
  if(!w || !profile) return;

  const c = Number(profile.class_number || 1);
  let title = "";
  let en = "";
  let hi = "";
  let badge = "";

  if(kind === "flow"){
    const stepNames = {
      look:"👀 Look",
      listen:"👂 Listen",
      try:"👆 Try",
      learn:"⭐ Learn"
    };
    const lesson = FOUNDATION_FLOW_LESSONS[w.id]?.[keyOrLabel];
    if(!lesson) return;
    title = stepNames[keyOrLabel] || "Learn";
    en = lesson[0];
    hi = lesson[1];
    badge = `${w.title} • ${title.replace(/^[^\s]+\s/,"")}`;
  }else{
    const lesson = FOUNDATION_FOCUS_LESSONS[keyOrLabel];
    if(!lesson) return;
    title = keyOrLabel;
    en = lesson[0];
    hi = lesson[1];
    badge = `${w.title} • Small Lesson`;
  }

  $("miniLessonBody").innerHTML = `
    <div class="mini-lesson-head">
      <span class="eyebrow dark">CLASS ${c} • ${esc(badge)}</span>
      <h2>${esc(title)}</h2>
      <p>Big picture • Simple English • आसान हिन्दी</p>
    </div>

    ${miniLessonPicture(w,title)}

    <div class="mini-bilingual-grid">
      <article class="mini-language-card english-card">
        <div class="mini-language-title">
          <span>🇬🇧</span>
          <b>Simple English</b>
        </div>
        <p>${esc(en)}</p>
        <button id="miniHearEnglish" class="mini-hear-btn" type="button">🔊 Hear English</button>
      </article>

      <article class="mini-language-card hindi-card" lang="hi">
        <div class="mini-language-title">
          <span>🇮🇳</span>
          <b>सरल हिन्दी</b>
        </div>
        <p>${esc(hi)}</p>
        <button id="miniHearHindi" class="mini-hear-btn" type="button">🔊 हिन्दी सुनें</button>
      </article>
    </div>

    <div class="mini-remember">
      <span>⭐</span>
      <div>
        <b>One small step at a time.</b>
        <small>एक समय में एक छोटी बात सीखो।</small>
      </div>
    </div>

    <div class="mini-lesson-actions">
      <button id="miniBackBtn" class="mini-back-btn" type="button">← Back to ${esc(w.title)}</button>
    </div>
  `;

  $("miniHearEnglish").onclick=()=>speakMini(en,"en");
  $("miniHearHindi").onclick=()=>speakMini(hi,"hi");
  $("miniBackBtn").onclick=closeMiniLesson;

  $("miniLessonModal").classList.add("open");
  $("miniLessonModal").setAttribute("aria-hidden","false");
}

function closeMiniLesson(){
  $("miniLessonModal")?.classList.remove("open");
  $("miniLessonModal")?.setAttribute("aria-hidden","true");
  try{ speechSynthesis.cancel(); }catch{}
}


function openWorld(id){
  const w = worlds.find(x=>x.id===id);
  if(!w || !profile) return;
  activeWorld = w;

  const c = Number(profile.class_number || 1);
  const focus = w.focus[c] || w.focus[1];
  const detail = w.desc[c] || w.desc[1];

  $("modalBody").innerHTML = `
    <div class="world-detail-head" style="--c1:${w.colors[0]};--c2:${w.colors[1]}">
      <div class="world-detail-icon">${w.icon}</div>
      <div>
        <span class="eyebrow dark">CLASS ${c} • FOUNDATION WORLD</span>
        <h2>${esc(w.title)}</h2>
        <p>${esc(detail)}</p>
      </div>
    </div>

    <div class="foundation-flow">
      <button type="button" data-mini-kind="flow" data-mini-key="look">👀 Look</button>
      <button type="button" data-mini-kind="flow" data-mini-key="listen">👂 Listen</button>
      <button type="button" data-mini-kind="flow" data-mini-key="try">👆 Try</button>
      <button type="button" data-mini-kind="flow" data-mini-key="learn">⭐ Learn</button>
    </div>

    <div class="focus-list">
      ${focus.map((item,i)=>`
        <button type="button" class="focus-item" data-mini-kind="focus" data-mini-label="${esc(item)}">
          <span>${i+1}</span>
          <b>${esc(item)}</b>
          <small>${esc(focusHelp(w.id,item,c))}</small>
          <em>Tap to learn →</em>
        </button>
      `).join("")}
    </div>

    <div class="detail-actions">
      <button class="detail-hear" id="detailHear" type="button">🔊 Hear This</button>
      <a class="detail-open" href="${esc(worldTarget(w))}">Open Learning Area →</a>
    </div>
  `;

  $("detailHear").onclick=()=>speak(`${w.title}. ${detail}. ${focus.join(". ")}.`);

  $("modalBody").querySelectorAll("[data-mini-kind]").forEach(el=>{
    el.onclick=()=>{
      const kind=el.dataset.miniKind;
      const value=kind==="flow" ? el.dataset.miniKey : el.dataset.miniLabel;
      openMiniLesson(kind,value);
    };
  });

  $("worldModal").classList.add("open");
  $("worldModal").setAttribute("aria-hidden","false");
  document.body.style.overflow="hidden";
}

function focusHelp(id,item,c){
  const simple = {
    computer:"Use pictures and real-life examples.",
    mousekeys:"Practise slowly. Accuracy comes before speed.",
    itlab:"Follow safe guided steps. Never force a cable.",
    english:"Listen first, then repeat in your own clear voice.",
    gk:"Look, think and answer one small question at a time.",
    healthy:"Choose one healthy habit you can practise today.",
    safety:"If unsure, stop and ask a trusted adult.",
    games:"Short games train memory, logic, focus and control.",
    creative:"Create something simple, neat and easy to explain.",
    ai:"Keep private information private and check important answers.",
    internet:"Use trusted websites and safe Wi-Fi with adult guidance.",
    tests:"Mistakes show what to practise next."
  };
  return simple[id] || `Class ${c} practice: ${item}.`;
}

function closeModal(){
  closeMiniLesson();
  $("worldModal").classList.remove("open");
  $("worldModal").setAttribute("aria-hidden","true");
  document.body.style.overflow="";
  activeWorld=null;
}

function highlightRoadmap(c){
  [1,2,3].forEach(n=>{
    $("roadmapClass"+n)?.classList.toggle("active",n===c);
  });
}

async function loadFoundation(){
  if(!token){
    location.href="student-login.html";
    return;
  }

  try{
    const r = await api("/api/auth/me");
    const d = await r.json();

    if(!r.ok || d.role!=="student" || !d.profile){
      throw new Error("Student login required");
    }

    profile = d.profile;
    const c = Number(profile.class_number || 1);

    if(c>=4 && c<=6){
      location.href="advanced-universe.html";
      return;
    }

    if(c<1 || c>3){
      location.href="student-profile.html";
      return;
    }

    $("studentChip").textContent = `👤 ${profile.display_name || profile.username || "Student"}`;
    $("classChip").textContent = `🎓 Class ${c}`;
    $("photoFallback").textContent = c===1 ? "🧒" : c===2 ? "👦" : "🧑";

    const stage = classStage(c);
    $("levelEyebrow").textContent = stage.eyebrow;
    $("heroTitle").textContent = stage.title;
    $("heroText").textContent = stage.text;
    $("worldIntro").textContent = stage.intro;
    highlightRoadmap(c);

    const [progressRes,settingsRes] = await Promise.all([
      api("/api/student/course-progress").catch(()=>null),
      api("/api/student/settings").catch(()=>null)
    ]);

    if(progressRes?.ok){
      const x = await progressRes.json();
      const p = x.progress || {};
      course = {
        day:Number(p.day_number || 1),
        stars:Number(p.stars || profile.stars || 120),
        completed:parseMaybe(p.daily_completed,[]),
        skills:parseMaybe(p.skill_scores,{})
      };
    }else{
      course.stars = Number(profile.stars || 120);
    }

    if(settingsRes?.ok){
      const x = await settingsRes.json();
      settings = x.settings || settings;
    }

    renderStats();
    renderDailyMissions();
    renderWorlds();
    await loadPhoto();

  }catch(err){
    localStorage.removeItem(TOKEN_KEY);
    location.href="student-login.html";
  }
}

async function logout(){
  try{await api("/api/auth/logout",{method:"POST"})}catch{}
  localStorage.removeItem(TOKEN_KEY);
  location.href="index.html";
}

$("voiceBtn").onclick=()=>{
  voiceOn=!voiceOn;
  localStorage.setItem(VOICE_KEY,voiceOn?"on":"off");
  updateVoiceButton();
  if(voiceOn) speak("Voice guidance is on.");
};

$("logoutBtn").onclick=logout;
$("modalClose").onclick=closeModal;
$("miniLessonClose").onclick=closeMiniLesson;

$("worldModal").addEventListener("click",e=>{
  if(e.target===$("worldModal")) closeModal();
});

$("miniLessonModal").addEventListener("click",e=>{
  if(e.target===$("miniLessonModal")) closeMiniLesson();
});

document.addEventListener("keydown",e=>{
  if(e.key!=="Escape") return;

  if($("miniLessonModal").classList.contains("open")){
    closeMiniLesson();
    return;
  }

  if($("worldModal").classList.contains("open")) closeModal();
});

updateVoiceButton();

if(document.readyState==="loading"){
  document.addEventListener("DOMContentLoaded",loadFoundation,{once:true});
}else{
  loadFoundation();
}

window.addEventListener("pageshow",()=>{
  if(profile){
    renderStats();
    renderDailyMissions();
  }
});

window.addEventListener("beforeunload",()=>{
  if(photoUrl) URL.revokeObjectURL(photoUrl);
});

})();
