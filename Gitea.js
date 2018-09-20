const request = require("node-superfetch");

module.exports = class Gitea {
    /**
    * @param {Object} [options]
    */
    constructor(options = {}) {
        this.options = options;
        this.token = this.options.token;
        if (!this.token) throw new ReferenceError('No authentication token inputted');
        if (typeof this.token !== 'string') {
            throw new ReferenceError('Inputted token is not a string');
        }
        if (typeof this.options.url !== 'string') {
            throw new TypeError('Inputted url is not a string.');
        }
    }

    async version() {
        var ver = await request.get(new URL("/api/v1/version", this.options.url));
        return ver.body.version;
    }

    async getUserInfo() {
        return request.get(new URL(`/api/v1/user?token=${this.token}`, this.options.url)).then(r => r.body).catch((err) => {
            if (err.status == 401) throw new ReferenceError('Authentication failure, please provide a valid token');
            if (err.status != undefined) throw new Error(`Error ${err.status}: ${err.statusText}`);
            throw err;
        });
    }

    async getEmail() {
        return request.get(new URL(`/api/v1/user/emails?token=${this.token}`, this.options.url)).then(r => r.body).catch((err) => {
            if (err.status == 401) throw new ReferenceError('Authentication failure, please provide a valid token');
            if (err.status != undefined) throw new Error(`Error ${err.status}: ${err.statusText}`);
            throw err;
        })
    }

    async getFollowers() {
        return request.get(new URL(`/api/v1/user/followers?token=${this.token}`, this.options.url)).then(r => r.body).catch((err) => {
            if (err.status == 401) throw new ReferenceError('Authentication failure, please provide a valid token');
            if (err.status != undefined) throw new Error(`Error ${err.status}: ${err.statusText}`);
            throw err;
        })
    }

    async getFollowing() {
        return request.get(new URL(`/api/v1/user/following?token=${this.token}`, this.options.url)).then(r => r.body).catch((err) => {
            if (err.status == 401) throw new ReferenceError('Authentication failure, please provide a valid token');
            if (err.status != undefined) throw new Error(`Error ${err.status}: ${err.statusText}`);
            throw err;
        })
    }

    async getRepositories() {
        return request.get(new URL(`/api/v1/repos/search`, this.options.url)).then(r => r.body.data);
    }

    /**
    * @param {Object} config
    */
    async makeRepository({config}) {
        console.log(config);
//        return request.post(new URL(`/api/v1/user/repos?token=${this.token}`, this.options.url), { body: config, headers: {'Content-Type': 'application/json'} });
    }

    async getUsers() {
        return request.get(new URL(`/api/v1/users/search`, this.options.url)).then(r => r.body.data);
    }

    async getStarredRepos() {
        return request.get(new URL("/user/starred", this.options.url)).then(r => r.body.data);
    }

    /**
     * @param {string} owner
     * @param {string} repo
     */

    async getRepository(owner, repo) {
        if (!owner) throw new ReferenceError('Please provide an owner');
        if (!repo) throw new ReferenceError('Please provide a repository');
        return request.get(new URL(`/api/v1/repos/${owner}/${repo}`, this.options.url)).then(r => r.body).catch((err) => {
            if (err.status == 404) throw new ReferenceError('Please provide an existing repository/owner');
            if (err.status != undefined) throw new Error(`Error ${err.status}: ${err.statusText}`);
            throw err;
        })
    }
};

