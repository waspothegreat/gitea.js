const request = require("node-superfetch");

module.exports = class Gitea {
    /**
    * @param {Object} [options] Main options for the class
    */
    constructor(options = {}) {
        this.options = options;
        this.token = this.options.token;
        if (!this.token) throw new ReferenceError('No authentication token inputted');
        if (typeof this.token !== 'string') {
            throw new ReferenceError('Inputted token is not a string');
        }
        if (!this.options.url) throw new ReferenceError('Please input a url');
        if (typeof this.options.url !== 'string') {
            throw new TypeError('Inputted url is not a string.');
        }
    }

    /**
    * Gets the current version of the gitea api
    * @async
    */
    async version() {
        var ver = await request.get(new URL("/api/v1/version", this.options.url));
        return ver.body.version;
    }

    /**
    * Gets user info of a registered user in the gitea instance
    * @async
    */
    async getUserInfo() {
        return request.get(new URL(`/api/v1/user?token=${this.token}`, this.options.url)).then(r => r.body).catch((err) => {
            if (err.status == 401) throw new ReferenceError('Authentication failure, please provide a valid token');
            if (err.status != undefined) throw new Error(`Error ${err.status}: ${err.statusText}`);
            throw err;
        });
    }

    /**
    * Gets the email/emails of the registered user on the gitea instance
    * @async
    */
    async getEmail() {
        return request.get(new URL(`/api/v1/user/emails?token=${this.token}`, this.options.url)).then(r => r.body).catch((err) => {
            if (err.status == 401) throw new ReferenceError('Authentication failure, please provide a valid token');
            if (err.status != undefined) throw new Error(`Error ${err.status}: ${err.statusText}`);
            throw err;
        })
    }

    /**
    * Gets the registered users followers on the gitea instance
    * @async
    */
    async getFollowers() {
        return request.get(new URL(`/api/v1/user/followers?token=${this.token}`, this.options.url)).then(r => r.body).catch((err) => {
            if (err.status == 401) throw new ReferenceError('Authentication failure, please provide a valid token');
            if (err.status != undefined) throw new Error(`Error ${err.status}: ${err.statusText}`);
            throw err;
        })
    }

    /**
    * Gets what the registered user is following on the gitea instance
    * @async
    */
    async getFollowing() {
        return request.get(new URL(`/api/v1/user/following?token=${this.token}`, this.options.url)).then(r => r.body).catch((err) => {
            if (err.status == 401) throw new ReferenceError('Authentication failure, please provide a valid token');
            if (err.status != undefined) throw new Error(`Error ${err.status}: ${err.statusText}`);
            throw err;
        })
    }

    /**
    * Gets all the repositories on the gitea instance
    * @async
    */
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

    /**
    * Gets all the registered users on the gitea instance
    * @async
    */
    async getUsers() {
        return request.get(new URL(`/api/v1/users/search`, this.options.url)).then(r => r.body.data);
    }

    async getStarredRepos() {
        return request.get(new URL("/user/starred", this.options.url)).then(r => r.body.data);
    }

    /**
     * Makes a `GET` request towards a repository in your hosted gitea instance
     * @async
     * @param {string} owner Owner of the repository
     * @param {string} repo Name of the repository
     * @example
     * Gitea.getRepository('waspothegreat', 'gitea.js');
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
