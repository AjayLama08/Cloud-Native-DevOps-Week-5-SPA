import type { ListReviewsOutput, ReviewDeps } from './review-service';

export type ListReviewsResult = {
  readonly success: true;
  readonly data: ListReviewsOutput;
};

export async function listReviews(
  deps: ReviewDeps,
): Promise<ListReviewsResult> {
  const data = await deps.reviewService.listReviews();
  return { success: true, data };
}
