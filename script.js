// ---------------------------------------------------------
// TEST SÜRÜMÜ: ürünler doğrudan bu dosyanın içinde.
// Çalıştığını görünce bu listeyi JSON dosyasına taşıyacağız.
// ---------------------------------------------------------
var PRODUCTS = [
  {
    id: "urun-1",
    title: "Test Ürün 1",
    description: "Bu bir deneme açıklamasıdır. Gerçek ürün açıklaması buraya gelecek.",
    image: "https://picsum.photos/id/21/600/600",
    url: "https://www.example.com/1"
  },
  {
    id: "urun-2",
    title: "Test Ürün 2",
    description: "İkinci ürünün açıklaması. Aşağı kaydırarak sonraki ürüne geçebilirsiniz.",
    image: "https://picsum.photos/id/30/600/600",
    url: "https://www.example.com/2"
  },
  {
    id: "urun-3",
    title: "Test Ürün 3",
    description: "Üçüncü ürün. Klavyede yukarı/aşağı ok tuşları da çalışır.",
    image: "https://picsum.photos/id/40/600/600",
    url: "https://www.example.com/3"
  }
];

var feed = document.getElementById("feed");

// Kartları oluştur
PRODUCTS.forEach(function (p) {
  var card = document.createElement("section");
  card.className = "card";
  card.id = p.id;

  card.innerHTML =
    '<div class="card-img"><img loading="lazy" alt=""></div>' +
    '<div class="card-body">' +
      '<h2 class="card-title"></h2>' +
      '<p class="card-desc"></p>' +
      '<a class="card-cta" target="_blank" rel="sponsored noopener">Ürünü incele</a>' +
      '<p class="disclosure">Sponsorlu bağlantı: satın alırsanız komisyon alabiliriz.</p>' +
    '</div>';

  // textContent kullanıyoruz: metin güvenli yazılır
  card.querySelector("img").src = p.image;
  card.querySelector("img").alt = p.title;
  card.querySelector(".card-title").textContent = p.title;
  card.querySelector(".card-desc").textContent = p.description;
  card.querySelector(".card-cta").href = p.url;

  feed.appendChild(card);
});

// Yukarı / aşağı butonları
function go(direction) {
  feed.scrollBy({ top: direction * feed.clientHeight, behavior: "smooth" });
}
document.getElementById("btn-up").addEventListener("click", function () { go(-1); });
document.getElementById("btn-down").addEventListener("click", function () { go(1); });

// Klavye okları
document.addEventListener("keydown", function (e) {
  if (e.key === "ArrowDown") { e.preventDefault(); go(1); }
  if (e.key === "ArrowUp")   { e.preventDefault(); go(-1); }
});
