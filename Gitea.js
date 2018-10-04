const request = require("node-superfetch");
const url = require('url');
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
    async getVersion() {
        var ver = await request.get(new url.URL("/api/v1/version", this.options.url).href);
        return ver.body.version;
    }

    get version() {
      return require('./package.json').version;
    }
    /**
    * Gets user info of the authenticated user in the gitea instance
    * @async
    */
    async getUserInfo() {
        return await request.get(new url.URL(`/api/v1/user?token=${this.token}`, this.options.url).href).then(r => r.body).catch(errCheck);
    }

    /**
    * Gets the email/emails of the authenticated user on the gitea instance
    * @async
    */
    async getEmail() {
        return await request.get(new url.URL(`/api/v1/user/emails?token=${this.token}`, this.options.url).href).then(r => r.body).catch(errCheck);
    }

    /**
    * Gets the authenticated user's followers on the gitea instance
    * @async
    */
    async getFollowers() {
        return await request.get(new url.URL(`/api/v1/user/followers?token=${this.token}`, this.options.url).href).then(r => r.body).catch(errCheck);
    }

    /**
    * Gets what the authenticated user is following on the gitea instance
    * @async
    */
    async getFollowing() {
        return await request.get(new url.URL(`/api/v1/user/following?token=${this.token}`, this.options.url).href).then(r => r.body).catch(errCheck)
    }

    /**
    * Gets all the repositories on the gitea instance
    * @async
    */
    async getRepositories() {
        return await request.get(new url.URL(`/api/v1/repos/search`, this.options.url).href).then(r => r.body.data);
    }

    /**
    * Stars a specified repository using the authenticated user
    * @async
    * @param {string} [owner] owner of the repository
    * @param {string} [repo] repository name to be specified
    * @example
    * await Gitea.starRepo('user123', 'repository');
    */

    async starRepo(owner, repo) {
      if (!username) throw new ReferenceError('Please provide a username');
      if (!repo) throw new ReferenceError('Please provide a repository name');
      if (typeof owner !== 'string') {
        throw new TypeError('Owner must be a string')
      } else if (typeof repo !== 'string') {
        throw new TypeError('Repository name must be a string')
      }
      return await request.put(new url.URL(`/api/v1/user/${owner}/${repo}?token=${this.token}`, this.options.url).href).catch(errCheck);
    }
    /**
    * Creates a repository using a configuration from the `RepoBuilder` class
    * @async
    * @param {Object} config - configuration for the created repository
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
          return await request.post(new url.URL(`/api/v1/user/repos?token=${this.token}`, this.options.url).href).send(config).then(r => r.body)
    }
    }
    /**
    * Gets all the authenticated user's on the gitea instance
    * @async
    */
    async getUsers() {
        return await request.get(new url.URL(`/api/v1/users/search`, this.options.url).href).then(r => r.body.data);
    }

    /**
    * Gets a user by its username
    * @param {string} [username]
    * @async
    * @example
    * await Gitea.getUser('user1234');
    */
    async getUser(username) {
      if (!username) throw new ReferenceError('Please provide a username');
      return await request.get(new url.URL(`/api/v1/users/${username}`, this.options.url).href).then(r => r.body).catch(errCheck);
    }

    /**
    * Gets the authenticated user's starred repositories
    * @async
    */
    async getStarredRepos() {
        return await request.get(new url.URL(`/api/v1/user/starred?token=${this.token}`, this.options.url).href).then(r => r.body.data);
    }

    /**
    * Adds an email to the authenticated user
    * @async
    * @param {string[]} emails - Array of emails to be passed
    * @example
    * await Gitea.addUserEmail([
    *   'user1234@website.com'
    *])
    */

    async addUserEmail(emails) {
    if (!Array.isArray(emails)) {
        throw new ReferenceError('Please provide an array');
    } else if (!emails.length) {
        throw new ReferenceError('Please provide an email in the array');
    } else {
        return await request.post(new url.URL(`/api/v1/user/emails?token=${this.token}`, this.options.url).href).send({
            "emails": emails
        }).then(r => r.body).catch(errCheck);
    }
}
  /**
  * Follows an existing user on the gitea instance using the authenticated user
  * @async
  * @param {string} [username] - username of the user to follow
  * @example
  * await Gitea.followUser('user123');
  */
  async followUser(username) {
    if (!username) throw new ReferenceError('Please provide a username');
    if (typeof username !== 'string') {
      throw new TypeError('Please provide a string')
    }
    return await request.put(new url.URL(`/api/v1/user/following/${username}?token=${this.token}`, this.options.url).href).catch(errCheck);
  }
    /**
     * Makes a `GET` request towards a repository in your hosted gitea instance
     * @async
     * @param {string} [owner] Owner of the repository
     * @param {string} [repo] Name of the repository
     * @example
     * await Gitea.getRepository('waspothegreat', 'gitea.js');
     */

    async getRepository(owner, repo) {
        if (!owner) throw new ReferenceError('Please provide an owner');
        if (!repo) throw new ReferenceError('Please provide a repository');
        return await request.get(new url.URL(`/api/v1/repos/${owner}/${repo}`, this.options.url).href).then(r => r.body).catch(errCheck);
    }

    /**
    * Gets the list of repositories a user has, will return an empty array if none
    * @async
    * @param {string} [username]
    * @example
    * await Gitea.getUserRepository('user1234')
    */

    async getUserRepositories(username) {
      if (!username) throw new ReferenceError('Please provide a username');
      return await request.get(new url.URL(`/api/v1/users/${username}/repos`, this.options.url).href).then(r => r.body).catch(errCheck);
    }
};
