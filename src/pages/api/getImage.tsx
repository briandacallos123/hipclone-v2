import axios from 'axios';

const GetImage = async (req, res) => {
  try {
    const { image } = req.body;

    // Fetch the image from the URL
    const response = await axios({
      url: image,
      method: 'GET',
      responseType: 'arraybuffer' // Important: Get the response as an array buffer
    });

    // Get the content type from the response headers
    const contentType = response.headers['content-type'];

    // Convert the response data to a buffer
    const buffer = Buffer.from(response.data, 'binary');

    // Set the appropriate Content-Type header
    res.setHeader('Content-Type', contentType);

    // Send the image buffer as the response
    res.status(200).send(buffer);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export default GetImage;
