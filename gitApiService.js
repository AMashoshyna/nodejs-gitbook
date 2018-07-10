const token = require("./token");
const api = "https://api.github.com";
const fetch = require("node-fetch");

class GitApiService {
    constructor(token) {
        this.token = token;
    }
    getGitBookRepos() {
        const url = `${api}/user/repos?access_token=${token}`;
        return (
            fetch(url)
                .then(result => {
                    if (result.ok) {
                        return result.json();
                    }
                })
                // .then(
                //     repos => repos.filter(repo => repo.permissions.push)
                //     // .map(repo => repo.name)
                // )
                .then(repos => {
                    // console.log(repos);
                    return Promise.all(
                        repos.map(repo => {
                            let url = `${api}/repos/${repo.owner.login}/${
                                repo.name
                            }/contents/book.json?access_token=${token}`;
                            // console.log(url);
                            return fetch(url).then(response => {
                                if (response.ok) {
                                    return repo;
                                }
                                return null;
                            });
                        })
                    ).then(repos =>
                        repos.filter(repo => repo).map(repo => ({
                            name: repo.name,
                            url: repo.url
                        }))
                    );
                    // .then(console.log);
                })
        );
    }
}

module.exports = new GitApiService(token);

// let gitApiService = new GitApiService();
// gitApiService.getGitBookRepos();
