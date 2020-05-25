
const hamburgerMenu = {
	size: {
		big: {price: 100, calories: 40},
		small: {price: 50, calories: 20}
	},
	filling: {
		cheese: {price: 10, calories: 20},
		potato: {price: 15, calories: 10},
		salad: {price: 20, calories: 5}
	},
	topping: {
		mayonnaise: {price: 20, calories: 5},
		spice: {price: 15, calories: 0}
	}
};

class Hamburger {
	constructor() {
		this.parser = new FormParser();
		this.update();
	}

	totalPrice() {
		let result = hamburgerMenu.size[this.size].price;
		result += hamburgerMenu.filling[this.filling].price;
		this.topping.forEach (item => {
			result += hamburgerMenu.topping[item].price;
		});
		return result;
	}
	
	totalCalories() {
		let result = hamburgerMenu.size[this.size].calories;
		result += hamburgerMenu.filling[this.filling].calories;
		this.topping.forEach (item => {
			result += hamburgerMenu.topping[item].calories;
		});
		return result;
	}

	update() {
		this.parser.getParameters();
		this.size = this.parser.size;
		this.filling = this.parser.filling;
		this.topping = this.parser.topping;
	}
}

class FormParser {
	constructor() {
		this.size = null;
		this.filling = null;
		this.topping = null;
		this.getParameters();
	}

	getParameters() {
		//у input, выбранных пользователем появляется псевдо класс checked,
		//соотв-нно, считаем только выбираемые эл-ты
		this.size = document.querySelector("input[name='size']:checked").value;
		this.filling = document.querySelector("input[name='filling']:checked").value;
		this.topping = [];
		document.querySelectorAll("input[name='topping']:checked").forEach (item => {
			this.topping.push(item.value);
		});
	}

	generateBurgerDescription() {
		let size = this.size == "big" ? "Большой" : "Маленький";
		let filling = "";
		if (this.filling == "cheese") {
			filling = "сыром";
		} else if (this.filling == "potato") {
			filling = "картофелем";
		} else {
			filling = "салатом";
		}
		let toppings = "";
		if (this.topping.length == 2) {
			toppings += ", майонезом и приправой";
		} else if (this.topping.length == 1) {
			toppings += " и ";
			if (this.topping.includes("mayonnaise")) {
				toppings += "майонезом";
			} else if (this.topping.includes("spice")) {
				toppings += "приправой";
			}
		}
		return `${size} гамбургер с ${filling}${toppings}`;
	}
}

class Cart {
	constructor () {
		this.userItems = [];
		this.orderPrice = 0;
		this.orderCalories = 0;
		this.cartDiv = document.querySelector (".basket-block");
	}

	addItem(item) {
		this.userItems.push(item);
		this.orderUpdate();
		this.renderGoods();
	}

	deleteItem(index) {
		this.userItems.splice(index, 1);
		this.orderUpdate();
		this.renderGoods();
	}

	orderUpdate () {
		this.orderPrice = this.getTotalPrice();
		this.orderCalories = this.getTotalCalories();
	}

  createMessage() {
		let p = document.createElement("p");
		p.classList.add("total");
		let message = "";
		if (this.userItems.length === 0) {
			message = "Корзина пуста";
		} else {
			message = "Ваш заказ" + " на сумму: " + this.orderPrice + " рублей, " + "энергетическая ценность - " + this.orderCalories + " калорий"
		}
		p.innerText = message;
		this.cartDiv.appendChild(p);
	}

	createProductCard(item, index) {
		let div = document.createElement("div");
		div.classList.add("product");
		let desc = document.createElement("p");
		desc.classList.add("prodDescription");
		desc.innerHTML = item.description;
		div.appendChild(desc);
		let button = document.createElement("button");
		button.id = index;
		button.classList.add("del-button");
		button.innerText = "x";
		button.addEventListener("click", shop.deleteHamburgerFromCart);
		div.appendChild(button);
		this.cartDiv.appendChild(div);
	}

	getTotalCalories() {
		return this.userItems.reduce((total, item) => {
			return total + item.calories;
		}, 0)
	}

	getTotalPrice() {
		return this.userItems.reduce((total, item) => {
			return total + item.price;
		}, 0)
	}

	renderGoods() {
		this.cartDiv.innerHTML = "";
		this.userItems.forEach((item, index) => {
			this.createProductCard(item, index);
		})
		this.createMessage();
	}
}

class Shop {
	constructor () {
		this.cart = new Cart();
		this.hamburger = new Hamburger();
		this.deleteHamburgerFromCart = this.deleteHamburgerFromCart.bind(this);
	}

	addHamburgerToCart() {
		let burger = {};
		burger.description = this.hamburger.parser.generateBurgerDescription();
		burger.price = this.hamburger.totalPrice();
		burger.calories = this.hamburger.totalCalories();
		this.cart.addItem(burger);
	}

	deleteHamburgerFromCart(event) {
		let index = event.target.id;
		this.cart.deleteItem(index);
	}

  updateHamburgerParameters() {
		this.hamburger.update();
		let price = this.hamburger.totalPrice();
		document.getElementById("price").innerHTML = price;
		let calories = this.hamburger.totalCalories();
		document.getElementById("calories").innerHTML = calories;
	}

  showBasket() {
		let div = document.querySelector(".basket-block");
		if (div.style.display === "none") {
			div.style.display = "block";
		} else {
			div.style.display = "none";
		}
	}
}

let shop = new Shop();

window.onload = () => {
	shop.updateHamburgerParameters();
	shop.cart.renderGoods();
}
