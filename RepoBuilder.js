module.exports = class RepoBuilder {
    constructor() {
        this.config = {auto_init: false, description: "", gitignores: "", license: "", name: "", private: false, readme: ""};
    }

    /**
    * @returns {Object}
    */
    autoInit() {
        this.config.auto_init = true;
        return this;
    }

    /**
    * @param {string} desc
    * @returns {Object}
    */
    setDescription(desc) {
        this.config.description = desc;
        return this;
    }
    /**
    * @param {string} gitignores
    * @returns {Object}
    */
    setGitIgnores(gitignores) {
        this.config.gitignores = gitignores;
        return this;
    }
    /**
    * @param {string} license
    * @returns {Object}
    */
    setLicense(license) {
        this.config.license = license;
        return this;
    }

    /**
    * @param {string} name
    * @returns {Object}
    */
    setName(name) {
        this.config.name = name;
        return this;
    }

    /**
    * @returns {Object}
    */
    private() {
        this.config.private = true;
        return this;
    }

    /**
     * @param {string} readme 
     * @returns {Object}
     */
    setReadme(readme) {
        this.config.readme = readme;
        return this;
    }
}
