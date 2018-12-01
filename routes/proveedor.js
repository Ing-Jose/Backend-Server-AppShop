/** Archivo con la ruta principal*/
var express = require('express');

let mdAutenticacion = require('../middlewares/autenticacion');
var app = express();

let Proveedor = require('../models/proveedor'); //importando el modelo de proveedores

//Rutas
/** ======================================================
 *  Obtener todos los Proveedor
 * =====================================================*/
app.get('/', (req, res) => {
    Proveedor.find({}).populate('usuario','nombre').exec((err, proveederes) =>{
        if (err) {
            //con el return cuando se dispara la funcion hasta aca queda el procedimiento
            return res.status(500).json({
                ok: false,
                mensaje: 'Error cargando proveedores',
                errors: err
            });
        }
        Proveedor.count({},(err, conteo)=>{
            if (err) {
                //con el return cuando se dispara la funcion hasta aca queda el procedimiento
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al contar proveedores',
                    errors: err
                });
            }//sino sucede ningun error

            //arreglo de todos los proveedores
            res.status(200).json({
                ok: true,
                total: conteo,
                proveederes: proveederes
            });
        });

    });
});
/** ======================================================
 *  Obtener un Proveedor
 * =====================================================*/
app.get('/:id', (req, res) =>{
    var id = req.params.id;
    var body = req.body; // Extrayendo el body

    Proveedor.findById(id).populate('usuario', 'nombre').exec((err, proveedor)=>{
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar proveedor',
                errors: err
            });
        }
        // En caso que no encontremos ningun proveedor con ese id
        if (!proveedor) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El Proveedor con el id ' + id + ' No existe',
                errors: { message: 'No existe un Proveedor con ese ID' }
            });
        }
        res.status(201).json({
            ok: true,
            proveedor: proveedor
        });

    });

});
/** ======================================================
 *  Actualizar proveedor tiene asociado dos middleware
 *  uno para verificar el token y el otro verifica que el
 *  usurio sea ADMIN_ROLE o sea el mismo usurio quien desea
 *  actulizar su informacion
 * =====================================================*/
app.put('/:id',mdAutenticacion.verificaToken,(req,res)=>{
    let id = req.params.id; //obteniendo el parametro de la url
    let body = req.body; //extrayendo el body
    //buscando al proveedor
    Proveedor.findById(id,(err, proveedor)=>{
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar proveedor',
                errors: err
            });
        }
        // En caso que no encontremos ningun proveedor con ese id
        if (!proveedor) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El Proveedor con el id ' + id + ' No existe',
                errors: { message: 'No existe un Proveedor con ese ID' }
            });
        }
        // Encontro el proveedor ya existe trabajamos con el pasando los parametros
        proveedor.nombre = body.nombre;
        proveedor.telefono = body.telefono;
        proveedor.almacen = body.almacen;
        proveedor.direccion = body.direccion;
        proveedor.usuario = req.usuario._id; //lo toma del token

        // guardando el proveedor
        proveedor.save((err, proveedorGuardado) => {
            // en caso que la consulta tenga algun error
            if (err) {
                // con el return cuando se dispara la funcion hasta aca queda el procedimiento
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al crear proveedor',
                    errors: err
                });
            }
            res.status(201).json({
                ok: true,
                proveedor: proveedorGuardado
            });
        });
    });
});
/** ======================================================
 *  Eliminar un proveedor tiene asociado dos middleware
 *  uno para verificar el token
 * =====================================================*/
app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {
    let id = req.params.id; //obteniendo el parametro de la url
    Proveedor.findByIdAndRemove(id, (err, proveedorBorrado) => {
        if (err) {
            //con el return cuando se dispara la funcion hasta aca queda el procedimiento
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar proveedor',
                errors: err
            });
        }
        // en caso que no encontremos ningun proveedor con ese id
        if (!proveedorBorrado) {
            //con el return cuando se dispara la funcion hasta aca queda el procedimiento
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe el proveedor a borrar con ese id',
                errors: { message: 'No existe un proveedor con ese ID' }
            });
        }
        res.status(200).json({
            ok: true,
            proveedor: proveedorBorrado
        });

    });
});
/** ======================================================
 *  Crear proveedor tiene asociado un middleware
 *  uno para verificar el token
 * =====================================================*/
app.post('/',mdAutenticacion.verificaToken,(req, res) => {
    let body = req.body; //extrayendo el body
    //Creando el objeto de tipo proveedor
    let proveedor = new Proveedor({
        nombre: body.nombre,
        telefono: body.telefono,
        almacen: body.almacen,
        direccion: body.direccion,
        usuario: req.usuario._id
    });
    // guardando el proveedor
    proveedor.save((err, proveedorGuardado) => {
        // en caso que la consulta tenga algun error
        if (err) {
            // con el return cuando se dispara la funcion hasta aca queda el procedimiento
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear proveedor',
                errors: err
            });
        }
        res.status(201).json({
            ok: true,
            proveedor: proveedorGuardado
        });
    });
});

//exportando todo el app
module.exports = app;