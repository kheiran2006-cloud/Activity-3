
const MENU = [
  { id: 1, cat: "main", price: 189, img: "three-sword-pork-bbq.png", name: "Three-Sword Pork BBQ", desc: "Three pork barbecue sticks with garlic rice." },
  { id: 2, cat: "main", price: 199, img: "sanjis-special-chicken-inasal.png", name: "Sanji's Special Chicken Inasal", desc: "Grilled chicken with rice and dipping sauce." },
  { id: 3, cat: "main", price: 179, img: "fiery-pork-sisig.png", name: "Fiery Pork Sisig", desc: "Sizzling pork sisig with rice." },
  { id: 4, cat: "main", price: 449, img: "king-of-the-pirates-ribs.png", name: "King of the Pirates Ribs", desc: "BBQ pork ribs glazed and sides with homemade sauce." },
  { id: 5, cat: "main", price: 169, img: "treasure-garlic-rice-bowl.webp", name: "Treasure Garlic Rice Bowl", desc: "Garlic rice topped with chicken, egg, and special sauce." },
  { id: 6, cat: "main", price: 429, img: "all-blue-seafood-platter.jpg", name: "All Blue Garlic Butter Seafood Platter", desc: "A sea-sized platter of seafood tossed in garlic butter." },
  { id: 7, cat: "main", price: 129, img: "hatchan-calamares.png", name: "Hatchan Calamares", desc: "Crispy fried squid rings served with dipping sauce." },
  { id: 8, cat: "main", price: 119, img: "sunny-side-onion-rings.jpg", name: "Sunny Side Onion Rings", desc: "Golden, crispy onion rings." },
  { id: 9, cat: "main", price: 199, img: "grand-line-grilled-fish.webp", name: "Grand Line Grilled Fish", desc: "Grilled milk fish with fillings." },
  { id: 10, cat: "main", price: 189, img: "lucky-roux-beef-tapa.png", name: "Lucky Roux's Beef Tapa", desc: "Savory marinated beef strips served with garlic rice, a fried egg, and pickled vegetables." },
  { id: 11, cat: "dessert", price: 169, img: "thousand-sunny-honey-toast.png", name: "Thousand Sunny Honey Toast", desc: "Golden toasted bread topped with creamy vanilla ice cream, fresh fruits, and a drizzle of sweet honey." },
  { id: 12, cat: "dessert", price: 179, img: "sweet-treasure.png", name: "Sweet Treasure", desc: "Chocolate brownie with ice cream." },
  { id: 13, cat: "dessert", price: 109, img: "bounty-churros.jpg", name: "Bounty Churros", desc: "Crispy churros coated in cinnamon sugar and served with warm chocolate dip." },
  { id: 14, cat: "drink", price: 149, img: "gomu-gomu-mango-shake.jpg", name: "Gomu Gomu Mango Shake", desc: "Creamy mango shake." },
  { id: 15, cat: "drink", price: 99, img: "sunny-sunset-lemonade.png", name: "Sunny Sunset Lemonade", desc: "Refreshing citrus drink." },
  { id: 16, cat: "drink", price: 89, img: "super-soda.jpg", name: "SUPER! Soda", desc: "Fruity tropical soda." },
  { id: 17, cat: "drink", price: 139, img: "choppers-cotton-candy-frappe.png", name: "Chopper's Cotton Candy Frappe", desc: "Sweet, colorful layered drink." },
  { id: 18, cat: "drink", price: 159, img: "phoenix-pyreapple.png", name: "Phoenix Pyreapple", desc: "Citrus and sweet pineapple, inspired by Marco's blue phoenix flames." },
  { id: 19, cat: "drink", price: 149, img: "love-potion.png", name: "Love Potion", desc: "A sweet, creamy strawberry smoothie with a refreshing yogurt twist." }
];

const order = {};
let activeCategory = "all";

/* build and show the menu cards */
function renderMenu() {
  const grid = document.getElementById("menu-grid");
  if (!grid) return;
  const query = document.getElementById("search-input").value.trim().toLowerCase();
  const sort = document.getElementById("sort-select").value;

  const list = MENU.filter(function (item) {
    const matchCat = activeCategory === "all" || item.cat === activeCategory;
    const matchText = (item.name + " " + item.desc).toLowerCase().includes(query);
    return matchCat && matchText;
  });
  if (sort === "low") list.sort(function (a, b) { return a.price - b.price; });
  if (sort === "high") list.sort(function (a, b) { return b.price - a.price; });
  if (sort === "name") list.sort(function (a, b) { return a.name.localeCompare(b.name); });

  grid.innerHTML = list.map(function (item) {
    return '<article class="poster" id="item-' + item.id + '">' +
      '<h2 class="poster-title">WANTED</h2>' +
      (item.price >= 300 ? '<span class="stamp">Big Bounty</span>' : "") +
      '<figure><img src="images/' + item.img + '" alt="' + item.name + '" loading="lazy"></figure>' +
      "<h3>" + item.name + "</h3><p>" + item.desc + "</p>" +
      '<div class="poster-foot"><span class="bounty">₱' + item.price + "</span>" +
      '<button class="btn small add-btn" data-id="' + item.id + '" type="button">Add to crew order</button></div></article>';
  }).join("");

  document.getElementById("empty-message").style.display = list.length ? "none" : "block";
}

/* switch category tab */
function setCategory(button) {
  activeCategory = button.dataset.cat;
  document.querySelectorAll(".tab").forEach(function (tab) {
    tab.classList.toggle("active", tab === button);
  });
  renderMenu();
}

/* add to order and update the drawer */
function addToOrder(id) {
  order[id] = (order[id] || 0) + 1;
  renderOrder();
  const item = MENU.find(function (m) { return m.id === id; });
  showToast(item.name + " added to the crew order!");
}

function renderOrder() {
  const listEl = document.getElementById("order-list");
  if (!listEl) return;
  let total = 0;
  let count = 0;
  let html = "";
  Object.keys(order).forEach(function (id) {
    const item = MENU.find(function (m) { return m.id === Number(id); });
    total += item.price * order[id];
    count += order[id];
    html += "<li><span>" + order[id] + "× " + item.name + "</span><strong>₱" + (item.price * order[id]) + "</strong></li>";
  });
  listEl.innerHTML = html || "<li>No treasure yet. Add a dish!</li>";
  document.getElementById("order-total").innerHTML = "Total: ₱" + total;
  const badge = document.getElementById("order-count");
  badge.innerHTML = count;
  badge.style.fontWeight = count ? "900" : "400";
}

function clearOrder() {
  Object.keys(order).forEach(function (id) { delete order[id]; });
  renderOrder();
}

function toggleDrawer(forceClose) {
  const drawer = document.getElementById("order-drawer");
  if (!drawer) return;
  if (forceClose === true) drawer.classList.remove("open");
  else drawer.classList.toggle("open");
}

function showToast(message) {
  const toast = document.getElementById("toast");
  if (!toast) return;
  toast.innerHTML = message;
  toast.classList.add("show");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(function () { toast.classList.remove("show"); }, 1800);
}

/* theme and mobile nav */
function toggleTheme() {
  const night = document.body.classList.toggle("night");
  document.getElementById("theme-toggle").innerHTML = night ? "Day" : "Night";
}

function toggleNav() {
  document.getElementById("main-nav").classList.toggle("open");
}

/* feast planner (home page) */
function suggestFeast() {
  const crew = Number(document.getElementById("crew-size").value);
  const result = document.getElementById("feast-result");
  if (!crew) {
    result.innerHTML = "Pick your crew size to see your feast plan.";
    result.style.background = "";
    return;
  }
  const mains = Math.ceil(crew * 0.8);
  const sides = Math.ceil(crew / 3);
  const desserts = Math.ceil(crew / 2);
  result.innerHTML = "A crew of " + crew + " should claim " + mains + " mains, " + sides +
    " sides to share, " + desserts + " desserts and " + crew + " drinks. Set sail!";
  result.style.background = "#d7263d";
}

/* click, input, change, mouseover, mouseout, error, keydown */
document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("theme-toggle").addEventListener("click", toggleTheme);
  document.getElementById("nav-toggle").addEventListener("click", toggleNav);

  const crewSelect = document.getElementById("crew-size");
  if (crewSelect) crewSelect.addEventListener("change", suggestFeast);

  // Hover highlight for every wanted-poster card
  document.addEventListener("mouseover", function (e) {
    const card = e.target.closest(".poster");
    if (card) card.classList.add("hot");
  });
  document.addEventListener("mouseout", function (e) {
    const card = e.target.closest(".poster");
    if (card) card.classList.remove("hot");
  });

/* menu grid */
  const grid = document.getElementById("menu-grid");
  if (!grid) return;

  document.querySelectorAll(".tab").forEach(function (tab) {
    tab.addEventListener("click", function () { setCategory(tab); });
  });
  document.getElementById("search-input").addEventListener("input", renderMenu);
  document.getElementById("sort-select").addEventListener("change", renderMenu);
  grid.addEventListener("click", function (e) {
    const btn = e.target.closest(".add-btn");
    if (btn) addToOrder(Number(btn.dataset.id));
  });
  document.getElementById("open-order").addEventListener("click", function () { toggleDrawer(); });
  document.getElementById("close-order").addEventListener("click", function () { toggleDrawer(true); });
  document.getElementById("clear-order").addEventListener("click", clearOrder);
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") toggleDrawer(true); });

  renderMenu();
  renderOrder();
});
