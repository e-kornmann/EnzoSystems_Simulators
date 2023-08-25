## Creating the .env file: 
1. Make a copy of the template.env file
2. Define passwords for the host and device user accounts, use the correct bcrypt tool to generate hashes and store the hashes in the DEVICE_PASSWORD and HOST_PASSWORD properties. Use single quotes.
3. Generate a HS256 secret and store a base64 in the JWT_SECRET property. Use singel quotes.
