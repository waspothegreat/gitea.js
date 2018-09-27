const request = require("node-superfetch");
const errCheck = err => {
  if (err.status == 401) throw new ReferenceError('Authentication failure, please provide a valid token');
  else if (err.status == 404) throw new ReferenceError('Please provide an existing item');
  else if (err.status != undefined) throw new Error(`Error ${err.status}: ${err.statusText}`);
  else throw err;
}

module.exports = class Gitea {
    /**
    * @param {Object} options Main options for the class
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
        var ver = await request.get(new URL("/api/v1/version", this.options.url).href);
        return ver.body.version;
    }

    /**
    * Gets user info of a registered user in the gitea instance
    * @async
    */
    async getUserInfo() {
        return request.get(new URL(`/api/v1/user?token=${this.token}`, this.options.url).href).then(r => r.body).catch(errCheck);
    }

    /**
    * Gets the email/emails of the registered user on the gitea instance
    * @async
    */
    async getEmail() {
        return request.get(new URL(`/api/v1/user/emails?token=${this.token}`, this.options.url).href).then(r => r.body).catch(errCheck);
    }

    /**
    * Gets the registered users followers on the gitea instance
    * @async
    */
    async getFollowers() {
        return request.get(new URL(`/api/v1/user/followers?token=${this.token}`, this.options.url).href).then(r => r.body).catch(errCheck);
    }

    /**
    * Gets what the registered user is following on the gitea instance
    * @async
    */
    async getFollowing() {
        return request.get(new URL(`/api/v1/user/following?token=${this.token}`, this.options.url).href).then(r => r.body).catch(errCheck)
    }

    /**
    * Gets all the repositories on the gitea instance
    * @async
    */
    async getRepositories() {
        return request.get(new URL(`/api/v1/repos/search`, this.options.url).href).then(r => r.body.data);
    }

    /**
    * Creates a repository using a configuration from the `RepoBuilder` class
    * @async
    * @param {Object} config
    * @example
    * await Gitea.makeRepository({
    * auto_init: false,
    * description: '',
    * gitignores: '',
    * license: '',
    * name: '',
    * private: false,
    * readme: ''
    * });
    */
    async makeRepository({config}) {
        const props = [ "auto_init", "description", "gitignores", "license", "name", "private", "readme" ];
        let missingProps = props.filter(key => !config.hasOwnProperty(key));
        if (Object.prototype.toString.call(config) == '[object Object]') {
            throw new TypeError('Parameter is not an object')
        } else if (missingProps.length) {
            throw new ReferenceError(`Please provide all the following objects: ${props.map(prop => prop).join(', ')}`)
        } else {
          return request.post(new URL(`/api/v1/user/repos?token=${this.token}`, this.options.url).href).send(config)
    }
    }
    /**
    * Gets all the registered users on the gitea instance
    * @async
    */
    async getUsers() {
        return request.get(new URL(`/api/v1/users/search`, this.options.url).href).then(r => r.body.data);
    }

    async getStarredRepos() {
        return request.get(new URL("/user/starred", this.options.url).href).then(r => r.body.data);
    }

    /**
     * Makes a `GET` request towards a repository in your hosted gitea instance
     * @async
     * @param {string} owner Owner of the repository
     * @param {string} repo Name of the repository
     * @example
     * await Gitea.getRepository('waspothegreat', 'gitea.js');
     */

    async getRepository(owner, repo) {
        if (!owner) throw new ReferenceError('Please provide an owner');
        if (!repo) throw new ReferenceError('Please provide a repository');
        return request.get(new URL(`/api/v1/repos/${owner}/${repo}`, this.options.url).href).then(r => r.body).catch(errCheck);
    }
};
