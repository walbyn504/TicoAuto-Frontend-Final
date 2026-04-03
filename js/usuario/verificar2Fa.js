const apiBaseUrl = 'http://localhost:3001';

let intervalo = null;
let fechaExpiracionReal = null;

window.onload = () => {
    const params = new URLSearchParams(window.location.search);
    const usuarioId = params.get('uid');
    const exp = params.get('exp');

    if (!usuarioId || !exp) {
        location.href = 'inicioSesion.html';
        return;
    }

    fechaExpiracionReal = new Date(exp);

    if (isNaN(fechaExpiracionReal.getTime())) {
        location.href = 'inicioSesion.html';
        return;
    }

    iniciarContador();
};

function iniciarContador() {
    if (intervalo) {
        clearInterval(intervalo);
    }

    actualizarContador();

    intervalo = setInterval(() => {
        actualizarContador();
    }, 1000);
}

function actualizarContador() {
    const contador = document.getElementById('contadorTiempo');
    const boton = document.getElementById('btnVerificar');

    const milisegundosRestantes = fechaExpiracionReal.getTime() - Date.now();

    if (milisegundosRestantes <= 0) {
        mostrarEstadoExpirado();
        return;
    }

    const totalSegundos = Math.floor(milisegundosRestantes / 1000);
    const minutos = Math.floor(totalSegundos / 60);
    const segundos = totalSegundos % 60;

    contador.textContent = `El código expira en: ${minutos}:${segundos.toString().padStart(2, '0')}`;
    contador.classList.remove('text-secondary');
    contador.classList.add('text-danger');
    boton.disabled = false;
}

async function verificarCodigo() {
    const codigo = document.getElementById('codigo').value.trim();
    const params = new URLSearchParams(window.location.search);
    const usuarioId = params.get('uid');

    if (!codigo) {
        mostrarMensaje("Ingrese el código", "error", "contenedor-mensajes");
        return;
    }

    if (!usuarioId) {
        mostrarMensaje("Usuario inválido", "error", "contenedor-mensajes");
        return;
    }

    if (fechaExpiracionReal.getTime() <= Date.now()) {
        mostrarMensaje("El código ya expiró. Inicie sesión nuevamente.", "error", "contenedor-mensajes");
        return;
    }

    try {
        const response = await fetch(`${apiBaseUrl}/api/autenticacion/codigo2FA`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ usuarioId, codigo })
        });

        const data = await response.json();

        if (!response.ok) {
            mostrarMensaje(data.message || "Código incorrecto", "error", "contenedor-mensajes");
            return;
        }

        sessionStorage.setItem('token', data.token);

        if (intervalo) {
            clearInterval(intervalo);
        }

        location.href = '../../index.html';

    } catch (error) {
        mostrarMensaje("Error al verificar código", "error", "contenedor-mensajes");
    }
}

function cerrar2FA() {
    location.href = 'inicioSesion.html';
}

function mostrarEstadoExpirado() {
    const contador = document.getElementById('contadorTiempo');
    const boton = document.getElementById('btnVerificar');
    const inputCodigo = document.getElementById('codigo');
    const accionesExpirado = document.getElementById('accionesExpirado');

    if (intervalo) {
        clearInterval(intervalo);
        intervalo = null;
    }

    contador.textContent = 'El código expiró. Debes iniciar sesión nuevamente.';
    contador.classList.remove('text-danger');
    contador.classList.add('text-secondary');

    boton.disabled = true;
    boton.classList.add('d-none');

    inputCodigo.disabled = true;
    inputCodigo.classList.add('bg-light');

    accionesExpirado.classList.remove('d-none');
}