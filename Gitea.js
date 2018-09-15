const request = require("node-superfetch");

module.exports = class Gitea {
    constructor(options = {}) {
        this.options = options;
        this.token = this.options.token;
        if (!this.token) throw new ReferenceError('No authentication token inputted');
        if (typeof this.token !== 'string') {
            throw new ReferenceError('Inputted token is not a string');
        }
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
    }

    async getUserInfo() {
        return request.get(new URL(`/api/v1/user?token=${this.token}`, this.options.url)).then(r => r.body).catch(() => {
            throw new ReferenceError('Authentication failure, please provide a valid token');
        });
    }

    async getEmail() {
        return request.get(new URL(`/api/v1/user/emails?token=${this.token}`, this.options.url)).then(r => util.inspect(r.body)).catch(() => {
            throw new ReferenceError('Authentication failure, please provide a valid token');
        })
    }

    async getFollowers() {
        return request.get(new URL(`/api/v1/user/followers?token=${this.token}`, this.options.url)).then(r => util.inspect(r.body)).catch(() => {
            throw new ReferenceError('Authentication failure, please provide a valid token');
        })
    }

    async getFollowing() {
        return request.get(new URL(`/api/v1/user/following?token=${this.token}`, this.options.url)).then(r => util.inspect(r.body)).catch(() => {
            throw new ReferenceError('Authentication failure, please provide a valid token');
        })
    }

    async getRepositories() {
        return request.get(new URL(`/api/v1/repos/search`, this.options.url)).then(r => util.inspect(r.body.data));
    }

    async getUsers() {
        return request.get(new URL(`/api/v1/users/search`)).then(r => require('util').inspect(r.body.data));
    }
};

