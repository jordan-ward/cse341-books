import {
  getAllBooks as getAllBooksFromDb,
  getBookById as getBookByIdFromDb,
  createBook as createBookFromDb,
  updateBook as updateBookFromDb,
  deleteBook as deleteBookFromDb,
  authorExists
} from '../models/books.js';

const getBooksHandler = async (req, res) => {
  try {
    const books = await getAllBooksFromDb();
    return res.status(200).json(books);
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const getBookByIdHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const book = await getBookByIdFromDb(id);

    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    return res.status(200).json(book);
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const createBookHandler = async (req, res) => {
  try {
    const { id, authorId, title, publicationDate } = req.body;

    if (!id || !authorId || !title || !publicationDate) {
      return res.status(400).json({ message: 'Missing required book fields.' });
    }

    const existingBook = await getBookByIdFromDb(id);
    if (existingBook) {
      return res.status(400).json({ message: 'Book id already exists.' });
    }

    const isValidAuthor = await authorExists(authorId);
    if (!isValidAuthor) {
      return res.status(400).json({ message: 'Author does not exist.' });
    }

    const newBook = await createBookFromDb({ id, authorId, title, publicationDate });
    return res.status(201).json(newBook);
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const updateBookHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const { authorId, title, publicationDate } = req.body;

    if (!authorId || !title || !publicationDate) {
      return res.status(400).json({ message: 'Missing required book fields.' });
    }

    const existingBook = await getBookByIdFromDb(id);
    if (!existingBook) {
      return res.status(404).json({ message: 'Book not found' });
    }

    const isValidAuthor = await authorExists(authorId);
    if (!isValidAuthor) {
      return res.status(400).json({ message: 'Author does not exist.' });
    }

    const updatedBook = await updateBookFromDb(id, { authorId, title, publicationDate });
    return res.status(200).json(updatedBook);
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const deleteBookHandler = async (req, res) => {
  try {
    const { id } = req.params;

    const existingBook = await getBookByIdFromDb(id);
    if (!existingBook) {
      return res.status(404).json({ message: 'Book not found' });
    }

    await deleteBookFromDb(id);
    return res.status(204).send();
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export {
  getBooksHandler,
  getBookByIdHandler,
  createBookHandler,
  updateBookHandler,
  deleteBookHandler
};