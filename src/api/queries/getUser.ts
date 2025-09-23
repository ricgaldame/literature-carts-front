import gql from 'graphql-tag'

const getUser = gql`
query getUser($email: String!) {
  getUser(email: $email) {
    id
    names
    first_surname
    second_surname
    email
    signup
    enabled
    role { 
      id 
      code 
    } 
    congregation {
      id
      name
      code
    } 
  } 
}
`

export {
  getUser,
}