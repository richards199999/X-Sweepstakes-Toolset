# X Sweepstakes Toolset

This toolset helps manage X (formerly Twitter) sweepstakes by collecting user interactions and selecting winners.

## Components

1. **Interaction Collector** (`interaction_collector.js`)
   - Collects usernames from X interaction pages (likes, retweets, comments)
   - Tracks if users follow the account
   - Exports data to CSV

2. **Weighted Randomizer** (`randomizer.html`)
   - Web-based tool for selecting winners from collected data
   - Allows weighting based on follow status
   - Provides a user-friendly interface for running the sweepstakes

## Usage

### Interaction Collector

1. Open X in your browser
2. Navigate to the interaction page (likes, retweets, or comments)
3. Open the browser console and paste the `interaction_collector.js` code
4. Run `startCollecting()` to begin
5. Scroll through interactions to collect data
6. Run `stopCollecting()` when finished
7. Use `exportToCSV()` to download the data

### Weighted Randomizer

1. Open `randomizer.html` in a web browser
2. Upload the CSV file exported from the Interaction Collector
3. Set the number of winners and follow weight
4. Click "Select Winners" to choose and display results

## Notes

- Ensure you comply with X's terms of service and relevant sweepstakes regulations
- The toolset should be used responsibly
