let mongoose = require('mongoose'); //para trabajar con mongoose
//utilizando  el pluging intalado npm install --save mongoose-unique-validator
let uniqueValidator = require('mongoose-unique-validator');
// para trabajar con Schema
let Schema = mongoose.Schema;
/**
 * para controlar los tipo de cliente, creamos un objeto
 * con los unicos tipos aceptables, Si no esta 
 * en la lista mandamos un mesaje de error
 */
let tipoCliente = {
    values: ['Minorista', 'Mayorista'],
    message: '{VALUE} no es un tipo de cliente permitido'
}
// Definiendo el usuario schema (nombre de la coleccion en singular seguido de schema)
/** new Schema() funcion que recibe un objeto de javascript 
 * con la configuracion de lo que vamos aguardar en el schema,
 * menos el id, el id es autamatico
 * required: [true, 'mensaje']
*/
let clienteSchema = new Schema({
    nombre: { type: String, required: [true, 'El nombre es necesario'] },
    telefono: { type: Number, unique: true, required: [true, 'El telefono es necesario'] },
    referencia: { type: String, required: false },
    tipo: { type: String, required: true, default: 'Minorista', enum: tipoCliente }
}, { collection: 'clientes' });
/** 
 * exportando el archivo para poder utilizar el schema, de este archivo
 * mongoose.model('Nombre como se utilizara por fuera',nombre del schema);
*/
clienteSchema.plugin(uniqueValidator, { message: 'El {PATH} debe ser único' });
module.exports = mongoose.model('Cliente', clienteSchema);