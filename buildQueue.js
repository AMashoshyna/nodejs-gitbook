const gitService = require("./gitService");
const buildService = require("./buildService");

class BuildQueue {
    constructor() {
        this.repoQueue = [];
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
        // while (true) {
        if (this.repoQueue.length > 0) {
            this.build(this.repoQueue.shift());
        }
        // }
    }
}

module.exports = new BuildQueue();
