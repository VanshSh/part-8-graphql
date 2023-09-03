import { gql, useMutation, useQuery } from '@apollo/client'
import { useEffect, useState } from 'react'

const ALL_AUTHORS = gql`
  query {
    allAuthors {
      name
      born
      bookCount
    }
  }
`
const EDIT_AUTHOR = gql`
  mutation editAuthorDOB($name: String!, $setBornTo: Int!) {
    editAuthor(name: $name, setBornTo: $setBornTo) {
      name
      born
    }
  }
`
const Authors = (props) => {
  const [authorName, setAuthorName] = useState('')
  const [authorDOB, setAuthorDOB] = useState('')
  const [errorMessage, setErrorMessage] = useState(null)

  const authorData = useQuery(ALL_AUTHORS)
  const [editAuthorDOB, result] = useMutation(EDIT_AUTHOR, {
    refetchQueries: [{ query: ALL_AUTHORS }],
  })

  useEffect(() => {
    if (result.data && !result.data.editAuthor) {
      setErrorMessage('author not found')
      setTimeout(() => {
        setErrorMessage(null)
      }, 2000)
    }
  }, [result.data]) // eslint-disable-line

  if (!props.show) {
    return null
  }
  if (authorData.loading) {
    return <div>Loading ....</div>
  }
  const updateAuthorDOB = async (event) => {
    event.preventDefault()

    editAuthorDOB({
      variables: { name: authorName, setBornTo: parseInt(authorDOB) },
    })

    setAuthorDOB('')
    setAuthorName('Select name')
  }

  const authors = authorData.data?.allAuthors ?? []
  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
          </tr>
          {authors.map((a, index) => (
            <tr key={index}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Set birth year</h2>
      {errorMessage && <div style={{ color: 'red' }}>{errorMessage}</div>}
      <form onSubmit={updateAuthorDOB}>
        <div>
          name
          <select
            name=''
            value={authorName}
            onChange={({ target }) => setAuthorName(target.value)}
          >
            <option key='empty' defaultValue='Select name'>
              Select name
            </option>
            {authors.map(({ name, index }) => {
              return (
                <option key={name} value={name}>
                  {name}
                </option>
              )
            })}
          </select>
        </div>
        <div>
          born
          <input
            value={authorDOB}
            onChange={({ target }) => setAuthorDOB(target.value)}
          />
        </div>
        <button type='submit'>update author</button>
      </form>
    </div>
  )
}

export default Authors
