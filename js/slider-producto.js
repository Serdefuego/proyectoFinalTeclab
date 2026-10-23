// ==========================================
// SLIDER DE PRODUCTOS SENIORMUSICAS
// ==========================================

document.addEventListener("DOMContentLoaded", () => {

    const parametros = new URLSearchParams(window.location.search);
    const idProducto = parametros.get("id");


const imagenesProductos = {

    "1": [
        "assets/img/slider/primavera1.png",
        "assets/img/slider/primavera2.png",
        "assets/img/slider/primavera3.png"
    ],

    "2": [
        "assets/img/slider/juegos1.png",
        "assets/img/slider/juegos2.png",
        "assets/img/slider/juegos3.png"
    ],

    "3": [
        "assets/img/slider/planificaciones1.png",
        "assets/img/slider/planificaciones2.png",
        "assets/img/slider/planificaciones3.png"
    ],

    "4": [
        "assets/img/efemerides.png",
        "assets/img/slider/efemerides2.png",
        "assets/img/slider/efemerides3.png"
    ]

};

    const imagenes = imagenesProductos[idProducto];

    if (!imagenes) {
        return;
    }

    // app.js genera primero el detalle del producto.
    // Buscamos la imagen original dentro de ese detalle.

    const contenedorOriginal = document.querySelector(
        "#detalleProducto .producto-detalle-imagen"
    );

    if (!contenedorOriginal) {
        console.error("No se encontró la imagen del producto.");
        return;
    }

    const imagenOriginal = contenedorOriginal.querySelector("img");

    const nombreProducto = imagenOriginal
        ? imagenOriginal.alt
        : "Producto SeniorMusicas";

    // ======================================
    // CREAR SLIDER
    // ======================================

    contenedorOriginal.innerHTML = `

        <div class="slider-producto">

            <div class="slider-visor">

                <img
                    id="sliderImagen"
                    src="${imagenes[0]}"
                    alt="${nombreProducto}"
                >

                <button
                    type="button"
                    id="sliderAnterior"
                    class="slider-flecha slider-anterior"
                    aria-label="Imagen anterior"
                >
                    <i class="fa-solid fa-chevron-left"></i>
                </button>

                <button
                    type="button"
                    id="sliderSiguiente"
                    class="slider-flecha slider-siguiente"
                    aria-label="Imagen siguiente"
                >
                    <i class="fa-solid fa-chevron-right"></i>
                </button>

            </div>

            <div
                class="slider-indicadores"
                id="sliderIndicadores"
            ></div>

            <div class="slider-contador" id="sliderContador">
                1 / 3
            </div>

        </div>

    `;

    const imagen = document.getElementById("sliderImagen");
    const anterior = document.getElementById("sliderAnterior");
    const siguiente = document.getElementById("sliderSiguiente");
    const indicadores = document.getElementById("sliderIndicadores");
    const contador = document.getElementById("sliderContador");

    let indiceActual = 0;
    let intervalo = null;

    // ======================================
    // MOSTRAR IMAGEN
    // ======================================

    function mostrarImagen(indice) {

        indiceActual = (
            indice + imagenes.length
        ) % imagenes.length;

        imagen.src = imagenes[indiceActual];

        imagen.alt =
            nombreProducto +
            " - Vista previa " +
            (indiceActual + 1);

        contador.textContent =
            (indiceActual + 1) +
            " / " +
            imagenes.length;

        const puntos = indicadores.querySelectorAll(
            ".slider-punto"
        );

        puntos.forEach((punto, posicion) => {

            punto.classList.toggle(
                "activo",
                posicion === indiceActual
            );

            punto.setAttribute(
                "aria-current",
                posicion === indiceActual ? "true" : "false"
            );

        });

    }

    // ======================================
    // CREAR INDICADORES
    // ======================================

    imagenes.forEach((ruta, indice) => {

        const punto = document.createElement("button");

        punto.type = "button";
        punto.className = "slider-punto";

        punto.setAttribute(
            "aria-label",
            "Mostrar imagen " + (indice + 1)
        );

        punto.addEventListener("click", () => {

            mostrarImagen(indice);
            reiniciarAutomatico();

        });

        indicadores.appendChild(punto);

    });

    // ======================================
    // CAMBIO AUTOMÁTICO
    // ======================================

    function reiniciarAutomatico() {

        clearInterval(intervalo);

        intervalo = setInterval(() => {

            mostrarImagen(indiceActual + 1);

        }, 5000);

    }

    // ======================================
    // FLECHAS
    // ======================================

    anterior.addEventListener("click", () => {

        mostrarImagen(indiceActual - 1);
        reiniciarAutomatico();

    });

    siguiente.addEventListener("click", () => {

        mostrarImagen(indiceActual + 1);
        reiniciarAutomatico();

    });

    // ======================================
    // IMÁGENES FALTANTES
    // ======================================

    imagen.addEventListener("error", () => {

        console.warn(
            "No se encontró la imagen:",
            imagen.src
        );

        // Evita un ciclo de errores si falta una imagen.
        if (indiceActual !== 0) {
            mostrarImagen(0);
        }

    });

    // ======================================
    // INICIAR
    // ======================================

    mostrarImagen(0);
    reiniciarAutomatico();

});