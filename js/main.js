'use strict';

function Carousel(el) {

    this.el = el;

    this.carouselEl       = null;
    this.carouselInnerEl  = null;
    this.navRightCtrl     = null;
    this.navLefttCtrl     = null;
    this.items            = [];
    this.initialItemIndex = 0;
    this.currentItemIndex = 0;
    this.itemsTotal       = 0;

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
        </div>`;

}


// INIT FUNCTION
Carousel.prototype.init = function () {
    var self = this;
    // Initializing carousel elements
    this.el.innerHTML    = this.carouselHTML;
    this.carouselEl      = this.el.querySelector(".carousel");
    this.carouselInnerEl = this.el.querySelector(".carousel-inner");
    this.navRightCtrl    = this.el.querySelector(".carousel__nav--right");
    this.navLeftCtrl     = this.el.querySelector(".carousel__nav--left");

    // Getting data from brokers.json
    this._getBrokersData(function(data){
        self.createItemElements(data.data);
    });

    // Seting the listeners for navigation
    this.navRightCtrl.addEventListener('click', function() { self.navigate('right'); });
    this.navLeftCtrl.addEventListener('click', function() { self.navigate('left');  });
};


// CREATE CAROUSEL ITEMS
Carousel.prototype.createItemElements = function(brokers){

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

    }, this);
}

// ADDING NEW ITEM TO CAROUSEL
Carousel.prototype.addCarouselItem = function(el){
    // Push item to items array
    this.items.push(el);
    // Append item HTML to innder-html div
    this.carouselInnerEl.appendChild(el);
}


// SLIDING CAROUSEL ITEMS
Carousel.prototype.navigate = function(dir){

    // Curent item element & animation class
    var itemCurrent = this.items[this.currentItemIndex],
        itemCurrentAnimation = dir == "right" ? "slide-to-left" : "slide-to-right";

    // Update new current index value
    if( dir === "right" ) {
        this.currentItemIndex = this.currentItemIndex < this.itemsTotal-1 ? this.currentItemIndex + 1 : 0;
    }
    else {
        this.currentItemIndex = this.currentItemIndex > 0 ? this.currentItemIndex - 1 : this.itemsTotal - 1;
    }

    // Next item elment (to come in) & animation class
    var itemNext = this.items[this.currentItemIndex],
        itemNextAnimation = dir == "right" ? "slide-from-right" : "slide-from-left";





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


    // console.log(dir);
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








// USING THE COMPONENT
var carouselElement = document.getElementById("carousel");
var car = new Carousel(carouselElement);
car.init();













// var anim = document.getElementById("test");
// var anim2 = document.getElementById("test2");
// anim.addEventListener("animationend", AnimationListener, false);



// function AnimationListener(e){

//     if (e.animationName == "slideToLeft") {
//         anim.parentNode.removeChild(anim);
//     }
//     console.log("animation finished", e.animationName);
// }

// var left = document.getElementById("left");

// left.addEventListener("click", function(e){
//     e.preventDefault();
//     anim.classList.add("slide-to-left");
//     anim2.style.display = "flex";
//     console.log("asd");
// });