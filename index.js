const request = require("node-superfetch");

module.exports = class Gitea {
    constructor(options = {}) {
        this.options = options;
        this._version = require("./package.json").version;
        if (typeof this.options.url !== 'string') {
            throw new TypeError('Inputted url is not a string.');
        }
    }
    async version() {
        return request.get(new URL("/api/v1/version", this.options.url).href).then(ver => {
            let version = {};
            version.lib = this._version;
            version.gitea = ver.body.version;
            return version;
        });
        //return request.get(new (require('url')).URL('/api/v1/version', this.options.url)).then(ver => ({library: this._version, gitea: ver.body.version}));
    }
};

