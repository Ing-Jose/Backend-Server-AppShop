/** Archivo con la ruta principal*/
let express = require('express');
/** 
 * luego de instalar la libreria
 * npm install bcryptjs --save 
 * para trabajar con datos encriptado
 */
let bcrypt = require('bcryptjs');

let mdAutenticacion = require('../middlewares/autenticacion');

let app = express();

// Importando el modelo de usuario
let Usuario = require('../models/usuario');

//Rutas
/** ======================================================
 *  Obtener todos los usuarios
 * =====================================================*/
app.get('/', (req, res, ) => {
    let desde = req.query.desde || 0;
    desde = Number(desde);
    //usuando el modelo de usuario
    /** mostrando no todos los campos de usuario*/
    Usuario.find({}, 'nombre email img rol')
        //.skip(desde) // desde donde comenzara inglremento de 5 en 5
        .limit(5) //limitar cantidad a mostrar
        .exec((err, usuarios) => {
            //en caso que la consulta tenga algun error
            if (err) {
                //con el return cuando se dispara la funcion hasta aca queda el procedimiento
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error cargando usuario',
                    errors: err
                });
            }
            Usuario.count({}, (err, conteo) => {
                if (err) {
                    //con el return cuando se dispara la funcion hasta aca queda el procedimiento
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error al contar usuario',
                        errors: err
                    });
                } //sino sucede ningun error
                
                //arreglo de todos los usuarios
                res.status(200).json({
                    ok: true,
                    total: conteo,
                    usuarios: usuarios
                });
            });

        });

});
/** ========= Despues de aca viene todas las rutas que van
 * a requerir autentificación ===========================*/

/** ======================================================
 *  Actualizar usuario tiene asociado dos middleware
 *  uno para verificar el token y el otro verifica que el
 *  usurio sea ADMIN_ROLE o sea el mismo usurio quien desea
 *  actulizar su informacion
 * =====================================================*/
app.put('/:id', mdAutenticacion.verificaToken,(req, res) => {
    let id = req.params.id; //obteniendo el parametro de la url
    let body = req.body; //extrayendo el body
    //buscando al usuario
    Usuario.findById(id,(err,usuario)=>{
        //en caso que la consulta tenga algun error
        if (err) {
            //con el return cuando se dispara la funcion hasta aca queda el procedimiento
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar usuario',
                errors: err
            });
        }
        // en caso que no encontremos ningun usuario con ese id
        if (!usuario) {
            //con el return cuando se dispara la funcion hasta aca queda el procedimiento
            return res.status(400).json({
                ok: false,
                mensaje: 'El usuario con el id ' + id + ' No existe',
                errors: { message: 'No existe un usuario con ese ID' }
            });
        }
        /** 
         * encontro el usario ya existe trabajamos con el pasando los parametros
         * no vamos a cambiar ni la imagen ni la contraseña
        */
        usuario.nombre = body.nombre;
        usuario.email = body.email;
        usuario.rol = body.rol;
        //guardando
        usuario.save((err, usuarioGuardado) => {
            //en caso que la consulta tenga algun error
            if (err) {
                //con el return cuando se dispara la funcion hasta aca queda el procedimiento
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar usuario',
                    errors: err
                });
            }
            //para no mostrar la contraseña
            usuarioGuardado.password = ':)';
            res.status(200).json({
                ok: true,
                usuario: usuarioGuardado
            });
        });

    })
});
/** ======================================================
 *  Eliminar un usuario tiene asociado dos middleware
 *  uno para verificar el token
 * =====================================================*/
app.delete('/:id', mdAutenticacion.verificaToken,( req, res ) => {
    let id = req.params.id; //obteniendo el parametro de la url
    Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {
        if (err) {
            //con el return cuando se dispara la funcion hasta aca queda el procedimiento
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar usuario',
                errors: err
            });
        }
        // en caso que no encontremos ningun usuario con ese id
        if (!usuarioBorrado) {
            //con el return cuando se dispara la funcion hasta aca queda el procedimiento
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe el usuario  a borrar con ese id',
                errors: { message: 'No existe un usuario con ese ID' }
            });
        }
        res.status(200).json({
            ok: true,
            usuario: usuarioBorrado
        });
        
    });
});

/** ======================================================
 *  Crear usuarios tiene asociado un middleware
 *  uno para verificar el token
 * =====================================================*/
app.post('/',  mdAutenticacion.verificaToken,(req, res) => {

    let body = req.body; //extrayendo el body

    //Creando el objeto de tipo usuario
    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        img: body.img,
        rol: body.rol,
    });
    //guardando el usuario
    usuario.save((err, usuarioGuardado) => {
        //en caso que la consulta tenga algun error
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error crear usuario',
                errors: err
            });
        }
        // sino hay error
        usuarioGuardado.password = ':)';
        //arreglo de todos los usuarios
        res.status(201).json({
            ok: true,
            usuario: usuarioGuardado,
            // usuarioToken: req.usuario
        });
    });
    
});

//exportando todo el app
module.exports = app;