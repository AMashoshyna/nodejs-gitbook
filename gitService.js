const git = require("simple-git")();
const mkdirp = require("mkdirp-promise");
const token = require("./token");

class GitService {
    checkout({ name, url }) {
        return mkdirp(`./raw/${name}`).then(() =>
            git.cwd(`./raw/${name}`).checkIsRepo((err, isRepo) => {
                if (!isRepo) {
                    return git.clone(url, "./");
                } else {
                    return git.fetch();
                }
            })
        );
    }
}

module.exports = new GitService();
