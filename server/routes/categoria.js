/* ================================================================================================================================ */
// REQUIRES
/* ================================================================================================================================ */
const express = require('express');
const Categoria = require('../models/categoria');

let app = express();

/* ================================================================================================================================ */
// MIDDLEWARES PERSONALIZADOS
/* ================================================================================================================================ */
let { verificaToken, verificaAdmin_Role } = require('../middlewares/autenticacion');


/* ================================================================================================================================ */
// OBTENER TODAS LAS CATEGORÍAS
/* ================================================================================================================================ */
app.get('/categoria', verificaToken, (req, res) => {

    Categoria.find({})
        .sort('descripcion')
        .populate('usuario', 'nombre email')
        .exec((err, categorias) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            Categoria.countDocuments((err, conteo) => {
                res.json({
                    ok: true,
                    categorias,
                    cuantos: conteo
                });
            })

        });

});

/* ================================================================================================================================ */
// MOSTRAR UNA CATEGORÍA POR ID
/* ================================================================================================================================ */
app.get('/categoria/:id', (req, res) => {

    let id = req.params.id;

    Categoria.findById(id, (err, categoriaDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!categoriaDB) {
            return res.status(500).json({
                ok: false,
                err: {
                    message: 'El ID no es correcto'
                }
            })
        }

        res.json({
            ok: true,
            categoriaDB
        });


    })

});

/* ================================================================================================================================ */
// CREAR UNA CATEGORIA
/* ================================================================================================================================ */
app.post('/categoria', verificaToken, (req, res) => {

    //extraemos los datos enviados en la request
    let body = req.body;

    //creamos la nueva categoria con mongooose
    let nuevaCategoria = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario._id // obtenemos el id, ya que en el middleware creamos esta propiedad "usuario" que viene del payload del token
    });

    //guardamos la categoria
    nuevaCategoria.save((err, categoriaDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        })

    });


});

/* ================================================================================================================================ */
// ACTUALIZAR UNA CATEGORIA
/* ================================================================================================================================ */
app.put('/categoria/:id', verificaToken, (req, res) => {

    let body = req.body;

    let id = req.params.id;

    Categoria.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, categoriaActualizada) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categoriaActualizada
        })


    });



});

/* ================================================================================================================================ */
// ELIMINAR UNA CATEGORIA
/* ================================================================================================================================ */
app.delete('/categoria/:id', [verificaToken, verificaAdmin_Role], (req, res) => {

    let id = req.params.id;


    Categoria.findOneAndRemove(id, { runValidators: true }, (err, categoriaEliminada) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!categoriaEliminada) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El id no existe'
                }
            });
        }

        res.json({
            ok: true,
            categoriaEliminada,
            message: 'Categoria borrada'
        });


    });




});


module.exports = app;