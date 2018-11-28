// Importandos liibrerias despues de instalarlas npm
var express = require('express');
var mongoose = require('mongoose');

// Inicialización de variables utilizando la libreria 
var app = express();

//CROSS
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS");
    next();
});


//Conexion a la DB
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
//Importando rutas
var appRoutes = require('./routes/app'); // Importar rutas 
var usarioRoutes = require('./routes/usuario'); // Importar rutas de usuario
// var loginRoutes = require('./routes/login');
var loginRoutes = require('./routes/login'); // Importar rutas de usuario

// Middleware
app.use('/usuario', usarioRoutes);
app.use('/login', loginRoutes);
// app.use('/login', loginRoutes);

app.use('/', appRoutes);
// escuchar peticiones 
app.listen(3000, () => {
    console.log('Express server puerto 3000: \x1b[94m%s\x1b[0m', 'online')
});
