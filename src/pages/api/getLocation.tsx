import axios from 'axios';

const GetLocation = async (req, res) => {
    try {
        const { address } = req.body;

        console.log(address,'ADDRESS')

         const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${address})}&key=AIzaSyBfeD60EqbUHeAdl7eLmAekqU4iQBKtzVk`);
         const data = await response.json();

        if (!response.ok) {
            throw new Error('Failed to fetch data from Google Places API');
        }
       
        if (data.results && data.results.length > 0) {
            // Extract latitude and longitude coordinates
            const { lat, lng } = data.results[0].geometry.location;

            res.status(200).json({ latitude: lat, longitude: lng });
          }
          else {
            console.log("error")
            // Handle case where no results were found
            res.status(404).json({ error: 'No results found' });
          }
    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
}

export default GetLocation