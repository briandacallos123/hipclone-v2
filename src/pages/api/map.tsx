import axios from 'axios';

const GetMap = async(req, res) =>{
  try {
    const apiKey = process.env.GOOGLE_MAP_SECRET;
    console.log(apiKey,'HAHAHA')
    const { lat, lng } = req.query;
    const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=500&type=restaurant&key=${apiKey}`;
    const response = await axios.get(url);
    console.log(url)
    const data = response.data.results;
    res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching nearby merchants:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export default GetMap