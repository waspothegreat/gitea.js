const request = require('node-superfetch');
const Gitea = require('./Gitea.js');

/**
 * @extends {Gitea}
 */
class User extends Gitea {
    constructor(token) {
        this._options = super.options;
        this.token = token;
        if (!token) throw new ReferenceError('No authentication token inputted');
        if (typeof token !== 'string') {
            throw new ReferenceError('Inputted token is not a string');
        }
    }
    getUserInfo() {
        return request.get(`${this._options}/api/v1/user?token=${this.token}`).then(r => r.body);
    }
}