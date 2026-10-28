import Component from '@glimmer/component';
import { action } from '@ember/object';
import { registerDestructor } from '@ember/destroyable';
import { service } from '@ember/service';
import didInsert from '@ember/render-modifiers/modifiers/did-insert';
import { apiInitializer } from 'discourse/lib/api';
import loadScript from 'discourse/lib/load-script';
import { startBackground } from '../lib/glass-particle-background';

class GlassBackground extends Component {
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
  async mount(element) {
    this.element = element;
    element.style.opacity = String(settings.background_opacity);
    if (this.site.mobileView || window.matchMedia('(max-width: 767px), (prefers-reduced-motion: reduce)').matches) {
      return;
    }
    try {
      if (!window.THREE) {
        await loadScript('https://cdn.jsdelivr.net/npm/three@0.160.1/build/three.min.js');
      }
      if (!this.disposed) {
        this.cleanup = startBackground(window.THREE, element, settings);
      }
    } catch (error) {
      console.warn('[glass-particle-background] Unable to initialize', error);
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
  api.renderInOutlet('above-main-container', GlassBackground);
});
