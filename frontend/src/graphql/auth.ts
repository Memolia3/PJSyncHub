export const authQueries = {
  getUser: `
    query GetUser($email: String!) {
      userByEmail(email: $email) {
        id
        name
        email
        avatarUrl
      }
    }
  `,

  createUser: `
    mutation CreateUser($input: CreateUserInput!) {
      createUser(input: $input) {
        id
        name
        email
        avatarUrl
      }
    }
  `,
};
