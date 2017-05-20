exports.config = {
    framework: "jasmine",
    seleniumAddress: "http://localhost:4444/wd/hub",
    specs: ["./tests/e2e/**/*.e2e-spec.ts"],
    baseUrl: "http://localhost:8080",
    capabilities: {
        browserName: "chrome"
    },
    useAllAngular2AppRoots: true,

    beforeLaunch: function() {
        require("ts-node").register({
            project: "./tests/e2e/"
        });
    }
};