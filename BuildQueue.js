
const async = require("async");

class BuildQueue {
    constructor(params) {
        this.gitService = params.gitService;
        this.buildService = params.buildService;
        this.repoQueue = async.queue(this.build, 1);
        this.builRuns = false;
    }

    add(inputData) {
        if (Array.isArray(inputData)) {
            inputData.forEach(repo => {
                this.repoQueue.push(repo);
                console.log("Updated repos list: ", this.repoQueue);
            });
        } else if (typeof inputData === "string") {
            this.repoQueue.push(inputData);
            console.log("Updated repos list: ", this.repoQueue);
        } else {
            throw new Error(
                "Invalid input to queue. Expected string or array, got ",
                typeof inputData
            );
        }
    }
    build(repo, cb) {
        return this.gitService.checkout(repo).then(() => {
            return this.buildService.buildBook(repo.name);
        });
    }
    startBuild() {
        while (this.builRuns) {
            if (this.repoQueue.length > 0) {
                this.build(this.repoQueue.shift());
            }
        }
    }
    stopBuild() {
        this.builRuns = false;
    }
}

module.exports = BuildQueue;
