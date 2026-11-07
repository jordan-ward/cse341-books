import { getDb } from '../db/connect.js';

const getAllBooks = async () => {
  const db = getDb();
  const collection = db.collection('books');
  return await collection.find({}).toArray();
};

const getBookById = async (id) => {
  const db = getDb();
  const collection = db.collection('books');
  return await collection.findOne({ id });
};

const createBook = async (book) => {
  const db = getDb();
  const collection = db.collection('books');
  await collection.insertOne(book);
  return book;
};

const updateBook = async (id, bookData) => {
  const db = getDb();
  const collection = db.collection('books');
  await collection.updateOne({ id }, { $set: bookData });
  return { id, ...bookData };
};

const deleteBook = async (id) => {
  const db = getDb();
  const collection = db.collection('books');
  return await collection.deleteOne({ id });
};

// Helper to check if an author exists before creating/updating a book
const authorExists = async (authorId) => {
  const db = getDb();
  const collection = db.collection('authors');
  const author = await collection.findOne({ id: authorId });
  return !!author; 
};

export { 
  getAllBooks, 
  getBookById, 
  createBook, 
  updateBook, 
  deleteBook, 
  authorExists 
};