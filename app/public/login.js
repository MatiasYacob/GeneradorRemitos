const MensajeError = document.getElementById("mensaje-error");

document.getElementById("login-form").addEventListener("submit", async function(e) {  
    e.preventDefault(); 
    console.log("submit");
    const form = e.target;
    const user = form.user.value;
    const password = form.password.value;

    const res = await fetch("http://localhost:4000/api/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ user, password })
    });

    if (!res.ok) {
        const { message } = await res.json(); // opcional
        MensajeError.textContent = message || "Error al iniciar sesión";
        MensajeError.classList.remove("hide");
        return;
    }

    MensajeError.classList.add("hide"); // oculta si estaba visible

    const resJson = await res.json();

    if (resJson.redirect) {
        window.location.href = resJson.redirect;
    }
});
