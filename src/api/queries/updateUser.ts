import gql from 'graphql-tag'

const updateUser = gql`
mutation(
  $id: Int!, 
  $names: String, 
  $first_surname: String, 
  $second_surname: String, 
  $email: String, 
  $role_code: String, 
  $congregation_code: String, 
  $enabled: Boolean
) { 
  updateUser(
    id: $id, 
    names: $names, 
    first_surname: $first_surname, 
    second_surname: $second_surname, 
    email: $email, 
    role_code: $role_code, 
    congregation_code: $congregation_code, 
    enabled: $enabled
  ) { 
    id 
    email 
    enabled 
    names 
    first_surname 
    second_surname 
    email 
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
  updateUser,
}