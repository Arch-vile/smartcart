# Smartcart

## Building

To create a bundle (`./public/smartcart-bundle.js`) for browser (with Browserify):
`npm run build`

## Running manually

The entry point is attached to the `window.runSmartcartBookmarklet` function. To run manually:

1. Go to your currently active order on [K-Ruoka](https://www.k-ruoka.fi/kauppa)
2. Copy the content of the bundle file
3. Paste the bundle to the browser's console
4. Run `window.runSmartcartBookmarklet()`

## Running bookmarklet



## Releasing

