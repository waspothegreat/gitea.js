const request = require('node-superfetch');
const Gitea = require('./Gitea.js');

/**
 * @extends {Gitea}
 */
module.exports = class User extends Gitea {
    constructor(token) {
        super();
        this._options = super.options;
        this.token = token;
        if (!token) throw new ReferenceError('No authentication token inputted');
        if (typeof token !== 'string') {
            throw new ReferenceError('Inputted token is not a string');
        }
    }
    getUserInfo() {
        return request.get(`${this._options.url}/api/v1/user?token=${this.token}`).then(r => r.body).catch(() => {
            throw new TypeError('Authentication failure, please provide a valid token');
        });
    }
}