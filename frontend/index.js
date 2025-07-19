const imageInput = document.getElementById("image-input");
const answerDiv = document.getElementById("answer");

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

    const response = await fetch("http://localhost:3000/message", {
        method: "POST", body: JSON.stringify({
            message: "What is this image?",
            image: base64Image.replace("data:image/png;base64,", "")
        })
    }).then((res) => res.json());

    answerDiv.innerText = response.message;

});