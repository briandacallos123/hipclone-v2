import axios from 'axios';

const GetLocation = async (req, res) => {
    try {
        const { latitude, longitude } = req.body;

       console.group(latitude,longitude,'HOYYYYYYYYYYY')

         const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=AIzaSyBfeD60EqbUHeAdl7eLmAekqU4iQBKtzVk`);
         const data = await response.json();

        if (!response.ok) {
            throw new Error('Failed to fetch data from Google Places API');
        }
        console.log(data,'DATAAAAAAAAAAAAAAAAAA')
       
        if (data.results && data.results.length > 0) {
            const add = data?.results[0].formatted_address

            res.status(200).json({address:add});
          }
          else {
            res.status(404).json({ error: 'No results found' });
          }
    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
}

export default GetLocation