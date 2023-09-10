
## Server

* This `express.js` binds to port `2024` and communicates with NocoDB. It implements the API used by the site dontspy.eu.
  * it uses `lib/nocoio.js`
* `nocoserver.js` it starts Nocodb on port `8080`, which in production will be db.dontspy.eu, the server used to serve private, public and password-protected dashboard to manage the database.

```
npm run noco
npm run express
```

optionlly, `express:dev` add reload

## Watchers

* `photos-processor.js', which is run with a certain periodicity and pulls the last uploaded images into the `photos' table. The process consists in executing javascript and python subprocesses to get metadata out of the pictures, and eventually resize/trim/write over those.
* `contributions-importer.js', which is run on a regular basis and pulls the latest contributions from the trusted input source. The effect is to mark the contribution as processed, and add an entry into photos and subjects columns.

Both watchers need to be executed inside a virtual python env, as they wrap execution of python and node. Both of them use `lib/checkerstd.js`

```
npm run processors
```

## 🍝

This is spaghetti code and we hail the [mighty flying spaghetti monster](https://en.wikipedia.org/wiki/Flying_Spaghetti_Monster)!

## Special

`bin/duckface-analyzer.js` can't work from that path, and is copied when your run `npm run copy` at the setup time (check ../README.md)
