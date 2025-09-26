import gql from 'graphql-tag'

const addLocation = gql`
mutation(
  $name: String!,
  $reference: String!,
  $congregation_code: String!
) {
  addLocation(
    name: $name,
    reference: $reference,
    congregation_code: $congregation_code
  ) {
    id
    name
    reference
    congregation {
      id
      code
      name
    }
  }
}
`

export {
  addLocation,
}