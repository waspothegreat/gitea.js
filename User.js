const request = require('node-superfetch');
const Gitea = require('./Gitea.js');

/**
 * @extends {Gitea}
 */
module.exports = class User extends Gitea {
    constructor(options) {
        super(options);
        this.token = options.token;
        if (!this.token) throw new ReferenceError('No authentication token inputted');
        if (typeof this.token !== 'string') {
            throw new ReferenceError('Inputted token is not a string');
        }
    }
    getUserInfo() {
        return request.get(`${this.options.url}/api/v1/user?token=${this.token}`).then(r => r.body).catch(() => {
            throw new ReferenceError('Authentication failure, please provide a valid token');
        });
    }

    getEmail() {
        return request.get(`${this.options.url}/api/v1/user/emails?token=${this.token}`).then(r => r.body).catch(() => {
            throw new Reference('Authentication failure, please provide a valid token');
        })
    }
}
