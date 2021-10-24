module.exports = function(app, passport, db) {
  //app is express dependency in server js, passport is dependecny in server js, db is database that is connected from server js

// normal routes ===============================================================

    // show the home page (will also have our login links)
    //renders the index.ejs file
    app.get('/', function(req, res) {
        res.render('index.ejs');
    });

    app.get('/boot', function(req, res) {
      res.render('boot.ejs');
  });

    // PROFILE SECTION =========================
    //renders the profile.ejs if /profile is requested
    //finding database collection and returns as array
    app.get('/profile', isLoggedIn, function(req, res) {
        db.collection('messages').find().toArray((err, result) => {
          if (err) return console.log(err)
          res.render('profile.ejs', {
            user : req.user,
            messages: result
          })
        })
    });

    // LOGOUT ==============================
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

// message board routes ===============================================================

  

    app.post("/messages", (req, res) => {
      console.log(req.body);
      db.collection('messages')
        .insertOne(req.body)
        .then((result) => {
          console.log(result);
          res.redirect("/profile");
        })
        .catch((error) => console.error(error));
    });

    app.put("/messages", (req, res) => {
      console.log(req.body);
      db.collection('messages')
        .findOneAndUpdate(
          { _id: new ObjectID(req.body._id) },
          {
            $set: {
              name: req.body.name,
              quote: req.body.quote,
            },
          },
          {
            upsert: false,
          }
        )
        .then((result) => {
          console.log(result);
          res.status(200).send('OK')
        })
        .catch((error) => console.error(error));
    });


    app.put('/completed', (req, res) => {
      db.collection('messages')
      .findOneAndUpdate({date: req.body.date, task: req.body.task}, {
        $set: {
          date : req.body.filter,
          task : req.body.filter1

        }
      }, {
        sort: {_id: -1},
        upsert: false
      }, (err, result) => {
        if (err) return res.send(err)
        res.send(result)
      })
    })

    // app.put('/thumbDown', (req, res) => {
    //   db.collection('messages')
    //   .findOneAndUpdate({name: req.body.name, msg: req.body.msg}, {
    //     $set: {
    //       thumbUp: req.body.thumbUp - 1 
    //     }
    //   }, {
    //     sort: {_id: -1},
    //     upsert: true
    //   }, (err, result) => {
    //     if (err) return res.send(err)
    //     res.send(result)
    //   })
    // })

    app.delete('/messages', (req, res) => {
      db.collection('messages').findOneAndDelete({name: req.body.name, msg: req.body.msg}, (err, result) => {
        if (err) return res.send(500, err)
        res.send('Message deleted!')
      })
    })

    app.delete('/filter', (req, res) => {
      db.collection('messages').remove({}, (err, result) => {
        if (err) return res.send(500, err)
        res.send('Message deleted!')
      })
    })
    
    app.delete('/filter1', (req, res) => {
      db.collection('messages').remove({name:req.body.name}, (err, result) => {
        if (err) return res.send(500, err)
        res.send('Message deleted!')
      })
    })



// =============================================================================
// AUTHENTICATE (FIRST LOGIN) ==================================================
// =============================================================================

    // locally --------------------------------
        // LOGIN ===============================
        // show the login form
        app.get('/login', function(req, res) {
            res.render('login.ejs', { message: req.flash('loginMessage') });
        });

        // process the login form
        app.post('/login', passport.authenticate('local-login', {
            successRedirect : '/profile', // redirect to the secure profile section
            failureRedirect : '/login', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));

        // SIGNUP =================================
        // show the signup form
        app.get('/signup', function(req, res) {
            res.render('signup.ejs', { message: req.flash('signupMessage') });
        });

        // process the signup form
        app.post('/signup', passport.authenticate('local-signup', {
            successRedirect : '/profile', // redirect to the secure profile section
            failureRedirect : '/signup', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));

// =============================================================================
// UNLINK ACCOUNTS =============================================================
// =============================================================================
// used to unlink accounts. for social accounts, just remove the token
// for local account, remove email and password
// user account will stay active in case they want to reconnect in the future

    // local -----------------------------------
    app.get('/unlink/local', isLoggedIn, function(req, res) {
        var user            = req.user;
        user.local.email    = undefined;
        user.local.password = undefined;
        user.save(function(err) {
            res.redirect('/profile');
        });
    });

};

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();
    res.redirect('/');
}
