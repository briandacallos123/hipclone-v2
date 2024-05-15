import fs from 'fs';
import path from 'path';

export default (req, res) => {
  if (req.method === 'POST') {
    try {
      const { time, apptID } = req.query;

      // Create a JSON object containing the time and apptID
      const responseData = {
        time,
        apptID,
      };

      // Send the response JSON object including time and apptID
      res.status(200).json({ status: 'success', message: 'Email sent', data: responseData });
    } catch (error) {
      console.error('Error sending email:', error);
      res.status(500).json({ status: 'error', message: 'Failed to send email' });
    }
  } else if (req.method === 'GET') {
    try {
      const { time, apptID } = req.query;

      // Create a JSON object containing the time and apptID
      const responseData = {
        time,
        apptID,
      };

      // Send the response JSON object including time and apptID
      res.status(200).json({ status: 'success', data: responseData });
    } catch (error) {
      console.error('Error handling GET request:', error);
      res.status(500).json({ status: 'error', message: 'Failed to handle GET request' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};
