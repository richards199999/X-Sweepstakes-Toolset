// X Interaction Collector
let usernames = new Map();
let processedCells = new Set();
let observer;

function updateCounter() {
    let counterElement = document.getElementById('username-counter');
    if (!counterElement) {
        counterElement = document.createElement('div');
        counterElement.id = 'username-counter';
        counterElement.style.position = 'fixed';
        counterElement.style.top = '10px';
        counterElement.style.right = '10px';
        counterElement.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        counterElement.style.color = 'white';
        counterElement.style.padding = '10px';
        counterElement.style.borderRadius = '5px';
        counterElement.style.zIndex = '9999';
        document.body.appendChild(counterElement);
    }
    counterElement.textContent = `Collected Usernames: ${usernames.size}`;
}

function processUserCell(cell) {
    if (processedCells.has(cell)) return;
    
    try {
        // Target the specific structure for @ usernames
        let usernameElement = cell.querySelector('div.css-175oi2r.r-1awozwy.r-18u37iz.r-1wbh5a2 div.css-175oi2r.r-1wbh5a2.r-dnmrzs a[role="link"] div[dir="ltr"] > span');
        
        if (usernameElement) {
            let fullUsername = usernameElement.textContent.trim();
            let username = fullUsername.startsWith('@') ? fullUsername.substring(1) : fullUsername;
            
            if (username) {
                // Check for "Follows you" tag and store as 1 or 0
                let followsYou = cell.querySelector('div[data-testid="userFollowIndicator"]') !== null ? 1 : 0;
                
                if (!usernames.has(username)) {
                    console.log(`Added new username: ${username}, Follows you: ${followsYou}`);
                }
                usernames.set(username, followsYou);
                updateCounter();
            }
        } else {
            console.log('Could not find username in cell:', cell.innerHTML);
        }
        processedCells.add(cell);
    } catch (error) {
        console.error('Error processing user cell:', error);
    }
}

function startCollecting() {
    if (observer) {
        observer.disconnect();
    }

    const primaryColumn = document.querySelector('div[data-testid="primaryColumn"]');
    if (!primaryColumn) {
        console.error('Could not find the primary column. Make sure you are on the correct Twitter page.');
        return;
    }

    observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'childList') {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        let cells = node.querySelectorAll('[data-testid="UserCell"]');
                        cells.forEach(processUserCell);
                    }
                });
            }
        });
    });

    observer.observe(primaryColumn, { childList: true, subtree: true });

    // Process existing cells within the primary column
    primaryColumn.querySelectorAll('[data-testid="UserCell"]').forEach(processUserCell);

    console.log('Started collecting usernames. Scroll to load more.');
    updateCounter();
}

function stopCollecting() {
    if (observer) {
        observer.disconnect();
        console.log('Stopped collecting usernames.');
    }
}

function exportToCSV() {
    try {
        let csvContent = "data:text/csv;charset=utf-8,username,follows_you\n" + 
            Array.from(usernames).map(([username, followsYou]) => `${username},${followsYou}`).join("\n");
        let encodedUri = encodeURI(csvContent);
        let link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "twitter_usernames.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        console.log(`Exported ${usernames.size} usernames to CSV.`);
    } catch (error) {
        console.error('Error in exportToCSV:', error);
    }
}

// Instructions for use
console.log(`
Welcome to the X Interaction Collector!

Instructions:
1. Make sure you're on the X page showing likes, retweets, or comments.
2. Run startCollecting() to begin collecting usernames.
3. Scroll through the page to load more interactions.
4. When finished, run stopCollecting() to stop the collection process.
5. Run exportToCSV() to download the list.

Troubleshooting:
- If the script doesn't start, ensure you're on the correct X page.
- Check the console for any error messages.
`);