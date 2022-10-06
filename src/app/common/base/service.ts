import { BaseRepository } from "./repository";

abstract class BaseService<T = any> {
  protected repos: Record<string, BaseRepository<T>> = {};

  public isUserOwn(userId: string, resourceId: string) {
    return this.repos.userRepository.isUserOwn(userId, resourceId);
  }

  public getRepositories() {
    return this.repos;
  }
}

export { BaseService };
