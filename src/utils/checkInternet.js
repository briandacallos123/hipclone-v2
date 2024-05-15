const checkInternetConnectivity = async () => {
    try {
      await fetch('https://www.example.com'); // Replace with a reliable endpoint
      return true; // Internet connection is available
    } catch (error) {
      return false; // Internet connection is not available
    }
  };
  
  export default checkInternetConnectivity;