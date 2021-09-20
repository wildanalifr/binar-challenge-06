var express = require('express')
var router = express.Router()
const { user_game, user_game_biodata, user_game_history } = require('../models')
const { body, validationResult } = require('express-validator')
const bcrypt = require('bcrypt')

router.get('/login', (req, res) => {
  res.render('Auth/login', {
    title: 'Login',
  })
})

router.get('/register', (req, res) => {
  res.render('Auth/register', {
    title: 'Register',
  })
})

router.post('/login', async (req, res) => {
  let email = req.body.email
  let password = req.body.password

  const data = await user_game.findOne({
    where: { email: email },
  })

  bcrypt.compare(password, data.password, function (err, isMatch) {
    //password benar
    if (isMatch) {
      if (data.email != email) {
        res.send('password dan email salah')
      } else if (data.email == 'admin@gmail.com') {
        res.redirect('/admin?isLogin=true')
      } else {
        res.redirect('/user?isLogin=true')
      }
    } else if (!isMatch) {
      if (data.email != email) {
        res.send('akun tidak ditemukan, silahkan register!')
      } else {
        res.send('password dan email salah')
      }
    } else {
      res.send('akun tidak ditemukan, silahkan register!')
    }
  })
})

router.post(
  '/register',
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
          res.redirect('/login')
        })
    })
  }
)

module.exports = router
