const git = require("simple-git")();
const token = require("./token");

class GitService {
    checkout({ name, url }) {
        return git.cwd(`./raw`).clone(url, "./");
    }
}

module.exports = new GitService();
