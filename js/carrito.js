// ==========================================
// CARRITO SENIORMUSICAS
// ==========================================


// ==========================================
// RECUPERAR CARRITO
// ==========================================

let carrito =
    JSON.parse(localStorage.getItem("carrito")) || [];


// ==========================================
// ELEMENTOS HTML
// ==========================================

const contenedor =
    document.getElementById("contenedorCarrito");

const totalElemento =
    document.getElementById("total");

const botonVaciar =
    document.getElementById("vaciar");

const botonComprar =
    document.getElementById("comprar");


// ==========================================
// MOSTRAR CARRITO
// ==========================================

function mostrarCarrito() {

    if (!contenedor) {
        return;
    }

    contenedor.innerHTML = "";


    if (carrito.length === 0) {

        contenedor.innerHTML = `
            <div class="carrito-vacio">

                <i class="fa-solid fa-cart-shopping"></i>

                <h2>
                    Tu carrito está vacío
                </h2>

                <p>
                    Agregá productos desde nuestra tienda.
                </p>

            </div>
        `;


        if (totalElemento) {
            totalElemento.textContent = "$0";
        }


        if (botonVaciar) {
            botonVaciar.disabled = true;
        }


        if (botonComprar) {
            botonComprar.disabled = true;
        }


        return;
    }


    if (botonVaciar) {
        botonVaciar.disabled = false;
    }


    if (botonComprar) {
        botonComprar.disabled = false;
    }


    carrito.forEach(producto => {

        const subtotal =
            producto.precio * producto.cantidad;


        contenedor.innerHTML += `
            <div class="item">

                <img
                    src="${producto.imagen}"
                    alt="${producto.nombre}"
                >


                <div class="info">

                    <h3>
                        ${producto.nombre}
                    </h3>


                    <p>
                        Precio:
                        $${producto.precio.toLocaleString("es-AR")}
                    </p>


                    <div class="controles">

                        <button onclick="restar(${producto.id})">
                            -
                        </button>


                        <span>
                            ${producto.cantidad}
                        </span>


                        <button onclick="sumar(${producto.id})">
                            +
                        </button>

                    </div>

                </div>


                <div class="subtotal">

                    <strong>
                        $${subtotal.toLocaleString("es-AR")}
                    </strong>


                    <button
                        class="btn-eliminar"
                        onclick="eliminar(${producto.id})"
                        title="Eliminar producto"
                    >

                        <i class="fa-solid fa-trash"></i>

                    </button>

                </div>

            </div>
        `;

    });


    calcularTotal();

}


// ==========================================
// CALCULAR TOTAL
// ==========================================

function calcularTotal() {

    const totalCompra =
        carrito.reduce(
            (total, producto) => {

                return total +
                    producto.precio *
                    producto.cantidad;

            },
            0
        );


    if (totalElemento) {

        totalElemento.textContent =
            "$" +
            totalCompra.toLocaleString("es-AR");

    }

}


// ==========================================
// GUARDAR CARRITO
// ==========================================

function guardarCarrito() {

    localStorage.setItem(
        "carrito",
        JSON.stringify(carrito)
    );


    mostrarCarrito();

}


// ==========================================
// SUMAR PRODUCTO
// ==========================================

function sumar(id) {

    const producto =
        carrito.find(
            producto => producto.id === id
        );


    if (!producto) {
        return;
    }


    producto.cantidad++;


    guardarCarrito();

}


// ==========================================
// RESTAR PRODUCTO
// ==========================================

function restar(id) {

    const producto =
        carrito.find(
            producto => producto.id === id
        );


    if (!producto) {
        return;
    }


    producto.cantidad--;


    if (producto.cantidad <= 0) {

        carrito =
            carrito.filter(
                producto =>
                    producto.id !== id
            );

    }


    guardarCarrito();

}


// ==========================================
// ELIMINAR PRODUCTO
// ==========================================

function eliminar(id) {

    carrito =
        carrito.filter(
            producto =>
                producto.id !== id
        );


    guardarCarrito();

}


// ==========================================
// VACIAR CARRITO
// ==========================================

if (botonVaciar) {

    botonVaciar.addEventListener(
        "click",
        function () {

            if (carrito.length === 0) {
                return;
            }


            const confirmar =
                confirm(
                    "¿Estás seguro de que querés vaciar el carrito?"
                );


            if (!confirmar) {
                return;
            }


            carrito = [];


            localStorage.removeItem(
                "carrito"
            );


            mostrarCarrito();

        }
    );

}


// ==========================================
// FINALIZAR COMPRA
// ==========================================

if (botonComprar) {

    botonComprar.addEventListener(
        "click",
        async function () {

            if (carrito.length === 0) {

                alert(
                    "No podés finalizar la compra porque el carrito está vacío."
                );

                return;
            }


            await pagarConMercadoPago();

        }
    );

}


// ==========================================
// PAGAR CON MERCADO PAGO
// ==========================================

async function pagarConMercadoPago() {

    try {

        if (!botonComprar) {
            return;
        }


        botonComprar.disabled = true;

        botonComprar.innerHTML = `
            <i class="fa-solid fa-spinner fa-spin"></i>
            Procesando pago...
        `;


        // ======================================
        // ENVIAR CARRITO AL BACKEND
        // ======================================

const respuesta =
    await fetch(
        "https://proyectofinalteclab.onrender.com/crear-preferencia",
        {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                carrito: carrito
            })
        }
    );


        // ======================================
        // RESPUESTA DEL BACKEND
        // ======================================

        const datos =
            await respuesta.json();


        console.log(
            "Respuesta Mercado Pago:",
            datos
        );


        if (!respuesta.ok) {

            throw new Error(
                datos.error ||
                "No se pudo crear la preferencia de pago"
            );

        }


        // ======================================
        // COMPROBAR URL DE MERCADO PAGO
        // ======================================

        if (!datos.init_point) {

            throw new Error(
                "Mercado Pago no devolvió una URL de pago."
            );

        }


        // ======================================
        // GUARDAR COMPRA PENDIENTE
        // ======================================

        localStorage.setItem(
            "compraPendiente",
            JSON.stringify(carrito)
        );


        // ======================================
        // GUARDAR TOTAL PENDIENTE
        // ======================================

        const totalPendiente =
            carrito.reduce(
                (total, producto) => {

                    return total +
                        producto.precio *
                        producto.cantidad;

                },
                0
            );


        localStorage.setItem(
            "totalCompraPendiente",
            totalPendiente
        );


        // ======================================
        // REDIRECCIONAR A MERCADO PAGO
        // ======================================

        window.location.href =
            datos.init_point;

    }

    catch (error) {

        console.error(
            "Error al iniciar Mercado Pago:",
            error
        );


        alert(
            "No se pudo iniciar el pago con Mercado Pago. Revisá la terminal del backend y la consola del navegador."
        );


        if (botonComprar) {

            botonComprar.disabled = false;

            botonComprar.innerHTML = `
                Finalizar compra
            `;

        }

    }

}


// ==========================================
// COMPROBAR RETORNO DE MERCADO PAGO
// ==========================================

function comprobarRetornoMercadoPago() {

    const parametros =
        new URLSearchParams(
            window.location.search
        );


    const status =
        parametros.get("status");


    // Si no venimos de Mercado Pago
    if (!status) {
        return;
    }


    // ======================================
    // PAGO APROBADO
    // ======================================

    if (status === "approved") {

        mostrarMensajeEstado(
            "Pago aprobado",
            "Tu pago fue aprobado. Estamos validando tu compra.",
            "exito"
        );

    }


    // ======================================
    // PAGO PENDIENTE
    // ======================================

    if (status === "pending") {

        mostrarMensajeEstado(
            "Pago pendiente",
            "Tu pago todavía está pendiente de confirmación.",
            "pendiente"
        );

    }


    // ======================================
    // PAGO RECHAZADO
    // ======================================

    if (status === "failure") {

        mostrarMensajeEstado(
            "Pago no aprobado",
            "El pago no pudo completarse. Podés intentarlo nuevamente.",
            "error"
        );

    }

}


// ==========================================
// MOSTRAR ESTADO DEL PAGO
// ==========================================

function mostrarMensajeEstado(
    titulo,
    texto,
    tipo
) {

    if (!contenedor) {
        return;
    }


    let icono =
        "fa-circle-info";


    if (tipo === "exito") {

        icono =
            "fa-circle-check";

    }


    if (tipo === "error") {

        icono =
            "fa-circle-xmark";

    }


    if (tipo === "pendiente") {

        icono =
            "fa-clock";

    }


    contenedor.innerHTML = `

        <div class="compra-exitosa">

            <i class="fa-solid ${icono}"></i>

            <h2>
                ${titulo}
            </h2>

            <p>
                ${texto}
            </p>

            <a
                href="index.html"
                class="volver-tienda"
            >
                Volver a la tienda
            </a>

        </div>

    `;


    if (botonComprar) {

        botonComprar.style.display =
            "none";

    }


    if (botonVaciar) {

        botonVaciar.style.display =
            "none";

    }

}


// ==========================================
// INICIAR
// ==========================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        comprobarRetornoMercadoPago();

        const parametros =
            new URLSearchParams(
                window.location.search
            );


        const status =
            parametros.get("status");


        // Mostrar carrito solamente
        // si NO venimos de Mercado Pago

        if (!status) {

            mostrarCarrito();

        }

    }
);