<template>
  <div>
    <div class="gooey-container" ref="containerRef">
      <nav class="gooey-nav" :style="{ transform: 'translate3d(0,0,0.01px)' }">
        <ul ref="navRef" class="nav-list" :style="{
          color: 'white',
          textShadow: '0 1px 1px hsl(205deg 30% 10% / 0.2)'
        }">
          <li v-for="(item, index) in items" :key="index" :class="[
            'nav-item',
            { active: activeIndex === index }
          ]">
            <a :href="item.href || undefined" @click.prevent="e => handleClick(e, index)"
              @keydown="e => handleKeyDown(e, index)" class="nav-link">
              {{ item.label }}
            </a>
          </li>
        </ul>
      </nav>

      <span class="effect filter" ref="filterRef" />
      <span class="effect text" ref="textRef" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue';

interface GooeyNavItem {
  label: string;
  href: string | null;
}

interface GooeyNavProps {
  items: GooeyNavItem[];
  animationTime?: number;
  particleCount?: number;
  particleDistances?: [number, number];
  particleR?: number;
  timeVariance?: number;
  colors?: number[];
  initialActiveIndex?: number;
}

const props = withDefaults(defineProps<GooeyNavProps>(), {
  animationTime: 600,
  particleCount: 15,
  particleDistances: () => [90, 10],
  particleR: 100,
  timeVariance: 300,
  colors: () => [1, 2, 3, 1, 2, 3, 1, 4],
  initialActiveIndex: 0
});

const containerRef = ref<HTMLDivElement | null>(null);
const navRef = ref<HTMLUListElement | null>(null);
const filterRef = ref<HTMLSpanElement | null>(null);
const textRef = ref<HTMLSpanElement | null>(null);

const activeIndex = ref<number>(props.initialActiveIndex);
let resizeObserver: ResizeObserver | null = null;

const noise = (n = 1) => n / 2 - Math.random() * n;

const getXY = (distance: number, pointIndex: number, totalPoints: number): [number, number] => {
  const angle = ((360 + noise(8)) / totalPoints) * pointIndex * (Math.PI / 180);
  return [distance * Math.cos(angle), distance * Math.sin(angle)];
};

const createParticle = (i: number, t: number, d: [number, number], r: number) => {
  const rotate = noise(r / 10);
  return {
    start: getXY(d[0], props.particleCount - i, props.particleCount),
    end: getXY(d[1] + noise(7), props.particleCount - i, props.particleCount),
    time: t,
    scale: 1 + noise(0.2),
    color: props.colors[Math.floor(Math.random() * props.colors.length)],
    rotate: rotate > 0 ? (rotate + r / 20) * 10 : (rotate - r / 20) * 10
  };
};

const makeParticles = (element: HTMLElement) => {
  const d: [number, number] = props.particleDistances;
  const r = props.particleR;
  const bubbleTime = props.animationTime * 2 + props.timeVariance;
  element.style.setProperty('--time', `${bubbleTime}ms`);

  for (let i = 0; i < props.particleCount; i++) {
    const t = props.animationTime * 2 + noise(props.timeVariance * 2);
    const p = createParticle(i, t, d, r);
    element.classList.remove('active');

    setTimeout(() => {
      const particle = document.createElement('span');
      const point = document.createElement('span');
      particle.classList.add('particle');
      particle.style.setProperty('--start-x', `${p.start[0]}px`);
      particle.style.setProperty('--start-y', `${p.start[1]}px`);
      particle.style.setProperty('--end-x', `${p.end[0]}px`);
      particle.style.setProperty('--end-y', `${p.end[1]}px`);
      particle.style.setProperty('--time', `${p.time}ms`);
      particle.style.setProperty('--scale', `${p.scale}`);
      particle.style.setProperty('--color', `var(--color-${p.color}, #00FFFF)`);
      particle.style.setProperty('--rotate', `${p.rotate}deg`);

      point.classList.add('point');
      particle.appendChild(point);
      element.appendChild(particle);

      requestAnimationFrame(() => {
        element.classList.add('active');
      });

      setTimeout(() => {
        try { element.removeChild(particle); } catch { }
      }, t);
    }, 30);
  }
};

const updateEffectPosition = (index: number) => {
  if (!containerRef.value || !filterRef.value || !textRef.value || !navRef.value) return;

  const liEls = navRef.value.querySelectorAll('li');
  const activeLi = liEls[index] as HTMLElement;
  if (!activeLi) return;

  const containerRect = containerRef.value.getBoundingClientRect();
  const pos = activeLi.getBoundingClientRect();
  const styles = {
    left: `${pos.x - containerRect.x}px`,
    top: `${pos.y - containerRect.y}px`,
    width: `${pos.width}px`,
    height: `${pos.height}px`
  };

  Object.assign(filterRef.value.style, styles);
  Object.assign(textRef.value.style, styles);
  textRef.value.innerText = activeLi.innerText;
};

const handleClick = (e: Event, index: number) => {
  if (activeIndex.value === index) return;
  activeIndex.value = index;

  updateEffectPosition(index);

  if (filterRef.value) {
    const particles = filterRef.value.querySelectorAll('.particle');
    particles.forEach(p => filterRef.value!.removeChild(p));
    makeParticles(filterRef.value);
  }

  if (textRef.value) {
    textRef.value.classList.remove('active');
    void textRef.value.offsetWidth;
    textRef.value.classList.add('active');
  }
};

const handleKeyDown = (e: KeyboardEvent, index: number) => {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    handleClick(e, index);
  }
};

watch(activeIndex, (newIndex) => {
  updateEffectPosition(newIndex);
  textRef.value?.classList.add('active');
});

onMounted(() => {
  setTimeout(() => {
    updateEffectPosition(activeIndex.value);
    textRef.value?.classList.add('active');
  }, 50);

  resizeObserver = new ResizeObserver(() => {
    updateEffectPosition(activeIndex.value);
  });
  if (containerRef.value) {
    resizeObserver.observe(containerRef.value);
  }
});

onUnmounted(() => {
  if (resizeObserver) {
    resizeObserver.disconnect();
  }
});
</script>
<style>
/* 1. 全局颜色变量与缓动曲线 */
:root {
  --color-1: #00FFFF;
  --color-2: #FFC0CB;
  --color-3: #F0E68C;
  --color-4: #8400ff;
  --linear-ease: linear(0, 0.068, 0.19 2.7%, 0.804 8.1%, 1.037, 1.199 13.2%, 1.245, 1.27 15.8%, 1.274, 1.272 17.4%, 1.249 19.1%, 0.996 28%, 0.949, 0.928 33.3%, 0.926, 0.933 36.8%, 1.001 45.6%, 1.013, 1.019 50.8%, 1.018 54.4%, 1 63.1%, 0.995 68%, 1.001 85%, 1);
}

/* 2. 基础布局容器 */
.gooey-container {
  position: relative;
}

.gooey-nav {
  display: flex;
  position: relative;
}

.nav-list {
  display: flex;
  gap: 2rem;
  list-style: none;
  padding: 0 1rem;
  margin: 0;
  position: relative;
  z-index: 3;
}

/* 3. 导航项基础样式 */
.nav-item {
  border-radius: 9999px;
  position: relative;
  cursor: pointer;
  transition: color 0.3s ease;
  color: white;
}

.nav-link {
  outline: none;
  padding: 0.6em 1em;
  display: inline-block;
  text-decoration: none;
  color: inherit;
}

/* 4. 滑动特效图层 (过滤层和文字层) */
.effect {
  position: absolute;
  pointer-events: none;
  display: grid;
  place-items: center;
  z-index: 1;
}

/* 跟随滑动的文字层（盖在白底上变为黑色） */
.effect.text {
  color: white;
  transition: color 0.3s ease;
}

.effect.text.active {
  color: black;
}

/* 跟随滑动的背景与粒子容器 */
.effect.filter {
  z-index: -1;
}

/* 5. 白色胶囊背景滑块 */
.effect.filter::after {
  content: '';
  position: absolute;
  inset: 0;
  background: white;
  border-radius: 9999px;
  transform: scale(0);
  opacity: 0;
  z-index: -1;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.effect.active::after {
  animation: pill 0.3s cubic-bezier(0.4, 0, 0.2, 1) both;
}

@keyframes pill {
  0% {
    transform: scale(0.8);
    opacity: 0;
  }

  100% {
    transform: scale(1);
    opacity: 1;
  }
}

/* 6. 弹射粒子（小球）样式 */
.particle,
.point {
  display: block;
  opacity: 0;
  width: 20px;
  height: 20px;
  border-radius: 9999px;
  transform-origin: center;
}

.particle {
  --time: 5s;
  position: absolute;
  top: calc(50% - 10px);
  /* 修正居中对齐，20px的一半是10px */
  left: calc(50% - 10px);
  animation: particle calc(var(--time)) ease 1 -350ms;
}

.point {
  background: var(--color);
  opacity: 1;
  animation: point calc(var(--time)) ease 1 -350ms;
  box-shadow: inset 0 0 4px rgba(255, 255, 255, 0.5);
  /* 玻璃球光泽感 */
}

/* 7. 粒子动画关键帧 */
@keyframes particle {
  0% {
    transform: rotate(0deg) translate(calc(var(--start-x)), calc(var(--start-y)));
    opacity: 1;
    animation-timing-function: cubic-bezier(0.55, 0, 1, 0.45);
  }

  70% {
    transform: rotate(calc(var(--rotate) * 0.5)) translate(calc(var(--end-x) * 1.2), calc(var(--end-y) * 1.2));
    opacity: 1;
    animation-timing-function: ease;
  }

  85% {
    transform: rotate(calc(var(--rotate) * 0.66)) translate(calc(var(--end-x)), calc(var(--end-y)));
    opacity: 1;
  }

  100% {
    transform: rotate(calc(var(--rotate) * 1.2)) translate(calc(var(--end-x) * 0.5), calc(var(--end-y) * 0.5));
    opacity: 1;
  }
}

@keyframes point {
  0% {
    transform: scale(0);
    opacity: 0;
    animation-timing-function: cubic-bezier(0.55, 0, 1, 0.45);
  }

  25% {
    transform: scale(calc(var(--scale) * 0.25));
  }

  38% {
    opacity: 1;
  }

  65% {
    transform: scale(var(--scale));
    opacity: 1;
    animation-timing-function: ease;
  }

  85% {
    transform: scale(var(--scale));
    opacity: 1;
  }

  100% {
    transform: scale(0);
    opacity: 0;
  }
}

/* 当前激活状态的原生文字颜色，确保被盖住的底字也是黑色防止白边 */
li.active {
  color: black;
  text-shadow: none;
}
</style>