/* ============================================================
   V40.9.1 — CLEAN VOICE SPEECH
   Emojis stay visible in chat but are NOT spoken aloud.
   ============================================================ */

function cleanTextForSpeech(text){

  return String(
    text || ""
  )

    /*
      Remove emoji / facial expressions / icons from TTS only.
      Visible chatbot message remains unchanged.
    */
    .replace(
      /[\p{Extended_Pictographic}\p{Regional_Indicator}]/gu,
      " "
    )

    /*
      Remove emoji variation/joiner characters.
    */
    .replace(
      /[\uFE0E\uFE0F\u200D]/g,
      " "
    )

    /*
      Clean spaces created after emoji removal.
    */
    .replace(
      /\s+/g,
      " "
    )

    /*
      Avoid space before punctuation:
      "Friend !" -> "Friend!"
    */
    .replace(
      /\s+([,.!?;:])/g,
      "$1"
    )

    .trim();
}


function speak(text){

  if(
    !(
      "speechSynthesis"
      in window
    )
  ){
    return;
  }

  const spoken=
    cleanTextForSpeech(
      text
    );

  if(!spoken){
    return;
  }

  window
    .speechSynthesis
    .cancel();

  const lang=
    preferredSpeechLanguage(
      spoken
    );

  const u=
    new SpeechSynthesisUtterance(
      spoken
    );

  u.lang=
    lang;

  u.rate=
    studentClass<=2
      ?0.84
      :studentClass<=4
        ?0.88
        :0.91;

  u.pitch=
    1.08;

  u.volume=
    1;

  const v=
    chooseFriendlyFemaleVoice(
      lang
    );

  if(v){
    u.voice=
      v;
  }

  window
    .speechSynthesis
    .speak(
      u
    );
}
