/* =========================================================
   MIRZALA PREMIUM
   MAIN APPLICATION
   ========================================================= */

(function () {

  "use strict";


  /* =======================================================
     CONFIGURATION WRAPPER
     ======================================================= */

  const CONFIG = {

    DATA_URL: "./products.json",

    HOME_URL: "https://www.mirzala.com/",

    GITHUB_BASE_URL:
      "https://mirzala.github.io/mirzala-premium/",

    BLOGGER_BASE_URL:
      "https://www.mirzala.com/p/premium.html"

  };


  /* =======================================================
     STATE WRAPPER
     ======================================================= */

  const STATE = {

    products: [],

    currentIndex: 0,

    currentProduct: null

  };


  /* =======================================================
     DOM WRAPPER
     ======================================================= */

  const DOM = {

    image:
      document.getElementById("mp-product-image"),

    imageLink:
      document.getElementById("mp-image-link"),

    title:
      document.getElementById("mp-product-title"),

    description:
      document.getElementById("mp-product-description"),

    cta:
      document.getElementById("mp-cta-button"),

    next:
      document.getElementById("mp-next-button"),

    prev:
      document.getElementById("mp-prev-button"),

    share:
      document.getElementById("mp-share-button"),

    home:
      document.getElementById("mp-home-button"),

    overlay:
      document.getElementById("mp-share-overlay"),

    closeShare:
      document.getElementById("mp-share-close"),

    whatsapp:
      document.getElementById("mp-whatsapp-button"),

    copy:
      document.getElementById("mp-copy-button"),

    copyStatus:
      document.getElementById("mp-copy-status")

  };


  /* =======================================================
     URL WRAPPER
     ======================================================= */

  function getProductIdFromUrl() {

    const params =
      new URLSearchParams(window.location.search);

    return params.get("product");

  }


  /* =======================================================
     CREATE PRODUCT URL
     ======================================================= */

  function createProductUrl(productId) {

    return (
      CONFIG.GITHUB_BASE_URL +
      "?product=" +
      encodeURIComponent(productId)
    );

  }


  /* =======================================================
     UPDATE BROWSER URL
     ======================================================= */

  function updateBrowserUrl(productId) {

    const newUrl =
      createProductUrl(productId);

    window.history.replaceState(
      {},
      "",
      newUrl
    );

  }


  /* =======================================================
     FIND PRODUCT
     ======================================================= */

  function findProductIndex(productId) {

    if (!productId) {
      return 0;
    }

    const index =
      STATE.products.findIndex(
        function (product) {

          return String(product.id) ===
            String(productId);

        }
      );

    return index >= 0 ? index : 0;

  }


  /* =======================================================
     LOAD PRODUCT
     ======================================================= */

  function loadProduct(index, updateUrl) {

    if (!STATE.products.length) {
      return;
    }

    if (index < 0) {
      index = STATE.products.length - 1;
    }

    if (index >= STATE.products.length) {
      index = 0;
    }

    STATE.currentIndex = index;

    const product =
      STATE.products[index];

    STATE.currentProduct = product;


    /* -----------------------------------------------
       IMAGE
       ----------------------------------------------- */

    DOM.image.src =
      product.image || "";

    DOM.image.alt =
      product.title || "Mirzala product";


    /* -----------------------------------------------
       IMAGE LINK
       ----------------------------------------------- */

    DOM.imageLink.href =
      product.productUrl || "#";


    /* -----------------------------------------------
       TITLE
       ----------------------------------------------- */

    DOM.title.textContent =
      product.title || "";


    /* -----------------------------------------------
       DESCRIPTION
       ----------------------------------------------- */

    DOM.description.textContent =
      product.description || "";


    /* -----------------------------------------------
       CTA
       ----------------------------------------------- */

    DOM.cta.href =
      product.productUrl || "#";


    /* -----------------------------------------------
       URL
       ----------------------------------------------- */

    if (updateUrl !== false) {

      updateBrowserUrl(product.id);

    }


    /* -----------------------------------------------
       RESET SHARE STATUS
       ----------------------------------------------- */

    DOM.copyStatus.textContent = "";

  }


  /* =======================================================
     NEXT PRODUCT
     ======================================================= */

  function nextProduct() {

    let nextIndex =
      STATE.currentIndex + 1;

    if (
      nextIndex >=
      STATE.products.length
    ) {
      nextIndex = 0;
    }

    loadProduct(nextIndex, true);

  }


  /* =======================================================
     PREVIOUS PRODUCT
     ======================================================= */

  function previousProduct() {

    let previousIndex =
      STATE.currentIndex - 1;

    if (previousIndex < 0) {

      previousIndex =
        STATE.products.length - 1;

    }

    loadProduct(previousIndex, true);

  }


  /* =======================================================
     SHARE MODAL OPEN
     ======================================================= */

  function openShareModal() {

    if (!STATE.currentProduct) {
      return;
    }

    DOM.overlay.classList.add("is-open");

    DOM.overlay.setAttribute(
      "aria-hidden",
      "false"
    );

  }


  /* =======================================================
     SHARE MODAL CLOSE
     ======================================================= */

  function closeShareModal() {

    DOM.overlay.classList.remove("is-open");

    DOM.overlay.setAttribute(
      "aria-hidden",
      "true"
    );

  }


  /* =======================================================
     GET SHARE URL
     ======================================================= */

  function getShareUrl() {

    if (!STATE.currentProduct) {
      return CONFIG.GITHUB_BASE_URL;
    }

    return createProductUrl(
      STATE.currentProduct.id
    );

  }


  /* =======================================================
     WHATSAPP SHARE
     ======================================================= */

  function shareToWhatsApp() {

    if (!STATE.currentProduct) {
      return;
    }

    const product =
      STATE.currentProduct;

    const shareUrl =
      getShareUrl();

    const message =
      "Check this product on Mirzala:\n\n" +
      product.title +
      "\n\n" +
      shareUrl;

    const whatsappUrl =
      "https://wa.me/?text=" +
      encodeURIComponent(message);

    window.open(
      whatsappUrl,
      "_blank",
      "noopener,noreferrer"
    );

  }


  /* =======================================================
     COPY LINK
     ======================================================= */

  async function copyShareLink() {

    const shareUrl =
      getShareUrl();

    try {

      await navigator.clipboard.writeText(
        shareUrl
      );

      DOM.copyStatus.textContent =
        "Link copied!";

    } catch (error) {

      const temporary =
        document.createElement("textarea");

      temporary.value =
        shareUrl;

      document.body.appendChild(
        temporary
      );

      temporary.select();

      document.execCommand(
        "copy"
      );

      temporary.remove();

      DOM.copyStatus.textContent =
        "Link copied!";

    }

  }


  /* =======================================================
     HOME
     ======================================================= */

  function goHome() {

    window.open(
      CONFIG.HOME_URL,
      "_blank",
      "noopener,noreferrer"
    );

  }


  /* =======================================================
     LOAD JSON
     ======================================================= */

  async function loadProducts() {

    try {

      const response =
        await fetch(
          CONFIG.DATA_URL,
          {
            cache: "no-store"
          }
        );

      if (!response.ok) {

        throw new Error(
          "products.json could not be loaded."
        );

      }

      const data =
        await response.json();


      if (
        !data ||
        !Array.isArray(data.products)
      ) {

        throw new Error(
          "Invalid products.json format."
        );

      }


      STATE.products =
        data.products;


      if (!STATE.products.length) {

        throw new Error(
          "No products found."
        );

      }


      /* -----------------------------------------------
         URL PRODUCT
         ----------------------------------------------- */

      const requestedId =
        getProductIdFromUrl();


      const startingIndex =
        findProductIndex(
          requestedId
        );


      loadProduct(
        startingIndex,
        false
      );


    } catch (error) {

      console.error(
        "Mirzala Premium Error:",
        error
      );

      DOM.title.textContent =
        "Product unavailable";

      DOM.description.textContent =
        "The product data could not be loaded.";

    }

  }


  /* =======================================================
     EVENTS
     ======================================================= */

  function bindEvents() {

    DOM.next.addEventListener(
      "click",
      nextProduct
    );


    DOM.prev.addEventListener(
      "click",
      previousProduct
    );


    DOM.share.addEventListener(
      "click",
      openShareModal
    );


    DOM.closeShare.addEventListener(
      "click",
      closeShareModal
    );


    DOM.whatsapp.addEventListener(
      "click",
      shareToWhatsApp
    );


    DOM.copy.addEventListener(
      "click",
      copyShareLink
    );


    DOM.home.addEventListener(
      "click",
      goHome
    );


    DOM.overlay.addEventListener(
      "click",
      function (event) {

        if (
          event.target ===
          DOM.overlay
        ) {

          closeShareModal();

        }

      }
    );


    document.addEventListener(
      "keydown",
      function (event) {

        if (event.key === "Escape") {

          closeShareModal();

        }

        if (event.key === "ArrowUp") {

          nextProduct();

        }

        if (event.key === "ArrowDown") {

          previousProduct();

        }

      }
    );

  }


  /* =======================================================
     INITIALIZE
     ======================================================= */

  function init() {

    bindEvents();

    loadProducts();

  }


  /* =======================================================
     START
     ======================================================= */

  init();


})();
