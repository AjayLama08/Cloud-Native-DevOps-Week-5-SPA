import type { ReviewDeps } from '../app/review-service';
import { FakeReviewService } from '../infra/fake-review-service';
import { HttpReviewService } from '../infra/http-review-service';
import { seedReviews } from '../seed/reviews';
import type { AppSettings } from './app-settings';

export function createReviewDeps(settings: AppSettings): ReviewDeps {
  if (settings.reviewsService === 'http') {
    return {
      reviewService: new HttpReviewService({
        baseUrl: settings.reviewsBaseUrl,
      }),
    };
  }

  return {
    reviewService: new FakeReviewService({
      initial: settings.useSeedData ? seedReviews : [],
    }),
  };
}
