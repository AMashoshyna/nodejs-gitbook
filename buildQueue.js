const gitService = require("./gitService");
const buildService = require("./buildService");

class BuildQueue {
    constructor() {
        this.repoQueue = [];
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
    build(repo) {
        gitService.checkout(repo).then(() => {
            buildService.buildBook(repo.name);
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

module.exports = new BuildQueue();
