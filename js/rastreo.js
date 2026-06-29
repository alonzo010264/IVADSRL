document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("tracking-form");
    const input = document.getElementById("tracking-input");
    const message = document.getElementById("tracking-message");
    const summaryOrder = document.getElementById("summary-order");

    if (!form || !input || !message || !summaryOrder) return;

    form.addEventListener("submit", (event) => {
        event.preventDefault();

        const code = input.value.trim();
        if (!code) {
            message.textContent = "Escribe un numero de pedido para consultar el estado.";
            input.focus();
            return;
        }

        const normalized = code.startsWith("#") ? code : `#${code}`;
        summaryOrder.textContent = normalized.toUpperCase();
        input.value = normalized.toUpperCase();
        message.textContent = "Pedido encontrado. La informacion fue actualizada.";

        window.setTimeout(() => {
            message.textContent = "";
        }, 3000);
    });
});
