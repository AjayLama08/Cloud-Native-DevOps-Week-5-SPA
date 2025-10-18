import { createReviewContent } from '../domain/review';
import type { Review, ValidationIssue } from '../domain/review';
import type { ReviewDeps } from './review-service';

export type AddReviewResult =
  | { readonly success: true; readonly data: Review }
  | { readonly success: false; readonly issues: readonly ValidationIssue[] };

// Command used by the application layer (decoupled from service DTOs)
export type AddReviewCommand = {
  readonly rating: number;
  readonly title: string;
  readonly comment: string;
};

export async function addReview(
  deps: ReviewDeps,
  command: AddReviewCommand,
): Promise<AddReviewResult> {
  const content = createReviewContent(command);
  if (!content.success) return content;

  return deps.reviewService.addReview(content.data);
}
