# Personal Website Backend
This project is the backend server for a personal website. It's built with Express.js and includes various features like a GraphQL API, file upload, image resizing, and CORS configuration.

## Features

**GraphQL API**: This server supports a GraphQL API, which allows for efficient data fetching with the help of the 'graphql-http' library. It uses a schema defined in the ./schema file, and resolvers found in the ./resolvers file.

**File Upload**: It allows file uploads through the /api/upload endpoint. The uploaded files are temporarily stored in the ./uploads directory.
Image Resizing: It also supports image resizing through the /api/resize endpoint. You can pass the filename, width, and height parameters in the request body to resize an image.

**CORS Configuration**: The server is configured to allow cross-origin requests from specific domains: http://localhost:8000 and https://codyc.xyz.
