/** Archivo con la ruta principal*/
let express = require('express');

let mdAutenticacion = require('../middlewares/autenticacion');
let app = express();

let Cuenta = require('../models/cuenta'); //importando el modelo de Cuentas
//Rutas
/** ======================================================
 *  Obtener todos las abonos 
 * =====================================================*/

app.get('/', (req, res) => {
    Cuenta.find({}, 'abonos')
        .exec((err, cuentas) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error cargando Cuentas',
                    errors: err
                });
            }
            Cuenta.count({}, (err, conteo) => {
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
app.get('/:id', (req, res) => {
    let id = req.params.id;

    Cuenta.findById(id, 'abonos')
        .exec((err, cuenta) => {
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
 *  Crear cliente tiene asociado un middleware
 *  uno para verificar el token
 * =====================================================*/
app.put('/:id', (req, res) => {
    let id = req.params.id; //obteniendo el parametro de la url
    let body = req.body; //extrayendo el body
    let ab = [];
    // buscando al Cuentas
    Cuenta.findById(id, (err, cuenta) => {
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
        
        // cuenta.abonos.forEach(element => {
            
        //     this.ab.push(element.abono);
        // });
        cuenta.abonos = body.abonos;
        

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


//exportando todo el app
module.exports = app;