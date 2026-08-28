// ==========================================
// CARRITO SENIORMUSICAS
// ==========================================


// ==========================================
// CONFIGURACIÓN
// ==========================================

const BACKEND_URL =
    "https://proyectofinalteclab.onrender.com";


// ==========================================
// PDF DE CADA PRODUCTO
// ==========================================

const pdfProductos = {

    1: "assets/pdf/primavera.pdf",

    2: "assets/pdf/juegos.pdf",

    3: "assets/pdf/planificaciones.pdf",

    4: "assets/pdf/efemerides.pdf"

};


// ==========================================
// RECUPERAR CARRITO
// ==========================================

let carrito =
    JSON.parse(
        localStorage.getItem("carrito")
    ) || [];


// ==========================================
// ELEMENTOS HTML
// ==========================================

const contenedor =
    document.getElementById(
        "contenedorCarrito"
    );

const totalElemento =
    document.getElementById(
        "total"
    );

const botonVaciar =
    document.getElementById(
        "vaciar"
    );

const botonComprar =
    document.getElementById(
        "comprar"
    );


// ==========================================
// MOSTRAR CARRITO
// ==========================================

function mostrarCarrito() {

    if (!contenedor) {
        return;
    }

    contenedor.innerHTML = "";


    // ======================================
    // CARRITO VACÍO
    // ======================================

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

            totalElemento.textContent =
                "$0";

        }


        if (botonVaciar) {

            botonVaciar.disabled =
                true;

        }


        if (botonComprar) {

            botonComprar.disabled =
                true;

        }


        return;
    }


    // ======================================
    // ACTIVAR BOTONES
    // ======================================

    if (botonVaciar) {

        botonVaciar.disabled =
            false;

        botonVaciar.style.display =
            "";

    }


    if (botonComprar) {

        botonComprar.disabled =
            false;

        botonComprar.style.display =
            "";

    }


    // ======================================
    // MOSTRAR PRODUCTOS
    // ======================================

    carrito.forEach(
        producto => {

            const subtotal =
                producto.precio *
                producto.cantidad;


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
                            $${Number(producto.precio)
                                .toLocaleString("es-AR")}
                        </p>

                        <div class="controles">

                            <button
                                onclick="restar(${producto.id})"
                            >
                                -
                            </button>

                            <span>
                                ${producto.cantidad}
                            </span>

                            <button
                                onclick="sumar(${producto.id})"
                            >
                                +
                            </button>

                        </div>

                    </div>

                    <div class="subtotal">

                        <strong>
                            $${subtotal
                                .toLocaleString("es-AR")}
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

        }
    );


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
                    Number(producto.precio) *
                    Number(producto.cantidad);

            },
            0
        );


    if (totalElemento) {

        totalElemento.textContent =
            "$" +
            totalCompra
                .toLocaleString("es-AR");

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
            producto =>
                Number(producto.id) ===
                Number(id)
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
            producto =>
                Number(producto.id) ===
                Number(id)
        );


    if (!producto) {
        return;
    }


    producto.cantidad--;


    if (
        producto.cantidad <= 0
    ) {

        carrito =
            carrito.filter(
                producto =>
                    Number(producto.id) !==
                    Number(id)
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
                Number(producto.id) !==
                Number(id)
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

            if (
                carrito.length === 0
            ) {
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

            if (
                carrito.length === 0
            ) {

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


        botonComprar.disabled =
            true;


        botonComprar.innerHTML = `
            <i class="fa-solid fa-spinner fa-spin"></i>
            Procesando pago...
        `;


        // ======================================
        // ENVIAR CARRITO AL BACKEND
        // ======================================

        const respuesta =
            await fetch(
                `${BACKEND_URL}/crear-preferencia`,
                {

                    method:
                        "POST",

                    headers: {

                        "Content-Type":
                            "application/json"

                    },

                    body:
                        JSON.stringify({

                            carrito:
                                carrito

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
        // COMPROBAR URL
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
                        Number(producto.precio) *
                        Number(producto.cantidad);

                },
                0
            );


        localStorage.setItem(
            "totalCompraPendiente",
            String(totalPendiente)
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
            "No se pudo iniciar el pago con Mercado Pago."
        );


        if (botonComprar) {

            botonComprar.disabled =
                false;


            botonComprar.innerHTML =
                "Finalizar compra";

        }

    }

}


// ==========================================
// COMPROBAR RETORNO DE MERCADO PAGO
// ==========================================

async function comprobarRetornoMercadoPago() {

    const parametros =
        new URLSearchParams(
            window.location.search
        );


    const status =
        parametros.get("status");


    const paymentId =
        parametros.get("payment_id");


    // ======================================
    // NO VENIMOS DE MERCADO PAGO
    // ======================================

    if (!status) {

        return false;

    }


    // ======================================
    // PAGO APROBADO
    // ======================================

    if (
        status === "approved"
    ) {

        if (!paymentId) {

            mostrarMensajeEstado(
                "Error al verificar",
                "Mercado Pago no devolvió el número del pago.",
                "error"
            );

            return true;

        }


        mostrarMensajeEstado(
            "Validando compra",
            "Estamos verificando tu pago con Mercado Pago...",
            "pendiente"
        );


        try {

            // ==================================
            // VERIFICAR EN EL BACKEND
            // ==================================

            const respuesta =
                await fetch(
                    `${BACKEND_URL}/verificar-pago/${paymentId}`
                );


            const datos =
                await respuesta.json();


            console.log(
                "Verificación del pago:",
                datos
            );


            if (
                !respuesta.ok ||
                !datos.aprobado
            ) {

                mostrarMensajeEstado(
                    "Pago no validado",
                    "No pudimos confirmar que el pago haya sido aprobado.",
                    "error"
                );

                return true;

            }


            // ==================================
            // RECUPERAR PRODUCTOS COMPRADOS
            // ==================================

            let compra =
                JSON.parse(
                    localStorage.getItem(
                        "compraPendiente"
                    )
                ) || [];


            // Si recargó la página después
            // de una compra ya confirmada

            const ultimaCompra =
                JSON.parse(
                    localStorage.getItem(
                        "ultimaCompra"
                    )
                );


            if (
                compra.length === 0 &&
                ultimaCompra &&
                String(
                    ultimaCompra.paymentId
                ) ===
                String(paymentId)
            ) {

                compra =
                    ultimaCompra.productos || [];

            }


            if (
                compra.length === 0
            ) {

                mostrarMensajeEstado(
                    "Pago confirmado",
                    "El pago fue confirmado, pero no pudimos recuperar los productos de esta compra.",
                    "error"
                );

                return true;

            }


            // ==================================
            // CALCULAR TOTAL LOCAL
            // ==================================

            const totalCompra =
                compra.reduce(
                    (total, producto) => {

                        return total +
                            Number(producto.precio) *
                            Number(producto.cantidad);

                    },
                    0
                );


            // ==================================
            // COMPROBAR MONTO
            // ==================================

            if (
                datos.monto !== undefined &&
                Number(datos.monto) !==
                Number(totalCompra)
            ) {

                console.error(
                    "El monto pagado no coincide.",
                    {
                        montoMercadoPago:
                            datos.monto,

                        montoCarrito:
                            totalCompra
                    }
                );


                mostrarMensajeEstado(
                    "No se pudo validar la compra",
                    "El monto del pago no coincide con los productos comprados.",
                    "error"
                );


                return true;

            }


            // ==================================
            // GUARDAR ÚLTIMA COMPRA
            // ==================================

            localStorage.setItem(
                "ultimaCompra",
                JSON.stringify({

                    paymentId:
                        paymentId,

                    productos:
                        compra,

                    total:
                        totalCompra

                })
            );


            // ==================================
            // MOSTRAR COMPRA
            // ==================================

            mostrarCompraConfirmada(
                paymentId,
                compra,
                totalCompra
            );


            // ==================================
            // VACIAR CARRITO
            // ==================================

            carrito = [];


            localStorage.removeItem(
                "carrito"
            );


            localStorage.removeItem(
                "compraPendiente"
            );


            localStorage.removeItem(
                "totalCompraPendiente"
            );


            return true;

        }

        catch (error) {

            console.error(
                "Error verificando pago:",
                error
            );


            mostrarMensajeEstado(
                "Error",
                "No se pudo verificar el pago. Intentá recargar la página.",
                "error"
            );


            return true;

        }

    }


    // ======================================
    // PAGO PENDIENTE
    // ======================================

    if (
        status === "pending"
    ) {

        mostrarMensajeEstado(
            "Pago pendiente",
            "Tu pago todavía está pendiente de confirmación.",
            "pendiente"
        );


        return true;

    }


    // ======================================
    // PAGO RECHAZADO / CANCELADO
    // ======================================

    if (
        status === "failure" ||
        status === "rejected" ||
        status === "cancelled"
    ) {

        mostrarMensajeEstado(
            "Pago no aprobado",
            "El pago no pudo completarse. Podés intentarlo nuevamente.",
            "error"
        );


        return true;

    }


    return true;

}


// ==========================================
// MOSTRAR COMPRA CONFIRMADA
// ==========================================

function mostrarCompraConfirmada(
    paymentId,
    productos,
    totalCompra
) {

    if (!contenedor) {
        return;
    }


    let productosHTML = "";


    productos.forEach(
        producto => {

            const pdf =
                pdfProductos[
                    Number(producto.id)
                ];


            let botonDescarga = "";


            if (pdf) {

                botonDescarga = `
                    <a
                        href="${pdf}"
                        download
                        class="btn-descargar"
                        target="_blank"
                    >
                        <i class="fa-solid fa-file-pdf"></i>
                        Descargar PDF
                    </a>
                `;

            }


            productosHTML += `
                <div class="producto-comprado">

                    <h3>
                        ${producto.nombre}
                    </h3>

                    <p>
                        Cantidad:
                        ${producto.cantidad}
                    </p>

                    ${botonDescarga}

                </div>
            `;

        }
    );


    contenedor.innerHTML = `
        <div class="compra-exitosa">

            <i class="fa-solid fa-circle-check"></i>

            <h2>
                ¡Compra realizada!
            </h2>

            <p>
                Tu pago fue confirmado correctamente.
            </p>

            <p class="numero-pago">
                Número de pago:
                <strong>
                    ${paymentId}
                </strong>
            </p>

            <div class="productos-comprados">

                <h3>
                    Productos comprados
                </h3>

                ${productosHTML}

            </div>

            <a
                href="index.html"
                class="volver-tienda"
            >
                Volver a la tienda
            </a>

        </div>
    `;


    // ======================================
    // MOSTRAR TOTAL
    // ======================================

    if (totalElemento) {

        totalElemento.textContent =
            "$" +
            Number(totalCompra)
                .toLocaleString(
                    "es-AR"
                );

    }


    // ======================================
    // OCULTAR BOTONES DEL CARRITO
    // ======================================

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
// MOSTRAR MENSAJE DE ESTADO
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


    if (
        tipo === "exito"
    ) {

        icono =
            "fa-circle-check";

    }


    if (
        tipo === "error"
    ) {

        icono =
            "fa-circle-xmark";

    }


    if (
        tipo === "pendiente"
    ) {

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
    async function () {

        const vieneDeMercadoPago =
            await comprobarRetornoMercadoPago();


        // Mostrar carrito únicamente si
        // no estamos regresando de Mercado Pago

        if (!vieneDeMercadoPago) {

            mostrarCarrito();

        }

    }
);