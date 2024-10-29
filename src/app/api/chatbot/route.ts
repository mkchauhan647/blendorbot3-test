// import { BlenderbotTokenizer, BlenderbotForConditionalGeneration, Tensor } from '@huggingface/transformers';
// import { NextRequest, NextResponse } from 'next/server';

// const model = BlenderbotForConditionalGeneration.from_pretrained('facebook/blenderbot-3B');
// const tokenizer = BlenderbotTokenizer.from_pretrained('facebook/blenderbot-3B');

// export  async function POST(req:NextRequest, res:NextResponse) {
//     if (req.method === 'POST') {
//         const body = await req.json();
//         const { userMessage } = body ? body : { userMessage: '' };
//         const inputs = (await tokenizer)(userMessage, { return_tensors: 'pt' });
//         const modelInstance = await model;
//         const reply_ids = await modelInstance.generate(inputs.input_ids);
//         const reply_ids_resolved: Tensor = reply_ids as Tensor;
//         const botMessage = (await tokenizer).decode(reply_ids_resolved.tolist()[0], { skip_special_tokens: true });



//         return new Response(JSON.stringify({ botMessage }), { status: 200 });

//     } else {
//         // res.status(405).json({ error: 'Only POST requests are allowed' });
//         return new Response(JSON.stringify({ error: 'Only POST requests are allowed' }), { status: 405 });
//     }
// }

// pages/api/chatbot.js
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    const body = await req.json();
    const { userMessage } = body;

    const response = await fetch("https://api-inference.huggingface.co/models/facebook/blenderbot-3B", {
        method: "POST",
        headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_HUGGINGFACE_API_KEY}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ inputs: userMessage }),
    });

    const data = await response.json();
    console.log("msg", data);
    const botMessage = data[0].generated_text || "Sorry, I couldn't generate a response.";

    return new Response(JSON.stringify({ botMessage }), { status: 200 });
}
