import type { InjectionKey } from 'vue';
import type { ReviewDeps } from '../app/review-service';

export const REVIEW_DEPS_KEY: InjectionKey<ReviewDeps> = Symbol('ReviewDeps');
