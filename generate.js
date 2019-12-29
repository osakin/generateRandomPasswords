
String.prototype.shuffle = function () {
    var a = this.split(""),
        n = a.length;

    for(var i = n - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var tmp = a[i];
        a[i] = a[j];
        a[j] = tmp;
    }
    return a.join("");
}

String.prototype.takeRandomChar = function() {
  return this[Math.floor(Math.random() * this.length)]
}

// ランダムな文字列を生成する
// generate(文字数, 小文字ありか？, 大文字ありか？, 数値ありか？, 記号ありか？)
// 例: generate(12, true, true, true, true)
function generate(length, useLower, useUpper, useNumber, useSymbol) {
  var lower = "abcdefghijklmnopqrstuvwxyz";
  var upper  = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  var number = "0123456789";
  var symbol = "_+-=.,!@#$%^&*()[]{}|;:'<>?/";
  // symbol が出すぎないようにほかを水増しする
  lower = lower.repeat(5);
  upper = upper.repeat(5);
  number = number.repeat(6);

  var src = 
    + (useLower ? lower : "")
    + (useUpper ? upper : "") 
    + (useNumber ? number : "") 
    + (useSymbol ? symbol : "");
  // 全部falseは許容しない
  if(src.length == 0) { return ""; }

  var res = ""; 
  if(useLower) res += lower.takeRandomChar();
  if(useUpper) res += upper.takeRandomChar();
  if(useNumber) res += number.takeRandomChar();
  if(useSymbol) res += symbol.takeRandomChar();

  while(res.length < length) { 
    res += src.takeRandomChar();
  }
  return res.shuffle();
  
}

const lengths = [8, 12, 15, 20, 32, 64, 128];

// generate(length, useLower, useUpper, useNumber, useSymbol)
const generators = [
	// 半角英数記号
	function(length){ return generate(length, true, true, true, true) },
	// 半角英数
	function(length){ return generate(length, true, true, true, false) },
	// 数だけ
	function(length){ return generate(length, false, false, true, false) }
];

function regenerate() {
	var customLengthInput = document.querySelector('#customLen');
	var customLength = (customLengthInput && customLengthInput.value - 0 > 0) ? customLengthInput.value - 0 : 0;
	for(var x = 0; x < generators.length; x++){
		var value = customLength > 0 ? generators[x](customLength): "";
		var dom = document.querySelector('#custom_' + x);
		if(!dom) { continue; }
		dom.value = value;
	}
	for(var y = 0; y < lengths.length; y++){
		var length = lengths[y];
		for(var x = 0; x < generators.length; x++){
			var dom = document.querySelector('#input_' + y + '_'  + x);
			if(!dom) { continue; }
			dom.value = generators[x](length);
		}
	}
}

function layoutTableCells(defaultCustomLength) {
	document.write('<table class="table table-bordered"><tr>\n');
        document.write('<td>#</td> <td>半角英数記号</td> <td>半角英数</td> <td>数字</td>\n');
        document.write('</tr>\n');
	document.write("<tr>");
	document.write("<td><input maxlength='3' id='customLen' class='select-on-click' value='"+defaultCustomLength+"' onkeyup='regenerate()'>文字</td>\n");
	for(var x = 0; x < generators.length; x++){
		document.write("<td>");
		document.write('<input type="text" id="custom_' + x + '" class="copy-on-click" value="" readonly>');
		document.write("</td>\n");
	}
	document.write("</tr>\n");

	for(var y = 0; y < lengths.length; y++){

		var length = lengths[y];
		document.write("<td>"+length+"文字</td>\n");
		for(var x = 0; x < generators.length; x++){
			document.write("<td>");
			document.write('<input type="text" class="copy-on-click" id="input_' + y + '_'  + x + '" readonly>');
			document.write("</td>\n");
		}
		document.write("</tr>\n");
	}
	document.write('</table>\n');
	
	// タップ時に自動選択＆コピー
	$(document).on("click", "input.select-on-click", function(e){
		e.target.select();
	});
	$(document).on("click", "input.copy-on-click", function(e){
		e.target.select();
		document.execCommand("copy"); e.preventDefault();
        	$('#snackbar').show();
        	setTimeout(function(){ $('#snackbar').fadeOut(500); },1000);
	});

	document.write("<div class='col text-center snackbar-container'><div id='snackbar' class='alert alert-success' style='display:none;' role='alert'>クリップボードにコピーしました</div></div>");

	regenerate();
}

