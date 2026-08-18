<script setup>
</script>

<template>
  <header class="bg-navy border-b border-navy-light sticky top-0 z-40 shadow-sm">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">

        <div class="flex items-center gap-3 min-w-0">
          <div
            class="flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center"
            style="background-color: #1A6B5A;"
            aria-hidden="true"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect x="3" y="12" width="2.5" height="5" fill="white" rx="0.5" />
              <rect x="7" y="8" width="2.5" height="9" fill="white" rx="0.5" />
              <rect x="11" y="10" width="2.5" height="7" fill="white" rx="0.5" />
              <rect x="15" y="6" width="2.5" height="11" fill="white" rx="0.5" />
              <rect x="2" y="4" width="16" height="1.5" fill="#E8A020" rx="0.5" />
            </svg>
          </div>

          <div class="min-w-0">
            <p class="text-xs font-medium text-slate-300 tracking-widest uppercase leading-none">
              Rede Pop Ceará
            </p>
            <h1 class="text-white font-semibold text-base leading-tight truncate">
              Mapa de Museus
            </h1>
          </div>
        </div>

        <div class="hidden sm:flex items-center gap-2 text-xs">
          <span
            class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-medium"
            style="background-color: rgba(232,160,32,0.15); color: #E8A020;"
          >
            <span class="w-1.5 h-1.5 rounded-full bg-current" aria-hidden="true"></span>
            ODS 10 · ODS 11
          </span>
          <a
            href="https://github.com/"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-slate-600 text-slate-300 hover:text-white hover:border-slate-400 transition-colors"
            aria-label="Código-fonte no GitHub"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
            </svg>
            Open Source
          </a>
        </div>
      </div>
    </div>
  </header>
</template>
