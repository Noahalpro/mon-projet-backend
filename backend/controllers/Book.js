const Book = require('../models/books')

exports.post = (req, res, next) => {  
  const bookObject = JSON.parse(req.body.book);
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
};

exports.get = (req, res, next) => {
      Book.find()
        .then(books => res.status(200).json(books))
        .catch(error => res.status(400).json({ error }));
}

exports.getBest = (req, res, next) => {
    
      Book.find()
        .then(books => {
          const sorted = books.sort((a, b) => b.averageRating - a.averageRating);
          const top3 = sorted.slice(0, 3);
          res.status(200).json(top3);
        })
        .catch(error => res.status(400).json({ error }));
}

exports.delete = (req, res, next) => {
      Book.deleteOne({ _id: req.params.id })
        .then(() => res.status(200).json({ message: 'Objet supprimé !'}))
        .catch(error => res.status(400).json({ error }));
}

exports.getid = (req, res, next) => {
      Book.findOne({ _id: req.params.id })
        .then(books => res.status(200).json(books))
        .catch(error => res.status(404).json({ error }));
}

exports.put = (req, res, next) => {
      Book.updateOne({ _id: req.params.id }, { ...req.body, _id: req.params.id })
        .then(() => res.status(200).json({ message: 'Book modifié !'}))
        .catch(error => res.status(400).json({ error }));
}

exports.ratingpost = async (req, res, next) => {
      try {
        const { userId, rating } = req.body;
        const bookId = req.params.id;
        const book = await Book.findOne({ _id: bookId });
        if (!book) return res.status(404).json({ message: 'Livre non trouvé' });
    
        book.ratings.push({ userId, grade: rating });
        const total = book.ratings.reduce((acc, curr) => acc + curr.grade, 0);
        book.averageRating = total / book.ratings.length;
    
        await book.save();
        res.status(200).json(book);
      } catch (error) {
        res.status(400).json({ error: error.message });
      }
}
