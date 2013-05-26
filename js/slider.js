(function(window, undefined){
var
	defaultOption = {
		now: 0,
		type:"simple",
		showCapital: true,
		animateCapital : true,
		hoverCapital: false,
		showArrow: true,
		showPaginator: true,
		autoScroll: true,
		slideInterval: 5000,
		time:1000,
		cancelEvent: true,
		effect: "stack",
		onChangeCallback: function(){},
	},
	div = document.createElement("div"),
	transition = div.style.transition == "" ? "transition" : (div.style.webkitTransition == ""? "webkitTransition" : (div.style.mozTransition =="" ? "mozTransition": (div.style.oTransition == "" ? "oTransition" : null))),
	Slider = function(domId, sliders, option){
		this.init(domId, sliders, option);
	};

Slider.fn = Slider.prototype = {
	constructor: Slider,
	pageDom: [],
	tempNode:{},
	sliders:[],
	option: {},
	init: function(domId, sliders, option){
		//if no options set, use default option
		this.domId = domId || "slider";
		if(!(Array.isArray(sliders) && sliders.length)){
			option = sliders;
			this.sliders = this.getSlidersByDom(domId);
		}
		else
			this.sliders = sliders;

		this.option = (function(){
				var a = {};
				for(i in defaultOption){
					a[i] = (option && option[i] !== undefined ? option[i] : defaultOption[i])
				};
				return a})()
				//just a deep copy
		console.log(this.option);

		this.option['domId'] = domId;
		this.getSizeByDom.call(this, this.option, this.sliders);
		return [ this.domId, this.sliders, this.option ]
	},
	getSlidersByDom: function(domId){
		var dom = document.getElementById(domId),
			sliderArray = dom ? dom.getElementsByTagName('li') : [],
			length = sliderArray.length,
			sliders = [];

		if(!dom) return [];
		if(length){
			for(var i = 0; i<length;i++){
				sliders[i] = {};
				sliders[i]['url'] = sliderArray[i].getElementsByTagName('a')[0].href;
				var img = sliderArray[i].getElementsByTagName('img')[0];
				sliders[i]['img'] = img.src;
				sliders[i]['alt'] = img.alt;
				sliders[i]['title'] = img.title;
			}
			return sliders;
		}
		return []
	},
	getSizeByDom: function(option, sliders){
		var dom = document.getElementById(option['domId']);
		var width = this.option["width"] =  this.option["width"] || dom.clientWidth;
		var height = this.option["height"] = this.option["height"] || dom.clientHeight;
		this.createDom.call(this, this.option, this.sliders);
		return [width, height];
	},
	createDom: function(option, sliders){
		var div = document.createElement("div"),
			a = document.createElement("a"),
			ul = document.createElement('ul'),
			li = document.createElement('li'),
			img = document.createElement('img'),
			outer = document.getElementById(option['domId']),
			length = sliders.length,
			that = this,
			go = that.changeSlide;
		outer.style.position = outer.style.position || "relative";
		outer.innerHTML = "";
		var sliderMain = div.cloneNode();
		sliderMain.id = "sliders";
		outer.appendChild(sliderMain);

		if(option.showPaginator){
			var paginator = ul.cloneNode();
			paginator.className = "paginators";
			var pageli = li.cloneNode();
			pageli.className = "paginator";
			for(var i =0; i<length; i++){
				pageli = pageli.cloneNode();
				pageli.className = pageli.className.replace(/(?:^|\s)active(?!\S)/g,'');
				pageli.innerHTML = (i+1);
				if(i == 0){
					pageli.className += " active";
				}
				paginator.appendChild(pageli);
			}
			outer.appendChild(paginator);
			paginator.addEventListener('click',function(e){
				if(e.target.nodeName == "LI"){
					var next = parseInt(e.target.innerHTML)-1;
					go.call(that, option['now'], next, option, length)
				}
			})
		}

		if(option.type === 'simple'){
			var pages = [];
			for(var i = 0; i < length;i++){
				var page = pages[i] = a.cloneNode();
				page.id = i + "_slider";
				page.href = sliders[i].url;
				page.style.width = option['width'] + 'px';
				page.style.height = option['height'] + 'px';
				page.style.position = 'absolute';
				page.style.textAlign = 'center';
				page.style[transition] = 'left '+ option['time'] +'ms';
				var imgWrap = div.cloneNode();
				imgWrap.className = "image-wrap";
				imgWrap.style.display = 'table-cell';
				imgWrap.style.verticalAlign = 'middle';
				imgWrap.style.height = option['height'] + 'px';
				page.appendChild(imgWrap);
				var pageImg = img.cloneNode();
				pageImg.src = sliders[i].img;
				pageImg.alt = sliders[i].alt;
				pageImg.style.maxHeight = option['height']+"px";
				pageImg.style.maxWidth = option['width']+"px";
				pageImg.style.verticalAlign = 'middle';
				imgWrap.appendChild(pageImg);

			}
			sliderMain.appendChild(pages[0]);
			that.pageDom = pages;
		}
		else if(option.type === 'complex'){
		}
		if(option.autoScroll){
			that.autoScroll = setInterval(function(){
				go.call(that, option['now'], option['now']+1, option, length)
			}, option.slideInterval);
			outer.addEventListener('mouseover', function(){
				clearInterval(that.autoScroll);
			}, false);
			outer.addEventListener('mouseout', function(){
				that.autoScroll = setInterval(function(){
					go.call(that, option['now'], option['now']+1, option, length)
				}, option.slideInterval);
			}, false);
		}

		if (option.showArrow){
			var left = div.cloneNode();
			left.innerHTML = "<";
			left.id = option.domId+"_leftArrow";
			left.className = "leftArrow"
			outer.appendChild(left);
			var right = div.cloneNode();
			right.innerHTML = ">";
			right.id = option.domId+"_rightArrow";
			right.className = "rightArrow"
			outer.appendChild(right);
			left.addEventListener("click", function(){
				go.call(that, option['now'], option['now']-1, option, length)
			}, false);
			right.addEventListener("click", function(e){
				e.stopPropagation();
				go.call(that, option['now'], option['now']+1, option, length)
			}, false);
		}
		
	},
	changeSlide: function(now, next, option, length){
		var that = this,
			pageDom = that.pageDom;
		try{
			that.tempNode.parentNode.removeChild(that.tempNode);
			that.tempNode.style.left = '0px';
			clearTimeout(that.removeNow);
		}
		catch(e){}

		if (next === now) return;
		var move = (next > now ? -1 : 1);
		next = (next !== length && next !== -1 ? next : (next === length ? 0 : length-1) );
		if(option.effect === 'stack'){
			var moveLeft = option['width']*move
			pageDom[now].style.left = moveLeft + "px";
			pageDom[now].parentNode.insertBefore(pageDom[next],pageDom[now]);
			that.tempNode = pageDom[now];
			that.removeNow = setTimeout(function(){
				that.tempNode.parentNode.removeChild(pageDom[now]);
				that.tempNode.style.left = '0px';
			}, option.time);
		}
		if(option.showPaginator){
			var outer = document.getElementById(option.domId);
			var paginator = outer.getElementsByClassName('paginator');
			paginator[now].className = paginator[now].className.replace(/(?:^|\s)active(?!\S)/g,'');
			paginator[next].className += " active";
		}
		option['now'] = next;
		var that = this;
		return (option.onChangeCallback ? option.onChangeCallback.call(that) : pageDom[i]);
	},
}

	
if ( typeof window === "object" && typeof window.document === "object" ) {
	window.Slider = Slider;
}
})( window )