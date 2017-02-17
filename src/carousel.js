'use strict';

function Carousel(el, options) {

    this.el = el;

    this.carouselEl       = null;
    this.carouselInnerEl  = null;
    this.navRightCtrl     = null;
    this.navLefttCtrl     = null;
    this.bulletNavEl      = null;
    this.items            = [];
    this.bulletItems      = [];
    this.initialItemIndex = 0;
    this.currentItemIndex = 0;
    this.itemsTotal       = 0;
    this.timer            = null;

    this.options = {
        autoSlide: true,
        slideInterval: 4000,
        showBullets: true
    }

    this.options = Object.assign(this.options, options);

    console.log(this.options);

    // Carousel layout HTML
    this.carouselHTML = `
        <div class="carousel">
            <div class="carousel-inner"></div>

            <div class="carousel__nav">
                <button class="carousel__nav--left">
                    <img src="images/arrow-right.svg">
                </button>
                <button class="carousel__nav--right">
                    <img src="images/arrow-right.svg">
                </button>
            </div>
            <div class="carousel__bullet-nav"></div>
        </div>`;

    this.init();
}







// INIT FUNCTION
Carousel.prototype.init = function () {
    var self = this;
    // Initializing carousel elements
    this.el.innerHTML     = this.carouselHTML;
    this.carouselEl       = this.el.querySelector(".carousel");
    this.carouselInnerEl  = this.el.querySelector(".carousel-inner");
    this.navRightCtrl     = this.el.querySelector(".carousel__nav--right");
    this.navLeftCtrl      = this.el.querySelector(".carousel__nav--left");
    this.bulletNavEl = this.el.querySelector(".carousel__bullet-nav");

    // Getting data from brokers.json
    this._getBrokersData(function(data){
        self.createItemElements(data.data);
    });

    // Seting the listeners for navigation
    this.navRightCtrl.addEventListener('click', function() { self.navigateToRight(); });
    this.navLeftCtrl.addEventListener('click', function() { self.navigateToLeft();  });

    // Start Timer if enabled
    if (this.options.autoSlide){
        this._startTimer();
    }
};







// CREATE CAROUSEL ITEMS
Carousel.prototype.createItemElements = function(brokers){

    var self = this;

    // Update total items count
    this.itemsTotal = brokers.length;

    brokers.forEach(function(broker, index) {

        // Create carousel item element
        var item = document.createElement("div");
        item.classList.add("carousel-item");
        if (this.currentItemIndex == index){
            item.classList.add("active");
        }

        // HTML structure of carousel item
        item.innerHTML = `
            <div class="carousel-item__thumb">
                <img src=" ${broker.links.logo2x} " alt="">
            </div>

            <div class="carousel-item__body">
                <div class="carousel-item__header">
                    <h1> ${broker.name} </h1>
                    <p>
                        <span> ${broker.agentCount}  Agents</span>
                        <span>HQ: ${broker.location}</span>
                    </p>
                </div>
                <div class="carousel-item__content">
                    <p> ${broker.description} </p>
                </div>
                <div class="carousel-item__footer">
                    <span> <a href="#"> ${broker.residentialForRentCount} </a> FOR RENT </span>
                    <span> <a href="#"> ${broker.residentialForSaleCount} </a> FOR SALE </span>
                    <span> <a href="#"> ${broker.commercialTotalCount} </a> COMMERCIAL </span>
                </div>
            </div>
        `;

        this.addCarouselItem(item);

        // Create bullet navigation if enabled
        if (this.options.showBullets) {
            var bulletItem = document.createElement("span");
            this.bulletNavEl.appendChild(bulletItem);
            if (this.currentItemIndex == index){
                bulletItem.classList.add("active");
            }
            bulletItem.addEventListener("click", function(){
                self.navigateToIndex(index);
            });

            this.bulletItems.push(bulletItem);            
        }



    }, this);
}






// ADDING NEW ITEM TO CAROUSEL
Carousel.prototype.addCarouselItem = function(el){
    // Push item to items array
    this.items.push(el);
    // Append item HTML to innder-html div
    this.carouselInnerEl.appendChild(el);
}









// SLIDING CAROUSEL ITEM TO THE RIGHT
Carousel.prototype.navigateToRight = function(){
    var newIndex = this.currentItemIndex < this.itemsTotal-1 ? this.currentItemIndex + 1 : 0;
    this.navigateToIndex(newIndex);
}

// SLIDING CAROUSEL ITEM TO THE LEFT
Carousel.prototype.navigateToLeft = function(){
    var newIndex = this.currentItemIndex > 0 ? this.currentItemIndex - 1 : this.itemsTotal - 1;
    this.navigateToIndex(newIndex);
}


// SLIDING CAROUSEL ITEMS TO THE INDEX
Carousel.prototype.navigateToIndex = function(index){

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

    var itemCurrentAnimationEnd = function(){
        // Once animation is done we remove active class and animation class from the item
        itemCurrent.classList.remove("active");
        itemCurrent.classList.remove(itemCurrentAnimation);
        // Also we remove the listener for animationend
        itemCurrent.removeEventListener("animationend", itemCurrentAnimationEnd, false);
    }

    // Start listening for CSS animation end
    itemCurrent.addEventListener("animationend", itemCurrentAnimationEnd, false);



    // *** NEXT ITEM ANIMATION *** //
    // Start animating next element (Slide In)
    itemNext.classList.add("active");
    itemNext.classList.add(itemNextAnimation);

    var itemNextAnimationEnd = function(){
        itemNext.classList.remove(itemNextAnimation);
        // Remove the listener for animationend
        itemNext.removeEventListener("animationend", itemNextAnimationEnd, false);
    }

    // Start listening for CSS animation end
    itemNext.addEventListener("animationend", itemNextAnimationEnd, false);


    // Reset timer. So, After selecting slide it will stop for 3000 ms
    if (this.options.autoSlide){
        this._resetTimer();
    }
}









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
}




// PRIVATE FUNCTION FOR TIMER
Carousel.prototype._startTimer = function () {
    var self = this;
    this.timer = setInterval(function(){
        self.navigateToRight();
    }, self.options.slideInterval);
}


Carousel.prototype._resetTimer = function () {
    clearInterval(this.timer);
    this._startTimer();
}


// USING THE COMPONENT
        var carouselElement = document.getElementById("carousel");
        var car = new Carousel(carouselElement, {
            showBullets: true,            
            autoSlide: true,
            autoSlideInterval: 3000
        });