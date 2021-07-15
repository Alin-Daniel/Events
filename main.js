// https://mocki.io/fake-json-api

const API_LINK = "https://mocki.io/v1/1c8521c3-fcbf-4d88-aaec-2aa5185fb11a";

function loadJSON(callback) {
    const xhr = new XMLHttpRequest();
    xhr.overrideMimeType("application/json");
    xhr.open("GET", API_LINK, true);

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            callback(xhr.responseText);
        }
    };
    xhr.send(null);
}

function init() {
    loadJSON(function (response) {

        const data = JSON.parse(response);
        data.events.forEach(eventObj => {
            const event = new Event(eventObj.title, eventObj.date, eventObj.description, eventObj.type, eventObj.details).getEvent();
            event.renderElements();
        });
    });
}



class Event {
    constructor(title, date, description, type, props) {
        this.title = title;
        this.date = date;
        this.description = description;
        this.type = type;
        this.props = props;
        this.hookId = "list";

    }

    getEvent() {
        if (this.type === "webinar") {
            return new Webinar(this.title, this.date, this.description, this.props);
        } else if (this.type === "liveEvent") {
            return new LiveEvent(this.title, this.date, this.description, this.props);
        } else if (this.type === "party") {
            return new Party(this.title, this.date, this.description, this.props);
        }

    }

    // this could have been outsourced in a specialized class
    // but I kept things simple

    createElement(tag, cssClasses, attributes) {
        const tagEl = document.createElement(tag);

        if (cssClasses) {
            tagEl.className = cssClasses;
        }

        if (attributes && attributes.length > 0) {
            for (const attr of attributes) {
                tagEl.setAttribute(attr.name, attr.value);
            }
        }

        document.getElementById(this.hookId).append(tagEl);

        return tagEl;
    }
}

class Webinar extends Event {
    constructor(title, date, description, props) {
        super(title, date, description);
        this.link = props.link;
    }

    renderElements() {
        const li = this.createElement("li", "events--list mb--xs");
        li.innerHTML = `
            <div class="event--title mb--sm">
                <h2 class="mb--xs event--title-heading">${this.title}</h2>
                <span class="event--date">${new Date(this.date).toLocaleString()}</span>
            </div>
            <hr class="mb--sm" />
            <p class="mb--sm">${this.description}</p>
            <a class="mb--xs" href=${this.link}>Learn more about this event</a>
        `;

    }

}

class LiveEvent extends Event {
    constructor(title, date, description, props) {
        super(title, date, description);
        this.location = props.location;
        this.address = props.address;
    }

    renderElements() {

        const li = this.createElement("li", "events--list mb--xs");
        li.innerHTML = `
            <div class="event--title mb--sm">
                <h2 class="mb--xs event--title-heading">${this.title}</h2>
                <span class="event--date">${new Date(this.date).toLocaleString()}</span>
            </div>
            <hr class="mb--sm" />
            <p class="mb--sm">${this.description}</p>
            <p><strong>Address: </strong></p>
            <p>${this.location}</p>
            <p class="mb--xs">${this.address}</p>
        `;

    }
}

class Party extends Event {
    constructor(title, date, description, props) {
        super(title, date, description);
        this.theme = props.theme;
    }

    renderElements() {

        const li = this.createElement("li", "events--list mb--xs");
        li.innerHTML = `
            <div class="event--title mb--sm">
                <h2 class="mb--xs event--title-heading">${this.title}</h2>
                <span class="event--date">${new Date(this.date).toLocaleString()}</span>
            </div>
            <hr class="mb--sm" />
            <p class="mb--sm">${this.description}</p>
            <p><strong>Event type: </strong> ${this.theme}</sppan>
        `;

    }
}

init();
