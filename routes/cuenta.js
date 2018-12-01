/** Archivo con la ruta principal*/
let express = require('express');

let mdAutenticacion = require('../middlewares/autenticacion');
let app = express();

let Cuenta = require('../models/cuenta'); //importando el modelo de Cuentas

//Rutas
/** ======================================================
 *  Obtener todos las Cuenta
 * =====================================================*/
app.get('/', (req, res) => {
    Cuenta.find({})
        .populate('cliente','nombre')
        .exec((err, cuentas) =>{
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error cargando Cuentas',
                    errors: err
                });
            }
            Cuenta.count({},(err, conteo)=>{
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error al contar las Cuentas',
                        errors: err
                    });
                }//sino sucede ningun error

                //arreglo de todos los Cuentas
                res.status(200).json({
                    ok: true,
                    total: conteo,
                    cuentas
                });
            });

        });
});
/** ======================================================
 *  Obtener un Cuentas
 * =====================================================*/
app.get('/:id', mdAutenticacion.verificaToken, (req, res) =>{
    let id = req.params.id;

    Cuenta.findById(id)
        .populate('cliente', 'nombre')
        .exec((err, cuenta)=>{
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al buscar Cuentas',
                    errors: err
                });
            }
            // En caso que no encontremos ningun con ese id
            if (!cuenta) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'El Cuentas con el id ' + id + ' No existe',
                    errors: { message: 'No existe un Cuentas con ese ID' }
                });
            }
            res.status(201).json({
                ok: true,
                cuenta: cuenta
            });

        });

});
/** ======================================================
 *  Actualizar Cuentas tiene asociado dos middleware
 *  uno para verificar el token y el otro verifica que el
 *  usurio sea ADMIN_ROLE o sea el mismo usurio quien desea
 *  actulizar su informacion
 * =====================================================*/
app.put('/:id',mdAutenticacion.verificaToken,(req,res)=>{
    let id = req.params.id; //obteniendo el parametro de la url
    let body = req.body; //extrayendo el body
    // buscando al Cuentas
    Cuenta.findById(id,(err, cuenta)=>{
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar Cuentas',
                errors: err
            });
        }
        // En caso que no encontremos ningun cuentas con ese id
        if (!cuenta) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El Cuentas con el id ' + id + ' No existe',
                errors: { message: 'No existe un Cuentas con ese ID' }
            });
        }
        // Encontro el cuentas ya existe trabajamos con el pasando los parametros
        // cliente.date = body.date;
        cuenta.detalle = body.detalle;
        cuenta.cliente = body.cliente;
        cuenta.valorTotal = body.valorTotal;
        //cliente.tipo = body.tipo;

        // guardando el cliente actualizado
        cuenta.save((err, cuentaGuarda) => {
            // en caso que la consulta tenga algun error
            if (err) {
                // con el return cuando se dispara la funcion hasta aca queda el procedimiento
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al crear cuenta',
                    errors: err
                });
            }
            res.status(201).json({
                ok: true,
                cuenta: cuentaGuarda
            });
        });
    });
});
/** ======================================================
 *  Eliminar un cuenta tiene asociado dos middleware
 *  uno para verificar el token
 * =====================================================*/
app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {
    let id = req.params.id; //obteniendo el parametro de la url
    Cuenta.findByIdAndRemove(id, (err, cuentaBorrado) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar cuenta',
                errors: err
            });
        }
        // en caso que no encontremos ningun con ese id
        if (!cuentaBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe el cuenta a borrar con ese id',
                errors: { message: 'No existe un cuenta con ese ID' }
            });
        }
        res.status(200).json({
            ok: true,
            cuenta: cuentaBorrado
        });

    });
});
/** ======================================================
 *  Crear cliente tiene asociado un middleware
 *  uno para verificar el token
 * =====================================================*/
app.post('/', (req, res) => {
    let body = req.body; //extrayendo el body
    
    //Creando el objeto de tipo cliente
    let cuenta = new Cuenta({
        cliente: body.cliente,
        detalle: body.detalle,
        valorTotal: body.valorTotal
    });
    
    // guardando el cuenta
    cuenta.save((err, cuentaGuard) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear cuenta',
                errors: err
            });
        }
        res.status(201).json({
            ok: true,
            cuenta: cuentaGuard
        });
    });
});

//exportando todo el app
module.exports = app;