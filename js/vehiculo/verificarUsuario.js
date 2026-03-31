let usuarioPayload = null;

function verificarUsuario() {
    const token = sessionStorage.getItem("token");

    const nombreCont = document.getElementById("nombreUsuario");
    const botonesCont = document.getElementById("botonesUsuario");
    const menuCont = document.getElementById("menuOpciones");

    if (!nombreCont || !botonesCont || !menuCont) return;

    const estoyEnDetalle = window.location.pathname.includes("/html/vehiculo/verInfoVehiculo.html");
    const estoyEnGestion = window.location.pathname.includes("/html/vehiculo/gestionVehiculo.html");

    if (token) {
        try {
            usuarioPayload = JSON.parse(atob(token.split('.')[1]));
        } catch (error) {
            usuarioPayload = null;
        }
    } else {
        usuarioPayload = null;
    }

    if (!usuarioPayload) {
        nombreCont.innerHTML = "";

        if (estoyEnDetalle || estoyEnGestion) {
            menuCont.innerHTML = `
                <button class="btn btn-outline-light me-3" onclick="regresar()">
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
        nombreCont.innerHTML = `👤 ${usuarioPayload.nombre}`;

        if (estoyEnGestion) {
            menuCont.innerHTML = `
                <div class="dropdown me-3">
                    <button class="btn btn-dark" data-bs-toggle="dropdown">
                        <i class="bi bi-three-dots-vertical"></i>
                        Menú
                    </button>

                    <ul class="dropdown-menu">
                        <li>
                            <a class="dropdown-item" href="/html/vehiculo/formularioVehiculo.html">
                                Crear Vehículo
                            </a>
                        </li>
                        <li>
                            <button class="dropdown-item" onclick="regresar()">
                                Regresar
                            </button>
                        </li>
                    </ul>
                </div>
            `;
        } else if (estoyEnDetalle) {
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
                        <li>
                            <button class="dropdown-item" onclick="regresar()">
                                Regresar
                            </button>
                        </li>
                    </ul>
                </div>
            `;
        } else {
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
                    </ul>
                </div>
            `;
        }

        botonesCont.innerHTML = `
            <button onclick="cerrarSesion()" class="btn btn-outline-light">
                Cerrar sesión
            </button>
        `;
    }
}

function cerrarSesion() {
    sessionStorage.removeItem("token");
    window.location.href = "/html/usuario/inicioSesion.html";
}

function regresar() {
    const rutaActual = window.location.pathname;

    if (rutaActual.includes("/html/vehiculo/formularioVehiculo.html")) {
        window.location.href = "/html/vehiculo/gestionVehiculo.html";
    } else {
        window.location.href = "/index.html";
    }
}