let mongoose = require('mongoose'); //para trabajar con mongoose

let uniqueValidator = require('mongoose-unique-validator'); //utilizando  el pluging intalado npm install --save mongoose-unique-validator

/** para trabajar con Schema */
let Schema = mongoose.Schema;

// Definiendo el schema (nombre de la coleccion en singular seguido de schema)
/** new Schema() funcion que recibe un objeto de javascript 
 * con la configuracion de lo que vamos aguardar en el schema,
 * menos el id, el id es autamatico
 * required: [true, 'mensaje']
*/
let cuentaSchema = new Schema({
    
    date: { 
        type: Date, 
        default: Date.now // por defecto la fecha actual
    }, 
    
    cliente: { 
        type: Schema.Types.ObjectId, 
        ref: 'Cliente', // referenciamos al modelo cliente
        required: [true, 'El cliente es un campo obligatorio'] 
    },

    detalle:[{
        zapato: { 
            type: Schema.Types.ObjectId, 
            ref: 'Zapato', 
            required: [true, 'El Zapato es un campo obligatorio'] 
        },
        cantidad: { 
            type: Number, 
            required: [true, 'La cantidad de compra es necesaria'] 
        },
        // precio: { type: Number, required: [true, 'El precio es necesario'] }
    }],
    // numero de pagos ventas credito
    abonos:[{
        date: {
            type: Date,
            default: Date.now // por defecto la fecha actual
        }, 
        // valor: { type: Number, required: [true, 'El precio es necesario'] }
        abono: { 
            type: Number, 
            default: 0, 
            required: [true, 'El valor del abono es necesario']
        }
    }],

    valorTotal: { 
        type: Number, 
        required: [true, 'El total es necesario'] 
    },
    
}, { collection: 'cuentas' });
/** 
 * exportando el archivo para poder utilizar el schema, de este archivo
 * mongoose.model('Nombre como se utilizara por fuera',nombre del schema);
*/
cuentaSchema.plugin(uniqueValidator, { message: 'El {PATH} debe ser único' });
module.exports = mongoose.model('Cuenta', cuentaSchema);