const token = require("./token");
const fetch = require("node-fetch");

const API = "https://api.github.com";

const getUserReposUrl = token => {
    return `${API}/user/repos?access_token=${token}`;
};

const getGitBookUrl = (token, repo) => {
    return `${API}/repos/${repo.owner.login}/${
        repo.name
    }/contents/book.json?access_token=${token}`;
};

const hasGitBook = token => repo => {
    let url = getGitBookUrl(token, repo);
    return fetch(url).then(response => {
        if (response.ok) {
            return repo;
        }
        return null;
    });
};

class GitApiService {
    constructor(token) {
        this.token = token;
        this.hasGitBook = hasGitBook(token);
    }
    getGitBookRepos() {
        const url = getUserReposUrl(this.token);
        return fetch(url)
            .then(result => {
                if (result.ok) {
                    return result.json();
                }
            })
            .then(
                repos => repos.filter(repo => repo.permissions.push)
                // .map(repo => repo.name)
            )
            .then(repos => {
                return Promise.all(repos.map(this.hasGitBook)).then(repos =>
                    repos.filter(repo => repo).map(repo => {
                        return {
                            name: repo.name,
                            url: repo.html_url
                        };
                    })
                );
            });
    }
}

module.exports = new GitApiService(token);

// let gitApiService = new GitApiService();
// gitApiService.getGitBookRepos();
