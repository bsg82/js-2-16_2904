let url = 'https://raw.githubusercontent.com/evgeny89/rest/master/data.json';

let products = (method, url) => {
    
}

class Product {
    constructor(container) {
        this.items = [];
        this.container = container;
    }
}

class Catalog extends Product {
    constructor (cart, container) {
        super(container);
        this.cart = cart;
        this._init();
    }

    _init () {
        this._handleData ();
        this.render ();
        this._handleEvents ();
    }

    _handleEvents () {
        document.querySelector (this.container).addEventListener ('click', (evt) => {
            if (evt.target.name === 'buy-btn') {
                this.cart.addProduct (evt.target);
            }
        });
    }

    _handleData () {
        for (let i = 0; i < products.IDS.length; i++) {
            this.items.push (this._createNewProduct (i));
        }
    }

    _createNewProduct (index) {
        return {
            product_name: products.PRODUCTS_NAMES [index],
            price: products.PRICES [index],
            id_product: products.IDS [index],
            img: products.IMGS [index]
        }
    }

    render () {
        let str = '';
        this.items.forEach (item => {
            str += `
                <div class="product-item">
                    <img src="https://placehold.it/300x200" alt="${item.product_name}">
                    <!--img src="${item.img}" width="300" height="200" alt="${item.product_name}"-->
                    <div class="desc">
                        <h1>${item.product_name}</h1>
                        <p>${item.price}</p>
                        <button 
                        class="buy-btn" 
                        name="buy-btn"
                        data-name="${item.product_name}"
                        data-price="${item.price}"
                        data-id="${item.id_product}"
                        >Купить</button>
                    </div>
                </div>
            `;
        });
        document.querySelector(this.container).innerHTML = str;
    }
}

class Cart extends Product {
    constructor (container) {
        super(container);
        this.total = 0;
        this.sum = 0;
        this.quantityBlock = document.querySelector ('#quantity');
        this.priceBlock = document.querySelector ('#price');
        this._init();
    }

    _init () {
        this._handleEvents ();
    }

    _handleEvents () {
        document.querySelector (this.container).addEventListener ('click', (evt) => {
            if (evt.target.name === 'del-btn') {
                this.deleteProduct (evt.target);
            }
        });
    }

    addProduct (product) {
        let id = product.dataset['id'];
        let find = this.items.find (product => product.id_product === id);
        if (find) {
            find.quantity++;
        } else {
            let prod = this._createNewProduct (product);
            this.items.push (prod);
        }

        this._checkTotalAndSum ();
        this.render ();
    }

    _createNewProduct (prod) {
        return {
            product_name: prod.dataset['name'],
            price: prod.dataset['price'],
            id_product: prod.dataset['id'],
            quantity: 1
        }
    }

    deleteProduct (product) {
        let id = product.dataset['id'];
        let find = this.items.find (product => product.id_product === id);
        if (find.quantity > 1) {
            find.quantity--;
        } else {
            this.items.splice (this.items.indexOf(find), 1);
        }

        this._checkTotalAndSum ();
        this.render ();
    }

    _checkTotalAndSum () {
        let qua = 0;
        let pr = 0;
        this.items.forEach (item => {
            qua += item.quantity
            pr += item.price * item.quantity
        });
        this.total = qua;
        this.sum = pr;
    }

    render () {
        let itemsBlock = document.querySelector (this.container).querySelector ('.cart-items')
        let str = '';
        this.items.forEach (item => {
            str += `<div class="cart-item" data-id="${item.id_product}">
                    <img src="https://placehold.it/100x80" alt="">
                    <div class="product-desc">
                        <p class="product-title">${item.product_name}</p>
                        <p class="product-quantity">${item.quantity}</p>
                        <p class="product-single-price">${item.price}</p>
                    </div>
                    <div class="right-block">
                        <button name="del-btn" class="del-btn" data-id="${item.id_product}">&times;</button>
                    </div>
                </div>`;
        });
        itemsBlock.innerHTML = str;
        this.quantityBlock.innerText = this.total;
        this.priceBlock.innerText = this.sum;
    }
}

export default function () {
    let cart = new Cart('.cart-block');
    new Catalog(cart, '.products');
}