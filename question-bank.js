(function(){
const categories={
Digital:["monitor","mouse","keyboard","system unit","RAM","SSD","printer","speaker","webcam","router","switch","file","folder","browser","Wi-Fi"],
English:["hello","thank you","please","sorry","family","school","happy","help","repeat","computer","water","friend"],
Safety:["password","unknown link","download","private information","trusted adult","kind online","screen break"],
Healthy:["water","fruit","vegetables","breakfast","sleep","hand washing","teeth","movement","sometimes food"],
Logic:["pattern","sequence","matching","odd one out","memory","observation"],
AI:["clear prompt","private information","check answers","ask clearly","safe AI"]
};

const bank=[];
let id=1;

for(const [cat,items] of Object.entries(categories)){
  for(let round=1;round<=65;round++){
    for(const item of items){
      bank.push({
        id:id++,
        cat,
        level:1+(round%3),
        q:`${cat} practice: choose or explain ${item}.`,
        a:item,
        kind:round%5===0
          ? 'speaking'
          : round%4===0
          ? 'picture'
          : round%3===0
          ? 'practical'
          : 'mcq'
      });
    }
  }
}

while(bank.length<5200){
  const n=bank.length+1;
  const keys=Object.keys(categories);
  const cat=keys[n%keys.length];
  const item=categories[cat][n%categories[cat].length];

  bank.push({
    id:n,
    cat,
    level:1+(n%3),
    q:`Skill challenge ${n}: what do you know about ${item}?`,
    a:item,
    kind:n%4===0 ? 'picture' : 'mcq'
  });
}

window.TANNU_QUESTION_BANK=bank.slice(0,5200);
window.TANNU_QUESTION_COUNT=window.TANNU_QUESTION_BANK.length;
})();
