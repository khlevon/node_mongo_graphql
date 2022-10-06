import { PipelineStage } from "mongoose";
import { AggregateOptions } from "mongodb";

abstract class BaseRepository<T> {
  public abstract isUserOwn: (userId: string, id: string) => Promise<boolean>;

  public abstract runAggregation: <R = any>(
    pipeline: PipelineStage[],
    options?: AggregateOptions
  ) => Promise<R[]>;
}

export { BaseRepository };
