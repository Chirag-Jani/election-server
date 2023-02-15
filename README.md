Tasks:

- auth token will be needed in the header

  - while creating eleciton (token of admin)
  - while voting (token of user)

- validation remaining
- middlewares remaining for election endpoints

Bugs/Remaining Updates:

- change election status (think over it some more)
- only let them vote if they have signed up and logged in (auth token will do the work probably)

Done till date (15th Feb. '23):
User:

- register user
- login user
- update user
- remove user
- JWT added in all, need to include JWT in election APIs but it will be in later parts

Elections:

- create elections and delete elections
- add & remove candidates
- vote any candidate in any election (only once per user email)
- get the list of all the elections
