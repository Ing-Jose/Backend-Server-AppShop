// Importandos liibrerias despues de instalarlas npm ===============
const express = require('express');
const mongoose = require('mongoose');

// Inicialización de variables utilizando la libreria ===============
const app = express();

// CROSS ============================================================
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS");
    next();
});


// Conexion a la DB ============================================================
mongoose.connection.openUri('mongodb://localhost:27017/appShopDB', { useNewUrlParser: true }, (err, res) => {
    if (err) throw err; //se detiene todo el proceso
    console.log('Base de datos \x1b[96m%s\x1b[0m', 'online')
});
mongoose.set('useCreateIndex', true);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Rutas
/** ruta inicial
 app.get('/',(req, res, next) => {
     // indica el stado de la respuesta y envia un json
     res.status(200).json({
         ok: true,
         mensaje: 'Peticion realizada correctamente'
        });
        // es bueno estadarizar las respuestas
    });
    */
// Importando rutas ============================================================
const appRoutes = require('./routes/app'); // Importar rutas 
const usarioRoutes = require('./routes/usuario'); // Importar rutas de usuario
const loginRoutes = require('./routes/login'); // Importar rutas de usuario
const proveedorRoutes = require('./routes/proveedor');// Importar rutas de proveedor
const zapatoRoutes = require('./routes/zapato');// Importar rutas de zapatos
const clienteRoutes = require('./routes/cliente');// Importar rutas de cliente
const cuentaRoutes = require('./routes/cuenta');// Importar rutas de cliente
const abonoRoutes = require('./routes/abono');// Importar rutas de cliente

// Middleware ===================================================================
app.use('/usuario', usarioRoutes);
app.use('/login', loginRoutes);
app.use('/proveedor', proveedorRoutes);
app.use('/zapato', zapatoRoutes);
app.use('/cliente', clienteRoutes);
app.use('/cuenta', cuentaRoutes);
app.use('/abono', abonoRoutes);

app.use('/', appRoutes);

// Escuchar peticiones ============================================================
app.listen(3000, () => {
    console.log('Express server puerto 3000: \x1b[94m%s\x1b[0m', 'online')
});
