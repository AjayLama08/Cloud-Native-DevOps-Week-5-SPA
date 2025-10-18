import { addReview } from '../src/app/add-review';
import { listReviews } from '../src/app/list-reviews';
import type { ReviewDeps } from '../src/app/review-service';
import { FakeReviewService } from '../src/infra/fake-review-service';

const deps: ReviewDeps = {
  reviewService: new FakeReviewService({
    generateId: () => 'demo-review-1',
    now: () => new Date('2026-01-15T12:00:00.000Z'),
  }),
};

const added = await addReview(deps, {
  rating: 5,
  title: 'Deterministic demo',
  comment:
    'The use case receives an in-memory adapter through its dependencies.',
});
const listed = await listReviews(deps);

console.log('Add result:');
console.log(JSON.stringify(added, null, 2));
console.log('List result:');
console.log(JSON.stringify(listed, null, 2));
