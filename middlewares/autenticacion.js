let jwt = require('jsonwebtoken'); //para generar token, despues instalarla la libreria npm install jsonwebtoken --save

const SEED = require('../config/config').SEED; //importando la variable

/** ======================================================
* middleware verificar token
* =====================================================*/
exports.verificaToken = function (req, res, next) {
    let token = req.query.token; //recibiendo el token por url
    /** verify() el primer parametro es el toke que recibe de
     * la aplicacion, siguiente parametro el seed, el tercer
     * parametro el collback, contiene un error y informacion
     * del usuario*/
    jwt.verify(token, SEED, (err, decoded) => {
        //en caso que la consulta tenga algun error
        if (err) {
            //con el return cuando se dispara la funcion hasta aca queda el procedimiento
            return res.status(401).json({
                ok: false,
                mensaje: 'Token incorrepto',
                errors: err
            });
        }
        /** 
         * poner el usuario autenticado en cualquier 
         * peticion donde se utilece esta funcion
        */
        req.usuario = decoded.usuario;
        next(); //para que continue si el token es correcto

        // res.status(400).json({
        //     ok: false,
        //     mensaje: 'Token incorrepto',
        //     decoded: decoded
        // });
    });
}

/**=====================================================
* middleware que verifica que un usuario sea admin
* =====================================================*/
exports.verifiADMIN_ROLE = function (req, res, next) {
    var usuario = req.usuario; //recibiendo el usuario por url
    /* si el usurio que recibimos es admin le permitimos continuar
    ** caso contrario emitimos un error, para ellos utilizamos la
    ** funcion next() */
    if (usuario.rol === 'ADMIN_ROLE') {
        next(); //para que continue si el usuario es admin
        return; //no es tan necesario
    } else {
        //con el return cuando se dispara la funcion hasta aca queda el procedimiento
        return res.status(401).json({
            ok: false,
            mensaje: 'Token incorrepto - No es Administrador',
            errors: { message: 'No es Administrador, no puedes ejecutar ese procedimiento' }
        });
    }
}
/**=====================================================
* middleware que verifica que un usuario sea admin
* =====================================================*/
exports.verifiADMIN_ROLE_O_MismoUser = function (req, res, next) {
    var usuario = req.usuario; //recibiendo el usuario que esta en el token
    var id = req.params.id; //siempre recibira un id por parametro en el url

    /* si el usurio que recibimos es admin o es el mismo usuarios
    ** que se registro quien quiere hacer la modificacion le
    ** permitimos continuar caso contrario emitimos un error, para
    ** ellos utilizamos la funcion next() */
    if (usuario.rol === 'ADMIN_ROLE' || usuario._id === id) {
        next(); //para que continue si el usuario es admin
        return; //no es tan necesario
    } else {
        //con el return cuando se dispara la funcion hasta aca queda el procedimiento
        return res.status(401).json({
            ok: false,
            mensaje: 'Token incorrepto - No es Administrador, ni el mismo usuario',
            errors: { message: 'No es Administrador, no puedes ejecutar ese procedimiento' }
        });
    }
}
