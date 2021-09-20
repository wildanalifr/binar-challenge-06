var express = require('express')
var router = express.Router()
const { user_game, user_game_biodata, user_game_history } = require('../models')
const { body, validationResult } = require('express-validator')
const bcrypt = require('bcrypt')

// GET all users -> tampilkan halaman dashboard
router.get('/', async (req, res) => {
  const userGame = await user_game.findAll({
    include: [{ model: user_game_biodata, as: 'user_biodata' }],
  })
  res.render('Admin/index', {
    userGame,
    title: 'User-Game',
  })
})

// tampilkan halaman CREATE new user
router.get('/create', async (req, res) => {
  res.render('Admin/create-user', {
    title: 'User-Game',
  })
})

//  tampilkan halaman Detail ID
router.get('/:id', async (req, res) => {
  const userBiodata = await user_game_biodata.findAll({
    include: [{ model: user_game, as: 'user_biodata' }],
    where: {
      id_user_game: req.params.id,
    },
  })
  res.render('Admin/edit-user', {
    title: 'User-Game',
    userBiodata: userBiodata[0],
  })
})

// EDIT User
router.post('/edits', async (req, res) => {
  user_game
    .update(
      {
        username: req.body.username,
        email: req.body.email,
      },
      {
        where: {
          id: req.body.id_user_game,
        },
      }
    )
    .then((result) => {
      user_game_biodata.update(
        {
          nama: req.body.nama,
          alamat: req.body.alamat,
          umur: req.body.umur,
          nomor_telfon: req.body.nomor_telfon,
        },
        {
          where: {
            id_user_game: req.body.id_user_game,
          },
        }
      )
      res.redirect('/admin')
    })
})

// CREATE new user
router.post(
  '/',
  body('username').notEmpty().withMessage('username tidak boleh kosong'),
  body('email').isEmail().withMessage('tidak sesuai format email'),
  body('password').notEmpty().withMessage('password tidak boleh kosong').isLength({ min: 8 }).withMessage('minimal 8 karakter'),
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(201).json({ errors: errors.array() })
      // res.render('Admin/User/edit-user', {
      //   layout: 'Layouts/Admin/main-layout',
      //   title: 'User-Game',
      //   userGame,
      //   errors: errors.array(),
      //   message: '',
      // })
    }

    const data = await user_game.findOne({
      where: { username: req.body.username },
    })

    if (data) {
      return res.status(201).json({ message: 'username sudah ada' })
      // res.redirect('/create', { errors: '', message: 'username sudah ada' })
      // res.render('Admin/User/edit-user', {
      //   layout: 'Layouts/Admin/main-layout',
      //   title: 'User-Game',
      //   userGame,
      //   errors: '',
      //   message: 'username sudah ada',
      // })
    }

    // hashing password
    bcrypt.hash(req.body.password, 10, function (err, hash) {
      // Store hash in your password DB.

      user_game
        .create({
          username: req.body.username,
          password: hash,
          email: req.body.email,
        })
        .then((result) => {
          user_game_biodata.create({
            nama: req.body.nama,
            alamat: req.body.alamat,
            umur: req.body.umur,
            nomor_telfon: req.body.nomor_telfon,
            id_user_game: result.id,
          })
          res.redirect('/admin')
        })
    })
  }
)

// DELETE user
router.get('/delete/:id', async (req, res) => {
  const userBiodata = await user_game_biodata.destroy({
    where: {
      id_user_game: req.params.id,
    },
  })

  const userGame = await user_game.destroy({
    where: {
      id: req.params.id,
    },
  })

  res.redirect('/admin')
})

// GET HISTORY BY ID
router.get('/history/:id', async (req, res) => {
  const userHistory = await user_game_history.findAll({
    include: [{ model: user_game, as: 'user_history' }],
    where: {
      id_user_game: req.params.id,
    },
  })

  res.send(userHistory)

  // res.render('Admin/edit-user', {
  //   title: 'User-Game',
  //   userBiodata: userBiodata[0],
  // })
})

module.exports = router
