export function startBackground(T, element, s) {
  const renderer = new T.WebGLRenderer({ antialias: false, alpha: true });
  const scene = new T.Scene();
  const camera = new T.PerspectiveCamera(70, 1, 0.1, 100);
  camera.position.z = 5;
  const target = new T.WebGLRenderTarget(1, 1);
  const geometry = new T.BufferGeometry();
  const count = Number(s.particle_count);
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const seeds = Array.from({ length: count }, () => ({ offset: Math.random() * 2, speed: 0.12 + Math.random() * 0.05, y: (Math.random() - 0.5) * 4, bad: Math.random() < s.harmful_ratio }));
  const clean = new T.Color(s.clean_color), bad = new T.Color(s.harmful_color);
  geometry.setAttribute('position', new T.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new T.BufferAttribute(colors, 3));
  const material = new T.PointsMaterial({ size: 0.035, vertexColors: true, transparent: true, depthWrite: false, blending: T.AdditiveBlending });
  const points = new T.Points(geometry, material);
  points.frustumCulled = false;
  scene.add(points);
  const uniforms = { tex: { value: target.texture }, resolution: { value: new T.Vector2() }, time: { value: 0 }, power: { value: Number(s.refraction) }, spread: { value: Number(s.aberration) }, ripple: { value: Number(s.ripple) } };
  const glassMaterial = new T.ShaderMaterial({
    uniforms,
    vertexShader: 'varying vec2 vUv; void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}',
    fragmentShader: `
      uniform sampler2D tex;uniform vec2 resolution;uniform float time,power,spread,ripple;varying vec2 vUv;
      void main(){
        vec2 uv=gl_FragCoord.xy/resolution;
        float edge=1.0-smoothstep(0.0,0.05,min(vUv.x,1.0-vUv.x));
        float wave=sin(vUv.y*20.0+time*2.0)+sin(vUv.y*12.0-time*1.5);
        vec2 bend=vec2((vUv.x-0.5)*0.025+wave*ripple*(0.002+edge*0.035),cos(vUv.y*15.0+time)*edge*0.015)*power;
        float chrom=spread*(0.5+edge*3.0);
        vec3 c=vec3(texture2D(tex,clamp(uv+bend*(1.0+chrom*0.28),vec2(0.0),vec2(1.0))).r,texture2D(tex,clamp(uv+bend*(1.0+chrom*0.14),vec2(0.0),vec2(1.0))).g,texture2D(tex,clamp(uv+bend,vec2(0.0),vec2(1.0))).b);
        c+=(0.5+0.5*cos(vec3(0.0,2.1,4.2)+vUv.y*8.0+time*0.3))*edge*0.08;
        gl_FragColor=vec4(c,clamp(max(c.r,max(c.g,c.b))*4.0+edge*0.15,0.0,1.0));
      }`,
    transparent: true, depthWrite: false
  });
  const glassGeometry = new T.PlaneGeometry(Number(s.glass_width), 32);
  const glass = new T.Mesh(glassGeometry, glassMaterial);
  scene.add(glass);
  let destroyed = false, time = 0, last = performance.now();
  const media = matchMedia('(max-width: 767px), (prefers-reduced-motion: reduce)');
  function resize() {
    const w = Math.max(1, innerWidth), h = Math.max(1, innerHeight);
    renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
    renderer.setSize(w, h, false);
    camera.aspect = w / h; camera.updateProjectionMatrix();
    renderer.getDrawingBufferSize(uniforms.resolution.value);
    target.setSize(uniforms.resolution.value.x, uniforms.resolution.value.y);
  }
  function render() {
    const now = performance.now();
    time += Math.min((now - last) / 1000, 0.1);last = now;
    seeds.forEach((p, i) => {
      const x = (((time * p.speed * Number(s.particle_speed) + p.offset) % 2) - 1) * 5;
      const zap = p.bad ? T.MathUtils.clamp((x + Number(s.glass_width) / 2) / 0.6, 0, 1) : 0;
      positions[i * 3] = x;positions[i * 3 + 1] = p.y + Math.sin(time * 2 + p.offset * 10) * 0.08;positions[i * 3 + 2] = -2;
      const color = p.bad ? bad : clean;
      const fade = (1 - zap) * Math.min(1, Math.max(0, (5 - Math.abs(x)) / 1.5));
      colors[i * 3] = color.r * fade; colors[i * 3 + 1] = color.g * fade; colors[i * 3 + 2] = color.b * fade;
    });
    geometry.attributes.position.needsUpdate = true;geometry.attributes.color.needsUpdate = true;
    uniforms.time.value = time;
    glass.visible = false; renderer.setRenderTarget(target);renderer.render(scene, camera);
    renderer.setRenderTarget(null);glass.visible = true;renderer.render(scene, camera);
  }
  function sync() {
    if (destroyed) return;
    last = performance.now();
    renderer.setAnimationLoop(document.hidden || media.matches ? null : render);
  }
  const observer = new ResizeObserver(resize);
  const onLost = (event) => { event.preventDefault();renderer.setAnimationLoop(null); };
  const onRestored = () => { resize();sync(); };
  try {
    element.appendChild(renderer.domElement);resize();observer.observe(element);
    document.addEventListener('visibilitychange', sync);media.addEventListener('change', sync);
    renderer.domElement.addEventListener('webglcontextlost', onLost);renderer.domElement.addEventListener('webglcontextrestored', onRestored);
    sync();
  } catch (error) { cleanup();throw error; }
  function cleanup() {
    if (destroyed) return;destroyed = true;renderer.setAnimationLoop(null);observer.disconnect();
    document.removeEventListener('visibilitychange', sync);media.removeEventListener('change', sync);
    renderer.domElement.removeEventListener('webglcontextlost', onLost);renderer.domElement.removeEventListener('webglcontextrestored', onRestored);
    geometry.dispose();material.dispose();glassGeometry.dispose();glassMaterial.dispose();target.dispose();renderer.dispose();renderer.domElement.remove();
  }
  return cleanup;
}
