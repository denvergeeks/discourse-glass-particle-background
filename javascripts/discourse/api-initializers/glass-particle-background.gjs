import Component from '@glimmer/component';
import { action } from '@ember/object';
import { registerDestructor } from '@ember/destroyable';
import { service } from '@ember/service';
import didInsert from '@ember/render-modifiers/modifiers/did-insert';
import { apiInitializer } from 'discourse/lib/api';
import { startTwinklingGrid } from '../lib/glass-particle-background';

class TwinklingGridBackground extends Component {
  @service site;
  element;
  cleanup;
  disposed = false;

  constructor() {
    super(...arguments);
    registerDestructor(this, () => {
      this.disposed = true;
      this.cleanup?.();
    });
  }

  @action
  mount(element) {
    this.element = element;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    try {
      if (!this.disposed) {
        this.cleanup = startTwinklingGrid(element, settings);
      }
    } catch (error) {
      console.warn('[twinkling-grid-background] Unable to initialize', error);
    }
  }

  <template>
    <div class="glass-particle-background" aria-hidden="true" {{didInsert this.mount}}></div>
  </template>
}

export default apiInitializer((api) => {
  if (!settings.enabled) {
    return;
  }
  api.renderInOutlet('above-main-container', TwinklingGridBackground);
});
