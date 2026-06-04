<template>
  <component :is="tag === 'button' ? 'button' : 'NuxtLink'" :to="to" :disabled="disabled"
    class="btn relative cursor-pointer inline-flex items-center justify-center overflow-hidden font-medium transition-all duration-300 focus:outline-none disabled:opacity-50 disabled:pointer-events-none"
    :class="[
      variantClasses[variant],
      sizeClasses[size],
      customClass
    ]" @mousedown="createRipple" @click="hapticImpact('light')">
    <span class="content-flex relative z-10 pointer-events-none">
      <slot />
    </span>
  </component>
</template>


<script setup>
const { hapticImpact } = useTelegram()
const props = defineProps({
  tag: { type: String, default: 'button' },
  to: { type: String, default: null },
  variant: { type: String, default: 'primary' },
  size: { type: String, default: 'md' },
  disabled: { type: Boolean, default: false },
  customClass: { type: String, default: '' }
});

const variantClasses = {
  primary: 'bg-[#dc2626] text-white hover:bg-[#dc2626] active:bg-[#dc2626]',
  secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200 active:bg-gray-300',
  outline: 'border-2 border-blue-600 text-blue-600 hover:bg-blue-50',
  dark: 'bg-black text-white hover:bg-zinc-900'
};

const sizeClasses = {
  sm: 'px-4 py-1.5 text-sm rounded-lg',
  md: 'px-6 py-2.5 text-base rounded-xl',
  lg: 'px-8 py-3.5 text-lg rounded-2xl'
};

const createRipple = (event) => {
  if (props.disabled) return;

  const button = event.currentTarget;
  const ripple = document.createElement('span');
  const rect = button.getBoundingClientRect();

  const size = Math.max(rect.width, rect.height);
  const x = event.clientX - rect.left - size / 2;
  const y = event.clientY - rect.top - size / 2;

  ripple.style.width = ripple.style.height = `${size}px`;
  ripple.style.left = `${x}px`;
  ripple.style.top = `${y}px`;

  ripple.className = 'absolute rounded-full bg-white/30 pointer-events-none animate-ripple z-0';

  const prevRipple = button.querySelector('.animate-ripple');
  if (prevRipple) prevRipple.remove();

  button.appendChild(ripple);

  setTimeout(() => ripple.remove(), 600);
};
</script>

<style>
@keyframes ripple {
  from {
    transform: scale(0);
    opacity: 1;
  }

  to {
    transform: scale(4);
    opacity: 0;
  }
}

.animate-ripple {
  animation: ripple 600ms linear forwards;
}

.btn:active {
  transform: scale(99%);
}

.content-flex {
  padding: 10px 12px;
}

.content-flex {
  display: flex;
  align-items: center;
  gap: 10px;
}
</style>
