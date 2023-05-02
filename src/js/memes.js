/* jshint esversion: 6 */

import "./general";

class Memes {
	constructor() {
		console.log("Inside the Memes JS File.");

		this.$bottomTextInput = document.querySelector("#bottomText");
		this.$imageInput = document.querySelector("#image");
		this.$downloadButton = document.querySelector("#downloadMeme");
		this.$defaultImage = document.querySelector("#defaultImage");
		this.$canvas = document.querySelector("#imgCanvas");
		this.$context = this.$canvas.getContext("2d");

		this.deviceWidth = window.innerWidth;

		// Local storage - get - image
		if (localStorage.image !== undefined) {
			this.image = new Image();
			this.image.src = localStorage.image;
			this.image.onload = () => this.createMeme();
		} else {
			this.image = this.$defaultImage;

			this.$imageInput.value = "";
		}

		// Local storage - get - bottom text
		if (localStorage.bottomText !== undefined) this.$bottomTextInput.value = localStorage.bottomText;
		else this.$bottomTextInput.value = "bottom text";

		this.addEventListeners();
		this.createCanvas();
		this.createMeme();
	}

	createCanvas() {
		this.$canvas.width = this.$canvas.height = Math.min(1000, this.deviceWidth - 30);
	}

	createMeme() {
		let c = this.$context;
		let cW = this.$canvas.width;
		let cH = this.$canvas.height;

		c.clearRect(0, 0, cW, cH);

		cW = this.image.width;
		cH = this.image.height;

		this.resizeCanvas(cW, cH);

		c.drawImage(this.image, 0, 0);

		const fontSize = ((cW + cH) / 2) * 4 / 100;

		c.font = `${fontSize}pt sans-serif`;
		c.textAlign = "center";
		c.textBaseline = "top";
		c.lineJoin = "round";
		c.lineWidth = fontSize / 5;
		c.strokeStyle = "black";
		c.fillStyle = "white";

		const bottomText = this.$bottomTextInput.value.toUpperCase();

		// Local storage - set - bottom text
		localStorage.bottomText = bottomText;

		let array = [bottomText, cW / 2, cH * (90 / 100)];

		c.strokeText(...array);
		c.fillText(...array);

		this.downloadMeme();
	}

	addEventListeners() {
		this.createMeme = this.createMeme.bind(this);
		this.downloadMeme = this.downloadMeme.bind(this);
		this.loadImage = this.loadImage.bind(this);
		this.resizeCanvas = this.resizeCanvas.bind(this);

		this.$bottomTextInput.onchange = this.createMeme;
		this.$bottomTextInput.onkeyup = this.createMeme;
		this.$downloadButton.onclick = this.downloadMeme;
		this.$imageInput.onchange = this.loadImage;
	}

	downloadMeme() {
		const i = this.$canvas.toDataURL("image/png");

		this.$downloadButton.setAttribute("href", i);
	}

	loadImage() {
		if (this.$imageInput.files && this.$imageInput.files[0]) {
			let r = new FileReader();

			r.onload = () => {
				this.image = new Image();
				this.image.src = r.result;

				// Local storage - set - image
				localStorage.image = this.image.src;

				this.image.onload = () => this.createMeme();
			};

			r.readAsDataURL(this.$imageInput.files[0]);
		}
	}

	resizeCanvas(cW, cH) {
		let s = 1.0;
		let r = Math.min(1000, this.deviceWidth - 30);

		while (cW > r && cH > r) {
			cW /= 2;
			cH /= 2;
			s /= 2;
		}

		this.$canvas.width = cW;
		this.$canvas.height = cH;
		this.$context.scale(s, s);
	}
}

window.onload = () => new Memes();