/** Archivo con la ruta principal*/
var express = require('express');
var app = express();
//Rutas
app.get('/', (req, res, next) => {
    res.status(200).json({
        ok: true,
        mensaje: 'Petición realizada correctamente'
    })
});
app.post('/', (req, res, next) => {
    let body = req.body; //extrayendo el body
    res.status(200).json({
        ok: true,
        mensaje: 'Petición realizada correctamente',
        body
    })
});

//exportando todo el app
module.exports = app;