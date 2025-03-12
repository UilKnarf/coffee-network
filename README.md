# Coffee Social Network

This is a full-stack web application designed to connect coffee enthusiasts. Users can create accounts, post images and captions related to coffee, like posts, comment, and search for nearby coffee shops using the Google Maps Places API.

## Features

* **User Authentication:**
    * Local authentication (email/password)
    * Google OAuth authentication
* **Post Management:**
    * Create, view, and like coffee-related posts
    * Image uploads with Cloudinary integration
* **Commenting:**
    * Users can comment on posts
* **Coffee Shop Search:**
    * Integration with Google Maps Places API to search for nearby coffee shops
    * Display search results on a map with markers and info windows
* **Responsive Design:**
    * The application is designed to be responsive and work on various devices.

## Improvements (Ongoing)

* **Profile Pictures (In Progress):** We are actively working on implementing user profile pictures, which will allow users to upload and display their own images, enhancing user profiles and personalization.
* **Enhanced Coffee Shop Search:** The search functionality in `map.js` has been improved to include radius and type filtering, providing more precise and relevant search results. We are continuing to explore ways to further refine and enhance this feature.
* **Further Enhancements:** We are continually seeking to improve the Coffee Social Network. Future enhancements may include:
    * **Advanced Filtering and Sorting:** Implementing more granular filtering and sorting options for posts and search results.
    * **Real-time Chat:** Adding a real-time chat feature for users to connect and discuss coffee-related topics.
    * **User Notifications:** Implementing user notifications for likes, comments, and other interactions.
    * **Mobile Responsiveness Improvements:** Further optimizing the application for various mobile devices.

## Technologies Used

* **Backend:**
    * Node.js
    * Express.js
    * MongoDB (with Mongoose)
    * Passport.js (for authentication)
    * Cloudinary (for image storage)
    * bcrypt (for password hashing)
    * Multer (for file uploads)
* **Frontend:**
    * EJS (Embedded JavaScript templates)
    * JavaScript
    * Google Maps Places API
    * HTML/CSS

## Setup Instructions

1.  **Clone the Repository:**

    ```bash
    git clone [repository-url]
    cd coffee-social-network
    ```

2.  **Install Dependencies:**

    ```bash
    npm install
    ```

3.  **Set Up Environment Variables:**
    * Create a `.env` file in the `config` directory.
    * Add the following environment variables:

    ```
    DB_STRING=[your-mongodb-connection-string]
    GOOGLE_CLIENT_ID=[your-google-client-id]
    GOOGLE_CLIENT_SECRET=[your-google-client-secret]
    CLOUD_NAME=[your-cloudinary-cloud-name]
    API_KEY=[your-cloudinary-api-key]
    API_SECRET=[your-cloudinary-api-secret]
    ```

    * Replace the placeholder values with your actual credentials.

4.  **Set Up Google Maps API:**
    * Enable the Places API in your Google Cloud Console.
    * Obtain an API key and add it to your frontend JavaScript files (where you initialize the map).

5.  **Run the Application:**

    ```bash
    npm start
    ```

6.  **Access the Application:**
    * Open your browser and navigate to `http://localhost:[your-port]` (default port is often 7000).

## Authentication Middleware

* `isAuthenticated` and `ensureAuth` are used to protect routes that require authentication.
* `ensureGuest` is used to protect routes that should only be accessible to non-authenticated users.

## Cloudinary Integration

* Cloudinary is used for image storage and delivery.
* The `cloudinary.js` file configures the Cloudinary API.
* Multer is used to handle file uploads.

## Google Maps Integration

* The Google Maps Places API is used to search for coffee shops.
* The `map.js` file handles the map initialization and search functionality.

## Contributing

Contributions are welcome! Please feel free to submit pull requests or create issues.