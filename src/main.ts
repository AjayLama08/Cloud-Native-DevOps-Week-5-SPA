import { createApp } from 'vue';
import App from './App.vue';
import { REVIEW_DEPS_KEY } from './composables/reviews-key';
import router from './router';

async function bootstrap(): Promise<void> {
  try {
    const [{ appSettings }, { createReviewDeps }] = await Promise.all([
      import('./config/app-settings'),
      import('./config/composition-root'),
    ]);

    const app = createApp(App);
    app.use(router);
    app.provide(REVIEW_DEPS_KEY, createReviewDeps(appSettings));
    app.mount('#app');
  } catch {
    console.error(
      'Reviews app startup failed. Check the public configuration.',
    );
    const target = document.querySelector('#app');
    if (target) {
      target.textContent =
        'The reviews app could not start. Check its public configuration and reload.';
    }
  }
}

void bootstrap();
