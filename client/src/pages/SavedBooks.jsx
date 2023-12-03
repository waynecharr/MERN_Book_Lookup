import { useState, useEffect } from 'react';
import {
  Container,
  Card,
  Button,
  Row,
  Col
} from 'react-bootstrap';

// import { getMe, deleteBook } from '../utils/API';
import Auth from '../utils/auth';
import { removeBookId } from '../utils/localStorage';

import { useQuery } from '@apollo/client';
import { GET_ME } from '../utils/mutations';

import { useMutation } from '@apollo/client';
import { REMOVE_BOOK } from '..utils/queries';

const SavedBooks = () => {
  const { loading, error, data } = useQuery(GET_ME);

  const [removeBookMutation] = useMutation(REMOVE_BOOK);

  const userData = data?.me || {};

  if (loading) {
    return <h2>LOADING...</h2>;
  }

  if (error) {
    console.error(error);
    return <h2>Error loading saved books</h2>;
  }

  const handleDeleteBook = async (bookId) => {
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      return false;
    }

    try {
      const { data } = await removeBookMutation({
        variables: { bookId },
      });

      if (data.removeBook) {
        // If the mutation is successful, refetch the user data
        // This will update the saved books list in the component
        data.removeBook.savedBooks && setUserData(data.removeBook);
        // Remove book's id from localStorage
        removeBookId(bookId);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <div fluid className="text-light bg-dark p-5">
        <Container>
          <h1>Viewing saved books!</h1>
        </Container>
      </div>
      <Container>
        <h2 className='pt-5'>
          {userData.savedBooks.length
            ? `Viewing ${userData.savedBooks.length} saved ${userData.savedBooks.length === 1 ? 'book' : 'books'}:`
            : 'You have no saved books!'}
        </h2>
        <Row>
          {userData.savedBooks.map((book) => {
            return (
              <Col md="4">
                <Card key={book.bookId} border='dark'>
                  {book.image ? <Card.Img src={book.image} alt={`The cover for ${book.title}`} variant='top' /> : null}
                  <Card.Body>
                    <Card.Title>{book.title}</Card.Title>
                    <p className='small'>Authors: {book.authors}</p>
                    <Card.Text>{book.description}</Card.Text>
                    <Button className='btn-block btn-danger' onClick={() => handleDeleteBook(book.bookId)}>
                      Delete this Book!
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>
      </Container>
    </>
  );
};

export default SavedBooks;
