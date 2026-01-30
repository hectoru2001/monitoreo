document.addEventListener("DOMContentLoaded", function () {

    const select = document.getElementById("id_categoria");
    const campoPuerto = document.getElementById("id_puerto");
    const lblPuerto = document.getElementById("lbl-puerto");

    function actualizarPuerto() {
        const valor = select.value;

        if (valor === "1") {
            campoPuerto.classList.remove("hidden");
            lblPuerto.classList.remove("hidden");
            campoPuerto.required = true;
        } else {
            campoPuerto.classList.add("hidden");
            lblPuerto.classList.add("hidden");
            campoPuerto.required = false;
            campoPuerto.value = "";
        }
    }

    select.addEventListener("change", actualizarPuerto);

    // ejecutar al cargar para estado inicial
    actualizarPuerto();
});
