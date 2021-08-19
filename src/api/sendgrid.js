import sendgrid from '@sendgrid/mail';
import ky from 'ky';

sendgrid.setApiKey(process.env.SENDGRID_API_KEY);
const message = {
  from: process.env.SENDGRID_AUTHORIZED_EMAIL,
};

const handler = (req, res) => {
  try {
    if (req.method !== 'POST') {
      res.json({ message: 'try a POST!' });
    }

    let data;

    if (req.body) {
      message.to = req.body.email;
      message.subject = req.body.subject;
      message.text = req.body.text;
      message.html = req.body.text;

      data.to = req.body.email;
      data.subject = req.body.subject;
      data.text = req.body.text;
    }

    return sendgrid.send(message).then(
      () => {
        ky.post(process.env.CMS_API_ENDPOINT, {
          json: data,
          headers: {
            X_WRITE_API_KEY: process.env.CMS_API_KEY,
          },
        });
        res.status(200).json({
          message: 'success! I will send email',
        });
      },
      // eslint-disable-next-line
      (err) => {
        console.error(err);
        if (err.response) {
          return res.status(500).json({
            error: err.response,
          });
        }
      },
    );
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      error: err,
      message: 'there was an error, try again',
    });
  }
};

module.exports = handler;
