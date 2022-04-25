import {runBookmarklet} from "app";

// Attach to the window to make available on page from the Browserified bundle
(window as any).runSmartcartBookmarklet = runBookmarklet;





