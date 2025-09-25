import gql from 'graphql-tag'

const addRole = gql`
mutation(
  $code: String!, 
  $description: String!
) { 
  addRole(
    code: $code, 
    description: $description
  ) {
    id
    code
    description
  }
}
`

export {
  addRole,
}