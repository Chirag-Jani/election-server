# Available Endpoints:

## User CRUD:

- login:
  localhost:5000/auth/login/user

- signup:
  localhost:5000/auth/signup/user

- update user:
  localhost:5000/auth/update/user/<user_id>

- delete user:
  localhost:5000/auth/delete/user/<user_id>

## Election CRUD:

- get election:
  localhost:5000/user/getelections

- create election:
  localhost:5000/user/admin/create-election

- update election:
  localhost:5000/user/admin/update-election/<election_id>

- delete election:
  localhost:5000/user/admin/delete-election/<election_id>

- add candidate:
  localhost:5000/user/admin/add-candidate/<election_id>

- remove candidate:
  localhost:5000/user/admin/remove-candidate/<election_id>/<candidate_id>

- change election status:
  localhost:5000/user/admin/change-status/<election_id>

- vote candidate:
  localhost:5000/vote/<election_id>/<candidate_id>
