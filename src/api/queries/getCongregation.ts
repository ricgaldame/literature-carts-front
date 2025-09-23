import gql from 'graphql-tag'

const getCongregation = gql`
query getCongregation($code: String!) {
  getCongregation(code: $code) {
    id
    name
    code
  }  
}
`

export {
  getCongregation,
}