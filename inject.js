(function () {
  // Save a reference to the original XMLHttpRequest
  const originalXhr = window.XMLHttpRequest;

  // Create a new XMLHttpRequest class
  class CustomXHR extends originalXhr {
    constructor() {
      super();

      // Add event listener for `onreadystatechange`
      this.addEventListener("readystatechange", () => {
        if (this.readyState === 4 && this.status === 200) {
          try {
            // Check if the URL matches the desired endpoint
            if (this.responseURL.includes("/problems/user/")) {
              const response = JSON.parse(this.responseText);

              // Dispatch an event with the response data
              window.dispatchEvent(
                new CustomEvent("apiResponseCaptured", {
                  detail: {url: this.responseURL, data: response},
                })
              );
            }
          } catch (error) {
            console.error("Error parsing API response:", error);
          }
        }
      });
    }
  }

  // Override the global XMLHttpRequest
  window.XMLHttpRequest = CustomXHR;
})();
