const db = require("./db");

const { isLastCommitChanged } = db;

let interval;
class Crawler {
    constructor(options) {
        this.delay = options.delay;
        this.gitApiService = options.gitApiService;
        this.buildQueue = options.buildQueue;
    }
    start() {
        interval = setInterval(this.search, this.delay);
    }
    static stop() {
        clearInterval(interval);
    }
    search() {
        return this.gitApiService.getGitBookRepos().then(reposList => {
            console.log("Repos list: ", reposList);
            return Promise.all(
                reposList.map(repo => {
                    return isLastCommitChanged(repo.name).then(result => {
                        if (result) {
                            return this.buildQueue.add(repo);
                        }
                    });
                })
            );
        });
    }
}

module.exports = Crawler;

// const crawler = new Crawler({ delay: 1000 });
// crawler.start();
