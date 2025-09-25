import gql from 'graphql-tag'

const updateRole = gql`
mutation(
  $id: Int!,
  $code: String, 
  $description: String
) {
  updateRole(
    id: $id,
    code: $code, 
    description: $description
  ) {
    id
    description
    code
  }
}
`

export {
  updateRole,
}