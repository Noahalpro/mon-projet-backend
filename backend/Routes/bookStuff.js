const express = require('express');
const auth = require('../middleware/auth');
const multer = require('../middleware/multerConfig');
const router = express.Router();
const bookCtrl = require('../controllers/Book');

router.post('/', auth, multer, bookCtrl.post);
router.get('/', bookCtrl.get);
router.get('/bestrating', bookCtrl.getBest);
router.delete('/:id', auth, bookCtrl.delete);
router.get('/:id', bookCtrl.getid);
router.put('/:id', auth, bookCtrl.put);
router.post('/:id/rating', auth, bookCtrl.ratingpost);


module.exports = router;