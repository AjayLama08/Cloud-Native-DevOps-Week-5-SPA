export type ValidationIssue = {
  readonly field: string;
  readonly message: string;
};

export type ReviewContent = {
  readonly rating: number;
  readonly title: string;
  readonly comment: string;
};

export type Review = ReviewContent & {
  readonly id: string;
  readonly createdAt: Date;
};

export type ReviewContentInput = {
  readonly rating: unknown;
  readonly title: unknown;
  readonly comment: unknown;
};

export type ReviewInput = ReviewContentInput & {
  readonly id: unknown;
  readonly createdAt: unknown;
};

export type CreateReviewContentResult =
  | { readonly success: true; readonly data: ReviewContent }
  | { readonly success: false; readonly issues: readonly ValidationIssue[] };

export type CreateReviewResult =
  | { readonly success: true; readonly data: Review }
  | { readonly success: false; readonly issues: readonly ValidationIssue[] };

export const REVIEW_TITLE_MAX_LENGTH = 200;
export const REVIEW_COMMENT_MAX_LENGTH = 5000;

export function createReviewContent(
  input: ReviewContentInput,
): CreateReviewContentResult {
  const issues: ValidationIssue[] = [];
  const rating =
    typeof input.rating === 'number' &&
    Number.isFinite(input.rating) &&
    Number.isInteger(input.rating) &&
    input.rating >= 1 &&
    input.rating <= 5
      ? input.rating
      : undefined;
  const title =
    typeof input.title === 'string' &&
    input.title.trim().length > 0 &&
    input.title.length <= REVIEW_TITLE_MAX_LENGTH
      ? input.title
      : undefined;
  const comment =
    typeof input.comment === 'string' &&
    input.comment.trim().length > 0 &&
    input.comment.length <= REVIEW_COMMENT_MAX_LENGTH
      ? input.comment
      : undefined;

  if (rating === undefined) {
    issues.push({
      field: 'rating',
      message: 'Rating must be an integer between 1 and 5',
    });
  }

  if (title === undefined) {
    issues.push({
      field: 'title',
      message: `Title must be between 1 and ${REVIEW_TITLE_MAX_LENGTH} characters`,
    });
  }

  if (comment === undefined) {
    issues.push({
      field: 'comment',
      message: `Comment must be between 1 and ${REVIEW_COMMENT_MAX_LENGTH} characters`,
    });
  }

  if (
    issues.length > 0 ||
    rating === undefined ||
    title === undefined ||
    comment === undefined
  ) {
    return { success: false, issues };
  }

  return {
    success: true,
    data: {
      rating,
      title,
      comment,
    },
  };
}

// Received records have identity and time invariants in addition to content rules.
// Keeping this separate avoids treating corrupt remote data as form validation.
export function createReview(input: ReviewInput): CreateReviewResult {
  const content = createReviewContent(input);
  const issues: ValidationIssue[] = content.success ? [] : [...content.issues];
  const id =
    typeof input.id === 'string' && input.id.trim().length > 0
      ? input.id
      : undefined;
  const createdAt =
    input.createdAt instanceof Date &&
    Number.isFinite(input.createdAt.getTime())
      ? input.createdAt
      : undefined;

  if (id === undefined) {
    issues.push({ field: 'id', message: 'ID is required and cannot be empty' });
  }

  if (createdAt === undefined) {
    issues.push({
      field: 'createdAt',
      message: 'Created date must be a valid Date',
    });
  }

  if (
    issues.length > 0 ||
    !content.success ||
    id === undefined ||
    createdAt === undefined
  ) {
    return { success: false, issues };
  }

  return {
    success: true,
    data: {
      id,
      ...content.data,
      createdAt: new Date(createdAt.getTime()),
    },
  };
}
