const express = require('express');

const auth = require('../middleware/auth');
const multer = require('../middleware/multer_config');

const router = express.Router();
const Book = require('../models/books')


router.post('/', auth, multer, (req, res) => {
  console.log('BODY REÇU :', req.body);
  const bookObject = JSON.parse(req.body.book); // car req.body.book est une string JSON

  delete bookObject._id;

  const imageUrl = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`;

  const book = new Book({
    ...bookObject,
    imageUrl
  });

  book.save()
    .then(() => res.status(201).json({ message: 'book enregistré !'}))
    .catch(error => res.status(400).json({ error }
        
    ));
});


router.get('/', (req, res,) => {
  Book.find()
    .then(books => res.status(200).json(books))
    .catch(error => res.status(400).json({ error }));
});



router.get('/:id', (req, res) => {
  Book.findOne({ _id: req.params.id })
    .then(books => res.status(200).json(books))
    .catch(error => res.status(404).json({ error }));
});

router.put('/:id', (req, res) => {
  Book.updateOne({ _id: req.params.id }, { ...req.body, _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Book modifié !'}))
    .catch(error => res.status(400).json({ error }));
});

router.put('/:id/rating', (req, res) => {
  Book.updateOne({ _id: req.params.id },  
    { $push: { ratings: req.body }, _id: req.params.id }
 )
    .then(() => res.status(200).json({ message: 'Book modifié !'}))
    .catch(error => res.status(400).json({ error }));
});

router.delete('/:id', (req, res) => {
  Book.deleteOne({ _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Book supprimé !'}))
    .catch(error => res.status(400).json({ error }));
});


module.exports = router;