/** Archivo con la ruta principal*/
let express = require('express');

let mdAutenticacion = require('../middlewares/autenticacion');
let app = express();

let Cliente = require('../models/cliente'); //importando el modelo de Clientes

//Rutas
/** ======================================================
 *  Obtener todos los cliente
 * =====================================================*/
app.get('/', mdAutenticacion.verificaToken, (req, res) => {
    Cliente.find({}, (err, clientes) =>{
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error cargando Clientes',
                errors: err
            });
        }
        Cliente.count({},(err, conteo)=>{
            if (err) {
                //con el return cuando se dispara la funcion hasta aca queda el procedimiento
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al contar cliente',
                    errors: err
                });
            }//sino sucede ningun error

            //arreglo de todos los clientes
            res.status(200).json({
                ok: true,
                total: conteo,
                clientes: clientes
            });
        });

    });
});
/** ======================================================
 *  Obtener un cliente
 * =====================================================*/
app.get('/:id', mdAutenticacion.verificaToken, (req, res) =>{
    let id = req.params.id;

    Cliente.findById(id, (err, cliente)=>{
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar cliente',
                errors: err
            });
        }
        // En caso que no encontremos ningun con ese id
        if (!cliente) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El Cliente con el id ' + id + ' No existe',
                errors: { message: 'No existe un Cliente con ese ID' }
            });
        }
        res.status(201).json({
            ok: true,
            cliente: cliente
        });

    });

});
/** ======================================================
 *  Actualizar cliente tiene asociado dos middleware
 *  uno para verificar el token y el otro verifica que el
 *  usurio sea ADMIN_ROLE o sea el mismo usurio quien desea
 *  actulizar su informacion
 * =====================================================*/
app.put('/:id',mdAutenticacion.verificaToken,(req,res)=>{
    let id = req.params.id; //obteniendo el parametro de la url
    let body = req.body; //extrayendo el body
    // buscando al cliente
    Cliente.findById(id,(err, cliente)=>{
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar cliente',
                errors: err
            });
        }
        // En caso que no encontremos ningun cliente con ese id
        if (!cliente) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El Cliente con el id ' + id + ' No existe',
                errors: { message: 'No existe un Cliente con ese ID' }
            });
        }
        // Encontro el cliente ya existe trabajamos con el pasando los parametros
        cliente.nombre = body.nombre;
        cliente.telefono = body.telefono;
        cliente.referencia = body.referencia;
        cliente.tipo = body.tipo;

        // guardando el cliente actualizado
        cliente.save((err, clienteGuardado) => {
            // en caso que la consulta tenga algun error
            if (err) {
                // con el return cuando se dispara la funcion hasta aca queda el procedimiento
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al crear cliente',
                    errors: err
                });
            }
            res.status(201).json({
                ok: true,
                cliente: clienteGuardado
            });
        });
    });
});
/** ======================================================
 *  Eliminar un cliente tiene asociado dos middleware
 *  uno para verificar el token
 * =====================================================*/
app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {
    let id = req.params.id; //obteniendo el parametro de la url
    Cliente.findByIdAndRemove(id, (err, clienteBorrado) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar cliente',
                errors: err
            });
        }
        // en caso que no encontremos ningun con ese id
        if (!clienteBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe el cliente a borrar con ese id',
                errors: { message: 'No existe un cliente con ese ID' }
            });
        }
        res.status(200).json({
            ok: true,
            cliente: clienteBorrado
        });

    });
});
/** ======================================================
 *  Crear cliente tiene asociado un middleware
 *  uno para verificar el token
 * =====================================================*/
app.post('/',mdAutenticacion.verificaToken,(req, res) => {
    let body = req.body; //extrayendo el body
    //Creando el objeto de tipo cliente
    let cliente = new Cliente({
        nombre: body.nombre,
        telefono: body.telefono,
        referencia: body.referencia,
        tipo: body.tipo
    });
    // guardando el cliente
    cliente.save((err, clientGuard) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear cliente',
                errors: err
            });
        }
        res.status(201).json({
            ok: true,
            cliente: clientGuard
        });
    });
});

//exportando todo el app
module.exports = app;