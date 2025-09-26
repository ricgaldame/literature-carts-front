import gql from 'graphql-tag'

const updateLocation = gql`
mutation(
  $id: Int!,
  $name: String,
  $reference: String,
  $congregation_code: String
) {
  updateLocation(
    id: $id,
    name: $name,
    reference:
    $reference,
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
  updateLocation,
}