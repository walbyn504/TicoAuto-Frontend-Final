function verificarUsuario() {
    const usuario = sessionStorage.getItem("usuario");
    const nombreCont = document.getElementById("nombreUsuario");
    const botonesCont = document.getElementById("botonesUsuario");
    const menuCont = document.getElementById("menuOpciones");

    if (!nombreCont || !botonesCont || !menuCont) return;

    const estoyEnDetalle = window.location.pathname.includes("/html/vehiculo/verInfoVehiculo.html");

    if (!usuario) {
        nombreCont.innerHTML = "";

        if (estoyEnDetalle) {
            menuCont.innerHTML = `
                <button class="btn btn-outline-light me-3" onclick="volver()">
                    <i class="bi bi-arrow-left"></i> Regresar
                </button>
            `;
        } else {
            menuCont.innerHTML = "";
        }

        botonesCont.innerHTML = `
            <a href="/html/usuario/inicioSesion.html" class="btn btn-outline-light me-2">
                Iniciar Sesión
            </a>
            <a href="/html/usuario/registro.html" class="btn btn-primary">
                Registrarse
            </a>
        `;
    } else {
        nombreCont.innerHTML = `👤 ${usuario}`;

        menuCont.innerHTML = `
            <div class="dropdown me-3">
                <button class="btn btn-dark" data-bs-toggle="dropdown">
                    <i class="bi bi-three-dots-vertical"></i>
                    Menú
                </button>

                <ul class="dropdown-menu">
                    <li>
                        <a class="dropdown-item" href="/html/vehiculo/gestionVehiculo.html">
                            Gestionar Vehículos
                        </a>
                    </li>
                    <li>
                        <a class="dropdown-item" href="/html/conversacion/conversacion.html">
                            Chat
                        </a>
                    </li>
                    ${estoyEnDetalle ? `
                        <li>
                            <button class="dropdown-item" onclick="volver()">
                                Regresar
                            </button>
                        </li>
                    ` : ""}
                </ul>
            </div>
        `;

        botonesCont.innerHTML = `
            <button onclick="cerrarSesion()" class="btn btn-outline-light">
                Cerrar sesión
            </button>
        `;
    }
}

function cerrarSesion() {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("usuario");
    window.location.href = "/html/usuario/inicioSesion.html";
}