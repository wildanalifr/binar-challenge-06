var express = require('express')
var router = express.Router()
const { user_game, user_game_biodata, user_game_history } = require('../models')
const { body, validationResult } = require('express-validator')
const bcrypt = require('bcrypt')

// GET all users
router.get('/', async (req, res) => {
  const getUserGame = await user_game.findAll()
  res.render('Admin/User/user-game', {
    layout: 'Layouts/Admin/main-layout',
    getUserGame,
    title: 'User-Game',
  })
})

// Halaman CREATE new user
router.get('/create', async (req, res) => {
  res.render('Admin/User/create-user', {
    layout: 'Layouts/Admin/main-layout',
    title: 'User-Game',
  })
})

// GET Detail ID
router.get('/edit/:id', async (req, res) => {
  const userGame = await user_game.findOne({ where: { id: req.params.id } })
  res.render('Admin/User/edit-user', {
    layout: 'Layouts/Admin/main-layout',
    title: 'User-Game',
    userGame,
  })
})

// EDIT User
router.post('/edits', async (req, res) => {
  // const userGame = await user_game.findOne({ where: { id: req.params.id } })
  user_game
    .update(
      {
        username: req.body.username,
        email: req.body.email,
      },
      {
        where: {
          id: req.body.id,
        },
      }
    )
    .then((result) => {
      res.redirect('/user-gamer')
    })
})

// CREATE new user
router.post(
  '/',
  body('username').notEmpty().withMessage('username tidak boleh kosong'),
  body('email').isEmail().withMessage('tidak sesuai format email'),
  body('password').notEmpty().withMessage('password tidak boleh kosong').isLength({ min: 8 }).withMessage('minimal 8 karakter'),
  // if(req.body.username == null || req.body.username == "" || req.body.username == undefined)
  async (req, res) => {
    // Finds the validation errors in this request and wraps them in an object with handy functions
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const data = await user_game.findOne({
      where: { username: req.body.username },
    })

    if (data) {
      return res.status(400).json({ message: 'username sudah ada' })
    }

    // logika random
    // username + random angka

    // random 3 data
    let suggestRandom = []
    for (let i = 0; i < 3; i++) {
      let randomAngka = Math.floor(Math.random() * 3)
      suggestRandom.push(req.body.username + randomAngka.toString())
    }

    // hashing password
    bcrypt.hash(req.body.password, 10, function (err, hash) {
      // Store hash in your password DB.

      user_game
        .create({
          username: req.body.username,
          password: hash,
          email: req.body.email,
          generate_random: suggestRandom[0],
        })
        .then((result) => {
          res.redirect('/user-gamer')
        })
    })
  }
)

// delete user
router.delete('/:id', async (req, res) => {
  await user_game.destroy({
    where: { id: req.params.id },
  })
})

// test

router.get('/test', async (req, res) => {
  const getUserGame = await user_game.findAll()
  if (getUserGame) {
    res.status(200).json({
      status: 200,
      msg: 'berhasil get all user game',
      data: getUserGame,
    })
  } else {
    res.status(400).json({
      status: 400,
      msg: 'tidak ditemukan data',
    })
  }
})

module.exports = router
