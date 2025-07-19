import ollama from 'ollama'
import { serve } from "bun";

const MODEL = "deepseek-r1:1.5b";

const IMAGE_MODEL = "gemma3:4b";

serve({
    port: 3000,
    routes: {
        "/message": {
            POST: async (req) => {
                const content = await req.json() as { message: string, image: string };
                let response;
                try {
                    const res = await ollama.chat({
                        model: IMAGE_MODEL,
                        messages: [{ role: 'user', content: content.message, images: [content.image] }],
                    });
                    response = res.message.content;
                } catch (err) {
                    console.error(err);
                    response = "error";
                }

                const res = Response.json({ message: response });
                res.headers.set('Access-Control-Allow-Origin', '*');
                res.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
                res.headers.set('Access-Control-Allow-Headers', 'Content-Type');
                return res;
            }
        }
    },
});

