@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  * {
    box-sizing: border-box;
  }

  body {
    font-family: "Inter", system-ui, sans-serif;
    background-color: #f9fafb;
    color: #1f2937;
  }
}

@layer components {
  .btn-primary {
    @apply bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed;
  }

  .btn-secondary {
    @apply bg-white hover:bg-gray-50 text-gray-700 font-medium py-2 px-4 rounded-lg border border-gray-300 transition-colors duration-150;
  }

  .card {
    @apply bg-white rounded-xl border border-gray-200 shadow-sm;
  }

  .label {
    @apply text-sm font-medium text-gray-600;
  }

  .checkerboard {
    background-image:
      linear-gradient(45deg, #e5e7eb 25%, transparent 25%),
      linear-gradient(-45deg, #e5e7eb 25%, transparent 25%),
      linear-gradient(45deg, transparent 75%, #e5e7eb 75%),
      linear-gradient(-45deg, transparent 75%, #e5e7eb 75%);
    background-size: 16px 16px;
    background-position:
      0 0,
      0 8px,
      8px -8px,
      -8px 0px;
  }
}

/* Konva canvas smooth rendering */
canvas {
  image-rendering: -webkit-optimize-contrast;
  image-rendering: crisp-edges;
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
::-webkit-scrollbar-track {
  background: #f1f5f9;
}
::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}
::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
