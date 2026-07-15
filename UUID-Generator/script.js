const uuidBox = document.getElementById("uuid");
const generateBtn = document.getElementById("generate");
const copyBtn = document.getElementById("copy");

function generateUUID() {

    let uuid;

    if (crypto.randomUUID) {
        uuid = crypto.randomUUID();
    } else {
        uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, c => {
            const r = Math.random() * 16 | 0;
            const v = c === "x" ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    uuidBox.textContent = uuid;
}

generateBtn.addEventListener("click", generateUUID);

copyBtn.addEventListener("click", async () => {

    if (uuidBox.textContent === "Click Generate")
        return;

    try{
        await navigator.clipboard.writeText(uuidBox.textContent);
        copyBtn.textContent = "Copied ✔";

        setTimeout(()=>{
            copyBtn.textContent="Copy";
        },1500);

    }catch{
        alert("Copy failed.");
    }

});

generateUUID();