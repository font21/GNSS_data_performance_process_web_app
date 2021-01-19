// Message if JavaScript is connected and running
console.log('JavaScript connected.');

// Page load timers : set
const startTime = performance.now();


// The Document Ready Event
	$(document).ready(function(){

	// Message if jQuery is connected and running
		console.log('jQuery connected.');

	/* ======================================
		RADIO BUTTONs
	=======================================*/
	// to select static (single file upload) or Dynamic (multiple file upload).
		$('input[type="radio"]').click(function(){
			var inputValue = $(this).attr("value");
			var targetBox = $("." + inputValue);
			$(".box").not(targetBox).hide();
			$(targetBox).show();
		});

/* Show More Buttons
	https://www.youtube.com/watch?v=RVA4HoEE_q8&ab_channel=TheNetNinja
*/
	var dynamicContentText = document.getElementById("dynamicContentText");
	var dynamicShowMoreButton = document.getElementById("dynamicShowMoreButton");

	dynamicShowMoreButton.onclick = function(){
		if(dynamicContentText.className == "open"){
			// shrink the box
			dynamicContentText.className = "";
			dynamicShowMoreButton.innerHTML = "Show More";
		} else {
			// expand the box
			dynamicContentText.className = "open";
			dynamicShowMoreButton.innerHTML = "Show Less";
		}
	};





	/* ======================================
		Static
		Static browse, upload single file, and process.
	 ===================================== */

		const myStaticForm = document.getElementById("myStaticForm");
		const staticFile = document.getElementById("staticFile");

		myStaticForm.addEventListener("submit", e => {
			// Prevent page reload
				e.preventDefault();

			// const endpoint = "upload.php";
				const formData = new FormData();
				console.log(staticFile.files);
				formData.append("staticFile", staticFile.files[0]);	

		});
	});

/* -- Split-by-line code breaks DIVs displayed by radio button selector:

	// File Reader and split by line
	const reader = new.FileReader();
	const lines = reader.result.split("\n");
	console.log(lines[0])
	console.log(lines[1])
	console.log(lines[2])
*/

	/* ======================================
		Dynamic
	====================================== */
	// Dynamic browse, upload multiple files, and process.

















/* =============================
File upload code that did not work.
 ============================== */


/*
const staticUploadForm = document.getElementById("staticUploadForm");
const input = document.querySelector('input[type="file"]')

			staticForm.addEventListener("staticSubmit", e => {
				e.preventDefault();
				console.log(input.staticFile)

				formData.append("staticFile", staticFile.files[0]);

				const reader = new FileReader()
				reader.onload = function () {
					console.log(reader.result)
				}
				reader.readAsText(input.files[0])
				document.getElementById("fileDisplayer").innerHTML = reader.result;
				document.getElementById("fileDisplayer").display = block;
			}, false)
	


	const input = document.querySelector('input[type="file"]')

	input.addEventListener('submit', function (e) {
		console.log(input.files)
		const reader = new FileReader()
		reader.onload = function () {
			console.log(reader.result)
		}
		reader.readAsText(input.files[0])
		document.getElementById("fileDisplayer").innerHTML = reader.result;
		document.getElementById("fileDisplayer").display = block;
	}, false)
*/



/*
function previewFile() {
	const preview = document.querySelector('img');
	const file = document.querySelector('input[type=file]').files[0];
	const reader = new FileReader();
  
	reader.addEventListener("load", function () {
	  // convert image file to base64 string
	  preview.src = reader.result;
	}, false);
  
	if (file) {
	  reader.readAsDataURL(file);
	}
  }

function updateSize() {
    let nBytes = 0,
        oFiles = this.files,
        nFiles = oFiles.length;
    for (let nFileId = 0; nFileId < nFiles; nFileId++) {
      nBytes += oFiles[nFileId].size;
    }
    let sOutput = nBytes + " bytes";
    // optional code for multiples approximation
    const aMultiples = ["KiB", "MiB", "GiB", "TiB", "PiB", "EiB", "ZiB", "YiB"];
    for (nMultiple = 0, nApprox = nBytes / 1024; nApprox > 1; nApprox /= 1024, nMultiple++) {
      sOutput = nApprox.toFixed(3) + " " + aMultiples[nMultiple] + " (" + nBytes + " bytes)";
    }
    // end of optional code
    document.getElementById("fileNum").innerHTML = nFiles;
    document.getElementById("fileSize").innerHTML = sOutput;
  }

  document.getElementById("uploadInput").addEventListener("change", updateSize, false);
*/






/* Page load timers : print times
https://gist.github.com/prof3ssorSt3v3/5f976023977a299d80a03367f2352ef2
load VS DOMContentLoaded Event
https://www.youtube.com/watch?v=8rc0zaTn2ew&ab_channel=SteveGriffith
*/
	window.addEventListener('load', (ev)=>{
		console.log(ev.type);
		let endTime = performance.now();
		let diff = endTime - startTime;
		console.log(ev.type + " is " + diff + " milliseconds");
	});

	document.addEventListener('DOMContentLoaded', (ev)=>{
		console.log(ev.type);
		let endTime = performance.now();
		let diff = endTime - startTime;
		console.log(ev.type + " is " + diff + " milliseconds");
	});