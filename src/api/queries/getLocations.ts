import gql from 'graphql-tag'

const getLocations = gql`
query getLocations($congregation_code: String){
  getLocations(congregation_code: $congregation_code) {
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
  getLocations,
}