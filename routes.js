/* eslint-disable max-len */
const { nanoid } = require('nanoid');

const books = [];

const routes = [
  {
    method: 'POST',
    path: '/books',
    handler: (request, h) => {
      const {
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        reading,
      } = request.payload;

      if (!name) {
        return h
          .response({
            status: 'fail',
            message: 'Gagal menambahkan buku. Mohon isi nama buku',
          })
          .code(400);
      }

      if (readPage > pageCount) {
        return h
          .response({
            status: 'fail',
            message:
              'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
          })
          .code(400);
      }

      const id = nanoid();
      const finished = pageCount === readPage;
      const insertedAt = new Date().toISOString();
      const updatedAt = insertedAt;

      const newBook = {
        id,
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        finished,
        reading,
        insertedAt,
        updatedAt,
      };

      books.push(newBook);

      return h
        .response({
          status: 'success',
          message: 'Buku berhasil ditambahkan',
          data: {
            bookId: id,
          },
        })
        .code(201);
    },
  },

  {
    method: 'GET',
    path: '/books',
    handler: (request, h) => {
      const { name, reading, finished } = request.query;

      let filteredBooks = [...books];

      if (name) {
        const searchKeyword = name.toLowerCase();
        filteredBooks = filteredBooks.filter((book) => book.name.toLowerCase().includes(searchKeyword));
      }

      if (reading !== undefined) {
        const isReading = reading === '1';
        filteredBooks = filteredBooks.filter(
          (book) => book.reading === isReading,
        );
      }

      if (finished !== undefined) {
        const isFinished = finished === '1';
        filteredBooks = filteredBooks.filter(
          (book) => book.finished === isFinished,
        );
      }

      return h.response({
        status: 'success',
        data: {
          // eslint-disable-next-line no-shadow
          books: filteredBooks.map(({ id, name, publisher }) => ({
            id,
            name,
            publisher,
          })),
        },
      });
    },
  },

  {
    method: 'GET',
    path: '/books/{bookId}',
    handler: (request, h) => {
      const { bookId } = request.params;
      const book = books.find((b) => b.id === bookId);

      if (!book) {
        return h
          .response({
            status: 'fail',
            message: 'Buku tidak ditemukan',
          })
          .code(404);
      }

      return h.response({
        status: 'success',
        data: {
          book,
        },
      });
    },
  },

  {
    method: 'PUT',
    path: '/books/{bookId}',
    handler: (request, h) => {
      const { bookId } = request.params;
      const {
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        reading,
      } = request.payload;

      const bookIndex = books.findIndex((b) => b.id === bookId);

      if (bookIndex === -1) {
        return h
          .response({
            status: 'fail',
            message: 'Gagal memperbarui buku. Id tidak ditemukan',
          })
          .code(404);
      }

      if (!name) {
        return h
          .response({
            status: 'fail',
            message: 'Gagal memperbarui buku. Mohon isi nama buku',
          })
          .code(400);
      }

      if (readPage > pageCount) {
        return h
          .response({
            status: 'fail',
            message:
              'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
          })
          .code(400);
      }

      books[bookIndex] = {
        ...books[bookIndex],
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        reading,
        updatedAt: new Date().toISOString(),
      };

      return h.response({
        status: 'success',
        message: 'Buku berhasil diperbarui',
      });
    },
  },

  {
    method: 'DELETE',
    path: '/books/{bookId}',
    handler: (request, h) => {
      const { bookId } = request.params;
      const bookIndex = books.findIndex((b) => b.id === bookId);

      if (bookIndex === -1) {
        return h
          .response({
            status: 'fail',
            message: 'Buku gagal dihapus. Id tidak ditemukan',
          })
          .code(404);
      }

      books.splice(bookIndex, 1);

      return h.response({
        status: 'success',
        message: 'Buku berhasil dihapus',
      });
    },
  },
];

module.exports = routes;
