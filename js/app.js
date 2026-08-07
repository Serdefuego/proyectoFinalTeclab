// ==========================================
// SENIORMUSICAS
// Proyecto Final - Tecnicatura en Programación
// ==========================================

// ---------- PRODUCTOS ----------

const productos = [

    {
        id: 1,
        nombre: "Canciones para Primavera",
        precio: 4500,
        imagen: "img/productos/primavera.jpg"
    },

    {
        id: 2,
        nombre: "Juegos Musicales",
        precio: 3900,
        imagen: "img/productos/juegos.jpg"
    },

    {
        id: 3,
        nombre: "Planificaciones Anuales",
        precio: 6200,
        imagen: "img/productos/planificaciones.jpg"
    },

    {
        id: 4,
        nombre: "Efemérides Musicales",
        precio: 3500,
        imagen: "img/productos/efemerides.jpg"
    }

];

// ---------- VARIABLES ----------

const contenedorProductos = document.getElementById("productos");

let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

// ---------- INICIO ----------

document.addEventListener("DOMContentLoaded", () => {

    mostrarProductos();

    actualizarContador();

});

// ---------- MOSTRAR PRODUCTOS ----------

function mostrarProductos(){

    contenedorProductos.innerHTML = "";

    productos.forEach(producto => {

        contenedorProductos.innerHTML += `

            <div class="card">

                <img src="${producto.imagen}" alt="${producto.nombre}">

                <div class="info">

                    <h3>${producto.nombre}</h3>

                    <div class="precio">

                        $${producto.precio.toLocaleString("es-AR")}

                    </div>

                    <button
                        class="btn-comprar"
                        onclick="agregarCarrito(${producto.id})">

                        Agregar al carrito

                    </button>

                </div>

            </div>

        `;

    });

}

// ---------- AGREGAR AL CARRITO ----------

function agregarCarrito(id){

    const producto = productos.find(producto => producto.id === id);

    const existe = carrito.find(item => item.id === id);

    if(existe){

        existe.cantidad++;

    }else{

        carrito.push({

            ...producto,

            cantidad:1

        });

    }

    guardarCarrito();

    actualizarContador();

    mostrarToast(producto.nombre);

}

// ---------- GUARDAR ----------

function guardarCarrito(){

    localStorage.setItem("carrito", JSON.stringify(carrito));

}

// ---------- CONTADOR ----------

function actualizarContador(){

    const cantidad = carrito.reduce((total, producto)=>{

        return total + producto.cantidad;

    },0);

    document.getElementById("contadorCarrito").textContent = cantidad;

}

// ---------- TOAST ----------

function mostrarToast(nombre){

    const toast = document.createElement("div");

    toast.className = "toast";

    toast.innerHTML = `
        <i class="fa-solid fa-circle-check"></i>
        ${nombre} agregado al carrito
    `;

    document.body.appendChild(toast);

    setTimeout(()=>{

        toast.classList.add("mostrar");

    },100);

    setTimeout(()=>{

        toast.classList.remove("mostrar");

    },2500);

    setTimeout(()=>{

        toast.remove();

    },3000);

}

// ---------- VACIAR CARRITO ----------
// (Lo usaremos luego desde el panel o carrito)

function vaciarCarrito(){

    carrito = [];

    guardarCarrito();

    actualizarContador();

}

console.log("✔ SeniorMusicas cargado correctamente.");