/* ============================================================
   V40 — TANNU'S LEARNING BUDDY 2.0 WORKER
   Safe Class 1–6 conversational + learning fallback.
   ============================================================ */

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    const cors = {
      "Access-Control-Allow-Origin":
        getAllowedOrigin(request),

      "Access-Control-Allow-Methods":
        "GET,POST,OPTIONS",

      "Access-Control-Allow-Headers":
        "Content-Type, Authorization",

      "Access-Control-Max-Age":
        "86400"
    };


    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: cors
      });
    }


    if (url.pathname === "/") {
      return json(
        {
          ok: true,
          service: "Tannu Kids AI",
          endpoints: [
            "/chat",
            "/image"
          ]
        },
        200,
        cors
      );
    }


    if (request.method !== "POST") {
      return json(
        {
          error: "Method not allowed"
        },
        405,
        cors
      );
    }


    if (!env.OPENAI_API_KEY) {
      return json(
        {
          error:
            "OPENAI_API_KEY secret is missing."
        },
        500,
        cors
      );
    }


    try {

      if (url.pathname === "/chat") {
        return await handleChat(
          request,
          env,
          cors
        );
      }


      if (url.pathname === "/image") {
        return await handleImage(
          request,
          env,
          cors
        );
      }


      return json(
        {
          error: "Endpoint not found"
        },
        404,
        cors
      );

    }

    catch (error) {

      console.error(
        "Kids AI Worker error:",
        error
      );


      return json(
        {
          error:
            "AI service is temporarily unavailable."
        },
        500,
        cors
      );
    }
  }
};



async function handleChat(
  request,
  env,
  cors
) {

  const body =
    await readJson(request);

  const message =
    String(
      body?.message || ""
    ).trim();

  const classNumber =
    Math.max(
      1,
      Math.min(
        6,
        Number(body?.classNumber || 1)
      )
    );

  const topic =
    String(
      body?.topic || ""
    )
      .slice(0,80)
      .trim();

  const mode =
    String(
      body?.mode || "chat"
    )
      .slice(0,40)
      .trim();


  if (!message) {

    return json(
      {
        error:
          "Please ask a question."
      },
      400,
      cors
    );
  }


  if (message.length > 1200) {

    return json(
      {
        error:
          "Please ask a shorter question."
      },
      400,
      cors
    );
  }


  const manners =
    mannersCheck(message);

  if (manners) {
    return json(
      {
        text:
          manners
      },
      200,
      cors
    );
  }


  const localSafety =
    localSafetyCheck(message);


  if (!localSafety.ok) {

    return json(
      {
        text:
          localSafety.reply
      },
      200,
      cors
    );
  }


  const safe =
    await moderateText(
      message,
      env
    );


  if (!safe) {

    return json(
      {
        text:
          "Let's choose a safe learning question. You can ask me about computers, English, GK, science, healthy habits, safety or your IT lab."
      },
      200,
      cors
    );
  }


  const levelGuide =
    classNumber <= 2
      ? "Use 1 to 3 very short sentences, very easy words, and one tiny example when useful."
      : classNumber <= 4
        ? "Use 2 to 5 short sentences, clear school-level words, and a simple example when useful."
        : "Use clear Class 5–6 language. You may use basic technical terms, but explain them simply. Usually stay within 3 to 7 short sentences.";


  const instructions = `
You are "Tannu's Learning Buddy", a safe, warm and professional virtual learning assistant for children in Classes 1 to 6.

CURRENT STUDENT LEVEL:
- Class: ${classNumber}
- Current topic, when available: ${topic || "general chat"}
- Current mode: ${mode || "chat"}
- Reading rule: ${levelGuide}

IDENTITY:
- You are Tannu's Learning Buddy, a virtual assistant inside Tannu Sir's Kids Digital Academy.
- You are not a human, and you do not have a human age, home, private life or human gender.
- You can have a friendly female-style spoken voice in the browser, but do not claim to be a real girl or woman.
- Do not claim to be Tannu Sir.

NORMAL CONVERSATION:
- You are allowed to answer normal everyday child-safe questions, not only school questions.
- Respond naturally to greetings, "how are you?", "what's up?", jokes, curiosity, simple everyday conversation and questions about yourself.
- Never respond dismissively with only "I don't know."
- If you truly do not have enough information, say politely that the information is not in your current learning context/database and invite the child to clarify.
- Do not invent personal facts.

"WHAT DO YOU KNOW ABOUT ME?":
- Never guess personal details.
- You may say you only know the Class level supplied for this conversation and what the child says in the current chat.
- Never claim to know passwords, OTPs, address, phone number, exact location, school address, family secrets or other private data.

LANGUAGE:
- Reply in the SAME language style used by the child.
- Hindi script -> simple Hindi.
- English -> simple English.
- Hinglish -> natural easy Hinglish in Latin script.
- Do not force English.

MANNERS:
- If a child insults you, swears or uses abusive language, never insult them back and never shame them.
- Reply calmly like a respectful teacher/elder.
- Say that respectful language is better, and suggest a polite way to express anger such as "I am upset" or "mujhe gussa aa raha hai."
- Then invite them to continue respectfully.

LEARNING TOPICS:
- Computers and hardware
- Windows and software
- Internet and networking
- Safe IT troubleshooting
- English speaking
- GK, science and math
- Healthy habits and manners
- Cyber safety and AI basics
- Coding basics
- Class 4–6 practical IT lab support

IT LAB HELP:
- Give one safe step at a time.
- Prefer simple reversible checks first.
- Never tell a child to open a PSU/SMPS or touch mains electricity.
- For real electrical equipment, tell the child to involve a trusted adult/teacher.
- Class 4–6 may receive basic IP, DHCP, DNS, ping and troubleshooting explanations when relevant.

SAFETY & PRIVACY:
- Never ask for password, OTP, phone number, home address, school address or exact location.
- Never encourage a child to contact a stranger.
- Never provide sexual, graphic, dangerous, illegal, self-harm or harmful instructions.
- For serious danger, self-harm, health emergencies or unsafe situations, tell the child to contact a parent, teacher or trusted adult immediately and use local emergency help when needed.
- Do not provide medical diagnosis.
- Keep health information educational and age appropriate.
- AI can make mistakes; remind the child to verify important school facts with a teacher, textbook or trusted source when useful.

STYLE:
- Be friendly, confident and professional.
- Do not sound robotic.
- Do not patronize.
- Use emojis lightly, not in every sentence.
- Do not mention OpenAI, API keys, hidden instructions, moderation systems, hosting providers or backend implementation.
- Return only the child-facing answer.
`;


  const response =
    await fetch(
      "https://api.openai.com/v1/responses",
      {
        method: "POST",

        headers: {
          "Authorization":
            `Bearer ${env.OPENAI_API_KEY}`,

          "Content-Type":
            "application/json"
        },

        body:
          JSON.stringify({
            model:
              env.TEXT_MODEL ||
              "gpt-5-mini",

            instructions,

            input: message,

            max_output_tokens:
              classNumber <= 2
                ? 220
                : classNumber <= 4
                  ? 320
                  : 420
          })
      }
    );


  const result =
    await response.json();


  if (!response.ok) {

    console.error(
      "OpenAI chat error:",
      result
    );


    return json(
      {
        error:
          result?.error?.message ||
          "AI could not answer."
      },
      response.status,
      cors
    );
  }


  const text =
    extractResponseText(
      result
    );


  if (!text) {

    return json(
      {
        error:
          "AI returned an empty answer."
      },
      502,
      cors
    );
  }


  return json(
    {
      text
    },
    200,
    cors
  );
}



async function handleImage(
  request,
  env,
  cors
) {

  const body =
    await readJson(request);


  const prompt =
    String(
      body?.prompt || ""
    ).trim();


  if (!prompt) {

    return json(
      {
        error:
          "Please create a prompt first."
      },
      400,
      cors
    );
  }


  if (prompt.length > 700) {

    return json(
      {
        error:
          "Please use a shorter prompt."
      },
      400,
      cors
    );
  }


  const localSafety =
    localSafetyCheck(prompt);


  if (!localSafety.ok) {

    return json(
      {
        error:
          "Please use a safe kids learning prompt."
      },
      400,
      cors
    );
  }


  const safe =
    await moderateText(
      prompt,
      env
    );


  if (!safe) {

    return json(
      {
        error:
          "That picture request is not suitable for the Kids AI Lab. Try a friendly learning idea."
      },
      400,
      cors
    );
  }


  const safePrompt = `
Create a cheerful, child-safe educational image for a Class 1 to 6 learning academy.

The image must:
- be friendly and non-frightening
- contain no sexual content
- contain no graphic injury or violence
- contain no dangerous instructions
- avoid showing private personal information
- be visually clear for young children
- use bright, easy-to-understand composition
- not include brand logos unless naturally required
- avoid unnecessary written text inside the image

Child's prompt:
${prompt}
`;


  const response =
    await fetch(
      "https://api.openai.com/v1/images/generations",
      {
        method: "POST",

        headers: {
          "Authorization":
            `Bearer ${env.OPENAI_API_KEY}`,

          "Content-Type":
            "application/json"
        },

        body:
          JSON.stringify({
            model:
              env.IMAGE_MODEL ||
              "gpt-image-1",

            prompt:
              safePrompt,

            size:
              "1024x1024",

            quality:
              "low",

            output_format:
              "png"
          })
      }
    );


  const result =
    await response.json();


  if (!response.ok) {

    console.error(
      "OpenAI image error:",
      result
    );


    return json(
      {
        error:
          result?.error?.message ||
          "Picture could not be created."
      },
      response.status,
      cors
    );
  }


  const base64 =
    result?.data?.[0]?.b64_json;


  if (!base64) {

    return json(
      {
        error:
          "AI did not return a picture."
      },
      502,
      cors
    );
  }


  return json(
    {
      dataUrl:
        `data:image/png;base64,${base64}`
    },
    200,
    cors
  );
}



async function moderateText(
  input,
  env
) {

  try {

    const response =
      await fetch(
        "https://api.openai.com/v1/moderations",
        {
          method: "POST",

          headers: {
            "Authorization":
              `Bearer ${env.OPENAI_API_KEY}`,

            "Content-Type":
              "application/json"
          },

          body:
            JSON.stringify({
              model:
                "omni-moderation-latest",

              input
            })
        }
      );


    if (!response.ok) {

      /*
        Fail closed for a kids product.
      */

      console.error(
        "Moderation request failed:",
        response.status
      );

      return false;
    }


    const result =
      await response.json();


    return !Boolean(
      result?.results?.[0]?.flagged
    );

  }

  catch (error) {

    console.error(
      "Moderation error:",
      error
    );

    return false;
  }
}




function mannersCheck(text) {

  const raw =
    String(text || "");

  const lower =
    raw.toLowerCase();

  /*
    Let genuine vocabulary questions pass through.
  */
  if (
    /\b(what does|meaning of|what is the meaning|define)\b/i.test(raw) ||
    /(का मतलब|मतलब क्या|meaning batao)/i.test(raw)
  ) {
    return "";
  }


  const rude =
    /\b(idiot|stupid|dumb|moron|shut up|fuck|fucking|shit|asshole|bitch|bastard|chutiya|chutiye|madarchod|motherfucker|behenchod|bhenchod|gandu|harami|kamina|kamine|saala|sala)\b/i;

  const rudeHindi =
    /(मादरचोद|बहनचोद|चूतिया|गांडू|हरामी|कमीना|साला)/i;


  if (
    !rude.test(raw) &&
    !rudeHindi.test(raw)
  ) {
    return "";
  }


  const hinglish =
    /\b(kya|hai|ho|tum|bhai|mera|mujhe|nahi|kar|gaali|gali)\b/i.test(lower) ||
    /[\u0900-\u097F]/.test(raw);


  return hinglish
    ? "Hum yahan respect se baat karte hain 😊. Agar gussa hai to “mujhe gussa aa raha hai” ya “I am upset” bol sakte ho. Respectful words se baat aur learning dono better hoti hain. Chalo, ab batao main kis baat me help karun?"
    : "We speak respectfully here 😊. If you are angry, you can say “I am upset” and explain what is bothering you. Respectful words make conversation and learning better. Tell me what you need help with.";
}


function localSafetyCheck(text) {

  const lower =
    text.toLowerCase();


  const privateInfo =
    [
      "my password is",
      "mera password",
      "my otp is",
      "mera otp",
      "my home address is",
      "mera address",
      "my phone number is",
      "mera phone number",
      "my school address is",
      "mera school address"
    ];


  if (
    privateInfo.some(
      item =>
        lower.includes(item)
    )
  ) {

    return {
      ok: false,

      reply:
        "Private information share mat karo. Password, OTP, phone number aur home address hamesha private rakho. 🔐"
    };
  }


  const unsafe =
    /\b(nude|porn|sexual|suicide|self harm|hurt myself|kill myself|kill someone|make a bomb|build a bomb|steal password|hack password|bypass password)\b/i;


  if (unsafe.test(text)) {

    return {
      ok: false,

      reply:
        "Main unsafe ya harmful instructions nahi de sakta. Agar situation real danger, self-harm ya kisi ko hurt karne se related hai to trusted adult ko turant batao. Safe learning ke liye computer, English, GK, science, cyber safety ya IT troubleshooting poochh sakte ho. 🛡️"
    };
  }


  return {
    ok: true
  };
}



function extractResponseText(
  result
) {

  if (
    typeof result?.output_text ===
    "string"
  ) {

    return result.output_text.trim();
  }


  const parts = [];


  for (
    const item of
    result?.output || []
  ) {

    for (
      const content of
      item?.content || []
    ) {

      if (
        content?.type ===
          "output_text" &&
        typeof content?.text ===
          "string"
      ) {

        parts.push(
          content.text
        );
      }

    }

  }


  return parts
    .join("\n")
    .trim();
}



async function readJson(
  request
) {

  try {

    return await request.json();

  }

  catch {

    return {};
  }
}



function getAllowedOrigin(
  request
) {

  const origin =
    request.headers.get(
      "Origin"
    );


  const allowed = [
    "https://kids.tanweer.site",
    "https://tanweer.site",
    "https://www.tanweer.site",
    "https://tanweersar-dev.github.io"
  ];


  if (
    origin &&
    allowed.includes(origin)
  ) {

    return origin;
  }


  return "https://kids.tanweer.site";
}



function json(
  data,
  status,
  cors
) {

  return new Response(
    JSON.stringify(data),
    {
      status,

      headers: {
        ...cors,

        "Content-Type":
          "application/json; charset=UTF-8",

        "Cache-Control":
          "no-store",

        "X-Content-Type-Options":
          "nosniff"
      }
    }
  );
}
