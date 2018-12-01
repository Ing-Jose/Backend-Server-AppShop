var mongoose = require('mongoose'); //para trabajar con mongoose
//utilizando  el pluging intalado npm install --save mongoose-unique-validator
// var uniqueValidator = require('mongoose-unique-validator');
// para trabajar con Schema
var Schema = mongoose.Schema;
/**
 * para controlar los roles, creamos un objeto
 * con los unicos roles aceptables, Si no esta 
 * en la lista mandamos un mesaje de error
 */
// var rolesValidos = {
//     values: ['ADMIN_ROLE', 'USER_ROLE'],
//     message: '{VALUE} no es un rol permitido'
// }
// Definiendo el usuario schema (nombre de la coleccion en singular seguido de schema)
/** new Schema() funcion que recibe un objeto de javascript 
 * con la configuracion de lo que vamos aguardar en el schema,
 * menos el id, el id es autamatico
 * required: [true, 'mensaje']
*/
var proveedorSchema = new Schema({
    nombre: { type: String, required: [true, 'El nombre es necesario'] },
    telefono: { type: Number, required: [true, 'El telefono es necesario'] },
    almacen: { type: String, required: [true, 'El almacen es necesario'] },
    direccion: { type: String, required: [true, 'La direccion es necesaria']  },
    img: { type: String, required: false },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario', required: true}
}, { collection: 'proveedores' });
/** 
 * exportando el archivo para poder utilizar el schema, de este archivo
 * mongoose.model('Nombre como se utilizara por fuera',nombre del schema);
*/
// usuarioSchema.plugin(uniqueValidator, { message: 'El {PATH} debe ser único' });
module.exports = mongoose.model('Proveedor', proveedorSchema);