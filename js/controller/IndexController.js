/*
 Index Controller
 */
var IndexController = {

	numberOfImages: 5,
	FIRST: 0,
	currentImage: 0,

	init: function() {
		IndexController.setControls();
	},

	setParking: function(imageIndex) {
		var img = document.getElementById('parking-image');
		img.src = 'images/parking-' + imageIndex + '.png';
	},

	setControls: function(){
		IndexController.setPrevious();
		IndexController.setNext();
		IndexController.setKeys();
	},

	setPrevious: function(){
		var spanPrevious = document.querySelector('.previous');
		spanPrevious.addEventListener('click', function(){
			IndexController.goPrevious();
		});
	},

	setNext: function(){
		var spanNext = document.querySelector('.next');
		spanNext.addEventListener('click', function(){
			IndexController.goNext();
		});
	},

	setKeys: function() {
		var 
			KEY_LEFT = 37,
			KEY_RIGHT = 39;

		document.addEventListener('keydown', function(e){
			if(e.keyCode === KEY_LEFT) {
				IndexController.goPrevious();
			}
			else if(e.keyCode === KEY_RIGHT) {
				IndexController.goNext();
			}
		});
	},

	goPrevious: function() {
		IndexController.currentImage--;
		if(IndexController.currentImage < IndexController.FIRST) {
			IndexController.currentImage = IndexController.numberOfImages;
		}
		IndexController.setParking(IndexController.currentImage);
	},

	goNext: function(){
		IndexController.currentImage++;
		if(IndexController.currentImage > IndexController.numberOfImages) {
			IndexController.currentImage = IndexController.FIRST;
		}
		IndexController.setParking(IndexController.currentImage);
	}

};

//initialization
IndexController.init();