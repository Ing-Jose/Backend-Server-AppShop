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
var zapatoSchema = new Schema({
    modelo: { type: String, required: [true, 'El modelo es necesario'] },
    ref: { type: String, required: [true, 'La referencia es necesaria'] },
    valorCompra: { type: Number, required: [true, 'El valor de compra es necesario'] },
    valorVenta: { type: Number, required: [true, 'El valor de venta es necesario'] },
    img: { type: String, required: false },
    proveedor: { type: Schema.Types.ObjectId, ref: 'Proveedor', required: [true, 'El proveedor es un campo obligatorio']  },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario', required: true}
}, { collection: 'zapatos' });
/** 
 * exportando el archivo para poder utilizar el schema, de este archivo
 * mongoose.model('Nombre como se utilizara por fuera',nombre del schema);
*/
// usuarioSchema.plugin(uniqueValidator, { message: 'El {PATH} debe ser único' });
module.exports = mongoose.model('Zapato', zapatoSchema);