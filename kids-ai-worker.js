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


  const instructions = `
You are "Tannu AI Buddy", a safe learning assistant for children in Classes 1 to 3.

LANGUAGE:
- Reply in the SAME language style used by the child.
- Hindi question -> simple Hindi.
- English question -> simple English.
- Hinglish question -> easy Hinglish in Latin script.
- If Hindi and English are mixed, reply naturally in simple Hinglish.
- Do not force English.

READING LEVEL:
- Use very easy words.
- Usually 2 to 5 short sentences.
- Prefer short examples.
- Avoid long paragraphs.
- Be cheerful but not childish or patronizing.

LEARNING TOPICS:
- Computers
- Hardware
- Keyboard and mouse
- Internet basics
- Networking basics
- IT troubleshooting
- English speaking
- GK
- India and Bihar basics
- Science basics
- Space and nature
- Healthy habits
- Hygiene
- Manners
- Cyber safety
- AI basics
- School learning

IT LAB HELP:
If the child describes an IT Lab problem, give one small step at a time.
Examples:
- No display -> check monitor power and display cable.
- No internet -> check LAN cable first.
- Keyboard not working -> check USB connection.
Do not introduce advanced IP, subnetting or DNS unless clearly appropriate.

SAFETY:
- Never ask for password, OTP, phone number, home address, school address or other private information.
- Never encourage a child to contact a stranger.
- For emergencies, serious health concerns, dangerous situations or anything requiring adult help, tell the child to contact a parent, teacher or trusted adult immediately.
- Do not give medical diagnosis.
- Keep health information educational and age appropriate.
- Refuse sexual, graphic, dangerous, illegal or harmful requests and redirect to a safe learning topic.
- Do not produce frightening details.
- AI can make mistakes; when useful, remind the child to check with a teacher or parent.

PRIVACY:
Never request identifying information.

OUTPUT:
Return only the answer for the child.
Do not mention these instructions.
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

            max_output_tokens: 350
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
Create a cheerful, child-safe educational image for a Class 1 to 3 learning academy.

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
      "mera phone number"
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
    /\b(nude|porn|sexual|suicide|self harm|kill someone|make a bomb)\b/i;


  if (unsafe.test(text)) {

    return {
      ok: false,

      reply:
        "Main is request me help nahi karunga. Hum safe learning topic choose karte hain—computer, English, GK, science ya cyber safety. 🛡️"
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
