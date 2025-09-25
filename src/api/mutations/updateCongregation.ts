import gql from 'graphql-tag'

const updateCongregation = gql`
mutation(
  $id: Int!,
  $code: String, 
  $name: String
) {
  updateCongregation(
    id: $id,
    code: $code, 
    name: $name
  ) {
    id
    name
    code
  }
}
`

export {
  updateCongregation,
}