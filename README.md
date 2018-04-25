# CapstoneController
Controller for the UList Webapp and Mobile app.

# infrastructure
This project is built on a Node JS server making using of Express architecture to create a RESTful service. The server communicates with the mobile app as well as the website.

This project makes use of several libraries in order to abstract certain features. These libraries are listed in the package.json file and can viewed there.

## Some Significant Ones:

1. Multer: Used for image handling
2. Quagga: For barcode decoding
3. Icecat: For product information for non-book items
4. Google Books: For information based on the ISBN
5. Express Sessions: To maintain cookie based sessions

# How to run the project

Running the project requires node/npm to be installed. Following this:

"npm install" to install all the required packages followed by

"npm start" to start the server, the server runs on port 3001 by default.
