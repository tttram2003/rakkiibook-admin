window.addEventListener('DOMContentLoaded', function() {
  var targetElement = document.getElementById('accordionSidebar'); // Element to load the external content into

  fetch('admin-navsidebar.html')
    .then(function(response) {
      return response.text();
    })
    .then(function(html) {
      targetElement.innerHTML = html;
    })
    .catch(function(error) {
      console.error('Error:', error);
    });
});