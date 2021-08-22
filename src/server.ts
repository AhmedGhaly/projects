import express from 'express';
import bodyParser from 'body-parser';
import { StatusCodes } from 'http-status-codes';
import { filterImageFromURL, deleteLocalFiles, validate_URL } from './util/util';

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;

  // Use the body parser middleware for post requests
  app.use(bodyParser.json());
 /**************************************************************************** */
  app.get('/filteredimage', async (req: express.Request, res: express.Response) => {
    if (!req.query || !req.query.image_url) {
      return res.status(StatusCodes.BAD_REQUEST).send("image_url query does not exist")
    }

    const image_Url: string = req.query.image_url
    if (!validate_URL(image_Url)) {
      return res.status(StatusCodes.BAD_REQUEST).send("image_Url is not a valid image URL")
    }

    const image_file = await filterImageFromURL(image_Url)
    res.sendFile(image_file)

    res.on('finish', () => {
      deleteLocalFiles()
    })
  })

  // Root Endpoint
  // Displays a simple message to the user
  app.get("/", async (req: express.Request, res: express.Response) => {
    res.send("try GET /filteredimage?image_url={{}}")
  });


  // Start the Server
  app.listen(port, () => {
    console.log(`server running http://localhost:${port}`);
    console.log(`press CTRL+C to stop server`);
  });
})();
