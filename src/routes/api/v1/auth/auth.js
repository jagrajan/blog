import { Router } from 'express';
import passport from 'passport';

const router = Router();

router.get('/login', (req, res, next) => {
  req.getConnection(function(err, connection) {
    if (err) return next(err);
    
    connection.query('SELECT 1 AS RESULT', [], function(err, results) {
      if (err) return next(err);
      
      results[0].RESULT;
      // -> 1
      
      res.send(200);
    });
    
  });
});

router.post('/signup', (req, res, next) => {
  
});

router.post('/login', (req, res, next) => passport
  .authenticate('local-login', (err, token, userData) => {
    if (err) {
      return res.status(400).json({
        error: err.message,
      });
    }
    return res.json({
      success: true,
      message: 'Authorized',
      token,
      user: userData,
    });
  })(req, res, next));


export default router;
