
## Server

* This `express.js` binds to port `2024` and communicates with NocoDB. It implements the API used by the site dontspy.eu.
  * it uses `lib/nocoio.js`
* `nocoserver.js` it starts Nocodb on port `8080`, which in production will be db.dontspy.eu, the server used to serve private, public and password-protected dashboard to manage the database.

## Watchers

* `photos-checker.js', which is run with a certain periodicity and pulls the last uploaded images into the `photos' table. This table is populated by another script
* `contributions-importer.js', which is run on a regular basis and pulls the latest contributions from the trusted input source.
input source, and splitting photo + people.

Both watchers need to be executed inside a virtual python env, as they wrap execution of python and node. Both of them use `lib/checkerstd.js`

# 🍝
