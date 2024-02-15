function add() {
  var formfield = document.getElementById("formfield");
  var newField = document.createElement("input");
  newField.setAttribute("type", "text");
  newField.setAttribute("name", "playerName[]");
  newField.setAttribute("class", "form-control formtext");
  formfield.appendChild(newField);
}

function remove() {
  var input_tags = formfield.getElementsByTagName("input");
  formfield.removeChild(input_tags[input_tags.length - 1]);
}

function modifyScore(index, delta) {
  var scoreSpan = document.getElementById("score" + index);
  var score = parseInt(scoreSpan.innerText) + delta;
  scoreSpan.innerText = score.toString();
}

let IMAGES = []; // Will put all images in this
const ROUNDS = 1; // Amount of rounds the carousel will shift trough
const CAROUSEL_TIME = 3; // Total time in seconds carousel will spin

// function loadImages() {
//   $("#start-button").prop("disabled", false);
//   $("#random-image-div").css("display", "none");
//   const images = $("#images");

//   for (let file of document.getElementById("imagesInput").files) {
//     let oFReader = new FileReader();
//     oFReader.readAsDataURL(file);

//     oFReader.onload = function (oFREvent) {
//       data = images.html();
//       $("#images").html(data);
//       IMAGES.push(oFREvent.target.result);
//     };
//   }

//   pa.track({ name: "Load images", value: IMAGES.length });
// }

function loadImages() {
  fetch("filenames.json")
    .then((response) => response.json()) // Parses the JSON response into a JavaScript object
    .then((filenames) => {
      console.log("loadImages called");

      $("#start-button").prop("disabled", false);
      $("#random-image-div").css("display", "none");
      const imagesContainer = $("#images");
      console.log("Containers should be prepared now");

      const imageFilenames = filenames;
      const basePath = "./img/";

      imagesContainer.html("");

      imageFilenames.forEach((filename) => {
        const imagePath = basePath + filename;
        console.log("Loading image:", imagePath);
        IMAGES.push(imagePath);
      });
    });
}

function pickRandomImage() {
  $("#reset-button").prop("disabled", false);
  $("#pick-button").prop("disabled", true);

  const deleteImage = 1;
  const directly = 0;

  if (!IMAGES.length) {
    $("#information-text").html("No images left");
    $("#random-image-div").css("display", "none");
  } else {
    const selected = Math.floor(Math.random() * IMAGES.length); // Pick random image
    if (directly) {
      setFinalImage(selected, deleteImage);
    } else {
      doCarousel(selected, deleteImage);
    }
  }
}

function doCarousel(selected, deleteImage) {
  // pa.track({ name: "Do Carousel", value: IMAGES.length });
  const totalCarousel = ROUNDS * IMAGES.length + selected; // Total images that will be shown in carousel
  const durations = computeDurations(totalCarousel); // Compute a list of durations for each image display in the carousel
  doCarouselRec(0, durations, deleteImage);
}

function doCarouselRec(index, durations, deleteImage) {
  index = index % IMAGES.length;
  const randomImage = $("#random-image");
  $("#random-image-div").css("display", "");
  if (durations.length > 0) {
    randomImage.prop("src", IMAGES[index]);
    randomImage.removeClass("random-selected");
    const duration = durations.shift();
    setTimeout(function () {
      doCarouselRec(index + 1, durations, deleteImage);
    }, duration * 1000);
  } else {
    setFinalImage(index, deleteImage);
  }
}

function computeDurations(steps) {
  const times = [];
  for (let i = steps; i > 0; i -= 1) {
    times.push(f(i, steps));
  }
  return times;
}
function f(x, steps) {
  const carousel_time = Math.min(CAROUSEL_TIME, IMAGES.length);
  sigm = 0;
  for (let i = 1; i <= steps; i += 1) {
    sigm += Math.log(i);
  }
  a = CAROUSEL_TIME / (steps * Math.log(steps) - sigm);
  c = (CAROUSEL_TIME * Math.log(steps)) / (steps * Math.log(steps) - sigm);
  return -a * Math.log(x) + c;
}

function deleteSelectedImage(index) {
  IMAGES.splice(index, 1);
}

function setFinalImage(index, deleteImage) {
  let randomImage = $("#random-image");
  $("#random-image-div").css("display", "");
  randomImage.prop("src", IMAGES[index]);
  randomImage.addClass("random-selected");
  $("#pick-button").prop("disabled", false);
  if (deleteImage) {
    deleteSelectedImage(index);
  }
}

function start() {
  $(`#step-1`).each(function () {
    $(this).css("display", "none");
  });
  $(`#step-2`).each(function () {
    $(this).css("display", "");
  });
  $(`.step-1-clear`).each(function () {
    $(this).html("");
  });
  pickRandomImage();

  if (!IMAGES.length) {
    $("#information-text").html("No images left");
    $("#pick-button").prop("disabled", true);
    $("#random-image-div").css("display", "none");
  } else {
    $("#pick-button").prop("disabled", false);
  }
}

function reset() {
  IMAGES = [];
  loadImages();
  // var formfield = document.getElementById("step-1");
  // var oldInput = document.getElementById("imagesInput");
  // var newInput = document.createElement("input");
  // newInput.type = "file";
  // newInput.id = oldInput.id;
  // newInput.name = oldInput.name;
  // newInput.className = oldInput.className;
  // newInput.style.cssText = oldInput.style.cssText;
  // newInput.setAttribute("onchange", "loadImages();");
  // newInput.setAttribute("multiple", "true");
  // formfield.replaceChild(newInput, oldInput);
  $(`#step-1`).each(function () {
    $(this).css("display", "");
  });
  $(`#step-2`).each(function () {
    $(this).css("display", "none");
  });
  $(`.step-2-clear`).each(function () {
    $(this).html("");
  });
  document.getElementById("scores").innerHTML = "";
}

function getPlayers() {
  var formfield = document.getElementById("formfield");
  var scores = document.getElementById("scores");
  var c = 0;
  for (e of formfield.childNodes) {
    var htmlContent = `
    <div class="score-wrapper">
        ${e.value}: <span id="score${c}">0</span>
        <button
          class="btn btn-outline-success"
          onclick="modifyScore(${c}, 1)"
        >
          +
        </button>
        <button
          class="btn btn-outline-danger"
          onclick="modifyScore(${c}, -1)"
        >
          -
        </button>
      </div>`;
    var newField = document.createElement("div");
    newField.setAttribute("name", e.value);
    newField.setAttribute("class", "score-wrapper");
    newField.innerHTML = htmlContent;
    scores.appendChild(newField);
    console.log(e.value);
    c += 1;
  }
  scores.innerHTML += `
  <button
    id="pick-button"
    type="button"
    class="btn btn-outline-success btns"
    onclick="pickRandomImage();"
  >
    Next
  </button>
  <button
    id="reset-button"
    type="button"
    class="btn btn-outline-danger btns"
    onclick="reset();"
  >
    Reset
  </button>`;
}

window.onload = loadImages();
