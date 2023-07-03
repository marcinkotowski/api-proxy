# API Proxy

![api](https://github.com/marcinkotowski/api-proxy/assets/105087767/b4ad6c8e-c2e9-45ce-ba2c-a91c83c71942)

Server is listening for a callback from the SimpleBook API. It then sends booking details to the TTLock API to generate a passcode. <br />
The passcode, along with its ID, is attached in the booking comment, and it is sent to the client's email address.
