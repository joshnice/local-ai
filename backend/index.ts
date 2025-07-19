import ollama, { type Message } from 'ollama'
import { serve } from "bun";

const TEXT_MODEL = "llama3.2:1b";

const IMAGE_MODEL = "gemma3:4b";

serve({
    port: 3000,
    routes: {
        "/message": {
            POST: async (req) => {
                const content = await req.json() as { message: string, image: string, chat: Message[] };
                let response;

                if (content.image) {
                    try {
                        const res = await ollama.chat({
                            model: IMAGE_MODEL,
                            messages: [{ role: 'user', content: content.message, images: [content.image] }],
                        });
                        response = { message: res.message.content };
                    } catch (err) {
                        console.error(err);
                        response = "error";
                    }
                }

                if (content.chat) {
                    try {
                        const res = await ollama.chat({
                            model: TEXT_MODEL,
                            messages: content.chat,
                        });
                        response = res.message;
                    } catch (err) {
                        console.error(err);
                        response = "error";
                    }
                }

                const res = Response.json(response);
                res.headers.set('Access-Control-Allow-Origin', '*');
                res.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
                res.headers.set('Access-Control-Allow-Headers', 'Content-Type');
                return res;
            }
        }
    },
});

