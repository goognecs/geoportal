window.onload = function() {
    var countrySelect = document.getElementById("country");
    countrySelect.addEventListener("change", function() {
      var selectedCountry = this.value;
      var citySelect = document.getElementById("city");
      citySelect.innerHTML = "";
  
      if (selectedCountry === "Poland") {
        populateDropdown(["Warsaw", "Krakow", "Gdansk"]);
      } else if (selectedCountry === "Netherlands") {
        populateDropdown(["Amsterdam", "Rotterdam", "The Hague"]);
      }
      // Add more European countries with their cities here
    });
  
    function populateDropdown(cities) {
      var citySelect = document.getElementById("city");
      for (var i = 0; i < cities.length; i++) {
        var option = document.createElement("option");
        option.text = cities[i];
        option.value = cities[i];
        citySelect.appendChild(option);
      }
    }
  };
  