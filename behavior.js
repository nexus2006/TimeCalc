var entries = [];
var list_display = null;
var time_remain_goal = 0;
var total = 0;

function addDuration() {
    var input = document.getElementById("input_text").value;
	if (isValid(input)) {
		var input_val = timeTextToMins(input);
		entries.push(input_val);
	    updateTotalDisplay();
		updateRemainDisplay();
    	var new_node = document.createElement("P");
	    new_node.appendChild(document.createTextNode(formatTime(input_val)));
    	list_display.appendChild(new_node);
	} else {
	    document.getElementById("help_text").style.display="block";
	}
	input_text.value = "";
	input_text.focus();
}

function popDuration() {
    entries.pop();
	updateTotalDisplay();
	updateRemainDisplay();
	list_display.removeChild(list_display.lastChild);
}

function isValid(input) {
	/* validates input is made up of int:int
	loop allows for 1 or 2 length inputs (inputs without a :)
	*/
    var input_array = input.split(":");
	for (word_index in input_array) {
		if (isNaN(input_array[word_index])) {
			return false;
		}
	}
	return true;
}

function updateTotalDisplay() {
    /*TODO refactor to update total not recalc*/
    total = 0;
    for (var i = 0; i<entries.length; i++) {
	    total = total + entries[i];
	}
    document.getElementById("total_time_value").innerHTML = formatTime(total);
}

function updateRemainDisplay() {
    if (time_remain_goal === 0) {
	   return;
	}
    var remain_mins = time_remain_goal - total;
	document.getElementById("time_remain_value").innerHTML = formatTime(remain_mins);
}

function setTimeRemain() {
    time_remain_goal = timeTextToMins(document.getElementById("time_remain_input").value);
	updateRemainDisplay();
}

function clearTimeRemain() {
    time_remain_goal = 0;
	document.getElementById("time_remain_input").value = "";
	document.getElementById("time_remain_value").innerHTML = "----";
}

function timeTextToMins(input) {
    /*takes string in format "(-)hh:mm" and converts to minutes integer.
	"2:30" evaluates to 150;
	"2:" evaluates to 120;
	":30" evaluates to 30;
	"-1:10" evaluates to -70
	"-:20" evaluates to -20
	"5" evaluates to 5
	*/
	
	if (!isValid(input)) {
	    return;
	}
	
	var input_array = input.split(":");
	if (input_array.length === 1) {
		//in this case, only minutes were input
		return Number(input);
	}
	var hh = Number(input_array[0]*60);
	var mm = Number(input_array[1]);
	if (input_array[0][0] === "-") {
		mm = mm * -1;
	}
	return hh + mm;
}

function formatTime(num_minutes_raw) {
    /*Takes integer and outputs string in format (-)hh:mm
	0 evaluates to "0:00";
	70 evaluates to "1:10";
	20 evaluates to "0:20";
	-70 evaluates to "-1:10";
	-20 evaluates to "-0:20";
	*/
	
    var sign = "";
	if (num_minutes_raw < 0) {
	    sign = "-";
	}
	var num_minutes = Math.abs(num_minutes_raw);
    var hh = Math.floor(num_minutes/60);
	var mm = num_minutes%60;
	if (mm<10) {
	    mm = "0" + mm;
	}
    return sign + hh + ":" + mm;
}

function keyHandler(key_event) {
	if (key_event.key === "Enter") {
		if (key_event.target === "input_text") {
			addDuration();
		}
		if (key_event.target === "time_remain_input") {
			setTimeRemain();
		}
	}
}

window.onload = function() {
    list_display = document.getElementById("duration_list");
    updateTotalDisplay();
	document.getElementById("add_button").addEventListener("click", addDuration);
	document.getElementById("pop_button").addEventListener("click", popDuration);
	document.getElementById("time_remain_set").addEventListener("click", setTimeRemain);
	document.getElementById("time_remain_clear").addEventListener("click", clearTimeRemain);
	document.getElementById("input_text").addEventListener("keydown", keyHandler);
	document.getElementById("time_remain_input").addEventListener("keydown", keyHandler);
}