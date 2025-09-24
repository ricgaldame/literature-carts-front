import gql from 'graphql-tag'

const getRoles = gql`
{
  getRoles{
    id
    code
    description
  }
}
`

export {
  getRoles,
}