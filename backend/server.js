const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const {
    MercadoPagoConfig,
    Preference,
    Payment
} = require("mercadopago");


// ==========================================
// CONFIGURACIÓN
// ==========================================

dotenv.config();

console.log(
    "Token Mercado Pago cargado:",
    process.env.MP_ACCESS_TOKEN ? "SI" : "NO"
);

const app = express();

const PORT =
    process.env.PORT || 3000;


// ==========================================
// MIDDLEWARES
// ==========================================

app.use(cors());

app.use(express.json());


// ==========================================
// VALIDAR TOKEN
// ==========================================

if (!process.env.MP_ACCESS_TOKEN) {

    console.error(
        "ERROR: No se encontró MP_ACCESS_TOKEN"
    );

}


// ==========================================
// MERCADO PAGO
// ==========================================

const client =
    new MercadoPagoConfig({

        accessToken:
            process.env.MP_ACCESS_TOKEN

    });


// ==========================================
// URL DEL FRONTEND
// ==========================================

const FRONTEND_URL =
    "https://serdefuego.github.io/proyectoFinalTeclab";


// ==========================================
// PRODUCTOS
// ==========================================

const productos = [

    {
        id: 1,
        nombre: "Canciones para Primavera",
        precio: 4500
    },

    {
        id: 2,
        nombre: "Juegos Musicales",
        precio: 3900
    },

    {
        id: 3,
        nombre: "Planificaciones Anuales",
        precio: 6200
    },

    {
        id: 4,
        nombre: "Efemérides Musicales",
        precio: 3500
    }

];


// ==========================================
// RUTA DE PRUEBA
// ==========================================

app.get("/", (req, res) => {

    res.json({

        mensaje:
            "Backend SeniorMusicas funcionando"

    });

});


// ==========================================
// CREAR PREFERENCIA
// ==========================================

app.post(
    "/crear-preferencia",

    async (req, res) => {

        try {

            console.log(
                "Solicitud recibida:"
            );

            console.log(
                req.body
            );


            const carrito =
                req.body.carrito;


            // ==================================
            // VALIDAR CARRITO
            // ==================================

            if (
                !Array.isArray(carrito) ||
                carrito.length === 0
            ) {

                return res.status(400).json({

                    error:
                        "El carrito está vacío"

                });

            }


            // ==================================
            // CREAR ITEMS
            // ==================================

            const items =
                carrito.map(item => {


                    const producto =
                        productos.find(

                            producto =>
                                producto.id ===
                                Number(item.id)

                        );


                    if (!producto) {

                        throw new Error(
                            `Producto inválido: ${item.id}`
                        );

                    }


                    const cantidad =
                        Math.max(
                            1,
                            Number(item.cantidad) || 1
                        );


                    return {

                        id:
                            String(producto.id),

                        title:
                            producto.nombre,

                        quantity:
                            cantidad,

                        unit_price:
                            producto.precio,

                        currency_id:
                            "ARS"

                    };

                });


            console.log(
                "Items enviados a Mercado Pago:"
            );

            console.log(
                items
            );


            // ==================================
            // CREAR PREFERENCIA
            // ==================================

            const preference =
                new Preference(client);


const respuesta =
    await preference.create({

        body: {

            items: items,

            back_urls: {

                success:
                    "https://serdefuego.github.io/proyectoFinalTeclab/carrito.html",

                pending:
                    "https://serdefuego.github.io/proyectoFinalTeclab/carrito.html",

                failure:
                    "https://serdefuego.github.io/proyectoFinalTeclab/carrito.html"

            },

            auto_return:
                "approved"

        }

    });


            console.log(
                "Preferencia creada correctamente"
            );
            console.log(
                        "BACK URL SUCCESS:",
                        `${FRONTEND_URL}/carrito.html`
                    );

            console.log(
                        "AUTO RETURN:",
                        "approved"
                    );

            console.log(
                "ID:",
                respuesta.id
            );

            console.log(
                "init_point:",
                respuesta.init_point
            );


            // ==================================
            // RESPUESTA AL FRONTEND
            // ==================================

            res.json({

                id:
                    respuesta.id,

                init_point:
                    respuesta.init_point,

                sandbox_init_point:
                    respuesta.sandbox_init_point

            });

        }

        catch (error) {

            console.error(
                "================================"
            );

            console.error(
                "ERROR MERCADO PAGO"
            );

            console.error(
                "================================"
            );

            console.error(
                error
            );


            if (error.message) {

                console.error(
                    "Mensaje:",
                    error.message
                );

            }


            if (error.status) {

                console.error(
                    "Status:",
                    error.status
                );

            }


            if (error.response) {

                console.error(
                    "Response:",
                    error.response
                );

            }


            res.status(500).json({

                error:
                    error.message ||
                    "No se pudo crear la preferencia"

            });

        }

    }
);


// ==========================================
// VERIFICAR PAGO
// ==========================================

app.get(
    "/verificar-pago/:paymentId",

    async (req, res) => {

        try {

            const paymentId =
                req.params.paymentId;


            if (!paymentId) {

                return res.status(400).json({

                    aprobado: false,

                    error:
                        "Falta el ID del pago"

                });

            }


            console.log(
                "Verificando pago:",
                paymentId
            );


            const payment =
                new Payment(client);


            const respuesta =
                await payment.get({

                    id: paymentId

                });


            console.log(
                "Estado del pago:",
                respuesta.status
            );


            // ==================================
            // PAGO APROBADO
            // ==================================

            if (
                respuesta.status ===
                "approved"
            ) {

                return res.json({

                    aprobado:
                        true,

                    status:
                        respuesta.status,

                    payment_id:
                        respuesta.id,

                    monto:
                        respuesta.transaction_amount

                });

            }


            // ==================================
            // PAGO NO APROBADO
            // ==================================

            return res.json({

                aprobado:
                    false,

                status:
                    respuesta.status,

                payment_id:
                    respuesta.id

            });

        }

        catch (error) {

            console.error(
                "Error verificando pago:",
                error
            );


            res.status(500).json({

                aprobado:
                    false,

                error:
                    error.message ||
                    "No se pudo verificar el pago"

            });

        }

    }
);


// ==========================================
// INICIAR SERVIDOR
// ==========================================

app.listen(
    PORT,

    () => {

        console.log(
            `Servidor SeniorMusicas funcionando en puerto ${PORT}`
        );

    }
);