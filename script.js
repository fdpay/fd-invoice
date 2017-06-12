/// <reference path="jspdf.debug.js" />

(function (document) {
    var
	head = document.head = document.getElementsByTagName('head')[0] || document.documentElement,
	elements = 'article aside audio bdi canvas data datalist details figcaption figure footer header hgroup mark meter nav output picture progress section summary time video x'.split(' '),
	elementsLength = elements.length,
	elementsIndex = 0,
	element;

    while (elementsIndex < elementsLength) {
        element = document.createElement(elements[++elementsIndex]);
    }

    element.innerHTML = 'x<style>' +
		'article,aside,details,figcaption,figure,footer,header,hgroup,nav,section{display:block}' +
		'audio[controls],canvas,video{display:inline-block}' +
		'[hidden],audio{display:none}' +
		'mark{background:#FF0;color:#000}' +
	'</style>';

    return head.insertBefore(element.lastChild, head.firstChild);
})(document);

/* Prototyping
/* ========================================================================== */

(function (window, ElementPrototype, ArrayPrototype, polyfill) {
    function NodeList() { [polyfill] }
    NodeList.prototype.length = ArrayPrototype.length;

    ElementPrototype.matchesSelector = ElementPrototype.matchesSelector ||
	ElementPrototype.mozMatchesSelector ||
	ElementPrototype.msMatchesSelector ||
	ElementPrototype.oMatchesSelector ||
	ElementPrototype.webkitMatchesSelector ||
	function matchesSelector(selector) {
	    return ArrayPrototype.indexOf.call(this.parentNode.querySelectorAll(selector), this) > -1;
	};

    ElementPrototype.ancestorQuerySelectorAll = ElementPrototype.ancestorQuerySelectorAll ||
	ElementPrototype.mozAncestorQuerySelectorAll ||
	ElementPrototype.msAncestorQuerySelectorAll ||
	ElementPrototype.oAncestorQuerySelectorAll ||
	ElementPrototype.webkitAncestorQuerySelectorAll ||
	function ancestorQuerySelectorAll(selector) {
	    for (var cite = this, newNodeList = new NodeList; cite = cite.parentElement;) {
	        if (cite.matchesSelector(selector)) ArrayPrototype.push.call(newNodeList, cite);
	    }

	    return newNodeList;
	};

    ElementPrototype.ancestorQuerySelector = ElementPrototype.ancestorQuerySelector ||
	ElementPrototype.mozAncestorQuerySelector ||
	ElementPrototype.msAncestorQuerySelector ||
	ElementPrototype.oAncestorQuerySelector ||
	ElementPrototype.webkitAncestorQuerySelector ||
	function ancestorQuerySelector(selector) {
	    return this.ancestorQuerySelectorAll(selector)[0] || null;
	};
})(this, Element.prototype, Array.prototype);

/* Helper Functions
/* ========================================================================== */
function initInvoice(d)
{
    $("#invoice").html(d.id);
    $("#dt").html(d.dt);
    $(".ttlamt").html(d.symbol + " " + d.ttlAmt);
    $(".subttl").html(d.symbol + " " + d.subTtl);
    $(".shippingAmt").html(d.symbol + " " + d.shippingAmt);
    $(".discountAmt").html(d.symbol + " " + d.discountAmt);
    $(".disCode").html("(" + d.disCode + ")");
    $(".taxAmt").html(d.symbol + " " + d.taxAmt);
    $(".taxPer").html(d.taxPer);
    $(".serviceCharge").html(d.symbol + " " + d.serviceCharge);
    $(".servicePer").html(d.servicePer);
    $(".taxAmt").html(d.symbol + " " + d.taxAmt);
    $(".amtDue").html(d.symbol + " " + d.amtDue);
    $(".amtPaid").html(d.symbol + " " + d.amtPaid);
    $("#clogo").attr("src", d.logoUrl);
    $(".seller").html("<p>" + d.seller.name + "</p>")
        .append("<p>" + d.seller.add1 + "<p>")
        .append("<p>" + d.seller.add2 + "<p>")
        .append("<p>" + d.seller.email + "<p>")
        .append("<p>" + d.seller.phone + "<p>");
    $(".buyer").html("<span>" + d.buyer.name + "</span>")
        .append("<p>" + d.buyer.add1 + "<p>")
        .append("<p>" + d.buyer.add2 + "<p>")
        .append("<p>" + d.buyer.email + "<p>")
        .append("<p>" + d.buyer.phone + "<p>");
    $("header h1").html(d.header);
    $(".inventory tbody").html("");
    for (i = 0; i < d.items.length; i++) {
        console.log(d.items[i]);
        $(".inventory tbody").append(rowTemplate(d.items[i], d.symbol));
    }
    $("aside div").html("");
    for (i = 0; i < d.footer.length; i++) {
        console.log(d.footer[i]);
        $("aside div").append("<p>"+d.footer[i].txt+"</p>");
    }
    window.print();
    //setTimeout(function () {
    //    demoFromHTML();
    //    //var doc = new jsPDF();
    //    //doc.fromHTML($('body').get(0), 0, 0);
    //    //doc.autoPrint();
    //    //doc.save(d.id + '.pdf')
    //},1000);
}

function rowTemplate(i,s) {
    var rowColumn = document.createElement('tr');
    rowColumn.innerHTML = '<td><a class="cut">-</a><span contenteditable>' + i.code + '</span></td>' +
		'<td><span contenteditable>' + i.name + '</span></td>' +
		'<td><span data-prefix>' + s + '</span> <span contenteditable>' + i.rate + '</span></td>' +
		'<td><span contenteditable>' + i.qty + '</span></td>' +
		'<td><span data-prefix>' + s + '</span> <span>' + i.price + '</span></td>';
    return rowColumn;
}

function demoFromHTML() {
    var pdf = new jsPDF('p', 'pt', 'letter');
    // source can be HTML-formatted string, or a reference
    // to an actual DOM element from which the text will be scraped.
    source = $('body')[0];

    // we support special element handlers. Register them with jQuery-style 
    // ID selector for either ID or node name. ("#iAmID", "div", "span" etc.)
    // There is no support for any other type of selectors 
    // (class, of compound) at this time.
    specialElementHandlers = {
        // element with id of "bypass" - jQuery style selector
        //'#bypassme': function (element, renderer) {
        //    // true = "handled elsewhere, bypass text extraction"
        //    return true
        //}
    };
    margins = {
        top: 80,
        bottom: 60,
        left: 40,
        width: 900
    };
    // all coords and widths are in jsPDF instance's declared units
    // 'inches' in this case
    pdf.fromHTML(
    source, // HTML string or DOM elem ref.
    margins.left, // x coord
    margins.top, { // y coord
        'width': margins.width, // max width of content on PDF
        'elementHandlers': specialElementHandlers
    },

    function (dispose) {
        // dispose: object with X, Y of the last line add to the PDF 
        //          this allow the insertion of new lines after html
        pdf.save('Test.pdf');
    }, margins);
}

$(document).ready(function () {

    //var mydata = {
    //    id: "INV00001",
    //    dt: "01/02/2017",
    //    symbol: "Rs",
    //    ttlAmt: "1410",
    //    subTtl : "1500",
    //    shippingAmt: "50",
    //    discountAmt: "200",
    //    disCode: "NV200",
    //    taxAmt: "50",
    //    taxPer : "2%",
    //    serviceCharge: "10",
    //    servicePer : "1%",
    //    extra: "0",
    //    extra: "0",
    //    amtDue: "1000",
    //    amtPaid: "410",
    //    items: [
    //        { code: "SKU98732", name: "Sample Testing 01", rate: "100" , qty : "1",price : "100" },
    //        { code: "SKU45732", name: "Sample Testing 02", rate: "200", qty: "2", price: "400" },
    //        { code: "SKU98782", name: "Sample Testing 03", rate: "300", qty: "2", price: "600" },
    //        { code: "SKU98452", name: "Sample Testing 04", rate: "400", qty: "1", price: "400" },
    //    ],
    //    header : "PREPAID INVOICE",
    //    logoUrl: "http://namkeenvilla.com/img/logo.png",
    //    seller: { name :"Namkeenvilla", add1: "451 New Ext.", add2: "Bhopal M.P", email: "namkeenvilla@gmail.com", phone : "+91-9407393303"},
    //    buyer: { name: "JB Group", add1: "451 Usha nagar ext", add2: "Indore M.P 452009", email: "jbgroup01@gmail.com", phone: "+91-9039293303" },
    //    footer: [
    //        { "txt": "A finance charge of 1.5% will be made on unpaid balances after 30 days." },
    //        { "txt": "A finance charge of 1.5% will be made on unpaid balances after 30 days." },
    //        { "txt": "A finance charge of 1.5% will be made on unpaid balances after 30 days." },
    //        { "txt": "A finance charge of 1.5% will be made on unpaid balances after 30 days." },
    //        { "txt": "A finance charge of 1.5% will be made on unpaid balances after 30 days." }
    //    ]
    //}

    if (typeof (mydata) == "undefined")
    { }
    else {
        initInvoice(mydata);
        
    }
});


function generateTableRow() {
    var emptyColumn = document.createElement('tr');

    emptyColumn.innerHTML = '<td><a class="cut">-</a><span contenteditable></span></td>' +
		'<td><span contenteditable></span></td>' +
		'<td><span data-prefix>$</span><span contenteditable>0.00</span></td>' +
		'<td><span contenteditable>0</span></td>' +
		'<td><span data-prefix>$</span><span>0.00</span></td>';

    return emptyColumn;
}

function parseFloatHTML(element) {
    return parseFloat(element.innerHTML.replace(/[^\d\.\-]+/g, '')) || 0;
}

function parsePrice(number) {
    return number.toFixed(2).replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1,');
}

/* Update Number
/* ========================================================================== */

function updateNumber(e) {
    var
	activeElement = document.activeElement,
	value = parseFloat(activeElement.innerHTML),
	wasPrice = activeElement.innerHTML == parsePrice(parseFloatHTML(activeElement));

    if (!isNaN(value) && (e.keyCode == 38 || e.keyCode == 40 || e.wheelDeltaY)) {
        e.preventDefault();

        value += e.keyCode == 38 ? 1 : e.keyCode == 40 ? -1 : Math.round(e.wheelDelta * 0.025);
        value = Math.max(value, 0);

        activeElement.innerHTML = wasPrice ? parsePrice(value) : value;
    }

    //updateInvoice();
}

/* Update Invoice
/* ========================================================================== */

function updateInvoice() {
    var total = 0;
    var cells, price, total, a, i;

    // update inventory cells
    // ======================

    for (var a = document.querySelectorAll('table.inventory tbody tr'), i = 0; a[i]; ++i) {
        // get inventory row cells
        cells = a[i].querySelectorAll('span:last-child');

        // set price as cell[2] * cell[3]
        price = parseFloatHTML(cells[2]) * parseFloatHTML(cells[3]);

        // add price to total
        total += price;

        // set row total
        cells[4].innerHTML = price;
    }

    // update balance cells
    // ====================

    // get balance cells
    cells = document.querySelectorAll('table.balance td:last-child span:last-child');

    // set total
    cells[0].innerHTML = total;

    // set balance and meta balance
    cells[2].innerHTML = document.querySelector('table.meta tr:last-child td:last-child span:last-child').innerHTML = parsePrice(total - parseFloatHTML(cells[1]));

    // update prefix formatting
    // ========================

    var prefix = document.querySelector('#prefix').innerHTML;
    for (a = document.querySelectorAll('[data-prefix]'), i = 0; a[i]; ++i) a[i].innerHTML = prefix;

    // update price formatting
    // =======================

    for (a = document.querySelectorAll('span[data-prefix] + span'), i = 0; a[i]; ++i) if (document.activeElement != a[i]) a[i].innerHTML = parsePrice(parseFloatHTML(a[i]));
}

/* On Content Load
/* ========================================================================== */

function onContentLoad() {
   // updateInvoice();

    var
	input = document.querySelector('input'),
	image = document.querySelector('img');

    function onClick(e) {
        var element = e.target.querySelector('[contenteditable]'), row;

        element && e.target != document.documentElement && e.target != document.body && element.focus();

        if (e.target.matchesSelector('.add')) {
            document.querySelector('table.inventory tbody').appendChild(generateTableRow());
        }
        else if (e.target.className == 'cut') {
            row = e.target.ancestorQuerySelector('tr');

            row.parentNode.removeChild(row);
        }

        //updateInvoice();
    }

    function onEnterCancel(e) {
        e.preventDefault();

        image.classList.add('hover');
    }

    function onLeaveCancel(e) {
        e.preventDefault();

        image.classList.remove('hover');
    }

    function onFileInput(e) {
        image.classList.remove('hover');

        var
		reader = new FileReader(),
		files = e.dataTransfer ? e.dataTransfer.files : e.target.files,
		i = 0;

        reader.onload = onFileLoad;

        while (files[i]) reader.readAsDataURL(files[i++]);
    }

    function onFileLoad(e) {
        var data = e.target.result;

        image.src = data;
    }

    if (window.addEventListener) {
        document.addEventListener('click', onClick);

        document.addEventListener('mousewheel', updateNumber);
        document.addEventListener('keydown', updateNumber);

       // document.addEventListener('keydown', updateInvoice);
       // document.addEventListener('keyup', updateInvoice);

        input.addEventListener('focus', onEnterCancel);
        input.addEventListener('mouseover', onEnterCancel);
        input.addEventListener('dragover', onEnterCancel);
        input.addEventListener('dragenter', onEnterCancel);

        input.addEventListener('blur', onLeaveCancel);
        input.addEventListener('dragleave', onLeaveCancel);
        input.addEventListener('mouseout', onLeaveCancel);

        input.addEventListener('drop', onFileInput);
        input.addEventListener('change', onFileInput);
    }
}

window.addEventListener && document.addEventListener('DOMContentLoaded', onContentLoad);
