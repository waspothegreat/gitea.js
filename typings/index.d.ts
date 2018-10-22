declare module 'gitea.js' {

export class Gitea {
  constructor(options: object);
  public readonly version: string;
  public getVersion(): Promise<string>;
  public getUserInfo(): Promise<object>;
  public getEmail(): Promise<Array>;
  public getFollowers(): Promise<Array>;
  public getFollowing(): Promise<Array>;
  public getRepositories(): Promise<Array>;
  public getRepositoryForks(owner: string, repo: string): Promise<Array>;
  public createRepoHook(owner: string, repo: string, active: boolean, contenttype: string, url: string, events: Array, type: string): Promise<object>;
  public forkRepository(owner: string, repo: string, org: string): Promise<Array>;
  public getOrganization(org: string): Promise<object>;
  public editOrganization(org: string, config: object): Promise<Array>;
  public createOrgRepo(org: string, config: object): Promise<Array>;
  public getOrgTeams(org: string): Promise<Array>;
  public getOrgMembers(org: string): Promise<Array>;
  public getOrgWebhooks(org: string): Promise<Array>;
  public createOrgWebhook(org: string): Promise<Array>;
  public createOrgTeam(org: string, desc: string, name: string, perm: string): Promise<Array>;
  public deleteOrgHook(org: string, id: string): Promise<void>;
  public getOrgHook(org: string, id: string): Promise<object>;
  public starRepo(owner: string, repo: string): Promise<void>;
  public makeRepository(config: object): Promise<object>;
  public getUsers(): Promise<Array>;
  public getUserOrgs(): Promise<Array>;
  public getUser(username: string): Promise<Array>;
  public getRepositoryLabels(owner: string, repo: string): Promise<Array>;
  public getStarredRepos(): Promise<Array>;
  public addUserEmail(emails: string[]): Promise<Array>;
  public followUser(username: string): Promise<void>;
  public unfollowUser(username: string): Promise<void>;
  public getRepository(owner: string, repo: string): Promise<Array>;
  public getUserRepositories(username: string): Promise<Array>;
  }

export class RepoBuilder {
  constructor();
  public autoInit(): this;
  public setDescription(desc: string): this;
  public setGitIgnores(gitignores: string): this;
  public setLicense(license: string): this;
  public setName(name: string): this;
  public private(): this;
  public setReadme(readme: string): this;
  }
}
