(() => {
"use strict";

function bootBattleV2(){
  const mode=document.getElementById("battleMode");
  if(mode){
    const tech=[...mode.options].find(o=>o.value==="tech");
    if(tech) tech.textContent="Junior IT Technician Battle • 5 Min";
  }

  if(typeof window.playBattle!=="function" || typeof api!=="function") return;

  window.playBattle=async function(id){
    try{
      const r=await api(`/api/student/battles/${id}`);
      const d=await r.json();

      if(!r.ok) throw new Error(d.error||"Battle unavailable");

      const b=d.battle;
      const mode=b.mode;
      const level=+b.level;

      const rand=
        typeof seeded==="function"
          ? seeded(b.question_seed)
          : Math.random;

      let questions;

      if(mode==="safety"){
        questions=
          (typeof TECH_Q!=="undefined"
            ? TECH_Q.safety
            : []) || [];
      }

      else if(mode==="tech"){
        questions=[
          ...(typeof TECH_Q!=="undefined" ? TECH_Q.fix : []),
          ...(typeof TECH_Q!=="undefined" ? TECH_Q.network : []),
          ...(typeof TECH_Q!=="undefined" ? TECH_Q.cable : [])
        ];
      }

      else if(mode==="prompt"){
        questions=
          (typeof TECH_Q!=="undefined"
            ? TECH_Q.prompt
            : []) || [];
      }

      else{
        questions=
          (typeof TEST_BANK!=="undefined"
            ? TEST_BANK
            : []
          ).map(q=>[q[0],q[1],q[2]]);
      }


      if(mode==="typing"){
        return window.__kidTypingBattleV2(
          id,
          b,
          rand,
          level
        );
      }


      questions=
        (
          typeof seedShuffle==="function"
            ? seedShuffle(questions,rand)
            : questions
        )
        .slice(
          0,
          Math.min(
            10,
            questions.length
          )
        );


      if(!questions.length){
        throw new Error(
          "No battle questions available"
        );
      }


      const TOTAL_MS=5*60*1000;

      let i=0;
      let correct=0;
      let wrong=0;
      let answered=0;

      const start=Date.now();

      let timer=null;
      let finished=false;

      const modalBody=
        document.getElementById("modalBody");


      const finish=async()=>{

        if(finished) return;

        finished=true;

        clearInterval(timer);

        const elapsed=
          Math.min(
            TOTAL_MS,
            Date.now()-start
          );

        const remaining=
          Math.max(
            0,
            TOTAL_MS-elapsed
          );

        const speed=
          Math.round(
            (remaining/TOTAL_MS)*100
          );

        const finalScore=
          correct*100
          + speed*2
          - wrong*10;

        await submitBattle(
          id,
          Math.max(
            0,
            finalScore
          )
        );
      };


      const draw=()=>{

        if(finished) return;

        if(i>=questions.length){
          return finish();
        }

        const q=questions[i];

        modalBody.innerHTML=`
          <div
            class="quiz"
            style="
              text-align:center
            "
          >

            <h2>
              ⚔️ 5-Minute Tech Battle
            </h2>

            <div
              style="
                display:grid;
                grid-template-columns:
                  1fr 1fr 1fr;
                gap:8px;
                margin:10px 0
              "
            >

              <div class="focus-box">
                <b id="battleClock">
                  05:00
                </b>
                <br>
                <small>
                  TIME
                </small>
              </div>

              <div class="focus-box">
                <b>
                  ${i+1}/${questions.length}
                </b>
                <br>
                <small>
                  ROUND
                </small>
              </div>

              <div class="focus-box">
                <b>
                  ${correct}
                </b>
                <br>
                <small>
                  CORRECT
                </small>
              </div>

            </div>


            <div
              style="
                height:12px;
                background:#eceef8;
                border-radius:99px;
                overflow:hidden
              "
            >
              <i
                style="
                  display:block;
                  height:100%;
                  width:${
                    Math.round(
                      i/questions.length*100
                    )
                  }%;
                  background:
                    linear-gradient(
                      90deg,
                      #6c5cff,
                      #24cfc2
                    )
                "
              ></i>
            </div>


            <div
              style="
                font-size:52px;
                margin:16px
              "
            >
              ${
                mode==="tech"
                  ? "🧑‍💻"
                  : mode==="safety"
                    ? "🛡️"
                    : mode==="prompt"
                      ? "🤖"
                      : "🧠"
              }
            </div>


            <p
              style="
                font-size:21px;
                font-weight:1000;
                line-height:1.4
              "
            >
              ${q[0]}
            </p>


            <div class="choices">

              ${
                (
                  typeof shuffle==="function"
                    ? shuffle(q[2])
                    : q[2]
                )
                .map(
                  x=>`
                    <button
                      data-v14-answer="${
                        x===q[1]
                          ? 1
                          : 0
                      }"
                      style="
                        min-height:58px;
                        font-size:15px
                      "
                    >
                      ${x}
                    </button>
                  `
                )
                .join("")
              }

            </div>


            <p
              style="
                font-size:11px;
                color:#727b99
              "
            >
              Same challenge is used
              for both students.
              No open chat.
            </p>

          </div>
        `;


        if(
          typeof openModal==="function"
        ){
          openModal();
        }


        if(
          typeof speak==="function"
        ){
          speak(q[0]);
        }


        modalBody
          .querySelectorAll(
            "[data-v14-answer]"
          )
          .forEach(
            btn=>{

              btn.onclick=()=>{

                answered++;

                if(
                  btn.dataset.v14Answer==="1"
                ){

                  correct++;

                  btn.style.background=
                    "#dbfff1";

                  if(
                    typeof window.speak
                    ==="function"
                  ){
                    speak(
                      "Correct!"
                    );
                  }

                }

                else{

                  wrong++;

                  btn.style.background=
                    "#ffe6ec";

                  if(
                    typeof window.speak
                    ==="function"
                  ){
                    speak(
                      "Good try. Next question."
                    );
                  }

                }


                i++;

                setTimeout(
                  draw,
                  260
                );

              };

            }
          );

      };


      timer=setInterval(
        ()=>{

          const left=
            Math.max(
              0,
              TOTAL_MS-
              (
                Date.now()-start
              )
            );

          const el=
            document.getElementById(
              "battleClock"
            );

          if(el){

            const s=
              Math.ceil(
                left/1000
              );

            const m=
              Math.floor(
                s/60
              );

            const ss=
              String(
                s%60
              ).padStart(
                2,
                "0"
              );

            el.textContent=
              `${
                String(m)
                  .padStart(
                    2,
                    "0"
                  )
              }:${ss}`;

          }


          if(left<=0){
            finish();
          }

        },
        250
      );


      draw();

    }

    catch(e){

      if(
        typeof toast==="function"
      ){
        toast(e.message);
      }

    }

  };


  window.__kidTypingBattleV2=
    async function(
      id,
      b,
      rand,
      level
    ){

      const words=
        level===1
          ? [
              "MOUSE",
              "ROBOT",
              "FILE",
              "RAM"
            ]

          : level===2
            ? [
                "KEYBOARD",
                "MONITOR",
                "PRINTER",
                "NETWORK"
              ]

            : [
                "KEEP PASSWORDS PRIVATE",
                "CHECK THE NETWORK CABLE",
                "I LIKE LEARNING COMPUTERS"
              ];


      const target=
        words[
          Math.floor(
            rand()*words.length
          )
        ];


      const start=
        Date.now();


      const body=
        document.getElementById(
          "modalBody"
        );


      body.innerHTML=`
        <div
          class="quiz"
          style="
            text-align:center
          "
        >

          <h2>
            ⌨️ Typing Race
          </h2>

          <p>
            Type exactly:
          </p>

          <div
            class="bubble"
            style="
              font-size:25px
            "
          >
            ${target}
          </div>

          <input
            id="battleType"
            style="
              width:100%;
              margin-top:12px;
              padding:15px;
              border:
                2px solid #ddd;
              border-radius:14px;
              font-size:18px
            "
          >

          <button
            id="battleTypeGo"
            class="primary"
            style="
              width:100%;
              margin-top:10px;
              min-height:58px
            "
          >
            🏁 Finish Race
          </button>

        </div>
      `;


      openModal();


      document
        .getElementById(
          "battleType"
        )
        .focus();


      document
        .getElementById(
          "battleTypeGo"
        )
        .onclick=()=>{

          const exact=
            document
              .getElementById(
                "battleType"
              )
              .value
              .trim()
              .toUpperCase()
              ===target;


          const seconds=
            (
              Date.now()-start
            )/1000;


          const score=
            (
              exact
                ? 500
                : 100
            )
            +
            Math.max(
              0,
              Math.round(
                300-
                seconds*8
              )
            );


          submitBattle(
            id,
            score
          );

        };

    };

}


if(
  document.readyState
  ==="loading"
){

  document.addEventListener(
    "DOMContentLoaded",
    ()=>{
      setTimeout(
        bootBattleV2,
        700
      );
    }
  );

}

else{

  setTimeout(
    bootBattleV2,
    700
  );

}

})();
