{%- comment -%}
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
{%- endcomment -%}

{% assign configurator_url = shop.url | append: '/apps/dtf-configurator' %}

<div
  id="dtf-configurator-root"
  class="dtf-configurator-wrapper"
  data-shop="{{ shop.permanent_domain }}"
  data-variant-id="{{ block.settings.variant_id }}"
  style="
    width: 100%;
    min-height: {{ block.settings.min_height }}px;
    {% if block.settings.background_color != blank %}
    background-color: {{ block.settings.background_color }};
    {% endif %}
  "
>
  <iframe
    id="dtf-iframe"
    src="{{ configurator_url }}?shop={{ shop.permanent_domain }}"
    title="DTF Gang Sheet Configurator"
    allow="clipboard-write"
    style="
      width: 100%;
      border: none;
      min-height: {{ block.settings.min_height }}px;
      display: block;
    "
    loading="lazy"
  ></iframe>
</div>

<script>
  (function () {
    const iframe = document.getElementById('dtf-iframe');
    if (!iframe) return;

    // Auto-resize iframe to content
    window.addEventListener('message', function (event) {
      if (event.data && event.data.type === 'dtf-resize') {
        iframe.style.height = event.data.height + 'px';
      }
      // Redirect to cart after add
      if (event.data && event.data.type === 'dtf-cart-redirect') {
        window.location.href = '/cart';
      }
    });

    // Pass Shopify cart token to iframe
    fetch('/cart.js')
      .then(function (r) { return r.json(); })
      .then(function (cart) {
        iframe.contentWindow.postMessage(
          { type: 'dtf-cart-token', token: cart.token },
          '*'
        );
      });
  })();
</script>

{% schema %}
{
  "name": "DTF Configurator",
  "target": "section",
  "settings": [
    {
      "type": "text",
      "id": "variant_id",
      "label": "Shopify Variant ID",
      "info": "De numerieke variant ID van het DTF printproduct"
    },
    {
      "type": "range",
      "id": "min_height",
      "min": 600,
      "max": 1400,
      "step": 50,
      "unit": "px",
      "label": "Minimale hoogte",
      "default": 900
    },
    {
      "type": "color",
      "id": "background_color",
      "label": "Achtergrondkleur",
      "default": "#f9fafb"
    }
  ],
  "presets": [
    {
      "name": "DTF Gang Sheet Configurator",
      "settings": {
        "min_height": 900
      }
    }
  ]
}
{% endschema %}
