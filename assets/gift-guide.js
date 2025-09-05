/**
 * Gift Guide custom popup and grid logic (vanilla JS only)
 * Handles product popup, dynamic variant rendering, and add-to-cart logic.
 */
document.addEventListener('DOMContentLoaded', function() {
  // Open popup when clicking a grid item
  document.querySelectorAll('.gift-guide-grid__item').forEach(function(item) {
    item.addEventListener('click', function() {
      const handle = item.getAttribute('data-handle');
      openGiftGuidePopup(handle);
    });
    item.addEventListener('keypress', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const handle = item.getAttribute('data-handle');
        openGiftGuidePopup(handle);
      }
    });
  });

  // Popup close logic
  document.addEventListener('click', function(e) {
    if (
      e.target.classList.contains('gift-guide-popup__close') ||
      e.target.classList.contains('gift-guide-popup__overlay')
    ) {
      closeGiftGuidePopup();
    }
  });

  /**
   * Opens the product popup, renders product details and variants.
   * @param {string} handle - Shopify product handle
   */
  function openGiftGuidePopup(handle) {
    fetch('/products/' + handle + '.js')
      .then(function(response) {
        return response.json();
      })
      .then(function(product) {
        renderGiftGuidePopup(product);
      });
    document.getElementById('gift-guide-popup').style.display = 'flex';
  }

  /**
   * Closes the product popup and clears dynamic content.
   */
  function closeGiftGuidePopup() {
    document.getElementById('gift-guide-popup').style.display = 'none';
    document.getElementById('gift-guide-popup-dynamic').innerHTML = '';
  }

  /**
   * Renders the product popup with dynamic variant selectors and "Add to Cart".
   * @param {object} product - Shopify product object from /products/{handle}.js
   */
  function renderGiftGuidePopup(product) {
    // Identify which option is Color and which is Size
//     // Detect option positions (Color vs Size)
//     // Detect which option is Color / Size
//     var option1Name = product.options[0] || '';
//     var option2Name = product.options[1] || '';
//     var colors = [], sizes = [];

//     // Identify color & size indexes
//     var colorOptionIndex = option1Name.toLowerCase().includes('color') ? 1 : 2;
//     var sizeOptionIndex = option1Name.toLowerCase().includes('size') ? 1 : 2;

//     product.variants.forEach(function(v) {
//       var c = (colorOptionIndex === 1 ? v.option1 : v.option2);
//       var s = (sizeOptionIndex === 1 ? v.option1 : v.option2);
//       if (c && colors.indexOf(c) === -1) colors.push(c);
//       if (s && sizes.indexOf(s) === -1) sizes.push(s);
//     });

//     var selectedColor = colors[0] || '';
//     var selectedSize = sizes[0] || '';

//     // Build UI
//     var colorsHtml = colors.map(function(color) {
//       return '<button type="button" class="gift-guide-popup__color-btn' +
//         (color === selectedColor ? ' selected' : '') +
//         '" data-color="' + color + '">' + color + '</button>';
//     }).join('');

//     var sizesHtml = '<option value="">Choose your size</option>' +
//       sizes.map(function(size) {
//         return '<option value="' + size + '">' + size + '</option>';
//       }).join('');

//     document.getElementById('gift-guide-popup-dynamic').innerHTML = `
//       <div class="gift-guide-popup__top">
//         <div class="gift-guide-popup__left">
//           <img class="gift-guide-popup__img" src="${product.featured_image}" alt="${product.title}">
//         </div>
//         <div class="gift-guide-popup__right">
//           <div class="gift-guide-popup__product-title">${product.title}</div>
//           <div class="gift-guide-popup__product-price">
//             ${(window.Shopify && Shopify.formatMoney) ? Shopify.formatMoney(product.price) : (product.price/100 + ' USD')}
//           </div>
//           <div class="gift-guide-popup__product-desc">${product.description}</div>
//         </div>
//       </div>
//       <div class="gift-guide-popup__bottom">
//         <div class="gift-guide-popup__variant-label">Color</div>
//         <div class="gift-guide-popup__colors">${colorsHtml}</div>

//         <div class="gift-guide-popup__variant-label">Size</div>
//         <select class="gift-guide-popup__size-select">${sizesHtml}</select>

//         <button class="gift-guide-popup__atc-btn" type="button">
//           ADD TO CART <span class="gift-guide-popup__atc-arrow">→</span>
//         </button>
//       </div>
// `   ;


    var option1Name = product.options[0] || '';
    var option2Name = product.options[1] || '';
    var colors = [];
    var sizes = [];

    product.variants.forEach(function(v) {
      if (option1Name && colors.indexOf(v.option1) === -1) colors.push(v.option1);
      if (option2Name && sizes.indexOf(v.option2) === -1) sizes.push(v.option2);
    });

    Default selections
    var selectedColor = colors[0] || '';
    var selectedSize = sizes[0] || '';
    // var selectedColor = colors[0] || '';
    // var selectedSize = sizes[0] || '';

    Build color buttons
    var colorsHtml = colors.map(function(color) {
      return '<button type="button" class="gift-guide-popup__color-btn' +
            (color === selectedColor ? ' selected' : '') +
            '" data-color="' + color + '">' + color + '</button>';
    }).join('');

    // var colorsHtml = colors.map(function(color) {
    //   return '<button type="button" class="gift-guide-popup__color-btn' + 
    //         (color === selectedColor ? ' selected' : '') + 
    //         '" data-color="' + color + '">' + color + '</button>';
    // }).join('');

    Build size dropdown
    var sizesHtml = '<option value="">Choose your size</option>' +
      sizes.map(function(size) {
        return '<option value="' + size + '">' + size + '</option>';
    }).join('');

    // var sizesHtml = '<option value="">Choose your size</option>' +
    //   sizes.map(function(size) {
    //     return '<option value="' + size + '">' + size + '</option>';
    // }).join('');

    //Build popup HTML → COLOR FIRST, SIZE SECOND//
    document.getElementById('gift-guide-popup-dynamic').innerHTML =
      '<div class="gift-guide-popup__top">' +
        '<div class="gift-guide-popup__left">' +
          '<img class="gift-guide-popup__img" src="' + product.featured_image + '" alt="' + product.title + '">' +
        '</div>' +
        '<div class="gift-guide-popup__right">' +
          '<div class="gift-guide-popup__product-title">' + product.title + '</div>' +
          '<div class="gift-guide-popup__product-price">' +
            (window.Shopify && Shopify.formatMoney ? Shopify.formatMoney(product.price) : (product.price / 100) + ' USD') +
          '</div>' +
          '<div class="gift-guide-popup__product-desc">' + product.description + '</div>' +
        '</div>' +
      '</div>' +

      '<div class="gift-guide-popup__bottom">' +
        (option1Name ? '<div class="gift-guide-popup__variant-label">' + option1Name + '</div>' : '') +
        '<div class="gift-guide-popup__colors">' + colorsHtml + '</div>' +

        (option2Name ? '<div class="gift-guide-popup__variant-label">' + option2Name + '</div>' : '') +
        '<select class="gift-guide-popup__size-select">' + sizesHtml + '</select>' +

        '<button class="gift-guide-popup__atc-btn" type="button">' +
          'ADD TO CART <span class="gift-guide-popup__atc-arrow">→</span>' +
        '</button>' +
      '</div>'
    ;

  // // Build color buttons
  // let colorsHtml = colors.map(function(color) {
  //   return '<button type="button" class="gift-guide-popup__color-btn' +
  //     (color === selectedColor ? ' selected' : '') +
  //     '" data-color="' + color + '">' + color + '</button>';
  // }).join('');

  // // Build size dropdown
  // let sizesHtml = '<option value="">Choose your size</option>' +
  //   sizes.map(function(size) {
  //     return '<option value="' + size + '">' + size + '</option>';
  //   }).join('');

  //   // Extract option names (e.g. Color, Size) and unique values
  //   var option1Name = product.options[0] || '';
  //   var option2Name = product.options[1] || '';
  //   var colors = [];
  //   var sizes = [];
  //   product.variants.forEach(function(v) {
  //     if (option1Name && colors.indexOf(v.option1) === -1) colors.push(v.option1);
  //     if (option2Name && sizes.indexOf(v.option2) === -1) sizes.push(v.option2);
  //   });

  //   // Default selection
  //   var selectedColor = colors[0] || '';
  //   var selectedSize = sizes[0] || '';
  //   // Build color buttons
  //   var colorsHtml = colors.map(function(color) {
  //     return '<button type="button" class="gift-guide-popup__color-btn' + (color === selectedColor ? ' selected' : '') + '" data-color="' + color + '">' + color + '</button>';
  //   }).join('');
  //   // Build size dropdown
  //   var sizesHtml = '<option value="">Choose your size</option>' +
  //     sizes.map(function(size) {
  //       return '<option value="' + size + '">' + size + '</option>';
  //     }).join('');

    // Color selection event
    var colorBtns = document.querySelectorAll('.gift-guide-popup__color-btn');
    colorBtns.forEach(function(btn) {
      btn.addEventListener('click', function() {
        colorBtns.forEach(function(b) { b.classList.remove('selected'); });
        btn.classList.add('selected');
        selectedColor = btn.getAttribute('data-color');
        updateSelectedVariant();
      });
    });

    // Size selection event
    var sizeSelect = document.querySelector('.gift-guide-popup__size-select');
    sizeSelect.addEventListener('change', function() {
      selectedSize = sizeSelect.value;
      updateSelectedVariant();
    });

    // Add to Cart event
    document.querySelector('.gift-guide-popup__atc-btn').addEventListener('click', function() {
      if (!selectedColor || !selectedSize) {
        alert('Please select color and size.');
        return;
      }
      // Find matching variant
      var variant = product.variants.find(function(v) {
        return v.option1 === selectedColor && v.option2 === selectedSize;
      });
      if (!variant) {
        alert('This variant is not available.');
        return;
      }
      // Add to cart (AJAX)
      fetch('/cart/add.js', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: [{ id: variant.id, quantity: 1 }] })
      })
      .then(function(resp) { return resp.json(); })
      .then(function() {
        // Special logic: If Black and Medium, add Soft Winter Jacket as well
        if (
          selectedColor.toLowerCase() === 'black' &&
          selectedSize.toLowerCase() === 'medium'
        ) {
          fetch('/products/soft-winter-jacket.js')
            .then(function(res) { return res.json(); })
            .then(function(swJacket) {
              if (swJacket && swJacket.variants && swJacket.variants.length) {
                fetch('/cart/add.js', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ items: [{ id: swJacket.variants[0].id, quantity: 1 }] })
                });
              }
            });
        }
        alert('Product added to cart!');
        closeGiftGuidePopup();
      });
    });

    /**
     * Updates the selected variant, price, and image.
     */
    function updateSelectedVariant() {
      var variant = product.variants.find(function(v) {
        return v.option1 === selectedColor && v.option2 === selectedSize;
      });
      if (variant) {
        var priceElem = document.querySelector('.gift-guide-popup__product-price');
        if (window.Shopify && Shopify.formatMoney) {
          priceElem.textContent = Shopify.formatMoney(variant.price);
        } else {
          priceElem.textContent = (variant.price / 100) + ' USD';
        }
        if (variant.featured_image && variant.featured_image.src) {
          document.querySelector('.gift-guide-popup__img').src = variant.featured_image.src;
        }
      }
    }
  }
});
