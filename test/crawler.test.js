const proxyquire = require("proxyquire");
const sinon = require("sinon");

const mockData = [
    {
        name: "clojurescript-unraveled",
        url: "https://github.com/AMashoshyna/clojurescript-unraveled"
    }
];

/* eslint-env and, mocha */

describe("Crawler", () => {
    let crawler, getGitBookRepos, buildQueueAddStub;
    beforeEach(() => {
        getGitBookRepos = sinon.stub().resolves(mockData);

        buildQueueAddStub = sinon.stub();
        const Crawler = proxyquire("./../crawler", {
            "./gitApiService": {
                getGitBookRepos
            },
            "./buildQueue": {
                add: buildQueueAddStub,
                startBuild: function() {}
            },
            "./db": {
                isLastCommitChanged: () => {
                    return Promise.resolve(true);
                },
                "@noCallThru": true
            }
        });
        crawler = new Crawler({ delay: 100 });
    });
    it("should call getGitBookRepos method", done => {
        crawler.search();
        setTimeout(() => {
            sinon.assert.called(getGitBookRepos);
            done();
        }, 100);
    });
    it("Should add new repos to buildQueue", done => {
        crawler.search();
        setTimeout(() => {
            sinon.assert.calledWith(buildQueueAddStub, mockData[0]);
            done();
        }, 100);
    });
    it("Should not attempt to add new repos to build queue if not repos were found", done => {
        getGitBookRepos = sinon.stub().resolves([]);
        setTimeout(() => {
            sinon.assert.notCalled(buildQueueAddStub);
            done();
        }, 100);
    });
});
