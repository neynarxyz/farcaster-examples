from flask import Flask, render_template
import requests
import os

# Initialize the Flask application
app = Flask(__name__)


@app.route("/")
def main_app():
    api_key = "YOUR_API_KEY_HERE"
    evm_channel = {
        "name": "EVM",
        "parent_url": "chain://eip155:1/erc721:0x37fb80ef28008704288087831464058a4a3940ae",
        "image": "https://warpcast.com/~/channel-images/evm.png",
        "channel_id": "evm",
        "lead_fid": 3621,
    }

    url = "https://api.neynar.com/v2/"
    url += "farcaster/feed?feed_type=filter&filter_type=parent_url"
    url += f"&parent_url={evm_channel['parent_url']}&limit=25"
    headers = {"accept": "application/json", "api_key": api_key}

    # get data from Neynar API, parse, then render template
    response = requests.get(url, headers=headers)
    data = response.json()

    # parse data
    parser = lambda cast: {"fid": cast["author"]["fid"], "text": cast["text"]}
    parsed_data = list(map(parser, data["casts"]))
    parsed_data = [cast for cast in parsed_data if cast["text"] not in ["", None]]

    return render_template("index.html", data=parsed_data)


# Run the application
if __name__ == "__main__":
    app.run(debug=True)
