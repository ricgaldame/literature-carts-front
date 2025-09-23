import gql from 'graphql-tag'

const getUsers = gql`
query getUsers($congregation_code: String){
  getUsers(congregation_code: $congregation_code) { 
    id
    enabled
    email
    names
    first_surname
    second_surname
    congregation {
      id
      code
      name
    } 
    role {
      id
      code
      description
    }
  }
}
`

export {
  getUsers,
}