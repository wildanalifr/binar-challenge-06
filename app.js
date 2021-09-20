var createError = require('http-errors')
var express = require('express')
var path = require('path')
var cookieParser = require('cookie-parser')
var logger = require('morgan')

var app = express()

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

//middleware check isLogin atau belum
app.use((req, res, next) => {
  if (req.path) {
    next()
  } else if (req.path === '/user') {
    if (req.query.isLogin == 'true') {
      next()
    } else {
      res.redirect('/login')
    }
  } else if (req.path == '/admin') {
    if (req.query.isLogin == 'true') {
      next()
    } else {
      res.redirect('/login')
    }
  } else if (req.path == '/logout') {
    res.redirect('/')
  } else {
    next(createError(404))
  }
})

var indexRouter = require('./routes/index')
var authRouter = require('./routes/auth')
var adminRouter = require('./routes/admin')
var userRouter = require('./routes/user')

app.use('/', indexRouter)
app.use('/', authRouter)
//admin
app.use('/admin', adminRouter)

//user
app.use('/user', userRouter)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404))
})

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

module.exports = app
