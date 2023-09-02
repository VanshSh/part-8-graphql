import { gql, useQuery } from '@apollo/client'

const All_Authors = gql`
  query {
    allAuthors {
      name
      born
      bookCount
    }
  }
`
const Authors = (props) => {
  const result = useQuery(All_Authors)

  if (result.loading) {
    return <div>Loading ....</div>
  }

  if (!props.show) {
    return null
  }

  const authors = result.data?.allAuthors ?? []
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
    </div>
  )
}

export default Authors
