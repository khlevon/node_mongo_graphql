import { TOrderBy, TPagination } from "../../../types/app";
import { BaseService } from "../../common/base/service";
import { HTTPStatuses } from "../../common/constants/httpStatuses";
import { AppError } from "../../common/errors/app.error";
import { toObjectId } from "../../common/utils";
import { TComment } from "./comment.entity";
import { IComment } from "./comment.model";
import { CommentRepository } from "./comment.repository";

class CommentService extends BaseService<IComment> {
  protected repos: {
    commentRepository: CommentRepository;
  };

  constructor(commentRepository: CommentRepository) {
    super();
    this.repos = {
      commentRepository,
    };
  }

  public async getAll(
    pagination: Required<TPagination> = {
      offset: 0,
      limit: 0,
    },
    orderBy: Required<TOrderBy> = {
      field: "createdAt",
      direction: "desc",
    },
    filter: {
      productId?: string;
      ownerId?: string;
      replyToId?: string | null;
    } = {}
  ) {
    const { count, comments } = await this.repos.commentRepository.getAll(
      pagination,
      orderBy,
      filter
    );

    return {
      count,
      payload: comments,
    };
  }

  public async getOneById(id: string) {
    const comment = await this.repos.commentRepository.getOne({ id });

    if (!comment) {
      throw new AppError("Comment not found", {
        status: HTTPStatuses.NOT_FOUND,
      });
    }

    return comment;
  }

  public async createOne(data: TComment) {
    if (data.replyToId) {
      const comment = await this.getOneById(data.replyToId);
      if (!comment) {
        throw new AppError(`Parent comment not found`, {
          status: HTTPStatuses.NOT_FOUND,
        });
      }
    }

    const comment = await this.repos.commentRepository.create(data);

    return comment;
  }

  public async deleteOneById(id: string) {
    const comment = await this.getOneById(id);

    await this.repos.commentRepository.deleteOne({
      id: toObjectId(id),
    });

    return comment;
  }
}

export { CommentService };
