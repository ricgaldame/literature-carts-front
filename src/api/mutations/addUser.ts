import gql from 'graphql-tag'

const addUser = gql`
mutation(
  $names: String!, 
  $first_surname: String!, 
  $second_surname: String, 
  $role_code: String!, 
  $congregation_code: String!, 
  $email: String!
){ 
  addUser(
    names: $names, 
    first_surname: $first_surname, 
    second_surname: $second_surname, 
    role_code: $role_code, 
    congregation_code: $congregation_code, 
    email: $email
  ) {
    id 
    email 
    enabled 
    names 
    first_surname 
    second_surname 
    role { 
      id 
      code 
      description
    } 
    congregation {
      id 
      code 
      name 
    } 
  }
}
`

export {
  addUser,
}