import gql from 'graphql-tag'

const addCongregation = gql`
mutation(
  $code: String!, 
  $name: String!
) { 
  addCongregation(
    code: $code, 
    name: $name
  ) {
    id
    code
    name
  }
}
`

export {
  addCongregation,
}