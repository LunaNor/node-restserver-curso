const jwt = require('jsonwebtoken');

/* ================================================================================================================================ */
// Verificar Token
/* ================================================================================================================================ */

let verificaToken = (req, res, next) => {

    let token = req.get('token'); // para extraer el token de los headers

    jwt.verify(token, process.env.SEED, (err, decoded) => {

        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Token no válido'
                }
            })
        }

        /* le asigno a la request el usuario decodificado del token
        sirve para saber que usuario hizo la peticion, le agrega esto a la request */
        req.usuario = decoded.usuario;

        next();

    });





};


verificaAdmin_Role = (req, res, next) => {

    let usuario = req.usuario;

    if (usuario.role !== 'ADMIN_ROLE') {

        return res.status(401).json({
            ok: false,
            err: {
                message: 'El usuario no es administrador'
            }
        })
    }

    next();


};

module.exports = {
    verificaToken,
    verificaAdmin_Role
}