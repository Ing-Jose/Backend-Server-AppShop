let express = require('express');
//despues de instalar la libreria 
const fileUpload = require('express-fileupload');
let fs = require('fs'); // para borrar 

//Importando los modelos 
let Zapato = require('../models/zapato');
let Proveedor = require('../models/proveedor');
let Usuario = require('../models/usuario');


let app = express();
app.use(fileUpload());//middleware
//Rutas
app.put('/:tipo/:id', (req, res, next) => {

    // los recib por el url y los asigno a variables
    let tipo = req.params.tipo;
    let id = req.params.id;

    // tipos validos de coleciones
    let tipoValidos = ['zapatos', 'proveedores', 'usuarios'];
    
    if (tipoValidos.indexOf(tipo) < 0) { // paso un tipo no valido
        return res.status(400).json({
            ok: false,
            mensaje: 'Tipo de colección no es válida',
            errors: { message: 'Tipo de colección no es válida' }
        });
    }

    if (!req.files) { // si no viene archivo en el req
        return res.status(400).json({
            ok: false,
            mensaje: 'No selecciono nada',
            errors: { message: 'Debe seleccionar una imagen' }
        });
    }
    // validando que el echivo sea una imagen
    let archivo = req.files.imagen;
    let nombreCortado = archivo.name.split('.');//para tomar la extencion del archivo .jpg .jpge etc
    let extensionArchivo = nombreCortado[ nombreCortado.length - 1 ];

    // solo estas extenciones aceptamos
    let extensionesValidadas = ['png', 'jpg', 'gif', 'jpeg'];

    if (extensionesValidadas.indexOf(extensionArchivo) < 0) { //si retorna -1 no encontro la extencion en el arreglo
        return res.status(400).json({
            ok: false,
            mensaje: 'Extension no válida',
            errors: { message: 'Las extensiones validadas son ' + extensionesValidadas.join(', ') }
        });
    }

    // creando un nombre personalizado (ID del usuario - numero aleatorio) 123432-124.png
    let nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extensionArchivo}`;

    // mover el archivo
    let path = `./uploads/${tipo}/${nombreArchivo}`;
    archivo.mv( path, err => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al mover archivo',
                errors: err
            });
        }

        subiPorTipo(tipo, id, nombreArchivo, res)


    });

});


/**
 * funcion que nos permite saber de acuerdo
 * el tipo en la db a quien se le debe subir
 */
function subiPorTipo(tipo, id, nombreArchivo, res) {
    // validacion para usuario
    switch (tipo) {
        case 'usuarios':
            Usuario.findById(id, (err, usuario) => {
                // en caso que id no exista
                if (!usuario) {
                    return res.status(400).json({
                        ok: false,
                        mensaje: 'Usiario no existe',
                        errors: { message: 'TUsiario no existe' }
                    });
                }
                // tomando el path viejo en caso que lo tenga
                let pathViejo = './uploads/usuarios/' + usuario.img;
                // si existe el pathViejo lo elimina 
                if (fs.existsSync(pathViejo)) {
                    fs.unlink(pathViejo);
                }
                usuario.img = nombreArchivo;
                // guardando
                usuario.save((err, usuarioactualizado) => {
                    usuarioactualizado.password = ':)'
                    return res.status(200).json({
                        ok: true,
                        mensaje: 'Imagen de usuario actualizada',
                        usuarioactualizado: usuarioactualizado
                    });
                });

            });
            break;
        case 'zapatos':
            Zapato.findById(id, (err, zapato) => {
                // en caso que id no exista
                if (!zapato) {
                    return res.status(400).json({
                        ok: false,
                        mensaje: 'Zapato no existe',
                        errors: { message: 'zapato no existe' }
                    });
                }
                // tomando el path viejo en caso que lo tenga
                let pathViejo = './uploads/zapatos/' + zapato.img;
                // si existe el pathViejo lo elimina 
                if (fs.existsSync(pathViejo)) {
                    fs.unlink(pathViejo);
                }
                zapato.img = nombreArchivo;
                // guardando
                zapato.save((err, zapatoActualizado) => {

                    return res.status(200).json({
                        ok: true,
                        mensaje: 'Imagen de zapato actualizada',
                        zapatoActualizado: zapatoActualizado
                    });
                });

            });
            break;
        case 'proveedores':
            Proveedor.findById(id, (err, proveedor) => {
                // en caso que id no exista
                if (!proveedor) {
                    return res.status(400).json({
                        ok: false,
                        mensaje: 'Proveedor no existe',
                        errors: { message: 'Proveedor no existe' }
                    });
                }
                // tomando el path viejo en caso que lo tenga
                let pathViejo = './uploads/proveedores/' + proveedor.img;
                // si existe el pathViejo lo elimina 
                if (fs.existsSync(pathViejo)) {
                    fs.unlink(pathViejo);
                }
                proveedor.img = nombreArchivo;
                // guardando
                proveedor.save((err, proveedorActualizado) => {

                    return res.status(200).json({
                        ok: true,
                        mensaje: 'Imagen de proveedor actualizada',
                        proveedorActualizado: proveedorActualizado
                    });
                });

            });
            break;

        default:
            return res.status(400).json({
                ok: false,
                mensaje: 'Los tipos para aculizar imagen sólo son usuarios, zapatos y proveedores',
                errors: { message: 'Tipo de tabla/coleccion no válido' }
            });
    }
}
// exportando todo el app
module.exports = app;