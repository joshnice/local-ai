const imageInput = document.getElementById("image-input");
const answerDiv = document.getElementById("answer");

const chatInput = document.getElementById("chat-input");
const chatOutput = document.getElementById("chat");

const chatHistory = []

imageInput.addEventListener("change", async (event) => {
    const file = event.target.files[0];

    const base64Image = await new Promise((res) => {
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const base64String = e.target.result;
                res(base64String)
            };
            reader.readAsDataURL(file);
        }
    });

    const response = await makeAiRequest("What is this image?", base64Image.split("base64,")[1])

    answerDiv.innerText = response.message;
});


chatInput.addEventListener("keydown", async (event) => {
    if (event.key === "Enter") {
        const newChat = chatInput.value;
        chatInput.value = "";

        const chatElementInput = document.createElement("p");
        chatElementInput.innerText = newChat;
        chatElementInput.className = "chat-base user-chat";
        chatOutput.append(chatElementInput);

        const response = await makeAiRequest(null, null, [...chatHistory, { role: "user", content: newChat }]);
        chatHistory.push(response);

        const chatElement = document.createElement("p");
        chatElement.innerHTML = marked.parse(response.content);
        chatElement.className = "chat-base ai-chat";
        chatOutput.append(chatElement);
    }
})


async function makeAiRequest(message, image, chat) {
    const response = await fetch("http://localhost:3000/message", {
        method: "POST", body: JSON.stringify({
            message,
            image,
            chat
        })
    }).then((res) => res.json());

    return response;
}