import { gql, useMutation } from '@apollo/client'
import { useState } from 'react'
const ADD_BOOK = gql`
  mutation addNewBook(
    $title: String!
    $author: String!
    $published: Int!
    $genres: [String!]!
  ) {
    addBook(
      title: $title
      author: $author
      published: $published
      genres: $genres
    ) {
      title
      author
      published
      genres
    }
  }
`

const ALL_BOOK = gql`
  query {
    allBooks {
      title
      author
      published
    }
  }
`

const ALL_AUTHORS = gql`
  query {
    allAuthors {
      name
      born
      bookCount
    }
  }
`
const NewBook = (props) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [published, setPublished] = useState('')
  const [genre, setGenre] = useState('')
  const [genres, setGenres] = useState([])
  const [errorMessage, setErrorMessage] = useState(null)

  const [addNewBook] = useMutation(ADD_BOOK, {
    refetchQueries: [{ query: ALL_BOOK }, { query: ALL_AUTHORS }],
    onError: (error) => {
      const messages = error.graphQLErrors[0].message
      setErrorMessage(messages)
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    },
  })

  if (!props.show) {
    return null
  }

  const submit = async (event) => {
    event.preventDefault()

    addNewBook({
      variables: { title, author, published: parseInt(published), genres },
    })

    setTitle('')
    setPublished('')
    setAuthor('')
    setGenres([])
    setGenre('')
  }

  const addGenre = () => {
    setGenres(genres.concat(genre))
    setGenre('')
  }

  if (errorMessage) {
    return <div style={{ color: 'red' }}>{errorMessage}</div>
  }

  return (
    <div>
      <form onSubmit={submit}>
        <div>
          title
          <input
            value={title}
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div>
          author
          <input
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
          />
        </div>
        <div>
          published
          <input
            type='number'
            value={published}
            onChange={({ target }) => setPublished(target.value)}
          />
        </div>
        <div>
          <input
            value={genre}
            onChange={({ target }) => setGenre(target.value)}
          />
          <button onClick={addGenre} type='button'>
            add genre
          </button>
        </div>
        <div>genres: {genres.join(' ')}</div>
        <button type='submit'>create book</button>
      </form>
    </div>
  )
}

export default NewBook
