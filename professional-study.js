(() => {
"use strict";

/* ============================================================
   V46.0 — PROFESSIONAL STUDY CENTER
   Study Notes -> 10 Question Knowledge Check -> Practical Lab
   Class 7–10 only. Existing API / exams / practicals preserved.
   ============================================================ */

const API="https://api.tanweer.site";
const TOKEN=localStorage.getItem("brightbyte_student_token")||"";
const $=id=>document.getElementById(id);
const esc=v=>String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const Q=(q,o,a,e)=>({q,o,a,e});
const CH=(title,level,summary,sections)=>({title,level,summary,sections});
const SEC=(h,body,extra={})=>({h,body,...extra});


const REAL_PHOTOS={
 motherboard:{url:"https://commons.wikimedia.org/wiki/Special:FilePath/Computer_motherboard.jpg?width=1000",label:"Desktop motherboard",credit:"Wikimedia Commons — CC0"},
 ssd:{url:"https://commons.wikimedia.org/wiki/Special:FilePath/SSD_M.2.svg?width=1000",label:"M.2 solid-state drive",credit:"Wikimedia Commons — CC BY-SA"},
 psu:{url:"https://commons.wikimedia.org/wiki/Special:FilePath/Power_supply.JPG?width=1000",label:"Computer power supply",credit:"Wikimedia Commons — CC0"},
 nic:{url:"https://commons.wikimedia.org/wiki/Special:FilePath/Ethernet_pci_card.jpg?width=1000",label:"Ethernet network card",credit:"Wikimedia Commons"},
 switch:{url:"https://commons.wikimedia.org/wiki/Special:FilePath/Network_switches.jpg?width=1200",label:"Network switch",credit:"Wikimedia Commons — CC BY-SA"},
 router:{url:"https://commons.wikimedia.org/wiki/Special:FilePath/Wireless_Router.jpg?width=1200",label:"Router",credit:"Wikimedia Commons"},
 camera:{url:"https://commons.wikimedia.org/wiki/Special:FilePath/Camera_IP.JPG?width=900",label:"IP surveillance camera",credit:"Wikimedia Commons"}
};

const TRACKS={
 hardware:{
  icon:"🖥️",title:"Computer Hardware & PC Technician",short:"Parts, assembly, disassembly, upgrades and fault diagnosis.",lab:"hardware",
  chapters:[
   CH("PC Parts and Safe Working","FOUNDATION","Know every major desktop part before touching the machine.",[
    SEC("What is computer hardware?",["Hardware means the physical parts of a computer that you can touch. A desktop computer normally contains a motherboard, processor, RAM, storage drive, SMPS/power supply, cooling system and network interface.","Each part has a different job. A technician should identify the part, understand its purpose and check simple causes before replacing anything."],{diagram:"pc-parts",tip:"A good technician does not guess. First observe the symptom, then test one thing at a time.",safety:"Switch off the PC, remove the power cable and use anti-static precautions before opening the case."}),
    SEC("Motherboard, CPU, RAM and storage",["The motherboard connects the main components and provides slots, ports and power paths.","The processor (CPU) executes instructions. It needs correct cooling and a working CPU fan.","RAM stores temporary working data. A loose or faulty RAM module can cause no display, beeps, crashes or restart loops.","SSD/HDD stores Windows, applications and user files. SSD is faster and has no moving mechanical parts."],{visual:"components",photo:"motherboard"}),
    SEC("SMPS, cooling, NIC and monitor",["The SMPS converts AC mains power into low-voltage DC power for the motherboard, CPU, drives and accessories.","Cooling fans and heat sinks remove heat. Too much dust or dried thermal compound can cause overheating.","A NIC connects the computer to Ethernet or Wi-Fi. A monitor displays the video signal; no display does not automatically mean the monitor is faulty."],{warning:"Never open an SMPS for student repair. Internal capacitors can hold dangerous voltage even after unplugging.",photo:"psu"})
   ]),
   CH("Computer Assembly — Build in the Correct Order","INSTALL & CONFIGURE","Assemble a desktop carefully and verify each connection.",[
    SEC("Before assembly",["Prepare a clean table, Phillips screwdriver, cable ties and anti-static protection.","Confirm motherboard and CPU socket compatibility, supported RAM type, suitable case size and enough SMPS wattage.","Do not force connectors. Most plugs and modules have a correct direction."],{diagram:"assembly-flow"}),
    SEC("Recommended assembly sequence",["1. Install the CPU into the motherboard socket without touching the contact area.","2. Apply or confirm thermal compound and install the CPU cooler.","3. Install RAM in the recommended slots.","4. Install the motherboard into the case using correct standoffs.","5. Install SSD/HDD and the SMPS.","6. Connect 24-pin motherboard power and CPU power.","7. Connect front-panel power switch, USB, audio and storage cables.","8. Install expansion cards if required.","9. Recheck every cable before first power-on."],{tip:"For a first boot, connect only essential parts: motherboard, CPU/cooler, one RAM module, display and power. This makes troubleshooting easier."}),
    SEC("First power-on checks",["Confirm fans spin normally and there is no burning smell or unusual sound.","Enter BIOS/UEFI and check CPU temperature, RAM amount and storage detection.","If the system reaches BIOS, the basic hardware is communicating. Then continue with Windows and driver checks."],{diagram:"boot-check"})
   ]),
   CH("Computer Disassembly, Cleaning and Upgrade","INSTALL & CONFIGURE","Remove parts safely, label cables and avoid creating a new fault.",[
    SEC("Safe disassembly sequence",["Shut down Windows, unplug power and press the power button for a few seconds to discharge residual power.","Take a photo of cable positions if you are learning.","Remove external cables, side panel, expansion cards, storage drives, RAM and other parts as required.","Keep screws separated and never place loose metal screws on the motherboard."],{diagram:"disassembly-flow"}),
    SEC("Cleaning and inspection",["Use a soft brush or controlled compressed air for dust. Hold fans so they do not spin at extreme speed.","Inspect for loose cables, broken ports, damaged fan blades, swelling/leaking components or signs of overheating.","Do not wash electronic parts with water. Use suitable electronics cleaning methods only."],{safety:"Do not touch power-supply internals. Do not scrape motherboard tracks or CPU socket contacts."}),
    SEC("Common upgrades",["RAM upgrade: confirm DDR generation, capacity support and correct slots.","SSD upgrade: confirm SATA or NVMe type, clone or reinstall Windows as planned, then verify boot order.","Graphics card upgrade: confirm slot, case space and power-supply capacity.","Always verify the system after an upgrade before closing the case completely."])
   ]),
   CH("Hardware Fault Diagnosis — SSD, SMPS, Motherboard, CPU, RAM, Monitor","TROUBLESHOOT & SUPPORT","Use symptoms and safe tests instead of replacing random parts.",[
    SEC("Diagnostic thinking",["Start with the symptom: no power, no display, slow computer, restart, storage missing, overheating or visual problem.","Check the easiest external causes first: wall power, cable, switch, display input, loose connectors and recent changes.","Change one variable at a time and verify after each step."],{diagram:"diagnose-flow"}),
    SEC("Part-by-part fault table",[],{table:[
      ["Part","Possible symptoms","Safe checks","Likely action"],
      ["SSD","Windows slow, boot error, drive disappears, file errors","Check BIOS detection, cable/slot, Disk Management, SMART/health, test another port","Back up data; replace cable/drive if failure is confirmed"],
      ["SMPS","No power, sudden shutdown, unstable restart","Check socket/cable, rear switch, 24-pin/CPU power, known-good PSU test by trained person","Replace faulty PSU; do not open it for student repair"],
      ["Motherboard","No POST, ports dead, RAM not detected, unstable system","Verify PSU, RAM, CPU power, CMOS reset procedure, visible inspection","Repair only by qualified board technician or replace"],
      ["Processor / cooling","Overheating, shutdown, very high temperature, no POST in some cases","Check fan, heat sink seating, BIOS temperature, socket compatibility","Reseat cooler, renew thermal compound, replace confirmed faulty part"],
      ["RAM","Beep codes, no display, blue screens, crashes","Reseat RAM, test one stick at a time, try supported slot, memory test","Replace failing module"],
      ["Monitor","No image, flicker, wrong color, no signal","Check power LED, source/input, cable, another port, another PC","Replace cable/adapter first; repair/replace monitor if confirmed"]
    ]}),
    SEC("Example: PC powers on but there is no display",["Do not immediately blame the monitor. Check monitor power and selected input first.","Check HDMI/DisplayPort/VGA cable and test another known-good cable.","Reseat RAM and try one module if safe.","If a graphics card is installed, verify its power and output port.","Observe POST lights or beep codes if the motherboard provides them."],{common:"Fault isolation means proving what works as well as finding what does not work."})
   ]),
   CH("BIOS/UEFI, Health Checks and Handover","BUILD, NETWORK & SOLVE","Verify the machine after repair and document what changed.",[
    SEC("BIOS/UEFI basics",["BIOS/UEFI starts hardware before Windows loads. It can show CPU, RAM, storage, boot order, fan information and other firmware settings.","Change only settings you understand. Wrong settings can stop the system from booting correctly."],{diagram:"bios"}),
    SEC("After-repair verification",["Confirm Windows starts normally.","Check Device Manager for missing drivers.","Check storage health and free space.","Test network, audio, USB and display.","Monitor temperature and restart the PC once to confirm stability."],{tip:"A repair is not complete until you verify the original problem is gone and basic functions still work."}),
    SEC("Technician handover",["Record the reported problem, tests performed, part changed, final result and any recommendation.","Example: 'SSD intermittently missing from BIOS. SATA cable replaced and drive tested. Five restarts passed. User advised to maintain backup.'"])
   ])
  ],
  quiz:[
   Q("Which part connects most internal PC components?",["Motherboard","Monitor","Keyboard"],0,"The motherboard connects CPU, RAM, storage interfaces and expansion devices."),
   Q("Before opening a desktop case, what should you do first?",["Shut down and unplug power","Install a game","Increase volume"],0,"Power must be removed before safe internal work."),
   Q("A PC has no display. What is a good first check?",["Monitor power/input and video cable","Replace motherboard immediately","Format the SSD"],0,"Always check simple external causes before internal replacement."),
   Q("What is a safe student action for a suspected SMPS fault?",["Test/replace with a known-good PSU under proper supervision","Open the PSU and touch capacitors","Pour cleaner inside"],0,"Do not open an SMPS; high voltage can remain inside."),
   Q("An SSD is not detected. Which check is useful?",["BIOS/UEFI detection and cable/slot","Speaker volume","Wallpaper setting"],0,"Detection at firmware level helps separate storage hardware from Windows issues."),
   Q("A loose RAM module can cause?",["No display or crashes","Faster internet","More storage"],0,"Poor RAM contact can stop POST or cause instability."),
   Q("What should happen after changing a hardware part?",["Verify the original problem and basic functions","Close the ticket without testing","Change more parts randomly"],0,"Verification proves the repair worked."),
   Q("CPU overheating is often related to?",["Cooling/fan/heat sink/thermal compound","Email password","Printer toner"],0,"The CPU depends on effective cooling."),
   Q("Why take a cable photo before disassembly?",["To help reconnect parts correctly","To increase CPU speed","To reset Windows"],0,"A reference photo helps avoid incorrect reconnection."),
   Q("Which tool shows full Windows adapter details?",["ipconfig /all","paint","calc"],0,"ipconfig /all shows network adapter configuration, useful after a hardware/network repair.")
  ]
 },

 software:{
  icon:"💻",title:"Computer Software & Windows Support",short:"Operating systems, drivers, installation, recovery and software troubleshooting.",lab:"hardware",
  chapters:[
   CH("System Software, Applications and Drivers","FOUNDATION","Understand the software layers that make hardware useful.",[
    SEC("Software types",["System software includes the operating system and core services that manage hardware and applications.","Application software includes programs such as browsers, Office apps, media tools and school software.","A device driver is software that allows Windows to communicate correctly with hardware such as audio, graphics, Wi-Fi, printer or chipset devices."],{diagram:"software-stack"}),
    SEC("Why drivers matter",["Windows may install many drivers automatically, but some devices still need the correct manufacturer driver.","A missing or wrong driver can cause unknown devices, poor performance or a feature that does not work."],{tip:"Use Device Manager to identify the device state before downloading random drivers."})
   ]),
   CH("Windows Installation and Partition Basics","INSTALL & CONFIGURE","Prepare, install and verify Windows safely.",[
    SEC("Before installation",["Back up important user files.","Confirm hardware supports the Windows version.","Prepare approved installation media and required licenses/organization process.","Know whether the job is a clean installation or repair/upgrade."],{diagram:"windows-install"}),
    SEC("Simple installation flow",["Boot from approved USB media.","Choose language and keyboard.","Select the correct disk/partition carefully.","Complete installation and initial setup.","Install updates and required drivers.","Verify activation according to the organization's license method."],{safety:"Deleting or formatting the wrong partition can destroy data. Backup and confirm the target disk first."})
   ]),
   CH("Device Manager, Drivers and Updates","INSTALL & CONFIGURE","Find missing devices and restore normal hardware operation.",[
    SEC("Device Manager",["A yellow warning symbol usually means Windows has detected a problem with the device or driver.","Open device properties and read the status message and hardware IDs when required.","Install drivers from a trusted manufacturer or approved organization source."],{diagram:"device-manager"}),
    SEC("Windows Update",["Updates can fix bugs and security problems and may provide drivers.","After important updates, restart when required and re-test the original issue."],{tip:"Document the old and new driver version when a driver change solves an important problem."})
   ]),
   CH("Recovery and Common Windows Problems","TROUBLESHOOT & SUPPORT","Use the least destructive recovery method first.",[
    SEC("Common problems",["Windows does not boot.","PC is very slow.","Application crashes.","Disk is full.","Driver stopped working after an update.","User profile or startup application creates a problem."],{diagram:"windows-troubleshoot"}),
    SEC("Recovery order",["Restart and reproduce the issue.","Check free disk space and Task Manager.","Use Safe Mode when normal startup prevents diagnosis.","Use approved repair, uninstall/rollback, restore point or recovery options as appropriate.","Reinstall Windows only when justified and after protecting data."],{common:"Formatting is not the first answer to every Windows problem."})
   ]),
   CH("Software Support Handover","BUILD, NETWORK & SOLVE","Leave the user with a stable, documented machine.",[
    SEC("Final checks",["Test login, network, browser, Office or required application, audio/display and printers as relevant.","Confirm updates are not stuck and there are no unknown critical devices.","Tell the user what changed and whether a restart or follow-up is required."])
   ])
  ],
  quiz:[
   Q("What does a device driver do?",["Helps Windows communicate with hardware","Stores paper","Creates electricity"],0,"Drivers connect the operating system to hardware functions."),
   Q("A yellow warning in Device Manager usually means?",["A device/driver problem needs attention","The monitor is too bright","The user has email"],0,"Device Manager warning icons indicate device status problems."),
   Q("Before a clean Windows installation, what is most important?",["Back up important data","Delete every partition immediately","Disable the monitor"],0,"A clean install can erase data."),
   Q("What is Safe Mode useful for?",["Starting Windows with a reduced set of drivers/services for troubleshooting","Making Wi-Fi faster","Printing photos"],0,"Safe Mode helps isolate startup and driver/software problems."),
   Q("If disk space is almost zero, Windows may become?",["Slow or unstable","A router","A printer"],0,"Windows needs free space for normal operation."),
   Q("Where should drivers normally come from?",["Trusted manufacturer or approved source","Unknown random download site","Chat message attachment from a stranger"],0,"Trusted sources reduce malware and compatibility risk."),
   Q("After installing a driver, what should you do?",["Test the device again","Assume it works","Delete Windows"],0,"Verification confirms the fix."),
   Q("Formatting should be?",["A justified later step, not the first answer to every fault","The first step for all issues","Used to fix a loose cable"],0,"Start with less destructive diagnosis."),
   Q("What tool shows running applications and resource use?",["Task Manager","Notepad only","Paint"],0,"Task Manager helps investigate CPU, memory, disk and app activity."),
   Q("A good support handover includes?",["Problem, action, result and recommendation","Only the technician name","No testing"],0,"Documentation makes support professional and repeatable.")
  ]
 },

 microsoft:{
  icon:"☁️",title:"Microsoft 365 & Office Support",short:"Outlook, email, OneDrive, Teams, MFA and cloud support.",lab:"microsoft",
  chapters:[
   CH("Microsoft 365 and Cloud Identity","FOUNDATION","Understand the account, services and cloud model.",[
    SEC("What is Microsoft 365?",["Microsoft 365 is a set of cloud and productivity services that can include Outlook/Exchange Online, OneDrive, Teams and Office applications depending on the organization license.","A work or school account is different from a personal local Windows account. Identity, security rules and licenses may be controlled by the organization."],{diagram:"m365-flow"}),
    SEC("Common support checks",["Confirm the correct username/account.","Check internet connectivity.","Check whether the problem affects one app, one user or many users.","Check service status using the organization's approved method when a wider outage is suspected."])
   ]),
   CH("Outlook and Email Basics","INSTALL & CONFIGURE","Understand message flow and common Outlook settings.",[
    SEC("Email fields",["To is for the main recipient.","CC copies another recipient visibly.","BCC sends a hidden copy where other recipients cannot see that address.","The subject should clearly describe the message purpose."],{diagram:"email-flow"}),
    SEC("Simple troubleshooting",["Check internet and sign-in first.","Confirm the mailbox is accessible in web Outlook if the desktop app has a problem.","Check whether send, receive or both are affected.","Review attachment size/type and mailbox/storage issues when relevant."],{tip:"Testing web Outlook can help separate an account/mailbox problem from a desktop Outlook application problem."})
   ]),
   CH("OneDrive and Teams","INSTALL & CONFIGURE","Work with cloud files and collaboration safely.",[
    SEC("OneDrive",["OneDrive synchronizes supported files between the cloud and devices.","A sync icon can show whether a file is available, syncing or has a problem.","Deleting a synchronized file may also remove it from other synced locations, so understand the sync relationship."],{diagram:"onedrive"}),
    SEC("Teams",["Teams supports chat, meetings, channels and file collaboration depending on organization settings.","For audio/video problems check selected microphone, speaker, camera, permissions and network quality."])
   ]),
   CH("Passwords, MFA and Safe Sign-in","TROUBLESHOOT & SUPPORT","Support sign-in without asking users for secret codes.",[
    SEC("MFA",["Multi-factor authentication adds another proof beyond the password, such as an authenticator approval or security key.","A support technician should never ask a user to reveal an OTP or authenticator code."],{diagram:"mfa",safety:"Passwords, OTPs, recovery codes and private keys are secrets. Do not collect them in notes or AI prompts."}),
    SEC("Support approach",["Confirm username and error message.","Check date/time and network when relevant.","Use approved password reset or account recovery procedure.","Escalate identity/security problems according to organization policy."])
   ]),
   CH("Professional Office Support","BUILD, NETWORK & SOLVE","Combine user communication with technical checks.",[
    SEC("Example ticket",["User says: 'Outlook cannot send email.' Technician checks internet, web Outlook, mailbox access, error message and whether only one message/attachment fails.","After repair, send a test message and ask the user to confirm normal operation."])
   ])
  ],
  quiz:[
   Q("BCC is used to?",["Hide that recipient address from other recipients","Turn off internet","Install Windows"],0,"BCC recipients are not shown to other message recipients."),
   Q("A useful first Outlook test is?",["Check internet and sign-in","Replace motherboard","Reset BIOS"],0,"Email needs a working connection and authenticated account."),
   Q("Web Outlook works but desktop Outlook fails. This suggests?",["The mailbox may be fine and the desktop app/profile needs checking","The building has no electricity","The SSD must be dead"],0,"Web access helps isolate desktop application issues."),
   Q("OneDrive primarily helps with?",["Cloud file storage/sync","CPU cooling","PoE camera power"],0,"OneDrive is a cloud file service."),
   Q("Teams microphone problem: check?",["Selected audio device and permission","Router hostname only","Printer toner"],0,"Wrong device selection or permissions are common causes."),
   Q("MFA adds?",["Another authentication factor","More RAM","A second monitor"],0,"MFA strengthens account authentication."),
   Q("Should an IT technician ask for the user's OTP?",["No","Yes always","Only by email"],0,"OTP codes are secret."),
   Q("CC means?",["A visible copy to another recipient","Hidden copy","Delete email"],0,"CC recipients are visible."),
   Q("After fixing Outlook, what should be verified?",["Send/receive test and user confirmation","Only wallpaper","Nothing"],0,"Verify the original service works."),
   Q("A wider Microsoft 365 outage may affect?",["Many users/services, not only one PC","Only one mouse button","Only BIOS"],0,"Scope helps distinguish local and service-wide problems.")
  ]
 },

 ai:{
  icon:"🤖",title:"AI for IT Work",short:"Prompting, research, verification, IT support and responsible use.",lab:"ai",
  chapters:[
   CH("What AI Is and What It Is Not","FOUNDATION","Use AI as an assistant, not an unquestioned authority.",[
    SEC("Simple definition",["AI systems can generate or analyze text, images and other information based on patterns learned from data.","AI can explain, summarize, draft and suggest ideas, but it can also produce incorrect or invented information."],{diagram:"ai-flow"}),
    SEC("Safe rule",["Do not share passwords, OTPs, private personal data or confidential company data in an AI prompt.","Important technical commands, facts and decisions should be checked before use."],{safety:"AI can assist a technician. It does not remove the technician's responsibility to verify the answer."})
   ]),
   CH("Better Prompt Writing","INSTALL & CONFIGURE","Give enough context to get a useful answer.",[
    SEC("Prompt formula",["Role: tell AI what kind of helper to be.","Task: clearly state what you want.","Audience: Class 8 student, user, manager, technician, etc.","Format: bullets, table, email, SOP or checklist.","Limits: simple English, short answer, no confidential data."],{diagram:"prompt"}),
    SEC("Example",["Weak: 'network problem'.","Better: 'Act as a junior IT support trainer. Explain why a Windows PC may get 169.254.x.x. Give a 5-step troubleshooting checklist in simple English for a Class 9 student.'"])
   ]),
   CH("AI Research and Fact Checking","TROUBLESHOOT & SUPPORT","Research faster without copying blindly.",[
    SEC("Safe research workflow",["Ask AI for an outline.","Identify facts, dates, commands or numbers that require verification.","Check trusted notes, official documentation or teacher-approved sources.","Rewrite the final answer in your own words and keep source references when needed."],{diagram:"research"}),
    SEC("School project use",["AI can help create headings, quiz questions, revision cards and presentation structure.","The student should understand the final work and be able to explain it without reading an AI answer word-for-word."])
   ]),
   CH("AI for IT Support","BUILD, NETWORK & SOLVE","Use AI for drafts, checklists and documentation.",[
    SEC("Useful tasks",["Draft a polite ticket reply.","Create a troubleshooting checklist.","Explain an error message in simple English.","Turn technician notes into an SOP draft.","Create an inventory table structure or Excel formula explanation."],{diagram:"ai-support"}),
    SEC("Verification",["Remove confidential data before prompting.","Check every command and technical recommendation.","Review tone and facts before sending an AI-assisted email to a user."])
   ])
  ],
  quiz:[
   Q("AI answers should be?",["Verified when important","Trusted blindly","Used with passwords"],0,"AI can make mistakes."),
   Q("Which data should not be placed in a normal AI prompt?",["Passwords and OTPs","A public study topic","A generic example IP"],0,"Secrets and confidential data need protection."),
   Q("A strong prompt includes?",["Clear task, audience and format","Only one vague word","No context ever"],0,"Clear context improves output."),
   Q("AI can help an IT technician create?",["A troubleshooting checklist draft","Electricity by itself","A physical cable connection"],0,"AI is useful for drafts and structured guidance."),
   Q("After AI suggests a command, you should?",["Understand and verify it before use","Run it blindly on production","Send it to every PC"],0,"Commands can have consequences."),
   Q("Good research workflow is?",["Outline, verify, rewrite","Copy blindly","Ignore sources"],0,"Verification is essential."),
   Q("Who is responsible for the final support reply?",["The human technician/user sending it","The AI only","Nobody"],0,"Human review remains necessary."),
   Q("A prompt audience means?",["Who the answer is for","The laptop brand","The IP gateway"],0,"Audience guides difficulty and tone."),
   Q("AI can help with SOPs by?",["Turning verified steps into a structured draft","Guaranteeing every step is correct without review","Replacing all testing"],0,"AI can structure content but needs verification."),
   Q("Best student use of AI?",["Learn, practise and verify","Cheat without understanding","Share private data"],0,"AI should support learning and responsible work.")
  ]
 },

 cyber:{
  icon:"🛡️",title:"Cybersecurity",short:"Passwords, MFA, phishing, malware, updates, backup and incident response.",lab:"cyber",
  chapters:[
   CH("Security Basics and Least Privilege","FOUNDATION","Protect accounts, devices and information.",[
    SEC("Security goals",["Confidentiality means information is seen only by authorized people.","Integrity means information is not changed improperly.","Availability means authorized users can access systems when needed."],{diagram:"cia"}),
    SEC("Least privilege",["Users and applications should receive only the permissions they need for their job.","Administrator rights should not be used for ordinary tasks when they are not needed."])
   ]),
   CH("Passwords, MFA and Passkeys","INSTALL & CONFIGURE","Use strong authentication and protect recovery methods.",[
    SEC("Good account habits",["Use long, unique passwords or passphrases.","Use MFA where available.","Never share OTP or recovery codes.","Use the organization's approved password manager/security method if provided."],{diagram:"mfa"})
   ]),
   CH("Phishing and Social Engineering","TROUBLESHOOT & SUPPORT","Recognize messages that try to trick the user.",[
    SEC("Warning signs",["Unexpected urgency or threat.","Sender/address mismatch.","Suspicious link or attachment.","Request for password, OTP, payment or confidential information.","Message style that does not match the normal process."],{diagram:"phishing",common:"Do not click just to 'see what happens'. Report suspicious messages using the approved process."})
   ]),
   CH("Malware, Updates and Backup","TROUBLESHOOT & SUPPORT","Reduce risk and recover from problems.",[
    SEC("Protection layers",["Keep Windows and applications patched.","Use approved endpoint protection/antivirus.","Avoid unknown software and USB devices.","Maintain backups according to the organization's or family's plan."],{diagram:"security-layers"}),
    SEC("If malware is suspected",["Do not keep using the machine for sensitive work.","Follow the approved isolation/reporting process.","Preserve useful evidence and escalate instead of trying random cleanup tools."],{safety:"On company devices, follow the organization's incident process. Do not erase evidence on your own."})
   ]),
   CH("Basic Incident Response","BUILD, NETWORK & SOLVE","Report clearly and help limit damage.",[
    SEC("Simple flow",["Recognize the incident.","Report/escalate quickly.","Contain according to procedure.","Investigate with authorized tools.","Recover and verify.","Document lessons learned."],{diagram:"incident"})
   ])
  ],
  quiz:[
   Q("MFA improves security by?",["Adding another authentication factor","Adding RAM","Changing wallpaper"],0,"MFA requires more than a password."),
   Q("A suspicious email asks for your OTP. What should you do?",["Do not share it and report the message","Send the OTP","Forward it to everyone"],0,"OTP codes are secret."),
   Q("Least privilege means?",["Only necessary access","Everyone is admin","No passwords"],0,"Limit permissions to what is required."),
   Q("A phishing warning sign is?",["Urgent request for credentials","Normal approved internal process","A known school note"],0,"Urgency plus credential requests is suspicious."),
   Q("Why install security updates?",["To fix known vulnerabilities and bugs","To make the monitor heavier","To change cables"],0,"Patches reduce known software risk."),
   Q("A backup helps when?",["Files are lost or systems must be recovered","The mouse color is wrong","The router label is missing"],0,"Backups support recovery."),
   Q("If malware is suspected on a company device?",["Follow incident/reporting procedure","Hide it","Install random tools from unknown websites"],0,"Controlled response protects systems and evidence."),
   Q("Integrity means?",["Data is not improperly changed","The PC is always online","Everyone sees all files"],0,"Integrity protects correctness of data."),
   Q("Should normal users always have admin rights?",["No","Yes always","Only to browse websites"],0,"Least privilege reduces risk."),
   Q("A good incident note includes?",["What happened, when, affected system and actions taken","Only emojis","No timeline"],0,"Clear facts help responders investigate.")
  ]
 },

 projects:{
  icon:"🗂️",title:"Project Portfolio",short:"Website, personal portfolio, small-office network, documentation and capstone evidence.",lab:"projects",
  chapters:[
   CH("Build a Simple Website","FOUNDATION","Understand the minimum pieces of a small website project.",[
    SEC("Website building blocks",["HTML provides page structure and content.","CSS controls visual design and responsive layout.","JavaScript can add interaction.","Hosting publishes the files so users can access the site.","DNS connects a domain name to the hosting/service location."],{diagram:"website-flow"}),
    SEC("Starter project",["Create Home, About, Skills/Projects and Contact sections.","Use clear headings and readable text.","Make the layout work on phone and desktop.","Keep private personal data out of public pages."])
   ]),
   CH("Personal IT Portfolio","INSTALL & CONFIGURE","Show skills and evidence instead of only listing claims.",[
    SEC("Useful portfolio sections",["Professional introduction.","Skills grouped by category.","Projects with screenshots/diagrams.","Certificates and learning achievements.","Contact method suitable for the student/parent context."],{diagram:"portfolio"}),
    SEC("Evidence",["For each project write: problem, tools, what you built, what you tested and what you learned.","A short network diagram or before/after screenshot is stronger than a vague sentence."])
   ]),
   CH("Small Office Network Project","TROUBLESHOOT & SUPPORT","Design a network from ISP to end devices.",[
    SEC("Basic path",["The ISP provides internet service to a modem/ONT or handoff.","A router connects the local network to other networks and acts as a default gateway.","A switch connects many wired LAN devices.","PCs, printers, access points and IP cameras use the LAN."],{diagram:"office-network"}),
    SEC("Simple addressing plan",["Router LAN: 192.168.10.1/24","PC1: 192.168.10.10/24","Printer: 192.168.10.20/24","NVR: 192.168.10.30/24","Gateway for clients: 192.168.10.1","DNS example for a lab: 8.8.8.8 or the assigned/approved DNS service."],{code:["Addressing Plan","Router  192.168.10.1 /24","PC      192.168.10.10 /24","Printer 192.168.10.20 /24","NVR     192.168.10.30 /24","Gateway 192.168.10.1"]}),
    SEC("Cisco router starter configuration",["The exact interface name depends on the router model/lab. Use the correct interface in your simulator or device."],{code:["Cisco IOS — simple LAN interface","enable","configure terminal","hostname R1","interface gigabitEthernet 0/0","ip address 192.168.10.1 255.255.255.0","no shutdown","exit","end","show ip interface brief"],commands:[["enable","Enter privileged EXEC mode."],["configure terminal","Enter global configuration mode."],["hostname R1","Set a clear device name."],["interface gigabitEthernet 0/0","Enter the selected interface configuration."],["ip address ...","Assign the interface IPv4 address and mask."],["no shutdown","Administratively enable the interface."],["show ip interface brief","Verify interface addresses and status."]]})
   ]),
   CH("Project Documentation and Handover","BUILD, NETWORK & SOLVE","Present the project like a junior technician.",[
    SEC("What to submit",["Title and goal.","Network or system diagram.","IP/address plan where relevant.","Configuration summary.","Test results.","Problems found and fixes.","Screenshots/photos that do not expose passwords or sensitive information.","Final handover note."],{diagram:"handover"})
   ])
  ],
  quiz:[
   Q("HTML mainly provides?",["Page structure/content","Internet electricity","Router firmware"],0,"HTML structures web content."),
   Q("CSS mainly controls?",["Visual design/layout","DHCP leases","CPU voltage"],0,"CSS styles web pages."),
   Q("DNS connects?",["Names to network destinations/IP services","RAM to CPU physically","Camera lens to sensor"],0,"DNS resolves names."),
   Q("A strong portfolio project shows?",["What you built and evidence/tests","Only a title","Only your favorite color"],0,"Evidence proves practical work."),
   Q("In a small office LAN, the default gateway is commonly?",["The router/firewall LAN interface","The keyboard","The monitor"],0,"The gateway forwards traffic to remote networks."),
   Q("What does 'no shutdown' do on a Cisco interface?",["Enables the interface administratively","Deletes the router","Changes DNS"],0,"Cisco interfaces can be administratively shut down."),
   Q("What command quickly shows Cisco interface IP/status?",["show ip interface brief","paint","format c:"],0,"It provides a concise interface summary."),
   Q("A project handover should include?",["Tests and final result","Passwords","Nothing"],0,"Testing and documentation make the project repeatable."),
   Q("A network diagram helps because?",["It shows how devices connect","It increases RAM","It fixes a cable automatically"],0,"Diagrams communicate architecture clearly."),
   Q("Should screenshots expose passwords?",["No","Yes","Only public Wi-Fi passwords"],0,"Sensitive data should not be published.")
  ]
 },

 network:{
  icon:"🌐",title:"Network Engineering",short:"LAN/WAN, IP, switching, routing, Wi-Fi, Cisco basics and troubleshooting.",lab:"network",
  chapters:[
   CH("How a Small Network Connects to the Internet","FOUNDATION","See the full path before learning individual settings.",[
    SEC("Internet path",["An ISP is the company/service that provides internet connectivity.","The ISP line may terminate on a modem or fiber ONT.","A router or firewall connects the private local network to other networks.","A switch provides many wired LAN ports for PCs, printers, access points, IP phones and cameras."],{diagram:"office-network"}),
    SEC("Device roles",["Router: forwards packets between IP networks and is often the default gateway.","Switch: forwards Ethernet frames inside the LAN using MAC addresses.","Access Point: connects Wi-Fi clients to the LAN.","NIC: the network interface inside an endpoint.","Firewall: applies security rules to traffic."],{visual:"network-devices",photo:"switch"})
   ]),
   CH("IPv4, Private/Public Networks, Mask, Gateway, DHCP, DNS and NAT","FOUNDATION","Understand every value a Windows technician checks.",[
    SEC("Private network",["A private network is an internal network whose private IPv4 addresses are not directly routed across the public Internet.","Private ranges are 10.0.0.0/8, 172.16.0.0 through 172.31.255.255 (/12), and 192.168.0.0/16.","Homes, schools and offices commonly use these ranges for internal devices."],{diagram:"ipv4-flow"}),
    SEC("Public network / public IP",["A public IP address is globally routable on the Internet and is normally provided or routed by an ISP.","Many private devices can share internet access through one or more public addresses using NAT on a router/firewall.","Do not assume every public address is safe to expose; firewalls and secure configuration are still required."],{tip:"Private does not automatically mean secure. Security still depends on access controls, updates and firewall policy."}),
    SEC("Subnet mask and gateway",["The subnet mask tells the device which IP addresses are considered local.","In a simple /24 network, mask 255.255.255.0 means addresses with the same first three octets are normally in the same subnet.","The default gateway is the router/firewall address used when the destination is outside the local subnet."],{code:["Simple Client Example","IP Address : 192.168.10.25","Subnet Mask: 255.255.255.0","Gateway    : 192.168.10.1","DNS        : 192.168.10.1 or approved DNS"]}),
    SEC("DHCP, DNS and APIPA",["DHCP automatically gives clients an IP address, subnet mask, gateway and often DNS settings.","DNS translates names such as a website hostname into IP addresses.","If Windows cannot obtain a normal DHCP lease, it may self-assign an APIPA address in 169.254.0.0/16. This is a strong clue to check DHCP path/configuration."],{common:"If you can ping an external IP but names do not work, investigate DNS separately from routing."})
   ]),
   CH("Switching, MAC Addresses and VLAN Basics","INSTALL & CONFIGURE","Understand how local Ethernet traffic is organized.",[
    SEC("Switching",["A switch learns source MAC addresses on its ports and uses its MAC address table to forward frames efficiently.","Link lights only prove some physical link condition; they do not prove IP configuration is correct."],{diagram:"switching"}),
    SEC("VLAN",["A VLAN creates a logical Layer-2 separation on a managed switch.","Devices in different VLANs need Layer-3 routing to communicate.","Access ports normally carry one user VLAN; trunk ports can carry multiple VLANs between compatible network devices."],{diagram:"vlan"}),
    SEC("Cisco switch starter commands",["These commands are simplified for a training lab. Exact interfaces depend on the switch."],{code:["Cisco IOS — access VLAN example","enable","configure terminal","hostname SW1","vlan 10","name STAFF","interface fa0/5","switchport mode access","switchport access vlan 10","no shutdown","end","show vlan brief","show mac address-table"],commands:[["vlan 10","Create or enter VLAN 10."],["name STAFF","Give the VLAN a readable name."],["switchport mode access","Make the port an access port."],["switchport access vlan 10","Place the access port into VLAN 10."],["show vlan brief","Verify VLANs and access-port membership."],["show mac address-table","See learned MAC addresses."]]})
   ]),
   CH("Cisco Router Basic Configuration","INSTALL & CONFIGURE","Configure a simple LAN interface and verify it.",[
    SEC("Router LAN interface",["The router LAN interface can act as the default gateway for the local subnet.","Use an address plan before typing commands."],{code:["Cisco IOS — basic router LAN","enable","configure terminal","hostname R1","interface gigabitEthernet 0/0","description LAN-GATEWAY","ip address 192.168.10.1 255.255.255.0","no shutdown","exit","end","show ip interface brief","show ip route"],commands:[["enable","Enter privileged mode."],["configure terminal","Enter configuration mode."],["description LAN-GATEWAY","Document the purpose of the interface."],["ip address ...","Assign the gateway IP and subnet mask."],["no shutdown","Enable the interface."],["show ip route","Review the routing table."]]})
   ]),
   CH("Windows Network Troubleshooting","TROUBLESHOOT & SUPPORT","Check physical, IP, gateway, DNS and path in a logical order.",[
    SEC("Useful commands",["ipconfig /all — inspect adapter details, DHCP, DNS, gateway and MAC information.","ping 127.0.0.1 — basic local TCP/IP stack test.","ping <gateway> — test local Layer-3 reachability to the gateway.","ping <external IP> — test routing without depending on DNS.","nslookup <name> — test name resolution.","tracert <destination> — view Layer-3 hops toward a destination.","ipconfig /release and /renew — request a new DHCP lease.","ipconfig /flushdns — clear the local DNS resolver cache."],{diagram:"troubleshoot-path",code:["Windows CLI","ipconfig /all","ping 192.168.10.1","ping 8.8.8.8","nslookup example.com","tracert example.com","ipconfig /release","ipconfig /renew","ipconfig /flushdns"]}),
    SEC("Troubleshooting order",["1. Check cable/Wi-Fi and adapter state.","2. Check IP address, subnet mask, gateway and DNS.","3. If 169.254.x.x appears, investigate DHCP.","4. Ping the gateway.","5. Test an external IP.","6. Test DNS name resolution.","7. Document what failed and what passed."],{tip:"A passing test is evidence. It narrows the problem just as much as a failing test."})
   ])
  ],
  quiz:[
   Q("Which device normally forwards traffic between IP networks?",["Router","Switch only","Patch panel"],0,"Routers make Layer-3 forwarding decisions."),
   Q("Which is a private IPv4 range?",["192.168.0.0/16","8.8.8.0/24","1.1.1.0/24"],0,"192.168.0.0/16 is private RFC1918 space."),
   Q("What is the default gateway used for?",["Sending traffic to remote networks","Storing files","Cooling the CPU"],0,"Remote traffic is sent to a router/gateway."),
   Q("169.254.x.x on Windows often suggests?",["Normal DHCP lease was not obtained","Cisco VLAN is always correct","Internet speed is maximum"],0,"APIPA is a common DHCP troubleshooting clue."),
   Q("DNS mainly does what?",["Resolves names to IP addresses","Supplies electrical power","Stores camera video"],0,"DNS is name resolution."),
   Q("A switch learns?",["MAC addresses","Passwords","CPU temperature"],0,"Switches build a MAC address table."),
   Q("What does 'no shutdown' do on Cisco IOS interface?",["Administratively enables it","Deletes it","Makes it a DNS server"],0,"The command removes the administrative shutdown state."),
   Q("Which command verifies VLANs?",["show vlan brief","ipconfig /flushdns","format"],0,"show vlan brief lists VLAN information."),
   Q("If ping 8.8.8.8 works but website names fail, check?",["DNS","Monitor brightness","CPU fan"],0,"Routing can work while DNS fails."),
   Q("A good first troubleshooting layer is?",["Physical link/adapter state","Replace the router immediately","Delete all VLANs"],0,"Start with simple physical and local checks.")
  ]
 },

 support:{
  icon:"🎧",title:"IT Support & Help Desk",short:"Tickets, user communication, diagnosis, remote support and documentation.",lab:"support",
  chapters:[
   CH("How an IT Support Ticket Starts","FOUNDATION","Ask good questions before touching settings.",[
    SEC("Scope the problem",["Ask what is not working, when it started and whether it worked before.","Ask what changed recently.","Find whether one user/device or many users are affected.","Record the exact error message when possible."],{diagram:"support-flow"}),
    SEC("Professional communication",["Use simple language with users.","Do not blame the user.","Repeat the problem back in your own words to confirm understanding.","Tell the user before you make a change that may interrupt work."])
   ]),
   CH("Troubleshooting Method","INSTALL & CONFIGURE","Use a repeatable process.",[
    SEC("Ask → Observe → Check → Diagnose → Fix → Verify → Document",["Ask for symptoms and scope.","Observe the error yourself if possible.","Check power, cable, network and obvious settings.","Form a likely cause and test it.","Apply the safest appropriate fix.","Verify with the user.","Document the resolution."],{diagram:"support-flow",tip:"Avoid changing many unrelated settings at once. You may hide the real cause."})
   ]),
   CH("Common Desktop Support Cases","TROUBLESHOOT & SUPPORT","Practise the faults users actually report.",[
    SEC("Internet not working",["Check cable/Wi-Fi and adapter state.","Run ipconfig /all.","Check 169.254.x.x, gateway and DNS.","Ping gateway, external IP and then test DNS."],{code:["Network quick check","ipconfig /all","ping <gateway>","ping 8.8.8.8","nslookup example.com"]}),
    SEC("Printer not printing",["Check printer power and error display.","Confirm correct printer/queue.","Check network/IP reachability for a network printer.","Check queue, driver and TCP/IP port as required.","Print a test page and confirm with the user."]),
    SEC("Outlook or application problem",["Check internet, sign-in and error message.","Try the web version if available to isolate desktop app vs service/account.","Check application updates/profile/settings according to the approved support method."])
   ]),
   CH("Remote Support, Escalation and Safety","TROUBLESHOOT & SUPPORT","Know when to continue and when to escalate.",[
    SEC("Remote support",["Confirm the correct user/device before connecting.","Explain what you are doing.","Use approved remote-support tools.","Do not ask users to send passwords or OTPs."],{safety:"Remote access must follow organization policy and user authorization."}),
    SEC("Escalation",["Escalate when permissions, risk, specialist knowledge or business impact is beyond your role.","Include the symptoms, tests already performed, results and screenshots/logs that are safe to share."])
   ]),
   CH("Documentation and Closure","BUILD, NETWORK & SOLVE","Close tickets with evidence.",[
    SEC("Good closure note",["Issue: what the user reported.","Cause: confirmed or most likely cause.","Action: what you changed.","Verification: how you proved the service works.","Recommendation: anything the user/next team should know."],{diagram:"handover"})
   ])
  ],
  quiz:[
   Q("First good support question is?",["What exactly is not working and when did it start?","What is your password?","Can I replace everything?"],0,"Start by understanding symptoms and scope."),
   Q("Why ask whether many users are affected?",["To identify scope/outage vs local issue","To change wallpaper","To increase RAM"],0,"Scope guides diagnosis and escalation."),
   Q("After applying a fix, what comes next?",["Verify the problem is solved","Close without testing","Change another setting"],0,"Verification is part of support."),
   Q("A user has 169.254.x.x. What area should you investigate?",["DHCP/network path","Printer toner","Monitor input"],0,"APIPA usually indicates DHCP was not obtained."),
   Q("For a network printer, a useful check is?",["Printer IP reachability and TCP/IP port","CPU thermal paste","Router hostname only"],0,"Network printing depends on correct address/port."),
   Q("Should support ask for the user's OTP?",["No","Yes","Only in chat"],0,"OTP is secret."),
   Q("Escalation notes should include?",["Symptoms and tests already performed","Nothing","Only the user's name"],0,"Good notes avoid repeated work."),
   Q("Remote support should use?",["Approved tools and authorization","Unknown software from random links","No user awareness"],0,"Remote access requires controlled tools and permission."),
   Q("Changing many settings at once is risky because?",["You may hide the real cause","It always makes the PC faster","It improves documentation"],0,"Change one relevant variable at a time."),
   Q("A professional ticket closure includes?",["Issue, action, verification and recommendation","Only 'done'","A password"],0,"Clear closure notes create useful support history.")
  ]
 },

 cctv:{
  icon:"📹",title:"CCTV & IP Surveillance",short:"Analog/IP cameras, PoE, NVR/DVR, addressing, recording and troubleshooting.",lab:"cctv",
  chapters:[
   CH("CCTV, Analog Cameras and IP Cameras","FOUNDATION","Understand the main surveillance system types.",[
    SEC("Analog CCTV",["Traditional analog cameras send video to a DVR through compatible coaxial cabling and power arrangements.","The DVR converts/records video and provides viewing/playback functions."],{diagram:"analog-cctv"}),
    SEC("IP surveillance",["An IP camera is a network device with an IP address. It can send video over Ethernet to an NVR, server or VMS depending on the design.","IP cameras often use PoE so one Ethernet cable can carry both data and electrical power from a compatible PoE switch/injector."],{diagram:"cctv-flow",tip:"An IP camera problem can be a power problem, cable problem, IP problem, credential problem or recording-system problem.",photo:"camera"})
   ]),
   CH("PoE Switch, NVR, Storage and Network Design","INSTALL & CONFIGURE","See how the camera path fits into the LAN.",[
    SEC("Basic IP camera path",["IP Camera → PoE Switch → NVR/VMS → Monitor/Viewing PC.","The PoE switch powers compatible cameras and provides network connectivity.","The NVR records camera streams and manages live view/playback for supported cameras."],{diagram:"cctv-flow"}),
    SEC("Storage",["Recording retention depends on camera count, resolution, frame rate, codec/bitrate, motion/continuous recording settings and disk capacity.","A full or failed recording disk can cause missing recordings even when live video still works."],{diagram:"nvr-storage"})
   ]),
   CH("IP Addressing and Adding a Camera","INSTALL & CONFIGURE","Place cameras in the correct subnet and avoid duplicate addresses.",[
    SEC("Example camera network",["Gateway/Router: 192.168.50.1/24","NVR: 192.168.50.10/24","Camera 1: 192.168.50.101/24","Camera 2: 192.168.50.102/24","Viewing PC: 192.168.50.20/24"],{diagram:"camera-ip",code:["Example Surveillance VLAN/Subnet","Gateway  192.168.50.1 /24","NVR      192.168.50.10 /24","CAM-01   192.168.50.101 /24","CAM-02   192.168.50.102 /24","PC       192.168.50.20 /24"]}),
    SEC("Add-camera checklist",["Confirm camera power/PoE link.","Discover or identify the camera IP using approved tool/method.","Ensure the camera address is unique and in the required subnet.","Ping the camera from an authorized PC/NVR where appropriate.","Add the camera to the NVR/VMS using the correct protocol/credentials.","Verify live view, time, recording and playback."],{safety:"Change default passwords according to policy. Do not publish camera passwords or expose cameras directly to the Internet without an approved secure design."})
   ]),
   CH("CCTV/IP Camera Troubleshooting","TROUBLESHOOT & SUPPORT","Diagnose offline cameras and missing recordings logically.",[
    SEC("Camera offline",["Check PoE/power LED and switch port.","Check Ethernet cable/connector and link.","Check IP address, subnet and duplicate-IP possibility.","Ping the camera if allowed.","Check NVR/VMS credentials and camera status.","Test the camera on a known-good port/cable when needed."],{diagram:"camera-troubleshoot"}),
    SEC("Live view works but no recording",["Check recording schedule/mode.","Check NVR disk status and free/healthy storage.","Check camera time/date and NVR time synchronization.","Check whether the channel is enabled for recording."],{common:"Do not reset a camera before documenting its existing network settings. A reset can create extra work and loss of configuration."})
   ]),
   CH("CCTV Security, Documentation and Handover","BUILD, NETWORK & SOLVE","Protect the surveillance network and document every camera.",[
    SEC("Security",["Change default credentials.","Use strong unique passwords and role-based accounts.","Keep camera/NVR firmware updated through approved procedures.","Use network segmentation/VLAN/firewall policy where required.","Avoid unsafe direct Internet exposure."],{diagram:"cctv-security"}),
    SEC("Camera inventory",["Record camera name/location, IP address, switch/port, NVR channel, model/serial where appropriate and installation notes.","Label cables and map camera positions so future technicians can support the system quickly."],{diagram:"handover"})
   ])
  ],
  quiz:[
   Q("What device records many IP camera streams in a common setup?",["NVR","Keyboard","SMPS only"],0,"An NVR records network camera video."),
   Q("PoE can carry?",["Power and Ethernet data over compatible cabling","Only monitor video cable","Only audio"],0,"Power over Ethernet supplies compatible powered devices through Ethernet."),
   Q("An IP camera normally needs?",["A unique IP address in the required network","The same IP as every camera","No network settings ever"],0,"Duplicate IPs cause connectivity problems."),
   Q("Camera offline: a good first check is?",["Power/PoE and link/cable","Delete the NVR","Format every disk"],0,"Start at the physical/power layer."),
   Q("Live view works but recording is missing. Check?",["Recording schedule and NVR disk status","CPU fan in viewing PC only","Printer queue"],0,"Recording configuration/storage can fail while live view remains available."),
   Q("What is a DVR commonly associated with?",["Analog CCTV recording","Microsoft 365","RAM testing"],0,"DVRs are commonly used with analog camera systems."),
   Q("What should be changed from factory defaults?",["Default camera/NVR credentials","Camera lens color","Ethernet standard"],0,"Default credentials are a major security risk."),
   Q("Why label camera switch ports?",["Faster troubleshooting and documentation","More video pixels","Higher CPU speed"],0,"Port mapping makes support much easier."),
   Q("Before factory-resetting a camera, you should?",["Document existing settings and understand the impact","Reset immediately for every issue","Disconnect all users forever"],0,"Resetting can erase important configuration."),
   Q("A surveillance VLAN can help with?",["Network segmentation and control","Increasing monitor size","Replacing camera storage"],0,"Segmentation can separate and control surveillance traffic.")
  ]
 }
};

let profile=null,track=null,chapterIndex=0,toastTimer=null,quizAnswers={};

function studentKey(){return profile?.user_id||profile?.student_id||profile?.username||"student"}
function storeKey(){return `brightbyte_v46_study_${studentKey()}`}
function loadRoot(){try{return JSON.parse(localStorage.getItem(storeKey())||"{}")||{}}catch{return{}}}
function saveRoot(s){try{localStorage.setItem(storeKey(),JSON.stringify(s))}catch{}}
function trackState(id=track?.id){const root=loadRoot();root.tracks=root.tracks||{};root.tracks[id]=root.tracks[id]||{read:[],quizScore:0,passed:false,lastChapter:0,updatedAt:null};return{root,t:root.tracks[id]}}
function saveTrack(mutator,id=track.id){const x=trackState(id);mutator(x.t);x.t.updatedAt=new Date().toISOString();saveRoot(x.root);return x.t}
function availableChapters(t){return t.chapters}
function progress(t=track){const x=trackState(t.id).t,avail=availableChapters(t),done=avail.filter((c,i)=>x.read.includes(t.chapters.indexOf(c))).length;return{done,total:avail.length,pct:avail.length?Math.round(done/avail.length*100):0,passed:!!x.passed,score:Number(x.quizScore||0)}}
function toast(msg){const el=$("toast");el.textContent=msg;el.classList.add("show");clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove("show"),2200)}

function diagram(kind){
 const node=(ico,title,sub)=>`<div class="diagram-node"><div><span style="font-size:25px">${ico}</span><strong>${esc(title)}</strong><small>${esc(sub||"")}</small></div></div>`;
 const a=`<span class="diagram-arrow">→</span>`;
 const flows={
  "pc-parts":`${node("🧩","Motherboard","Main board")}${node("🧠","CPU","Processes instructions")}${node("🧮","RAM","Working memory")}${node("💾","SSD","Storage")}${node("⚡","SMPS","Power supply")}${node("🖥️","Monitor","Display")}`,
  "assembly-flow":`${node("🧠","CPU + Cooler","Install carefully")}${a}${node("🧮","RAM","Correct slots")}${a}${node("🧩","Motherboard","Fit standoffs")}${a}${node("💾","Storage","SSD/HDD")}${a}${node("⚡","Power","24-pin + CPU")}${a}${node("✅","POST","Enter BIOS")}`,
  "disassembly-flow":`${node("⏻","Shut Down","Power off")}${a}${node("🔌","Unplug","Remove mains")}${a}${node("📸","Record","Photo cables")}${a}${node("🪛","Remove","Parts carefully")}${a}${node("🧹","Clean","Inspect")}${a}${node("✅","Rebuild","Verify")}`,
  "diagnose-flow":`${node("❓","Symptom","What failed?")}${a}${node("👀","Observe","Error / LEDs")}${a}${node("🔌","Basics","Power / cable")}${a}${node("🧪","Test","One change")}${a}${node("✅","Verify","Problem gone")}${a}${node("📝","Document","Handover")}`,
  "boot-check":`${node("⚡","Power","Fans/LED")}${a}${node("🧩","POST","Hardware check")}${a}${node("⚙️","BIOS/UEFI","CPU/RAM/SSD")}${a}${node("🪟","Windows","OS boot")}${a}${node("✅","Tests","Device Manager")}`,
  "bios":`${node("⏻","Power On","Start")}${a}${node("⚙️","UEFI/BIOS","Firmware")}${a}${node("💾","Boot Device","SSD/USB")}${a}${node("🪟","Windows","Operating system")}`,
  "software-stack":`${node("🧩","Hardware","Physical device")}${a}${node("🔧","Driver","Hardware interface")}${a}${node("🪟","Windows","Operating system")}${a}${node("📦","Application","User software")}`,
  "windows-install":`${node("💾","Backup","Protect files")}${a}${node("🔌","Boot USB","Approved media")}${a}${node("🗂️","Disk/Partition","Choose carefully")}${a}${node("🪟","Install","Windows")}${a}${node("🔧","Drivers","Device Manager")}${a}${node("✅","Verify","Updates + apps")}`,
  "device-manager":`${node("🪟","Windows","OS")}${a}${node("🧰","Device Manager","Device status")}${a}${node("⚠️","Warning","Driver/problem")}${a}${node("🔧","Correct Driver","Trusted source")}${a}${node("✅","Retest","Device works")}`,
  "windows-troubleshoot":`${node("🐢","Slow / Error","Symptom")}${a}${node("📊","Task Manager","Resources")}${a}${node("🧹","Space / Startup","Basic fixes")}${a}${node("🛠️","Recovery","Safe Mode/repair")}${a}${node("✅","Verify","Stable")}`,
  "m365-flow":`${node("👤","User","Work/School ID")}${a}${node("🔐","Identity + MFA","Authentication")}${a}${node("☁️","Microsoft 365","Cloud services")}${a}${node("📧","Outlook","Mail")}${node("📁","OneDrive","Files")}${node("💬","Teams","Collaboration")}`,
  "email-flow":`${node("✍️","Compose","To/CC/BCC")}${a}${node("📤","Send","Mailbox service")}${a}${node("🌐","Internet/Cloud","Transport")}${a}${node("📥","Recipient","Inbox")}`,
  "onedrive":`${node("💻","PC File","Local")}${a}${node("☁️","OneDrive","Cloud copy")}${a}${node("📱","Other Device","Sync")}`,
  "mfa":`${node("👤","Username","Identity")}${a}${node("🔑","Password","Factor 1")}${a}${node("📲","Authenticator/Key","Factor 2")}${a}${node("✅","Access","Verified")}`,
  "ai-flow":`${node("🧑‍🎓","Student/Tech","Question")}${a}${node("🤖","AI","Draft/Explain")}${a}${node("🔍","Verify","Check facts")}${a}${node("✍️","Improve","Human review")}${a}${node("✅","Use","Safe result")}`,
  "prompt":`${node("🎭","Role","Who should AI be?")}${a}${node("🎯","Task","What to do?")}${a}${node("👥","Audience","For whom?")}${a}${node("📋","Format","How to present?")}${a}${node("🧱","Limits","Rules/length")}`,
  "research":`${node("💡","Topic","Question")}${a}${node("🤖","AI Outline","Starting point")}${a}${node("📚","Trusted Sources","Verify")}${a}${node("✍️","Rewrite","Understand")}${a}${node("🎤","Present","Own work")}`,
  "ai-support":`${node("🎫","Ticket","Sanitised issue")}${a}${node("🤖","AI Draft","Checklist/email")}${a}${node("🧑‍💻","Technician","Verify")}${a}${node("✅","User","Final answer")}`,
  "cia":`${node("🔒","Confidentiality","Right people")}${node("🧾","Integrity","Correct data")}${node("⚙️","Availability","Service works")}`,
  "phishing":`${node("📩","Message","Unexpected")}${a}${node("🚩","Warning Signs","Urgent/link/OTP")}${a}${node("🛑","Do Not Click","Pause")}${a}${node("📣","Report","Approved process")}`,
  "security-layers":`${node("🔐","Strong Auth","Password/MFA")}${a}${node("🧱","Updates","Patch")}${a}${node("🛡️","Protection","Endpoint/Firewall")}${a}${node("💾","Backup","Recover")}`,
  "incident":`${node("🚨","Recognize","Incident")}${a}${node("📣","Report","Escalate")}${a}${node("🧱","Contain","Limit impact")}${a}${node("🔍","Investigate","Authorized")}${a}${node("✅","Recover","Verify")}`,
  "website-flow":`${node("📄","HTML","Structure")}${a}${node("🎨","CSS","Design")}${a}${node("⚙️","JavaScript","Interaction")}${a}${node("☁️","Hosting","Publish")}${a}${node("🌍","DNS/Domain","Name")}`,
  "portfolio":`${node("👤","Profile","About")}${a}${node("🧰","Skills","What you know")}${a}${node("🗂️","Projects","Evidence")}${a}${node("🏅","Certificates","Learning")}${a}${node("📬","Contact","Safe method")}`,
  "office-network":`${node("🌐","ISP","Internet service")}${a}${node("📡","ONT/Modem","Provider handoff")}${a}${node("🧭","Cisco Router","Gateway")}${a}${node("🔀","Cisco Switch","LAN")}${a}${node("🖥️","PC / Printer / AP","Clients")}`,
  "handover":`${node("❓","Problem/Goal","What was needed")}${a}${node("🧰","Work","What you changed")}${a}${node("🧪","Tests","Evidence")}${a}${node("✅","Result","Working state")}${a}${node("📝","Handover","Next step")}`,
  "ipv4-flow":`${node("🏢","Private LAN","192.168.10.0/24")}${a}${node("🧭","Gateway + NAT","192.168.10.1")}${a}${node("🌐","Public Internet","ISP/public IP")}`,
  "switching":`${node("🖥️","PC-A","MAC A")}${a}${node("🔀","Switch","MAC table")}${a}${node("🖨️","Printer","MAC B")}`,
  "vlan":`${node("🖥️","VLAN 10","STAFF")}${a}${node("🔀","Managed Switch","Access/Trunk")}${a}${node("🖥️","VLAN 20","LAB")}${a}${node("🧭","Router/L3","Inter-VLAN routing")}`,
  "troubleshoot-path":`${node("🔌","1 Physical","Cable/Wi-Fi")}${a}${node("🔢","2 IP","Address/mask")}${a}${node("🧭","3 Gateway","Local route")}${a}${node("🌐","4 External IP","Internet path")}${a}${node("📚","5 DNS","Names")}`,
  "support-flow":`${node("❓","Ask","Symptoms")}${a}${node("👀","Observe","Reproduce")}${a}${node("🧪","Diagnose","Test")}${a}${node("🛠️","Fix","Safe change")}${a}${node("✅","Verify","User confirms")}${a}${node("📝","Document","Ticket")}`,
  "analog-cctv":`${node("📷","Analog Camera","Video signal")}${a}${node("🧵","Coax + Power","Cabling")}${a}${node("📼","DVR","Record")}${a}${node("🖥️","Monitor","View")}`,
  "cctv-flow":`${node("📹","IP Camera","PoE + IP")}${a}${node("🔌","PoE Switch","Power + LAN")}${a}${node("💽","NVR","Record")}${a}${node("🖥️","Monitor / PC","Live + Playback")}`,
  "nvr-storage":`${node("📹","Camera Streams","Video")}${a}${node("💽","NVR","Recording service")}${a}${node("🗄️","HDD/Storage","Retention")}${a}${node("▶️","Playback","Evidence")}`,
  "camera-ip":`${node("🧭","Gateway","192.168.50.1")}${a}${node("🔌","PoE Switch","LAN")}${a}${node("📹","CAM-01","192.168.50.101")}${node("💽","NVR","192.168.50.10")}${node("🖥️","Viewer","192.168.50.20")}`,
  "camera-troubleshoot":`${node("⚡","Power/PoE","LED")}${a}${node("🔌","Cable/Port","Link")}${a}${node("🔢","IP/Subnet","Unique")}${a}${node("🔐","Credentials","NVR login")}${a}${node("💽","Recording","Disk/schedule")}`,
  "cctv-security":`${node("🔑","Strong Password","No default")}${a}${node("🧱","VLAN/Firewall","Segmentation")}${a}${node("⬆️","Firmware","Updates")}${a}${node("📝","Inventory","Document")}`
 };
 return `<div class="visual-stage"><div class="visual-title">Visual Diagram</div><div class="diagram-flow">${flows[kind]||flows["diagnose-flow"]}</div></div>`
}

function genericVisual(title){return `<div class="visual-stage"><div class="visual-title">Equipment / Concept Visual</div><div class="component-grid"><div class="component"><b>👀 Identify</b><small>${esc(title)} and its visible parts.</small></div><div class="component"><b>🎯 Purpose</b><small>Know what job it performs.</small></div><div class="component"><b>🧪 Test</b><small>Use a safe check before replacement.</small></div><div class="component"><b>✅ Verify</b><small>Confirm normal operation after the fix.</small></div></div></div>`}

function renderSection(s){
 let html=`<article class="study-card"><h2>${esc(s.h)}</h2>`;
 if(s.body?.length) html+=`<ul>${s.body.map(x=>`<li>${esc(x)}</li>`).join("")}</ul>`;
 if(s.diagram) html+=diagram(s.diagram);
 if(s.visual) html+=genericVisual(s.h);
 if(s.table){html+=`<div style="overflow:auto"><table class="diagnostic-table">${s.table.map((r,ri)=>`<tr>${r.map(c=>ri===0?`<th>${esc(c)}</th>`:`<td>${esc(c)}</td>`).join("")}</tr>`).join("")}</table></div>`}
 if(s.code){const [label,...lines]=s.code;html+=`<div class="code-block"><div class="code-head"><span>${esc(label)}</span><span>TRAINING EXAMPLE</span></div><pre>${esc(lines.join("\n"))}</pre></div>`}
 if(s.commands){html+=`<div class="command-explain">${s.commands.map(x=>`<div><code>${esc(x[0])}</code><span>${esc(x[1])}</span></div>`).join("")}</div>`}
 if(s.tip)html+=`<div class="tech-tip"><b>🧰 Technician Tip</b>${esc(s.tip)}</div>`;
 if(s.warning||s.safety)html+=`<div class="safety-note"><b>⚠️ Safety / Important</b>${esc(s.warning||s.safety)}</div>`;
 if(s.common)html+=`<div class="common-fault"><b>🔎 Common Fault Note</b>${esc(s.common)}</div>`;
 if(s.photo&&REAL_PHOTOS[s.photo]){const ph=REAL_PHOTOS[s.photo];html+=`<div class="real-photo-card"><img src="${ph.url}" alt="${esc(ph.label)}" loading="lazy" referrerpolicy="no-referrer" onerror="this.hidden=true;this.nextElementSibling.hidden=false"><div class="photo-fallback" hidden>📷 Real photo could not load on this network. Use the built-in diagram above.</div><div class="real-photo-caption"><b>${esc(ph.label)}</b><small>${esc(ph.credit)}</small></div></div>`}
 html+=`<div class="photo-ref"><div class="photo-icon">📷</div><div><b>Equipment reference</b><p>Use the visual diagram above with a real device in your classroom/lab whenever available. If an external real photo is blocked, the built-in diagram still remains visible.</p></div></div>`;
 return html+`</article>`
}

function renderPicker(){
 track=null;$("trackPicker").hidden=false;$("lessonView").hidden=true;$("quizView").hidden=true;$("chapterNav").innerHTML="";$("trackIcon").textContent="📘";$("trackTitle").textContent="Professional Study";$("trackSubtitle").textContent="Choose a subject below.";$("sideProgress").style.width="0%";$("sideProgressText").textContent="Study → Quiz → Practical";
 $("trackPicker").innerHTML=`<section class="picker-hero"><span>V46 PROFESSIONAL THEORY & STUDY CENTER</span><h1>Study first. Prove understanding. Then enter the practical lab.</h1><p>Each subject uses simple English, diagrams, technician tips, commands where required and a 10-question knowledge check. Score at least 70% to unlock the subject practical.</p><div class="picker-flow"><i>1️⃣ Study Notes</i><i>2️⃣ Mark Chapters Complete</i><i>3️⃣ 10 Question Quiz</i><i>4️⃣ Pass 70%</i><i>5️⃣ Practical Workspace</i></div></section><div class="picker-grid">${Object.entries(TRACKS).map(([id,t])=>{const p=progress(t);return `<button class="picker-card" type="button" data-track="${id}"><span class="ico">${t.icon}</span><h3>${esc(t.title)}</h3><p>${esc(t.short)}</p><footer><span>${p.done}/${p.total} chapters</span><span>${p.passed?`✅ Quiz ${p.score}%`:p.score?`Quiz ${p.score}%`:`10 Q Quiz`}</span></footer></button>`}).join("")}</div>`;
 document.querySelectorAll("[data-track]").forEach(b=>b.onclick=()=>openTrack(b.dataset.track));
 history.replaceState({},"","professional-study.html");
}

function openTrack(id,idx=null){
 if(!TRACKS[id])return renderPicker();track={id,...TRACKS[id]};const st=trackState(id).t;chapterIndex=idx==null?Math.min(Number(st.lastChapter||0),track.chapters.length-1):idx;
 $("trackPicker").hidden=true;$("lessonView").hidden=false;$("quizView").hidden=true;renderSidebar();renderChapter();history.replaceState({},"",`professional-study.html?track=${encodeURIComponent(id)}&chapter=${chapterIndex+1}`)
}

function renderSidebar(){
 const p=progress();$("trackIcon").textContent=track.icon;$("trackTitle").textContent=track.title;$("trackSubtitle").textContent=track.short;$("sideProgress").style.width=`${p.pct}%`;$("sideProgressText").textContent=`${p.done}/${p.total} available chapters complete • ${p.pct}%`;
 const st=trackState().t;$("chapterNav").innerHTML=track.chapters.map((c,i)=>{const done=st.read.includes(i);return `<button type="button" class="${i===chapterIndex?"active":""} ${done?"done":""}" data-chapter="${i}"><span class="no">${String(i+1).padStart(2,"0")}</span><span><b>${esc(c.title)}</b><small>${esc(c.level)}</small></span><span class="state">${done?"✅":"▶"}</span></button>`}).join("");document.querySelectorAll("[data-chapter]").forEach(b=>b.onclick=()=>{chapterIndex=Number(b.dataset.chapter);saveTrack(t=>t.lastChapter=chapterIndex);renderSidebar();renderChapter();history.replaceState({},"",`professional-study.html?track=${encodeURIComponent(track.id)}&chapter=${chapterIndex+1}`)})
}

function renderChapter(){
 const c=track.chapters[chapterIndex],p=progress(),st=trackState().t,done=st.read.includes(chapterIndex),isLast=chapterIndex===track.chapters.length-1;
 $("lessonHero").innerHTML=`<section class="lesson-hero"><span class="eyebrow">${esc(track.title.toUpperCase())} • CHAPTER ${chapterIndex+1}/${track.chapters.length}</span><h1>${esc(c.title)}</h1><p>${esc(c.summary)}</p><div class="lesson-tags"><span>${esc(c.level)}</span><span>SIMPLE ENGLISH</span><span>DIAGRAMS + PRACTICAL CONTEXT</span><span>${p.pct}% TRACK READ</span></div></section>`;
 $("lessonContent").innerHTML=c.sections.map(renderSection).join("")+`<article class="study-card"><h2>Chapter check</h2><p>Before moving on, make sure you can explain the main idea in your own words.</p><div class="lesson-actions"><div class="group"><button id="markDone" class="${done?"success-btn":"primary-btn"}" type="button">${done?"✅ Chapter Completed":"✅ Mark Chapter Complete"}</button></div><div class="group">${chapterIndex>0?'<button id="prevChapter" class="secondary-btn" type="button">← Previous</button>':""}${!isLast?'<button id="nextChapter" class="primary-btn" type="button">Next Chapter →</button>':`<button id="openQuiz" class="primary-btn" type="button">📝 10 Question Quiz →</button>`}</div></div></article>`;
 $("lessonSide").innerHTML=`<article class="side-card"><h3>Track Progress</h3><div class="side-progress"><i style="width:${p.pct}%"></i></div><p>${p.done}/${p.total} available chapters marked complete.</p></article><article class="side-card"><h3>Study Method</h3><ul><li>Read the simple definition.</li><li>Follow the diagram.</li><li>Understand the technician tip.</li><li>Study commands where shown.</li><li>Mark the chapter complete.</li></ul></article><article class="side-card"><h3>Knowledge Check</h3><p>${p.done===p.total?"All available chapters are complete. The 10-question quiz is ready.":"Complete all available chapters to unlock the quiz."}</p><button id="sideQuiz" class="${p.done===p.total?"primary-btn":"secondary-btn"}" type="button" ${p.done===p.total?"":"disabled"}>📝 Open Quiz</button></article><div class="practical-lock ${p.passed?"unlocked":""}"><h3>${p.passed?"🔓 Practical Unlocked":"🔒 Practical Locked"}</h3><p>${p.passed?`Knowledge Check passed with ${p.score}%.`:"Pass the 10-question quiz with 70% or more."}</p>${p.passed?`<a class="success-btn" href="professional-lab.html?track=${encodeURIComponent(track.lab)}">Open Practical Workspace →</a>`:""}</div>`;
 $("markDone").onclick=()=>{saveTrack(t=>{if(!t.read.includes(chapterIndex))t.read.push(chapterIndex);t.lastChapter=chapterIndex});toast("Chapter marked complete");renderSidebar();renderChapter()};
 if($("prevChapter"))$("prevChapter").onclick=()=>openTrack(track.id,chapterIndex-1);
 if($("nextChapter"))$("nextChapter").onclick=()=>{if(!trackState().t.read.includes(chapterIndex)){toast("Mark this chapter complete first");return}openTrack(track.id,chapterIndex+1)};
 if($("openQuiz"))$("openQuiz").onclick=openQuiz;
 if($("sideQuiz"))$("sideQuiz").onclick=openQuiz;
 $("lessonView").scrollIntoView({block:"start"})
}

function openQuiz(){
 const p=progress();if(p.done<p.total){toast("Complete all available chapters first");return}quizAnswers={};$("lessonView").hidden=true;$("quizView").hidden=false;$("trackPicker").hidden=true;
 $("quizView").innerHTML=`<section class="quiz-shell"><span class="eyebrow">${esc(track.title.toUpperCase())} • KNOWLEDGE CHECK</span><h1>10 Question Quiz</h1><p class="quiz-intro">Answer all 10 questions. Pass mark is 70%. If you do not pass, review the wrong answers, return to the notes and try again.</p>${track.quiz.map((q,i)=>`<article class="quiz-q" data-q="${i}"><h3>${i+1}. ${esc(q.q)}</h3><div class="quiz-options">${q.o.map((o,j)=>`<button class="quiz-option" type="button" data-qi="${i}" data-ai="${j}">${esc(o)}</button>`).join("")}</div></article>`).join("")}<div id="quizResult"></div><div class="lesson-actions"><button id="backNotes" class="secondary-btn" type="button">← Back to Notes</button><button id="submitQuiz" class="primary-btn" type="button">✅ Submit Quiz</button></div></section>`;
 document.querySelectorAll("[data-qi]").forEach(b=>b.onclick=()=>{const qi=Number(b.dataset.qi),ai=Number(b.dataset.ai);quizAnswers[qi]=ai;document.querySelectorAll(`[data-q="${qi}"] .quiz-option`).forEach(x=>x.classList.remove("selected"));b.classList.add("selected")});
 $("backNotes").onclick=()=>{$("quizView").hidden=true;$("lessonView").hidden=false;renderChapter()};$("submitQuiz").onclick=scoreQuiz;history.replaceState({},"",`professional-study.html?track=${encodeURIComponent(track.id)}&quiz=1`);window.scrollTo({top:0,behavior:"smooth"})
}

function scoreQuiz(){
 if(Object.keys(quizAnswers).length<track.quiz.length){toast(`Please answer all ${track.quiz.length} questions`);return}
 let correct=0,wrong=[];track.quiz.forEach((q,i)=>{if(quizAnswers[i]===q.a)correct++;else wrong.push({n:i+1,q:q.q,e:q.e,correct:q.o[q.a]})});const score=Math.round(correct/track.quiz.length*100),pass=score>=70;saveTrack(t=>{t.quizScore=Math.max(Number(t.quizScore||0),score);if(pass)t.passed=true});
 const saved=trackState().t,finalPass=!!saved.passed,finalScore=Math.max(score,Number(saved.quizScore||0));$("quizResult").innerHTML=`<section class="quiz-result ${pass?"":"fail"}"><h2>${pass?"✅ Passed":"📘 Review and Try Again"} — ${score}%</h2><p>${pass?"The practical workspace is now unlocked for this subject.":"You need at least 70%. Review the explanations below and retry when ready."}</p>${wrong.length?`<div class="wrong-review">${wrong.map(w=>`<div><b>Q${w.n}: ${esc(w.q)}</b><p>Correct answer: <strong>${esc(w.correct)}</strong>. ${esc(w.e)}</p></div>`).join("")}</div>`:""}${finalPass?`<div class="practical-lock unlocked" style="margin-top:14px"><h3>🔓 Practical Workspace Unlocked</h3><p>Best Knowledge Check score: ${finalScore}%</p><a class="success-btn" href="professional-lab.html?track=${encodeURIComponent(track.lab)}">🧪 Open ${esc(track.title)} Practical →</a></div>`:""}</section>`;renderSidebar();$("quizResult").scrollIntoView({behavior:"smooth",block:"center"})
}

$("allTracksBtn").onclick=renderPicker;

async function boot(){
 if(!TOKEN){location.href="student-login.html";return}
 try{
  const r=await fetch(API+"/api/auth/me",{headers:{Authorization:`Bearer ${TOKEN}`},cache:"no-store"}),d=await r.json();
  if(!r.ok||d.role!=="student"||!d.profile)throw 0;profile=d.profile;const c=Number(profile.class_number||0);if(c<7||c>10){location.href=c<=3?"foundation-universe.html":"advanced-universe.html";return}
  $("studentChip").textContent=`👤 ${profile.display_name||profile.username||"Student"} • Class ${c}`;
  const q=new URLSearchParams(location.search),id=q.get("track");if(id&&TRACKS[id]){const ch=Math.max(0,Math.min(trackIndex(id,q.get("chapter")),TRACKS[id].chapters.length-1));openTrack(id,ch);if(q.get("quiz")==="1"&&progress(track).done===progress(track).total)openQuiz()}else renderPicker()
 }catch{localStorage.removeItem("brightbyte_student_token");location.href="student-login.html"}
}
function trackIndex(id,n){const v=Number(n||1)-1;return Number.isFinite(v)?v:0}
boot();
})();
