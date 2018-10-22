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
    * @param {Object} options - Main options for the class
    */
    constructor(options = {}) {
        /**
        * @type {Object}
        */
        this.options = options;
        /**
        * @type {string}
        */
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

    /**
    * Gets the current version of the lib
    * @readonly
    */
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
    * List's a specified repository's forks
    * @async
    * @param {string} owner - Owner to be specified
    * @param {string} repo - Repository name to be specified
    * @example
    * await Gitea.getRepositoryForks('user123', 'Repository');
    */
    async getRepositoryForks(owner, repo) {
      if (typeof owner !== 'string') {
        throw new TypeError('Please provide a owner name');
      } else if (typeof repo !== 'string') {
        throw new TypeError('Please provide a repository name');
      } else {
        return await request.get(new url.URL(`/api/v1/repos/${owner}/${repo}/forks`, this.options.url).href).then(r => r.body).catch(errCheck);
      }
    }

    /**
    * Creates a webhook in a repository you own using your authenticated user
    * @async
    * @param {string} owner - Owner name to be passed
    * @param {string} repo - Repository name to be passed
    * @param {boolean} active - Whether the webhook is active or not
    * @param {string} contenttype - Content type to be passed
    * @param {string} url - Payload url to be passed
    * @param {Array} events - Event(s) to be passed
    * @param {string} type - Webhook type to be passed
    * @example
    * await Gitea.createRepoHook('username', 'repository', false, 'json', 'https://yourwebhookpayloadurl', ['push'], 'gitea');
    */

    async createRepoHook(owner, repo, active, contenttype, url, events, type) {
      const contenttypes = ['json', 'x-www-form-urlencoded'];
      const eventsarray = ['create', 'delete', 'fork', 'push', 'issues', 'issue_comment', 'pull_request', 'repository', 'release' ];
      const types = ['gitea', 'gogs', 'slack', 'discord', 'dingtalk'];
      const config = {active: active, config: {content_type: contenttype, url: url}, events: events, type: type}
      if (typeof owner !== 'string') {
        throw new TypeError('Please provide a string for the owner parameter')
      } else if (typeof repo !== 'string') {
        throw new TypeError('Repository name is not a string')
      } else if (typeof active !== 'boolean') {
        throw new TypeError('Please provide either true or false for the active parameter')
      } else if (!contenttypes.includes(config.config.content_type)) {
        throw new ReferenceError(`Please provide one of the following content types: ${contenttypes.map(key => key).join(', ')}`)
      } else if (eventsarray.some(v => config.events.includes(v)) == false) {
        throw new ReferenceError(`Please provide one of the following events:\n ${eventsarray.map(events => events).join('\n')}`)
      } else if (!types.includes(config.type)) {
        throw new ReferenceError(`Webhook types must include one of the following: ${types.map(type => type).join(', ')}`);
      } else {
        return await request.post(new (require('url')).URL(`/api/v1/repos/${owner}/${repo}/hooks?token=${this.token}`, this.options.url).href).send(config).then(r => r.body).catch(errCheck);
      }
    }

    /**
    * Forks a specified repository. Can only fork using an organization that you own.
    * @async
    * @param {string} owner - Owner of the repository to be specified
    * @param {string} repo - Repository name to be specified
    * @param {string} org - Organization name to be specified
    * @example
    * await Gitea.forkRepository('user123', 'repository', 'my-organization');
    */

    async forkRepository(owner, repo, org) {
      if (typeof owner !== 'string') {
          throw new TypeError('Owner must be a string')
      } else if (typeof repo !== 'string') {
          throw new TypeError('Repository name must be a string')
      } else if (typeof org !== 'string') {
        throw new TypeError('Organization name must be a string')
      } else {
        return await request.post(new url.URL(`/api/v1/repos/${owner}/${repo}/forks?token=${this.token}`, this.options.url).href).send({"organization": org}).then(r => r.body).catch(errCheck);
      }
    }

    /**
    * Gets an existing organization by its name
    * @async
    * @param {string} org - Organization name to be specified
    * @example
    * await Gitea.getOrganization('organization');
    */

    async getOrganization(org) {
      if (typeof org !== 'string') {
        throw new TypeError('Organization parameter is not a string')
      } else {
        return await request.get(new url.URL(`/api/v1/orgs/${org}`, this.options.url).href).then(r => r.body).catch(errCheck);
      }
    }

    /**
    * Edits the description, full name, location, and website of an organization
    * @async
    * @param {string} org - Organization name to be passed
    * @param {Object} config - configuration for the organization
    * @example
    * await Gitea.editOrganization('my-organization', {
    * description: '',
    * full_name: '',
    * location: '',
    * website: ''
    * })
    */

    async editOrganization(org, config) {
      const props = ["description", "full_name", "location", "website"];
      let propsMissed = props.filter(key => !config.hasOwnProperty(key));
      if (Object.prototype.toString.call(config) !== '[object Object]') {
          throw new TypeError('Parameter is not an object')
      } else if (propsMissed.length) {
          throw new ReferenceError(`Please provide all the following objects: ${props.map(prop => prop).join(', ')}`)
      } else {
          return await request.patch(new url.URL(`/api/v1/orgs/${org}?token=${this.token}`, this.options.url).href).send(config).then(r => r.body).catch(errCheck)
      }
    }

    /**
    * Creates a repository within the organization.
    * @async
    * @param {string} org - Organization name to be passed
    * @param {Object} config - Configuration to be passed for the repository using the RepoBuilder configuration
    * @example
    * await Gitea.createOrgRepo('my-organization', {
    * auto_init: false,
    * description: '',
    * gitignores: '',
    * license: '',
    * name: '',
    * private: false,
    * readme: ''
    * });
    */

    async createOrgRepo(org, {config}) {
      const props = ["auto_init", "description", "gitignores", "license", "name", "private", "readme"];
      let propsMissed = props.filter(key => !config.hasOwnProperty(key));
      if (typeof org !== 'string') {
        throw new TypeError('Organization parameter is not a string');
      } else if (Object.prototype.toString.call(config) !== '[object Object]') {
          throw new TypeError('Parameter is not an object')
      } else if (propsMissed.length) {
          throw new ReferenceError(`Please provide all the following objects: ${props.map(prop => prop).join(', ')}`)
      } else {
        return await request.post(new url.URL(`/api/v1/org/${org}/repos?token=${this.token}`, this.options.url).href).send(config).then(r => r.body).catch(errCheck);
      }
    }

    /**
    * Gets a list of members within the organization, will return an empty array if none are found
    * @async
    * @param {string} org - Organization name to be passed
    * @example
    * await Gitea.getOrgMembers('my-organization');
    */
    async getOrgMembers(org) {
      if (typeof org !== 'string') {
        throw new TypeError('Organization parameter must be a string')
      } else {
        return await request.get(new url.URL(`/api/v1/orgs/${org}/members`, this.options.url).href).then(r => r.body).catch(errCheck);
      }
    }

    /**
    * Gets the list of webhooks from an organization you own. If none are found it will return an empty array.
    * @async
    * @param {string} org - Organization name to be passed
    * @example
    * await Gitea.getOrgWebhooks('my-organization');
    */

    async getOrgWebhooks(org) {
      if (typeof org !== 'string') {
        throw new TypeError('Organization name parameter is not a string')
      } else {
        return await request.get(new url.URL(`/api/v1/orgs/${org}/hooks?token=${this.token}`, this.options.url).href).then(r => r.body).catch(errCheck);
      }
    }

    /**
    * Creates an Organization webhook
    * @async
    * @param {string} org - Organization name to be passed
    * @example
    * await Gitea.createOrgWebhook('my-organization');
    */

    async createOrgWebhook(org) {
      if (typeof org !== 'string') {
        throw new TypeError('Organization parameter is not a string')
      } else {
        return await request.post(new url.URL(`/api/v1/orgs/${org}/hooks?token=${this.token}`, this.options.url).href).then(r => r.body).catch(errCheck);
      }
    }

    /**
    * Creates a team within an existing organization that you own
    * @async
    * @param {string} org - Organization name to be passed
    * @param {string} desc - Description of the team to be passed
    * @param {string} name - Name of the team to be passed
    * @param {string} perm - Permission to be passed, default value is none
    * @example
    * await Gitea.createOrgRepo('my-organization', 'a team', 'my team', 'none');
    */

    async createOrgTeam(org, name, desc, perm) {
      if (typeof org !== 'string') {
        throw new TypeError('Organization name is not a string')
      } else if (name.length === 0) {
        throw new ReferenceError('Please provide at least 1 character in the name')
      } else {
        return await request.post(new url.URL(`/api/v1/orgs/${org}/teams?token=${this.token}`, this.options.url).href).send({"description": desc, "name": name, "permission": perm}).then(r => r.body).catch(errCheck);
      }
    }

    /**
    * Gets a list of teams from an organization, will return an empty array if none are found
    * @async
    * @param {string} org - Organization name to be passed
    * @example
    * await Gitea.getOrgTeams('my-org');
    */

    async getOrgTeams(org) {
      if (typeof org !== 'string') {
        throw new TypeError('Organization parameter is not a string')
      } else {
        return await request.get(new url.URL(`/api/v1/orgs/${org}/teams?token=${this.token}`, this.options.url).href).then(r => r.body).catch(errCheck);
      }
    }

    /**
    * Deletes an organization's webhook by id
    * @async
    * @param {string} org - Organization name to be passed
    * @param {string} id - Id of the webhook to be passed
    * @example
    * await Gitea.deleteOrgHook('my-organization', '1234');
    */

    async deleteOrgHook(org, id) {
      if (typeof org !== 'string') {
        throw new TypeError('Organization parameter is not a string')
      } else if (typeof id !== 'string') {
        throw new TypeError('Hook id parameter is not a string')
      } else {
        return await request.delete(new url.URL(`/api/v1/orgs/${org}/hooks/${id}?token=${this.token}`, this.options.url).href).catch(errCheck);
      }
    }

    /**
    * Gets an organization that you own's webhook by its id
    * @async
    * @param {string} org - Organization name to be passed
    * @param {string} id - Id of the organization webhook to be passed
    * @example
    * await Gitea.getOrgHook('my-organization', '1234');
    */
    async getOrgHook(org, id) {
      if (typeof org !== 'string') {
        throw new TypeError('Organization parameter is not a string')
      } else if (typeof id !== 'string') {
        throw new TypeError('Hook id parameter is not a string')
      } else {
        return await request.get(new url.URL(`/api/v1/orgs/${org}/hooks/${id}?token=${this.token}`, this.options.url).href).then(r => r.body).catch(errCheck);
      }
    }


    /**
    * Stars a specified repository using the authenticated user
    * @async
    * @param {string} owner - owner of the repository
    * @param {string} repo - repository name to be specified
    * @example
    * await Gitea.starRepo('user123', 'repository');
    */
    async starRepo(owner, repo) {
    if (typeof owner !== 'string') {
        throw new TypeError('Owner must be a string')
    } else if (typeof repo !== 'string') {
        throw new TypeError('Repository name must be a string')
    } else {
        return await request.put(new url.URL(`/api/v1/user/${owner}/${repo}?token=${this.token}`, this.options.url).href).catch(errCheck);
    }
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
    const props = ["auto_init", "description", "gitignores", "license", "name", "private", "readme"];
    let missingProps = props.filter(key => !config.hasOwnProperty(key));
    if (Object.prototype.toString.call(config) !== '[object Object]') {
        throw new TypeError('Parameter is not an object')
    } else if (missingProps.length) {
        throw new ReferenceError(`Please provide all the following objects: ${props.map(prop => prop).join(', ')}`)
    } else {
        return await request.post(new url.URL(`/api/v1/user/repos?token=${this.token}`, this.options.url).href).send(config).then(r => r.body).catch(errCheck);
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
    * Gets the authenticated users orgs. Returns an empty array if none are found.
    * @async
    */
    async getUserOrgs() {
      return await request.get(new url.URL(`/api/v1/user/orgs?token=${this.token}`, this.options.url).href).then(r => r.body).catch(errCheck);
    }
    /**
    * Gets a user by its username
    * @param {string} username - Username to be specified
    * @async
    * @example
    * await Gitea.getUser('user1234');
    */
    async getUser(username) {
      return await request.get(new url.URL(`/api/v1/users/${username}`, this.options.url).href).then(r => r.body).catch(errCheck);
    }

    /**
    * Gets a specified repositories labels
    * @async
    * @param {string} owner - owner of the repository
    * @param {string} repo - name of the repository
    * @example
    * await Gitea.getRepositoryLabels('user123', 'repo');
    */
    async getRepositoryLabels(owner, repo) {
      if (typeof owner !== 'string') {
        throw new TypeError('Owner parameter must be a string')
      } else if (typeof repo !== 'string') {
        throw new TypeError('Repository name must be a string')
      } else {
        return await request.get(new url.URL(`/api/v1/repos/${owner}/${repo}/labels`, this.options.url).href).then(r => r.body).catch(errCheck);
      }
    }
    /**
    * Gets the authenticated user's starred repositories
    * @async
    */
    async getStarredRepos() {
        return await request.get(new url.URL(`/api/v1/user/starred?token=${this.token}`, this.options.url).href).then(r => r.body).catch(errCheck);
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
  * @param {string} username - username of the user to follow
  * @example
  * await Gitea.followUser('user123');
  */
  async followUser(username) {
    if (typeof username !== 'string') {
        throw new TypeError('Please provide a string')
    } else {
        return await request.put(new url.URL(`/api/v1/user/following/${username}?token=${this.token}`, this.options.url).href).catch(errCheck);
    }
}

  /**
  * unfollows another user using the authenticated user
  * @async
  * @param {string} username - username of the user to unfollow
  * @example
  * await Gitea.unfollowUser('user123');
  */
  async unfollowUser(username) {
    if (typeof username !== 'string') {
        throw new TypeError('Please provide a string')
      } else {
        return await request.delete(new url.URL(`/api/v1/user/following/${username}?token=${this.token}`, this.options.url).href).catch(errCheck);
      }
    }
    /**
     * Makes a `GET` request towards a repository in your hosted gitea instance
     * @async
     * @param {string} owner - Owner of the repository
     * @param {string} repo - Name of the repository
     * @example
     * await Gitea.getRepository('waspothegreat', 'gitea.js');
     */

    async getRepository(owner, repo) {
        return await request.get(new url.URL(`/api/v1/repos/${owner}/${repo}`, this.options.url).href).then(r => r.body).catch(errCheck);
    }

    /**
    * Gets the list of repositories a user has, will return an empty array if none
    * @async
    * @param {string} username - username to specify
    * @example
    * await Gitea.getUserRepositories('user1234')
    */

    async getUserRepositories(username) {
      return await request.get(new url.URL(`/api/v1/users/${username}/repos`, this.options.url).href).then(r => r.body).catch(errCheck);
    }
};
