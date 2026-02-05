import 'https://unpkg.com/@streamerbot/client@1.12.2/dist/streamerbot-client.js';

////////////////
// PARAMETERS //
////////////////

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);

const sbServerAddress = urlParams.get("address") || "127.0.0.1";
const sbServerPort = urlParams.get("port") || "8080";

/////////////
// OPTIONS //
/////////////

const mode = urlParams.get('mode') || 'horizontal'; // horizontal or vertical
const maxEvents = parseInt(urlParams.get('maxEvents')) || 3; // number of events to show
const showTopDonor = urlParams.get('showTopDonor') === 'true'; // whether to show top donor


/////////////////
// GLOBAL VARS //
/////////////////

let topDonorName = "Zatím nikdo";
let topDonorAmount = 0;

let events = ["test 100 bits", "test 25Kč", "test 10Kč"]; // array to hold recent events

////////////////
// PAGE SETUP //
////////////////

//dom elements
const horizontalContainer = document.getElementById('horizontalContainer');
const verticalContainer = document.getElementById('verticalContainer');

//set mode
if (mode === 'horizontal') {
    horizontalContainer.style.display = 'flex';
} else if (mode === 'vertical') {
    verticalContainer.style.display = 'flex';
}

/////////////////////////
// STREAMER.BOT CLIENT //
/////////////////////////

const client = new StreamerbotClient({
	host: sbServerAddress,
	port: sbServerPort,

	onConnect: (data) => {
		console.log(`Streamer.bot successfully connected to ${sbServerAddress}:${sbServerPort}`)
		console.debug(data);
		SetConnectionStatus(true);
	},

	onDisconnect: () => {
		console.error(`Streamer.bot disconnected from ${sbServerAddress}:${sbServerPort}`)
		SetConnectionStatus(false);
	}
});












///////////////////////////////////
// STREAMER.BOT WEBSOCKET STATUS //
///////////////////////////////////

// This function sets the visibility of the Streamer.bot status label on the overlay
function SetConnectionStatus(connected) {
	let statusContainer = document.getElementById("statusContainer");
	if (connected) {
		statusContainer.style.background = "#2FB774";
		statusContainer.innerText = "Connected!";
		statusContainer.style.opacity = 1;
		setTimeout(() => {
			statusContainer.style.transition = "all 2s ease";
			statusContainer.style.opacity = 0;
		}, 10);
	}
	else {
		statusContainer.style.background = "#D12025";
		statusContainer.innerText = "Connecting...";
		statusContainer.style.transition = "";
		statusContainer.style.opacity = 1;
	}
}