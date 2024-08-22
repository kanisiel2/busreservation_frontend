$(document).on("pagecreate", "#mainpage", function() {    
    $(document).on("swipeleft", "#mainpage", function(e) {         // We check if there is no open panel on the page because otherwise
                 // a swipe to close the left panel would also open the right panel (and v.v.).
                 // We do this by checking the data that the framework stores on the page element (panel: open).
                
        if ($(".ui-page-active").jqmData("panel") !== "open") {            
            if (e.type === "swipeleft") {                
                $("#right-panel").panel("open");            
            }        
        }    
    });
});


function sourceChange() {

    var obj = jQuery.parseJSON(`[

				{
						"label": "강원",
						"options": [
								{
										"value": "200",
										"text": "강릉"
								}, {
										"value": "210",
										"text": "동해"
								}, {
										"value": "220",
										"text": "삼척"
								}, {
										"value": "230",
										"text": "속초"
								}, {
										"value": "270",
										"text": "양양"
								}, {
										"value": "239",
										"text": "횡성(휴)"
								}
						]
				}, {
						"label": "충청",
						"options": [
								{
										"value": "300",
										"text": "대전"
								}, {
										"value": "324",
										"text": "인삼랜드(휴)하행"
								}, {
										"value": "456",
										"text": "정안(휴)"
								}, {
										"value": "630",
										"text": "정읍"
								}, {
										"value": "400",
										"text": "청주"
								}
						]
				}, {
						"label": "전라",
						"options": [
								{
										"value": "520",
										"text": "광양"
								}, {
										"value": "500",
										"text": "광주"
								}, {
										"value": "525",
										"text": "동광양"
								}, {
										"value": "600",
										"text": "전주"
								}
						]
				}, {
						"label": "경상",
						"options": [
								{
										"value": "706",
										"text": "내서"
								}, {
										"value": "801",
										"text": "대구한진"
								}, {
										"value": "705",
										"text": "마산"
								}, {
										"value": "700",
										"text": "부산"
								}, {
										"value": "805",
										"text": "서대구"
								}, {
										"value": "703",
										"text": "서부산(사상)"
								}, {
										"value": "812",
										"text": "선산(휴)하행"
								}, {
										"value": "722",
										"text": "진주"
								}, {
										"value": "723",
										"text": "진주개양"
								}, {
										"value": "710",
										"text": "창원"
								}, {
										"value": "711",
										"text": "창원역"
								}
						]
				}
		]`);

    $("#destination").empty();
    var opt = $("<option></option>");
    opt.val("");
    opt.text("선  택");
    $("#destination").append(opt);
    $.each(obj, function(key, values) {

        var optgroup = $('<optgroup>');
        optgroup.attr('label', values.label);

        $.each(values.options, function(key2, value2) {
            var option = $("<option></option>");
            option.val(value2.value);
            option.text(value2.text);

            optgroup.append(option);
        });
        $("#destination").append(optgroup);
    });
    checkData();
}

function selectchange() {
    $("#seatsview").val($("#seats").val());

    for (var i = 1; i < 46; i++) {
        $("#seat" + i).css("background", "#FFFFFF");
    }
    if (jQuery.isEmptyObject($("#seats").val())) {
        $("#doPurchase").removeAttr("style");
    } else {

        $("#purchaseDetail, #reservationDetail").empty();
        var source = "#source option[value='" + $("#source").val() + "']";
        var destination = "#destination option[value='" + $("#destination").val() + "']";
        // alert();
        var seats = [];
        $("#purchaseDetail").append("<p align='center'>출발지 : " + $(source).prop("text") + "</p>");
        $("#purchaseDetail").append("<p align='center'>도착지 : " + $(destination).prop("text") + "</p>");
        var dates = $("#date").val().split("-");
        $("#purchaseDetail").append("<p align='center'>날짜 : " + dates[0] + "년 " + dates[1] + "월 " + dates[2] + "일 " + table[$("#selectedBus").val()].time + "</p>");
        $("#purchaseDetail").append("<p align='center'>운수회사 : " + table[$("#selectedBus").val()].company + "</p>");
        $("#purchaseDetail").append("<p align='center'>버스종류 : " + table[$("#selectedBus").val()].grade + "</p>");
        $("#purchaseDetail").append("<p align='center'>좌석수 : " + $("#seats").val().length + "석</p>");
        $.each($("#seats").val(), function(key, value) {
            $("#" + value).css("background", "#90EE90");
            var str = value;
            var res = str.replace("seat", "");
            seats[key] = res;
        });
        $("#toPurchase").attr("style", "background-color:#90EE90; color:#444444;");
        $("#toPurchase").attr("href", "#purchase");
        table[$("#selectedBus").val()].seats = seats;
        $("#purchaseDetail").append("<p align='center'>좌석 : " + table[$("#selectedBus").val()].seats + "</p>");
        $("#purchaseDetail").append("<p align='center'>결제금액 : " + numberWithCommas($("#seats").val().length * 18100) + "원</p>");
        $("#purchaseButtonDiv").attr("style", "");
        $("#doPurchase").attr("style", "background-color:#90EE90; color:#444444;");


    }
}

function injectReserveData(pk) {
    var index = findByBcode(pk);
    var rv = reservations[index];
    $("#reservationDetail").empty();
    $("#reservationDetail").append("<p align='center'>출발지 : " + rv.from + "</p>");
    $("#reservationDetail").append("<p align='center'>도착지 : " + rv.downfor + "</p>");
    var dates = rv.date.split("-");
    $("#reservationDetail").append("<p align='center'>날짜 : " + dates[0] + "년 " + dates[1] + "월 " + dates[2] + "일 " + rv.time + "</p>");
    $("#reservationDetail").append("<p align='center'>운수회사 : " + rv.company + "</p>");
    $("#reservationDetail").append("<p align='center'>버스종류 : " + rv.grade + "</p>");
    $("#reservationDetail").append("<p align='center'>좌석수 : " + rv.seats.length + "석</p>");
    $("#reservationDetail").append("<p align='center'>좌석 : " + rv.seats.join(", ") + "</p>");
    $("#reservationDetail").append("<p align='center'>결제금액 : " + rv.cost + "원</p>");


    $("#reservationDetail").append("<p align='center'><svg id='barcode" + pk + "'></svg></p>");

    JsBarcode("#barcode" + pk, pk, {
        background: "transparent"
    });

    $("#purchase #doPurchase").attr("href", "#checkReservation");
}

function setReservationData() {

    var source = "#source option[value='" + $("#source").val() + "']";
    var destination = "#destination option[value='" + $("#destination").val() + "']";
    var bcode = $("#date").val().split("-").join("") + getRandomNumberForPrimaryKey(8);


    var reservation = new Reservation(bcode, $(source).prop("text"), $(destination).prop("text"), $("#date").val(), table[$("#selectedBus").val()].time, table[$("#selectedBus").val()].grade, table[$("#selectedBus").val()].company, table[$("#selectedBus").val()].seats, numberWithCommas($("#seats").val().length * 18100));
    reservations.push(reservation);


    $("#reservelist").empty();

    $.each(reservations, function(key, value) {
        var dates = value.date.split("-");
        $("#reservelist").prepend("<li><div id=b" + value.pk + " align='center'>" + value.from + "->" + value.downfor + "<br>" + dates[0] + "년 " + dates[1] + "월 " + dates[2] + "일 " + value.time + "<br><p align='center'><svg id='barcode" + value.pk + "'></svg></p></div></li>")
            // JsBarcode("#barcode"+value.pk, value.pk, {background: "transparent"});
    });
    injectReserveData(bcode);

}

function findByBcode(bcode) {
    var result = -1;
    $.each(reservations, function(key, value) {
        if (value.pk == bcode) {
            result = key;
        }
    });
    return result;
}

function getRandomNumberForPrimaryKey(length) {
    var result = "";
    if (isNaN(length) || length < 1) {
        return "000000";
    } else {
        for (var i = 0; i < length; i++) {
            result += Math.floor(Math.random() * 10).toString();
        }
        return result;
    }
}

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function multiSelect(trigger) {
    var target = "select option[value='" + trigger.id + "']";
    // alert(target);
    var amount = 0;
    if ($(target).prop("selected")) {
        $(target).prop("selected", false);
        if (jQuery.isEmptyObject($("#seats").val())) {
            amount = 0;
        } else {
            amount = $("#seats").val().length;
        }
    } else {
        $(target).prop("selected", true);
        if ($("#seats").val()) {
            amount = $("#seats").val().length;
        }
    }
    $("#seatstatus").html("현재 선택 좌석 수 : " + amount);

    selectchange();
}

function checkData() {


    if (
        jQuery.isEmptyObject($("#source").val()) == false &&
        jQuery.isEmptyObject($("#destination").val()) == false &&
        jQuery.isEmptyObject($("#date").val()) == false) {
        $("#firstSubmit").attr("style", "background-color:#90EE90; color:#444444;");
        $("#firstSubmit").attr("href", "#buslist");
    } else {
        $("#firstSubmit").removeAttr("style");
        $("#firstSubmit").attr("href", "");
    }

}

function injectList() {
    $.each(table, function(key, value) {
        $("#buslists tbody").append("<tr><td id='time" + key + "' style='text-align:center;vertical-align:middle;'>" + value.time + "</td><td id='grade" + key + "' style='text-align:center;vertical-align:middle;'>" + value.grade + "</td><td id='company" + key + "' style='text-align:center;vertical-align:middle;'>" + value.company + "</td><td id='remain" + key + "' style='text-align:center;vertical-align:middle;'>" + value.remain + "</td><td style='text-align:center;vertical-align:middle;'><a id='sbutton" + key + "' href='' class='ui-btn ui-shadow ui-corner-all ui-icon-check ui-btn-icon-notext' onclick='selectBus(" + key + ")'>선택</a></td></tr>");
    });
}

function selectBus(key) {
    $("#selectedBus").val(key);
    $("#sbutton" + key).attr("href", "#buspage");
}

function onSubmit() {
    if (jQuery.isEmptyObject($("#seats").val())) {
        return false;
    } else {
        return true;
    }
}

function renewal() {
    // $("#source option").each(function(){
    // 	this.selected = false;
    // 	if(this.value==""){
    // 		this.selected = true;
    // 	}
    // });//reset();
    // // $("#source").val("");
    $("#destination optgroup").each(function() {
        this.remove();
    });

    $("form").each(function() {
        if (this.id == "firstForm" || this.id == "secondForm" || this.id == "thirdForm") {
            this.reset();
        }
    });
    // $("#date").reset();
    initGlobal();
    // $("#selectedBus").reset();
    // $("#seats").reset();
    $("#doPurchase").attr("style", "");
    $("#doPurchase").attr("href", "");
    $("#buslists tbody").empty();
    $("#firstSubmit").removeAttr("style");
    $("#firstSubmit").attr("href", "");
    for (var i = 1; i < 46; i++) {
        $("#seat" + i).css("background", "#FFFFFF");
    }
}



var randomAmount = 4;
var companies = ["금호 고속", "동부 고속", "중앙 고속", "천일 고속", "한일 고속", "고려 고속", "천여 고속"];
var times = [];
var company = [];
var table = [];
var reservations = [];

function Reservation(pk, from, downfor, date, time, grade, company, seats, cost) {
    this.pk = pk;
    this.from = from;
    this.downfor = downfor;
    this.date = date;
    this.time = time;
    this.grade = grade;
    this.company = company;
    this.seats = seats;
    this.cost = cost;
}

function initGlobal() {
    randomAmount = 4 + Math.floor(Math.random() * 7);
    for (var i = 0; i < randomAmount; i++) {
        var cmp = Math.floor(Math.random() * companies.length);
        var hour = Math.floor(Math.random() * 24);
        var mh = Math.floor(Math.random() * 60);
        var minuteHead = Math.floor(mh / 10);
        var timestring = hour.toString() + minuteHead.toString() + "0";
        if (timestring.length < 4) {
            timestring = "0" + timestring;
        }
        times[i] = Math.abs(timestring) + 1000;
        company[i] = companies[cmp];
        table[i] = {
            "time": times[i],
            "grade": "일반고속",
            "company": company[i],
            "remain": 45
        };
    }
    times.sort();
    $.each(times, function(key, value) {
        var time = value - 1000;
        var hour = Math.floor(time / 100, 1);
        var minute = time % 100;
        var timestring = "";
        if (hour.toString().length < 2) {
            timestring = "0" + hour.toString();
        } else {
            timestring = hour.toString();
        }
        timestring += ":";
        if (minute.toString().length < 2) {
            timestring += "0" + minute.toString();
        } else {
            timestring += minute.toString();
        }
        times[key] = timestring;
        table[key].time = timestring;
    });

}
initGlobal();

if (
    (
        jQuery.isEmptyObject($("#source").val()) ||
        jQuery.isEmptyObject($("#destination").val()) ||
        jQuery.isEmptyObject($("#date").val())
    ) &&
    document.location.href.search("#") > 0
) {
    document.location.href = "index.html";
}

$(".ui-table-columntoggle-btn").attr("display", "none");
