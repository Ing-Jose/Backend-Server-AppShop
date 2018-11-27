// Importandos liibrerias despues de instalarlas npm
var express = require('express');
var mongoose = require('mongoose');

// Inicialización de variables utilizando la libreria 
var app = express();

//Conexion a la DB
mongoose.connection.openUri('mongodb://localhost:27017/appShopDB', { useNewUrlParser: true }, (err, res) => {
    if (err) throw err; //se detiene todo el proceso
    console.log('Base de datos \x1b[96m%s\x1b[0m', 'online')
});
// mongoose.set('useCreateIndex', true);


// Rutas
app.get('/',(req, res, next) => {
    // indica el stado de la respuesta y envia un json
    res.status(200).json({
        ok: true,
        mensaje: 'Peticion realizada correctamente'
    });
    // es bueno estadarizar las respuestas
});

// escuchar peticiones 
app.listen(3000, () => {
    console.log('Express server puerto 3000: \x1b[94m%s\x1b[0m', 'online')
});
