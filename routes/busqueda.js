/** Archivo con la ruta principal*/
var express = require('express');
var app = express();

let Cliente = require('../models/cliente'); //importando el modelo de Clientes
let Proveedor = require('../models/proveedor'); //importando el modelo de proveedores

//Rutas
app.get('/todo/:busqueda', (req, res, next) => {
    let busq = req.params.busqueda;
    let regex = new RegExp(busq, 'i');
    //arreglo de promesas
    Promise.all([
        buscarCliente(regex),
        buscarProveedores(regex)
    ])
        .then(respuestas => {
            res.status(200).json({
                ok: true,
                clientes: respuestas[0],
                proveedores: respuestas[1]
            });
        });

});

// app.get('/coleccion/:tabla/:busqueda',(req, res)=>{
//     let tabla = req.params.tabla;
//     let busq = req.params.busqueda;

//     let regex = new RegExp(busq, 'i');
//     let promesa;
//     switch (tabla) {
//         case 'proveedores':
//             promesa = buscarProveedores(regex);
//             break;
//         case 'clientes':
//             promesa = buscarCliente(regex);
//             break;
    
//         default:
//             return res.status(400).json({
//                 ok: false,
//                 mensaje: 'Los tipos de búsqueda solo son Proveedores y Clientes',
//                 error: {message:'tipo de tabla/coleccion no válido'}
//             });
//     }
//     promesa.then(data=>{
//         res.status(200).json({
//             ok: true,
//             [tabla]:data
//         });
//     });
// });

/**
 * retorna un arreglo con todos loa proveedores que 
 * coincidan con la busquedad, los busca por nombre
 * del proveedor y por almacen  
 * @param {*} busq 
 * @param {*} regex expresion a buscar 
 */
function buscarProveedores(regex) {
    return new Promise((resolve,reject)=>{
        Proveedor.find()
            .or([{ 'nombre': regex }, { 'almacen': regex }])
            .exec((err, poveedores) => {
                if (err) {
                    reject('Error al cargar poveedores ',err);
                } else {
                    resolve(poveedores);
                }
            });
    });
    
    
}
function buscarCliente(regex) {
    return new Promise((resolve,reject)=>{
        Cliente.find({ nombre: regex }, (err, clientes) => {
            if (err) {
                reject('Error al cargar clientes ',err);
            } else {
                resolve(clientes);
            }
        });
    });
    
    
}
//exportando todo el app
module.exports = app;