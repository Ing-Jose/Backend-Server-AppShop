/** Archivo con la ruta principal*/
var express = require('express');

let mdAutenticacion = require('../middlewares/autenticacion');
var app = express();

let Zapato = require('../models/zapato'); //importando el modelo de Zapatoes

//Rutas
/** ======================================================
 *  Obtener todos los Zapato
 * =====================================================*/
app.get('/', (req, res) => {
    Zapato.find({})
        .populate('usuario', 'nombre') //para taar la informacion de la coleccion de medico pero solo el nombre 
        .populate('proveedor', 'nombre telefono almacen') //para taar la informacion de la coleccion de proveedores pero solo el nombre telefono y almacen
        .exec((err, zapatos) =>{
            if (err) {
                //con el return cuando se dispara la funcion hasta aca queda el procedimiento
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error cargando zapatos',
                    errors: err
                });
            }
            Zapato.count({},(err, conteo)=>{
                if (err) {
                    //con el return cuando se dispara la funcion hasta aca queda el procedimiento
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error al contar zapatos',
                        errors: err
                    });
                }//sino sucede ningun error

                //arreglo de todos los zapatos
                res.status(200).json({
                    ok: true,
                    total: conteo,
                    zapatos: zapatos
                });
            });

        });
});
/** ======================================================
 *  Obtener un Zapato
 * =====================================================*/
app.get('/:id', (req, res) => {
    var id = req.params.id;

    Zapato.findById(id)
        .populate('usuario', 'nombre')
        .populate('proveedor', 'nombre telefono almacen') //para taar la informacion de la coleccion de proveedores pero solo el nombre telefono y almacen
        .exec((err, zapato) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al buscar zapato',
                    errors: err
                });
            }
            // En caso que no encontremos ningun zapato con ese id
            if (!zapato) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'El Zapato con el id ' + id + ' No existe',
                    errors: { message: 'No existe un Zapato con ese ID' }
                });
            }
            res.status(201).json({
                ok: true,
                zapato: zapato
            });

         });

});
/** ======================================================
 *  Actualizar zapato tiene asociado dos middleware
 *  uno para verificar el token y el otro verifica que el
 *  usurio sea ADMIN_ROLE o sea el mismo usurio quien desea
 *  actulizar su informacion
 * =====================================================*/
app.put('/:id' ,mdAutenticacion.verificaToken,(req, res) => {
    let id = req.params.id; //obteniendo el parametro de la url
    let body = req.body; //extrayendo el body
    //buscando al zapato
    Zapato.findById(id, (err, zapato)=>{
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar zapato',
                errors: err
            });
        }
        // En caso que no encontremos ningun zapato con ese id
        if (!zapato) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El Zapato con el id ' + id + ' No existe',
                errors: { message: 'No existe un Zapato con ese ID' }
            });
        }
        // Encontro el zapato ya existe trabajamos con el pasando los parametros
        zapato.modelo = body.modelo;
        zapato.ref = body.ref;
        zapato.valorCompra = body.valorComp;
        zapato.valorVenta = body.valorVent;
        zapato.proveedor = body.proveedor;
        zapato.usuario = req.usuario._id; //lo toma del token
        
        // guardando el zapato
        zapato.save((err, zapatoGuardado) => {
            // en caso que la consulta tenga algun error
            if (err) {
                // con el return cuando se dispara la funcion hasta aca queda el procedimiento
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al crear zapato',
                    errors: err
                });
            }
            res.status(201).json({
                ok: true,
                zapato: zapatoGuardado
            });
        });
    });
});
/** ======================================================
 *  Eliminar un zapato, tiene asociado dos middleware
 *  uno para verificar el token
 * =====================================================*/
app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {
    let id = req.params.id; //obteniendo el parametro de la url
    Zapato.findByIdAndRemove(id, (err, zapatoBorrado) => {
        if (err) {
            //con el return cuando se dispara la funcion hasta aca queda el procedimiento
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar zapato',
                errors: err
            });
        }
        // en caso que no encontremos ningun zapato con ese id
        if (!zapatoBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe el Zapato a borrar con ese id',
                errors: { message: 'No existe un Zapato con ese ID' }
            });
        }
        res.status(200).json({
            ok: true,
            zapato: zapatoBorrado
        });

    });
});
/** ======================================================
 *  Crear zapato, tiene asociado un middleware
 *  uno para verificar el token
 * =====================================================*/
app.post('/',mdAutenticacion.verificaToken,(req, res) => {
    let body = req.body; //extrayendo el body
    //Creando el objeto de tipo zapato
    let zapato = new Zapato({
        modelo: body.modelo,
        ref: body.ref,
        valorCompra: body.valorComp,
        valorVenta: body.valorVent,
        proveedor: body.proveedor,
        usuario: req.usuario._id
    });
    // guardando el zapato
    zapato.save((err, zapatoGuardado) => {
        // en caso que la consulta tenga algun error
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear zapato',
                errors: err
            });
        }
        res.status(201).json({
            ok: true,
            zapato: zapatoGuardado
        });
    });
});

//exportando todo el app
module.exports = app;