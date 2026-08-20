// ==========================================
// CARRITO SENIORMUSICAS
// ==========================================

let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

const contenedor = document.getElementById("contenedorCarrito");
const totalElemento = document.getElementById("total");
const botonVaciar = document.getElementById("vaciar");
const botonComprar = document.getElementById("comprar");


// ==========================================
// MOSTRAR CARRITO
// ==========================================

function mostrarCarrito() {

    contenedor.innerHTML = "";

    // Si el carrito está vacío
    if (carrito.length === 0) {

        contenedor.innerHTML = `
        
            <div class="carrito-vacio">

                <i class="fa-solid fa-cart-shopping"></i>

                <h2>Tu carrito está vacío</h2>

                <p>
                    Agregá productos desde nuestra tienda.
                </p>

            </div>
        
        `;

        totalElemento.textContent = "$0";

        return;
    }


    // Mostrar cada producto
    carrito.forEach(producto => {

        const subtotal = producto.precio * producto.cantidad;

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

                        <button 
                            onclick="restar(${producto.id})">

                            -

                        </button>


                        <span>
                            ${producto.cantidad}
                        </span>


                        <button 
                            onclick="sumar(${producto.id})">

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
                        title="Eliminar producto">

                        <i class="fa-solid fa-trash"></i>

                    </button>

                </div>

            </div>

        `;

    });


    calcularTotal();

}


// ==========================================
// SUMAR PRODUCTO
// ==========================================

function sumar(id) {

    const producto = carrito.find(
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

    const producto = carrito.find(
        producto => producto.id === id
    );

    if (!producto) {
        return;
    }

    producto.cantidad--;


    // Si llega a cero, se elimina
    if (producto.cantidad <= 0) {

        carrito = carrito.filter(
            producto => producto.id !== id
        );

    }


    guardarCarrito();

}


// ==========================================
// ELIMINAR PRODUCTO
// ==========================================

function eliminar(id) {

    carrito = carrito.filter(
        producto => producto.id !== id
    );

    guardarCarrito();

}


// ==========================================
// CALCULAR TOTAL
// ==========================================

function calcularTotal() {

    let totalCompra = 0;


    carrito.forEach(producto => {

        totalCompra +=
            producto.precio * producto.cantidad;

    });


    totalElemento.textContent =
        "$" + totalCompra.toLocaleString("es-AR");

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
// VACIAR CARRITO
// ==========================================

botonVaciar.addEventListener(
    "click",
    function() {

        if (carrito.length === 0) {

            alert("El carrito ya está vacío.");

            return;
        }


        const confirmar = confirm(
            "¿Estás seguro de que querés vaciar el carrito?"
        );


        if (confirmar) {

            carrito = [];

            localStorage.removeItem("carrito");

            mostrarCarrito();

        }

    }
);


// ==========================================
// FINALIZAR COMPRA
// ==========================================

botonComprar.addEventListener(
    "click",
    function() {

        if (carrito.length === 0) {

            alert(
                "No podés finalizar la compra porque el carrito está vacío."
            );

            return;
        }


        alert(
            "Próximamente podrás finalizar tu compra mediante Mercado Pago."
        );

    }
);


// ==========================================
// INICIAR
// ==========================================

mostrarCarrito();