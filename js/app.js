// Message if JavaScript is connected and running
    console.log('JavaScript connected.');

// The Document Ready Event
$(document).ready(function(){

	// Message if jQuery is connected and running
	console.log('jQuery connected.');
});

$(document).ready(function(){
    $('input[type="radio"]').click(function(){
        var inputValue = $(this).attr("value");
        var targetBox = $("." + inputValue);
        $(".box").not(targetBox).hide();
        $(targetBox).show();
    });
});


const myForm = document.getElementById("staticUploadForm");
const input = document.querySelector('input[type="file"]')

			myForm.addEventListener("submit", e => {
				e.preventDefault();
				console.log(input.files)

				formData.append("inpFile", inpFile.files[0]);

				const reader = new FileReader()
				reader.onload = function () {
					console.log(reader.result)
				}
				reader.readAsText(input.files[0])
				document.getElementById("fileDisplayer").innerHTML = reader.result;
				document.getElementById("fileDisplayer").display = block;
			}, false)
	

/*
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