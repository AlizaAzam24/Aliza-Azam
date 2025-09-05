// /**
//  * Gift Guide custom popup and grid logic (vanilla JS only)
//  * Handles product popup, dynamic variant rendering, and add-to-cart logic.
//  */
// document.addEventListener('DOMContentLoaded', function() {
//   // Open popup when clicking a grid item
//   document.querySelectorAll('.gift-guide-grid__item').forEach(function(item) {
//     item.addEventListener('click', function() {
//       const handle = item.getAttribute('data-handle');
//       openGiftGuidePopup(handle);
//     });
//     item.addEventListener('keypress', function(e) {
//       if (e.key === 'Enter' || e.key === ' ') {
//         e.preventDefault();
//         const handle = item.getAttribute('data-handle');
//         openGiftGuidePopup(handle);
//       }
//     });
//   });

//   // Popup close logic
//   document.addEventListener('click', function(e) {
//     if (
//       e.target.classList.contains('gift-guide-popup__close') ||
//       e.target.classList.contains('gift-guide-popup__overlay')
//     ) {
//       closeGiftGuidePopup();
//     }
//   });

//   /**
//    * Opens the product popup, renders product details and variants.
//    * @param {string} handle - Shopify product handle
//    */
//   function openGiftGuidePopup(handle) {
//     fetch('/products/' + handle + '.js')
//       .then(function(response) {
//         return response.json();
//       })
//       .then(function(product) {
//         renderGiftGuidePopup(product);
//       });
//     document.getElementById('gift-guide-popup').style.display = 'flex';
//   }

//   /**
//    * Closes the product popup and clears dynamic content.
//    */
//   function closeGiftGuidePopup() {
//     document.getElementById('gift-guide-popup').style.display = 'none';
//     document.getElementById('gift-guide-popup-dynamic').innerHTML = '';
//   }

//   /**
//    * Renders the product popup with dynamic variant selectors and "Add to Cart".
//    * @param {object} product - Shopify product object from /products/{handle}.js
//    */
//   function renderGiftGuidePopup(product) {
//     // Identify which option is Color and which is Size
//     var option1Name = product.options[0] || '';
//     var option2Name = product.options[1] || '';
//     var colors = [];
//     var sizes = [];

//     product.variants.forEach(function(v) {
//       if (option1Name && colors.indexOf(v.option1) === -1) colors.push(v.option1);
//       if (option2Name && sizes.indexOf(v.option2) === -1) sizes.push(v.option2);
//     });

//     //Default selections
//     var selectedColor = colors[0] || '';
//     var selectedSize = sizes[0] || '';

//     //Build color buttons
//     var colorsHtml = colors.map(function(color) {
//       return '<button type="button" class="gift-guide-popup__color-btn' +
//             (color === selectedColor ? ' selected' : '') +
//             '" data-color="' + color + '">' + color + '</button>';
//     }).join('');

//     //Build size dropdown
//     var sizesHtml = '<option value="">Choose your size</option>' +
//       sizes.map(function(size) {
//         return '<option value="' + size + '">' + size + '</option>';
//     }).join('');

//     //Build popup HTML → COLOR FIRST, SIZE SECOND//
//     document.getElementById('gift-guide-popup-dynamic').innerHTML =
//       '<div class="gift-guide-popup__top">' +
//         '<div class="gift-guide-popup__left">' +
//           '<img class="gift-guide-popup__img" src="' + product.featured_image + '" alt="' + product.title + '">' +
//         '</div>' +
//         '<div class="gift-guide-popup__right">' +
//           '<div class="gift-guide-popup__product-title">' + product.title + '</div>' +
//           '<div class="gift-guide-popup__product-price">' +
//             (window.Shopify && Shopify.formatMoney ? Shopify.formatMoney(product.price) : (product.price / 100) + ' USD') +
//           '</div>' +
//           '<div class="gift-guide-popup__product-desc">' + product.description + '</div>' +
//         '</div>' +
//       '</div>' +

//       '<div class="gift-guide-popup__bottom">' +
//         (option1Name ? '<div class="gift-guide-popup__variant-label">' + option1Name + '</div>' : '') +
//         '<div class="gift-guide-popup__colors">' + colorsHtml + '</div>' +

//         (option2Name ? '<div class="gift-guide-popup__variant-label">' + option2Name + '</div>' : '') +
//         '<select class="gift-guide-popup__size-select">' + sizesHtml + '</select>' +

//         '<button class="gift-guide-popup__atc-btn" type="button">' +
//           'ADD TO CART <span class="gift-guide-popup__atc-arrow">→</span>' +
//         '</button>' +
//       '</div>'
//     ;

//     // Color selection event
//     var colorBtns = document.querySelectorAll('.gift-guide-popup__color-btn');
//     colorBtns.forEach(function(btn) {
//       btn.addEventListener('click', function() {
//         colorBtns.forEach(function(b) { b.classList.remove('selected'); });
//         btn.classList.add('selected');
//         selectedColor = btn.getAttribute('data-color');
//         updateSelectedVariant();
//       });
//     });

//     // Size selection event
//     var sizeSelect = document.querySelector('.gift-guide-popup__size-select');
//     sizeSelect.addEventListener('change', function() {
//       selectedSize = sizeSelect.value;
//       updateSelectedVariant();
//     });

//     // Add to Cart event
//     document.querySelector('.gift-guide-popup__atc-btn').addEventListener('click', function() {
//       if (!selectedColor || !selectedSize) {
//         alert('Please select color and size.');
//         return;
//       }
//       // Find matching variant
//       var variant = product.variants.find(function(v) {
//         return v.option1 === selectedColor && v.option2 === selectedSize;
//       });
//       if (!variant) {
//         alert('This variant is not available.');
//         return;
//       }
//       // Add to cart (AJAX)
//       fetch('/cart/add.js', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ items: [{ id: variant.id, quantity: 1 }] })
//       })
//       .then(function(resp) { return resp.json(); })
//       .then(function() {
//         // Special logic: If Black and Medium, add Soft Winter Jacket as well
//         if (
//           selectedColor.toLowerCase() === 'black' &&
//           selectedSize.toLowerCase() === 'medium'
//         ) {
//           fetch('/products/soft-winter-jacket.js')
//             .then(function(res) { return res.json(); })
//             .then(function(swJacket) {
//               if (swJacket && swJacket.variants && swJacket.variants.length) {
//                 fetch('/cart/add.js', {
//                   method: 'POST',
//                   headers: { 'Content-Type': 'application/json' },
//                   body: JSON.stringify({ items: [{ id: swJacket.variants[0].id, quantity: 1 }] })
//                 });
//               }
//             });
//         }
//         alert('Product added to cart!');
//         closeGiftGuidePopup();
//       });
//     });

//     /**
//      * Updates the selected variant, price, and image.
//      */
//     function updateSelectedVariant() {
//       var variant = product.variants.find(function(v) {
//         return v.option1 === selectedColor && v.option2 === selectedSize;
//       });
//       if (variant) {
//         var priceElem = document.querySelector('.gift-guide-popup__product-price');
//         if (window.Shopify && Shopify.formatMoney) {
//           priceElem.textContent = Shopify.formatMoney(variant.price);
//         } else {
//           priceElem.textContent = (variant.price / 100) + ' USD';
//         }
//         if (variant.featured_image && variant.featured_image.src) {
//           document.querySelector('.gift-guide-popup__img').src = variant.featured_image.src;
//         }
//       }
//     }
//   }
// });


document.addEventListener('DOMContentLoaded', function() {
  // Open popup when clicking a grid item
  document.querySelectorAll('.gift-guide-grid__item').forEach(function(item) {
    item.addEventListener('click', function() {
      const handle = item.getAttribute('data-handle');
      if (handle) openGiftGuidePopup(handle);
    });
  });

  // Close popup
  document.addEventListener('click', function(e) {
    if (e.target.classList.contains('gift-guide-popup__close') ||
        e.target.classList.contains('gift-guide-popup__overlay')) {
      closeGiftGuidePopup();
    }
  });

  function openGiftGuidePopup(handle) {
    fetch('/products/' + handle + '.js')
      .then(r => r.json())
      .then(product => renderGiftGuidePopup(product))
      .catch(err => console.error("Product fetch failed:", err));
    document.getElementById('gift-guide-popup').style.display = 'flex';
  }

  function closeGiftGuidePopup() {
    document.getElementById('gift-guide-popup').style.display = 'none';
    document.getElementById('gift-guide-popup-dynamic').innerHTML = '';
  }

  function renderGiftGuidePopup(product) {
    // Identify options by name
    let colors = [];
    let sizes = [];

    product.variants.forEach(v => {
      if (product.options[0] && product.options[0].toLowerCase() === "color") {
        if (colors.indexOf(v.option1) === -1) colors.push(v.option1);
      }
      if (product.options[1] && product.options[1].toLowerCase() === "size") {
        if (sizes.indexOf(v.option2) === -1) sizes.push(v.option2);
      }
    });

    let selectedColor = colors[0] || '';
    let selectedSize = sizes[0] || '';

    // Build HTML
    const colorsHtml = colors.map(c =>
      `<button type="button" class="gift-guide-popup__color-btn${c === selectedColor ? ' selected' : ''}" data-color="${c}">${c}</button>`
    ).join('');

    const sizesHtml = `<option value="">Choose your size</option>` +
      sizes.map(s => `<option value="${s}">${s}</option>`).join('');

    document.getElementById('gift-guide-popup-dynamic').innerHTML = `
      <div class="gift-guide-popup__top">
        <div class="gift-guide-popup__left">
          <img class="gift-guide-popup__img" src="${product.featured_image}" alt="${product.title}">
        </div>
        <div class="gift-guide-popup__right">
          <div class="gift-guide-popup__product-title">${product.title}</div>
          <div class="gift-guide-popup__product-price">${Shopify.formatMoney ? Shopify.formatMoney(product.price) : (product.price/100)+' USD'}</div>
          <div class="gift-guide-popup__product-desc">${product.description}</div>
        </div>
      </div>
      <div class="gift-guide-popup__bottom">
        <div class="gift-guide-popup__variant-label">Color</div>
        <div class="gift-guide-popup__colors">${colorsHtml}</div>
        <div class="gift-guide-popup__variant-label">Size</div>
        <select class="gift-guide-popup__size-select">${sizesHtml}</select>
        <button class="gift-guide-popup__atc-btn" type="button">
          ADD TO CART <span class="gift-guide-popup__atc-arrow">→</span>
        </button>
      </div>`;

    // Event binding (scoped to popup)
    const popup = document.getElementById('gift-guide-popup-dynamic');

    popup.querySelectorAll('.gift-guide-popup__color-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        popup.querySelectorAll('.gift-guide-popup__color-btn').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        selectedColor = btn.dataset.color;
        updateSelectedVariant();
      });
    });

    const sizeSelect = popup.querySelector('.gift-guide-popup__size-select');
    sizeSelect.addEventListener('change', () => {
      selectedSize = sizeSelect.value;
      updateSelectedVariant();
    });

    popup.querySelector('.gift-guide-popup__atc-btn').addEventListener('click', () => {
      if (!selectedColor || !selectedSize) {
        alert('Please select color and size.');
        return;
      }
      const variant = product.variants.find(v => v.option1 === selectedColor && v.option2 === selectedSize);
      if (!variant) {
        alert('This variant is not available.');
        return;
      }
      fetch('/cart/add.js', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: [{ id: variant.id, quantity: 1 }] })
      })
      .then(r => r.json())
      .then(() => {
        alert('Product added to cart!');
        closeGiftGuidePopup();
      });
    });

    function updateSelectedVariant() {
      const variant = product.variants.find(v => v.option1 === selectedColor && v.option2 === selectedSize);
      if (variant) {
        const priceElem = popup.querySelector('.gift-guide-popup__product-price');
        priceElem.textContent = Shopify.formatMoney ? Shopify.formatMoney(variant.price) : (variant.price/100)+' USD';
        if (variant.featured_image && variant.featured_image.src) {
          popup.querySelector('.gift-guide-popup__img').src = variant.featured_image.src;
        }
      }
    }
  }
});
