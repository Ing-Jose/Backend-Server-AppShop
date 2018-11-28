let express = require('express');
/** 
 * luego de instalar la libreria
 * npm install bcryptjs --save para trabajar con datos encriptado
 * npm install jsonwebtoken --save para token
 */
let bcrypt = require('bcryptjs'); //para comparar el que se ingresa con el recuperado
let jwt = require('jsonwebtoken'); //para generar token

const SEED = require('../config/config').SEED;

let app = express(); //para trabajar con la DB
let Usuario = require('../models/usuario'); // para trabajar con la coleccion de usuario

/** ===========================================================
 *  Autentificación Normal
 *  ==========================================================*/
app.post('/',(req, res) => {
    //para recibir el correo y la contraseña
    let body = req.body; //extrayendo el body
    /**
     * verificando si existe el usuario con esos datos
     * como el emial es unico, me debe retornar un unico 
     * usuario, pasamos lo parametros a la funcion
    */
   Usuario.findOne({email: body.email}, (err, user) =>{
       if (err) {
           // con el return cuando se dispara la funcion hasta aca queda el procedimiento
           return res.status(500).json({
               ok: false,
               mensaje: 'Error al buscar usuario',
               errors: err
           });
       }
       // si no existe un usuario con ese correo
       if (!user) {
           return res.status(400).json({
               ok: false,
               mensaje: 'Credenciales incorrectas - email',
               // errors: err
           });
       }
       /** 
        * verifiacando la contraseña, compara si la contraseña
        * encryptada es igual al password que tiene el usurario
        * recistrado en la base de datos
        *  */
       if (!bcrypt.compareSync(body.password, user.password)) {
           return res.status(400).json({
               ok: false,
               mensaje: 'Credenciales incorrectas - contraseña',
               // errors: err
           });
       }

       user.password = ':)';  //quitando la contraseña
       
       /** creando un token!!! intslamos la libreria npm install jsonwebtoken --save
        * sign() recibe varios parametros el primero la data, el payload,
         * luego la semilla, para hacer unico al toke, luego la fecha de expiracion
         * del token, puede ser infinito 14400 equivalen a 4 horas
        */
       let token = jwt.sign({ usuario: user }, SEED, { expiresIn: 14400 });

       return res.status(400).json({
           ok: true,
           usuario: user,
           token: token,
           id: user.id
       });

   });
});




//exportando todo el app
module.exports = app;