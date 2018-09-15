module.exports = class RepoBuilder {
    constructor() {
        this.config = {auto_init: false, description: "", gitignores: "", license: "", name: "", private: false, readme: ""};
    }
    autoInit() {
        this.config.auto_init = true;
        return this;
    }
    setDescription(desc) {
        this.config.description = desc;
        return this;
    }
    setGitIgnores(gitignores) {
        this.config.gitignores = gitignores;
        return this;
    }
    setLicense(license) {
        this.config.license = license;
        return this;
    }
    setName(name) {
        this.config.name = name;
        return this;
    }
    private() {
        this.config.private = true;
        return this;
    }
    setReadme(readme) {
        this.config.readme = readme;
        return this;
    }
}