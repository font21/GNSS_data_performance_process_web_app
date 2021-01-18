// Message if JavaScript is connected and running
    console.log('JavaScript connected.');

// The Document Ready Event
$(document).ready(function(){

	// Message if jQuery is connected and running
		console.log('jQuery connected.');

	// RADIO BUTTONs
	// to select static (single file upload) or Dynamic (multiple file upload).
		$('input[type="radio"]').click(function(){
			var inputValue = $(this).attr("value");
			var targetBox = $("." + inputValue);
			$(".box").not(targetBox).hide();
			$(targetBox).show();
		});

	// Static browse, upload single file, and process.
		const myStaticForm = document.getElementById("myStaticForm");
		const staticFile = document.getElementById("staticFile");

		myStaticForm.addEventListener("submit", e => {
			e.preventDefault();

			const endpoint = "upload.php";
			const formData = new FormData();

			console.log(staticFile.files);

			formData.append("staticFile", staticFile.files[0]);

		});

	// Dynamic browse, upload multiple files, and process.


});














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