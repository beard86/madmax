"use strict";

var data;

var order = {
    platform: "PC",
    countryCode: localeCode,
    country: localeName,
    product: "STANDARD EDITION",
    retailer: ""
};

$(function(){

    $(".trailer-poster").bind("click",function() {
        $(this).hide();
        $(this).parent().find("#ytplayer").show();
        var videoID = 'e1xojS4rnUo';
        $(this).parent().find("#ytplayer").attr("src","http://www.youtube.com/embed/"+videoID+"?autoplay=1&color=black&controls=2&rel=0&showinfo=0&theme=dark&origin=http://buy.www.madmaxgame.com");
    });













    // PREORDER

    $("body").on("click", function(el) {
        switch(el.toElement.className) {
            case "dropdown-value":
            case "dropdown-arrow":
            case "dropdown-item":
                break;
            default:
                $(".dropdown-items").hide();
        }
    });

    $(".preorder-platform").on("click", function() {
        $(".preorder-platform").addClass("faded");
        $(".preorder-platform").removeClass("active");
        
        $(this).removeClass("faded");
        $(this).addClass("active");

        order.platform = $(this).html().replace(" ","");

        buildDropDowns(true);
        loadPackshot();
    });
    
    var countryList = [
        {
            key: 'au',
            title: 'AUSTRALIA'
        },{
            key: 'be-fr',
            title: 'BELGIQUE'
        },{
            key: 'be-nl',
            title: 'BELGIË'
        },{
            key: 'dk',
            title: 'DANMARK'
        },{
            key: 'de',
            title: 'DEUTSCHLAND'
        },{
            key: 'es',
            title: 'ESPAÑA'
        },{
            key: 'fi',
            title: 'FINLAND'
        },{
            key: 'fr',
            title: 'FRANCE'
        },{
            key: 'it',
            title: 'ITALIA'
        },{
            key: 'nl',
            title: 'NEDERLAND'
        },{
            key: 'no',
            title: 'NORGE'
        },{
            key: 'ch',
            title: 'SCHWEIZ'
        },{
            key: 'at',
            title: 'ÖSTERREICH'
        },{
            key: 'se',
            title: 'SVERIGE'
        },{
            key: 'us',
            title: 'UNITED STATES'
        },{
            key: 'gb',
            title: 'UK'
        }
    ];
    buildDropDown("preorder-country",countryList, order.country);

    $.getJSON("../../data/retailers.json", function(response) {
        data = response;

        buildDropDowns(true);
        loadPackshot();
    });

    function buildDropDowns(both) {
        if(both) {
            try {
                buildDropDown("preorder-product", _.pluck(data[order.platform][order.countryCode], "name"), data[order.platform][order.countryCode][0].name);
                order.product = data[order.platform][order.countryCode][0].name;
            } catch(err) {
                clearDropDown("preorder-product");
                order.product = null;
            }
        }

        try {
            var list = _.pluck(_.find(data[order.platform][order.countryCode], {name: order.product}).retailer, "name");
            var current = _.find(data[order.platform][order.countryCode], {name: order.product}).retailer[0].name;
            buildDropDown("preorder-retailer", list, current);
            order.retailer = current;
        } catch(err) {
            clearDropDown("preorder-retailer");
            order.retailer = null;
        }
    }

    function buildDropDown(id, list, currentValue) {
        var items = "";
        _.each(list, function(item) {
            if(id=="preorder-country") {
                items += "<div class='dropdown-item' data-key='"+item.key.toUpperCase()+"'>"+item.title.toUpperCase()+"</div>";
            } else {
                items += "<div class='dropdown-item'>"+item.toUpperCase()+"</div>";
            }
        });

        var drop = "#"+id;

        $(drop).html(
            "<div class='dropdown-value'>"+currentValue.toUpperCase()+"</div>"+
            "<div class='dropdown-arrow'></div>"+
            "<div class='dropdown-items'>"+items+"</div>"
        );

        
        $(drop).find(".dropdown-value").on("click",function() {
            $(".dropdown .dropdown-items").hide();
            $(drop).find(".dropdown-items").toggle();
        });
        $(drop).find(".dropdown-arrow").on("click",function() {
            $(".dropdown .dropdown-items").hide();
            $(drop).find(".dropdown-items").toggle();
        });

        $(drop).find(".dropdown-item").on("click",function() {
            $(drop).find(".dropdown-value").html($(this).html());
            $(drop).find(".dropdown-items").toggle();

            if($(this).attr("data-key")) {
                updateValue(id, $(this).attr("data-key"));
            } else {
                updateValue(id, $(this).html());
            }
        });
    }

    function clearDropDown(id) {
        $("#"+id).find(".dropdown-items").html("");
        $("#"+id).find(".dropdown-value").html("");
        $(".preorder-visit").hide();
    }

    function updateValue(id, value) {
        switch(id) {
            case "preorder-platform":
                order.platform = value;
                buildDropDowns(true);
                break;
            case "preorder-country":
                order.countryCode = value.toLowerCase();
                buildDropDowns(true);
                break;
            case "preorder-product":
                order.product = value;
                buildDropDowns();
                break;
            case "preorder-retailer":
                order.retailer = value;
                break;
        }
        loadPackshot();
    }

    var orderURL;

    function loadPackshot() {
        try {
            var packshotURL = _.find(data[order.platform][order.countryCode], {name: order.product}).packshot;
        } catch(err) {
            return $(".preorder-packshot").css("background-image","");
        }
        $(".preorder-packshot").css("background-image","url('../../data/packshots/"+packshotURL+"')");

        try {
            orderURL = _.find(_.find(data[order.platform][order.countryCode], {name: order.product}).retailer, {name: order.retailer}).url;
            $(".preorder-visit").show();
        } catch(err) {
            $(".preorder-visit").hide();
        }
    }

    $(".preorder-visit").on("click", function() {
        window.open(orderURL, '_blank');
    });

});



var els = {
    el : this.div,
    localeSelector : $("#locale-selector"),
    localeSelectorLabel : null,
    localeSelectorList : null
};

/**
 * result of locale-switcher change here
 * @param _lang : String
 */
var onLocaleChanged = function (goTo){
    window.location.href = "../../"+goTo;
};



/**
 * locale-switcher dropdown widget
 * see 'onLocaleChanged' for output
 * IIFE
 */
var localeSelectorController = ( function(){

    var keys_$ = [],
        numKeys = null,
        currSelection = null,
        labelSpanEl = null,
        isOpen = false,
        isFirstRun = true;

    els.localeSelectorLabel = els.localeSelector.find( ".label" );
    els.localeSelectorList = els.localeSelector.find( ".list" );
    labelSpanEl = els.localeSelectorLabel.find( "span" );

    els.localeSelectorLabel.on( "click", function( e ){
        isOpen = !isOpen;
        openList();
    });

    // *** 'off click' - close dropdown if clicking elesewhere in dom
    $( els.el ).on( "click", function( e ){

        try {
            ( e.target.closest("div") !== els.localeSelector[ 0 ] ) ? reset() : null;
        }
        catch ( e ) { /*fail silently on ie*/ }

    });

    // *** show or hide list based on value of 'isOpen'
    function openList(){
        ( isOpen ) ? els.localeSelector.addClass( "is-open" ) : els.localeSelector.removeClass( "is-open" );
    }

    initModel();

    // *** examine dom, create value object for each entry, add event listener
    function initModel(){

        var t_$ = els.localeSelectorList.find( "li" ),
            hasDefault = false;

        t_$.each( function ( _index, _el ){

            var vo = {
                el : $( _el ),
                index : _index,
                label : $( _el ).text(),
                key : _el.getAttribute( "data-key" ),
                isDefault : ( _el.getAttribute( "data-default" ) !== null )
            };

            keys_$.push( vo );

            $( vo.el ).on( "click", function( e ){

                if( vo.el !== currSelection.el ){
                    setSelected( vo );
                } else {
                    ////console.log("/PageHome/ - DEFEAT");
                    // TODO close anyway?
                }
            });
        });

        numKeys = keys_$.length;

        // *** determine default value if present
        for( var i = 0; i < numKeys; i ++ ){

            var v = keys_$[ i ];

            if( v.isDefault ){
                setSelected( keys_$[ v.index ] );
                hasDefault = true;
                break;
            }
        }

        // *** if no default found select first item
        if( !hasDefault ){
            setSelected( keys_$[ 0 ] );
        }
    }

    // *** update label, update list, call outer hook method
    function setSelected( _vo ){

        //console.log("/PageHome/ -setSelected ", _vo );

        labelSpanEl.html( _vo.label );
        currSelection = _vo;

        isOpen = false;
        openList();

        for( var i = 0; i < numKeys; i ++ ){
            var v = keys_$[ i ];
            v.el.removeClass( "is-selected" );
        }

        _vo.el.addClass( "is-selected" );

        if( isFirstRun ){
            isFirstRun = false;
            return
        }

        onLocaleChanged( _vo.key );
    }

    function reset(){
        //console.log("/PageHome/ -reset ");
        isOpen = false;
        openList();
    }

    return {
        reset : reset
    }

}());