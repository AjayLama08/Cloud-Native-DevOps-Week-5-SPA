import { createReviewContent } from '../src/domain/review';

const valid = createReviewContent({
  rating: 5,
  title: '  Excellent course example  ',
  comment: '  The original whitespace is preserved.  ',
});
const invalid = createReviewContent({
  rating: 2.5,
  title: '   ',
  comment: '',
});

console.log('Valid review content:');
console.log(JSON.stringify(valid, null, 2));
console.log('Invalid review content:');
console.log(JSON.stringify(invalid, null, 2));
