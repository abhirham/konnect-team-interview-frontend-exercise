<template>
  <header class="app-header">
    <span class="company-name">Kong</span>
    <nav class="app-nav">
      <router-link to="/">
        Home
      </router-link>
    </nav>
  </header>
  <main>
    <router-view />
  </main>
</template>

<style lang="scss" scoped>
@use '@/styles/variables' as *;

.app-header {
  align-items: center;
  background: linear-gradient(to bottom, #09224f, #073382);
  color: $color-header-text;
  display: flex;
  gap: 24px;
  margin-bottom: 40px;
  padding: 16px 20px;

  .company-name {
    font-size: $font-size-card-title;
    font-weight: $font-weight-bold;
  }

  .app-nav a {
    color: $color-header-text;
    font-weight: $font-weight-semibold;
    text-decoration: none;

    &.router-link-exact-active {
      text-decoration: underline;
    }
  }
}
</style>

<style lang="scss">
@use '@/styles/variables' as *;

// Unscoped styles for html and body
html {
  font-size: 10px;
  margin: 0;
  padding: 0;
}

body {
  background-color: #f8f8fa;
  color: $color-text-body;
  font-family: $font-family-base;
  font-size: 1.6rem;
  font-weight: $font-weight-regular;
  line-height: 1.2;
  margin: 0 auto;
}

// Form controls don't inherit the page font by default.
button,
input,
select,
textarea {
  font-family: inherit;
}
</style>
