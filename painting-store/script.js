// Open Popup and Set Image
function openPopup(imageElement) {
  const popup = document.getElementById("imagePopup");
  const popupImage = document.getElementById("popupImage");

  popupImage.src = imageElement.src; // Set the image source
  popup.style.display = "flex"; // Show the popup
}

// Close Popup Function
function closePopup() {
  document.getElementById("imagePopup").style.display = "none";
}

// Close popup when clicking outside the content (not the image)
window.addEventListener("click", function (event) {
  const popup = document.getElementById("imagePopup");
  const popupContent = document.querySelector(".popup-content");

  // If clicking outside the popup content, close it
  if (event.target === popup) {
      closePopup();
  }
});

