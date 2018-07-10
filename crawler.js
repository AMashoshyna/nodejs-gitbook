const gitApiService = require("./gitApiService");
const buildQueue = require("./buildQueue");

let interval;
class Crawler {
    constructor(options) {
        this.delay = options.delay;
    }
    start() {
        interval = setInterval(this.search, this.delay);
    }
    static stop() {
        clearInterval(interval);
    }
    search() {
        gitApiService.getGitBookRepos().then(reposList => {
            console.log("Repos list: ", reposList);
            buildQueue.add(reposList);
            buildQueue.startBuild();
            Crawler.stop();
        });
    }
}

module.exports = Crawler;

const crawler = new Crawler({ delay: 1000 });
crawler.start();
