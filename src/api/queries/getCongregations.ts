import gql from 'graphql-tag'

const getCongregations = gql`
{ 
  getCongregations { 
    id 
    code 
    name 
  } 
}
`

export {
  getCongregations,
}