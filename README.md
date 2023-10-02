# Don't Spy EU

A website, a campaign, and a mixture of different technologies. Know about us [Hermes Center](https://hermescenter.org).

### [DontSpyEU](https://dontspy.eu) is the the second iteration of [DontSpyONUS](https://dontspyonus.eu).

---

## How to run this code spaghetti combo?

1. The of the node part is really cursed and quirky: `npm install; npm run setup; npm run copy`
2. This is for hugo, to spin the webserver: `cd site; npm install; hugo -D server`
3. Read and follow `config/README.md` to setup PostgreSQL local connection
4. `cd py` and read `REMIND.sh` because it contans a few notes on requirement packages
5. `sudo apt install inotify-tools` _# not currently used_
6. `git submodule update --init` pulls from [this repository](https://github.com/negrel/hugo-theme-pico.git) which got discontinued during the development of this website. Thanks anyway to [@negrel](//github.com/negrel) for the great job! 🙏

After, maybe, something would work also in your system: but this is not guarantee, and it is not our goal.

Our goal is just to forbid face recognition in the wild!

## How test the system locally

1. `DEBUG=*,-follow* node bin/contributions-importer.js`
2. `DEBUG=*,-follow* node bin/photos-processor.js`

