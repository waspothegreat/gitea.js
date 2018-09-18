module.exports = class RepoBuilder {
    constructor() {
        this.config = {auto_init: false, description: "", gitignores: "", license: "", name: "", private: false, readme: ""};
    }

    /**
    * @returns {Boolean}
    */
    autoInit() {
        this.config.auto_init = true;
        return this;
    }

    /**
    * @param {string} desc
    */
    setDescription(desc) {
        this.config.description = desc;
        return this;
    }
    /**
    * @param {string} gitignores
    */
    setGitIgnores(gitignores) {
        this.config.gitignores = gitignores;
        return this;
    }
    /**
    * @param {string} license
    */
    setLicense(license) {
        this.config.license = license;
        return this;
    }

    /**
    * @param {string} name
    */
    setName(name) {
        this.config.name = name;
        return this;
    }

    /**
    * @returns {Boolean}
    */
    private() {
        this.config.private = true;
        return this;
    }
    setReadme(readme) {
        this.config.readme = readme;
        return this;
    }
}
