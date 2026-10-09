var feed = document.getElementById("feed");

// JSON dosyasından ürünleri çek ve kartları oluştur
fetch("products.json")
  .then(function (response) {
    if (!response.ok) {
      throw new Error("Ürünler yüklenirken bir hata oluştu.");
    }
    return response.json();
  })
  .then(function (products) {
    var urlParams = new URLSearchParams(window.location.search);
    var targetMki = urlParams.get("mki");
    var targetCard = null;

    products.forEach(function (p) {
      var card = document.createElement("section");
      card.className = "card";
      var uniqueId = p.mki || p.id;
      card.id = uniqueId;

      card.innerHTML =
        '<div class="card-img"><img loading="lazy" alt=""></div>' +
        '<div class="card-body">' +
          '<h2 class="card-title"></h2>' +
          '<p class="card-desc"></p>' +
          '<div class="card-actions">' +
            '<button type="button" class="action-btn btn-whatsapp" onclick="shareOnWhatsApp(\'' + (p.title || '').replace(/'/g, "\\'") + '\', \'' + uniqueId + '\')" title="WhatsApp ile Paylaş">WhatsApp</button>' +
            '<button type="button" class="action-btn btn-copy" onclick="copyProductLink(\'' + uniqueId + '\', this)" title="Bağlantıyı Kopyala">Kopyala</button>' +
          '</div>' +
          '<a class="card-cta" target="_blank" rel="sponsored noopener">Ürünü incele</a>' +
          '<p class="disclosure">Sponsorlu bağlantı: satın alırsanız komisyon alabiliriz.</p>' +
        '</div>';

      card.querySelector("img").src = p.image;
      card.querySelector("img").alt = p.title;
      card.querySelector(".card-title").textContent = p.title;
      card.querySelector(".card-desc").textContent = p.description;
      card.querySelector(".card-cta").href = p.url;

      feed.appendChild(card);

      if (targetMki && uniqueId === targetMki) {
        targetCard = card;
      }
    });

    if (targetCard) {
      setTimeout(function () {
        targetCard.scrollIntoView({ behavior: "smooth" });
      }, 150);
    }
  })
  .catch(function (error) {
    console.error("Hata:", error);
  });
  })
  .catch(function (error) {
    console.error("Hata:", error);
  });

// Yukarı / aşağı butonları
function go(direction) {
  feed.scrollBy({ top: direction * feed.clientHeight, behavior: "smooth" });
}
document.getElementById("btn-up").addEventListener("click", function () { go(-1); });
document.getElementById("btn-down").addEventListener("click", function () { go(1); });

// Klavye okları

// WhatsApp ile Paylaş
window.shareOnWhatsApp = function(title, mki) {
    var shareUrl = window.location.origin + window.location.pathname + "?mki=" + mki;
    var text = encodeURIComponent("🔥 " + title + "\n\nFırsatı incelemek için:\n" + shareUrl);
    window.open("https://api.whatsapp.com/send?text=" + text, "_blank");
};

// Bağlantıyı Kopyala
window.copyProductLink = function(mki, btnElement) {
    var shareUrl = window.location.origin + window.location.pathname + "?mki=" + mki;
    
    navigator.clipboard.writeText(shareUrl).then(function() {
        var originalText = btnElement.textContent;
        btnElement.textContent = "✓ Kopyalandı";
        btnElement.style.borderColor = "#00ff87";
        btnElement.style.color = "#00ff87";
        
        setTimeout(function() {
            btnElement.textContent = originalText;
            btnElement.style.borderColor = "";
            btnElement.style.color = "";
        }, 2000);
    });
};
document.addEventListener("keydown", function (e) {
  if (e.key === "ArrowDown") { e.preventDefault(); go(1); }
  if (e.key === "ArrowUp")   { e.preventDefault(); go(-1); }
});
