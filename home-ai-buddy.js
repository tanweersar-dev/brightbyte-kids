(() => {
"use strict";

/*
  TANNU LEARNING BUDDY - FINAL FREE V15
  -------------------------------------
  FREE LOCAL MODE
  NO OPENAI API
  NO PAID CREDITS

  Uses:
  - Existing 5200+ Question Bank
  - Computer / IT
  - Networking
  - Troubleshooting
  - English
  - GK
  - Science
  - Health
  - Hygiene
  - Cyber Safety
  - AI
  - Logic
  - Life Skills

  Education-only safe chatbot.
*/

const ACADEMY_API =
  "https://brightbyte-kids-api.tanweerstudy25.workers.dev";

const QUESTION_BANK =
  Array.isArray(
    window.TANNU_QUESTION_BANK
  )
    ? window.TANNU_QUESTION_BANK
    : [];

const token =
  localStorage.getItem(
    "brightbyte_student_token"
  ) || "";

const $ = id =>
  document.getElementById(id);

let studentName = "Friend";
let panelOpen = false;


/* ===================================
   LANGUAGE
=================================== */

function normalize(text){

  return String(text || "")
    .toLowerCase()
    .replace(
      /[^\p{L}\p{N}\s+\-*/().]/gu,
      " "
    )
    .replace(/\s+/g," ")
    .trim();

}


function isHindiScript(text){

  return /[\u0900-\u097F]/.test(
    text
  );

}


function looksHinglish(text){

  const t =
    normalize(text);

  const words = [
    "kya",
    "kaise",
    "hai",
    "hain",
    "batao",
    "karo",
    "mujhe",
    "mera",
    "meri",
    "nahi",
    "kyu",
    "kyon",
    "wala",
    "wali",
    "ka",
    "ki"
  ];

  return words.some(
    word =>
      new RegExp(
        `\\b${word}\\b`
      ).test(t)
  );

}


function useHindi(text){

  return (
    isHindiScript(text) ||
    looksHinglish(text)
  );

}


/* ===================================
   KNOWLEDGE
=================================== */

const KNOWLEDGE = [];


function add(
  category,
  keys,
  en,
  hi
){

  KNOWLEDGE.push({
    category,
    keys,
    en,
    hi
  });

}


/* ---------- COMPUTER ---------- */

add(
  "Computer",
  ["computer","pc"],
  "A computer is an electronic machine that takes input, processes information, stores data and gives output.",
  "Computer ek electronic machine hai jo input leta hai, information process karta hai, data store karta hai aur output deta hai."
);


add(
  "Computer",
  ["hardware","computer parts"],
  "Hardware means the physical parts of a computer that you can see or touch.",
  "Hardware computer ke physical parts hote hain jinhe hum dekh ya touch kar sakte hain."
);


add(
  "Computer",
  ["software","program"],
  "Software is a set of programs and instructions that tells a computer what to do.",
  "Software programs aur instructions ka set hota hai jo computer ko batata hai kya kaam karna hai."
);


add(
  "Computer",
  [
    "operating system",
    "os",
    "windows"
  ],
  "An operating system manages the computer and helps hardware and programs work together.",
  "Operating system computer ko manage karta hai aur hardware aur programs ko saath kaam karne me help karta hai."
);


add(
  "Computer",
  [
    "cpu",
    "processor"
  ],
  "The CPU is the main processor. It follows instructions and performs calculations.",
  "CPU main processor hota hai. Ye instructions follow karta hai aur calculations karta hai."
);


add(
  "Computer",
  [
    "system unit",
    "cpu cabinet",
    "computer cabinet"
  ],
  "The system unit contains important computer parts such as the processor, RAM and storage.",
  "System unit ke andar processor, RAM, storage aur doosre important computer parts hote hain."
);


add(
  "Computer",
  ["ram","memory"],
  "RAM is short-term working memory. It helps active programs run smoothly.",
  "RAM short-term working memory hoti hai jo active programs ko smoothly run karne me help karti hai."
);


add(
  "Computer",
  [
    "ssd",
    "solid state drive"
  ],
  "An SSD stores files and programs. It is usually faster than a traditional hard disk.",
  "SSD files aur programs store karta hai aur usually traditional hard disk se faster hota hai."
);


add(
  "Computer",
  [
    "hdd",
    "hard disk",
    "hard drive"
  ],
  "A hard disk stores files, programs and the operating system for long-term use.",
  "Hard disk files, programs aur operating system ko long-term store karta hai."
);


add(
  "Computer",
  [
    "monitor",
    "display",
    "screen"
  ],
  "A monitor shows text, pictures, videos and other visual output from a computer.",
  "Monitor computer ka visual output dikhata hai, jaise text, pictures aur videos."
);


add(
  "Computer",
  ["keyboard"],
  "A keyboard is used to type letters, numbers, symbols and commands.",
  "Keyboard se letters, numbers, symbols aur commands type kiye jate hain."
);


add(
  "Computer",
  [
    "mouse",
    "computer mouse"
  ],
  "A mouse helps you point, click, select, drag and move things on the screen.",
  "Mouse se screen par point, click, select, drag aur move karte hain."
);


add(
  "Computer",
  ["printer","printing"],
  "A printer makes a paper copy of digital information.",
  "Printer digital information ki paper copy banata hai."
);


add(
  "Computer",
  ["scanner","scan"],
  "A scanner turns a paper document or photo into a digital copy.",
  "Scanner paper document ya photo ko digital copy me badalta hai."
);


add(
  "Computer",
  ["speaker","speakers"],
  "Speakers play sound from a computer.",
  "Speakers computer ka sound bajate hain."
);


add(
  "Computer",
  ["microphone","mic"],
  "A microphone sends your voice or other sounds into the computer.",
  "Microphone voice ya sound ko computer me input karta hai."
);


add(
  "Computer",
  [
    "webcam",
    "computer camera"
  ],
  "A webcam is a camera used for video calls, online classes and recording.",
  "Webcam computer camera hota hai jo video calls, online classes aur recording me use hota hai."
);


add(
  "Computer",
  ["usb","usb port"],
  "USB is a common connection for devices such as keyboards, mice, printers and flash drives.",
  "USB common connection hai jisse keyboard, mouse, printer aur flash drive connect hote hain."
);


add(
  "Computer",
  ["hdmi","hdmi cable"],
  "HDMI can carry digital video and sound between devices such as a computer and monitor.",
  "HDMI computer se monitor tak digital video aur sound le ja sakta hai."
);


add(
  "Computer",
  ["vga","vga cable"],
  "VGA is an older display connection used to carry video to a monitor.",
  "VGA purana display connection hai jo monitor tak video signal le jata hai."
);


add(
  "Computer",
  ["file","computer file"],
  "A file is saved information such as a document, picture, video or song.",
  "File saved information hoti hai, jaise document, picture, video ya song."
);


add(
  "Computer",
  ["folder","directory"],
  "A folder helps organize files so they are easier to find.",
  "Folder files ko organize karta hai taaki unhe aasani se find kiya ja sake."
);


add(
  "Computer",
  [
    "browser",
    "web browser",
    "chrome",
    "edge"
  ],
  "A web browser is a program used to open and view websites.",
  "Web browser ek program hai jisse websites open aur view karte hain."
);


add(
  "Computer",
  ["download","downloading"],
  "Downloading means copying a file or information from the internet to your device.",
  "Download ka matlab internet se file ya information apne device me copy karna hota hai."
);


add(
  "Computer",
  ["upload","uploading"],
  "Uploading means sending a file from your device to a website or online service.",
  "Upload ka matlab apne device se file ko website ya online service par bhejna hota hai."
);


add(
  "Computer",
  [
    "recycle bin",
    "deleted files"
  ],
  "The Recycle Bin temporarily keeps many deleted files so they can sometimes be restored.",
  "Recycle Bin kai deleted files ko temporarily rakhta hai jisse unhe kabhi-kabhi restore kiya ja sakta hai."
);


/* ---------- NETWORKING ---------- */

add(
  "Networking",
  [
    "network",
    "computer network"
  ],
  "A computer network connects devices so they can communicate and share resources.",
  "Computer network devices ko connect karta hai taaki wo communicate aur resources share kar saken."
);


add(
  "Networking",
  [
    "lan",
    "local area network"
  ],
  "A LAN connects devices in a small area such as a home, classroom or office.",
  "LAN chhote area jaise home, classroom ya office me devices ko connect karta hai."
);


add(
  "Networking",
  [
    "lan cable",
    "ethernet",
    "network cable",
    "rj45"
  ],
  "An Ethernet or LAN cable connects a device to a wired network.",
  "Ethernet ya LAN cable device ko wired network se connect karti hai."
);


add(
  "Networking",
  ["router","wifi router"],
  "A router connects networks and helps devices reach other networks and the internet.",
  "Router networks ko connect karta hai aur devices ko internet ya doosre networks tak pahunchne me help karta hai."
);


add(
  "Networking",
  ["switch","network switch"],
  "A network switch connects many devices inside the same local network.",
  "Network switch ek local network ke andar kai devices ko connect karta hai."
);


add(
  "Networking",
  ["wifi","wi-fi","wireless"],
  "Wi-Fi lets devices connect to a network without a network cable.",
  "Wi-Fi devices ko bina LAN cable ke wireless network se connect karta hai."
);


add(
  "Networking",
  ["ip","ip address"],
  "An IP address identifies a device on an IP network.",
  "IP address network me device ki pehchan ke liye use hota hai."
);


add(
  "Networking",
  ["dhcp"],
  "DHCP automatically gives devices network settings such as an IP address.",
  "DHCP automatically devices ko IP address jaise network settings deta hai."
);


add(
  "Networking",
  ["dns"],
  "DNS helps turn website names into IP addresses that computers can use.",
  "DNS website names ko IP addresses me badalne me help karta hai."
);


add(
  "Networking",
  ["gateway","default gateway"],
  "A default gateway is usually the router that helps a device communicate outside its local network.",
  "Default gateway usually router hota hai jo device ko local network ke bahar communicate karne me help karta hai."
);


add(
  "Networking",
  ["ping","ping command"],
  "Ping is a simple test used to check whether another network device can be reached.",
  "Ping simple test hai jisse check karte hain ki doosra network device reachable hai ya nahi."
);


add(
  "Networking",
  ["internet"],
  "The internet is a worldwide system of connected networks that lets devices exchange information.",
  "Internet connected networks ka worldwide system hai jahan devices information exchange karte hain."
);


add(
  "Networking",
  ["modem"],
  "A modem connects a home or office network to an internet service in many setups.",
  "Modem kai setups me home ya office network ko internet service se connect karta hai."
);


add(
  "Networking",
  [
    "access point",
    "wireless access point"
  ],
  "A wireless access point lets Wi-Fi devices join a wired network.",
  "Wireless access point Wi-Fi devices ko wired network join karne deta hai."
);


add(
  "Networking",
  [
    "nic",
    "network card",
    "network adapter"
  ],
  "A network adapter lets a device connect to a network.",
  "Network adapter device ko network se connect hone deta hai."
);


add(
  "Networking",
  ["mac address"],
  "A MAC address is a hardware identifier used by a network interface on a local network.",
  "MAC address network interface ka hardware identifier hota hai."
);


add(
  "Networking",
  ["vpn"],
  "A VPN creates a protected connection between a device and another network over the internet.",
  "VPN internet ke through device aur doosre network ke beech protected connection banata hai."
);


add(
  "Networking",
  ["packet","data packet"],
  "A packet is a small piece of data sent across a network.",
  "Packet network par bheje jane wale data ka chhota piece hota hai."
);


add(
  "Networking",
  ["bandwidth","network speed"],
  "Bandwidth describes how much data a connection can carry in a given time.",
  "Bandwidth batata hai connection ek time me kitna data carry kar sakta hai."
);


add(
  "Networking",
  [
    "network path",
    "pc switch router internet"
  ],
  "A simple wired path can be PC to switch to router or firewall and then to the internet.",
  "Simple wired path PC se switch, phir router ya firewall, aur phir internet tak ho sakta hai."
);


/* ---------- TROUBLESHOOTING ---------- */

add(
  "Troubleshooting",
  [
    "no display",
    "no signal",
    "monitor no signal"
  ],
  "First check monitor power, then check the display cable and the correct input source.",
  "Pehle monitor power check karo, phir display cable aur correct input source check karo."
);


add(
  "Troubleshooting",
  [
    "no internet",
    "internet not working",
    "internet nahi chal"
  ],
  "Check the LAN cable or Wi-Fi first, then see whether other devices can access the internet.",
  "Pehle LAN cable ya Wi-Fi check karo, phir dekho doosre devices me internet chal raha hai ya nahi."
);


add(
  "Troubleshooting",
  [
    "keyboard not working",
    "keyboard nahi chal"
  ],
  "Check the keyboard connection and try another USB port if needed.",
  "Keyboard connection check karo aur zarurat ho to doosra USB port try karo."
);


add(
  "Troubleshooting",
  [
    "mouse not working",
    "mouse nahi chal"
  ],
  "Check the mouse connection and try another USB port if needed.",
  "Mouse connection check karo aur zarurat ho to doosra USB port try karo."
);


add(
  "Troubleshooting",
  [
    "printer not printing",
    "printing problem"
  ],
  "Check printer power, paper, connection and whether the correct printer is selected.",
  "Printer power, paper, connection aur correct printer selected hai ya nahi check karo."
);


add(
  "Troubleshooting",
  [
    "computer not turning on",
    "pc not starting"
  ],
  "Check the power cable, socket or power strip, and the computer's power switch.",
  "Power cable, socket ya power strip aur computer ka power switch check karo."
);


add(
  "Troubleshooting",
  [
    "slow computer",
    "computer slow",
    "pc slow"
  ],
  "Close unnecessary programs, restart if needed, and ask an adult or technician if the problem continues.",
  "Unnecessary programs close karo, zarurat ho to restart karo, aur problem rahe to adult ya technician se help lo."
);


add(
  "Troubleshooting",
  [
    "computer frozen",
    "pc hang",
    "not responding"
  ],
  "Wait briefly, try closing the unresponsive program, and restart only if needed.",
  "Thoda wait karo, unresponsive program close karne ki koshish karo, aur zarurat par hi restart karo."
);


add(
  "Troubleshooting",
  [
    "no sound",
    "speaker not working"
  ],
  "Check volume, mute, speaker connection and the selected audio output.",
  "Volume, mute, speaker connection aur selected audio output check karo."
);


add(
  "Troubleshooting",
  [
    "wifi not connecting",
    "wifi problem"
  ],
  "Check that Wi-Fi is turned on and choose the correct network.",
  "Wi-Fi on hai ya nahi check karo aur correct network choose karo."
);


add(
  "Troubleshooting",
  ["loose cable"],
  "A loose cable can stop power, display or network signals. Connect the correct cable gently and securely.",
  "Loose cable power, display ya network signal rok sakti hai. Correct cable gently aur securely connect karo."
);


add(
  "Troubleshooting",
  ["restart","reboot"],
  "Restarting closes running programs and starts the device again. It can fix some simple temporary problems.",
  "Restart running programs ko close karke device ko dobara start karta hai. Ye kuch temporary problems fix kar sakta hai."
);


add(
  "Troubleshooting",
  ["system test"],
  "A simple system test checks power, display, keyboard, mouse, network and internet one by one.",
  "Simple system test power, display, keyboard, mouse, network aur internet ko one by one check karta hai."
);


add(
  "Troubleshooting",
  ["wrong port","wrong cable"],
  "Different cables belong in different ports. Match the connector shape and label before plugging it in.",
  "Different cables alag ports me lagte hain. Plug karne se pehle connector shape aur label match karo."
);


/* ---------- CYBER SAFETY ---------- */

add(
  "Safety",
  ["password","strong password"],
  "A strong password is hard to guess and should not be shared with other people.",
  "Strong password guess karna mushkil hota hai aur ise doosron ke saath share nahi karna chahiye."
);


add(
  "Safety",
  ["otp","one time password"],
  "An OTP is a one-time password used for verification. It should stay private.",
  "OTP verification ke liye one-time password hota hai. Ise private rakhna chahiye."
);


add(
  "Safety",
  [
    "private information",
    "personal information"
  ],
  "Private information includes passwords, OTPs, home addresses and phone numbers. Do not share it with strangers.",
  "Private information me password, OTP, home address aur phone number aate hain. Ise strangers se share mat karo."
);


add(
  "Safety",
  ["phishing","fake email"],
  "Phishing is a trick used to make people reveal private information or click unsafe links.",
  "Phishing ek trick hai jisme private information lene ya unsafe link click karwane ki koshish hoti hai."
);


add(
  "Safety",
  [
    "unknown link",
    "suspicious link"
  ],
  "Do not click an unknown or suspicious link. Ask a trusted adult if you are unsure.",
  "Unknown ya suspicious link par click mat karo. Doubt ho to trusted adult se poochho."
);


add(
  "Safety",
  [
    "online stranger",
    "stranger chat"
  ],
  "Do not share private details with an online stranger. Tell a trusted adult if someone makes you uncomfortable.",
  "Online stranger ko private details mat do. Koi uncomfortable kare to trusted adult ko batao."
);


add(
  "Safety",
  ["cyberbullying"],
  "Cyberbullying is unkind or harmful behavior online. Save evidence and tell a trusted adult.",
  "Cyberbullying online unkind ya harmful behavior hai. Evidence save karo aur trusted adult ko batao."
);


add(
  "Safety",
  ["scam","fraud"],
  "A scam tries to trick people into giving money or information. Stop, check and ask a trusted adult.",
  "Scam money ya information lene ke liye trick karta hai. Ruko, check karo aur trusted adult se poochho."
);


add(
  "Safety",
  ["trusted adult"],
  "A trusted adult can be a parent, guardian, teacher or another safe grown-up who helps protect you.",
  "Trusted adult parent, guardian, teacher ya safe grown-up ho sakta hai jo aapko protect karne me help kare."
);


add(
  "Safety",
  ["road safety"],
  "Use a safe crossing, look both ways and follow road signals.",
  "Safe crossing use karo, dono taraf dekho aur road signals follow karo."
);


/* ---------- AI ---------- */

add(
  "AI",
  [
    "ai",
    "artificial intelligence"
  ],
  "Artificial intelligence helps computers perform tasks such as understanding language, finding patterns and creating content.",
  "Artificial intelligence computers ko language samajhne, patterns find karne aur content create karne me help karta hai."
);


add(
  "AI",
  ["prompt","ai prompt"],
  "A prompt is an instruction or question you give to an AI system.",
  "Prompt ek instruction ya question hota hai jo AI system ko diya jata hai."
);


add(
  "AI",
  [
    "clear prompt",
    "good prompt",
    "better prompt"
  ],
  "A clear prompt says what you want and adds useful details.",
  "Clear prompt batata hai kya chahiye aur useful details add karta hai."
);


add(
  "AI",
  [
    "check answers",
    "ai mistake",
    "ai wrong"
  ],
  "AI can make mistakes, so important facts should be checked with a trusted source, teacher or parent.",
  "AI mistakes kar sakta hai, isliye important facts teacher, parent ya trusted source se check karo."
);


add(
  "AI",
  ["safe ai","ai safety"],
  "Use AI for learning, keep private information private and check important answers.",
  "AI ko learning ke liye use karo, private information private rakho aur important answers check karo."
);


add(
  "AI",
  [
    "fake image",
    "ai generated image"
  ],
  "Some images can be created or changed by AI. Check the source and context before believing an image.",
  "Kuch images AI se create ya change ho sakti hain. Believe karne se pehle source aur context check karo."
);


/* ---------- ENGLISH ---------- */

add(
  "English",
  ["hello","hi","greeting"],
  "A friendly greeting can be 'Hello' or 'Hi'.",
  "Friendly greeting 'Hello' ya 'Hi' ho sakti hai."
);


add(
  "English",
  ["thank you","thanks"],
  "Say 'Thank you' when someone helps you or gives you something.",
  "Jab koi help kare ya kuch de to 'Thank you' bolna achha manner hai."
);


add(
  "English",
  ["please"],
  "Use 'please' to make a request more polite.",
  "Request ko polite banane ke liye 'please' use karte hain."
);


add(
  "English",
  ["sorry"],
  "Say 'sorry' when you make a mistake, and try to make it right.",
  "Galti ho to 'sorry' bolo aur galti ko theek karne ki koshish karo."
);


add(
  "English",
  [
    "introduce yourself",
    "self introduction"
  ],
  "A simple introduction is: Hello, my name is ___. I am happy to meet you.",
  "Simple introduction: Hello, my name is ___. I am happy to meet you."
);


add(
  "English",
  ["ask for help","help"],
  "You can politely say: Excuse me, can you please help me?",
  "Aap politely bol sakte ho: Excuse me, can you please help me?"
);


add(
  "English",
  ["repeat"],
  "Repeat means to say or do something again.",
  "Repeat ka matlab kisi cheez ko dobara bolna ya karna hota hai."
);


add(
  "English",
  ["friend","friendship"],
  "A good friend is kind, respectful and helpful.",
  "Good friend kind, respectful aur helpful hota hai."
);


add(
  "English",
  ["good listener"],
  "A good listener waits for their turn and listens carefully.",
  "Good listener apni turn ka wait karta hai aur carefully sunta hai."
);


add(
  "English",
  ["confidence","speak confidently"],
  "Confidence grows with practice. Start with short sentences and practise a little every day.",
  "Confidence practice se grow hota hai. Short sentences se start karo aur roz thoda practise karo."
);


/* ---------- HEALTH ---------- */

add(
  "Health",
  ["water","hydration"],
  "Water helps the body work properly. Drink water regularly during the day.",
  "Water body ko properly kaam karne me help karta hai. Din bhar regular water piyo."
);


add(
  "Health",
  ["fruit","fruits"],
  "Fruit can be part of a balanced diet and provides useful nutrients.",
  "Fruit balanced diet ka part ho sakta hai aur useful nutrients deta hai."
);


add(
  "Health",
  ["vegetables"],
  "Vegetables provide useful nutrients and fiber and can be part of a balanced meal.",
  "Vegetables useful nutrients aur fiber dete hain aur balanced meal ka part ho sakte hain."
);


add(
  "Health",
  ["breakfast"],
  "Breakfast can give energy for learning and play.",
  "Breakfast learning aur play ke liye energy de sakta hai."
);


add(
  "Health",
  ["sleep"],
  "Good sleep helps children learn, grow and feel ready for the day.",
  "Good sleep children ko learn, grow aur day ke liye ready feel karne me help karti hai."
);


add(
  "Health",
  [
    "hand washing",
    "wash hands"
  ],
  "Wash hands with soap before eating and after using the toilet to help remove germs.",
  "Khana khane se pehle aur toilet ke baad soap se hands wash karo."
);


add(
  "Health",
  ["teeth","brush teeth"],
  "Brush teeth twice a day and ask a grown-up or dentist for help if there is pain.",
  "Din me do baar teeth brush karo aur pain ho to grown-up ya dentist se help lo."
);


add(
  "Health",
  ["movement","exercise"],
  "Regular movement, play and exercise help keep the body strong and healthy.",
  "Regular movement, play aur exercise body ko strong aur healthy rakhte hain."
);


add(
  "Health",
  ["screen break","eye break"],
  "Take regular screen breaks and look away from the screen to rest your eyes.",
  "Regular screen breaks lo aur eyes ko rest dene ke liye screen se door dekho."
);


add(
  "Health",
  ["germs"],
  "Germs are tiny organisms. Some can cause illness, so cleanliness and handwashing are useful.",
  "Germs tiny organisms hote hain. Kuch illness cause kar sakte hain, isliye cleanliness useful hai."
);


/* ---------- LOGIC ---------- */

add(
  "Logic",
  ["pattern"],
  "A pattern is something that repeats or follows a rule.",
  "Pattern wo hota hai jo repeat hota hai ya kisi rule ko follow karta hai."
);


add(
  "Logic",
  ["sequence"],
  "A sequence is a set of things arranged in a particular order.",
  "Sequence cheezon ka set hota hai jo particular order me arranged hota hai."
);


add(
  "Logic",
  ["matching"],
  "Matching means finding things that belong together.",
  "Matching ka matlab un cheezon ko find karna hai jo saath belong karti hain."
);


add(
  "Logic",
  ["odd one out"],
  "Odd one out means finding the item that does not fit the same group or rule.",
  "Odd one out me wo item find karte hain jo same group ya rule me fit nahi hota."
);


add(
  "Logic",
  ["memory"],
  "Memory helps us store and remember information.",
  "Memory information ko store aur remember karne me help karti hai."
);


add(
  "Logic",
  ["observation"],
  "Observation means looking or listening carefully to notice useful details.",
  "Observation ka matlab carefully dekhna ya sunna hai taaki useful details notice ho saken."
);


/* ---------- GK / SCIENCE ---------- */

add(
  "GK",
  [
    "capital of india",
    "india capital",
    "bharat ki rajdhani"
  ],
  "The capital of India is New Delhi.",
  "India ki capital New Delhi hai."
);


add(
  "GK",
  [
    "capital of bihar",
    "bihar capital",
    "bihar ki rajdhani"
  ],
  "The capital of Bihar is Patna.",
  "Bihar ki capital Patna hai."
);


add(
  "Science",
  ["earth"],
  "Earth is the planet where we live. It has land, water and an atmosphere.",
  "Earth wo planet hai jahan hum rehte hain. Isme land, water aur atmosphere hai."
);


add(
  "Science",
  ["sun"],
  "The Sun is a star that gives Earth light and heat.",
  "Sun ek star hai jo Earth ko light aur heat deta hai."
);


add(
  "Science",
  ["moon"],
  "The Moon is Earth's natural satellite.",
  "Moon Earth ka natural satellite hai."
);


add(
  "Science",
  ["solar system"],
  "The Solar System includes the Sun, eight planets and many smaller objects.",
  "Solar System me Sun, eight planets aur many smaller objects hote hain."
);


add(
  "Science",
  ["heart"],
  "The heart pumps blood around the body.",
  "Heart body me blood ko pump karta hai."
);


add(
  "Science",
  ["lungs"],
  "The lungs help us breathe and bring oxygen into the body.",
  "Lungs hume breathe karne aur oxygen body me lane me help karte hain."
);


add(
  "Science",
  ["brain"],
  "The brain helps us think, learn, remember and control many body activities.",
  "Brain hume think, learn, remember aur body ke many activities control karne me help karta hai."
);


add(
  "Science",
  ["plant","plants"],
  "Plants need light, water, air and nutrients to grow.",
  "Plants ko grow karne ke liye light, water, air aur nutrients chahiye."
);


add(
  "Science",
  ["water cycle"],
  "The water cycle includes evaporation, condensation and precipitation.",
  "Water cycle me evaporation, condensation aur precipitation hote hain."
);


add(
  "GK",
  [
    "current affairs",
    "current leader",
    "prime minister",
    "president",
    "chief minister"
  ],
  "Current affairs can change. Please use the academy's dated Current Affairs Corner and check an up-to-date trusted source with a teacher or parent.",
  "Current affairs change ho sakte hain. Academy ka dated Current Affairs Corner use karo aur teacher ya parent ke saath updated trusted source check karo."
);


/* ===================================
   SAFETY / OFF-TOPIC
=================================== */

const PRIVATE_INFO =
  /my password is|mera password|my otp is|mera otp|my phone number is|mera phone number|my address is|mera address/i;


const UNSAFE =
  /porn|nude|sexual content|make a bomb|bomb kaise|kill someone|hurt someone|suicide method|self harm method/i;


const OFF_TOPIC =
  /dating|girlfriend|boyfriend|romance|dirty joke|adult chat|gambling|betting|casino|alcohol|cigarette|vape|gaali|abuse/i;


function educationOnly(text){

  if(useHindi(text)){

    return (
      "Main Tannu Learning Buddy hoon 😊 " +
      "Main sirf education aur safe learning se related sawalon me help karta hoon. " +
      "Computer, Networking, English, GK, Science, Health, Hygiene, Cyber Safety, AI, Logic ya school learning se sawal poochho."
    );

  }


  return (
    "I'm Tannu Learning Buddy 😊 " +
    "I only help with education and safe learning questions. " +
    "Ask me about Computers, Networking, English, GK, Science, Health, Hygiene, Cyber Safety, AI, Logic or school learning."
  );

}


/* ===================================
   MATCHING
=================================== */

function score(
  question,
  target
){

  const q =
    normalize(question);

  const t =
    normalize(target);

  if(!q || !t) return 0;


  if(q === t){
    return 1000;
  }


  if(q.includes(t)){
    return 700 + t.length;
  }


  const qWords =
    new Set(
      q.split(" ")
    );


  const tWords =
    t.split(" ")
      .filter(
        word =>
          word.length > 1
      );


  let hits = 0;


  tWords.forEach(
    word => {

      if(qWords.has(word)){
        hits++;
      }

    }
  );


  if(!hits){
    return 0;
  }


  return (
    hits /
    Math.max(
      1,
      tWords.length
    )
  ) * 200;

}


function findKnowledge(
  question
){

  let best = null;
  let bestScore = 0;


  for(
    const item of
    KNOWLEDGE
  ){

    for(
      const key of
      item.keys
    ){

      const value =
        score(
          question,
          key
        );


      if(
        value >
        bestScore
      ){

        bestScore =
          value;

        best =
          item;

      }

    }

  }


  if(
    best &&
    bestScore >= 90
  ){

    return best;

  }


  return null;

}


/* ===================================
   5200 QUESTION BANK
=================================== */

function findQuestionBank(
  question
){

  if(
    !QUESTION_BANK.length
  ){
    return null;
  }


  let best = null;
  let bestScore = 0;


  for(
    const row of
    QUESTION_BANK
  ){

    const qScore =
      score(
        question,
        row.q || ""
      );


    const aScore =
      score(
        question,
        row.a || ""
      ) + 20;


    const value =
      Math.max(
        qScore,
        aScore
      );


    if(
      value >
      bestScore
    ){

      bestScore =
        value;

      best =
        row;

    }

  }


  if(
    !best ||
    bestScore < 120
  ){

    return null;

  }


  const rich =
    findKnowledge(
      best.a
    );


  if(rich){

    return useHindi(question)
      ? rich.hi
      : rich.en;

  }


  if(
    useHindi(question)
  ){

    return (
      `${best.a} academy ka ${best.cat || "learning"} topic hai. ` +
      "Isko lesson, practical, game aur teacher-guided practice ke saath learn karo."
    );

  }


  return (
    `${best.a} is an academy ${best.cat || "learning"} topic. ` +
    "Learn it through the related lesson, practical activity, game or teacher-guided practice."
  );

}


/* ===================================
   SIMPLE MATH
=================================== */

function mathAnswer(
  question
){

  const q =
    normalize(question)
      .replace(/x/g,"*");


  const m =
    q.match(
      /(-?\d+(?:\.\d+)?)\s*([+\-*/])\s*(-?\d+(?:\.\d+)?)/
    );


  if(!m){
    return null;
  }


  const a =
    Number(m[1]);

  const operator =
    m[2];

  const b =
    Number(m[3]);


  let result;


  if(operator === "+"){
    result = a + b;
  }


  if(operator === "-"){
    result = a - b;
  }


  if(operator === "*"){
    result = a * b;
  }


  if(operator === "/"){

    if(b === 0){

      return useHindi(question)
        ? "Zero se divide nahi kar sakte."
        : "You cannot divide by zero.";

    }

    result = a / b;

  }


  if(
    !Number.isFinite(result)
  ){
    return null;
  }


  const finalValue =
    Number.isInteger(result)
      ? result
      : Math.round(
          result * 1000
        ) / 1000;


  return useHindi(question)
    ? `Answer ${finalValue} hai.`
    : `The answer is ${finalValue}.`;

}


/* ===================================
   MAIN ANSWER
=================================== */

function getAnswer(
  question
){

  const text =
    String(
      question || ""
    ).trim();


  if(!text){
    return educationOnly(text);
  }


  if(
    PRIVATE_INFO.test(text)
  ){

    return useHindi(text)
      ? "Private information share mat karo. Password, OTP, phone number aur home address hamesha private rakho. 🔐"
      : "Please do not share private information. Keep passwords, OTPs, phone numbers and home addresses private. 🔐";

  }


  if(
    UNSAFE.test(text)
  ){

    return useHindi(text)
      ? "Main dangerous ya unsafe request me help nahi karta. Safe education topic poochho. Agar real danger ho to trusted adult ko turant batao."
      : "I can't help with dangerous or unsafe requests. Ask a safe education question. If there is real danger, tell a trusted adult immediately.";

  }


  if(
    OFF_TOPIC.test(text)
  ){
    return educationOnly(text);
  }


  const math =
    mathAnswer(text);


  if(math){
    return math;
  }


  const knowledge =
    findKnowledge(text);


  if(knowledge){

    return useHindi(text)
      ? knowledge.hi
      : knowledge.en;

  }


  const bank =
    findQuestionBank(text);


  if(bank){
    return bank;
  }


  return educationOnly(text);

}


/* ===================================
   SPEECH
=================================== */

function speak(text){

  if(
    !(
      "speechSynthesis"
      in window
    )
  ){
    return;
  }


  speechSynthesis.cancel();


  const u =
    new SpeechSynthesisUtterance(
      text
    );


  u.lang =
    useHindi(text)
      ? "hi-IN"
      : "en-US";


  u.rate = 0.78;

  u.pitch = 1.04;


  const language =
    u.lang
      .toLowerCase()
      .split("-")[0];


  const voices =
    speechSynthesis
      .getVoices();


  const voice =
    voices.find(
      item =>
        (
          item.lang || ""
        )
          .toLowerCase()
          .startsWith(
            language
          )
    );


  if(voice){
    u.voice = voice;
  }


  speechSynthesis.speak(u);

}


/* ===================================
   STUDENT
=================================== */

async function loadStudent(){

  if(!token){
    return;
  }


  try{

    const response =
      await fetch(
        ACADEMY_API +
        "/api/auth/me",
        {
          headers:{
            Authorization:
              `Bearer ${token}`
          },

          cache:
            "no-store"
        }
      );


    const result =
      await response.json();


    if(
      response.ok &&
      result.role ===
        "student"
    ){

      studentName =
        result.profile
          ?.display_name ||
        result.profile
          ?.nickname ||
        result.profile
          ?.username ||
        "Friend";

    }

  }catch{}

}


/* ===================================
   STYLE
=================================== */

function addStyle(){

  if(
    $("finalBuddyStyle")
  ){
    return;
  }


  const style =
    document.createElement(
      "style"
    );


  style.id =
    "finalBuddyStyle";


  style.textContent = `

  #finalBuddy{
    position:fixed;
    right:22px;
    bottom:110px;
    width:min(
      410px,
      calc(100vw - 24px)
    );
    max-height:650px;
    display:none;
    flex-direction:column;
    z-index:100000;
    background:#fff;
    border:
      1px solid
      #e5e7f3;
    border-radius:26px;
    overflow:hidden;
    box-shadow:
      0 25px 70px
      rgba(28,34,95,.30);
    font-family:
      Inter,
      system-ui,
      -apple-system,
      "Segoe UI",
      sans-serif;
  }


  #finalBuddy.show{
    display:flex;
    animation:
      buddyPop
      .2s ease;
  }


  .buddy-head{
    display:grid;
    grid-template-columns:
      auto 1fr auto;
    gap:10px;
    align-items:center;
    padding:14px;
    color:#fff;
    background:
      linear-gradient(
        135deg,
        #11194b,
        #6758f6 58%,
        #24cfc2
      );
  }


  .buddy-avatar{
    width:46px;
    height:46px;
    display:grid;
    place-items:center;
    border-radius:15px;
    background:#ffffff18;
    font-size:28px;
  }


  .buddy-head b,
  .buddy-head small{
    display:block;
  }


  .buddy-head b{
    font-size:15px;
  }


  .buddy-head small{
    margin-top:2px;
    font-size:9px;
    opacity:.88;
  }


  #buddyClose{
    width:34px;
    height:34px;
    border:0;
    border-radius:50%;
    background:#ffffff18;
    color:#fff;
    font-size:22px;
    font-weight:900;
  }


  .buddy-chat{
    min-height:285px;
    max-height:345px;
    overflow:auto;
    padding:13px;
    background:
      linear-gradient(
        180deg,
        #f7f8ff,
        #fff
      );
  }


  .buddy-bubble{
    max-width:88%;
    margin:7px 0;
    padding:11px 13px;
    border-radius:16px;
    font-size:12px;
    line-height:1.5;
    font-weight:700;
  }


  .buddy-bubble.bot{
    background:#efedff;
    color:#4d46a2;
    border-bottom-left-radius:5px;
  }


  .buddy-bubble.user{
    margin-left:auto;
    background:#e8fff7;
    color:#177459;
    border-bottom-right-radius:5px;
  }


  .buddy-quick{
    display:grid;
    grid-template-columns:
      1fr 1fr;
    gap:7px;
    padding:10px 12px;
    border-top:
      1px solid
      #edf0f7;
  }


  .buddy-quick button{
    min-height:40px;
    border:0;
    border-radius:12px;
    background:#f4f3ff;
    color:#554ac5;
    font-size:10px;
    font-weight:1000;
  }


  .buddy-input{
    display:grid;
    grid-template-columns:
      1fr 45px 45px;
    gap:7px;
    padding:10px 12px;
    border-top:
      1px solid
      #edf0f7;
  }


  #buddyInput{
    width:100%;
    padding:10px 11px;
    border:
      2px solid
      #dde1ef;
    border-radius:13px;
    outline:none;
    font-size:12px;
  }


  #buddyInput:focus{
    border-color:#786bff;
    box-shadow:
      0 0 0 3px
      rgba(108,92,255,.10);
  }


  #buddyMic,
  #buddySend{
    border:0;
    border-radius:13px;
    font-size:17px;
  }


  #buddyMic{
    background:#ffe6f3;
  }


  #buddySend{
    color:#fff;
    background:
      linear-gradient(
        135deg,
        #6c5cff,
        #24cfc2
      );
  }


  .buddy-footer{
    padding:8px;
    text-align:center;
    color:#747b96;
    background:#fafbff;
    font-size:9px;
    font-weight:900;
  }


  @keyframes buddyPop{

    from{
      opacity:0;
      transform:
        translateY(10px)
        scale(.96);
    }

    to{
      opacity:1;
      transform:none;
    }

  }


  @keyframes buddyGlow{

    from{
      filter:
        drop-shadow(
          0 0 4px
          rgba(108,92,255,.30)
        );
    }

    to{
      filter:
        drop-shadow(
          0 0 10px
          rgba(108,92,255,.80)
        )
        drop-shadow(
          0 0 18px
          rgba(36,207,194,.55)
        );

      transform:
        translateY(-3px);
    }

  }


  @media(max-width:600px){

    #finalBuddy{
      right:10px;
      bottom:92px;
      width:
        calc(100vw - 20px);
    }

  }


  @media(
    prefers-reduced-motion:
    reduce
  ){

    #helper{
      animation:none!important;
    }

  }

  `;


  document.head.appendChild(
    style
  );

}


/* ===================================
   PANEL
=================================== */

function buildPanel(){

  if(
    $("finalBuddy")
  ){
    return;
  }


  addStyle();


  const panel =
    document.createElement(
      "div"
    );


  panel.id =
    "finalBuddy";


  const total =
    Math.max(
      5200,
      QUESTION_BANK.length
    );


  panel.innerHTML = `

    <div class="buddy-head">

      <div class="buddy-avatar">
        🤖
      </div>

      <div>
        <b>Tannu Learning Buddy</b>

        <small>
          EDUCATION ONLY • FREE • VOICE
        </small>
      </div>

      <button id="buddyClose">
        ×
      </button>

    </div>


    <div
      id="buddyChat"
      class="buddy-chat"
    >

      <div class="buddy-bubble bot">

        Hi ${studentName}! 👋

        Main sirf education aur safe
        learning ke sawalon me help
        karta hoon.

        Computer, Networking,
        English, GK, Science,
        Health, Safety, AI ya
        Logic poochho.

      </div>

    </div>


    <div class="buddy-quick">

      <button
        data-question="What is RAM?"
      >
        💻 RAM
      </button>

      <button
        data-question="Internet nahi chal raha hai"
      >
        🌐 Network
      </button>

      <button
        data-question="Bihar ki capital kya hai?"
      >
        🌍 GK
      </button>

      <button
        data-question="Tell me one cyber safety rule"
      >
        🛡️ Safety
      </button>

    </div>


    <div class="buddy-input">

      <input
        id="buddyInput"
        maxlength="300"
        placeholder="Ask an education question..."
      >

      <button
        id="buddyMic"
        title="Speak"
      >
        🎤
      </button>

      <button
        id="buddySend"
        title="Send"
      >
        ➤
      </button>

    </div>


    <div class="buddy-footer">

      ${total}+ EDUCATIONAL Q&A
      • NO PAID API

    </div>

  `;


  document.body.appendChild(
    panel
  );


  $("buddyClose")
    .onclick =
      closePanel;


  $("buddySend")
    .onclick =
      sendTyped;


  $("buddyMic")
    .onclick =
      listen;


  $("buddyInput")
    .addEventListener(
      "keydown",
      event => {

        if(
          event.key ===
          "Enter"
        ){
          sendTyped();
        }

      }
    );


  panel
    .querySelectorAll(
      "[data-question]"
    )
    .forEach(
      button => {

        button.onclick =
          () =>
            ask(
              button.dataset
                .question
            );

      }
    );

}


/* ===================================
   CHAT
=================================== */

function addBubble(
  text,
  type
){

  const chat =
    $("buddyChat");


  const bubble =
    document.createElement(
      "div"
    );


  bubble.className =
    `buddy-bubble ${type}`;


  bubble.textContent =
    text;


  chat.appendChild(
    bubble
  );


  chat.scrollTop =
    chat.scrollHeight;

}


function ask(text){

  text =
    String(text || "")
      .trim();


  if(!text){
    return;
  }


  addBubble(
    text,
    "user"
  );


  const answer =
    getAnswer(text);


  setTimeout(
    () => {

      addBubble(
        answer,
        "bot"
      );

      speak(answer);

    },
    180
  );

}


function sendTyped(){

  const input =
    $("buddyInput");


  const value =
    input.value;


  input.value =
    "";


  ask(value);

}


/* ===================================
   VOICE INPUT
=================================== */

function listen(){

  const SpeechRecognition =
    window.SpeechRecognition ||
    window.webkitSpeechRecognition;


  if(!SpeechRecognition){

    addBubble(
      "Voice input is not available in this browser. Please type your question.",
      "bot"
    );

    return;
  }


  const recognition =
    new SpeechRecognition();


  recognition.lang =
    "hi-IN";


  recognition.interimResults =
    false;


  recognition.maxAlternatives =
    1;


  $("buddyMic")
    .textContent =
      "🔴";


  recognition.onresult =
    event => {

      const text =
        event.results[0][0]
          .transcript;


      ask(text);

    };


  recognition.onerror =
    () => {

      addBubble(
        "I could not hear clearly. Please try again.",
        "bot"
      );

    };


  recognition.onend =
    () => {

      $("buddyMic")
        .textContent =
          "🎤";

    };


  try{

    recognition.start();

  }catch{}

}


/* ===================================
   OPEN / CLOSE
=================================== */

function openPanel(){

  buildPanel();


  $("finalBuddy")
    .classList.add(
      "show"
    );


  panelOpen =
    true;

}


function closePanel(){

  const panel =
    $("finalBuddy");


  if(panel){

    panel.classList.remove(
      "show"
    );

  }


  panelOpen =
    false;

}


/* ===================================
   ROBOT
=================================== */

function connectHelper(){

  const helper =
    $("helper");


  if(!helper){
    return;
  }


  const clone =
    helper.cloneNode(
      true
    );


  helper.parentNode
    .replaceChild(
      clone,
      helper
    );


  clone.title =
    "Ask Tannu Learning Buddy";


  clone.setAttribute(
    "aria-label",
    "Ask Tannu Learning Buddy"
  );


  const small =
    clone.querySelector(
      "small"
    );


  if(small){

    small.textContent =
      "Ask Me!";

  }


  clone.style.animation =
    "buddyGlow 1.5s infinite alternate";


  clone.addEventListener(
    "click",
    () => {

      if(panelOpen){

        closePanel();

      }else{

        openPanel();

      }

    }
  );

}


/* ===================================
   START
=================================== */

async function boot(){

  await loadStudent();


  window.TANNU_BUDDY_QA_COUNT =
    Math.max(
      5200,
      QUESTION_BANK.length
    );


  window.TANNU_BUDDY_TOPIC_COUNT =
    KNOWLEDGE.length;


  connectHelper();

}


if(
  document.readyState ===
  "loading"
){

  document.addEventListener(
    "DOMContentLoaded",
    boot
  );

}else{

  boot();

}

})();
