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
const maxEvents = parseInt(urlParams.get('maxEvents')) || 5; // number of events to show
// const showTopDonor = urlParams.get('showTopDonor') === 'true'; // whether to show top donor
const fontSize = urlParams.get('size') || '21'; // font size for the overlay
const kickUsername = urlParams.get("kickUsername") || ""; // Kick username for WebSocket connection (without @)
const backgroundColor = urlParams.get("backgroundColor") || "#000000"; // background color in hex format (e.g., #000000 for black)
const backgroundOpacity = urlParams.get("backgroundOpacity") || "0.5"; // background opacity as a decimal (e.g., 0.5 for 50% opacity)
const textColor = urlParams.get("textColor") || "#ffffff"; // text color in hex format (e.g., #ffffff for white)





/////////////////
// GLOBAL VARS //
/////////////////

let topDonorName = "Zatím nikdo";
let topDonorAmount = 0;
let donators = [];

// Kick-specific variables
const kickPusherWsUrl = 'wss://ws-us2.pusher.com/app/32cbd69e4b950bf97679?protocol=7&client=js&version=7.6.0&flash=false';

// Array to hold recent events
let recentEvents = [];




////////////////
// PAGE SETUP //
////////////////

// dom elements
const horizontalContainer = document.getElementById('horizontalContainer');
const verticalContainer = document.getElementById('verticalContainer');
const slider = document.querySelector('.slider');

// set font size
document.documentElement.style.setProperty("--fontSize", fontSize + "px");

// set colors
document.documentElement.style.setProperty("--textColor", textColor);

// Set the background color
const opacity255 = Math.round(parseFloat(backgroundOpacity) * 255);
let hexOpacity = opacity255.toString(16);
if (hexOpacity.length < 2) {
	hexOpacity = "0" + hexOpacity;
}
let background = `${backgroundColor}${hexOpacity}`;
document.documentElement.style.setProperty("--background", background);

// set mode
if (mode === 'horizontal') {
    horizontalContainer.style.display = 'flex';
} else if (mode === 'vertical') {
    verticalContainer.style.display = 'flex';
}

updateSliderAnimation();

// Observe changes to the slider content and update animation accordingly
const observer = new MutationObserver(() => {
	updateSliderAnimation();
});

// Start observing the slider for changes in its child elements
if (slider) {
	observer.observe(slider, { childList: true, subtree: true });
}

// Update animation on window resize to recalculate transforms
window.addEventListener('resize', () => {
	updateSliderAnimation();
});





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

client.on('StreamElements.Tip', (response) => {
	console.debug(response.data);
	StreamElementsTipHandler(response.data);
});

client.on('Twitch.Follow', (response) => {
	console.debug(response.data);
	TwitchFollowHandler(response.data);
});

client.on('Twitch.Cheer', (response) => {
	console.debug(response.data);
	TwitchCheerHandler(response.data);
});

client.on('Twitch.Sub', (response) => {
	console.debug(response.data);
	TwitchSubHandler(response.data);
});

client.on('Twitch.ReSub', (response) => {
	console.debug(response.data);
	TwitchResubHandler(response.data);
});

client.on('Twitch.GiftSub', (response) => {
	console.debug(response.data);
	TwitchGiftSubHandler(response.data);
});

client.on('Twitch.GiftBomb', (response) => {
	console.debug(response.data);
	TwitchGiftBombHandler(response.data);
});

client.on('Twitch.Raid', (response) => {
	console.debug(response.data);
	TwitchRaidHandler(response.data);
});

client.on('YouTube.SuperChat', (response) => {
	console.debug(response.data);
	YouTubeSuperChatHandler(response.data);
});

client.on('YouTube.SuperSticker', (response) => {
	console.debug(response.data);
	YouTubeSuperStickerHandler(response.data);
});

client.on('YouTube.NewSponsor', (response) => {
	console.debug(response.data);
	YouTubeNewSponsorHandler(response.data);
});

client.on('YouTube.GiftMembershipReceived', (response) => {
	console.debug(response.data);
	YouTubeMembershipGiftHandler(response.data);
});

client.on('YouTube.NewSubscriber', (response) => {
	console.debug(response.data);
	YouTubeNewSubscriberHandler(response.data);
});

client.on('Kick.Follow', (response) => {
	console.debug(response.data);
	KickFollowHandler(response.data);
});

client.on('Kick.Subscription', (response) => {
	console.debug(response.data);
	KickSubscriptionHandler(response.data);
});

client.on('Kick.Resubscription', (response) => {
	console.debug(response.data);
	KickResubscriptionHandler(response.data);
});

client.on('Kick.GiftSubscription', (response) => {
	console.debug(response.data);
	KickGiftSubscriptionHandler(response.data);
});

client.on('Kick.MassGiftSubscription', (response) => {
	console.debug(response.data);
	KickMassGiftSubscriptionHandler(response.data);
});




///////////////////////////
// KICK PUSHER WEBSOCKET //
///////////////////////////

// Connect and handle Pusher WebSocket
async function KickConnect() {
	if (!kickUsername)
		return;

	// Channel to subscribe to (you'll need the correct channel name here)
	const kickIds = await GetKickIds(kickUsername);
	const chatroomId = kickIds.chatroomId;
	const channelId = kickIds.channelId;

	const websocket = new WebSocket(kickPusherWsUrl);

	// Reconnect
	websocket.onclose = function () {
		console.log(`Reconnecting to ${kickUsername}...`);
		setTimeout(connectPusher, 5000);
	};

	websocket.onopen = function () {
		console.log(`Kick successfully conntected to ${kickUsername}.`);
	}

	websocket.onmessage = function (response) {
		try {
			let data = JSON.parse(response.data);

			console.debug(data);

			// When connection is established, subscribe to a channel
			if (data.event === 'pusher:connection_established') {
				const socketData = JSON.parse(data.data);
				console.log(`[Pusher] Socket established with ID: ${socketData.socket_id}`);

				// Now subscribe to a channel
				websocket.send(JSON.stringify({ event: 'pusher:subscribe', data: { channel: `chatroom_${chatroomId}` } }));
				websocket.send(JSON.stringify({ event: 'pusher:subscribe', data: { channel: `chatrooms.${chatroomId}` } }));
				websocket.send(JSON.stringify({ event: 'pusher:subscribe', data: { channel: `chatrooms.${chatroomId}.v2` } }));
				websocket.send(JSON.stringify({ event: 'pusher:subscribe', data: { channel: `predictions-channel-${chatroomId}` } }));
				websocket.send(JSON.stringify({ event: 'pusher:subscribe', data: { channel: `channel_${channelId}` } }));
				console.log(`[Pusher] Sent subscription request to channel: ${chatroomId}`);
			}

			// Event handlers
			const eventArgs = JSON.parse(data.data);
			const event = data.event.split('\\').pop();
			switch (event) {
				case 'StreamHostEvent':
					KickStreamHostHandler(eventArgs);
					break;
				case 'KicksGifted':
					KickKicksGiftedHandler(eventArgs);
					break;
			}
		}
		catch (error) {
			console.error(error);
		}
	}
}

// Try connect when window is loaded
window.addEventListener('load', KickConnect);





///////////////
// EVENT BAR //
///////////////

function calculateSliderTransform() {
	if (!slider) return null;
	
	const container = document.getElementById('verticalEventBar');
	if (!container) return null;
	
	const containerWidth = container.offsetWidth;
	const sliderWidth = slider.scrollWidth;
	
	if (sliderWidth <= containerWidth) {
		return { start: '0%', end: '0%' };
	}
	
	const endPercent = -(sliderWidth / containerWidth) * 100;
	
	return { start: '100%', end: `${endPercent}%` };
}

function updateSliderAnimation() {
	if (!slider) return;
	
	const transform = calculateSliderTransform();
	if (!transform) return;
	
	slider.style.setProperty('--start-transform', transform.start);
	slider.style.setProperty('--end-transform', transform.end);
	
	const container = document.getElementById('verticalEventBar');
	const containerWidth = container.offsetWidth;
	const sliderWidth = slider.scrollWidth;
	
	if (sliderWidth > containerWidth) {
		slider.style.animationPlayState = 'running';
		const distanceToTravel = containerWidth + sliderWidth;
		const pixelsPerSecond = 100;
		const duration = distanceToTravel / pixelsPerSecond;
		slider.style.animationDuration = `${duration}s`;
	} else {
		slider.style.animationPlayState = 'paused';
		slider.style.transform = 'translateX(0)';
	}
}

function updateEventSlider() {
	const slider = document.querySelector('.slider');
	if (!slider) return;
	slider.innerHTML = '';
	
	recentEvents.forEach(event => {
		const eventItem = document.createElement('div');
		eventItem.classList.add('eventItem');
		eventItem.innerText = event.text;
		slider.appendChild(eventItem);
	});

	updateSliderAnimation();
}

function updateDonators(name, amount) {
	if (donators[name]) {
		donators[name] += amount;
	}

	if (!donators[name]) {
		donators[name] = amount;
	}

	if (donators[name] > topDonorAmount) {
		updateTopDonator(name);
	}
}

function updateTopDonator(name) {
	topDonorName = name;
	topDonorAmount = donators[name];
	document.getElementById('topDonoName').innerText = topDonorName;
	document.getElementById('topDonoAmount').innerText = topDonorAmount;
}

function StreamElementsTipHandler(data) {
	const donater= data.username;
	const formattedAmount = `$${data.amount}`;
	const currency = data.currency;

	let eventText = `${donater} daroval ${formattedAmount}${currency}`;

	updateRecentEvents(eventText);
	updateDonators(donater, data.amount);
}

function TwitchFollowHandler(data) {
	let username = data.user_name;
	if (data.user_name.toLowerCase() != data.user_login.toLowerCase())
		username = `${data.user_name} (${data.user_login})`;

	let eventText = `${username} začal sledovat na Twitchi!`;

	updateRecentEvents(eventText);
}

function TwitchCheerHandler(data) {
	const username = data.user.name;
	const amount = data.bits;
	let eventText = `${username} daroval ${amount} bitů!`;
	updateRecentEvents(eventText);
}

function TwitchSubHandler(data) {
	const username = data.user.name;
	const tier = data.is_prime ? `Prime` : `Tier ${data.sub_tier/1000}`;
	let eventText =  `${username} si koupil sub! (${tier})`;
	updateRecentEvents(eventText);
}

function TwitchResubHandler(data) {
	const username = data.user.name;
	const months = data.cumulativeMonths == 1 ? "1 měsíc" : data.cumulativeMonths < 5 ? `${data.cumulativeMonths} měsíce` : `${data.cumulativeMonths} měsíců`;
	const tier = data.isPrime ? `Prime` : `Tier ${data.subTier/1000}`;
	let eventText =  `${username} obnovil sub! (${months}, ${tier})`;
	updateRecentEvents(eventText);
}

function TwitchGiftSubHandler(data) {
	const username = data.user.name;
	const recipient = data.recipient.name
	const tier = `Tier ${data.subTier/1000}`;
	let eventText =  `${username} daroval sub pro ${recipient}! (${tier})`;
	updateRecentEvents(eventText);
}

function TwitchGiftBombHandler(data) {
	const username = data.user.name;
	const total = data.total;
	const tier = `Tier ${data.sub_tier/1000}`;
	let eventText =  `${username} daroval ${total} subů! (${tier})`;
	updateRecentEvents(eventText);
}

function TwitchRaidHandler(data) {
	const username = data.from_broadcaster_user_name;
	const viewers = data.viewers;
	let eventText =  `${username} naboural s ${viewers} diváky!`;
	updateRecentEvents(eventText);
}

function YouTubeSuperChatHandler(data) {
	const username = data.user.name;
	const amount = data.amount;
	let eventText = `${username} daroval ${amount} přes SuperChat!`;
	updateRecentEvents(eventText);
}

function YouTubeSuperStickerHandler(data) {
	const username = data.user.name;
	const amount = data.amount;
	let eventText = `${username} daroval SuperSticker: ${amount}!`;
	updateRecentEvents(eventText);
}

function YouTubeNewSponsorHandler(data) {
	const username = data.user.name;
	const level = data.levelName
	let eventText = `${username} se stal sponzorem na úrovni ${level}!`;
	updateRecentEvents(eventText);
}

function YouTubeMembershipGiftHandler(data) {
	const gifter = data.gifter.name;
	const recipient = data.user.name;
	let eventText = `${gifter} daroval členství pro ${recipient}! (${data.tier})`;
	updateRecentEvents(eventText);
}

function YouTubeNewSubscriberHandler(data) {
	const username = data.user.name;
	let eventText = `${username} nahofil odběr na YT!`;
	updateRecentEvents(eventText);
}

function KickFollowHandler(data) {
	const username = data.user.name;
	let eventText = `${username} hodil follow na Kicku!`;
	updateRecentEvents(eventText);
}

function KickSubscriptionHandler(data) {
	const username = data.user.name;
	let eventText = `${username} si koupil sub na Kicku!`;
	updateRecentEvents(eventText);
}

function KickResubscriptionHandler(data) {
	const username = data.user.name;
	const months = data.duration == 1 ? "1 měsíc" : data.duration < 5 ? `${data.duration} měsíce` : `${data.duration} měsíců`;
	let eventText = `${username} obnovil sub na Kicku! (${months})`;
	updateRecentEvents(eventText);
}

function KickGiftSubscriptionHandler(data) {
	const username = data.user.name;
	const recipient = data.recipient.name;
	let eventText = `${username} daroval sub pro ${recipient} na Kicku!`;
	updateRecentEvents(eventText);
}

function KickMassGiftSubscriptionHandler(data) {
	const username = data.user.name;
	const total = data.recipients.length;
	let eventText = `${username} daroval ${total} subů na Kicku!`;
	updateRecentEvents(eventText);
}

function KickStreamHostHandler(data) {
	const username = data.host_username;
	const viewers = data.number_viewers;
	let eventText = `${username} naboural s ${viewers} diváky na Kicku!`;
	updateRecentEvents(eventText);
}

function KickKicksGiftedHandler(data) {
	const username = data.sender.username;
	const amount = data.gift.amount;
	let eventText = `${username} daroval ${amount} Kicks na Kicku!`;
	updateRecentEvents(eventText);
}





//////////////////////
// HELPER FUNCTIONS //
//////////////////////

function updateRecentEvents(eventText) {
	recentEvents.unshift({ text: eventText });
	if (recentEvents.length > maxEvents) {
		recentEvents.pop();
	}
	updateEventSlider();
}

// Fetch Kick chatroom and channel IDs based on username, with retry logic for underscores/dashes
async function GetKickIds(username) {
    // First attempt with the original username
    let url = `https://kick.com/api/v2/channels/${username}`;

    try {
        let response = await fetch(url);
        if (!response.ok) {
            // Retry with underscores replaced by dashes
            const altUsername = username.replace(/_/g, "-");
            url = `https://kick.com/api/v2/channels/${altUsername}`;
            response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error ${response.status}`);
            }
        }

        const data = await response.json();
        if (data.chatroom && data.chatroom.id) {
            return { chatroomId: data.chatroom.id, channelId: data.chatroom.channel_id };
        } else {
            throw new Error("Chatroom ID not found in response.");
        }
    } catch (error) {
        console.error("Failed to fetch chatroom ID:", error.message);
        return null;
    }
}






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

