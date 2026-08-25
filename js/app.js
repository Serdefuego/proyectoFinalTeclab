// ==========================================
// SENIORMUSICAS
// Proyecto Final - Tecnicatura en Programación
// ==========================================


// ==========================================
// PRODUCTOS
// ==========================================

const productos = [

    {
        id: 1,
        nombre: "Canciones para Primavera",
        precio: 4500,
        categoria: "Canciones",
        descripcion:
            "Recurso musical pensado para trabajar canciones y actividades relacionadas con la primavera en el aula.",
        paginas: 30,
        imagen: "assets/img/primavera.png"
    },

    {
        id: 2,
        nombre: "Juegos Musicales",
        precio: 3900,
        categoria: "Juegos Musicales",
        descripcion:
            "Propuesta de juegos y actividades musicales para trabajar contenidos musicales de manera dinámica.",
        paginas: 25,
        imagen: "assets/img/juegos.png"
    },

    {
        id: 3,
        nombre: "Planificaciones Anuales",
        precio: 6200,
        categoria: "Planificaciones",
        descripcion:
            "Planificaciones organizadas para acompañar el trabajo docente durante todo el ciclo lectivo.",
        paginas: 80,
        imagen: "assets/img/planificaciones.png"
    },

    {
        id: 4,
        nombre: "Efemérides Musicales",
        precio: 3500,
        categoria: "Efemérides",
        descripcion:
            "Material didáctico para abordar diferentes efemérides desde el área de Educación Musical.",
        paginas: 35,
        imagen: "assets/img/efemerides.png"
    }

];


// ==========================================
// CARRITO
// ==========================================

let carrito =
    JSON.parse(localStorage.getItem("carrito")) || [];


// ==========================================
// GUARDAR CARRITO
// ==========================================

function guardarCarrito() {

    localStorage.setItem(
        "carrito",
        JSON.stringify(carrito)
    );

}


// ==========================================
// AGREGAR AL CARRITO
// ==========================================

function agregarCarrito(id) {

    const producto =
        productos.find(
            producto => producto.id === id
        );


    if (!producto) {
        return;
    }


    const existente =
        carrito.find(
            item => item.id === id
        );


    if (existente) {

        existente.cantidad++;

    } else {

        carrito.push({

            ...producto,

            cantidad: 1

        });

    }


    guardarCarrito();

    actualizarContador();

    mostrarToast(producto.nombre);

}


// ==========================================
// CONTADOR DEL CARRITO
// ==========================================

function actualizarContador() {

    const contador =
        document.getElementById(
            "contadorCarrito"
        );


    if (!contador) {
        return;
    }


    const cantidad =
        carrito.reduce(

            (total, producto) =>
                total + producto.cantidad,

            0

        );


    contador.textContent = cantidad;

}


// ==========================================
// MOSTRAR PRODUCTOS
// ==========================================

function mostrarProductos(lista = productos) {

    const contenedor =
        document.getElementById(
            "productosListado"
        );


    if (!contenedor) {
        return;
    }


    contenedor.innerHTML = "";


    const sinResultados =
        document.getElementById(
            "sinResultados"
        );


    if (lista.length === 0) {

        if (sinResultados) {

            sinResultados.style.display =
                "block";

        }

        return;

    }


    if (sinResultados) {

        sinResultados.style.display =
            "none";

    }


    lista.forEach(producto => {

        contenedor.innerHTML += `

            <div class="card">

                <a
                    href="producto.html?id=${producto.id}">

                    <img
                        src="${producto.imagen}"
                        alt="${producto.nombre}">

                </a>


                <div class="info">

                    <h3>
                        ${producto.nombre}
                    </h3>


                    <div class="precio">

                        $${producto.precio.toLocaleString("es-AR")}

                    </div>


                    <a
                        href="producto.html?id=${producto.id}"
                        class="ver-producto">

                        Ver detalles

                    </a>


                    <button
                        class="btn-comprar"
                        onclick="agregarCarrito(${producto.id})">

                        <i class="fa-solid fa-cart-shopping"></i>

                        Agregar al carrito

                    </button>

                </div>

            </div>

        `;

    });

}


// ==========================================
// DETALLE DEL PRODUCTO
// ==========================================

function mostrarDetalleProducto() {

    const contenedor =
        document.getElementById(
            "detalleProducto"
        );


    if (!contenedor) {
        return;
    }


    const parametros =
        new URLSearchParams(
            window.location.search
        );


    const id =
        Number(parametros.get("id"));


    const producto =
        productos.find(
            producto => producto.id === id
        );


    if (!producto) {

        contenedor.innerHTML = `

            <div class="producto-no-encontrado">

                <h2>
                    Producto no encontrado
                </h2>

                <p>
                    El recurso que estás buscando no existe.
                </p>

                <a
                    href="index.html"
                    class="btn">

                    Volver a la tienda

                </a>

            </div>

        `;

        return;

    }


    document.title =
        `${producto.nombre} | SeniorMusicas`;


    contenedor.innerHTML = `

        <article class="producto-detalle">

            <div class="producto-detalle-imagen">

                <img
                    src="${producto.imagen}"
                    alt="${producto.nombre}">

            </div>


            <div class="producto-detalle-info">

                <span class="producto-categoria">

                    ${producto.categoria}

                </span>


                <h1>
                    ${producto.nombre}
                </h1>


                <p class="producto-descripcion">

                    ${producto.descripcion}

                </p>


                <div class="producto-precio">

                    $${producto.precio.toLocaleString("es-AR")}

                </div>


                <ul class="producto-caracteristicas">

                    <li>
                        <i class="fa-solid fa-file-pdf"></i>
                        Archivo digital en formato PDF
                    </li>

                    <li>
                        <i class="fa-solid fa-file-lines"></i>
                        ${producto.paginas} páginas
                    </li>

                    <li>
                        <i class="fa-solid fa-download"></i>
                        Descarga digital
                    </li>

                    <li>
                        <i class="fa-solid fa-music"></i>
                        Recurso educativo musical
                    </li>

                </ul>


                <button
                    class="btn-agregar-detalle"
                    onclick="agregarCarrito(${producto.id})">

                    <i class="fa-solid fa-cart-shopping"></i>

                    Agregar al carrito

                </button>


                <a
                    href="carrito.html"
                    class="btn-ir-carrito">

                    Ver carrito

                </a>

            </div>

        </article>

    `;

}


// ==========================================
// BUSCADOR
// ==========================================

function iniciarBuscador() {

    const boton =
        document.getElementById(
            "btnBuscar"
        );

    const barra =
        document.getElementById(
            "buscadorBarra"
        );

    const input =
        document.getElementById(
            "inputBuscar"
        );

    const cerrar =
        document.getElementById(
            "cerrarBuscador"
        );


    if (
        !boton ||
        !barra ||
        !input ||
        !cerrar
    ) {

        return;

    }


    boton.addEventListener(
        "click",
        () => {

            barra.classList.toggle(
                "activo"
            );


            if (
                barra.classList.contains(
                    "activo"
                )
            ) {

                input.focus();

            }

        }
    );


    cerrar.addEventListener(
        "click",
        () => {

            barra.classList.remove(
                "activo"
            );

            input.value = "";

            mostrarProductos();

        }
    );


    input.addEventListener(
        "input",
        () => {

            const texto =
                input.value
                    .trim()
                    .toLowerCase();


            const filtrados =
                productos.filter(
                    producto => {

                        return (
                            producto.nombre
                                .toLowerCase()
                                .includes(texto)
                            ||
                            producto.categoria
                                .toLowerCase()
                                .includes(texto)
                            ||
                            producto.descripcion
                                .toLowerCase()
                                .includes(texto)
                        );

                    }
                );


            mostrarProductos(
                filtrados
            );


            const seccion =
                document.getElementById(
                    "productos"
                );


            if (texto !== "" && seccion) {

                seccion.scrollIntoView({
                    behavior: "smooth"
                });

            }

        }
    );

}


// ==========================================
// CATEGORÍAS
// ==========================================

function iniciarCategorias() {

    const botones =
        document.querySelectorAll(
            ".categoria[data-categoria]"
        );


    botones.forEach(
        boton => {

            boton.addEventListener(
                "click",
                () => {

                    const categoria =
                        boton.dataset.categoria;


                    const filtrados =
                        productos.filter(

                            producto =>
                                producto.categoria ===
                                categoria

                        );


                    mostrarProductos(
                        filtrados
                    );


                    const productosSeccion =
                        document.getElementById(
                            "productos"
                        );


                    if (productosSeccion) {

                        productosSeccion
                            .scrollIntoView({
                                behavior: "smooth"
                            });

                    }

                }
            );

        }
    );


    const verTodos =
        document.getElementById(
            "verTodos"
        );


    if (verTodos) {

        verTodos.addEventListener(
            "click",
            () => {

                mostrarProductos();


                const productosSeccion =
                    document.getElementById(
                        "productos"
                    );


                if (productosSeccion) {

                    productosSeccion
                        .scrollIntoView({
                            behavior: "smooth"
                        });

                }

            }
        );

    }

}


// ==========================================
// NOTIFICACIÓN
// ==========================================

function mostrarToast(nombre) {

    const anterior =
        document.querySelector(
            ".toast"
        );


    if (anterior) {

        anterior.remove();

    }


    const toast =
        document.createElement(
            "div"
        );


    toast.className =
        "toast";


    toast.innerHTML = `

        <i class="fa-solid fa-circle-check"></i>

        ${nombre} agregado al carrito

    `;


    document.body.appendChild(
        toast
    );


    setTimeout(
        () => {

            toast.classList.add(
                "mostrar"
            );

        },
        50
    );


    setTimeout(
        () => {

            toast.classList.remove(
                "mostrar"
            );

        },
        2500
    );


    setTimeout(
        () => {

            toast.remove();

        },
        3000
    );

}


// ==========================================
// REGISTRO
// ==========================================

function iniciarRegistro() {

    const formulario =
        document.getElementById(
            "formRegistro"
        );


    if (!formulario) {
        return;
    }


    formulario.addEventListener(
        "submit",
        evento => {

            evento.preventDefault();


            const nombre =
                document
                    .getElementById("nombre")
                    .value
                    .trim();


            const email =
                document
                    .getElementById("email")
                    .value
                    .trim()
                    .toLowerCase();


            const password =
                document
                    .getElementById("password")
                    .value;


            const confirmarPassword =
                document
                    .getElementById("confirmarPassword")
                    .value;


            if (
                nombre === "" ||
                email === "" ||
                password === "" ||
                confirmarPassword === ""
            ) {

                mostrarMensajeRegistro(
                    "Completá todos los campos.",
                    "error"
                );

                return;

            }


            if (password.length < 6) {

                mostrarMensajeRegistro(
                    "La contraseña debe tener al menos 6 caracteres.",
                    "error"
                );

                return;

            }


            if (
                password !==
                confirmarPassword
            ) {

                mostrarMensajeRegistro(
                    "Las contraseñas no coinciden.",
                    "error"
                );

                return;

            }


            const usuarios =
                JSON.parse(
                    localStorage.getItem(
                        "usuarios"
                    )
                ) || [];


            const existente =
                usuarios.find(
                    usuario =>
                        usuario.email === email
                );


            if (existente) {

                mostrarMensajeRegistro(
                    "Ya existe una cuenta con ese correo electrónico.",
                    "error"
                );

                return;

            }


            usuarios.push({

                id: Date.now(),

                nombre,

                email,

                password

            });


            localStorage.setItem(
                "usuarios",
                JSON.stringify(
                    usuarios
                )
            );


            mostrarMensajeRegistro(
                "Cuenta creada correctamente.",
                "exito"
            );


            formulario.reset();


            setTimeout(
                () => {

                    window.location.href =
                        "login.html";

                },
                1500
            );

        }
    );

}


// ==========================================
// MENSAJE REGISTRO
// ==========================================

function mostrarMensajeRegistro(
    texto,
    tipo
) {

    const mensaje =
        document.getElementById(
            "mensajeRegistro"
        );


    if (!mensaje) {
        return;
    }


    mensaje.textContent =
        texto;


    mensaje.className =
        tipo === "error"

            ? "mensaje-form mensaje-error"

            : "mensaje-form mensaje-exito";

}


// ==========================================
// LOGIN
// ==========================================

function iniciarLogin() {

    const formulario =
        document.getElementById(
            "formLogin"
        );


    if (!formulario) {
        return;
    }


    formulario.addEventListener(
        "submit",
        evento => {

            evento.preventDefault();


            const email =
                document
                    .getElementById(
                        "loginEmail"
                    )
                    .value
                    .trim()
                    .toLowerCase();


            const password =
                document
                    .getElementById(
                        "loginPassword"
                    )
                    .value;


            const usuarios =
                JSON.parse(
                    localStorage.getItem(
                        "usuarios"
                    )
                ) || [];


            const usuario =
                usuarios.find(

                    usuario =>
                        usuario.email === email &&
                        usuario.password === password

                );


            if (!usuario) {

                mostrarMensajeLogin(
                    "Correo electrónico o contraseña incorrectos.",
                    "error"
                );

                return;

            }


            const sesion = {

                id: usuario.id,

                nombre: usuario.nombre,

                email: usuario.email

            };


            localStorage.setItem(
                "usuarioSesion",
                JSON.stringify(
                    sesion
                )
            );


            mostrarMensajeLogin(
                `Bienvenido, ${usuario.nombre}.`,
                "exito"
            );


            formulario.reset();


            setTimeout(
                () => {

                    window.location.href =
                        "index.html";

                },
                1200
            );

        }
    );

}


// ==========================================
// MENSAJE LOGIN
// ==========================================

function mostrarMensajeLogin(
    texto,
    tipo
) {

    const mensaje =
        document.getElementById(
            "mensajeLogin"
        );


    if (!mensaje) {
        return;
    }


    mensaje.textContent =
        texto;


    mensaje.className =
        tipo === "error"

            ? "mensaje-form mensaje-error"

            : "mensaje-form mensaje-exito";

}


// ==========================================
// USUARIO CONECTADO
// ==========================================

function actualizarUsuario() {

    const enlaces =
        document.querySelectorAll(
            ".usuario-icono"
        );


    if (
        enlaces.length === 0
    ) {

        return;

    }


    const usuario =
        JSON.parse(
            localStorage.getItem(
                "usuarioSesion"
            )
        );


    enlaces.forEach(
        enlace => {

            if (!usuario) {

                enlace.href =
                    "login.html";

                enlace.innerHTML = `

                    <i class="fa-solid fa-user"></i>

                `;

                return;

            }


            enlace.href = "#";


            enlace.innerHTML = `

                <i class="fa-solid fa-user-check"></i>

                <span class="nombre-usuario">

                    ${usuario.nombre}

                </span>

            `;


            enlace.addEventListener(
                "click",
                evento => {

                    evento.preventDefault();

                    cerrarSesion();

                }
            );

        }
    );

}


// ==========================================
// CERRAR SESIÓN
// ==========================================

function cerrarSesion() {

    const confirmar =
        confirm(
            "¿Querés cerrar tu sesión?"
        );


    if (!confirmar) {
        return;
    }


    localStorage.removeItem(
        "usuarioSesion"
    );


    window.location.href =
        "index.html";

}


// ==========================================
// INICIAR
// ==========================================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        mostrarProductos();

        mostrarDetalleProducto();

        actualizarContador();

        iniciarBuscador();

        iniciarCategorias();

        iniciarRegistro();

        iniciarLogin();

        actualizarUsuario();

    }
);