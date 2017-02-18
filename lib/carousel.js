'use strict';

function Carousel(el, options) {

    this.el = el;

    this.carouselEl = null;
    this.carouselInnerEl = null;
    this.navRightCtrl = null;
    this.navLefttCtrl = null;
    this.bulletNavEl = null;
    this.items = [];
    this.bulletItems = [];
    this.initialItemIndex = 0;
    this.currentItemIndex = 0;
    this.itemsTotal = 0;
    this.timer = null;

    this.options = {
        autoSlide: true,
        slideInterval: 4000,
        showBullets: true
    };

    // Extend options Object
    extend(this.options, options);

    // TODO: popifyl needs to be added to Babel to compile es6 "assign"
    // this.options = Object.assign(this.options, options);

    // Carousel layout HTML
    this.carouselHTML = "\n        <div class=\"carousel\">\n            <div class=\"carousel-inner\"></div>\n\n            <div class=\"carousel__nav\">\n                <button class=\"carousel__nav--left\">\n                    <img src=\"images/arrow-right.svg\">\n                </button>\n                <button class=\"carousel__nav--right\">\n                    <img src=\"images/arrow-right.svg\">\n                </button>\n            </div>\n            <div class=\"carousel__bullet-nav\"></div>\n        </div>";

    this.init();
}

// INIT FUNCTION
Carousel.prototype.init = function () {
    var self = this;
    // Initializing carousel elements
    this.el.innerHTML = this.carouselHTML;
    this.carouselEl = this.el.querySelector(".carousel");
    this.carouselInnerEl = this.el.querySelector(".carousel-inner");
    this.navRightCtrl = this.el.querySelector(".carousel__nav--right");
    this.navLeftCtrl = this.el.querySelector(".carousel__nav--left");
    this.bulletNavEl = this.el.querySelector(".carousel__bullet-nav");

    // Getting data from brokers.json
    this._getBrokersData(function (data) {
        self.createItemElements(data.data);
    });

    // Seting the listeners for navigation
    this.navRightCtrl.addEventListener('click', function () {
        self.navigateToRight();
    });
    this.navLeftCtrl.addEventListener('click', function () {
        self.navigateToLeft();
    });

    // Start Timer if enabled
    if (this.options.autoSlide) {
        this._startTimer();
    }
};

// CREATE CAROUSEL ITEMS
Carousel.prototype.createItemElements = function (brokers) {

    var self = this;

    // Update total items count
    this.itemsTotal = brokers.length;

    brokers.forEach(function (broker, index) {

        // Create carousel item element
        var item = document.createElement("div");
        item.classList.add("carousel-item");
        if (this.currentItemIndex == index) {
            item.classList.add("active");
        }

        // HTML structure of carousel item
        item.innerHTML = "\n            <div class=\"carousel-item__thumb\">\n                <img src=\" " + broker.links.logo2x + " \" alt=\"" + broker.name + " Logo\">\n            </div>\n\n            <div class=\"carousel-item__body\">\n                <div class=\"carousel-item__header\">\n                    <h1> " + broker.name + " </h1>\n                    <p>\n                        <span> " + broker.agentCount + "  Agents</span>\n                        <span>HQ: " + broker.location + "</span>\n                    </p>\n                </div>\n                <div class=\"carousel-item__content\">\n                    <p> " + broker.description + " </p>\n                </div>\n                <div class=\"carousel-item__footer\">\n                    <span> <a href=\"#\"> " + broker.residentialForRentCount + " </a> FOR RENT </span>\n                    <span> <a href=\"#\"> " + broker.residentialForSaleCount + " </a> FOR SALE </span>\n                    <span> <a href=\"#\"> " + broker.commercialTotalCount + " </a> COMMERCIAL </span>\n                </div>\n            </div>\n        ";

        this.addCarouselItem(item);

        // Create bullet navigation if enabled
        if (this.options.showBullets) {
            var bulletItem = document.createElement("span");
            this.bulletNavEl.appendChild(bulletItem);
            if (this.currentItemIndex == index) {
                bulletItem.classList.add("active");
            }
            bulletItem.addEventListener("click", function () {
                self.navigateToIndex(index);
            });

            this.bulletItems.push(bulletItem);
        }
    }, this);
};

// ADDING NEW ITEM TO CAROUSEL
Carousel.prototype.addCarouselItem = function (el) {
    // Push item to items array
    this.items.push(el);
    // Append item HTML to innder-html div
    this.carouselInnerEl.appendChild(el);
};

// SLIDING CAROUSEL ITEM TO THE RIGHT
Carousel.prototype.navigateToRight = function () {
    var newIndex = this.currentItemIndex < this.itemsTotal - 1 ? this.currentItemIndex + 1 : 0;
    this.navigateToIndex(newIndex);
};

// SLIDING CAROUSEL ITEM TO THE LEFT
Carousel.prototype.navigateToLeft = function () {
    var newIndex = this.currentItemIndex > 0 ? this.currentItemIndex - 1 : this.itemsTotal - 1;
    this.navigateToIndex(newIndex);
};

// SLIDING CAROUSEL ITEMS TO THE INDEX
Carousel.prototype.navigateToIndex = function (index) {

    // If we click activated bullet -> do nothing
    if (this.currentItemIndex == index) return;

    var dir = this.currentItemIndex <= index ? "right" : "left";

    // Curent item element & animation class
    var itemCurrent = this.items[this.currentItemIndex],
        itemCurrentAnimation = dir == "right" ? "slide-to-left" : "slide-to-right";

    // Remove active class from current bullet
    if (this.bulletItems[this.currentItemIndex]) {
        this.bulletItems[this.currentItemIndex].classList.remove("active");
    }

    // Update new current index value
    this.currentItemIndex = index;

    // Next item elment (to come in) & animation class
    var itemNext = this.items[this.currentItemIndex],
        itemNextAnimation = dir == "right" ? "slide-from-right" : "slide-from-left";

    // Add active class to new bullet
    if (this.bulletItems[this.currentItemIndex]) {
        this.bulletItems[this.currentItemIndex].classList.add("active");
    }

    // *** CURRENT ITEM ANIMATION *** //
    // Start animating current element (Slide out)
    itemCurrent.classList.add(itemCurrentAnimation);
    console.log(itemCurrent.classList.contains("active"));

    var itemCurrentAnimationEnd = function itemCurrentAnimationEnd() {
        // Once animation is done we remove active class and animation class from the item
        itemCurrent.classList.remove("active");
        itemCurrent.classList.remove(itemCurrentAnimation);
        // Also we remove the listener for animationend
        itemCurrent.removeEventListener("animationend", itemCurrentAnimationEnd, false);
    };

    // Start listening for CSS animation end
    itemCurrent.addEventListener("animationend", itemCurrentAnimationEnd, false);

    // *** NEXT ITEM ANIMATION *** //
    // Start animating next element (Slide In)
    itemNext.className = "carousel-item active";
    itemNext.classList.add(itemNextAnimation);

    var itemNextAnimationEnd = function itemNextAnimationEnd() {
        itemNext.classList.remove(itemNextAnimation);
        // Reseting classes after transition is finished
        itemNext.className = "carousel-item active";
        // Remove the listener for animationend
        itemNext.removeEventListener("animationend", itemNextAnimationEnd, false);
    };

    // Start listening for CSS animation end
    itemNext.addEventListener("animationend", itemNextAnimationEnd, false);

    // Reset timer. So, After selecting slide it will stop for 3000 ms
    if (this.options.autoSlide) {
        this._resetTimer();
    }
};

// PRIVATE FUNCTION TO GET DATA FROM JSON
Carousel.prototype._getBrokersData = function (callback) {
    var xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    xobj.open('GET', 'data/brokers.json', true);
    xobj.onreadystatechange = function () {
        if (xobj.readyState == 4 && xobj.status == "200") {
            var result = JSON.parse(xobj.responseText);
            callback(result);
        }
    };
    xobj.send(null);
};

// PRIVATE FUNCTION FOR TIMER
Carousel.prototype._startTimer = function () {
    var self = this;
    this.timer = setInterval(function () {
        self.navigateToRight();
    }, self.options.slideInterval);
};

Carousel.prototype._resetTimer = function () {
    clearInterval(this.timer);
    this._startTimer();
};

// HELPER CLASS TO MERGE OBJECTS
var extend = function extend(out) {
    out = out || {};
    for (var i = 1; i < arguments.length; i++) {
        if (!arguments[i]) continue;

        for (var key in arguments[i]) {
            if (arguments[i].hasOwnProperty(key)) out[key] = arguments[i][key];
        }
    }
    return out;
};

window.Carousel = Carousel;

// USING THE COMPONENT
var carouselElement = document.getElementById("carousel");
var car = new Carousel(carouselElement, {
    showBullets: true,
    autoSlide: true,
    autoSlideInterval: 3000
});