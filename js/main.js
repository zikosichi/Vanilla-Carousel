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

    // Carousel layout HTML
    this.carouselHTML = `
        <div class="carousel">
            <div class="carousel-inner"></div>

            <div class="carousel__nav">
                <button class="carousel__nav--left" id="left">
                    <img src="images/arrow-right.svg" alt="">
                </button>
                <button class="carousel__nav--right">
                    <img src="images/arrow-right.svg" alt="">
                </button>
            </div>
        </div>`;

    this.itemHTML = `
        <div class="carousel-item slide-form-right">

            

        </div>
    `;


    this.init = function () {
        var self = this;
        // Initializing carousel elements
        this.el.innerHTML    = this.carouselHTML;
        this.carouselEl      = this.el.querySelector(".carousel");
        this.carouselInnerEl = this.el.querySelector(".carousel-inner");
        this.navRightCtrl    = this.el.querySelector(".carousel__nav--right");
        this.navLefttCtrl    = this.el.querySelector(".carousel__nav--left");

        // Getting data from brokers.json
        this._getBrokersData(function(data){
            self.createItemElements(data.data);
        });
    };


    this.createItemElements = function(brokers){
        // var self = this;

        brokers.forEach(function(broker, index) {
            // console.log(broker);
            var item = document.createElement("div");
            item.classList.add("carousel-item");
            if (this.currentItemIndex == index){
                item.classList.add("active");
            }



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


    this.addCarouselItem = function(el){
        this.items.push(el);
        this.carouselInnerEl.appendChild(el);

    }



    // Private function to get data from JSON
    this._getBrokersData = function (callback) {
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

}


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