/* ================================================================================================================================ */
// REQUIRES
/* ================================================================================================================================ */
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const Usuario = require('../models/usuario');

const app = express();

app.post('/login', (req, res) => {

    let body = req.body;

    /* Busco un usuario que tenga el mismo email que el ingresado */
    Usuario.findOne({ email: body.email }, (err, usuarioDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!usuarioDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: '(Usuario) o contraseña incorrectos'
                }
            });
        }

        /* Comparamos las contraseñas */
        if (!bcrypt.compareSync(body.password, usuarioDB.password)) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario o (contraseña) incorrectos'
                }
            });
        }

        /* Generamos el token */
        let token = jwt.sign({
            usuario: usuarioDB //payload
        }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN }); // variables globales definidas en el archivo config

        res.json({
            ok: true,
            usuario: usuarioDB,
            token
        })

    });


});


/* ---------------------------------------------------------------------------------------------------------------------------------- */
module.exports = app;