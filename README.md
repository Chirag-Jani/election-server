Tasks:

- winner declaration (shold be done automatically if state == ended)

- auth token will be needed in the header

  - while creating eleciton (token of admin)
  - while voting (token of user)

- validation remaining

  - while updating user
  - creating & updating election
  - candidate email while adding one

- middlewares remaining for election endpoints
  - should not be able to update or vote based on the state of the election

---

Bugs/Remaining Updates:

- change election status (it is unconditional at the moment - make it conditional)

- only let them vote if they have signed up and logged in (auth token will do the work probably)

---

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
- update election state (manually as of now by using req.body)
- don't let update election info or anything (adding/removing candidates) once started the election
  - implemented by just matching the status manually as of now (want to use middleware if possible)
