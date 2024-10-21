import axios from 'axios';

const GetImageBase64 = async (req, res) => {
  try {
    const { image } = req.body;

    if (!image) {
      return res.status(400).json({ error: 'Image URL is required' });
    }

    console.log('Fetching image from URL:', image); // Log the image URL

    // Fetch the image from the URL
    const response = await axios({
      url: image,
      method: 'GET',
      responseType: 'arraybuffer', // Important: Get the response as an array buffer
    });

    const contentType = response.headers['content-type'];
    const base64 = Buffer.from(response.data, 'binary').toString('base64');

    res.status(200).json({
      image: `data:${contentType};base64,${base64}`, // Return the Base64 image
    });
  } catch (err) {
    console.error('Error fetching image:', err.message);
    res.status(500).json({ error: `Failed to fetch image: ${  err.message}` });
  }
};

export default GetImageBase64;
