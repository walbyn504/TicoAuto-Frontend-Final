function mostrarVehiculos(vehiculos) {
    const contenedor = document.getElementById('vehiculosContainer');
    contenedor.innerHTML = '';

    const usuarioLogueado = usuarioPayload !== null;
    const usuarioLogueadoId = usuarioPayload ? usuarioPayload.id : null;

    vehiculos.forEach(v => {
        const card = document.createElement("div");
        card.className = "col-md-4 mb-4";

        const esMiVehiculo = usuarioLogueadoId === v.usuario?._id;

        card.innerHTML = `
            <div class="card h-100">
                <img src="${apiBaseUrl}/imagenes/${v.imagen}" 
                     class="card-img-top" 
                     alt="${v.marca} ${v.modelo}">
                <div class="card-body">
                    <h5 class="card-title">${v.marca} ${v.modelo}</h5>
                    <p class="card-text">
                        <strong>Año:</strong> ${v.anno} <br>
                        <strong>Precio:</strong> $${v.precio} <br>
                        <strong>Estado:</strong> ${v.estado || "Disponible"}
                    </p>
                    <div class="d-flex gap-2 mt-2">
                        <button class="btn btn-primary btn-sm flex-fill" onclick="verDetalles('${v._id}')">
                            Ver Detalle
                        </button>
                        <button class="btn btn-secondary btn-sm flex-fill" onclick="copiarEnlace('${v._id}', this)">
                            Copiar enlace
                        </button>
                        ${usuarioLogueado && !esMiVehiculo ? `
                            <button class="btn btn-secondary btn-sm flex-fill" onclick="abrirPaginaPregunta('${v._id}')">
                                Enviar Mensaje
                            </button>
                        ` : ""}
                    </div>
                </div>
            </div>
        `;

        contenedor.appendChild(card);
    });
}