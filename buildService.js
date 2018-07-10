const util = require("util");
const exec = util.promisify(require("child_process").exec);

class BuildService {
    buildBook(repo) {
        async function build() {
            const { stdout, stderr } = await exec(
                `pwd && gitbook build ./raw/${repo}`
            );
            console.log("stdout:", stdout);
            console.log("stderr:", stderr);
            build();
        }
    }
}
module.exports = new BuildService();
