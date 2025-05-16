const MensajeError = document.getElementById("error");

document.getElementById("register-form").addEventListener("submit", async (e) => {
    e.preventDefault();

    const form = e.target;

    const res = await fetch("http://localhost:4000/api/register", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            user: form.user.value,
            email: form.email.value,
            password: form.password.value
        })
    });

    if (!res.ok) {
        const { status, message } = await res.json();
        console.log(status);
        console.log(message);

        
        MensajeError.classList.toggle("hide", false);
        return;
    }

    
    MensajeError.classList.add("hide");

    const resJson = await res.json();
    console.log(resJson);

    if (resJson.redirect) {
        window.location.href = resJson.redirect;
    }
});
