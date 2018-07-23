const Sequelize = require("sequelize");
const sequelize = new Sequelize("mainDB", null, null, {
    dialect: "sqlite",
    storage: "./db.sqlite"
});

const RepoHead = sequelize.define("RepoHead", {
    headCommit: Sequelize.STRING,
    repoName: {
        type: Sequelize.STRING,
        primaryKey: true
    }
});

sequelize.sync({ force: true });

function getHeadCommit(repo) {
    console.log(`Finding head commit for repo ${repo}`);
    return RepoHead.findOne({ where: { repoName: repo } });
}

function updateHeadCommit(repo, commitHash) {
    return RepoHead.upsert(
        {
            repoName: repo,
            headCommit: commitHash
        },
        {
            returning: true,
            where: {
                repoName: repo
            }
        }
    );
}

function isLastCommitChanged(repo, commitHash) {
    return RepoHead.findOne({ where: { repoName: repo } }).then(repoRecord => {
        if (repoRecord) {
            return repoRecord.dataValues.headCommit === commitHash;
        }
        return false;
    });
}

module.exports = {
    getHeadCommit,
    updateHeadCommit,
    isLastCommitChanged
};
