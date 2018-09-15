module.exports = class RepoBuilder {
    constructor() {
        this.config = {auto_init: false, description: "", gitignores: "", license: "", name: "", private: false, readme: ""};
    }
    autoInit() {
        this.config.auto_init = true;
        return this.config;
    }
    setDescription(desc) {
        this.config.description = desc;
        return this.config;
    }
    setGitIgnores(gitignores) {
        this.config.gitignores = gitignores;
        return this.config;
    }
    setLicense(license) {
        this.config.license = license;
        return this.config;
    }
    setName(name) {
        this.config.name = name;
        return this.config;
    }
    private() {
        this.config.private = true;
        return this.config;
    }
    setReadme(readme) {
        this.config.readme = readme;
        return this.config;
    }
}