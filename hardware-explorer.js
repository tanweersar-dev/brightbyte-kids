(() => {
"use strict";

const API = "https://brightbyte-kids-api.tanweerstudy25.workers.dev";
const TOKEN_KEY = "brightbyte_student_token";
const token = localStorage.getItem(TOKEN_KEY) || "";
const ASSET_BASE = "hardware-assets/";

const $ = id => document.getElementById(id);
const qa = selector => [...document.querySelectorAll(selector)];

const CATEGORIES = [
  {id:"all", name:"All Parts", icon:"🧰"},
  {id:"internal", name:"Internal PC Parts", icon:"🖥️"},
  {id:"storage", name:"Storage", icon:"💾"},
  {id:"cards", name:"Expansion Cards", icon:"🧩"},
  {id:"cables", name:"Internal Cables", icon:"🔌"},
  {id:"ports", name:"PC Ports", icon:"🔗"},
  {id:"printer", name:"Printer Connections", icon:"🖨️"},
  {id:"ups", name:"UPS Power", icon:"🔋"},
  {id:"external", name:"External Cables", icon:"🪢"}
];

const PARTS = [
  {
    id:"motherboard", category:"internal", name:"Motherboard", short:"The main circuit board of a computer.",
    intro:"The motherboard is the central board that connects the processor, memory, storage, power and expansion devices so they can work together.",
    what:"A large printed circuit board inside the computer case.",
    job:"It gives the major components a place to connect and lets data and power move between them.",
    where:"Mounted flat against the inside wall of the system unit / PC case.",
    identify:"Look for the CPU socket, long RAM slots, PCIe slots, storage connectors and the rear I/O port area.",
    connect:"Processor, RAM, SSD, HDD, graphics/LAN cards, power supply cables, front-panel cables, USB and fans.",
    safety:"Turn the computer off, unplug power and avoid touching contacts with wet or dirty hands.",
    tech:"When many different devices fail at the same time, technicians also inspect motherboard power, seating and visible damage.",
    visual:"motherboard", quiz:["Connects the main computer components","Prints documents","Provides battery backup"], answer:0
  },
  {
    id:"processor", category:"internal", name:"Processor (CPU)", short:"The chip that processes instructions.",
    intro:"The processor, also called the CPU, performs calculations and executes instructions from programs and the operating system.",
    what:"A small square electronic chip with many electrical contact points.",
    job:"It processes instructions, performs calculations and controls much of the computer's work.",
    where:"Installed into the CPU socket on the motherboard under the CPU cooler.",
    identify:"Usually a flat square metal-topped chip with a model name printed on top.",
    connect:"It sits directly in the motherboard CPU socket and is cooled by a heatsink/fan.",
    safety:"Never force a CPU into a socket. Match the alignment mark and protect socket pins.",
    tech:"A CPU rarely plugs in like a normal cable; correct socket alignment and cooling are the important checks.",
    visual:"cpu", quiz:["Processes computer instructions","Stores files permanently","Supplies mains power"], answer:0
  },
  {
    id:"cpu-cooler", category:"internal", name:"Processor Fan / CPU Cooler", short:"Removes heat from the processor.",
    intro:"The CPU cooler combines a heatsink and usually a fan to move heat away from the processor.",
    what:"A metal heatsink with a fan mounted above the processor.",
    job:"It keeps the CPU temperature within a safe operating range.",
    where:"Attached directly over the processor on the motherboard.",
    identify:"Look for a circular or square fan sitting on metal fins near the CPU socket.",
    connect:"Its fan cable normally connects to the motherboard header marked CPU_FAN.",
    safety:"Do not run a desktop CPU without a correctly mounted cooler. Keep fingers away from a spinning fan.",
    tech:"If a PC shuts down from overheating, check cooler mounting, fan operation, dust and thermal paste condition.",
    visual:"fan", quiz:["Cools the processor","Connects to the internet","Stores Windows"], answer:0
  },
  {
    id:"case-fan", category:"internal", name:"CPU Case Fan", short:"Moves air through the computer case.",
    intro:"A case fan improves airflow by bringing cool air in or pushing hot air out of the computer case.",
    what:"A square-framed fan installed on the front, rear, top or side of a PC case.",
    job:"It moves air through the case to help cool the motherboard, storage, GPU and other parts.",
    where:"Mounted to ventilation points in the computer case.",
    identify:"A square frame with multiple blades and a small power cable.",
    connect:"Usually connects to SYS_FAN / CHA_FAN on the motherboard or to a fan controller.",
    safety:"Switch power off before working near fan blades or connectors.",
    tech:"Check the arrow on many fan frames to understand airflow direction.",
    visual:"fan", quiz:["Moves air through the case","Creates documents","Changes screen resolution"], answer:0
  },
  {
    id:"ram", category:"internal", name:"RAM", short:"Fast temporary working memory.",
    intro:"RAM holds the data and instructions that the processor needs quickly while programs are running.",
    what:"A long narrow memory module with chips mounted on a circuit board.",
    job:"It gives active programs fast temporary working space.",
    where:"Installed in long DIMM slots next to the processor socket on the motherboard.",
    identify:"Long thin module with a row of gold contacts and a notch near the contacts.",
    connect:"Slides into the motherboard RAM slot until the retaining clips lock.",
    safety:"Hold RAM by the edges. Do not touch the gold contacts.",
    tech:"If a PC will not boot after RAM work, reseat the module and verify the correct slot/notch orientation.",
    visual:"ram", quiz:["Temporary working memory","Permanent file storage","Internet cable"], answer:0
  },
  {
    id:"nvme-ssd", category:"storage", name:"M.2 NVMe SSD", short:"Very fast solid-state storage.",
    intro:"An M.2 NVMe SSD is a small high-speed storage device that connects directly to an M.2 slot on the motherboard.",
    what:"A slim stick-shaped circuit board containing flash memory.",
    job:"Stores Windows, applications and files with very fast read and write speeds.",
    where:"Installed flat on an M.2 connector on the motherboard.",
    identify:"Looks like a small narrow card, often about the length of a finger, with one screw holding the far end.",
    connect:"Slides into an M.2 socket and is normally secured with a small screw or latch.",
    safety:"Do not bend the module. Power off before installing or removing it.",
    tech:"M.2 describes the physical shape; technicians still check whether the slot/device uses NVMe/PCIe or SATA.",
    visual:"nvme", quiz:["High-speed storage","CPU cooling","Video output"], answer:0
  },
  {
    id:"sata-ssd", category:"storage", name:"SATA SSD", short:"Solid-state drive using SATA.",
    intro:"A SATA SSD stores data on flash memory and normally uses a SATA data cable plus SATA power.",
    what:"A slim rectangular 2.5-inch storage drive with no moving disk.",
    job:"Stores the operating system, applications and user files.",
    where:"Mounted in a 2.5-inch drive bay or bracket inside the PC case.",
    identify:"Flat rectangular drive with two L-shaped connectors on one edge.",
    connect:"SATA data cable to motherboard and SATA power cable from the power supply.",
    safety:"Never force the L-shaped SATA connectors in the wrong direction.",
    tech:"A SATA SSD can be much faster than a mechanical HDD but uses the same common SATA data interface.",
    visual:"ssd", quiz:["Stores files using flash memory","Provides Wi-Fi","Cools RAM"], answer:0
  },
  {
    id:"hdd", category:"storage", name:"Hard Disk Drive (HDD)", short:"Mechanical long-term storage.",
    intro:"An HDD stores files magnetically on spinning disks inside a sealed drive enclosure.",
    what:"A rectangular storage device containing spinning platters and a moving read/write mechanism.",
    job:"Provides long-term storage for operating systems, applications, backups and files.",
    where:"Mounted in a 3.5-inch or 2.5-inch drive bay inside the computer.",
    identify:"Heavier metal rectangular drive, often with a label on top and SATA connectors on the rear edge.",
    connect:"SATA data cable to motherboard and SATA power from the power supply.",
    safety:"Avoid strong shocks or dropping an HDD, especially while it is running.",
    tech:"Clicking noises, slow reads and SMART warnings can indicate an HDD that needs immediate backup and replacement.",
    visual:"hdd", quiz:["Mechanical file storage","Power backup","Display connection"], answer:0
  },
  {
    id:"lan-card", category:"cards", name:"LAN / Ethernet Card", short:"Adds wired network connectivity.",
    intro:"A LAN card, also called a network interface card (NIC), provides an RJ45 Ethernet connection for a computer.",
    what:"An expansion card with networking electronics and usually one RJ45 port.",
    job:"Sends and receives network data over an Ethernet cable.",
    where:"Installed in a PCIe slot inside a desktop PC when extra or replacement networking is needed.",
    identify:"Small expansion card with a metal bracket and a rectangular RJ45 network socket.",
    connect:"PCIe slot to motherboard and Ethernet cable to switch/router/network outlet.",
    safety:"Power off before installing an internal expansion card.",
    tech:"Before replacing a NIC, technicians also test the cable, switch port, IP settings and drivers.",
    visual:"nic", quiz:["Provides wired network connection","Stores photos","Supplies CPU power"], answer:0
  },
  {
    id:"graphics-card", category:"cards", name:"Graphics Card (GPU)", short:"Creates images and video output.",
    intro:"A graphics card processes graphics and sends video to monitors through ports such as HDMI and DisplayPort.",
    what:"A large expansion card containing a graphics processor, memory and cooling system.",
    job:"Renders images, video, 3D graphics and display output.",
    where:"Installed in a PCIe x16 slot on the motherboard.",
    identify:"Usually a large card with one or more fans and display ports on the rear bracket.",
    connect:"PCIe slot, sometimes extra PSU power, and monitor cables such as HDMI or DisplayPort.",
    safety:"Use the correct PCIe power cable and support heavy cards to avoid connector damage.",
    tech:"A monitor connected to the wrong video output is a common cause of 'No Signal' after adding a dedicated GPU.",
    visual:"gpu", quiz:["Processes graphics and display output","Backs up mains power","Connects printer paper"], answer:0
  },
  {
    id:"sata-data-cable", category:"cables", name:"SATA Data Cable", short:"Moves data between SATA drive and motherboard.",
    intro:"A SATA data cable carries digital data between a SATA storage drive and a motherboard SATA port.",
    what:"A thin cable with a small L-shaped connector at each end.",
    job:"Transfers data to and from SATA SSDs, HDDs and some optical drives.",
    where:"Runs inside the PC case from a drive to a SATA motherboard port.",
    identify:"Narrow flat cable; connectors are smaller than SATA power and have an L-shaped key.",
    connect:"One end to storage drive, one end to motherboard SATA port.",
    safety:"Do not bend sharply or force the keyed connector.",
    tech:"If a SATA drive has power but is not detected, checking/reseating the SATA data cable is an early troubleshooting step.",
    visual:"sata-data", quiz:["Carries storage data","Supplies mains electricity","Connects monitor audio only"], answer:0
  },
  {
    id:"sata-power", category:"cables", name:"SATA Power Cable", short:"Supplies power to SATA drives.",
    intro:"A SATA power connector carries DC power from the computer power supply to SATA storage devices.",
    what:"A wider flat L-shaped power connector with multiple wires.",
    job:"Supplies electrical power to SATA SSDs, HDDs and compatible devices.",
    where:"Comes from the power supply inside a desktop computer.",
    identify:"Wider than the SATA data connector and usually attached to several colored/black wires.",
    connect:"Power supply to the power socket on the SATA drive.",
    safety:"Never connect or disconnect internal power cables while the PC is powered on.",
    tech:"A SATA drive normally needs both data and power. Missing either connection prevents normal operation.",
    visual:"sata-power", quiz:["Supplies power to SATA drives","Carries HDMI video","Connects Ethernet"], answer:0
  },
  {
    id:"atx-24pin", category:"cables", name:"24-Pin Motherboard Power Cable", short:"Main power connection for motherboard.",
    intro:"The 24-pin ATX cable is the main power connector from the power supply to the motherboard.",
    what:"A large rectangular multi-pin connector with many wires and a locking clip.",
    job:"Provides the motherboard with its primary DC power rails.",
    where:"Runs from the power supply to the large ATX power socket on the motherboard edge.",
    identify:"Usually the largest internal motherboard power plug, arranged as a 24-pin block.",
    connect:"Power supply to motherboard 24-pin ATX socket.",
    safety:"Align the latch and socket. Do not force a partially misaligned connector.",
    tech:"If absolutely nothing powers on, technicians check mains, PSU switch and the 24-pin connection among other basics.",
    visual:"atx", quiz:["Main motherboard power","Printer data","Monitor video"], answer:0
  },
  {
    id:"cpu-power", category:"cables", name:"CPU Power Cable (4/8-Pin EPS)", short:"Dedicated power for processor circuits.",
    intro:"The CPU power cable supplies dedicated power to the motherboard voltage circuits that feed the processor.",
    what:"A 4-pin or 8-pin keyed power connector, often labelled CPU or EPS on the PSU cable.",
    job:"Provides power needed by the CPU voltage regulation section.",
    where:"Connects near the CPU socket, often at the top edge of the motherboard.",
    identify:"Smaller than the 24-pin connector, usually split 4+4 on modular or modern power supplies.",
    connect:"Power supply CPU/EPS cable to motherboard CPU_PWR / ATX12V / EPS socket.",
    safety:"Do not confuse CPU/EPS and PCIe/GPU connectors even if they look similar.",
    tech:"A PC may light up but fail to boot if the CPU power connector is missing.",
    visual:"eps", quiz:["Powers CPU circuits","Connects printer USB","Carries LAN data"], answer:0
  },
  {
    id:"rear-io", category:"ports", name:"CPU Back Side Ports / Rear I/O", short:"Main external connection area on a desktop.",
    intro:"The rear I/O area is where motherboard and expansion-card ports are exposed at the back of a desktop computer.",
    what:"A group of sockets and connectors visible on the back of the system unit.",
    job:"Lets external devices connect for USB, network, audio, display and other functions.",
    where:"At the rear of the desktop PC case.",
    identify:"Look for grouped USB ports, RJ45 LAN, audio jacks and possibly HDMI/DP/VGA or other connectors.",
    connect:"Keyboard, mouse, network cable, speakers, monitor and many USB devices.",
    safety:"Match the connector shape and label before inserting cables.",
    tech:"For troubleshooting, first confirm the cable is connected to the correct physical port—not merely a similar-looking one.",
    visual:"rear-io", quiz:["Provides external PC connections","Stores BIOS permanently only","Charges a UPS battery"], answer:0
  },
  {
    id:"vga-port", category:"ports", name:"VGA Port", short:"Older analog video connector.",
    intro:"VGA is an older analog display interface commonly recognized by its 15-pin D-shaped connector.",
    what:"A D-shaped video port with three rows of small pin holes.",
    job:"Carries analog video from a computer to a monitor or projector.",
    where:"On older motherboards, graphics cards, monitors and projectors.",
    identify:"Usually blue, D-shaped, with screw posts at both sides and 15 contacts.",
    connect:"VGA cable between computer video output and display VGA input.",
    safety:"Align the pins carefully. Bent VGA pins can prevent display output.",
    tech:"VGA carries analog video and does not normally carry digital audio like HDMI can.",
    visual:"vga", quiz:["Analog video","Network data","Printer power"], answer:0
  },
  {
    id:"hdmi-port", category:"ports", name:"HDMI Port", short:"Digital video and audio connection.",
    intro:"HDMI carries digital video and usually digital audio over one cable.",
    what:"A flat, slightly tapered digital multimedia connector.",
    job:"Connects computers and media devices to monitors, TVs and projectors.",
    where:"On graphics cards, motherboards, laptops, monitors, TVs and projectors.",
    identify:"Small flat trapezoid-like opening, wider than USB-C and shaped differently from DisplayPort.",
    connect:"HDMI cable from computer output to display input.",
    safety:"Insert straight and avoid pulling sideways on the port.",
    tech:"If there is no picture, verify the display input source is set to the HDMI socket being used.",
    visual:"hdmi", quiz:["Digital video and audio","CPU power","UPS input"], answer:0
  },
  {
    id:"displayport", category:"ports", name:"DisplayPort (DP)", short:"Digital display connection common on PCs.",
    intro:"DisplayPort is a digital display interface widely used on desktop computers and professional monitors.",
    what:"A digital video connector similar in size to HDMI but usually with one squared/beveled corner.",
    job:"Carries high-quality digital video and can also carry audio.",
    where:"Common on graphics cards, business desktops, docking stations and monitors.",
    identify:"Rectangular opening with one corner often angled; many ports carry a DP symbol.",
    connect:"DisplayPort cable between computer and monitor.",
    safety:"Some full-size DP plugs have a latch; press the release before pulling.",
    tech:"DisplayPort is common for high refresh rates and multi-monitor computer setups.",
    visual:"dp", quiz:["Digital display connection","Hard-drive power","Printer paper feed"], answer:0
  },
  {
    id:"usb-a", category:"ports", name:"USB-A Port", short:"Common rectangular USB connection.",
    intro:"USB-A is a very common port for keyboards, mice, flash drives, printers and many accessories.",
    what:"A flat rectangular USB socket.",
    job:"Carries data and can provide power to compatible devices.",
    where:"On desktops, laptops, monitors, chargers and many other devices.",
    identify:"Rectangular opening with an internal plastic tongue; often black, blue or another color.",
    connect:"USB keyboard, mouse, flash drive, printer cable and many accessories.",
    safety:"Do not force a USB plug upside down. Check orientation.",
    tech:"Blue USB-A ports often indicate USB 3.x, but technicians should confirm device specifications rather than rely only on color.",
    visual:"usb-a", quiz:["Connects many USB devices","Only outputs VGA video","Only powers CPU"], answer:0
  },
  {
    id:"usb-c", category:"ports", name:"USB-C Port", short:"Small reversible USB connector.",
    intro:"USB-C is a compact reversible connector that can carry data, power and sometimes video depending on the device.",
    what:"A small rounded-rectangle connector that can be inserted either way up.",
    job:"Can transfer data, charge devices and in supported systems carry display signals.",
    where:"Common on modern laptops, phones, docks, monitors and accessories.",
    identify:"Small symmetrical rounded opening.",
    connect:"USB-C cables, chargers, docks and compatible display adapters.",
    safety:"USB-C shape alone does not guarantee every feature; use the correct rated cable and charger.",
    tech:"Two USB-C ports may look identical but support different speeds, charging levels or video features.",
    visual:"usb-c", quiz:["Reversible data/power connector","Mechanical HDD","UPS battery"], answer:0
  },
  {
    id:"rj45-lan", category:"ports", name:"RJ45 LAN Port", short:"Ethernet network socket.",
    intro:"The RJ45 Ethernet port connects a computer to a wired network using an Ethernet cable.",
    what:"A rectangular network socket with eight electrical contacts and a latch opening.",
    job:"Carries network data between the computer and network equipment.",
    where:"On desktops, laptops, switches, routers, printers, IP phones and wall outlets.",
    identify:"Wider than a telephone-style connector and usually has small link/activity LEDs nearby.",
    connect:"Ethernet cable with RJ45 plug to a switch, router or network outlet.",
    safety:"Press the cable latch before pulling to avoid damaging the plug or port.",
    tech:"Link LEDs help show physical connectivity, but a link light alone does not prove correct IP configuration.",
    visual:"rj45", quiz:["Wired Ethernet network","Analog monitor video","UPS power output"], answer:0
  },
  {
    id:"audio-jacks", category:"ports", name:"3.5 mm Audio Ports", short:"Analog sound input/output jacks.",
    intro:"Desktop audio jacks connect speakers, headphones and microphones using 3.5 mm plugs.",
    what:"Small round sockets, often color-coded.",
    job:"Carry analog audio input or output signals.",
    where:"On motherboard rear I/O panels, front PC panels, laptops and audio devices.",
    identify:"Round 3.5 mm openings; green is commonly speaker/headphone out and pink often microphone in.",
    connect:"Speakers, headphones, microphones and analog audio cables.",
    safety:"Use the correct audio jack to avoid confusing microphone and speaker connections.",
    tech:"Color conventions are common but not universal; symbols and labels are the final reference.",
    visual:"audio", quiz:["Analog audio connections","SATA storage data","CPU cooling"], answer:0
  },
  {
    id:"pc-power-in", category:"ports", name:"Computer Power Port (IEC C14)", short:"Mains power inlet on many desktop PSUs.",
    intro:"Many desktop power supplies use an IEC C14 inlet where the computer's AC power cable connects.",
    what:"A three-pin rectangular mains power inlet on the power supply.",
    job:"Receives AC mains power for the computer power supply.",
    where:"At the back of a desktop PC power supply.",
    identify:"Black rectangular three-pin inlet, often next to a PSU power switch.",
    connect:"IEC C13 power cable from wall outlet or UPS output.",
    safety:"Mains electricity is dangerous. Never open a power supply casing or touch internal PSU parts.",
    tech:"Always check the wall/UPS source, power cable and PSU switch before deeper no-power troubleshooting.",
    visual:"iec", quiz:["Receives AC mains power","Carries Ethernet data","Outputs HDMI"], answer:0
  },
  {
    id:"printer-usb-b", category:"printer", name:"Printer USB Port (USB-B)", short:"Common USB data port on printers.",
    intro:"USB-B is the square-shaped device-side USB connector commonly used on printers.",
    what:"A nearly square USB socket with beveled top corners.",
    job:"Carries print and scan data between printer and computer.",
    where:"Usually on the back of a USB-connected printer.",
    identify:"Square-ish socket, very different in shape from the flat USB-A port on a PC.",
    connect:"USB-B end to printer and USB-A/USB-C end to computer.",
    safety:"Do not confuse the USB data port with a network or power connector.",
    tech:"If USB printing fails, test the cable, USB port, printer state and correct driver/queue.",
    visual:"usb-b", quiz:["Printer data connection","Printer mains power","VGA video"], answer:0
  },
  {
    id:"printer-power", category:"printer", name:"Printer Power Port", short:"Power input for a printer.",
    intro:"The printer power port is where the printer receives electrical power from its approved power cable or adapter.",
    what:"A mains inlet or DC adapter socket depending on printer model.",
    job:"Supplies electrical power so the printer can operate.",
    where:"Usually on the rear or side of the printer.",
    identify:"Look for a power symbol, voltage label or a mains/DC input shape.",
    connect:"Printer-approved power cable or power adapter.",
    safety:"Use the correct voltage and approved cable/adapter. Never insert a data connector into a power socket.",
    tech:"If a printer is completely dead, start by checking outlet/UPS, cable, switch and power indicator.",
    visual:"printer-power", quiz:["Supplies printer power","Carries print jobs only","Connects monitor"], answer:0
  },
  {
    id:"printer-lan", category:"printer", name:"Printer LAN Port", short:"Network connection for shared printing.",
    intro:"A network printer can use an RJ45 Ethernet port to join the office LAN and serve multiple users.",
    what:"An RJ45 Ethernet network socket on the printer.",
    job:"Connects the printer to the local network for printing, scanning and management.",
    where:"Usually on the printer's rear I/O area.",
    identify:"RJ45-shaped socket often near USB connections, sometimes with link LEDs.",
    connect:"Ethernet cable to switch/router/network outlet.",
    safety:"Release the RJ45 latch before removing the cable.",
    tech:"For network-printing issues, confirm link, printer IP address, ping response, port configuration and driver.",
    visual:"rj45", quiz:["Connects printer to LAN","Provides toner","Powers CPU"], answer:0
  },
  {
    id:"ups-input", category:"ups", name:"UPS Power In / AC Input", short:"Mains electricity enters the UPS here.",
    intro:"The UPS AC input receives power from the wall so the UPS can supply connected equipment and charge its battery.",
    what:"The UPS mains input connection, which may be a fixed cable or IEC inlet depending on model.",
    job:"Brings utility AC power into the UPS.",
    where:"Usually on the rear of the UPS.",
    identify:"Often labelled AC INPUT, INPUT or LINE.",
    connect:"Wall outlet to UPS input using the correct mains cable.",
    safety:"Do not exceed voltage ratings or use damaged power cables.",
    tech:"If the UPS does not charge or run normally on mains, verify source power, breaker/fuse and input connection.",
    visual:"ups-in", quiz:["Receives mains power into UPS","Outputs video","Carries printer USB data"], answer:0
  },
  {
    id:"ups-output", category:"ups", name:"UPS Power Out / Battery Backup Output", short:"Protected power leaves the UPS here.",
    intro:"UPS output sockets provide protected AC power to computers and other approved devices.",
    what:"One or more AC output sockets on a UPS.",
    job:"Supplies connected devices from mains conditioning and/or battery backup depending on the outlet type.",
    where:"Usually on the rear panel of the UPS.",
    identify:"Sockets labelled OUTPUT, BATTERY BACKUP, SURGE or similar.",
    connect:"Computer, monitor and other approved loads using correct power cables.",
    safety:"Never overload the UPS. High-power devices such as heaters are not appropriate backup loads.",
    tech:"Some UPS units have both battery-backed and surge-only sockets, so technicians check the label carefully.",
    visual:"ups-out", quiz:["Provides protected AC output","Stores files","Sends VGA video"], answer:0
  },
  {
    id:"ethernet-cable", category:"external", name:"Ethernet / LAN Cable", short:"Connects wired network devices.",
    intro:"An Ethernet cable carries network data between computers, switches, routers, IP phones and network printers.",
    what:"A twisted-pair network cable with RJ45 plugs on its ends.",
    job:"Provides a wired network path for Ethernet communication.",
    where:"Between devices and network outlets/switch ports.",
    identify:"Cable ends use clear or colored RJ45 plugs with a locking tab.",
    connect:"RJ45 LAN port to switch/router/wall outlet.",
    safety:"Avoid crushing, excessive bending or pulling the cable by the connector.",
    tech:"A cable can look fine but still be faulty; swap with a known-good cable or use a cable tester.",
    visual:"ethernet", quiz:["Carries Ethernet network data","Powers motherboard 24-pin","Cools CPU"], answer:0
  },
  {
    id:"printer-usb-cable", category:"external", name:"Printer USB Cable (A-to-B)", short:"Direct USB connection from PC to printer.",
    intro:"A traditional printer USB cable uses USB-A on the computer side and USB-B on the printer side.",
    what:"A data cable with two different USB connector shapes.",
    job:"Carries print and scan data between one computer and a printer.",
    where:"Runs externally from computer to printer.",
    identify:"One flat rectangular USB-A plug and one square-ish USB-B plug.",
    connect:"USB-A/compatible adapter to computer and USB-B to printer.",
    safety:"Do not connect the USB-B end into network or power ports.",
    tech:"Direct USB printing is different from network printing; the driver/port configuration must match the connection method.",
    visual:"printer-cable", quiz:["Direct PC-to-printer data","UPS mains input","CPU power"], answer:0
  },
  {
    id:"hdmi-cable", category:"external", name:"HDMI Cable", short:"Carries digital video and audio.",
    intro:"An HDMI cable connects an HDMI output to an HDMI input for digital video and usually audio.",
    what:"A shielded digital cable with HDMI plugs on its ends.",
    job:"Carries digital display and audio signals.",
    where:"Between computer and monitor/TV/projector.",
    identify:"Flat wide plug with a tapered/trapezoid profile.",
    connect:"HDMI OUT on computer to HDMI IN on display.",
    safety:"Avoid sharp bends and repeated sideways pressure on the connector.",
    tech:"For no display, confirm cable, correct output port and display input source.",
    visual:"hdmi-cable", quiz:["Digital video/audio cable","SATA drive power","Ethernet cable"], answer:0
  },
  {
    id:"displayport-cable", category:"external", name:"DisplayPort Cable", short:"Digital monitor cable common on PCs.",
    intro:"A DisplayPort cable carries high-quality digital display signals between a computer and monitor.",
    what:"A digital display cable with DisplayPort connectors.",
    job:"Carries high-resolution/high-refresh video and may carry audio.",
    where:"Between graphics card/dock and monitor.",
    identify:"Connector has a mostly rectangular shape with a characteristic beveled corner on full-size DP.",
    connect:"DisplayPort output to monitor DisplayPort input.",
    safety:"Release locking tabs on connectors that include them before pulling.",
    tech:"DisplayPort is frequently used for multi-monitor and high-refresh PC setups.",
    visual:"dp-cable", quiz:["Digital PC display cable","Printer power cable only","HDD mechanical part"], answer:0
  },
  {
    id:"vga-cable", category:"external", name:"VGA Cable", short:"Older analog monitor cable.",
    intro:"A VGA cable carries analog video between compatible computers, monitors and projectors.",
    what:"A thick display cable with 15-pin D-sub connectors.",
    job:"Transfers analog video signals.",
    where:"Used with older PCs, monitors and projectors.",
    identify:"Usually blue connectors with 15 pins/holes and two thumb screws.",
    connect:"VGA output to VGA input.",
    safety:"Check pin alignment before connecting and tighten screws gently.",
    tech:"A bent VGA pin can cause missing colors or no display.",
    visual:"vga-cable", quiz:["Analog display cable","Network cable","UPS battery cable"], answer:0
  }
];

let profile = null;
let learned = new Set();
let filteredParts = [...PARTS];
let currentCategory = "all";
let currentId = PARTS[0].id;
let voiceOn = true;
let lastOpened = localStorage.getItem("tannu_hardware_explorer_last") || PARTS[0].id;

function esc(v){
  return String(v ?? "").replace(/[&<>"']/g, c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
}
function progressKey(){
  return `tannu_hardware_explorer_v32_${profile?.user_id || profile?.username || "student"}`;
}
function loadProgress(){
  try{
    const d=JSON.parse(localStorage.getItem(progressKey())||"{}");
    learned=new Set(Array.isArray(d.learned)?d.learned:[]);
    lastOpened=d.lastOpened||lastOpened;
  }catch{
    learned=new Set();
  }
}
function saveProgress(){
  localStorage.setItem(progressKey(),JSON.stringify({
    learned:[...learned],
    lastOpened:currentId,
    updatedAt:new Date().toISOString()
  }));
  localStorage.setItem("tannu_hardware_explorer_last",currentId);
}
function toast(text){
  const el=$("toast");
  if(!el)return;
  el.textContent=text;
  el.classList.add("show");
  clearTimeout(toast.t);
  toast.t=setTimeout(()=>el.classList.remove("show"),1900);
}
async function getProfile(){
  if(!token){
    location.href="student-login.html";
    return null;
  }
  try{
    const r=await fetch(API+"/api/auth/me",{headers:{Authorization:`Bearer ${token}`},cache:"no-store"});
    const d=await r.json();
    if(!r.ok || d.role!=="student" || !d.profile){
      location.href="student-login.html";
      return null;
    }
    const classNo=Number(d.profile.class_number||1);
    if(classNo<4 || classNo>6){
      location.href="student-profile.html";
      return null;
    }
    return d.profile;
  }catch{
    toast("Could not verify the student profile.");
    return null;
  }
}

function visualSvg(type, large=false){
  const view="0 0 900 560";
  const common=`<defs>
    <linearGradient id="metal" x1="0" x2="1"><stop stop-color="#dbe4ea"/><stop offset=".45" stop-color="#8d9ba7"/><stop offset="1" stop-color="#eef4f7"/></linearGradient>
    <linearGradient id="dark" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#394552"/><stop offset=".5" stop-color="#151d27"/><stop offset="1" stop-color="#566370"/></linearGradient>
    <linearGradient id="pcb" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#234f42"/><stop offset=".55" stop-color="#143d33"/><stop offset="1" stop-color="#2e6a54"/></linearGradient>
    <linearGradient id="blue" x1="0" x2="1"><stop stop-color="#486df8"/><stop offset="1" stop-color="#27c8c2"/></linearGradient>
    <filter id="shadow"><feDropShadow dx="0" dy="13" stdDeviation="12" flood-color="#263549" flood-opacity=".28"/></filter>
  </defs>`;
  const shell=(body,label)=>`<svg viewBox="${view}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${esc(label)}">${common}
    <ellipse cx="450" cy="492" rx="290" ry="34" fill="#6f7e8a" opacity=".16"/>
    <g filter="url(#shadow)">${body}</g>
  </svg>`;
  const line=(x1,y1,x2,y2)=>`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#e5c968" stroke-width="5" stroke-linecap="round"/>`;

  if(type==="motherboard"){
    let slots="";
    for(let i=0;i<4;i++) slots+=`<rect x="${600+i*30}" y="125" width="16" height="230" rx="6" fill="#d7d5c8" stroke="#222d32" stroke-width="4"/>`;
    let sata="";
    for(let i=0;i<4;i++) sata+=`<rect x="${690}" y="${380+i*21}" width="80" height="14" rx="3" fill="#202b31" stroke="#7b8c94"/>`;
    return shell(`<path d="M110 80 L750 80 Q785 80 785 115 L785 440 Q785 470 755 470 L135 470 Q105 470 105 440 L105 110 Q105 80 110 80Z" fill="url(#pcb)" stroke="#102a24" stroke-width="10"/>
      <rect x="220" y="135" width="205" height="185" rx="14" fill="#1e332d" stroke="#b9c9b9" stroke-width="7"/>
      <rect x="255" y="170" width="135" height="115" rx="8" fill="url(#metal)" stroke="#65727c" stroke-width="6"/>
      <circle cx="322" cy="227" r="33" fill="#b9c4c9" stroke="#838f95" stroke-width="5"/>
      ${slots}
      <rect x="190" y="365" width="330" height="25" rx="5" fill="#1d2429" stroke="#9faeb4" stroke-width="4"/>
      <rect x="190" y="408" width="260" height="22" rx="5" fill="#1d2429" stroke="#9faeb4" stroke-width="4"/>
      ${sata}
      <rect x="105" y="115" width="70" height="250" rx="8" fill="#c4cdd2" stroke="#53616c" stroke-width="5"/>
      <rect x="710" y="105" width="48" height="78" rx="5" fill="#efefdf" stroke="#555" stroke-width="4"/>
      ${line(325,120,325,78)}<text x="260" y="63" font-size="24" font-weight="800" fill="#304257">CPU SOCKET</text>
      ${line(630,115,630,72)}<text x="585" y="57" font-size="24" font-weight="800" fill="#304257">RAM</text>
      ${line(400,392,400,455)}<text x="305" y="493" font-size="24" font-weight="800" fill="#304257">PCIe SLOTS</text>`, "Motherboard");
  }
  if(type==="cpu"){
    return shell(`<g transform="rotate(-7 450 280)">
      <rect x="265" y="100" width="370" height="360" rx="34" fill="#27524b" stroke="#17362f" stroke-width="12"/>
      <rect x="305" y="140" width="290" height="280" rx="24" fill="url(#metal)" stroke="#6e7a82" stroke-width="9"/>
      <text x="450" y="255" text-anchor="middle" font-size="38" font-weight="1000" fill="#36434c">PROCESSOR</text>
      <text x="450" y="300" text-anchor="middle" font-size="25" font-weight="800" fill="#5c6870">CPU</text>
      <text x="450" y="346" text-anchor="middle" font-size="18" font-weight="700" fill="#737f86">ALIGNMENT MARK</text>
      <path d="M285 420 l45 0 l0 25" fill="none" stroke="#e5c65c" stroke-width="8"/>
      </g>`, "Processor");
  }
  if(type==="fan"){
    let blades="";
    for(let i=0;i<8;i++) blades+=`<ellipse cx="450" cy="195" rx="46" ry="110" fill="#2c3943" transform="rotate(${i*45} 450 280)" opacity=".95"/>`;
    return shell(`<rect x="220" y="55" width="460" height="450" rx="48" fill="#323f49" stroke="#19232b" stroke-width="14"/>
      <circle cx="450" cy="280" r="185" fill="#111921" stroke="#66747d" stroke-width="10"/>
      ${blades}<circle cx="450" cy="280" r="62" fill="url(#metal)" stroke="#596770" stroke-width="8"/>
      <circle cx="450" cy="280" r="25" fill="#24313b"/>
      <path d="M645 405 C760 430 760 475 820 485" fill="none" stroke="#353b42" stroke-width="13"/>
      <text x="680" y="455" font-size="22" font-weight="900" fill="#37495b">FAN CABLE</text>`, "Cooling Fan");
  }
  if(type==="ram"){
    let chips="";
    for(let i=0;i<8;i++) chips+=`<rect x="${190+i*70}" y="214" width="50" height="82" rx="4" fill="#17242a" stroke="#52616b" stroke-width="3"/>`;
    let contacts="";
    for(let i=0;i<35;i++) contacts+=`<rect x="${175+i*16}" y="344" width="9" height="42" fill="#d9b441"/>`;
    return shell(`<path d="M140 165 H760 V365 H500 L480 385 H140Z" fill="url(#pcb)" stroke="#15342d" stroke-width="10"/>
      ${chips}${contacts}
      <rect x="445" y="344" width="28" height="46" fill="#eef3f5"/>
      <text x="450" y="135" text-anchor="middle" font-size="31" font-weight="1000" fill="#33445a">RAM MEMORY MODULE</text>`, "RAM");
  }
  if(type==="nvme"){
    let chips="";
    for(let i=0;i<4;i++) chips+=`<rect x="${270+i*100}" y="222" width="74" height="86" rx="7" fill="#17252c" stroke="#596971" stroke-width="4"/>`;
    return shell(`<g transform="rotate(-7 450 280)">
      <rect x="180" y="185" width="550" height="170" rx="12" fill="url(#pcb)" stroke="#15342d" stroke-width="10"/>
      ${chips}
      <circle cx="210" cy="270" r="15" fill="#eaf1ef" stroke="#7b8d88" stroke-width="5"/>
      <rect x="690" y="210" width="40" height="120" fill="#d0ad3b"/>
      <path d="M710 210 V330" stroke="#f7d65c" stroke-width="4"/>
      <text x="450" y="155" text-anchor="middle" font-size="30" font-weight="1000" fill="#33445a">M.2 NVMe SSD</text>
      </g>`, "M.2 NVMe SSD");
  }
  if(type==="ssd"){
    return shell(`<g transform="rotate(-5 450 280)">
      <rect x="230" y="95" width="440" height="360" rx="28" fill="url(#dark)" stroke="#151d24" stroke-width="12"/>
      <rect x="270" y="140" width="360" height="230" rx="20" fill="#242e36" stroke="#66737d" stroke-width="4"/>
      <text x="450" y="245" text-anchor="middle" font-size="55" font-weight="1000" fill="#dce7eb">SSD</text>
      <text x="450" y="295" text-anchor="middle" font-size="23" font-weight="800" fill="#8fd9d0">SOLID STATE DRIVE</text>
      <rect x="470" y="430" width="115" height="25" rx="3" fill="#d2b14c"/>
      <rect x="590" y="430" width="60" height="25" rx="3" fill="#d2b14c"/>
      </g>`, "SATA SSD");
  }
  if(type==="hdd"){
    return shell(`<g transform="rotate(-5 450 280)">
      <rect x="215" y="75" width="470" height="400" rx="22" fill="url(#metal)" stroke="#59666e" stroke-width="12"/>
      <circle cx="405" cy="275" r="115" fill="#c7d0d4" stroke="#7b888e" stroke-width="10"/>
      <circle cx="405" cy="275" r="38" fill="#6f7d83"/>
      <path d="M520 200 L590 250 L520 330" fill="none" stroke="#38464e" stroke-width="18" stroke-linecap="round"/>
      <rect x="310" y="95" width="280" height="55" rx="8" fill="#eef2f4"/>
      <text x="450" y="132" text-anchor="middle" font-size="23" font-weight="1000" fill="#42515b">HARD DISK DRIVE</text>
      </g>`, "Hard Disk Drive");
  }
  if(type==="nic"){
    return shell(`<g transform="rotate(-4 450 280)">
      <rect x="205" y="160" width="480" height="230" rx="15" fill="url(#pcb)" stroke="#15342d" stroke-width="10"/>
      <rect x="620" y="190" width="95" height="155" rx="7" fill="url(#metal)" stroke="#57646e" stroke-width="7"/>
      <rect x="637" y="226" width="62" height="66" rx="6" fill="#111c23" stroke="#d5b94e" stroke-width="4"/>
      <path d="M645 235 h46 v38 h-46z" fill="#314650"/>
      <rect x="275" y="205" width="105" height="95" rx="9" fill="#17232a"/>
      <rect x="395" y="215" width="70" height="60" rx="6" fill="#1c2930"/>
      <rect x="245" y="385" width="320" height="28" fill="#d5b33e"/>
      <text x="450" y="132" text-anchor="middle" font-size="30" font-weight="1000" fill="#33445a">LAN / ETHERNET CARD</text>
      </g>`, "LAN Card");
  }
  if(type==="gpu"){
    let fans="";
    for(let j=0;j<2;j++){
      let b="";
      const cx=390+j*210;
      for(let i=0;i<8;i++) b+=`<ellipse cx="${cx}" cy="270" rx="25" ry="68" fill="#2b3740" transform="rotate(${i*45} ${cx} 270)"/>`;
      fans+=`<circle cx="${cx}" cy="270" r="95" fill="#151d24" stroke="#697780" stroke-width="7"/>${b}<circle cx="${cx}" cy="270" r="28" fill="#819099"/>`;
    }
    return shell(`<rect x="150" y="115" width="610" height="320" rx="32" fill="url(#dark)" stroke="#151d24" stroke-width="12"/>
      ${fans}
      <rect x="150" y="150" width="45" height="230" fill="url(#metal)"/>
      <rect x="135" y="445" width="440" height="28" fill="#d8b43d"/>
      <text x="455" y="95" text-anchor="middle" font-size="30" font-weight="1000" fill="#33445a">GRAPHICS CARD / GPU</text>`, "Graphics Card");
  }
  if(type==="sata-data"){
    return shell(`<path d="M170 360 C270 140 390 150 480 280 S650 430 745 200" fill="none" stroke="#e63d4e" stroke-width="30" stroke-linecap="round"/>
      <g fill="#242d34" stroke="#11181d" stroke-width="7"><path d="M135 330 h95 v85 h-95z"/><path d="M700 155 h95 v85 h-95z"/></g>
      <path d="M155 350 h55 v22 h-35 v22 h-20z" fill="#b9c1c6"/><path d="M720 175 h55 v22 h-35 v22 h-20z" fill="#b9c1c6"/>
      <text x="450" y="100" text-anchor="middle" font-size="31" font-weight="1000" fill="#33445a">SATA DATA CABLE</text>`, "SATA Data Cable");
  }
  if(type==="sata-power"){
    return shell(`<path d="M230 170 C330 250 300 380 430 400 S600 315 675 385" fill="none" stroke="#252b31" stroke-width="34" stroke-linecap="round"/>
      <path d="M230 170 C330 250 300 380 430 400 S600 315 675 385" fill="none" stroke="#f2c547" stroke-width="6" stroke-dasharray="16 18"/>
      <g fill="#222a30" stroke="#10161a" stroke-width="7"><rect x="155" y="120" width="145" height="95" rx="8"/><rect x="620" y="340" width="145" height="95" rx="8"/></g>
      <path d="M175 148 h90 v38 h-70 v16 h-20z" fill="#c3cbd0"/><path d="M640 367 h90 v38 h-70 v16 h-20z" fill="#c3cbd0"/>
      <text x="450" y="85" text-anchor="middle" font-size="31" font-weight="1000" fill="#33445a">SATA POWER</text>`, "SATA Power Cable");
  }
  if(type==="atx" || type==="eps"){
    const cols= type==="atx" ? 12 : 4;
    const rows=2;
    let holes="";
    const startX= type==="atx" ? 255 : 350;
    const size= type==="atx" ? 30 : 45;
    for(let r=0;r<rows;r++) for(let c=0;c<cols;c++) holes+=`<rect x="${startX+c*(size+4)}" y="${210+r*(size+4)}" width="${size}" height="${size}" rx="5" fill="#111820" stroke="#7d8991" stroke-width="3"/>`;
    return shell(`<path d="M430 360 C360 430 250 470 170 470" fill="none" stroke="#242b31" stroke-width="50" stroke-linecap="round"/>
      <rect x="${type==="atx"?220:320}" y="160" width="${type==="atx"?480:260}" height="190" rx="20" fill="#333d44" stroke="#171d22" stroke-width="10"/>
      ${holes}
      <path d="M430 160 v-35 h70 v35" fill="#252e34" stroke="#171d22" stroke-width="7"/>
      <text x="450" y="105" text-anchor="middle" font-size="30" font-weight="1000" fill="#33445a">${type==="atx"?"24-PIN ATX POWER":"CPU / EPS 4+4 POWER"}</text>`, type==="atx"?"24-Pin ATX Power":"CPU Power Cable");
  }
  if(type==="rear-io"){
    return shell(`<rect x="145" y="70" width="610" height="420" rx="20" fill="url(#metal)" stroke="#59666f" stroke-width="10"/>
      <g stroke="#1a232a" stroke-width="6">
        <rect x="195" y="120" width="105" height="75" rx="7" fill="#2b68a8"/>
        <rect x="330" y="120" width="95" height="75" rx="7" fill="#1b232a"/>
        <rect x="455" y="120" width="95" height="75" rx="7" fill="#1b232a"/>
        <rect x="585" y="115" width="115" height="95" rx="9" fill="#202a31"/>
        <rect x="200" y="240" width="80" height="60" rx="5" fill="#181f25"/>
        <rect x="300" y="240" width="80" height="60" rx="5" fill="#2362a1"/>
        <rect x="410" y="230" width="130" height="90" rx="8" fill="#172229"/>
      </g>
      <circle cx="600" cy="300" r="29" fill="#74b96a"/><circle cx="670" cy="300" r="29" fill="#e8819a"/>
      <circle cx="600" cy="375" r="29" fill="#7b9ddd"/><circle cx="670" cy="375" r="29" fill="#e2b163"/>
      <text x="450" y="52" text-anchor="middle" font-size="30" font-weight="1000" fill="#33445a">DESKTOP REAR I/O</text>`, "Rear I/O Ports");
  }
  if(["vga","hdmi","dp","usb-a","usb-c","rj45","audio","iec","usb-b","printer-power","ups-in","ups-out"].includes(type)){
    const labelMap={vga:"VGA",hdmi:"HDMI",dp:"DISPLAYPORT", "usb-a":"USB-A","usb-c":"USB-C",rj45:"RJ45 LAN",audio:"AUDIO JACKS",iec:"IEC C14 POWER","usb-b":"USB-B PRINTER","printer-power":"PRINTER POWER","ups-in":"UPS AC INPUT","ups-out":"UPS OUTPUT"};
    let shape="";
    if(type==="vga"){
      let dots=""; for(let r=0;r<3;r++)for(let c=0;c<5;c++)dots+=`<circle cx="${330+c*58}" cy="${245+r*58}" r="9" fill="#dce7ee"/>`;
      shape=`<path d="M210 170 H690 L650 405 H250Z" fill="#2861a7" stroke="#173f72" stroke-width="12"/>${dots}<circle cx="185" cy="288" r="25" fill="#b9c4cb"/><circle cx="715" cy="288" r="25" fill="#b9c4cb"/>`;
    } else if(type==="hdmi"){
      shape=`<path d="M210 195 H690 L645 390 H255Z" fill="#222b31" stroke="#10161a" stroke-width="14"/><path d="M285 245 H615 L590 345 H310Z" fill="#d7b957"/><path d="M305 262 H595 L575 325 H325Z" fill="#101820"/>`;
    } else if(type==="dp"){
      shape=`<path d="M220 170 H690 V360 L625 415 H220Z" fill="#252f35" stroke="#11181c" stroke-width="14"/><path d="M300 235 H610 V340 L575 365 H300Z" fill="#c5cdd2"/>`;
    } else if(type==="usb-a"){
      shape=`<rect x="225" y="175" width="450" height="230" rx="18" fill="#252f35" stroke="#11181c" stroke-width="14"/><rect x="295" y="235" width="310" height="110" rx="10" fill="#3c82bd"/><rect x="345" y="255" width="210" height="55" rx="5" fill="#d4dce0"/>`;
    } else if(type==="usb-c"){
      shape=`<rect x="205" y="205" width="490" height="165" rx="82" fill="#252f35" stroke="#11181c" stroke-width="14"/><rect x="285" y="250" width="330" height="75" rx="38" fill="#c9d2d7"/><rect x="365" y="274" width="170" height="27" rx="14" fill="#263139"/>`;
    } else if(type==="rj45"){
      let pins="";for(let i=0;i<8;i++)pins+=`<rect x="${320+i*33}" y="220" width="18" height="65" fill="#e5bd45"/>`;
      shape=`<path d="M235 150 H665 V420 H235Z" fill="#28343b" stroke="#11191e" stroke-width="14"/><path d="M285 205 H615 V355 L555 400 H345 L285 355Z" fill="#172128"/>${pins}`;
    } else if(type==="audio"){
      shape=`<circle cx="320" cy="280" r="105" fill="#6dbf74" stroke="#30483a" stroke-width="14"/><circle cx="320" cy="280" r="45" fill="#172228"/><circle cx="580" cy="280" r="105" fill="#e88aa1" stroke="#67404c" stroke-width="14"/><circle cx="580" cy="280" r="45" fill="#172228"/>`;
    } else if(type==="usb-b"){
      shape=`<path d="M280 160 H620 L690 230 V420 H210 V230Z" fill="#263139" stroke="#11181c" stroke-width="14"/><path d="M320 225 H580 L620 265 V355 H280 V265Z" fill="#cad4d8"/><rect x="365" y="270" width="170" height="60" rx="8" fill="#23303a"/>`;
    } else if(type==="ups-out"){
      shape=`<rect x="210" y="120" width="480" height="340" rx="35" fill="url(#dark)" stroke="#141c23" stroke-width="14"/>
        <g fill="#e7ecef" stroke="#5d6870" stroke-width="6">
          <rect x="275" y="185" width="135" height="105" rx="12"/><rect x="490" y="185" width="135" height="105" rx="12"/>
          <rect x="275" y="325" width="135" height="90" rx="12"/><rect x="490" y="325" width="135" height="90" rx="12"/>
        </g>`;
    } else {
      shape=`<rect x="250" y="130" width="400" height="330" rx="28" fill="url(#dark)" stroke="#151d24" stroke-width="14"/>
        <path d="M330 205 H570 V385 H330Z" fill="#111920" stroke="#8d9aa2" stroke-width="8"/>
        <path d="M385 235 v85 M515 235 v85 M450 310 v55" stroke="#d8e1e5" stroke-width="22" stroke-linecap="round"/>`;
    }
    return shell(`${shape}<text x="450" y="95" text-anchor="middle" font-size="34" font-weight="1000" fill="#33445a">${labelMap[type]}</text>`, labelMap[type]);
  }
  if(["ethernet","printer-cable","hdmi-cable","dp-cable","vga-cable"].includes(type)){
    const info={
      ethernet:["#3789d4","RJ45 ↔ RJ45"],
      "printer-cable":["#444f59","USB-A ↔ USB-B"],
      "hdmi-cable":["#2a3036","HDMI ↔ HDMI"],
      "dp-cable":["#242d33","DP ↔ DP"],
      "vga-cable":["#2a63a4","VGA ↔ VGA"]
    }[type];
    return shell(`<path d="M160 360 C260 130 420 160 495 305 S655 420 745 180" fill="none" stroke="${info[0]}" stroke-width="30" stroke-linecap="round"/>
      <rect x="110" y="320" width="150" height="95" rx="18" fill="#2a343b" stroke="#151c21" stroke-width="8"/>
      <rect x="660" y="135" width="150" height="95" rx="18" fill="#2a343b" stroke="#151c21" stroke-width="8"/>
      <text x="450" y="92" text-anchor="middle" font-size="31" font-weight="1000" fill="#33445a">${info[1]}</text>`, info[1]);
  }
  return shell(`<rect x="250" y="130" width="400" height="300" rx="40" fill="url(#blue)"/><text x="450" y="290" text-anchor="middle" font-size="42" font-weight="1000" fill="white">HARDWARE</text>`, "Hardware");
}

function partAssetPath(part){
  return `${ASSET_BASE}${part.id}.webp`;
}
function renderVisual(part, host, large=false){
  if(!host) return;

  /*
    V32.1:
    Always paint the built-in 3D learning visual FIRST.
    This prevents an empty detail panel while an optional real-photo asset
    is being checked. If the real photo exists, it replaces the 3D visual.
  */
  host.innerHTML=visualSvg(part.visual,large);

  /*
    V32.2:
    The card visuals already work, but a percentage SVG height inside the
    large detail panel can collapse in some browsers because the parent
    uses min-height rather than a definite height. Force a real rendered
    size for the large SVG.
  */
  const learningSvg=host.querySelector("svg");
  if(learningSvg){
    learningSvg.style.display="block";
    learningSvg.style.visibility="visible";
    learningSvg.style.opacity="1";
    learningSvg.style.width=large ? "96%" : "94%";
    learningSvg.style.height="auto";
    learningSvg.style.maxHeight=large ? "560px" : "92px";
    learningSvg.style.margin="0 auto";
  }

  if(large && $("assetStatus")){
    $("assetStatus").textContent="3D Learning Visual";
  }

  const img=new Image();
  img.alt=`${part.name} real hardware photo`;
  img.decoding="async";
  img.loading="eager";

  img.onload=()=>{
    if(!host.isConnected) return;
    host.replaceChildren(img);

    if(large && $("assetStatus")){
      $("assetStatus").textContent="Real Photo Asset";
    }
  };

  img.onerror=()=>{
    /*
      Keep or restore the already-rendered 3D visual.
      Never leave the box empty when a real-photo file is missing.
    */
    if(!host.querySelector("svg") && !host.querySelector("img")){
      host.innerHTML=visualSvg(part.visual,large);
    }

    const fallbackSvg=host.querySelector("svg");
    if(fallbackSvg){
      fallbackSvg.style.display="block";
      fallbackSvg.style.visibility="visible";
      fallbackSvg.style.opacity="1";
      fallbackSvg.style.width=large ? "96%" : "94%";
      fallbackSvg.style.height="auto";
      fallbackSvg.style.maxHeight=large ? "560px" : "92px";
      fallbackSvg.style.margin="0 auto";
    }

    if(large && $("assetStatus")){
      $("assetStatus").textContent="3D Learning Visual";
    }
  };

  img.src=partAssetPath(part);
}

function updateStats(){
  const total=PARTS.length;
  const learnedCount=[...learned].filter(id=>PARTS.some(p=>p.id===id)).length;
  $("totalParts").textContent=total;
  $("learnedCount").textContent=learnedCount;
  $("progressPercent").textContent=`${Math.round((learnedCount/total)*100)}%`;
  $("visibleCount").textContent=filteredParts.length;
  $("currentCategory").textContent=currentCategory==="all"?"All":CATEGORIES.find(c=>c.id===currentCategory)?.name||"All";
}
function renderCategories(){
  $("categoryList").innerHTML=CATEGORIES.map(c=>{
    const count=c.id==="all"?PARTS.length:PARTS.filter(p=>p.category===c.id).length;
    return `<button class="hx-category-btn ${currentCategory===c.id?"active":""}" data-category="${c.id}" type="button">
      <span>${c.icon} ${esc(c.name)}</span><span>${count}</span>
    </button>`;
  }).join("");
  qa("[data-category]").forEach(b=>b.onclick=()=>{
    currentCategory=b.dataset.category;
    $("partSearch").value="";
    applyFilter();
  });
}
function applyFilter(){
  const q=$("partSearch").value.trim().toLowerCase();
  filteredParts=PARTS.filter(p=>{
    const cat=currentCategory==="all" || p.category===currentCategory;
    const text=`${p.name} ${p.short} ${p.intro}`.toLowerCase();
    return cat && (!q || text.includes(q));
  });
  renderCategories();
  renderGrid();
  updateStats();
  const category=CATEGORIES.find(c=>c.id===currentCategory);
  $("libraryTitle").textContent=currentCategory==="all"?"All Hardware & Connections":category?.name||"Hardware";
  $("librarySubtitle").textContent=filteredParts.length
    ? `${filteredParts.length} item${filteredParts.length===1?"":"s"} ready to explore.`
    : "No matching hardware found.";
}
function renderGrid(){
  $("partGrid").innerHTML=filteredParts.map(part=>`
    <button class="hx-part-card ${learned.has(part.id)?"learned":""}" data-part="${part.id}" type="button">
      <div class="hx-card-visual" id="cardVisual-${part.id}"></div>
      <h3>${esc(part.name)}</h3>
      <p>${esc(part.short)}</p>
      <span class="hx-card-tag">${esc(CATEGORIES.find(c=>c.id===part.category)?.name||"Hardware")}</span>
    </button>
  `).join("");
  filteredParts.forEach(part=>{
    const host=$(`cardVisual-${part.id}`);
    if(host) host.innerHTML=visualSvg(part.visual,false);
  });
  qa("[data-part]").forEach(card=>card.onclick=()=>openPart(card.dataset.part));
}
function openPart(id){
  const part=PARTS.find(p=>p.id===id)||PARTS[0];
  currentId=part.id;
  lastOpened=currentId;
  saveProgress();

  $("explorer").classList.add("hidden");
  $("detailView").classList.remove("hidden");

  const index=PARTS.findIndex(p=>p.id===part.id);
  $("detailPosition").textContent=`${index+1} / ${PARTS.length}`;
  $("detailCategory").textContent=CATEGORIES.find(c=>c.id===part.category)?.name||"Hardware";
  $("partNumber").textContent=`PART ${String(index+1).padStart(2,"0")}`;
  $("partTitle").textContent=part.name;
  $("partIntro").textContent=part.intro;
  $("whatText").textContent=part.what;
  $("jobText").textContent=part.job;
  $("whereText").textContent=part.where;
  $("identifyText").textContent=part.identify;
  $("connectText").textContent=part.connect;
  $("safetyText").textContent=part.safety;
  $("techText").textContent=part.tech;
  $("visualCaptionTitle").textContent=part.name;
  $("visualCaption").textContent="Large visual model. Add an optional local real-photo asset with the same part ID for photo mode.";

  $("markLearned").textContent=learned.has(part.id)?"✅ Learned — Undo":"✅ Mark as Learned";
  renderVisual(part,$("bigVisual"),true);
  renderQuiz(part);

  $("prevPart").disabled=index===0;
  $("nextPart").disabled=index===PARTS.length-1;

  window.scrollTo({top:0,behavior:"smooth"});
}
function closeDetail(){
  $("detailView").classList.add("hidden");
  $("explorer").classList.remove("hidden");
  applyFilter();
  setTimeout(()=>$("explorer").scrollIntoView({behavior:"smooth",block:"start"}),50);
}
function renderQuiz(part){
  $("quizQuestion").textContent=`What is the main job of ${part.name}?`;
  $("quizFeedback").textContent="Choose one answer.";
  $("quizOptions").innerHTML=part.quiz.map((opt,i)=>`<button class="hx-quiz-option" data-answer="${i}" type="button">${String.fromCharCode(65+i)}. ${esc(opt)}</button>`).join("");
  qa("[data-answer]").forEach(btn=>btn.onclick=()=>{
    qa("[data-answer]").forEach(x=>x.disabled=true);
    const chosen=Number(btn.dataset.answer);
    if(chosen===part.answer){
      btn.classList.add("correct");
      $("quizFeedback").textContent="✅ Correct. Good technician thinking!";
      learned.add(part.id);
      saveProgress();
      updateStats();
      $("markLearned").textContent="✅ Learned — Undo";
    }else{
      btn.classList.add("wrong");
      qa("[data-answer]")[part.answer]?.classList.add("correct");
      $("quizFeedback").textContent="❌ Not this one. The correct answer is highlighted.";
    }
  });
}
function speakCurrent(){
  if(!voiceOn) return toast("Voice is turned off.");
  const part=PARTS.find(p=>p.id===currentId);
  if(!part)return;
  if(!("speechSynthesis" in window)) return toast("Voice is not supported in this browser.");
  speechSynthesis.cancel();
  const text=`${part.name}. ${part.intro} What does it do? ${part.job} Where is it? ${part.where} Safety rule. ${part.safety}`;
  const u=new SpeechSynthesisUtterance(text);
  u.rate=.9;u.pitch=1;
  speechSynthesis.speak(u);
}
function wire(){
  $("profileBtn").onclick=()=>location.href="student-profile.html";
  $("detailProfileBtn").onclick=()=>location.href="student-profile.html";
  $("voiceToggle").onclick=()=>{
    voiceOn=!voiceOn;
    $("voiceToggle").textContent=voiceOn?"🔊 Voice On":"🔇 Voice Off";
    if(!voiceOn && "speechSynthesis" in window) speechSynthesis.cancel();
  };
  $("startExplorer").onclick=()=>$("explorer").scrollIntoView({behavior:"smooth",block:"start"});
  $("randomPart").onclick=()=>openPart(PARTS[Math.floor(Math.random()*PARTS.length)].id);
  $("resumeBtn").onclick=()=>openPart(PARTS.some(p=>p.id===lastOpened)?lastOpened:PARTS[0].id);
  $("partSearch").oninput=()=>applyFilter();
  $("backToLibrary").onclick=closeDetail;
  $("hearPart").onclick=speakCurrent;
  $("markLearned").onclick=()=>{
    if(learned.has(currentId)){
      learned.delete(currentId);
      toast("Marked as not learned yet.");
    }else{
      learned.add(currentId);
      toast("✅ Part marked as learned.");
    }
    saveProgress();
    updateStats();
    $("markLearned").textContent=learned.has(currentId)?"✅ Learned — Undo":"✅ Mark as Learned";
  };
  $("prevPart").onclick=()=>{
    const i=PARTS.findIndex(p=>p.id===currentId);
    if(i>0) openPart(PARTS[i-1].id);
  };
  $("nextPart").onclick=()=>{
    const i=PARTS.findIndex(p=>p.id===currentId);
    if(i<PARTS.length-1) openPart(PARTS[i+1].id);
  };
  document.addEventListener("keydown",e=>{
    if($("detailView").classList.contains("hidden")) return;
    if(e.key==="ArrowLeft" && !$("prevPart").disabled) $("prevPart").click();
    if(e.key==="ArrowRight" && !$("nextPart").disabled) $("nextPart").click();
    if(e.key==="Escape") closeDetail();
  });
}
async function init(){
  profile=await getProfile();
  if(!profile)return;

  const name=profile.display_name||profile.username||"Student";
  $("profileBtn").textContent=`👤 ${name}`;
  $("classChip").textContent=`🎓 Class ${Number(profile.class_number||4)}`;

  loadProgress();
  renderCategories();
  renderGrid();
  updateStats();
  wire();
}

if(document.readyState==="loading"){
  document.addEventListener("DOMContentLoaded",init);
}else{
  init();
}
})();
