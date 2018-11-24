(function () {
    function Slider (options) {
       /* var slider = typeof options.slider == 'string' ? document.querySelectorAll(options.slider) : options.slider;
        
        for( var i = 0; i < slider; i ++ ) {
            options.slider = slider[i];
            
            new Slider(options);
        }*/
        options = Object.assign(sliderDefaultOption,options);
        this.slider =  typeof options.slider == 'string' ? document.querySelector(options.slider) : options.slider;
        this.root = options.root === document ? document : options.slider;
        this.list = typeof options.list == 'string' ? this.slider.querySelector(options.list) : options.list;
        this.item = typeof options.item == 'string' ? this.slider.querySelectorAll(options.item) : options.item;
        this.navPrev = options.navPrev;
        this.navNext = options.navNext;
        this.navs = options.nav ? this.root.querySelectorAll(options.nav) : false;
        this.pagination = options.pagination ? this.root.querySelector(options.pagination) : false;
        this.mode = options.mode ? options.mode : 'vertical';
        this.loop = options.loop;
        this.preview = options.preview;
        this.autoPlay = options.autoPlay;
        this.speed = options.speed;
        this.autoSpeed = options.autoSpeed;
        this.page = this.preview === true ? -2 : -1;
        this.timeout = null;
        this.change = options.change ? options.change : false;
        this.easing = options.easing;
        
        this.init();
    }
    
    Slider.prototype.loopItem = function ( callback ) {
        for( var i = 0; i < this.item.length; i ++ ) {
            callback(this.item[i],i);
        }
    }
    
    Slider.prototype.autoplay = function () {
        var app = this;
        if( this.autoPlay ) {
            this.timeout = setTimeout(function () {
                if( app.autoPlay ) {
                    app.move(-1);
                } 
            },app.autoSpeed)
        }
    }
    
    Slider.prototype.move = function (direction,target) {
        var app = this;
        if( target ) target = ( target * -1 ) -1;
        var page = direction === null ? target : this.page + direction;
        if( false === this.loop ) {
            if( page >= 0 || page < ( this.item.length * -1 ) ) return
        }
        if( this.slider.classList.contains('play') ) return;
        if( this.timeout !== null && this.autoPlay === true ) clearTimeout(this.timeout)
        
        this.slider.classList.add('play');
        this.list.style.transitionDuration = this.speed+'ms';
        this.list.style.transform = this.mode == 'vertical' ? 'translateY('+(page*100)+'%)' : 'translateX('+(page*100)+'%)';
        
        this.page = page;
        
        if( true === this.loop ) {
            if( page >= 0 && direction > 0 ) this.reset( this.item.length * -1 );
            if( page < ( this.item.length * -1 ) && direction < 0 ) this.reset( this.preview === true ? -2 : -1 );
        }
        if( this.change !== false ) this.change( ( this.page * -1 ) -1 );
        this.loopItem(function (item,index) {
            app.paginations[index].classList.remove('active');
        });
        this.paginations[(app.page*-1)-1].classList.add('active');
        
        setTimeout(function () {
            app.slider.classList.remove('play');
            app.autoplay();
        },app.speed);
    }
    
    Slider.prototype.reset = function (page) {
        var app = this;
        this.page = page;
        setTimeout(function () {
            app.list.style.transitionDuration = '0ms';
            app.list.style.transform = app.mode == 'vertical' ? 'translateY('+(page*100)+'%)' : 'translateX('+(page*100)+'%)';
        },app.speed);
    }
    
    Slider.prototype.setElement = function () {
        var app = this;
        this.slider.style.overflowX = 'hidden';
        this.list.style.transform = this.mode == 'vertical' ? 'translateY('+(this.page*100)+'%)' : 'translateX('+(this.page*100)+'%)';
        this.list.style.fontSize = 0;
        this.list.style.whiteSpace = 'nowrap';
        this.list.style.transitionDuration = '0ms';
        this.list.style.transitionTimingFunction = styleEasing[this.easing];
        this.list.style[ this.mode == 'vertical' ? 'height' : 'width' ] = '100%';
        this.loopItem(function (item) {
            item.style.display = 'inline-block';
            item.style[ this.mode == 'vertical' ? 'height' : 'width' ] = '100%';
            item.style.fontSize = '12px';    
        })
        var itemCloneFirst = this.item[0].cloneNode(true);
        var itemCloneLast = this.item[this.item.length-1].cloneNode(true);
        this.list.insertAdjacentElement('beforeend',itemCloneFirst);
        this.list.insertAdjacentElement('afterbegin',itemCloneLast);
        
        if( false !== this.pagination ) {
            var paginationChild = '';
            
            switch( this.pagination.tagName.toLowerCase() ) {
                case 'ul' : this.paginationTagName = 'li'; break;
                case 'span' : this.paginationTagName = 'span'; break;
                default : this.paginationTagName = 'div';
            }
            
            this.loopItem(function (item,i) {
                paginationChild += '<'+app.paginationTagName+' data-slider="pagination" data-index="'+i+'" class="pagination">'+(i+1)+'째로 이동</'+app.paginationTagName+'>';
            })
            

            this.pagination.insertAdjacentHTML('beforeend',paginationChild);
            this.paginations = this.root.querySelectorAll('[data-slider="pagination"]');
            this.paginations[0].classList.add('active');
        }
    }
    
    Slider.prototype.init = function () {
        var app = this;
        this.setElement();
        if( false !== this.navs ) {
            for( var i = 0; i < this.navs.length; i ++ ) {
                this.navs[i].addEventListener('click',function () {
                    app.move( this.classList.contains(app.navNext) === true ? -1 : 1 );
                })
            }
        }
        
        if( false !== this.pagination ) {
            for( var i = 0; i < this.paginations.length; i ++ ) {
                this.paginations[i].addEventListener('click',function () {
                    app.move(null,this.getAttribute('data-index'));
                })
            }
        }
        this.autoplay();
    }
    
    var sliderDefaultOption = {
        speed : 800,
        autoSpeed : 2000,
        autoPlay : true,
        loop : true,
        root : document,
        mode : 'horizontal',
        preview : false,
        easing : 'default',
    };
    
    var styleEasing = {
        'easingInQuad' : 'cubic-bezier(0.550, 0.085, 0.680, 0.530)',
        'easeInCubic' : 'cubic-bezier(0.550, 0.055, 0.675, 0.190)',
        'easeInQuart' : 'cubic-bezier(0.895, 0.030, 0.685, 0.220)',
        'easeInQuint' : 'cubic-bezier(0.755, 0.050, 0.855, 0.060)',
        'easeInSine' : 'cubic-bezier(0.470, 0.000, 0.745, 0.715)',
        'easeInExpo' : 'cubic-bezier(0.950, 0.050, 0.795, 0.035)',
        'easeInCirc' : 'cubic-bezier(0.600, 0.040, 0.980, 0.335)',
        'easeInBack' : 'cubic-bezier(0.600, -0.280, 0.735, 0.045)',
        'easeOutQuad' : 'cubic-bezier(0.250, 0.460, 0.450, 0.940),',
        'easeOutCubic' : 'cubic-bezier(0.215, 0.610, 0.355, 1.000)',
        'easeOutQuart' : 'cubic-bezier(0.165, 0.840, 0.440, 1.000)',
        'easeOutExpo' : 'cubic-bezier(0.190, 1.000, 0.220, 1.000)',
        'easeOutCirc' : 'cubic-bezier(0.190, 1.000, 0.220, 1.000)',
        'easeInOutQuad' : 'cubic-bezier(0.455, 0.030, 0.515, 0.955)',
        'easeInOutCubic' : 'cubic-bezier(0.645, 0.045, 0.355, 1.000)',
        'easeInOutQuart' : 'cubic-bezier(0.770, 0.000, 0.175, 1.000)',
        'easeInOutSine' : 'cubic-bezier(0.445, 0.050, 0.550, 0.950)',
        'easeInOutExpo' : 'cubic-bezier(1.000, 0.000, 0.000, 1.000)',
        'easeInOutCirc' : 'cubic-bezier(0.785, 0.135, 0.150, 0.860)',
        'easeInOutBack' : 'cubic-bezier(0.680, -0.550, 0.265, 1.550)',
        'default' : 'ease'
    }
    
    window.Slider = Slider;
})();